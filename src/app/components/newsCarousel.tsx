import {PressCoverageReader} from './PressCoverageReader';
import {NewsFeed} from '../services/NewsFeed';

declare var $: any;

/*Parent Component*/
class NewsItems extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  render() {
    return (
      <div id="news-stories" className="col-xs-4 col-md-3">
        <h1 className="yellow">News</h1>
        {this.props.items.map( (post, index ) => {
            return (
              <Post key={index}
               name= {post.byLine}
               pubDate={post.publishDate}
               link={post.link}
               index={index}
              />
            )
        })}
      </div>
    )
  }
}

/*Child and Parent Component of NewsItems*/
class Post extends React.Component<any,any> {
  constructor(props:any){
    super(props);
  }
  render() {
    var _pubDate = (this.props.pubDate)? new Date(this.props.pubDate) : null;
    if (_pubDate){
      var _month = _pubDate.getMonth() + 1,
      _day = _pubDate.getDate();
    }
    var currentDate = new Date(); // current date
    var isCurrentMonth = (_month === currentDate.getMonth()+1);

    var month_day = (_month) ?_month + '/' + _day : null;

    return (
      <div>
        <p className="news-link">
          <Link index={this.props.index} name={this.props.name} link={this.props.link}/>
          <span style={{fontWeight: 'bold'}}>{month_day}</span> { isCurrentMonth ? <NewTag /> : null}
        </p>
      </div>
    );
  }
}

/*Child Component of NewsItems*/
class Link extends React.Component<any,any>{
  constructor(props:any){
    super(props);
  }
  render() {

    return (
      <span className="title-wrap">
        <a href={this.props.link}> {this.props.name}</a>
      </span>
    );
  }
}

/*Child Component of NewsItems*/
class NewTag extends React.Component<any, any> {
  constructor(props:any) {
    super(props);
  }
  render() {
    var spanStyle = {
      marginRight: '5px'
    }
    return(
        <span className="new-tag" style={spanStyle}>New</span>
    )
  }
}

/*Parent Component*/
class NewsImages extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  render() {
    var generateImage = function(image, index){
      return (
        <img key={index} className="news-image" src={image} alt=""></img>
      )
    }
    var generateRotatorNav = function(image, index){
      if(index === 0) {
        // first image only
        return (
          <a key={index} href="">
            <i className="icon icon-circle-full"></i>
          </a>
        )
      } else {
        return (
          <a key={index} href="">
            <i className="icon icon-circle-empty"></i>
          </a>
        )
      }
    }
    return (
      <div id="images-rotator" className="col-xs-8 col-md-6">
        <div id="images-rotator-images" className="row">
          {this.props.images.map(generateImage, this)}
        </div>
        <div id="images-rotator-nav">
          {this.props.images.map(generateRotatorNav, this)}
        </div>
        <img src="/sites/rushnet/_catalogs/masterpage/_Rushnet/img/news-rotator-active-arrow.png" id="news-rotator-active-arrow"></img>
      </div>
    )
  }
}


/*Main App Component*/
export class NewsCarousel extends React.Component<any, any> {
  constructor(props:any){
    super(props);
    this.state = { items: [], images: [] }; // setting initial state
  }
  componentWillMount() {
    var newsStories = [];
    var images = []
    var news = new NewsFeed();
    news.getSearchResults('Corporate Article').then((data:any[])=>{
      data.map((article, index)=>{
        newsStories.push({
          title: article.title,
          byLine: article.byLine,
          publishDate: article.pubStartDate,
          link: article.url
        });
        var imageString = article.image;
        var myRegexp = /src="((?:[A-Za-z0-9-._~!$&'()*+?/,;=:@]|%[0-9a-fA-F]{2})*(?:(?:[A-Za-z0-9-._~!$&'()*+,;=:@]|%[0-9a-fA-F]{2})*)*)/g;
        var match = myRegexp.exec(imageString);
        var imageUrl = match[1];
        images.push(imageUrl);
      })

      //TODO: fix this, temporary for now
      newsStories.push({
        title: 'View All',
        byLine: 'View All',
        publishDate: null,
        link: 'https://rushenterprises.sharepoint.com/sites/newshub',
      })
      this.setState({
        items: newsStories,
        images: images
      })
    })
  }
  render() {
    return (
      <div>
        <NewsItems items={this.state.items} />
        <NewsImages images={this.state.images} />
        <PressCoverageReader />
      </div>
    );
  }
  showComponent() {
    React.render(
      <NewsCarousel />,
      document.getElementById('news-rotator')
    );
  }
}
