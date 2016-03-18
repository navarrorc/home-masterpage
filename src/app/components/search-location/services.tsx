import api = require('../../services/data-service');
import {config} from '../../services/shared';

interface ServiceEntry{
  ldBranchCode:string,
  ldLocationService0:string
}

export class ServicePanel extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {
      columnOne: [],
      columnTwo: [],
      columnThree: []
    };
  }
  componentDidMount() {
    let abs_url = config.abs_url;
    var service = new api.DataService(abs_url);
    var listColumns = ['ldBranchCode','ldLocationService0'];
    var tempOne:ServiceEntry[] = [];
    var tempTwo:ServiceEntry[] = [];
    var tempThree:ServiceEntry[] = [];

    var branchCode = "0";
    var searchTerms = window.location.search.split('?')[1].split('&'); // might be multiple search terms later...might not be too =/
    for(var i = 0; i < searchTerms.length; i++)
      if(searchTerms[i].indexOf("branchcode") > -1)
        branchCode = searchTerms[i].split('=')[1]; //cast string number back to number

    service.getListItemsWithFilter('rushnet', 'LocationService', listColumns, 'ldBranchCode eq ' + branchCode).then((data:any)=>{

      // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
      _.map(data,(n:any, index:number)=>{
        if(index % 3 == 1)
          tempOne.push(
            {
              ldBranchCode:n.ldBranchCode,
              ldLocationService0:n.ldLocationService0
            });
        else if(index % 3 == 2)
          tempTwo.push(
            {
              ldBranchCode:n.ldBranchCode,
              ldLocationService0:n.ldLocationService0
            });
        else if(index % 3 == 0)
          tempThree.push(
            {
              ldBranchCode:n.ldBranchCode,
              ldLocationService0:n.ldLocationService0
            });
      });

      this.setState({
        columnOne: tempOne,
        columnTwo: tempTwo,
        columnThree: tempThree
      });
    });
  }
  createserviceColumn(services:ServiceEntry[]){
    return (
      <div className="col-xs-4">
    		{services.map( (data, index) => {
          return this.createServiceEntry(data, index)
        })}
    	</div>
    )
  }
  createServiceEntry(entry:ServiceEntry, index:number){
      return <p key={index}>{entry.ldLocationService0}</p>
  }
  render(){
    return (
      <div id="location-details-link-list" className="row margin-bottom-30">
        {this.createserviceColumn(this.state.columnOne)}
        {this.createserviceColumn(this.state.columnTwo)}
        {this.createserviceColumn(this.state.columnThree)}
      </div>
    )
  }
  showComponent() {
    React.render(
      <ServicePanel />,
      document.getElementById('services'));
  }
}
