import * as Q from 'q';
import {getJson, SearchResults} from './shared';

let articleRootUrl = '/sites/newshub/company-news';

export class NewsFeed {
  constructor() {
  }  
  getSearchResults(contentType:string){
    var deferred = Q.defer();    
    // will return on 5 records, &rowlimit=5
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
      'PublishingPageContentOWSHTML'
    ];
    
    var search = `/sites/rushnet/_api/search/
      query?querytext='contenttype:${contentType}'      
      &rowlimit=5
      &selectproperties='${selectProps.join(', ')}'
      &refinementfilters='GlobalOWSBOOL:true'
      &sortlist='RefinableDate00:descending'
      &clienttype='WebService'`;
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
              url: `${articleRootUrl}/${article.owstaxidNewsCategory}/${article.listItemId}/${article.Title}`,
              pubStartDate: article.RefinableDate00,
              image: article.PublishingRollupImageOWSIMGE,
              html: article.PublishingPageContentOWSHTML
            });
          }
        }
      })

      //console.log(JSON.stringify(_articles,null,4));
      deferred.resolve(_articles);

    }, (error)=>{
      deferred.reject(`error! ${JSON.stringify(error,null,4)}`); 
      //console.log(`Error: ${JSON.stringify(error,null,4)}`);                     
    });

    return deferred.promise;
  }
}
