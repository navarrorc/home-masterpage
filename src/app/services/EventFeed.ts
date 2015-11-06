import {getJson, SearchResults} from './Shared';
var _url = 'https://rushenterprises.sharepoint.com/sites/authoring';


export class EventFeed {
  getSearchResults(contentType){
    var selectProps = [
      'Title',
      'Path',
      'SPWebUrl',
      'Event-Start-DateOWSDATE',
      'Event-End-DateOWSDATE'
    ];
    var deferred = $.Deferred();
    var search = _url +
      "/_api/search/query?querytext='contenttype:" +
      contentType +"'&selectproperties='" +
      selectProps.join(', ') + "'";

    getJson(search, (data)=>{
      var _queryReponse = data.d.query;
      var searchResults = SearchResults(_queryReponse);
      var _events = [];
      var _sortedEvents = [];
      _.each(searchResults.items, (event:any, index)=>{
        // get the events that have start date
        if (event['Event-Start-DateOWSDATE']){
          _events.push({
            title: event.Title,
            url: event.Path,
            start: event['Event-Start-DateOWSDATE'],
            end: event['Event-End-DateOWSDATE']
          });
        }
      })

      // function to_date(o) {
      //     var parts = o.start.split('-');
      //     o.start = new Date(parts[0], parts[1] - 1, parts[2]);
      //     return o;
      // }
      // function desc_start_time(o) {
      //     return -o.start.getTime();
      // }
      // _sortedEvents = _.chain(_events)
      //                 .map(to_date)
      //                 .sortBy(desc_start_time)
      //                 .value();
      //console.log(JSON.stringify(searchResults,null,4));
      deferred.resolve(_events);

    }, (error)=>{
      console.log(JSON.stringify(error));
      deferred.reject(error);
    });

    return deferred.promise();
  }
  getSearchResultsMock() {
    var _events = [{
    	title: 'All Day Event',
    	start: '2015-11-01'
    }, {
    	title: 'Long Event',
    	start: '2015-02-07',
    	end: '2015-11-10'
    }, {
    	id: 999,
    	title: 'Repeating Event',
    	start: '2015-11-30T16:00:00'
    }, {
    	id: 999,
    	title: 'Repeating Event',
    	start: '2015-11-25T16:00:00'
    }, {
    	title: 'Conference',
    	start: '2015-11-11',
    	end: '2015-11-17'
    }, {
    	title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    	start: '2015-11-19T10:30:00'
    }, {
    	title: 'Blood Drive Tuesday',
    	start: '2015-11-10T10:30:00'
    },{
    	title: 'November Meeting',
    	start: '2015-11-23T10:30:00'
    },{
    	title: 'Food Truck at Rush',
    	start: '2015-11-20T10:30:00'
    },{
    	title: 'November Meeting',
    	start: '2015-11-27T10:30:00'
    },{
    	title: 'Christams Day',
    	start: '2015-12-25T10:30:00'
    }];

    return _events;

  }
  // getPublishingPage(webUrl,listName,listItemTitle,publishingProperties, success, failure)
  // {
  //     //var itemUri =  webUrl + "/_api/web/lists/getbytitle('" + listName + "')/items(" + listItemId + ")";
  //     var itemUri =  webUrl + "/_api/web/lists/getbytitle('" + listName + "')/items?$filter=Title eq '" + listItemTitle + "'";
  //     getJson(itemUri,
  //        function(data){
  //            var pageItem = data.d.results[0];
  //
  //            var selectProperties = [];
  //            for(var idx in publishingProperties){
  //                if(!pageItem.hasOwnProperty(publishingProperties[idx])){
  //                    selectProperties.push(publishingProperties[idx]);
  //                }
  //            }
  //            if(selectProperties.length > 0) {
  //               //construct an additional query
  //               var query = '/FieldValuesAsHtml?$select=' + selectProperties.join(',');
  //               //console.log(JSON.stringify(pageItem,null,4));
  //               //console.log(pageItem['__metadata'].uri);
  //               var endpointUri = pageItem['__metadata'].uri + query;
  //               getJson(endpointUri,
  //                  function(data){
  //                     for(var property in data.d){
  //                        if(property == "__metadata") continue;
  //                        pageItem[property] = data.d[property];
  //                     }
  //                     success(pageItem);
  //                  },
  //                  failure);
  //            }
  //            else {
  //               success(pageItem);
  //            }
  //         },
  //        failure);
  // }
}
