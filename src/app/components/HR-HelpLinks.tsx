// import api = require('../services/DataService');
//
// interface HelpLink{
//   title:string,
//   href:string
// }
//
// export class HelpLinkList extends React.Component<any, any> {
//   constructor(props: any){
//     super(props);
//   }
//   render(){
//     var service = new api.DataService();
//     var listColumns = ['Title','Url'];
//     service.getListItems('rushnet', 'TopLinks', listColumns).then((data:any)=>{
//       // console.info(data);
//       var temp: HelpLink[];
//       temp = [];
//
//       // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
//       _.map(data,(n:any)=>{
//         temp.push({title: n.Title, href: n.Url});
//       });
//
//       //this.setState({
//       //    links: temp
//       //});
//     });
//
//     var generateHelpLink = function(link:HelpLink){
//       return (
//         <a href={link.href}>
//           {link.title}<i className="icon icon-arrow-right"></i>
//         </a>
//       );
//     };
//     //return {this.}
//     return (
//       <div><h1>HelpLinkList Component</h1></div>
//     );
//   }
//   showComponent() {
//     React.render(
//       <HelpLinkList />,
//       document.getElementById('helpLinkList'));
//   }
// }
