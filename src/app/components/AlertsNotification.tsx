import api = require('../services/DataService');
import helpers = require('./Helpers');

export class AlertsNotification extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {alertsCount: 0};
  }
  componentDidMount() {
    if (helpers.isMounted(this)){
      // Calling Data Service
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
      var filter = 'Active eq 1';
      service.getListItemsWithFilter('rushnet', 'Helpdesk Alerts', listColumns,filter).then((data:any)=>{
        // console.info('data.length',data.length);
        this.setState({
            alertsCount: data.length
        });
      });
    }
  }
  render() {
    return (
        <div>
          <a href="#" className="notification float-right">
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
