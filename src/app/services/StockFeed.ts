// var stockFeedUrl = 'https://apps.shareholder.com/irxml/irxml.aspx?COMPANYID=RUSH&PIN=268047160&FUNCTION=StockQuote&OUTPUT=xml&TICKER=RUSHA,RUSHB';
// var stockHolderScriptUrl = 'https://apps.shareholder.com/irxml/irxml.aspx?COMPANYID=RUSH&PIN=fd0e6ce59e576cae7947731dca65798a&FUNCTION=StockQuote&OUTPUT=js2&TICKER=RUSHA%2CRUSHB';
// declare var irxmlstockquote:any; // will be available when stockholder script is executed, using $.getScript to load this script into the global scope
var _url = 'https://rushnetapi.azurewebsites.net/api/stocks';

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
  // fetch() {
  //   var deferred = $.Deferred();
  //   var _results = [],
  //     tempObj = {},
  //     ticker,
  //     lastPrice,
  //     change,
  //     previousClose,
  //     percentage;
  //   $.getScript( stockHolderScriptUrl, function( data, textStatus, jqxhr ) {
  //     _.each(irxmlstockquote, function( stock:any, index ) {
  //       //console.log(JSON.stringify(stock,null,4));
  //       ticker = stock.ticker.slice(-1); // last letter of word i.e. A or B;
  //       lastPrice = parseFloat(stock.lastprice).toFixed(2);
  //       change = parseFloat(stock.change).toFixed(2);
  //       previousClose = parseFloat(stock.previousclose).toFixed(2);
  //       percentage = (change / previousClose) * 100;
  //
  //       tempObj['ticker'] = ticker;
  //       tempObj['lastPrice'] = lastPrice;
  //       tempObj['change'] = change;
  //       tempObj['percentage'] = parseFloat(percentage).toFixed(2);
  //
  //       _results[index] = tempObj;
  //       tempObj = {}; // reset object
  //     });
  //     deferred.resolve(_results);
  //   })
  //   .fail(function( jqxhr, settings, exception){
  //     console.error('Error in StockFeedService fetch(): ', exception);
  //     deferred.reject(exception);
  //   });
  //   return deferred.promise();
  // }
}
