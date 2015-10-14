//import React = require('react');

interface topWidgetProps {
  updates: number;
  alerts: number;
}

export class TopHeaderWidgets extends React.Component<topWidgetProps, {}> {
  constructor(props:topWidgetProps){
    super(props);
  }
  render() {
    // var liStyle = {
    //   color: '#5F5C4F',
    //   display: 'inline',
    //   marginRight: '30px',
    //   fontSize: '1em',
    //   fontWeight: 700,
    // }
    // var spanStyle = {
    //   backgroundColor: '#ED1C24',
    //   paddingTop: '2px',
    //   paddingRight: '1px',
    //   color: '#fff',
    //   borderRadius: '50%',
    //   width: '25px',
    //   height: '25px',
    //   textAlign: 'center',
    //   display: 'inline-block',
    //   verticalAlign: 'middle',
    //   marginBottom: '3px'
    // }
    return (
      // <div>
      //   <ul>
      //     <li style={liStyle}>UPDATES <span style={spanStyle}>{this.props.updates}</span></li>
      //     <li style={liStyle}>ALERTS <span style={spanStyle}>{this.props.alerts}</span></li>
      //   </ul>
      // </div>
      <div>
        <a href="" className="notification float-right">
          Alerts <span className="counter red">1</span>
        </a>
        <a href="" className="notification float-right">
          Updates <span className="counter red">10</span>
        </a>
      </div>
    )
  }
  showComponent() {
    React.render(
      <TopHeaderWidgets updates={this.props.updates} alerts={this.props.alerts} />
      ,document.querySelector('div.topBarContainer-widgets'));
  }
}
