import {getJson, SearchResults} from './Shared';
var _url = 'https://rushenterprises.sharepoint.com/sites/authoring';


export class EventFeed {
  getSearchResults(contentType){
    var selectProps = [
      'Title',
      'Path',
      'SPWebUrl',
      'rushEventStartDate',
      'rushEventEndDate',
      'rushDepartment', // i.e. IT, Marketing, Corporate Communications
      'rushEventCategory', // i.e. All Hands Meeting, Potluck
      'StartDate', // PublishingStartDate
      'EndDate', // PublishingExpirationDate
      'isGlobal' // 1 or 0
    ];
    var deferred = $.Deferred();
    var search = _url +
      "/_api/search/query?querytext='contenttype:" +
      contentType +"'&selectproperties='" +
      selectProps.join(', ') + "'&clienttype='WebService'";

    getJson(search, (data)=>{
      var _queryReponse = data.d.query;
      var searchResults = SearchResults(_queryReponse);
      var _events = [],
          _sortedEvents = [];
      //console.log(JSON.stringify(searchResults.items,null,4));
      _.each(searchResults.items, (event:any, index)=>{
        // get the events that have start date
        if (event.rushEventStartDate){
          let publishStartDate = new Date(event.StartDate);
          let publishExpirationDate = (event.EndDate) ? new Date(event.EndDate) : null;
          let today = new Date();
          if ( publishStartDate <= today && ( (publishExpirationDate >= today) || (publishExpirationDate === null) )  ) {
            // where StartDate <= {Today} AND EndDate >= {Today} OR EndDate == null
            _events.push({
              title: event.Title,
              url: event.Path,
              pubStartDate: publishStartDate,
              pubExpirationDate: publishExpirationDate,
              start: event.rushEventStartDate,
              end: event.rushEventEndDate
            });
          }
        }
      })

      console.log(JSON.stringify(_events,null,4));

      _sortedEvents = _.sortBy(_events, (event)=>{
        return event.start;
      })

      deferred.resolve(_sortedEvents);

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
