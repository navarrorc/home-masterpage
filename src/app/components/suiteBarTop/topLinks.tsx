import api = require('../../services/dataService');
import helpers = require('../_helpers');

//import React = require('react');

/**
 * Interfaces
 */
interface Link {
  id: number,
  title: string,
  url: string
}
interface topLinksProps {
  // TODO: add properties to topLinksProps Interface
}
interface globalLinksState {
  links: Link[]
}
/**
 * Component Class
 */
class TopLinks extends React.Component<topLinksProps, globalLinksState> {
  constructor(props: topLinksProps, state: globalLinksState){
    super(props, state);
    this.state = {links: []};
  }
  componentDidMount() {
    /*Great place to integrate with frameworks, set timers and make AJAX requests and setState*/
    if (helpers.isMounted(this)){
      /**
       * Calling Data Service
       */
      var service = new api.DataService();
      service.getTopLinks().then((data:any)=>{
        // console.info(data);
        var temp: Link[];
        temp = [];

        // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
        _.map(data,(n:any)=>{
          temp.push({title: n.Title, id: n.Id, url: n.Url});
        });

        this.setState({
            links: temp
        });
      });
   }
  }
  render() {
    var ulStyle = {
      listStyleType: 'none',
      margin: 0,
      padding: 0
    }
    var liStyle = {
      display: 'inline',
      marginRight: '15px',
      fontSize: '.8em',
      fontWeight: 700
    }
    var aStyle = {
      color: '#fff'
    }
    var createLink = function(link: Link) {
      return (
        <li style={liStyle} key={link.id}><a style={aStyle} href={link.url}>{link.title}</a></li>
      );
    };
    return (
      <ul style={ulStyle} className='topLinks'>
        {this.state.links.map(createLink, this)}
      </ul>
    )
  }
}

export = TopLinks;
