import {getJson, SearchResults} from './shared';

var listId = 'EE91A8C9-62E1-4024-83ED-1B312ED2BDA6';
var articleRootUrl = '/sites/newshub/company-news/';

export class NewsFeed {
  baseUrl: string;
  eventRootUrl: string;
  spSiteUrl: string;
  constructor() {
    let absUrl = _spPageContextInfo.webAbsoluteUrl;

    this.baseUrl = absUrl.substr(0, absUrl.lastIndexOf("/") + 1); // includes forward slash e.g. https://rushnetrcn.sharepoint.com/sites/
    this.eventRootUrl = this.baseUrl + 'eventshub/events/';
    this.spSiteUrl = this.baseUrl + 'authoring';
  }  
  getSearchResults(contentType){
    // will return on 5 records, see the &rowlimit=5
    var selectProps = [
      'Title',
      'RefinableDate00', // mapped to ows_q_DATE_ArticleStartDate crawled property
      'PublishingStartDateOWSDATE ', // publishing start date
      'PublishingExpirationDateOWSDATE', // publishing end date
      'PublishingRollupImageOWSIMGE',
      'GlobalOWSBOOL', // 1 or 0
      'listItemId',
      'owstaxidNewsCategory',
      'ArticleByLineOWSTEXT',
    ];
    var deferred = $.Deferred();
    var search = this.baseUrl + "rushnet" +
      "/_api/search/query?querytext='contenttype:" +
      "\"" + contentType + "\"" + // sourrounded by double quotes
      " SPSiteUrl:" + this.spSiteUrl + "'" +
      "&rowlimit=5" +
      "&selectproperties='" + selectProps.join(', ') + "'" +
      "&refinementfilters='GlobalOWSBOOL:true'" +
      "&sortlist='RefinableDate00:descending'" + // mapped to ows_q_DATE_ArticleStartDate
      "&clienttype='WebService'";
    //console.log("search:", search);    

    getJson(search, (data)=>{
      var _queryReponse = data.d.query,
          searchResults = SearchResults(_queryReponse),
          _articles = [];      
                
      _.each(searchResults.items, (article:any, index)=>{   
        //console.log('article.RefinableDate00', article.RefinableDate00);             
        // get the events that have and article date
        if (article.RefinableDate00){
          let publishStartDate = (article.PublishingExpirationDateOWSDATE) ? new Date(article.PublishingStartDateOWSDATE) : null;
          let publishExpirationDate = (article.PublishingExpirationDateOWSDATE) ? new Date(article.PublishingExpirationDateOWSDATE) : null;
          let today = new Date();
          if ( (publishStartDate <= today || publishStartDate === null) && ( (publishExpirationDate >= today) || (publishExpirationDate === null)) ) {            
            _articles.push({
              title: article.Title,
              byLine: (article.ArticleByLineOWSTEXT === null) ? '[no byline found]' : article.ArticleByLineOWSTEXT,
              url: articleRootUrl + article.owstaxidNewsCategory + '/' + article.listItemId + '/' + article.Title,
              pubStartDate: article.RefinableDate00,
              image: article.PublishingRollupImageOWSIMGE
            });
          }
        }
      })

      //console.log(JSON.stringify(_articles,null,4));
      deferred.resolve(_articles);

    }, (error)=>{
      console.log(JSON.stringify(error));
      deferred.reject(error);
    });

    return deferred.promise();
  }

}
