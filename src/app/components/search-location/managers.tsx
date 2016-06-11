import * as React from 'react';
import { render } from 'react-dom';
import api = require('../../services/data-service');
import {config} from '../../services/shared';

interface EmployeeEntry{
  ldEmployeePhone:string,
  ldEmployeeName:string,
  ldRole:string,
  ldBranchCode:string,
  ldEmployeeEmail:string
}

export class Managers extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {
      employee: []
    };
  }
  componentDidMount() {
    //let abs_url = config.abs_url;
    var service = new api.DataService();
    var listColumns = ['ldEmployeePhone','ldEmployeeName','ldRole','ldBranchCode','ldEmployeeEmail'];
    var temp: EmployeeEntry[] = [];
    var socialTemp:any = {};

    var branchCode = "0";
    var searchTerms = window.location.search.split('?')[1].split('&'); // might be multiple search terms later...might not be too =/
    for(var i = 0; i < searchTerms.length; i++)
      if(searchTerms[i].indexOf("branchcode") > -1)
        branchCode = searchTerms[i].split('=')[1]; //cast string number back to number

    service.getListItemsWithFilter('rushnet', 'LocationEmployee', listColumns, 'ldBranchCode eq ' + branchCode).then((data:any)=>{

      // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
      _.map(data,(n:any)=>{
        temp.push(
          {
            ldEmployeePhone: n.ldEmployeePhone,
            ldEmployeeName: n.ldEmployeeName,
            ldRole: n.ldRole,
            ldBranchCode: n.ldBranchCode,
            ldEmployeeEmail: n.ldEmployeeEmail
          });
      });

      if(typeof(socialTemp.facebook) != undefined)
        this.setState({
            employee: temp
        });
    });
  }
  createManager(employee:EmployeeEntry, index:number){
    if(employee.ldRole.toUpperCase().indexOf("REGIONAL") == -1
        && employee.ldRole.toUpperCase().indexOf("DISTRICT") == -1
        && employee.ldRole.toUpperCase().indexOf("GENERAL") == -1)
         return;

    return (
      <div className="col-xs-6" key={index}>
        <strong>{employee.ldEmployeeName},</strong> {employee.ldRole} - <a href={"mailto:" + employee.ldEmployeeEmail + "rushenterprises.com"}>{employee.ldEmployeeEmail}rushenterprises.com</a>
      </div>
    )
  }
  render(){
    return (
      <div className="card">
				<div className="row">
          {this.state.employee.map( (data, index) => {
            return this.createManager(data, index)
          })}
				</div>
			</div>
    )
  }
  showComponent() {
    render(
      <Managers />,
      document.getElementById('Managers'));
  }
}
