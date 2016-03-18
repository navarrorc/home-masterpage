// declare var _spPageContextInfo:any;
export class DataService { 
  baseUrl: string;
  absUrl: string;
  constructor(url:string){
    // interface Layout {
    //   webAbsoluteUrl: string;
    // } 
    // var _spPageContextInfo: Layout = { webAbsoluteUrl:''};
        
    //let absUrl = _spPageContextInfo.webAbsoluteUrl;
    this.absUrl = url;
    this.baseUrl = this.absUrl.substr(0, this.absUrl.lastIndexOf("/")+1); // includes forward slash e.g. https://rushnetrcn.sharepoint.com/sites/   
  }
  getSPUser() {
    var deferred = Q.defer();   
    //console.log(this.absUrl);
    $.get(
      this.absUrl + "/_api/Web/CurrentUser?$select=Email",      
      (data:any, status: string)=>{ 
        console.log('data', data);       
        deferred.resolve(data);
      }, 'json').fail((error)=>{        
        deferred.reject(`error! ${JSON.stringify(error,null,4)}`);              
        //console.log(`Error: ${JSON.stringify(error,null,4)}`);
      });
    // $.get(
    //   this.absUrl + "/_api/Web/CurrentUser?$select=Email",      
    //   cb, 'json').fail((error)=>{        
    //     deferred.reject(`error! ${JSON.stringify(error,null,4)}`);              
    //     //console.log(`Error: ${JSON.stringify(error,null,4)}`);
    //   });
    return deferred.promise;
  }
  getListItems(site:string, listName:string, listColumns:string[]) {

    // use jquery to call the REST endpoint
    var deferred = $.Deferred();
    $.get(
      this.baseUrl + site + "/_api/web/Lists/GetByTitle('" + listName + "')/items?$select=" + listColumns.join(','),
      (data:any)=>{
        //console.info('data.value', JSON.stringify(data.value,null,4));
        deferred.resolve(data.value);
      }, 'json').fail((sender, args)=>{
        console.error(args, 'status:', sender.status,'$.get() in getListItems() failed!');
        deferred.reject("Ajax call failed in getTopLinks()");
      });
      return deferred.promise();
  }
  getListItemsTop200(site:string, listName:string, listColumns:string[]) {
    // use jquery to call the REST endpoint
    var deferred = $.Deferred();
    $.get(
      this.baseUrl + site + "/_api/web/Lists/GetByTitle('" + listName + "')/items?$select=" + listColumns.join(',') + "&$top=200",
      (data:any)=>{
        //console.info('data.value', JSON.stringify(data.value,null,4));
        deferred.resolve(data.value);
      }, 'json').fail((sender, args)=>{
        console.error(args, 'status:', sender.status,'$.get() in getListItems() failed!');
        deferred.reject("Ajax call failed in getTopLinks()");
      });
      return deferred.promise();
  }
  getSingleListItem(site:string, listName:string, listColumns:string[], itemId:number) {   
    // use jquery to call the REST endpoint
    var deferred = $.Deferred();
    $.get(
      this.baseUrl + site + "/_api/web/Lists/GetByTitle('" + listName + "')/items(" + itemId + ")?$select=" + listColumns.join(','),
      (data:any)=>{
        // console.info('data', JSON.stringify(data.value,null,4));
        deferred.resolve(data);
      }, 'json').fail((sender, args)=>{
        console.error(args, 'status:', sender.status,'$.get() in getListItems() failed!');
        deferred.reject("Ajax call failed in getTopLinks()");
      });
      return deferred.promise();
  }
  getListItemsWithFilter(site:string, listName: string, listColumns:string[], filter: string){    
    // use jquery to call the REST endpoint
    var deferred = $.Deferred();
    $.get(
      this.baseUrl + site + "/_api/web/Lists/GetByTitle('" + listName + "')/items?$select=" + listColumns.join(',')+"&$filter="+filter,
      (data:any)=>{
        //console.info('data.value', JSON.stringify(data.value,null,4));
        deferred.resolve(data.value);
      }, 'json').fail((sender, args)=>{
        console.error(args, 'status:', sender.status,'$.get() in getListItemsWithFilter() failed!');
        deferred.reject("Ajax call failed in getTopLinks()");
      });
      return deferred.promise();
  }
  getListItemsWithPaging(site:string, listName:string, listColumns:string[]) {
    // use jquery to call the REST endpoint
    var deferred = $.Deferred();
    $.get(
      this.baseUrl + site + "/_api/web/Lists/GetByTitle('" + listName + "')/items?$select=" + listColumns.join(','),
      (data:any)=>{
        //console.info('data.value', JSON.stringify(data.value,null,4));
        deferred.resolve({ values: data.value, nextLink: data["odata.nextLink"] });
      }, 'json').fail((sender, args)=>{
        console.error(args, 'status:', sender.status,'$.get() in getListItems() failed!');
        deferred.reject("Ajax call failed in getTopLinks()");
      });
      return deferred.promise();
  }
  getListItemsWithPagingLink(nextLink:string) {
    // use jquery to call the REST endpoint
    var deferred = $.Deferred();
    $.get(
      nextLink,
      (data:any)=>{
        //console.info('data.value', JSON.stringify(data.value,null,4));
        deferred.resolve({ values: data.value, nextLink: data["odata.nextLink"] });
      }, 'json').fail((sender, args)=>{
        console.error(args, 'status:', sender.status,'$.get() in getListItems() failed!');
        deferred.reject("Ajax call failed in getTopLinks()");
      });
      return deferred.promise();
  }
  getGroups() {
    var deferred = $.Deferred();

    fetchCurrentUserId();

    function fetchCurrentUserId() {
      //var deferred = $.Deferred();
      $.get(
        this.absUrl + "/_api/Web/CurrentUser?$select=Id",
        (data:any, status: string)=>{
          //deferred.resolve(data);
          fetchCurrentUsersGroups(data.Id);
        }, 'json').fail((sender, args)=>{
          //deferred.reject(sender, args);
          console.error('Error: ' + args);
        });
      return deferred.promise();
    }

    function fetchCurrentUsersGroups(userId){
      $.ajax({
        url: this.absUrl + '/_api/web/GetUserById('+ userId +')/Groups',
        headers: {"Accept": "application/json;odata=verbose"}
      }).done((data:any)=>{
        var _groups = [];
        var results = data.d.results;
        for (var i = 0; i < results.length; i++) {
            _groups.push(results[i].Title);
        }
        deferred.resolve(_groups);
      }).fail((jqHXR:any, textStatus:string)=>{
        console.error('Error in fetchCurrentUsersGroups');
        deferred.reject(textStatus);
      })
    }

    return deferred.promise();
  }
}