import * as React from 'react';
import { render } from 'react-dom';
import {DataService} from '../services/data-service'

/*Parent Component*/
class Image extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  render() {
    let title = this.props.item.title,
        imageURL = this.props.item.imageURL;
    return(
      <div className="panel clearfix" style={{height:"352px"}}>
        <h1>{title}</h1>
        <div className="">          
          <div className="content">          
            <img src={imageURL}></img>
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
      'EncodedAbsUrl',
      'Headline'
    ];
    var today = new Date();
    today.setHours(0,0,0,0); // get rid of the hours, minutes, seconds and milliseconds
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
        title: data[0].Headline,
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
    render(
      <CSI />,
      document.getElementById('csi')
    );
  }
}
