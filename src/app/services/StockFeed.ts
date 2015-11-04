import {config} from './Shared';
var _url = config.api_url + '/stocks';

export class StockFeedService {
  fetch() {
    var _stocks = [],
      deferred = $.Deferred();
    $.ajax({
      url: _url,
      dataType: 'json',
      headers: {'ApplicationIdentity': 'RushNetIntranet'}
    }).done((data:any)=>{
        // console.log(JSON.stringify(data,null,4));
        _stocks = data;
        deferred.resolve(_stocks);
    }).fail((jqHXR:JQueryXHR, textStatus:string, errorThrown:any)=>{
      console.error(jqHXR.responseText || textStatus);
      deferred.reject(errorThrown);
    })
    return deferred.promise();
  }
}
