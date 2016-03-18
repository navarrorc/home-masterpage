import api = require('../../services/data-service');
import {config} from '../../services/shared';
declare var google_maps: any;

interface LocationEntry{
  Title:string,
  ldBranchCode:string,
  ldLocationAddress:string,
  ldLocationAddress1:string,
  ldLocationCity:string,
  ldLocationName:string,
  ldLocationZip:string,
  ldLocationService:string,
  ldLocationType:string,
  ldState:string,
  ldLocationMainPhone:string,
  ldLocationFax:string,
  ldLocationTollfree:string,
}

interface PhoneEntry{
  ldBranchCode:string,
  ldLocationPhone:string,
  ldPhoneType:string
}

export class InfoPanel extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {
      location: null,
      phones: []
    };
  }
  componentDidMount() {
    let abs_url = config.abs_url;
    var service = new api.DataService(abs_url);
    var listColumns = ['Title','ldBranchCode','ldLocationAddress','ldLocationAddress1','ldLocationCity','ldLocationName','ldLocationZip',
                       'ldLocationService','ldLocationType','ldState','ldLocationMainPhone','ldLocationFax','ldLocationTollfree'];
    var locationTemp:LocationEntry = null;
    var phoneTemp:PhoneEntry[] = [];

    var branchCode = "0";
    var searchTerms = window.location.search.split('?')[1].split('&'); // might be multiple search terms later...might not be too =/
    for(var i = 0; i < searchTerms.length; i++)
      if(searchTerms[i].indexOf("branchcode") > -1)
        branchCode = searchTerms[i].split('=')[1]; //cast string number back to number

    service.getListItemsWithFilter('rushnet', 'LocationTable', listColumns, 'ldBranchCode eq ' + branchCode).then((data:any)=>{

      // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
      _.map(data,(n:any)=>{
        if(branchCode == n.ldBranchCode)
          locationTemp =
            {
              Title:n.Title,
              ldBranchCode:n.ldBranchCode,
              ldLocationAddress:n.ldLocationAddress,
              ldLocationAddress1:n.ldLocationAddress1,
              ldLocationCity:n.ldLocationCity,
              ldLocationName:n.ldLocationName,
              ldLocationZip:n.ldLocationZip,
              ldLocationService:n.ldLocationService,
              ldLocationType:n.ldLocationType,
              ldState:n.ldState,
              ldLocationMainPhone:n.ldLocationMainPhone,
              ldLocationFax:n.ldLocationFax,
              ldLocationTollfree:n.ldLocationTollfree,
            };
      });

      this.setState({
          location: locationTemp
      });
    });

    service.getListItemsWithFilter('rushnet', 'LocationPhone', ['ldBranchCode','ldLocationPhone','ldPhoneType'], 'ldBranchCode eq ' + branchCode).then((data:any)=>{

      // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
      _.map(data,(n:any)=>{
        if(branchCode == n.ldBranchCode)
          phoneTemp.push(
            {
              ldBranchCode:n.ldBranchCode,
              ldLocationPhone:n.ldLocationPhone,
              ldPhoneType:n.ldPhoneType
            });
      });

      this.setState({
          phones: phoneTemp
      });
    });
  }
  createPhoneEntry(entry:PhoneEntry, index:number){
    if(entry.ldPhoneType.toUpperCase().indexOf('FAX') > -1)
      return <div key={index}><strong>{entry.ldPhoneType}:</strong> {entry.ldLocationPhone}</div>
    else
      return <div key={index}><strong>{entry.ldPhoneType}:</strong> {entry.ldLocationPhone}</div>
  }
  render(){
    if(this.state.location == null) return <div />;
    var addressLine = this.state.location.ldLocationAddress + ", " + this.state.location.ldLocationCity + ", " + this.state.location.ldState + " " + this.state.location.ldLocationZip;
    setTimeout(google_maps, 500);
    return (
      <div  className="col-xs-12 mapFlex">
        <div className="col-xs-12">
          <h1>{this.state.location.Title}</h1>
        </div>
        <div className="col-xs-12 col-md-5">
          <div id="location-details-info-panel">
            <div id="location-details-info">
              <div><strong>Address:</strong> {addressLine}</div>
              {this.state.phones.map( (phone, index) => {
                return this.createPhoneEntry(phone, index)
              })}
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-xs-offset-0 col-md-6 col-md-offset-1" style={{paddingRight:"0px", paddingLeft:"23px"}}>
          <div data-map={addressLine} className="map-container"></div>
        </div>
      </div>
    )
  }
  showComponent() {
    React.render(
      <InfoPanel />,
      document.getElementById('InfoPanel'));
  }
}
