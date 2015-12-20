import {PressService} from '../services/./PressCoverage';

declare var $: any;


/*Parent Component*/
class RssItems extends React.Component<any, any> {
  constructor(props:any){
    super(props);
    this.state = { items: [] }; // setting initial state
  }
  componentWillMount() {
    var rss = new PressService();
    rss.fetch().then((data)=>{
      this.setState({
        items: data
      })
    })
  }
  render() {
    return(
      <div id="press-coverage" className="col-xs-12 col-md-3">
        <h1 className="yellow">Press Coverage</h1>
        {this.state.items.map( (post, index ) => {
          /*console.log(JSON.stringify(post,null,4));*/
          return (

            <Post key={index}
             name={post.title}
             pubDate={post.publishDate}
             link={post.link}
             index={index}
             sourceTitle={post.source}
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
    var _pubDate = new Date(this.props.pubDate),
                  _month = _pubDate.getMonth() + 1,
                  _day = _pubDate.getDate();
    var currentDate = new Date(); // current date
    var isCurrentMonth = (_month === currentDate.getMonth()+1);

    var noWrap = {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
    return (
      <div>
        <p className="news-link" style={noWrap}>
          <Link index={this.props.index} name={this.props.name} link={this.props.link}/>
          <span style={{fontWeight: 'bold'}}>{_month}/{_day}</span> { isCurrentMonth ? <NewTag /> : null}
          <SourceTitle sourceTitle={this.props.sourceTitle}/>
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
    return (
      <span className="title-wrap">
        <a href={this.props.link} title={this.props.name} target="_blank" >{this.props.name}</a>
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
export class PressCoverageReader extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  render() {
    return (
        <RssItems />
    );
  }
  // show() {
  //   React.render(
  //     <PressCoverageReader id={this.props.dataId} className={this.props.dataClass} />,
  //     document.getElementById('press-coverage')
  //   );
  // }
}
