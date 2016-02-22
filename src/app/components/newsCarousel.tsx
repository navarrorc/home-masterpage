import {PressCoverageReader} from './PressCoverageReader';
import {NewsFeed} from '../services/NewsFeed';
import helpers = require('./Helpers');


declare var $: any;

var $anchors,
    $images,
    $arrow,
    $links;

/*Parent Component*/
class NewsItems extends React.Component<any, any> {

  constructor(props:any){
    super(props);
  }
  componentWillMount() {
    // $anchors = $('#images-rotator-nav a');
    // $images = $('#images-rotator-images .news-image');
    // $arrow = $('#news-rotator-active-arrow');
    // $links = $('#news-stories .news-link');
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
  handleHover(){
    var $this = $(this),
        //index = this.$anchors.index($this),
        index = $this[0].props.index,
        $active_link = $links.eq(index),
        top = $active_link.position().top + ($active_link.height() / 2) - ($arrow.height() / 2);

    //console.log('index', index);
    // console.log($this[0].props.index);
  //  console.log($active_link);

    if (index != 5){
      $links.removeClass('active').eq(index).addClass('active');

      $anchors.find('.icon').removeClass('icon-circle-full').addClass('icon-circle-empty');
      $anchors.eq(index).find('.icon').toggleClass('icon-circle-empty icon-circle-full');
      $images.removeClass('show').addClass('hide').eq(index).toggleClass('hide show');
      $arrow.css({ top: top });
    }

  }
  render() {
    var pubDate = (this.props.pubDate)? moment(new Date(this.props.pubDate)) : null;

    if (pubDate){
      var month =  pubDate.format('MM');
      var day = pubDate.format('DD');
    }
    var now = moment(new Date()); // current date
    var dayDiff = now.diff(pubDate, 'days')+1; //include the start
    let isNew = false;
    if (dayDiff <= 7) {
      isNew = true;
      // news article is considered NEW if it's 7 days old
    }

    var month_day = (month)? month + '/' + day : null;

    return (
      <div>
        <p className="news-link" onMouseEnter={this.handleHover.bind(this)}  >
          <Link index={this.props.index} name={this.props.name} link={this.props.link} />
          <span style={{fontWeight: 'bold'}}>{month_day}</span> { isNew ? <NewTag /> : null}
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
        //console.log(article.image);
        var myRegexp = /src="((?:[A-Za-z0-9-._~!$&'()*+/,;=:@]|%[0-9a-fA-F]{2})*(?:(?:[A-Za-z0-9-._~!$&'()*+,;=:@\[\]]|%[0-9a-fA-F]{2})*)*)/g;
        var match = myRegexp.exec(imageString);
        var imageUrl = match[1];
        //console.log(imageUrl);
        images.push(imageUrl);
      })

      // Adding the View All link
      newsStories.push({
        title: 'View All',
        byLine: 'View All',
        publishDate: null,
        link: 'https://rushenterprises.sharepoint.com/sites/newshub/company-news',
      })
      this.setState({
        items: newsStories,
        images: images
      })
    })
  }
  componentDidMount() {
    // having to do this due to the fact that images take more time to load and we need to wait until
    // they have been fully rendered on the page.
    var interval = setInterval(()=> {
      if (helpers.isMounted(this)){
        if ($('#images-rotator-images').length) {
          $anchors = $('#images-rotator-nav a');
          $images = $('#images-rotator-images .news-image');
          $arrow = $('#news-rotator-active-arrow');
          $links = $('#news-stories .news-link');
          // console.log('$images:', $images);
          clearInterval(interval);
        }
      }
    },1000);
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
