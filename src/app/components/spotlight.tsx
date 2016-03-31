import {DataService} from '../services/data-service'

function shorten(text, maxLength) {
    var ret = text;
    if (ret.length > maxLength) {
        ret = ret.substr(0,maxLength-3) + "...";
    }
    return ret;
}

/*Parent Component*/
class Message extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  render() {
    return(
      <div className="panel">
        <h1 style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>Policy Spotlight: {this.props.item.title}</h1>
        <p style={{marginBottom:16}}>{this.props.item.message}</p>
        <div style={{textAlign:'right'}}>
          <a href={this.props.item.url} >Read More...</a>
        </div>
      </div>
      );
  }
}

/*Main App Component*/
export class Spotlight extends React.Component<any, any> {
  constructor(props:any){
    super(props);
    this.state = { item:{} }; // setting initial state

  }
  componentWillMount(){
    var columns = [
      'Publish_x0020_Start_x0020_Date',
      'Publish_x0020_End_x0020_Date',
      'Title',
      'Message',
      'Url'
    ];
    let today = new Date();
    let filter = `((Publish_x0020_Start_x0020_Date le datetime'${today.toISOString()}') 
                  and (Publish_x0020_End_x0020_Date ge datetime'${today.toISOString()}' 
                  or Publish_x0020_End_x0020_Date eq null))`; // today >= start-date AND (today <= end-date OR end-date == null)    
    let service = new DataService();
    service.getListItemsWithFilter('rushnet','Spotlight', columns,filter).then((data:any[])=>{
      let shorten_message = shorten(data[0].Message, 215);
      let spotlight = {
        title: data[0].Title,
        message: shorten_message,
        url: data[0].Url
      };
      
      // console.log('DATA ', JSON.stringify(data,null,4));
      this.setState({
        item: spotlight
      })
    });
  }
  render() {
    return (
        <div>
          <Message item={this.state.item}  />
        </div>
    );
  }
  showComponent() {
    React.render(
      <Spotlight />,
      document.getElementById('spotlight')
    );
  }
}
