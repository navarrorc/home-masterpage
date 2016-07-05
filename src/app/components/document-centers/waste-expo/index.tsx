import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Q from 'q';
import { DataService } from '../../../services/data-service'
import { Parent } from './parent';
import { Results } from './results';

declare var $:any;

/***
 * Main Component
 */
export class DocCenter_WasteExpo extends React.Component<any, any> {
    isMore: boolean;
    items;
    //count:number;
    constructor(props: any) {
        super(props);
        this.isMore = true;
        this.items = [];
        this.state = { totalItems: 0, items: [], ready: false }; // setting initial state
    }

    processResults() {
        let temp = [];
        let totalItems = this.items.length;

        _.each(this.items, (x, index)=>{
            let array = x.EncodedAbsUrl.split('/');
            let fileName = array[array.length-1];
            temp.push({
                title: x.Title,
                imageName: fileName
            })
        })

        // console.log('before setting state');        
        this.setState({
                totalItems: totalItems,
                items: temp,
                ready: true
        })
        // console.log('after setting state');
        
        // console.log('before initiating nanoGallery');       
        // initiate nanoGallery
        $("#nanoGallery").nanoGallery({
            thumbnailWidth: 'auto',            
            thumbnailLabel:{display:false,position:'overImageOnMiddle', align:'center'},
            viewerDisplayLogo:false,
            thumbnailLazyLoad:true,
            viewerToolbar : { style:'fullWidth' },
            locationHash: false,
            thumbnailHoverEffect:'borderLighter,imageScaleIn80',
            itemsBaseURL:'https://rushnetrcn.sharepoint.com/sites/Documents/Marketing/PublishingImages/',
            supportIE8: true
        });
        // console.log('after initiating nanoGallery'); 
    }

    processNextLink(values: any[], nextLink: string) {
        _.each(values, (o) => {
            this.items.push(o);
        })

        if (nextLink) {
            console.log('getting more data');
            let service = new DataService();
            service.getListItemsWithPagingLink(nextLink).then((nextData: any) => {
                this.processNextLink(nextData.values, nextData.nextLink);
            })
        } else {
            console.log('total items: ', this.items.length);
            this.processResults();
        }
    }

    getName(id) {
        let deferred = Q.defer();
        let service = new DataService();
        service.getTermName(id).then((name) => {
            // console.log(name);
            
            deferred.resolve(name);
        }, function (error) {
            deferred.reject(`error! ${JSON.stringify(error, null, 4)}`);
        })
        return deferred.promise;
    }

    componentWillMount() {
        let service = new DataService();
        let columns = [
            'EncodedAbsUrl',
            'Title',
            // 'Group',
            // 'Classification',
            'Created'
        ]

        service.getListItemsWithPaging('documents/marketing', 'Images', columns).then((data: any) => {
            // console.log(`data: ${JSON.stringify(data,null,4)}`);
            this.processNextLink(data.values, data.nextLink);
        })
  
    }
    render() {
        return <div>
                <Parent {...this.state}  />
            </div>
    }
    showComponent() {
        ReactDOM.render(
            <DocCenter_WasteExpo/>,
            document.getElementById('waste-expo-gallery')
        );
    }
}