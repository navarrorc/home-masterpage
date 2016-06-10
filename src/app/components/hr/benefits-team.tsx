import api = require('../../services/data-service');
import {config} from '../../services/shared';

export class BenefitsTeam extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {groupedItems:[]};
  }
  componentDidMount() {
    var service = new api.DataService();
    var listColumns = ['Title','Telephone','Region','Popup', 'Classification_List', 'Domain'];
    service.getListItems('hr', 'Benefits Team', listColumns).then((data:any)=>{
      // console.info(JSON.stringify(data));

      let grouped = _.groupBy(data, 'Classification_List');

      //console.log(JSON.stringify(grouped, null, 4));

      this.setState({
          groupedItems: grouped
      });

    });
  }

  generateResult = (items, key)=>{
    let style = {
      fontSize: 17,
      fontWeight: 'bold',
      textDecoration: 'underline'
    }
    return <div key={key}>
      <span style={style}>{key}</span>
      <div className="benefits-contact"> 
        {_.map(items, this.getItem)}           
      </div>
    </div>
  }

  getItem = (item, index)=>{
    return <div key={index}>
        <span>{item.Domain}</span>
        <div className="benefits-contact">
        <div className="name-number">
          <span className="name">{item.Title}</span> 
          <span className="number">{item.Telephone}</span>     
        </div>
      </div>
    </div>
  }

  render(){
    let groupedItems = this.state.groupedItems;
    return <div>
      {_.map(groupedItems, this.generateResult)}
    </div>
  }
  showComponent() {
    React.render(
      <BenefitsTeam />,
      document.getElementById('benefitsTeam'));
  }
}
