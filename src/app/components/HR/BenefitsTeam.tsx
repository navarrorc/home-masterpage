import api = require('../../services/DataService');

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
    this.state = {team: []};
  }
  componentDidMount() {
    var service = new api.DataService();
    var listColumns = ['Title','Telephone','Region','Popup'];
    service.getListItems('hr', 'Benefits Team', listColumns).then((data:any)=>{
      var temp: member[] = [];

      console.info(JSON.stringify(data));

      // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
      _.map(data,(n:any)=>{
        temp.push({name: n.Title, phone: n.Telephone, region: n.Region, popup: n.Popup});
      });

      this.setState({
          team: temp
      });

        $(function () {
          $('[data-toggle="tooltip"]').tooltip()
        })
    });
  }
  render(){

    var generateHelpLink = function(member:member, index:number){
      return (
        <div className="benefits-contact" key={index}>
  				<span className="name-number">
  					<span className="name">{member.name}</span>
  					<span className="number">{member.phone}</span>
  				</span>
  				<span className="location">
            {member.popup == null || member.popup.length == 0
  					? <span data-toggle="tooltip" data-placement="right" title={member.popup}>{member.region}</span>
            : <a data-toggle="tooltip" data-placement="right" title={member.popup}>{member.region}</a>}
  				</span>
  			</div>
      );
    };

    return (
      <div>
       {this.state.team.map(generateHelpLink, this)}
      </div>
    )
  }
  showComponent() {
    React.render(
      <BenefitsTeam />,
      document.getElementById('benefitsTeam'));
  }
}
