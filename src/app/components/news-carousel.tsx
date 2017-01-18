import * as React from 'react';
import { render } from 'react-dom';
import {PressCoverageReader} from './press-coverage-reader';
import {NewsFeed} from '../services/news-feed';
import helpers = require('./helpers');

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
    //console.log('inside handleHover');
    var $this = $(this),
        //index = this.$anchors.index($this),
        index = $this[0].props.index,
        $active_link = $links.eq(index),
        top = $active_link.position().top + ($active_link.height() / 2) - ($arrow.height() / 2);

    //console.log('index', index);
    //console.log($this[0].props.index);
    //console.log($active_link);

    if (index != 5){
      // not the 'View All' Link
      $links.removeClass('active').eq(index).addClass('active');
      //$anchors.find('.icon').removeClass('icon-circle-full').addClass('icon-circle-empty');
      //$anchors.eq(index).find('.icon').toggleClass('icon-circle-empty icon-circle-full');
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
      // news article is considered NEW if it's less or equal to 7 days old
    }

    var month_day = (month)? month + '/' + day : null;

    if (this.props.index === 0){
      // First Post, the .active class needs to be added
      return (
        <div>
          <p className="news-link active" onMouseEnter={this.handleHover.bind(this)}  >
            <Link index={this.props.index} name={this.props.name} link={this.props.link} />
            <span style={{fontWeight: 'bold'}}>{month_day}</span> { isNew ? <NewTag /> : null}
          </p>
        </div>
      )
    }

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
    let name = this.props.name;
    return (
      <span className="title-wrap">
        <a href={this.props.link} title={this.props.name} id={name==='View All'?'view_all':''}> {this.props.name}</a>
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
    var generateImage = function(image:string, index){
      return (
        <Image source={image} key={index} index={index} />
      )
    } 
    return (
      <div id="images-rotator" className="col-xs-8 col-md-6">
        <div id="images-rotator-images" className="row">
          {this.props.images.map(generateImage, this)}
        </div>        
        <img src="/sites/rushnet/_catalogs/masterpage/_Rushnet/img/news-rotator-active-arrow.png" id="news-rotator-active-arrow"></img>
      </div>
    )
  }
}

/*Child Component of NewsImages*/
class Image extends React.Component<any, any> {
  constructor(props:any) {
    super(props);
  }
  render() {
    let index = this.props.index;
    let image = this.props.source;
    if(index===0) {
      // first image only
      if (image.includes('<iframe')) {
        return (
          <div className="news-image show"  dangerouslySetInnerHTML={{__html: image}} />
        )
      }
      return (
        <div className="news-image show" style={{
          backgroundImage: `url(${image})`
        }}></div>
      )
    } else {
      if (image.includes('<iframe')) {          
        return (
          <div className="news-image" dangerouslySetInnerHTML={{__html: image}} />
        )
      }        
      return (
        <div className="news-image" style={{
          backgroundImage: `url(${image})`
        }}></div>
      )
    }
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
    //news.getSearchResults('Corporate Article').then((data:any[])=>{
    news.getSearchResults('Corporate Article OR Video OR Audio').then((data:any[])=>{
      data.map((article, index)=>{
        let isMultimedia = false;

        // Check for Video Article
        const regex = /<iframe .*><\/iframe>/g;
        const html = article.html;        
        let m, iframe;
        while ((m = regex.exec(html)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
              let smallerIframe = match.replace('640', '100%'); // setting width to 100%
              smallerIframe = smallerIframe.replace('360', '100%');
              
              //smallerIframe = smallerIframe.replace('<iframe', '<iframe class="audio" ');
              
              iframe = smallerIframe;
            });
        }
        if (iframe){ 
          // audio or video article found
          isMultimedia = true;
        }   
        
        newsStories.push({
          title: article.title,
          byLine: article.byLine,
          publishDate: article.pubStartDate,
          link: article.url
        });

        var imageString = article.image;
        var myRegexp = /src="((?:[A-Za-z0-9-._~!$&'()*+/,;=:@]|%[0-9a-fA-F]{2})*(?:(?:[A-Za-z0-9-._~!$&'()*+,;=:@\[\]]|%[0-9a-fA-F]{2})*)*)/g;
        var match = myRegexp.exec(imageString);
        var imageUrl = match[1];
        isMultimedia ? images.push(iframe) : images.push(imageUrl);
      })

      // Adding the View All link
      newsStories.push({
        title: 'View All',
        byLine: 'View All',
        publishDate: null,
        link: '/sites/newshub/company-news',
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
    let interval_links = setInterval(()=>{
      if (helpers.isMounted(this)){
        if ($('#view_all').length) {
          //console.log('#view_all is ready!');
          $images = $('#images-rotator-images .news-image');
          $anchors = $('#images-rotator-nav a');
          $arrow = $('#news-rotator-active-arrow');          
          $links = $('#news-stories .news-link');
          // console.log('$images:', $images);
          clearInterval(interval_links);

          /**
           * TODO: Good start for dynamic carousel 
           */
          // let total = $images.size();
          // console.log('total', total);
          // let index = 0;
          // let $image;
          // $images.eq(index).toggleClass('hide show');
          // let interval = setInterval( ()=> {
          //   $image = $images.eq(index);
          //   $images.removeClass('show').addClass('hide'); 
          //   $image.toggleClass('hide show');
            
          //   $image.mouseenter(function(){
          //     console.log('mouse entered on image: ', this);
          //   });
          //   //console.log('index', index);

          //   // setTimeout(function() {
          //   //   $images.each(function(index){
          //   //     let $this = $(this);

          //   //     console.log(this);
          //   //   });
          //   // }, 2000);
          //   if (index < total-1) {
          //     index++
          //   } else {
          //     index = 0;
          //     // $images.eq(index).toggleClass('hide show');
          //   }
          //   // index < total? index++ : index = 0;
          // }, 1000)

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
    render(
      <NewsCarousel />,
      document.getElementById('news-rotator')
    );
  }
}
