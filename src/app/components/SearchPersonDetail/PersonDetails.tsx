import {getQueryStringValue} from '../../services/Shared';
import {UserProfile} from '../../services/UserProfile';

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
    return (
      <div>
        Hello from ReactJS...my name is {this.props.userDetails.firstName} {this.props.userDetails.lastName} 
        contact me at {this.props.userDetails.email}
      </div>
    )
  }
}

/*Main App Component*/
export class PersonDetails extends React.Component<any, any> {
  constructor(props:any){
    super(props);
    this.state = { profileProperties: {} }; // setting initial state
  }
  componentWillMount() {
    let properties = {};
    let email = getQueryStringValue('email').toLowerCase();
    let profile = new UserProfile();
    profile.getSPUserProfileData(email).then((data:any)=>{
      var userProfileProperties = data.UserProfileProperties.results;
      properties = {
        firstName: _.filter(userProfileProperties, function(p:any) { return p.Key === 'FirstName'; })[0].Value,
        lastName: _.filter(userProfileProperties, function(p:any) { return p.Key === 'LastName'; })[0].Value,
        email: email,
      };
      this.setState({
        profileProperties: properties
      })
      //console.log(JSON.stringify(this.state.profileProperties));

    })
  }
  componentDidMount() {
  }
  render() {
    return (
      <div>
        <HeaderDetails userDetails={this.state.profileProperties} />
      </div>
    );
  }
  showComponent() {
    React.render(
      <PersonDetails />,
      document.getElementById('profileData')
    );
  }
}
