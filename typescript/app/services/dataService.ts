export class DataService {
  constructor(message?: string){
    if (message){
      console.info(message);
    }
  }
  getSPUser() {
    var deferred = $.Deferred();
    // SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ()=>{
    //   var context = SP.ClientContext.get_current();
    //   var oWeb = context.get_web();
    //   var currentUser = oWeb.get_currentUser();
    //   context.load(currentUser);
    //   context.executeQueryAsync(()=>{
    //     var user = currentUser;
    //     deferred.resolve(user);
    //   }, (sender, args)=>{
    //     deferred.reject(sender,args);
    //     console.info('Error: ' + args.get_message());
    //   });
    // });
    $.get(
      _spPageContextInfo.webAbsoluteUrl + "/_api/Web/CurrentUser?$select=Email",
      (data:any, status: string)=>{
        //console.info('User Email:', data.d.results);
        deferred.resolve(data);
      }, 'json').fail((sender, args)=>{
        deferred.reject(sender, args);
        console.info('Error: ' + args.get_message());
      });
    return deferred.promise();
  }
  getTopLinks() {
    // use jquery to call the REST endpoint
    var deferred = $.Deferred();
    $.get(
      _spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists/GetByTitle('TopLinks')/items?$select=Title,ID",
      (data:any)=>{
        //console.info('data.value', data.value);
        deferred.resolve(data.value);
      }, 'json').fail((sender, args)=>{
        console.error(args, 'status:', sender.status,'$.get() in getTopLinks() failed!');
        deferred.reject("Ajax call failed in getTopLinks()");
      });
      return deferred.promise();
  }
}
