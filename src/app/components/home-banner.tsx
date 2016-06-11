import * as React from 'react';
import { render } from 'react-dom';
import {DataService} from '../services/data-service'

/*Parent Component*/
class Banner extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  render() {
    let style = {
      background: `#000 url(${this.props.item.url}) no-repeat center`,
      height: 324,
      marginBottom: -60,
      marginTop: -109
    }
    return(
      <div style={style}>        
      </div>
      );
  }
}

/*Main App Component*/
export class HomeBanner extends React.Component<any, any> {
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
    let today = new Date();
    let filter = `((Publish_x0020_Start_x0020_Date le datetime'${today.toISOString()}') 
                  and (Publish_x0020_End_x0020_Date ge datetime'${today.toISOString()}' 
                  or Publish_x0020_End_x0020_Date eq null))`; // today >= start-date AND (today <= end-date OR end-date == null)    
    let service = new DataService();
    service.getListItemsWithFilter('rushnet','Home Banners', columns,filter).then((data:any[])=>{
      let activeBannerImage = {
        url: data[0].EncodedAbsUrl
      };
      
      // console.log('DATA ', JSON.stringify(data,null,4));
      this.setState({
        item: activeBannerImage
      })
    });
  }
  render() {
    return (
      <Banner item={this.state.item}  />
    );
  }
  showComponent() {
    render(
      <HomeBanner />,
      document.getElementById('home-banner')
    );
  }
}
