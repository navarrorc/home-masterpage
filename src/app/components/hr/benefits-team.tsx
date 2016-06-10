import api = require('../../services/data-service');
import {config} from '../../services/shared';

declare var $: any;

interface member{
  name:string,
  phone:string,
  region:string,
  popup:string
}

export class BenefitsTeam extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {team: [], groupedItems:[]};
  }
  componentDidMount() {
    //let abs_url = config.abs_url;
    var service = new api.DataService();
    var listColumns = ['Title','Telephone','Region','Popup', 'Classification_List', 'Domain'];
    service.getListItems('hr', 'Benefits Team', listColumns).then((data:any)=>{
      var temp: member[] = [];

      // console.info(JSON.stringify(data));

      // group based on Classification_List
      let grouped = _.groupBy(data, 'Classification_List');
      //console.info(JSON.stringify(grouped,null,4));

      // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
      _.map(data,(n:any)=>{
        temp.push({name: n.Title, phone: n.Telephone, region: n.Region, popup: n.Popup});
        // console.log(n.Classification_List);
        //console.log(n.Domain);
      });

      this.setState({
          team: temp,
          groupedItems: grouped
      });

        // $(function () {
        //   $('[data-toggle="tooltip"]').tooltip()
        // })
    });
  }

  generateResult = (items, key)=>{
    let style = {
      fontSize: 17,
      fontWeight: 'bold',
      textDecoration: 'underline'
    }
    return <div>
      <span style={style}>{key}</span>
      <div className="benefits-contact"> 
        {_.map(items, this.getItem)}           
      </div>
    </div>
  }

  getItem = (item, index)=>{
    console.log(JSON.stringify(item,null,4));
    return <div>
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
    // var generateHelpLink = function(member:member, index:number){
    //   // return (
    //   //   <div className="benefits-contact" key={index}>
  	// 	// 		<span className="name-number">
  	// 	// 			<span className="name">{member.name}</span>
  	// 	// 			<span className="number">{member.phone}</span>
  	// 	// 		</span>
  	// 	// 		<span className="location">
    //   //       {member.popup == null || member.popup.length == 0
  	// 	// 			? <span data-toggle="tooltip" data-placement="right" title={member.popup}>{member.region}</span>
    //   //       : <a data-toggle="tooltip" data-placement="right" title={member.popup}>{member.region}</a>}
  	// 	// 		</span>
  	// 	// 	</div>
    //   // );
    // };

    // return (
    //   <div>
    //    {this.state.team.map(generateHelpLink, this)}
    //   </div>
    // )
  }
  showComponent() {
    React.render(
      <BenefitsTeam />,
      document.getElementById('benefitsTeam'));
  }
}
