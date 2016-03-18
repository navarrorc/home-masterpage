import {DataService} from '../services/data-service'
import {config} from '../services/shared';

/*Parent Component*/
class Image extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  render() {
    return(
      <div className="panel clearfix" style={{height:"352px"}}>
        	<h1>Strategic Initiatives</h1>
        <div className="">          
          <div className="content">          
            <a href={this.props.item.articleURL} style={{borderBottom:"none"}}>
              <img src={this.props.item.imageURL} style={{maxWidth:"none"}}></img>
            </a>            
          </div>
        </div>
       </div>
      );
  }
}

/*Main App Component*/
export class KnowRush extends React.Component<any, any> {
  constructor(props:any){
    super(props);
    this.state = { item:{} }; // setting initial state

  }
  componentWillMount(){
    var columns = [
      'Publish_x0020_Start_x0020_Date',
      'Publish_x0020_End_x0020_Date',
      'EncodedAbsUrl',
      'ArticleURL'
    ];
    var today = new Date();
    var filter = "((Publish_x0020_Start_x0020_Date le datetime'" + today.toISOString() + 
                  "') and (Publish_x0020_End_x0020_Date ge datetime'" + today.toISOString() +
                  "' or Publish_x0020_End_x0020_Date eq null))"; // today >= start-date AND (today <= end-date OR end-date == null) 
    let abs_url = config.abs_url;
    var service = new DataService(abs_url);
    service.getListItemsWithFilter('rushnet','GetToKnowRushEnterprises', columns, filter).then((data:any[])=>{
      //console.log(JSON.stringify(data,null,4));          
      var activeImage = {};            
      
      // Get the first item data[0], the list should only have one Active item but we cannot be too sure about that
      let start = new Date(data[0].Publish_x0020_Start_x0020_Date),
          end = data[0].Publish_x0020_End_x0020_Date?new Date(data[0].Publish_x0020_End_x0020_Date):null;
      activeImage = {
        start: start,
        end: end,
        imageURL: data[0].EncodedAbsUrl,
        articleURL: data[0].ArticleURL
      }  
      //console.log(JSON.stringify(activeImage,null,4));
      this.setState({
        item: activeImage
      })
    });
  }
  render() {
    return (
        <div>
            <Image item={this.state.item}  />          
        </div>
    );
  }
  showComponent() {
    React.render(
      <KnowRush />,
      document.getElementById('knowRush')
    );
  }
}
