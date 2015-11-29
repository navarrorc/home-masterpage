import {PressCoverageReader} from './PressCoverageReader';
import {NewsFeed} from '../services/NewsFeed';

declare var $: any;


/*Parent Component*/
class NewsItems extends React.Component<any, any> {
  constructor(props:any){
    super(props);
    // this.state = {items: []}; // setting initial state
  }
  componentWillMount() {
    // fetch data here
  }
  render() {
    return (
      <div id="news-stories" className="col-xs-4 col-md-3">
        <h1 className="yellow">News</h1>
        {this.props.items.map( (post, index ) => {
            return (
              <Post key={index}
               name={post.title}
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

/*Child and Parent Component */
class Post extends React.Component<any,any> {
  constructor(props:any){
    super(props);
  }
  render() {
    var _pubDate = new Date(this.props.pubDate),
                  _month = _pubDate.getMonth() + 1;
    var currentDate = new Date(); // current date
    var isCurrentMonth = (_month === currentDate.getMonth()+1);
    return (
      <div>
        <p className="news-link">
          <Link pubDate={this.props.pubDate} index={this.props.index} name={this.props.name} link={this.props.link}/>
          { isCurrentMonth ? <NewTag /> : null}
        </p>
      </div>
    );
  }
}

/*Child Component, Leaf*/
class Link extends React.Component<any,any>{
  constructor(props:any){
    super(props);
  }
  render() {
    var _pubDate = new Date(this.props.pubDate),
        _month = _pubDate.getMonth() + 1, // return from 0 to 11
        _day = _pubDate.getDate();
    return (
      <span className="title-wrap">
        <a href={this.props.link} target="_blank" >{_month}/{_day} {this.props.name}</a>
      </span>
    );
  }
}

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

class NewsImages extends React.Component<any, any> {
  constructor(props:any){
    super(props);
    this.state = {items: []}; // setting initial state
    // this.foo = 42;
    //this.props.imgUrl = 'https://rushenterprises.sharepoint.com/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/Page-Layouts/images/newsCarousel.png';
    //props.age = 32;
   //props.name = 'Roberto';

  }
  render() {
    var generateImage = function(image, index){
      return (
        <img className="news-image" src={image} alt="Rusty"></img>
      )
    }
    var generateRotatorNav = function(image, index){
      if(index === 0) {
        // first image
        return (
          <a href="">
            <i className="icon icon-circle-full"></i>
          </a>
        )
      } else {
        return (
          <a href="">
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
        <img src="/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/img/news-rotator-active-arrow.png" id="news-rotator-active-arrow"></img>
      </div>
    )
  }
}


/*Main App Component*/
export class NewsCarousel extends React.Component<any, any> {
  // images = [
  //   '/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/img/rusty.jpg',
  //   '/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/img/rusty.jpg',
  //   '/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/img/rusty.jpg',
  //   // '/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/img/rusty.jpg',
  //   // '/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/img/rusty.jpg',
  // ];
  //
  // // name={post.title}
  // // pubDate={post.publishDate}
  // // link={post.link}
  // // index={index}
  //
  // newsStories = [
  //   {
  //     title: 'A message from a Chairman 10/3 A message from a Chairman1',
  //     publishDate: new Date(),
  //     link: '#'
  //   },
  //   {
  //     title: 'A message from a Chairman 10/3 A message from a Chairman2',
  //     publishDate: new Date(),
  //     link: '#'
  //   },
  //   {
  //     title: 'A message from a Chairman 10/3 A message from a Chairman3',
  //     publishDate: new Date(),
  //     link: '#'
  //   }
  // ];
  constructor(props:any){
    super(props);
    this.state = { items: [], images: [] }; // setting initial state
  }
  componentWillMount() {
    var newsStories = [];
    var images = []
    var news = new NewsFeed();
    news.getSearchResults('Rush Article').then((data:any[])=>{

      //console.log(JSON.stringify(data,null,4));
      data.map((article, index)=>{
        // console.log(article);
        newsStories.push({
          title: article.title,
          publishDate: article.pubStartDate,
          link: article.url
        });
        var imageString = article.image;
        // console.log(imageString);
        var myRegexp = /src="((?:[A-Za-z0-9-._~!$&'()*+?/,;=:@]|%[0-9a-fA-F]{2})*(?:(?:[A-Za-z0-9-._~!$&'()*+,;=:@]|%[0-9a-fA-F]{2})*)*)/g;
        var match = myRegexp.exec(imageString);
        console.log(match);
        var imageUrl = match[1];
        images.push(imageUrl);
        console.log(imageUrl);
      })

      this.setState({
        items: newsStories,
        images: images
      })
    })


  }
  render() {
    // console.log(JSON.stringify(this.state.items,null,4));
    // console.log(JSON.stringify(this.state.images,null,4));
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
