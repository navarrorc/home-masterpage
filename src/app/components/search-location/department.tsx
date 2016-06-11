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

export class Department extends React.Component<any, any> {
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

      // map data from Ajax call to fit the Link type [{title: 'link', ld: 1}, ...]
      _.map(data,(n:any)=>{
        if(n.ldRole.toUpperCase().indexOf("REGIONAL") == -1
            && n.ldRole.toUpperCase().indexOf("DISTRICT") == -1
            && n.ldRole.toUpperCase().indexOf("GENERAL") == -1)
        temp.push(
          {
            ldEmployeePhone: n.ldEmployeePhone,
            ldEmployeeName: n.ldEmployeeName,
            ldRole: n.ldRole,
            ldBranchCode: n.ldBranchCode,
            ldEmployeeEmail: n.ldEmployeeEmail
          });
      });

      this.setState({
          employee: temp
      });
    });
  }
  createCardWrap(index:number){
    if(index % 2 == 1) return;
    return(
      <div className="card-wraps" key={index}>
      {this.createCard(this.state.employee[index])}
      {this.createCard(this.state.employee[index + 1])}
      </div>
    )
  }
  createCard(employee:EmployeeEntry){
    if(employee == null) return <div></div>
    return (
      <div className="card">
        <strong>{employee.ldEmployeeName}</strong>
        <br />
        <em>{employee.ldRole}</em>
        <br />
        <a href={"mailto:" + employee.ldEmployeeEmail + "rushenterprises.com"}>{employee.ldEmployeeEmail}rushenterprises.com</a>
        <br />
        <em>{employee.ldEmployeePhone}</em>
      </div>
    )
  }
  render(){
    return (
      <div>
        {this.state.employee.map( (department, index) => {
          return this.createCardWrap(index)
        })}
      </div>
    )
  }
  showComponent() {
    render(
      <Department />,
      document.getElementById('location-departments'));
  }
}
