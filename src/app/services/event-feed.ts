import {getJson, SearchResults} from './shared';
// var _url = 'https://rushenterprises.sharepoint.com';
// var spSiteUrl = 'https://rushenterprises.sharepoint.com/sites/authoring'
//var listId = 'EE91A8C9-62E1-4024-83ED-1B312ED2BDA6';
//var listId = 'e1fa0831-d6fc-4857-8c04-c02e76fd8254'
// var eventRootUrl = 'https://rushenterprises.sharepoint.com/sites/eventshub/events/';

//declare var moment: any;

export class EventFeed {
  baseUrl: string;
  eventRootUrl: string;
  spSiteUrl: string;
  constructor(){
    let absUrl = _spPageContextInfo.webAbsoluteUrl;

    this.baseUrl = absUrl.substr(0, absUrl.lastIndexOf("/")+1); // includes forward slash e.g. https://rushnetrcn.sharepoint.com/sites/
    this.eventRootUrl = this.baseUrl + 'eventshub/events/';
    this.spSiteUrl = this.baseUrl + 'authoring';
  }
  getSearchResults(contentType){
    var selectProps = [
      'Title',
      'Path',
      'SPWebUrl',
      'Event-Start-DateOWSDATE',
      'Event-End-DateOWSDATE',
      //'owstaxIdRush-Department', // i.e. IT, Marketing, Corporate Communications
      //'rushEventCategory', // i.e. All Hands Meeting, Potluck
      'PublishingStartDateOWSDATE',
      'PublishingExpirationDateOWSDATE',
      'GlobalOWSBOOL', // 1 or 0
      'owstaxIdEventCategory',
      'listItemId',
      // 'refinablestring99'
      //'rfEventStartDate'
    ];
    var deferred = $.Deferred();
    var search = this.baseUrl + "rushnet" +
      "/_api/search/query?querytext='contenttype:" +
      "\"" + contentType + "\"" + // sourrounded by double quotes
      " SPSiteUrl:" + this.spSiteUrl +
      //" ListId:" + listId +
      "'&trimduplicates=false" +
      "&rowlimit=100" +
      "&selectproperties='" + selectProps.join(', ')  + "'"
      "&refinementfilters='isGlobal:true'"
      //"&sortlist='refinablestring99:ascending'" + // TODO: this does not have any effect, needs to be fixed
      //"&sourceid='32b9aef8-f8ed-4e70-9425-5be165962a4d'" +
      "&clienttype='WebService'";
    //console.log("EventFeed Url", search);
    getJson(search, (data)=>{
      var _queryReponse = data.d.query;
      var searchResults = SearchResults(_queryReponse);
      var _events = [],
          _sortedEvents = [];
      //console.log('Number of items:',searchResults.items.length);
      //console.log(JSON.stringify(searchResults.items,null,4));
      // searchResults.items.forEach((item)=>{
      //   console.log(item.owstaxIdEventCategory);
      // })
      _.each(searchResults.items, (event:any, index)=>{
        // get the events that have start date
        if (event['Event-Start-DateOWSDATE']){
          let publishStartDate = (event.PublishingStartDateOWSDATE) ? moment(event.PublishingStartDateOWSDATE) : null;
          let timeZoneOffset = new Date().getTimezoneOffset();
          let publishExpirationDate = (event.PublishingExpirationDateOWSDATE) ? moment(event.PublishingExpirationDateOWSDATE) : null;
          let today = moment();
          if ( (publishStartDate <= today || publishStartDate === null) && (publishExpirationDate >= today || publishExpirationDate === null)  ) {
              // Note: this seems to also validate when the publishStartDate is null, no need to explicitely check for that.
              // where StartDate <= {Today} OR is null AND EndDate >= {Today} OR is null
            _events.push({
              title:  event.Title,
              url: this.eventRootUrl + event.owstaxIdEventCategory + '/' + event.listItemId + '/' + event.Title,
              start: moment(event['Event-Start-DateOWSDATE']).local(),
              end: moment(event['Event-End-DateOWSDATE']).local()
            });
          }
        }
      })

      //console.log(JSON.stringify(_events,null,4));
      _sortedEvents = _.sortBy(_events, (event)=>{
        return event.start;
      })
      //console.log(JSON.stringify(_sortedEvents,null,4));
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
