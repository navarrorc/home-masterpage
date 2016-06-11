import * as React from 'react';
import { render } from 'react-dom';
import {getQueryStringValue} from '../../services/shared';
import {UserProfile} from '../../services/user-profile';

/*Parent Component*/
class HeaderDetails extends React.Component<any, any> {

  constructor(props:any){
    super(props);
  }
  componentWillMount() {
    //console.log(this.props.userDetails);
  }
  componentDidMount() {
    //console.log(this.props.userDetails);
  }
  render() {
    let firstName = this.props.userDetails.firstName;
    let lastName = this.props.userDetails.lastName;
    return (
      <div id="profile-detail-header">
        <h1>{firstName} {lastName}</h1>
      </div>
    )
  }
}

class AdditionalDetails extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  componentWillMount() {
    //console.log(this.props.userDetails);
  }
  componentDidMount() {
    //console.log(this.props.userDetails);
  }
  render() {
    let pictureUrl = this.props.userDetails.pictureUrl;
    let title = this.props.userDetails.title;
    let location = this.props.userDetails.location;
    let phoneNumber = this.props.userDetails.phoneNumber;
    let email = this.props.userDetails.email;
    return (
      <div id="profile-details-info-panel">
        <div id="profile-image-status">
          <img src={pictureUrl} width="72px" height="72px" alt=""></img>
        </div>
        <div id="profile-contact-info">
          <div><strong>Title:</strong> {title} </div>
          <div><strong>Location:</strong> {location} </div>
          <div><strong>Email:</strong> <a href=""> {email} </a></div>
          <div><strong>Phone Number:</strong> {phoneNumber} </div>
        </div>
      </div>
    )
  }
}

class OrgChart extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  // componentWillMount() {
  //   //console.log(this.props.userDetails);
  // }
  // componentDidMount() {
  //   //console.log(this.props.userDetails.managerEmail);
  //   console.log('in OrgChart componentDidMount()');
  // }

  render() {
    var generateEntry = function(data, index) {
      return (
        <div className="org-member" key={index}>
          <a href={"/search/Pages/RushSearchPersonDetail.aspx?email=" + data.displayName}>{data.displayName}</a>
        </div>
      )
    }
    var generateDirectReports = function(data, index) {
      // displays both odd or even rows
      return (
        <div className={(index % 2 === 0)? 'org-member odd': 'org-member'} key={index}>
          <div className="tree-bracket">
            <div></div>
          </div>
          <a href={"/search/Pages/RushSearchPersonDetail.aspx?email=" + data.displayName}>{data.displayName}</a>
        </div>
      )
    }
    console.log('in OrgChart render()');

    let managerDisplayName = this.props.manager.displayName;
    return (
      <div>
        <h1 className="black">Organizational Chart</h1>
        <div id="org-chart">
            {this.props.extendedManagers.map(generateEntry,this)}
            <div className="section-title">Manager</div>
            <div className="org-member">
            <a href="">{managerDisplayName}</a>
            </div>
            <div className="section-title">Shares Same Manager</div>
            {this.props.peers.map(generateEntry,this)}
            <div className="section-title">Director Reports</div>
            {this.props.directReports.map(generateDirectReports,this)}
          </div>
      </div>
    )
  }
}

/*Main App Component*/
export class PersonDetails extends React.Component<any, any> {
  constructor(props:any){
    super(props);
    this.state = { profileProperties: {}, manager: {}, extendedManagers: [], peers: [], directReports: []}; // setting initial state
  }
  componentWillMount() {
    let properties = {};
    let manager = {};
    let email = getQueryStringValue('email').toLowerCase();
    let profile = new UserProfile();
    let picUrl = '';
    profile.getSPUserProfileData(email).then((data:any)=>{
      let userProfileProperties = data.UserProfileProperties.results;
      let managerID = _.filter(userProfileProperties, function(p:any) { return p.Key === 'Manager'; })[0].Value;
      let managerEmail = _.filter(userProfileProperties, function(p:any) { return p.Key === 'Manager'; })[0].Value.split('|')[2]; // split on | character and return just the email [2]
      let extendedManagers = data.ExtendedManagers.results; // array
      let peers = data.Peers.results; // array
      let directReports = data.DirectReports.results; // array
      let fName = _.filter(userProfileProperties, function(p:any) { return p.Key === 'FirstName'; })[0].Value;
      let lName = _.filter(userProfileProperties, function(p:any) { return p.Key === 'LastName'; })[0].Value;
      //let picUrl = (data.PictureUrl !== null)? data.PictureUrl :'/_layouts/15/userphoto.aspx/PersonPlaceholder.96x96x32.png';
      let title = _.filter(userProfileProperties, function(p:any) { return p.Key === 'Title'; })[0].Value;
      let location = _.filter(userProfileProperties, function(p:any) { return p.Key === 'SPS-Department'; })[0].Value;
      let phoneNumber = _.filter(userProfileProperties, function(p:any) { return p.Key === 'WorkPhone'; })[0].Value;

      picUrl = 'https://rushenterprises.sharepoint.com/sites/rushnet/_layouts/15/userphoto.aspx?size=M&accountname=' + email;
      phoneNumber = phoneNumber.substr(0, 3) + '-' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6,4);
      // picUrl.split('?')[0]; // split and then return the first item in the array
      // person properties
      properties = {
        firstName: fName,
        lastName: lName,
        email: email,
        pictureUrl: picUrl,
        title: title,
        location: location,
        phoneNumber: phoneNumber
      };
      // manager's display name
      manager = {
        displayName: managerEmail
      }
      // extended managers display name
      let extManagers = [];
      extManagers = _.remove(extendedManagers, (m)=>{
        return m !== managerID; // remove the entry for the person's direct manager
      })
      let temp = [];
      _.map(extManagers, (data:string,index)=>{
        // console.log(data);
        temp.push({
          displayName: data.split('|')[2], // return just the email part
          index: index
        })
      })
      // peers
      let tempPeers = [];
      let filteredPeers = [];
      filteredPeers = _.remove(peers, (p:string)=>{
        return (p.indexOf('svc.') > -1) !== true; // does not contain the "svc." acccounts
      })
      _.map(filteredPeers, (data:string,index)=>{
        // console.log(data);
        tempPeers.push({
          displayName: data.split('|')[2], // return just the email part
          index: index
        })
      })
      // direct Reports
      let tempDirectReports = [];
      let filteredDirectReports = []
      filteredDirectReports = _.remove(directReports, (r:string)=>{
        return (r.indexOf('svc.') > -1) !== true; // does not contain the "svc." acccounts
      })
      //console.log(filteredDirectReports);
      _.map(filteredDirectReports, (data:string,index)=>{
        tempDirectReports.push({
          displayName: data.split('|')[2], // return just the email part
          index: index
        })
      })

      this.setState({
        profileProperties: properties,
        manager: manager,
        extendedManagers: temp,
        peers: tempPeers,
        directReports: tempDirectReports
      })
    })
  }
  componentDidMount() {
  }
  render() {
    //console.log('in render method');
    var styles = {
      paddingLeft: 0
    }
    return (
      <div>
        <HeaderDetails userDetails={this.state.profileProperties} />
        <div className="col-xs-12 col-md-9" style={styles}>
          <AdditionalDetails userDetails={this.state.profileProperties} />
        </div>
      </div>
    );
  }
  showComponent() {
    render(
      <PersonDetails />,
      document.getElementById('profileData')
    );
  }
}
