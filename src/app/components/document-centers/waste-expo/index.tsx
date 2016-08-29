import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DataService } from '../../../services/data-service'
import { Parent } from './parent';
import { Results } from './results';

interface ColumnValues {
    EncodedAbsUrl:string;
    Created:string;
}
/***
 * Main Component
 */
export class DocCenter_WasteExpo extends React.Component<any, any> {
    isMore:boolean = true;
    items:any = [];
    itemsPerPage:number = 50;
    temp:any = [];
    totalItems:number;
    pageNumber:number; 
    totalPages: number;
    group:any;

    constructor(props: any) {
        super(props);
        /***
         * init Class variables
         */
        // this.itemsPerPage = 50;
        // this.isMore = true;
        // this.items = []; // init array
        this.state = { 
            totalItems:0, 
            totalPages:0,
            page:0,
            items:{},             
            ready:false, 
            onClick:this.onClick, 
            onClickPrev:this.onClickPrev,
            onClickNext:this.onClickNext, 
        }; 
    }
    /**
     * Events Handlers
     * Using Arrow functions to avoid having to bind 'this'
     */
    onClick = (pageNumber)=>{
        this.displayNewPage(pageNumber);
    }

    onClickPrev = (currentPage)=>{
        let previousPage = currentPage - 1;
        this.displayNewPage(previousPage);
    }

    onClickNext = (currentPage)=>{
        let nextPage = currentPage + 1;
        this.displayNewPage(nextPage);
    }

    /**
     * Methods
     */
    displayNewPage( pageNumber ) {
        // see: https://facebook.github.io/react/docs/component-api.html
        // passing a callback to setState
        this.setState({page:0}, ()=>{
            this.setState({page:pageNumber}, ()=>{
                // init the nanoGallery after setState finishes rendering the component
                this.initNanoGallery();
            });
        });
    }
    initNanoGallery() {        
        $("#nanoGallery").nanoGallery({
            thumbnailWidth: 'auto',            
            thumbnailLabel:{display:false,position:'overImageOnMiddle', align:'center'},
            viewerDisplayLogo:false,
            thumbnailLazyLoad:true,
            viewerToolbar : { style:'fullWidth' },
            locationHash: false,
            thumbnailHoverEffect:'borderLighter,imageScaleIn80',
            itemsBaseURL:'/sites/Documents/Marketing/Waste_Expo_Gallery_2016',
            supportIE8: true,
            theme:'light',
            colorScheme:'none',            
        });
    }
    processResults(page:number=1) {   
        let pageNumber = 1;
        _.each(this.items, (x:ColumnValues, index:number)=>{
            let array = x.EncodedAbsUrl.split('/');
            let fileName = array[array.length-1];
            this.temp.push({
                id: index+1,
                image: fileName
            })
        })
        /**
         * Grouping with the key being the page number
         */
        this.group = _.groupBy(this.temp, (x:any)=>{   
            let index = x.id,
                total = this.itemsPerPage;         
            return ( index%total > 0 )? pageNumber: pageNumber++;
        })

        this.totalPages = _.keys(this.group).length;
     
        this.setState({
                totalItems: this.totalItems,
                totalPages: this.totalPages,
                items: this.group,
                page,
                ready: true
        })    
        
        this.initNanoGallery();
    }

    processNextLink(values: any[], nextLink: string) {
        _.each(values, (o) => {
            this.items.push(o);
        })

        if (nextLink) {
            // console.log('getting more data');
            let service = new DataService();
            service.getListItemsWithPagingLink(nextLink).then((nextData: any) => {
                this.processNextLink(nextData.values, nextData.nextLink);
            })
        } else {
            // console.log('total items: ', this.items.length);
            this.processResults();
        }
    }

    componentWillMount() {
        let service = new DataService();
        let columns = [
            'EncodedAbsUrl',
            'Created'
        ]

        service.getListItemsWithPaging('documents/marketing', 'Waste_Expo_Gallery_2016', columns).then((data: any) => {
            // console.log(`data: ${JSON.stringify(data,null,4)}`);
            this.processNextLink(data.values, data.nextLink);
        })
  
    }
    render() {
        return <div data-current-page-number={this.state.page}>
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