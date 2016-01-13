import api = require('../../services/DataService');

interface BrandEntry{
  ldBranchCode:string,
  ldBrandName:string,
  BrandImageId:string,
  BrandImageLink:string
}

export class BrandPanel extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {
      brands: []
    };
  }
  componentDidMount() {
    var service = new api.DataService();
    var listColumns = ['ldBranchCode','ldBrandName','BrandImageId'];
    var temp:BrandEntry[] = [];

    var branchCode = "0";
    var searchTerms = window.location.search.split('?')[1].split('&'); // might be multiple search terms later...might not be too =/
    for(var i = 0; i < searchTerms.length; i++)
      if(searchTerms[i].indexOf("branchcode") > -1)
        branchCode = searchTerms[i].split('=')[1]; //cast string number back to number

    service.getListItems('rushnet', 'Brands', ['Id','ldBrandName','ldBrandImageLink']).then((brandList:any)=>{

      service.getListItemsWithFilter('rushnet', 'LocationBrands', listColumns, 'ldBranchCode eq ' + branchCode).then((data:any)=>{

        // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
        _.map(data,(n:any, index:number)=>{
          var link = '';
          for(var i = 0; i < brandList.length; i++)
            if(brandList[i].Id == n.BrandImageId || brandList[i].ldBrandName == n.ldBrandName){
              link = brandList[i].ldBrandImageLink;
              break;
            }
          temp.push(
            {
              ldBranchCode:n.ldBranchCode,
              ldBrandName:n.ldBrandName,
              BrandImageId:n.BrandImageId,
              BrandImageLink:link
            });
        });

        this.setState({
          brands: temp
        });
      });
    });
  }
  createBrandRows(brands:BrandEntry[]){
    var row = [];
    var rows = [];
    while(brands.length > 0){
      if(row.length == 3){
        rows.push(row);
        row = [];
      }

      if(brands.length > 0)
        row.push(brands[brands.length - 1]);

      brands.pop();
    }
    if(row.length > 0){
      if(row.length < 3){
        var max = 3 - row.length;
        for(var i = 0; i < max; i++)
          row.push(null)
      }
      rows.push(row);
    }

    return rows
  }
  createBrandRow(brandRow:BrandEntry[], index:number){
    return (
      <div className="logo-row" key={index}>
        {brandRow.map( (data, index2) => {
          return this.createBrandEntry(data, index2)
        })}
      </div>
    )
  }
  createBrandEntry(entry:BrandEntry, index:number){
      if(entry == null) return <div key={index}>&nbsp;</div>
      else return <div key={index}><img src={entry.BrandImageLink} alt={entry.ldBrandName} /></div>
  }
  render(){
    return (
      <div className="panel location-logos-table">
  			{this.createBrandRows(this.state.brands).map( (row, index) => {
          return this.createBrandRow(row, index)
        })}
    	</div>
    )
  }
  showComponent() {
    React.render(
      <BrandPanel />,
      document.getElementById('brands'));
  }
}
