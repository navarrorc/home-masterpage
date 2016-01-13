declare var unescape: any;
declare var escape: any;
declare var window: any;

//https://rushenterprises.sharepoint.com/_layouts/15/userphoto.aspx

export class UserProfile {
  getSPUserProfileData(email:string) {
    // let email = getQueryStringValue('email');
    // var firstName,
    //   lastName,
    //   pictureUrl,
    //   title,
    //   location,
    //   phoneNumber;
    //
    // var properties = getUserProfileProperties(email).then((data:any)=>{
    //   // console.log(JSON.stringify(data,null,4));
    //
    //   var userPeers = data.Peers.results;
    //   var userManagers = data.ExtendedManagers.results;
    //   var directReports = data.DirectReports.results;
    //   var userProfileProperties = data.UserProfileProperties.results;
    //
    //   console.log(userPeers);
    //   console.log(userManagers);
    //   console.log(directReports);
    //   console.log(userProfileProperties);
    //
    //   let firstName = _.filter(userProfileProperties, function(p:any) { return p.Key === 'FirstName'; })[0].Value;
    //   let lastName = _.filter(userProfileProperties, function(p:any) { return p.Key === 'LastName'; })[0].Value;
    //   let pictureUrl = _.filter(userProfileProperties, function(p:any) { return p.Key === 'PictureURL'; })[0].Value;
    //   let title = _.filter(userProfileProperties, function(p:any) { return p.Key === 'Title'; })[0].Value;
    //   let location = _.filter(userProfileProperties, function(p:any) { return p.Key === 'SPS-Location'; })[0].Value;
    //   let phoneNumber = _.filter(userProfileProperties, function(p:any) { return p.Key === 'WorkPhone'; })[0].Value;
    //   console.log(firstName);
    //   console.log(lastName);
    //   console.log(pictureUrl);
    //   console.log('===========================');
    //   console.log(title);
    //   console.log(location);
    //   console.log(email);
    //   console.log(phoneNumber);
    // });
    return getUserProfileProperties(email);


    function getQueryStringValue (key) {
      return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }
    function getUserProfileProperties(email:string){
      var deferred = $.Deferred();
      var requestHeaders = {
        "Accept": "application/json;odata=verbose"
      };
      jQuery.ajax({
        // _api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='LastName')?@v='i:0%23.f|membership|vardhaman@siteurl.onmicrosoft.com'
        url:_spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='i:0%23.f|membership|"+email+"'",
        type:"GET",
        contentType : "application/json;odata=verbose",
        headers: requestHeaders,
        success:function(data){
          //console.log(JSON.stringify(data.d.GetUserProfilePropertyFor,null,4));
          var obj = data;
          var rootObj = obj['d'];
          // var userProps = rootObj['UserProfileProperties'];
          // var results = userProps['results'];
          deferred.resolve(rootObj);
        },
        error:function(jqxr,errorCode,errorThrown){
          console.log(jqxr.responseText);
          deferred.reject("Ajax call failed in UserProfile");
        }
      });
      return deferred.promise();
    }
    function getProfileProperty(email:string, property:string){
      var deferred = $.Deferred();
      var requestHeaders = {
      	"Accept": "application/json;odata=verbose",
      	"X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
      };
      jQuery.ajax({
        // _api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='LastName')?@v='i:0%23.f|membership|vardhaman@siteurl.onmicrosoft.com'
        url:_spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetUserProfilePropertyFor(accountName=@v,propertyName='"+property+"')?@v='i:0%23.f|membership|" + email + "'",
      	type:"GET",
      	contentType : "application/json;odata=verbose",
      	headers: requestHeaders,
      	success:function(data){
      		//console.log(JSON.stringify(data.d.GetUserProfilePropertyFor,null,4));
          deferred.resolve(data.d.GetUserProfilePropertyFor);
      	},
      	error:function(jqxr,errorCode,errorThrown){
      		console.log(jqxr.responseText);
          deferred.reject("Ajax call failed in UserProfile");
      	}
      });
      return deferred.promise();
    }
  }
}
