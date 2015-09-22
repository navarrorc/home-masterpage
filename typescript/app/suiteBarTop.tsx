/// <reference path="./services/dataService.ts"/>
module suiteBarTop {
  interface barProps {
    // TODO: add properties if needed, see https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html
  }

  class ProfileImage extends React.Component<barProps, any> {
    private foo: number;
    constructor(props:barProps){
      super(props);
      this.state = {profileImageUrl: ''}
      var service = new Services.DataService("fetching data from myService");
      service.getSPUser().then((user: SP.User)=>{
        var url = '/sites/rushnet/_layouts/15/userphoto.aspx?size=M&accountname=' + user.get_email();
        this.setState({profileImage: url});
      })
    }
    render() {
      console.info("inside render() imgUrl:", this.state.profileImage);
      //this.props.imgUrl = "https://pbs.twimg.com/profile_images/378800000247666963/9b177e5de625a8420dd839bb1561280d.jpeg";
      return (
        <img src={this.state.profileImage} className="profileImage" alt=""></img>
      );
    }
  };

  $(()=> {
    var interval = setInterval(()=> { // wait 1 second before executing
      if($('div.o365cs-me-tile-nophoto-username-container').length) {
        React.render(<ProfileImage />,
                      document.querySelector('div.o365cs-me-tile-nophoto-username-container')
        );
        document.querySelector('div.o365cs-me-tile-nophoto-username-container').setAttribute('style', 'visibility: visible'); // No jquery needed here
        clearInterval(interval);
      }
    }, 500);

  });
}
