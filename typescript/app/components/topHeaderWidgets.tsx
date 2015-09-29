module C {
  interface topWidgetProps {
    //name:string;
    //age:number;
    imgUrl: string;
  }

  export class TopHeaderWidgets extends React.Component<topWidgetProps, any> {
    constructor(props:topWidgetProps){
      super(props);
    }
    render() {
      return (
        <div>
          <img src={this.props.imgUrl} style={{height: '45px'}}></img>
        </div>
      )
    }
    showComponent() {
      React.render(
        <TopHeaderWidgets imgUrl={this.props.imgUrl}/>
        ,document.querySelector('div.topBarContainer-widgets'));
    }
  }
}
