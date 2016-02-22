import api = require('../services/DataService');

interface FooterLink{
  title:string,
  href:string,
  isNewWindow:boolean
}

export class FooterLinks extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {
      column1: [],
      column2: [],
      social: []
    };
  }
  componentDidMount() {
    var service = new api.DataService();
    var listColumns = ['Title','Url','Opens_New_Window','Position','Column'];
    var temp1: FooterLink[] = [];
    var temp2: FooterLink[] = [];
    var socialTemp:any = {};

    service.getListItems('rushnet', 'Footer_Links', listColumns).then((data:any)=>{

      data = _.sortByOrder(data, ['Position'], ['asc']);

      // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
      _.map(data,(n:any)=>{
        if(n.Column % 2 == 1)
          temp1.push({title: n.Title, href: n.Url, isNewWindow: n.Opens_New_Window});
        else if(n.Column % 2 == 0)
          temp2.push({title: n.Title, href: n.Url, isNewWindow: n.Opens_New_Window});
      });

      if(typeof(socialTemp.facebook) != undefined)
        this.setState({
            column1: temp1,
            column2: temp2,
            social: socialTemp
        });
    });

    var listColumns2 = ['Title','Url'];
    service.getListItems('rushnet', 'Social_Links', listColumns2).then((data:any)=>{

      _.map(data, (n:any) =>{
        if(n.Title == "facebook")
          socialTemp.facebook = n.Url;
        else if(n.Title == "LinkedIn")
          socialTemp.LinkedIn = n.Url;
        else if(n.Title == "Twitter")
          socialTemp.Twitter = n.Url;
        else if(n.Title == "Youtube")
          socialTemp.Youtube = n.Url;
      });

      if(temp1.length > 0)
        this.setState({
            column1: temp1,
            column2: temp2,
            social: socialTemp
        });
    });
  }
  render(){
    return (
      <div>
        <div id="footer-container" className="clearfix">
          <div id="coin-wrap" className="col-xs-4">
            <img src="/sites/rushnet/_catalogs/masterpage/_Rushnet/img/rush-coin-footer.jpg" alt="Rush Coin" />
          </div>
          <div id="navigation-links" className="col-xs-5">
            <h1>About</h1>
            <nav id="links-list" className="row clearfix">
              <div className="col-xs-6">
                {this.state.column1.map( (link, index) => {
                  return <a href={link.href} target={link.isNewWindow ? "_blank" : "_self"} key={index}>{link.title}</a>
                })}
              </div>
              <div className="col-xs-6">
                {this.state.column2.map( (link, index) => {
                  return <a href={link.href} target={link.isNewWindow ? "_blank" : "_self"} key={index}>{link.title}</a>
                })}
              </div>
            </nav>
          </div>
          <div id="footer-information" className="col-xs-3">
            <h1>Information</h1>
            <p><strong>IT Service Desk 888-758-HELP</strong></p>
            <nav id="social-link-list">
              <a href={this.state.social.facebook} target="_blank"><i className="icon icon-facebook"></i></a>
              <a href={this.state.social.LinkedIn} target="_blank"><i className="icon icon-linkedin"></i></a>
              <a href={this.state.social.Youtube} target="_blank"><i className="icon icon-youtube"></i></a>
              <a href={this.state.social.Twitter} target="_blank"><i className="icon icon-twitter"></i></a>
            </nav>
          </div>
        </div>
      </div>
    )
  }
  showComponent() {
    React.render(
      <FooterLinks />,
      document.getElementById('ftr'));
  }
}
