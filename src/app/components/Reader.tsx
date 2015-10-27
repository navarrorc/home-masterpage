import {RssService} from '../services/RSS';

/*Parent Component*/
class RssItems extends React.Component<any, any> {
  constructor(props:any){
    super(props);
    this.state = { items: [] }; // setting initial state
  }
  componentWillMount() {
    var rss = new RssService();
    rss.fetch().then((data)=>{
      this.setState({
        items: data
      })
    })
  }
  render() {
    /*var scrollBars = {
      position: 'relative',
      height: '320px',
      overflowY: 'scroll'
    }*/
    return(
      <div>
        <h1 className="yellow">Press Coverage</h1>
        {this.state.items.map( (post, index ) => {
          /*console.log(JSON.stringify(post,null,4));*/
          return (
            <Post key={index}
             name={post.title}
             pubDate={post.pubDate}
             link={post.link}
             index={index}
             sourceTitle={post.source.title}
            />
          )
        })}
        <div id="press-paging"></div>
       </div>
      );
  }
}

/*Child and Parent Component */
class Post extends React.Component<any,any> {
  constructor(props:any){
    super(props);
  }
  render() {
    return (
      <p className="news-link">
        <Link pubDate={this.props.pubDate} index={this.props.index} name={this.props.name} link={this.props.link}/>
        <SourceTitle sourceTitle={this.props.sourceTitle}/>
      </p>
    );
  }
}

/*Child Component, Leaf*/
// class PubDate extends React.Component<any,any>{
//   constructor(props:any){
//     super(props);
//   }
//   render() {
//     var _date = new Date(this.props.pubDate),
//         month = _date.getMonth(),
//         day = _date.getDay();
//     var spanStyle = {
//       marginRight: '5px'
//     }
//     return (
//       <span style={spanStyle}>{month}/{day}</span>
//     );
//   }
// }

/*Child Component, Leaf*/
class Link extends React.Component<any,any>{
  constructor(props:any){
    super(props);
  }
  render() {
    var _date = new Date(this.props.pubDate),
        month = _date.getMonth() + 1, // return from 0 to 11
        date = _date.getDate();
    return (
      <span className="title-wrap">
        <a href={this.props.link} target="_blank" title={this.props.name}>{this.props.index+1} {month}/{date} {this.props.name}</a>
      </span>
    );
  }
}

/*Child Component, Leaf*/
class SourceTitle extends React.Component<any,any>{
  constructor(props:any){
    super(props);
  }
  render() {
    return (
      <span className="from">{this.props.sourceTitle}</span>
    );
  }
}

/*Main App Component*/
export class Reader extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  render() {
    return (
        <RssItems />
    );
  }
  show() {
    React.render(
      <Reader />,
      document.getElementById('press-coverage')
    );
  }
}
