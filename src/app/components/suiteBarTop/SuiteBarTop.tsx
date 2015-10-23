import api = require('../../services/DataService');
import ProfileImage = require('./ProfileImage');
import TopLinks = require('./TopLinks');
import helpers = require('../Helpers');

//import React = require('react');

// Parent Component
class SuiteBarTop extends React.Component<any, any> {
  constructor(){
    super();
    this.state = {profileImageUrl: '', visible: false};
  }
  componentDidMount(){
    // async call
    var service = new api.DataService('fetching data from myService');
    service.getSPUser()
      .then((data: any)=>{
         var email = data.Email;
         //console.info('email:', email);
         var url = '/sites/rushnet/_layouts/15/userphoto.aspx?size=M&accountname=' + email;
         if (helpers.isMounted(this)){
           this.setState({profileImageUrl: url, visible: true});
         }
       });
  }
  render(){
    return (
      <ProfileImage imgUrl={this.state.profileImageUrl} visible={this.state.visible}>
      </ProfileImage>
    );
  }
}

// Used to render child components on the suiteBarTop
export function showComponents() {
  SP.SOD.executeOrDelayUntilScriptLoaded(() => {
    var interval = setInterval(()=> { // wait 1 second before executing
      if ($('div.o365cs-me-tile-nophoto-username-container').length) {
        React.render(<SuiteBarTop />, document.querySelector('div.o365cs-me-tile-nophoto-username-container'));
        React.render(<TopLinks />, document.querySelector('div.o365cs-nav-centerAlign'));
        // see: http://stackoverflow.com/questions/25773668/react-js-render-components-at-different-locations
        clearInterval(interval);
      }
    }, 1000);
  }, 'sp.core.js'); // Needed in order to properly override the suiteBarTop
}