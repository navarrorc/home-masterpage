import api = require('../../services/DataService');

interface LocationHours{
  service:string,
  entries:EntryHours[]
}

interface EntryHours{
  ldLocationService:string,
  ldWeekDayStart:string,
  ldWeekDayEnd:string,
  ldStartTime:string,
  ldEndTime:string
}

export class Hours extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {
      hours: []
    };
  }
  componentDidMount() {
    var service = new api.DataService();
    var listColumns = ['ldLocationService','ldWeekDayStart','ldWeekDayEnd','ldStartTime','ldEndTime'];
    var temp: LocationHours[] = [];

    var branchCode = "0";
    var searchTerms = window.location.search.split('?')[1].split('&'); // might be multiple search terms later...might not be too =/
    for(var i = 0; i < searchTerms.length; i++)
      if(searchTerms[i].indexOf("branchcode") > -1)
        branchCode = searchTerms[i].split('=')[1]; //cast string number back to number

    service.getListItemsWithFilter('rushnet', 'LocationHours', listColumns, 'ldBranchCode eq ' + branchCode).then((data:any)=>{

      data = _.sortByOrder(data, ['ldLocationService'], ['asc']);
      // map data from Ajax call to fit the Link type [{title: 'link', ld: 1}, ...]
      var index:number = -1;
      var lastService:string = '';
      _.map(data,(n:any)=>{
        if(lastService != n.ldLocationService){
          lastService = n.ldLocationService;
          index++;
        }

        var entry:EntryHours = {
          ldLocationService: n.ldLocationService,
          ldWeekDayStart: n.ldWeekDayStart,
          ldWeekDayEnd: n.ldWeekDayEnd,
          ldStartTime: n.ldStartTime,
          ldEndTime: n.ldEndTime
        };

        if(typeof(temp[index]) == 'undefined')
          temp.push({
          service: n.ldLocationService,
          entries: [entry]
          })
        else
          temp[index].entries.push(entry);
      });

      this.setState({
          hours: temp
      });
    });
  }
  createCardWrap(index:number){
    if(index % 2 == 1) return;
    return(
      <div className="card-wraps" key={index}>
      {this.createDepartmentTimesCard(this.state.hours[index])}
      {this.createDepartmentTimesCard(this.state.hours[index + 1])}
      </div>
    )
  }
  createDepartmentTimesCard(time:LocationHours){
    if(time == null) return <div></div>
    return (
      <div className="card">
        <strong>{time.service}</strong>
        <br />
        {time.entries.map( (n) => {
          var start = new Date(n.ldStartTime);
          var startMinutes = start.getMinutes() == 0 ? "0" + start.getMinutes() : start.getMinutes();
          moment(start).format("hh:mm")
          var end = new Date(n.ldEndTime);
          var endMinutes = end.getMinutes() == 0 ? "0" + end.getMinutes() : end.getMinutes();
          return (
            <span>
              <em>{n.ldWeekDayStart} - {n.ldWeekDayEnd}: {moment(start).format("h:mm a")} - {moment(end).format("h:mm a")}</em>
              <br />
            </span>
          )})}
      </div>
    )
  }
  render(){
    return (
      <div>
        {this.state.hours.map( (entry, index) => {
          return this.createCardWrap(index)
        })}
      </div>
    )
  }
  showComponent() {
    React.render(
      <Hours />,
      document.getElementById('location-hours'));
  }
}
