import {getQueryStringValue} from '../services/shared';
import {DataService} from '../services/data-service';

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
  constructor(props:any){
    super(props);
    this.state = {articleList: []}; // setting initial state

  }
  componentWillMount() {
    let service = new DataService();
    let fields = [
      'Id',
      'FileLeafRef',
      'Title',
      'Created'
      // 'PublishingPageContent'
    ]
    let theList = [];
    let sortedList = [];
    service.getListItemsTop200('authoring/communications', 'Pages',fields).then((data:any)=>{
      //console.log(JSON.stringify(data,null,4));

      _.map(data,(article:any, index)=>{
            theList.push({
              id: article.Id,
              title: article.Title,
              createdOn: moment(article.Created),
              file: article.FileLeafRef
            })
      })

      sortedList = _.sortBy(theList, (a)=>{
        return a.createdOn;
      }).reverse();
      // console.log(JSON.stringify(theList,null,4));
      this.setState({articleList: sortedList});
      // this.setState({
      //   articleList: theList
      // });
    })

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
