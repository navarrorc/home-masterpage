import {StockFeedService} from '../services/StockFeed';

/*Parent Component*/
class StockSymbols extends React.Component<any, any> {
  constructor(props:any){
    super(props);
    this.state = { items: [] }; // setting initial state
  }
  componentWillMount() {
    var stockFeed = new StockFeedService();
    stockFeed.fetch().then((data:any)=>{
      this.setState({
        items: data
      })
    })
  }
  render() {
    return(
      <div>
        {this.state.items.map( (stock, index ) => {
          console.log(JSON.stringify(stock,null,4));
          return (
            <Stock key={index}
              ticker={stock.ticker}
              lastPrice={stock.lastPrice}
              change={stock.change}
              percentage={stock.percentage}
            />
          )
        })}
       </div>
      );
  }
}

/*Child and Parent Component */
class Stock extends React.Component<any,any> {
  constructor(props:any){
    super(props);
  }
  render() {
    var spanStyle = {
      marginRight: '5px'
    }
    var ticker = this.props.ticker,
        change = this.props.change,
        percentage = this.props.percentage;
    return (

      <div className="hide">
        <div className="current-price">
          <span className="counter" style={spanStyle}>{ticker}</span>
          ${this.props.lastPrice}
        </div>
        <div className="current-change">{(change > 0 )? '+': null}{change} ({(percentage > 0)? '+': null}{percentage}%)</div>
      </div>
    );
  }
}

/*Main App Component*/
export class StockTicker extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  render() {
    return (
        <div>
          <a href="" className="paging-control-left">
            <i className="icon icon-chevron-left"></i>
          </a>
          <div id="stock-symbols" className="float-left">
            <StockSymbols />
          </div>
          <a href="" className="paging-control-right">
            <i className="icon icon-chevron-right"></i>
          </a>
        </div>
    );
  }
  show() {
    React.render(
      <StockTicker />,
      document.getElementById('stock-ticker')
    );
  }
}
