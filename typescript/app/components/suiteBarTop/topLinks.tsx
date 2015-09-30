module C {
  /**
   * Interfaces
   */
  interface Link {
    id: number,
    title: string
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
  export class TopLinks extends React.Component<topLinksProps, globalLinksState> {
    constructor(props: topLinksProps, state: globalLinksState){
      super(props, state);
      this.state = {links: []};
    }
    componentDidMount() {
      /*Great place to integrate with frameworks, set timers and make AJAX requests and setState*/
      if (isMounted(this)){
        /**
         * Calling Data Service
         */
        var service = new Services.DataService();
        service.getTopLinks().then((data:any)=>{
          // console.info(data);
          var temp: Link[];
          temp = [];

          // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
          _.map(data,(n:any)=>{
            temp.push({title: n.Title, id: n.Id});
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
      var ilStyle = {
        display: 'inline',
        marginRight: '15px',
        fontSize: '.8em',
        fontWeight: 700
      }
      var createLink = function(link: Link) {
        return (
          <li style={ilStyle} key={link.id}>{link.title}</li>
        );
      };
      return (
        <ul style={ulStyle}>
          {this.state.links.map(createLink, this)}
        </ul>
      )
    }
  }
}
