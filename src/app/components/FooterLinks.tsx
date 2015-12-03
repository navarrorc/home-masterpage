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
      column2: []
    };
  }
  componentDidMount() {
    var service = new api.DataService();
    var listColumns = ['Title','Url','Opens_New_Window','Position','Column'];
    service.getListItems('rushnet', 'Footer_Links', listColumns).then((data:any)=>{
      var temp1: FooterLink[] = [];
      var temp2: FooterLink[] = [];

      data = _.sortByOrder(data, ['Position'], ['asc']);

      // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
      _.map(data,(n:any)=>{
        if(n.Column % 2 == 1)
          temp1.push({title: n.Title, href: n.Url, isNewWindow: n.Opens_New_Window});
        else if(n.Column % 2 == 0)
          temp2.push({title: n.Title, href: n.Url, isNewWindow: n.Opens_New_Window});
      });

      this.setState({
          column1: temp1,
          column2: temp2
      });
    });
  }
  render(){
    return (
      <div>
        <div id="footer-container" className="clearfix">
          <div id="coin-wrap" className="col-xs-4">
            <img src="/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/img/rush-coin-footer.png" alt="Rush Coin" />
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
            <p><strong>IT Service Desk 800-459-HELP</strong></p>
            <nav id="social-link-list">
              <a href=""><i className="icon icon-facebook"></i></a>
              <a href=""><i className="icon icon-linkedin"></i></a>
              <a href=""><i className="icon icon-youtube"></i></a>
              <a href=""><i className="icon icon-twitter"></i></a>
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
