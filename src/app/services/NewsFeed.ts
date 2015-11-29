import {getJson, SearchResults} from './Shared';
var _url = 'https://rushenterprises.sharepoint.com/sites/authoring';


export class NewsFeed {
  getSearchResults(contentType){
    // will return on 5 records, see the &rowlimit=5
    var selectProps = [
      'Title',
      'Path',
      'ArticleStartDateOWSDATE ',
      'StartDate ', // publishing start date
      'EndDate', // publishing end date
      'PublishingRollupImageOWSIMGE',
      'isGlobal' // 1 or 0
    ];
    var deferred = $.Deferred();
    var search = _url +
      "/_api/search/query?querytext='contenttype:" +
      contentType +
      "'&rowlimit=5" +
      "'&selectproperties='" +
      selectProps.join(', ') + "'&refinementfilters='isGlobal:true'&clienttype='WebService'";

    getJson(search, (data)=>{
      var _queryReponse = data.d.query;
      var searchResults = SearchResults(_queryReponse);
      var _articles = [],
          _sortedArticles = [];
      _.each(searchResults.items, (article:any, index)=>{
        // get the events that have and article date
        if (article.ArticleStartDateOWSDATE){
          let publishStartDate = new Date(article.StartDate);
          let publishExpirationDate = (article.EndDate) ? new Date(article.EndDate) : null;
          let today = new Date();
          if ( publishStartDate <= today && ( (publishExpirationDate >= today) || (publishExpirationDate === null) )  ) {
            // where StartDate <= {Today} AND EndDate >= {Today} OR EndDate == null
            _articles.push({
              title: article.Title,
              url: article.Path,
              pubStartDate: article.ArticleStartDateOWSDATE,
              image: article.PublishingRollupImageOWSIMGE
            });
          }
        }
      })

      _sortedArticles = _.sortByOrder(_articles, ['pubStartDate'],['desc']);
      // data = _.sortByOrder(data, ['Position'], ['asc']);


      deferred.resolve(_sortedArticles);

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

}
