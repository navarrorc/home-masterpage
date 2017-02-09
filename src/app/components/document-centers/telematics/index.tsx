import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Q from 'q'
import { DataService } from '../../../services/data-service'
import { Parent } from './parent'
import { Results } from './results'

/***
 * Main Component
 */
export class DocCenter_Telematics extends React.Component<any, any> {

    isMore: boolean
    items
   
    constructor(props: any) {

        super(props)
        this.isMore = true
        this.items = []
        
        /**
         * State Init
         */
        this.state = { items: [], groupedItems: [], ready: false }
    }

    processResults() {
        // console.log('inside processResults'); /* comment out */
        let temp = []
        let totalItems = this.items.length

        let groupMap = []
        let classificationMap = []
        let tempArray
        let groups = {}

        let unique = _.uniqBy(this.items, (x: any) => {
            return x.Group.TermGuid
        })

        let uniqueClassification = _.uniqBy(this.items, (x: any) => {
            return x.Classification.TermGuid
        })

        let count = 0

        // console.log('this.items:', JSON.stringify(this.items,null,4)); /* comment out */        

        _.each(unique, (x, index) => {
            this.getName(x.Group.TermGuid).then((name) => {
                groupMap.push({
                    key: x.Group.TermGuid,
                    value: name
                })

                count++

                if (count === unique.length) {

                    let grouped

                    _.each(this.items, (item, index) => {

                        let arr = item.EncodedAbsUrl.split('/')
                        let itemName = arr[arr.length - 1]
                        let groupName

                        _.map(groupMap, (x) => {
                            if (x.key === item.Group.TermGuid) {
                                groupName = x.value
                            }
                        })

                        temp.push({
                            name: itemName,
                            label: item.Group.Label,
                            group: item.Group,
                            groupName: groupName,
                            classification: item.Classification,
                            created: item.Created,
                            url: item.EncodedAbsUrl
                        })

                        
                        let sorted = _.orderBy(temp, ['groupName'], ['asc'])
                        grouped = _.groupBy(sorted, 'groupName')
                    }) /* _.each(this.items...) */

                    count = 0

                    _.each(uniqueClassification, (x, index) => {
                        this.getName(x.Classification.TermGuid).then((name) => {
                            classificationMap.push({
                                key: x.Classification.TermGuid,
                                value: name
                            })

                            count++
                            if (count === uniqueClassification.length) {
                                let grouped_classifications = {}

                                _.each(grouped, (group, key) => {
                                    // console.log('key (Group Name):', key);
                                    let groupName = ''
                                    let temp_obj = {}

                                    // console.log(JSON.stringify(group, null, 4)); /* comment out */
                                    let temp_classification = []
                                    _.each(group, (item: any, index) => {
                                        let name = item.name,
                                            created = item.created,
                                            url = item.url,
                                            classificationName = ''
                                        groupName = item.groupName

                                        _.map(classificationMap, (x) => {
                                            let termGuid = item.classification.TermGuid;
                                            if (x.key === termGuid) {
                                                classificationName = x.value;
                                            }
                                        })

                                        temp_classification.push(
                                            {
                                                name,
                                                groupName,
                                                created,
                                                url,
                                                classificationName
                                            }
                                        )

                                        let sorted = _.orderBy(temp_classification, ['classificationName'], ['asc'])
                                        grouped_classifications = _.groupBy(sorted, 'classificationName')

                                    }) /* _.each(group...) */

                                    // console.log(groupName,JSON.stringify(grouped_classifications, null,4)); /* comment out */
                                    groups[groupName] = grouped_classifications
                                }) /* _.each(grouped...) */

                            } /* if (count === uniqueClassification.length) */
                            this.setState({
                                totalItems: totalItems,
                                groupedItems: groups,
                                ready: true
                            })
                        })
                    })


                }
            })
        })
    } /* processResults */

    processNextLink(values: any[], nextLink: string) {

        _.each(values, (o) => {
            (o.Group) ? this.items.push(o) : null
        }) // only add objects where Classification is a valid object (the users sometimes forget to select a Classification)

        if (nextLink) {

            let service = new DataService()
            service.getListItemsWithPagingLink(nextLink).then((nextData: any) => {
                this.processNextLink(nextData.values, nextData.nextLink)
            })
        } else {
            // console.log('total items: ', this.items.length);
            this.processResults()
        }

    }

    getName(id) {
        let deferred = Q.defer();
        let service = new DataService();
        service.getTermName(id).then((name) => {
            deferred.resolve(name)
        }, function (error) {
            deferred.reject(`error! ${JSON.stringify(error, null, 4)}`)
        })
        return deferred.promise
    }

    componentWillMount() {

        let service = new DataService()

        let columns = [
            'EncodedAbsUrl',
            'Group',
            'Classification',
            'Created'
        ]

        service.getListItemsWithPaging('documents/telematics', 'Documents', columns).then((data: any) => {
            this.processNextLink(data.values, data.nextLink)
        })

    }
    render() {
        return <div>
            <Parent {...this.state}  />
        </div>
    }
    showComponent() {
        ReactDOM.render(
            <DocCenter_Telematics/>,
            document.getElementById('doc-results-telematics')
        )
    }
}
