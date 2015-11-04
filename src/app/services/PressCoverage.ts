import {config} from './Shared';
var _url = config.api_url + '/news';

export class PressService {
  fetch() {
    var _feeds = [],
      deferred = $.Deferred();
    $.ajax({
  		url: _url,
  		dataType: 'json',
      headers: {'ApplicationIdentity': 'RushNetIntranet'}
  	}).done((data:any)=>{
  			// console.log(JSON.stringify(data,null,4));
        _feeds = data;
        deferred.resolve(_feeds);
  	}).fail((jqHXR:JQueryXHR, textStatus:string, errorThrown:any)=>{
  		console.error(jqHXR.responseText || textStatus);
      deferred.reject(errorThrown);
  	})
    return deferred.promise();
  }
}
