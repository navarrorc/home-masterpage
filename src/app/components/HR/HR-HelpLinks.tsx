import api = require('../../services/DataService');

interface HelpLink{
  title:string,
  href:string,
  isNewWindow:boolean
}

export class HelpLinkList extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {links: []};
  }
  componentDidMount() {
    var service = new api.DataService();
    var listColumns = ['Title','Url','Opens_New_Window'];
    service.getListItems('hr', 'Help Links', listColumns).then((data:any)=>{
      var temp: HelpLink[] = [];

      // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
      _.map(data,(n:any)=>{
        temp.push({title: n.Title, href: n.Url, isNewWindow: n.Opens_New_Window});
      });

      this.setState({
          links: temp
      });
    });
  }
  render(){
    var generateHelpLink = function(link:HelpLink, index:number){
      var navigate = function(){
        var target = link.isNewWindow ? "_blank" : "_self";
        window.open(link.href, target);
      }

      return (
        <a className="row-link" onClick={navigate} key={index} >
          {link.title}<i className="icon icon-arrow-right"></i>
        </a>
      );
    };

    return (
      <div>
       {this.state.links.map(generateHelpLink, this)}
      </div>
    )
  }
  showComponent() {
    React.render(
      <HelpLinkList />,
      document.getElementById('helpLinkList'));
  }
}
