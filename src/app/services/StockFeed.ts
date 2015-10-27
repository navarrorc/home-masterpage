var stockFeedUrl = 'https://apps.shareholder.com/irxml/irxml.aspx?COMPANYID=RUSH&PIN=268047160&FUNCTION=StockQuote&OUTPUT=xml&TICKER=RUSHA,RUSHB';

export class StockFeedService {
  fetch() {
    var _results = [],
      deferred = $.Deferred(),
      tempObj = {};

      // make call to retrieve xml
      $.ajax({
        url: stockFeedUrl,
        dataType: 'xml'
      }).done((data:any)=>{
        $('ROW', data).each(function(index, value){
          // console.log(value);
          tempObj['ask'] = $('ASK', value).text();
          tempObj['ticker'] = $('TICKER', value).text();
          _results[index] = tempObj;
          tempObj = {}; // reset object
        })

        deferred.resolve(_results);
      }).fail((jqHXR:any, textStatus:string)=>{
        console.error('Error in StockFeedService fetch()');
        deferred.reject(textStatus);
      })

      return deferred.promise();
  }

}

// var FeedParser = require('feedparser');
// var request = require('request');
//
// var req = request('https://apps.shareholder.com/irxml/irxml.aspx?COMPANYID=RUSH&PIN=268047160&FUNCTION=StockQuote&OUTPUT=xml&TICKER=RUSHA,RUSHB');
// var feedparser = new FeedParser();
//
// export class StockFeedService {
//   fetch(){
//     var data = [],
//         deferred = $.Deferred();
//
//     req.on('error', function (error) {
//       // handle any request errors
//     });
//     req.on('response', function (res) {
//       var stream = this;
//
//       if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
//
//       stream.pipe(feedparser);
//     });
//
//     /*FeedParser*/
//     feedparser.on('error', function(error) {
//       // always handle errors
//       deferred.reject(error);
//       console.error('Error: ', error);
//     });
//     feedparser.on('readable', function() {
//       // This is where the action is!
//       var stream = this
//         //, meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
//         , item;
//
//       while (item = stream.read()) {
//         data.push(item); // add item to array
//       }
//       if (data.length >= 10) { //TODO: figure out how to get the actual number of items in the feed
//         deferred.resolve(data);
//       }
//     });
//
//     return deferred.promise();
//   }
// }
