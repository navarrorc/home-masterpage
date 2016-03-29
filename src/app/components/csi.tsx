import {DataService} from '../services/data-service'

/*Parent Component*/
class Image extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  render() {
    return(
      <div className="panel clearfix" style={{height:"352px"}}>
        <h1>Customer Satisfaction Index</h1>
        <div className="">          
          <div className="content">          
            <img src={this.props.item.imageURL} 
                  style={{maxWidth:"none"}}>
            </img>
          </div>
        </div>
       </div>
      );
  }
}

/*Main App Component*/
export class CSI extends React.Component<any, any> {
  constructor(props:any){
    super(props);
    this.state = { item:{} }; // setting initial state

  }
  componentWillMount(){
    var columns = [
      'Publish_x0020_Start_x0020_Date',
      'Publish_x0020_End_x0020_Date',
      'EncodedAbsUrl'
    ];
    var today = new Date();
    var filter = `((Publish_x0020_Start_x0020_Date le datetime'${today.toISOString()}') 
                  and (Publish_x0020_End_x0020_Date ge datetime'${today.toISOString()}' 
                  or Publish_x0020_End_x0020_Date eq null))`; // today >= start-date AND (today <= end-date OR end-date == null) 
    var service = new DataService();
    service.getListItemsWithFilter('rushnet','CSI', columns, filter).then((data:any[])=>{
      //console.log(JSON.stringify(data,null,4));          
      var activeImage = {};            
      
      // Get the first item data[0], the list should only have one Active item but we cannot be too sure about that
      let start = new Date(data[0].Publish_x0020_Start_x0020_Date),
          end = data[0].Publish_x0020_End_x0020_Date?new Date(data[0].Publish_x0020_End_x0020_Date):null;
      activeImage = {
        start: start,
        end: end,
        imageURL: data[0].EncodedAbsUrl
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
      <CSI />,
      document.getElementById('csi')
    );
  }
}
