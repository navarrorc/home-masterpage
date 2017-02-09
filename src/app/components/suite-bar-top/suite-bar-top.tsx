import * as React from 'react';
import { render } from 'react-dom';
import api = require('../../services/data-service');
// import ProfileImage = require('./profile-image');
import TopLinks = require('./top-links');
import helpers = require('../helpers');

//import React = require('react');

// Parent Component
// class SuiteBarTop extends React.Component<any, any> {
//   constructor(){
//     super();
//     this.state = {profileImageUrl: '', visible: false};
//   }
//   componentDidMount(){
//     // async call
//     var service = new api.DataService();
//     service.getSPUser()
//       .then((data: any)=>{
//          var email = data.Email;
//          //console.info('email:', email);
//          var url = '/sites/rushnet/_layouts/15/userphoto.aspx?size=M&accountname=' + email;
//          if (helpers.isMounted(this)){
//            this.setState({profileImageUrl: url, visible: true});
//          }
//        });
//   }
//   render(){
//     return (
//       <ProfileImage imgUrl={this.state.profileImageUrl} visible={this.state.visible}>
//       </ProfileImage>
//     );
//   }
// }

// Used to render child components on the suiteBarTop
export function showComponents() {
  SP.SOD.executeOrDelayUntilScriptLoaded(() => {
    var interval = setInterval(()=> { // wait 1 second before executing
      // if ($('div.o365cs-me-tile-nophoto-username-container').length) {
      //   render(<SuiteBarTop />, document.querySelector('div.o365cs-me-tile-nophoto-username-container'));
      //   render(<TopLinks />, document.querySelector('div.o365cs-nav-centerAlign'));
      //   // see: http://stackoverflow.com/questions/25773668/react-js-render-components-at-different-locations
      //   clearInterval(interval);
      // }
      // if ($('div.o365cs-me-tileimg').length) {
      //   // Applys to Nana Aikins and Office 365 Administrators
      //   render(<TopLinks />, document.querySelector('div.o365cs-nav-centerAlign'));
      //   // see: http://stackoverflow.com/questions/25773668/react-js-render-components-at-different-locations

      //   clearInterval(interval);
      // }
      if ($('div.o365cs-nav-centerAlign').length) {
        // Fixes issue found in 1/20/2017
        //console.log('Fixes issue found in 1/20/2017');
        render(<TopLinks />, document.querySelector('div.o365cs-nav-centerAlign'));
        clearInterval(interval);
      }
    }, 1000);
  }, 'sp.core.js'); // Needed in order to properly override the suiteBarTop
}
