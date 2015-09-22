module Services {
  export class DataService {
    constructor(message: string){
      console.info(message);
    }
    getSPUser() {
      var deferred = $.Deferred();
      SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ()=>{
        var context = SP.ClientContext.get_current();
        var oWeb = context.get_web();
        var currentUser = oWeb.get_currentUser();
        context.load(currentUser);
        context.executeQueryAsync(()=>{
          var user = currentUser;
          deferred.resolve(user);
        }, (sender, args)=>{
          deferred.reject(sender,args);
          console.info('Error: ' + args.get_message());
        });
      });
      return deferred.promise();
    }
  }
}
