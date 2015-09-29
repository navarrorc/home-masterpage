module C {
  /**
   * Interfaces
   */
  interface Link {
    id: number,
    title: string
  }
  interface globalLinksProps {
    // TODO: add properties to globalLinksProps Interface
  }
  interface globalLinksState {
    links: Link[]
  }
  /**
   * Component Class
   */
  export class GlobalLinks extends React.Component<globalLinksProps, globalLinksState> {
    constructor(props: globalLinksProps, state: globalLinksState){
      super(props, state);
      this.state = {links: []};
    }
    componentDidMount() {
      /*Great place to integrate with frameworks, set timers and make AJAX requests and setState*/
      if (isMounted(this)){
        // TODO: get actual data from the GlobalLinks SharePoint List
        //this.setState({links: ['Documents', 'Locations', 'People']});
        this.setState({
            links: [
                { id: 1, title: 'Documents' },
                { id: 2, title: 'Locations' },
                { id: 3, title: 'People' }]
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
