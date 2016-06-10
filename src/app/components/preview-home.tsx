//import {getQueryStringValue} from '../services/shared';
import {DataService} from '../services/data-service';
//import {config} from '../services/shared';

/*Parent Component*/
class ArticleList extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }

  render() {
    let root_url = '/sites/authoring/communications/preview/Pages/preview.aspx?articleId='
    let generateList = function(data, index) {
      let path = root_url + data.id;
      let style = {
        paddingBottom: '10px',
        marginLeft: '20px',
      }
      return (
        <li style={style}>
          {index+1} <a href={path}>
            {data.title}
          </a> {data.createdOn.format('MMMM Do YYYY, h:mm:ss a')}
        </li>
      )
    }
    return (
      <div id="the-list">
        <ul>
          {this.props.list.map(generateList,this)}
        </ul>
      </div>
    )
  }
}

/*Main App Component*/
export class PreviewHome extends React.Component<any, any> {
  isMore:boolean;
  items;
  constructor(props:any){
    super(props);
    this.isMore=true;
    this.items = [];
    this.state = {articleList: []}; // setting initial state

  }
  
  processResults() {
    let temp = [];
    let totalItems = this.items.length; 
    console.log(`total items ${totalItems}`)
    let sortedList = [];

    _.map(this.items,(article:any, index)=>{
      temp.push({
        id: article.Id,
        title: article.Title,
        createdOn: moment(article.Created),
        file: article.FileLeafRef
      })
    })

    sortedList = _.sortBy(temp, (a:any)=>{
      return a.createdOn;
    }).reverse();
    //console.log(JSON.stringify(this.items,null,4));
    this.setState({articleList: sortedList});
       
  }
  
  processNextLink(values:any[], nextLink:string) {
    _.each(values, (o)=>{ this.items.push(o); })

    if(nextLink) {
      //console.log('getting more data');
      let service = new DataService();     
      service.getListItemsWithPagingLink(nextLink).then((nextData:any)=>{
          this.processNextLink(nextData.values, nextData.nextLink);
        })
    } else { 
      //console.log('total items: ',this.items.length);
      this.processResults();
    }    
  }  
  
  componentWillMount() {
    //let abs_url = config.abs_url
    let service = new DataService();
    let fields = [
      'Id',
      'FileLeafRef',
      'Title',
      'Created'
      // 'PublishingPageContent'
    ]
    //let theList = [];
    //let sortedList = [];
    
    service.getListItemsWithPaging('authoring/communications', 'Pages', fields).then((data:any)=>{
      this.processNextLink(data.values, data.nextLink);      
    })    
    
    
    // service.getListItemsTop200('authoring/communications', 'Pages',fields).then((data:any)=>{
    //   //console.log(JSON.stringify(data,null,4));

    //   _.map(data,(article:any, index)=>{
    //         theList.push({
    //           id: article.Id,
    //           title: article.Title,
    //           createdOn: moment(article.Created),
    //           file: article.FileLeafRef
    //         })
    //   })

    //   sortedList = _.sortBy(theList, (a)=>{
    //     return a.createdOn;
    //   }).reverse();
    //   // console.log(JSON.stringify(theList,null,4));
    //   this.setState({articleList: sortedList});
    //   // this.setState({
    //   //   articleList: theList
    //   // });
    // })

  }
  componentDidMount() {
  }
  render() {

    return (
      <div>        
        <ArticleList list={this.state.articleList} />
      </div>
    );
  }
  showComponent() {
    React.render(
      <PreviewHome />,
      document.getElementById('ArticleList')
    );
  }
}
