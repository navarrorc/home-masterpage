import {getQueryStringValue} from '../services/shared';
import {DataService} from '../services/data-service';
import {config} from '../services/shared';

/*Parent Component*/
class Preview extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }

  render() {
    let title = this.props.article.title;
    let date = moment(this.props.article.createdOn).format('MMMM DD, YYYY');
    let content = this.props.article.content;
    function createMarkup() { return {__html: content}; };
    let style = {
      marginRight: '5px'
    }
    let style2 = {
      paddingLeft: '26px',
      paddingTop: '20px'
    }
    let style3 = {
      paddingBottom: '21px'
    }
    return (
      <div className="container">
        <div className="col-xs-12">
          <h1>
            <div style={style3}>
              {title}
            </div>
          </h1>
          <div>
          <div className="article-date-wrap">
            <div className="article-date" style={style}>{date}</div>
            <div className="article-date" style={style}>Author: John Doe</div>
            <div className="article-date" style={style}>Category: News</div>
          </div>
          </div>
        </div>
        <article className="news-article col-xs-12 col-md-8 large-first-character">
          <div style={style2} dangerouslySetInnerHTML={createMarkup()} />
        </article>
        <div className="col-xs-12 col-md-4">
          <h4>Latest News</h4>
          <div className="panel top-border blog-link-list">
          </div>
          <h4>Article Contacts</h4>
          <div className="panel top-border wide-gutters"></div>
        </div>
      </div>
    )
  }
}

/*Main App Component*/
export class PreviewArticle extends React.Component<any, any> {
  constructor(props:any){
    super(props);
    this.state = {article: {}}; // setting initial state
  }
  componentWillMount() {
    let articleId = getQueryStringValue('articleId');
    //let abs_url = config.abs_url;
    let service = new DataService();
    let fields = [
      'Id',
      'Title',
      'Created',
      'PublishingPageContent'
    ]
    let tempObject = {};
    service.getSingleListItem('authoring/communications', 'Pages',fields, articleId).then((data:any)=>{
      // console.log('data',data);
      tempObject = {
        id: data.Id,
        title: data.Title,
        createdOn: data.Created,
        content: data.PublishingPageContent
      }
      this.setState({article: tempObject});
    })
  }
  componentDidMount() {
  }
  render() {
    return (
      <div>
        <Preview article={this.state.article} />
      </div>
    );
  }
  showComponent() {
    React.render(
      <PreviewArticle />,
      document.getElementById('ArticleContent')
    );
  }
}
