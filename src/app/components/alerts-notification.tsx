import api = require('../services/data-service');
import helpers = require('./helpers');
import {AlertsToasterMessage} from './alerts-toaster-message';
import {config} from '../services/shared';

function renderAlertsMessages () {
  var alertsMessages = new AlertsToasterMessage(null);
  alertsMessages.showComponent();
}

function getAlertsCount () {
  //let abs_url = config.abs_url;
  var service = new api.DataService();
  var listColumns = [
    'ID',
    'Active',
    'Created',
    'Posted_x0020_By',
    'Publish_x0020_Date',
    'Publish_x0020_End_x0020_Date',
    'Title'
  ];
  var today = new Date()
  var filter = "(Publish_x0020_Date le datetime'" + today.toISOString() + "' and (Publish_x0020_End_x0020_Date ge datetime'" + today.toISOString() +"' or Publish_x0020_End_x0020_Date eq null)) and Active eq 1";
  //console.log('filter',filter);
  service.getListItemsWithFilter('rushnet', 'Helpdesk Alerts', listColumns,filter).then((data:any)=>{
    // console.info('data.length',data.length);
    this.setState({
        alertsCount: data.length
    });

    if (this.state.alertsCount === 0){
      $('#alerts').empty(); // clear out the alerts messages
    }
  });
}

export class AlertsNotification extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {alertsCount: 0};
  }
  componentDidMount() {
    if (helpers.isMounted(this)){
      getAlertsCount.call(this);
    }
  }
  handleClick(){
    getAlertsCount.call(this);
    $('#alerts').empty(); // clear out the alerts messages
    renderAlertsMessages();
  }
  render() {
    return (
        <div>
          <a href="#" className="notification float-right" onClick={this.handleClick.bind(this)}>
            Alerts <span className="counter red">{this.state.alertsCount}</span>
          </a>
        </div>
    )
  }
  showComponent() {
    React.render(
      <AlertsNotification />,
      document.getElementById('alerts-notification'));
  }
}
