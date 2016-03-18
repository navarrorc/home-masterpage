import api = require('../services/data-service');
import helpers = require('./helpers');
import {config} from '../services/shared';

declare var moment: any;


function alerts () {
	$('.alert').on('click', '.close-link a', function () {
		$(this).parent().parent().remove();

		if ($('.alert').length === 0)
			$('#alerts').empty();

		return false;
	});
}


export class AlertsToasterMessage extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {alerts: []};
  }
  componentDidMount() {
    if (helpers.isMounted(this)){
      // Calling Data Service
      let abs_url = config.abs_url;
      var service = new api.DataService(abs_url);
      var listColumns = [
        'ID',
        'Active',
        'Created',
        'Message',
        'Posted_x0020_By',
        'Publish_x0020_Date',
        'Publish_x0020_End_x0020_Date',
        'Title'
      ];
			var today = new Date()
			var filter = "(Publish_x0020_Date le datetime'" + today.toISOString() + "' and (Publish_x0020_End_x0020_Date ge datetime'" + today.toISOString() +"' or Publish_x0020_End_x0020_Date eq null)) and Active eq 1";
      service.getListItemsWithFilter('rushnet', 'Helpdesk Alerts', listColumns,filter).then((data:any)=>{
        // console.info(data);
        var temp = [];

        // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
        _.map(data,(n:any)=>{
          temp.push({
            id: n.ID,
            title: n.Title,
            message: n.Message,
            postedBy: n.Posted_x0020_By,
            created: n.Created
          });
        });
        this.setState({
            alerts: temp
        });
        alerts(); // call function, wire up events on the alerts elements
      });
    }
  }
  render() {
    var createAlert = function(alert:any, index:number) {
      // var date = new Date(alert.created);
      var formatedDateTime = moment(alert.created).format('LLL');  // November 18, 2015 4:34 PM (see: http://momentjs.com/)
      return (
	        <div className="alert" key={index}>
	          <div className="message"><strong>{alert.title}:</strong> {alert.message} -- {alert.postedBy} ({formatedDateTime})  </div>
	          <div className="close-link">
	            <a href=""><i className="icon icon-close"></i></a>
	          </div>
	        </div>
      );
    };
    return (
      <div style={{width: '100%'}}>
        {this.state.alerts.map(createAlert, this)}
      </div>
    )
  }
  showComponent() {
    React.render(
      <AlertsToasterMessage />,
      document.getElementById('alerts'));
  }
}
