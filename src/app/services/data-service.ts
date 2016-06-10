// declare var _spPageContextInfo:any;
export class DataService { 
  // baseUrl: string;
  // absUrl: string;
  constructor(){    
    // this.absUrl = url;
    // this.baseUrl = this.absUrl.substr(0, this.absUrl.lastIndexOf("/")+1); // includes forward slash e.g. https://rushnetrcn.sharepoint.com/sites/   
  }
  
  getTermName(id) {
    let deferred = Q.defer();   
    let scriptbase = _spPageContextInfo.webServerRelativeUrl + "/_layouts/15/";      

    function getTerm()
    {
        var context = SP.ClientContext.get_current();         
        var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);  
        var term=taxSession.getTerm(id);
        context.load(term);
        context.executeQueryAsync(function() {
          // console.log(term.get_name());
          deferred.resolve(term.get_name());
        },
        function(error) {
          deferred.reject(`error! ${JSON.stringify(error,null,4)}`);                      
          //console.log(`Error: ${JSON.stringify(error,null,4)}`);
        });
    }

    $.getScript(scriptbase + "SP.Taxonomy.js", getTerm);   
    return deferred.promise;
  };
  
  getSPUser() {
    let deferred = Q.defer();   
    let url = "/sites/rushnet/_api/Web/CurrentUser?$select=Email";
    //console.log('url:', url); 
    $.get(
      url,      
      (data:any, status: string)=>{ 
        //console.log('data', data);       
        deferred.resolve(data);
      }, 'json').fail((error)=>{        
        deferred.reject(`error! ${JSON.stringify(error,null,4)}`);                      
        //console.log(`Error: ${JSON.stringify(error,null,4)}`);
      });
    return deferred.promise;
  }
  getListItems(site:string, listName:string, listColumns:string[]) {    
    let deferred = Q.defer();
    let url = `/sites/${site}/_api/web/Lists/GetByTitle('${listName}')/items?$select=${listColumns.join(',')}`; 
    $.get(     
      url,
      (data:any)=>{
        //console.log('data', JSON.stringify(data,null,4));        
        deferred.resolve(data.value);
      }, 'json').fail((error)=>{
        deferred.reject(`error! ${JSON.stringify(error,null,4)}`);
        //console.log(`Error: ${JSON.stringify(error,null,4)}`);        
      });
      return deferred.promise;
  }
  getListItemsTop200(site:string, listName:string, listColumns:string[]) {
    // use jquery to call the REST endpoint
    var deferred = Q.defer()
    let url = `/sites/${site}/_api/web/Lists/GetByTitle('${listName}')/items?$select=${listColumns.join(',')}&$top=200`;    
    $.get(
      //this.baseUrl + site  + "/_api/web/Lists/GetByTitle('" + listName + "')/items?$select=" + listColumns.join(',') + "&$top=200",
      url,
      (data:any)=>{
        //console.info('data.value Count', data.value.length);
        deferred.resolve(data.value);
      }, 'json').fail((error)=>{
        deferred.reject(`error! ${JSON.stringify(error,null,4)}`);
        //console.log(`Error: ${JSON.stringify(error,null,4)}`); 
      });
      return deferred.promise;
  }
  getSingleListItem(site:string, listName:string, listColumns:string[], itemId:number) {   
    // use jquery to call the REST endpoint
    var deferred = $.Deferred();
    let url = `/sites/${site}/_api/web/Lists/GetByTitle('${listName}')/items(${itemId})?$select=${listColumns.join(',')}`;  
    $.get(
      //this.baseUrl + site + "/_api/web/Lists/GetByTitle('" + listName + "')/items(" + itemId + ")?$select=" + listColumns.join(','),
      url,
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
    var deferred = Q.defer();
    let url = `/sites/${site}/_api/web/Lists/GetByTitle('${listName}')/items?$select=${listColumns.join(',')}&$filter=${filter}`;
    // console.log(`url: ${url}`);  
    $.get(
      url,
      (data:any)=>{
        //console.log(JSON.stringify(data,null,4));
        deferred.resolve(data.value);
      }, 'json').fail((error)=>{
        deferred.reject(`error! ${JSON.stringify(error,null,4)}`);
        //console.log(`Error: ${JSON.stringify(error,null,4)}`);
      });
      return deferred.promise;
  }
  getListItemsWithPaging(site:string, listName:string, listColumns:string[]) {
    // use jquery to call the REST endpoint
    var deferred = Q.defer();
    let url = `/sites/${site}/_api/web/Lists/GetByTitle('${listName}')/items?$select=${listColumns.join(',')}&$top=200`; 
    $.get(
      //this.baseUrl + site + "/_api/web/Lists/GetByTitle('" + listName + "')/items?$select=" + listColumns.join(','),
      url,
      (data:any)=>{
        //console.info('data.value', JSON.stringify(data.value,null,4));
        deferred.resolve({ values: data.value, nextLink: data["odata.nextLink"] });
      }, 'json').fail((error)=>{
        deferred.reject(`error! ${JSON.stringify(error,null,4)}`);
        //console.log(`Error: ${JSON.stringify(error,null,4)}`);
      });
      return deferred.promise;
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
        "/sites/rushnet/_api/Web/CurrentUser?$select=Id",
        (data:any, status: string)=>{
          //deferred.resolve(data);
          fetchCurrentUsersGroups(data.Id);
        }, 'json').fail((sender, args)=>{
          //deferred.reject(sender, args);
          console.error('Error: ' + args);
        });
      return deferred.promise();
    }

    function fetchCurrentUsersGroups(userId:string){
      $.ajax({
        url: '/sites/rushnet/_api/web/GetUserById('+ userId +')/Groups',
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