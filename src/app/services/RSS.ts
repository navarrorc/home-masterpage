var FeedParser = require('feedparser');
var request = require('request');

var req = request('https://meltwaternews.com/magenta/xml/html/10/51/rss/v2_323433_hitsentence.rss2.XML');
var feedparser = new FeedParser();

export class RssService {
  fetch(){
    var data = [],
        deferred = $.Deferred();

    req.on('error', function (error) {
      // handle any request errors
    });
    req.on('response', function (res) {
      var stream = this;

      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

      stream.pipe(feedparser);
    });

    /*FeedParser*/
    feedparser.on('error', function(error) {
      // always handle errors
      deferred.reject(error);
      console.error('Error: ', error);
    });
    feedparser.on('readable', function() {
      // This is where the action is!
      var stream = this
        //, meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
        , item;

      while (item = stream.read()) {
        data.push(item); // add item to array
      }
      if (data.length >= 10) { //TODO: figure out how to get the actual number of items in the feed
        deferred.resolve(data);
      }
    });

    return deferred.promise();
  }
}
