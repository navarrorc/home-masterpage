import api = require('../services/data-service');
import {config} from '../services/shared';

interface FAQLink{
  title:string,
  href:string,
  isNewWindow:boolean,
  column:number
}

export class FAQLinkList extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {
      column1: [],
      column2: [],
      column3: []
    };
  }
  componentDidMount() {
    let abs_url = config.abs_url;
    var service = new api.DataService(abs_url);
    var listColumns = ['Title','Url','Opens_New_Window','Position'];
    service.getListItems('rushnet', 'FAQs', listColumns).then((data:any)=>{
      var temp1: FAQLink[] = [];
      var temp2: FAQLink[] = [];
      var temp3: FAQLink[] = [];

      data = _.sortByOrder(data, ['Position'], ['asc']);

      // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
      var index = 0;
      _.map(data,(n:any)=>{
        if(index % 3 == 0)
          temp1.push({title: n.Title, href: n.Url, isNewWindow: n.Opens_New_Window, column: n.Position});
        else if(index % 3 == 1)
          temp2.push({title: n.Title, href: n.Url, isNewWindow: n.Opens_New_Window, column: n.Position});
        else if(index % 3 == 2)
          temp3.push({title: n.Title, href: n.Url, isNewWindow: n.Opens_New_Window, column: n.Position});
        index++;
      });

      this.setState({
          column1: temp1,
          column2: temp2,
          column3: temp3
      });
    });
  }
  render(){
    var generateFAQLink = function(link:FAQLink, index:number){
      return (
        <li key={index}><a href={link.href} target={link.isNewWindow ? "_blank" : "_self"} >
          {link.title}
        </a></li>
      );
    };

    return (
      	<div className="panel clearfix">
      		<h1>Frequent Requests</h1>
      		<div className="faq-link-list-wrap">
      			<ul className="faq-link-list" id="column1">
      				{this.state.column1.map(generateFAQLink, this)}
      			</ul>
      			<div className="faq-link-list-divider">&nbsp;</div>
      			<ul className="faq-link-list" id="column2">
      				{this.state.column2.map(generateFAQLink, this)}
      			</ul>
      			<div className="faq-link-list-divider">&nbsp;</div>
      			<ul className="faq-link-list" id="column3">
      				{this.state.column3.map(generateFAQLink, this)}
      			</ul>
      		</div>
      	</div>
    )
  }
  showComponent() {
    React.render(
      <FAQLinkList />,
      document.getElementById('faq'));
  }
}
