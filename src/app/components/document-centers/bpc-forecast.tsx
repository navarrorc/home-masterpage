import * as React from 'react';
import * as Q from 'q';
import { render } from 'react-dom';
import {DataService} from '../../services/data-service'
import { fileImages } from '../../services/shared';
declare var unescape:any;

/*Parent Component*/
class Parent extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  render() {
    let totalItems = this.props.totalItems;
    let ready = this.props.ready;
    let groupedItems = this.props.groupedItems;
    return(
      <div>
        <Results totalItems={totalItems} ready={ready} groupedItems={groupedItems} />
      </div>
      );
  }
}

/*Child Component*/
class SearchBox extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  render() {    
    return(
      <div>
      </div>
      );
  }
}

/*Child Component*/
class Results extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  componentWillMount(){
    //console.log('all good');
  }
  render() {
    
    let getItem = function(item, index) {
      let pieces = item.name.split('.');
      //console.log(pieces);
      let fileExtension = pieces[pieces.length-1];
      //console.log(fileExtension);
      // let fileImages = [
      //   {key: 'pdf', value:'/_layouts/15/images/icpdf.png'},
      //   {key: 'docx', value:'_layouts/15/images/icdocx.png'},
      //   {key: 'xlsx', value: '_layouts/15/images/icxlsx.png'},
      //   {key: 'pptx', value: '/_layouts/15/images/icpptx.png'},
      //   {key: 'xlsm', value: '/_layouts/15/images/icxlsm.png'}
      // ]      
      
      let imageUrl;
      _.each(fileImages, (i)=>{
        if (i.key === fileExtension){
          imageUrl = i.value;
        }
      })
      
      let fullName = unescape(item.name);
      let fileUrl = unescape(item.url);
      //console.log(item);
      return (
        <div className="document-accordion-group">
          <div>
            <img style={{position:'relative', top:5, marginRight:2}} src={imageUrl}></img>
              <a href={fileUrl} target="_blank">{fullName}</a>
          </div>          
        </div>
      )
    }
    
    let generateResult = function(items, key) {
      let sortedItems = _.orderBy(items,['created'],['desc']);
      // console.log(`sortedItems ${JSON.stringify(sortedItems,null,4)}`);
      //console.log(key);
      return (
        <div className="col-xs-6">
          <div className="document-accordion">
            <div className="document-accordion-link">
              {`${key}(${sortedItems.length})`} <i className="icon icon-arrow-down"></i>
            </div>
            {_.map(sortedItems,getItem)}
          </div>
        </div>
      )
    }
    
    let totalItems = this .props.totalItems;
    let ready = this.props.ready;
    let groupedItems = this.props.groupedItems; 
    return(      
      <div>
     		<h2 className="margin-bottom-30">Documents {(totalItems)?`(${totalItems})`:''}</h2>
        <h3>All Documents</h3>
        <div style={{textAlign:'center'}}>
          <i className="fa fa-spinner fa-pulse" style={{display: ready? 'none': 'inline-block', textAlign: 'center', width: '1.28571429em', fontSize: '3em'}}></i>
          <span style={{display:'block'}}>{ready? '': 'Working on it...'}</span>
        </div>
        <div className="row margin-bottom-20">
          {_.map(groupedItems, generateResult)}    
        </div>    
      </div>
      );
  }
}

/*Main App Component*/
export class DocCenter_BPCForecast extends React.Component<any, any> {
  isMore:boolean;
  items;
  //count:number;
  constructor(props:any){
    super(props);
    this.isMore=true;
    this.items = [];
    this.state = { items:[], groupedItems:[], ready: false }; // setting initial state

  } 

  processResults() {
      let temp = [];
      let totalItems = this.items.length;
      
      
      this.items.forEach((item, index)=>{
        let arr = item.EncodedAbsUrl.split('/');
        let itemName = arr[arr.length-1];
        temp.push({
          name: itemName,
          label: 'label',
          group: 'group',
          classificationName: 'Forecast Workbooks',
          created: new Date(item.Created),
          url: item.EncodedAbsUrl
        });
      });
      
      // let sorted = _.sortByOrder(temp, ['name'], ['asc']);      
      let grouped = _.groupBy(temp, 'classificationName');

      //console.log(JSON.stringify(grouped,null,4));      

      this.setState({
        totalItems: totalItems,
        groupedItems: grouped,
        ready: true
      })  
      
      
      //let classificationMap = [];
      // let unique = _.uniq(this.items, (x:any)=>{
      //   return x.Classification.TermGuid;
      // })
      //let count = 0;
      
      // _.each(unique, (x, index)=>{
      //   this.getName(x.Classification.TermGuid).then( (name)=> {
      //     classificationMap.push({
      //       key: x.Classification.TermGuid,
      //       value: name
      //     })
          
      //     count++;
      //     if (count === unique.length) {            
      //       this.items.forEach((item, index)=>{
      //         let arr = item.EncodedAbsUrl.split('/');
      //         let itemName = arr[arr.length-1];
      //         let className;
              
      //         _.map(classificationMap, (x)=>{
      //           if ( x.key === item.Classification.TermGuid) {
      //             className = x.value;
      //           }
      //         })
              
      //         temp.push({
      //           name: itemName,
      //           label: item.Classification.Label,
      //           group: item.Group,
      //           // classificationName: getName(item.Classification.TermGuid),
      //           classificationName: className,
      //           created: item.Created,
      //           url: item.EncodedAbsUrl
      //         });
              
      //         // if (index == totalItems - 1) {
      //           let sorted = _.sortByOrder(temp, ['classificationName'], ['asc']);
      //           let grouped = _.groupBy(sorted, 'classificationName');
      //           /***Ready to setState ***/
      //           this.setState({
      //             totalItems: totalItems,
      //             groupedItems: grouped,
      //             ready: true
      //           })  
      //         // } 
      //       })            
      //     } 
      //   })       
      // })   
  }
  
  processNextLink(values:any[], nextLink:string) {
    _.each(values, (o)=>{ this.items.push(o); })

    if(nextLink) {
      console.log('getting more data');
      let service = new DataService();     
      service.getListItemsWithPagingLink(nextLink).then((nextData:any)=>{
          this.processNextLink(nextData.values, nextData.nextLink);
        })
    } else { 
      console.log('total items: ',this.items.length);
      this.processResults();
    }    
  }
  
  getName(id) {
    let deferred = Q.defer();
    let service = new DataService();    
    service.getTermName(id).then((name)=>{
      deferred.resolve(name);
    }, function(error) {
      deferred.reject(`error! ${JSON.stringify(error,null,4)}`);                    
    })
    return deferred.promise;
  }   
  
  componentWillMount(){
    let service = new DataService();
    let columns = [
      'EncodedAbsUrl',
      'Created'
    ]
    
    service.getListItemsWithPaging('documents/finance', 'BPC Forecast', columns).then((data:any)=>{
      //console.log(JSON.stringify(data,null,4)); // delete me
      this.processNextLink(data.values, data.nextLink);      
    })
  }
  render() {
    return (
        <div>
          <Parent totalItems={this.state.totalItems} ready={this.state.ready} 
            groupedItems={this.state.groupedItems}  />
        </div>
    );
  }
  showComponent() {
    render(
      <DocCenter_BPCForecast/>,
      document.getElementById('doc-results-bpcforecast')
    );
  }
}
