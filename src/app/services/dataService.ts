export class DataService {
  constructor(message?: string){
    // if (message){
    //   //console.info(message);
    // }
  }
  getSPUser() {
    var deferred = $.Deferred();
    $.get(
      _spPageContextInfo.webAbsoluteUrl + "/_api/Web/CurrentUser?$select=Email",
      (data:any, status: string)=>{
        //console.info('User Email:', data);
        deferred.resolve(data);
      }, 'json').fail((sender, args)=>{
        deferred.reject(sender, args);
        console.info('Error: ' + args.get_message());
      });
    return deferred.promise();
  }
  getListItems(site:string, listName:string, listColumns:string[]) {
    // use jquery to call the REST endpoint
    var deferred = $.Deferred();
    $.get(
      "https://rushenterprises.sharepoint.com/sites/" + site + "/_api/web/Lists/GetByTitle('" + listName + "')/items?$select=" + listColumns.join(','),
      (data:any)=>{
        //console.info('data.value', JSON.stringify(data.value,null,4));
        deferred.resolve(data.value);
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
      "https://rushenterprises.sharepoint.com/sites/" + site + "/_api/web/Lists/GetByTitle('" + listName + "')/items?$select=" + listColumns.join(',')+"&$filter="+filter,
      (data:any)=>{
        //console.info('data.value', JSON.stringify(data.value,null,4));
        deferred.resolve(data.value);
      }, 'json').fail((sender, args)=>{
        console.error(args, 'status:', sender.status,'$.get() in getListItemsWithFilter() failed!');
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
        _spPageContextInfo.webAbsoluteUrl + "/_api/Web/CurrentUser?$select=Id",
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
        url: _spPageContextInfo.webAbsoluteUrl + '/_api/web/GetUserById('+ userId +')/Groups',
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
