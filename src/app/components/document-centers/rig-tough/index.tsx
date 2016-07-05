import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Q from 'q';
import { DataService } from '../../../services/data-service'
import { Parent } from './parent';
import { Results } from './results';

/***
 * Main Component
 */
export class DocCenter_RigTough extends React.Component<any, any> {
    isMore: boolean;
    items;
    //count:number;
    constructor(props: any) {
        super(props);
        this.isMore = true;
        this.items = [];
        this.state = { items: [], groupedItems: [], ready: false }; // setting initial state
    }

    processResults() {
        let temp = [];
        let totalItems = this.items.length;

        let classificationMap = [];
        let tempArray;

        let unique = _.uniqBy(this.items, (x: any) => {
            return x.Classification.TermGuid;
        })
        let count = 0;

        // console.log(`unique`, JSON.stringify(unique,null,4));

        _.each(unique, (x, index) => {
            this.getName(x.Classification.TermGuid).then((name) => {
                classificationMap.push({
                    key: x.Classification.TermGuid,
                    value: name
                })

                count++;
                if (count === unique.length) {
                    this.items.forEach((item, index) => {
                        let arr = item.EncodedAbsUrl.split('/');
                        let itemName = arr[arr.length - 1];
                        let className;

                        _.map(classificationMap, (x) => {
                            if (x.key === item.Classification.TermGuid) {
                                className = x.value;
                            }
                        })

                        temp.push({
                            name: itemName,
                            label: item.Classification.Label,
                            group: item.Group,
                            classificationName: className,
                            created: item.Created,
                            url: item.EncodedAbsUrl
                        });

                        // if (index == totalItems - 1) {
                        let sorted = _.orderBy(temp, ['classificationName'], ['asc']);
                        let grouped = _.groupBy(sorted, 'classificationName');
                        /***Ready to setState ***/
                        this.setState({
                            totalItems: totalItems,
                            groupedItems: grouped,
                            ready: true
                        })
                        // } 
                    })
                }
            })
        })
    }

    processNextLink(values: any[], nextLink: string) {
        _.each(values, (o) => {
            (o.Classification) ? this.items.push(o) : null;
        }) // only add objects where Classification is a valid object (the users sometimes forget to select a Classification)

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
    
    // componentDidMount(){
    //     $("#docPreview").dialog({
    //         autoOpen: false,
    //         show: "blind",
    //         hide: "explode"
    //     });
    // }

    componentWillMount() {
        let service = new DataService();
        let columns = [
            'EncodedAbsUrl',
            'Group',
            'Classification',
            'Created'
        ]

        service.getListItemsWithPaging('documents/marketing', 'Rig Tough', columns).then((data: any) => {
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
            <DocCenter_RigTough/>,
            document.getElementById('doc-results-rigtough')
        );
    }
}
