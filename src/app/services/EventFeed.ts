function getJson(endpointUri, success, error)
{
    $.ajax({
       url: endpointUri,
       type: "GET",
       processData: false,
       contentType: "application/json;odata=verbose",
       headers: {
          "Accept": "application/json;odata=verbose"
       },
       success: success,
       error: error
    });
}
function convertRowsToObjects(itemRows) {
var items = [];
//foreach row in the result set
for (var i = 0; i < itemRows.length; i++) {
	var row = itemRows[i], item = {};
	//Each cell in the row is a key/value pair, save each one as an object property
	for (var j = 0; j < row.Cells.results.length; j++) {
		item[row.Cells.results[j].Key] = row.Cells.results[j].Value;
	}

	items.push(item);
}
	return items;
};

function SearchResults(queryResponse) {
   var results = {
     elapsedTime:queryResponse.ElapsedTime,
     suggestion: queryResponse.SpellingSuggestion,
     resultsCount: queryResponse.PrimaryQueryResult.RelevantResults.RowCount,
     totalResults: queryResponse.PrimaryQueryResult.RelevantResults.TotalRows,
     totalResultsIncludingDuplicates: queryResponse.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates,
     items: convertRowsToObjects(queryResponse.PrimaryQueryResult.RelevantResults.Table.Rows.results)
   };
   return results;
}

export class EventFeed {
  getSearchResuls(){
    var _url = 'https://rushenterprises.sharepoint.com' + "/_api/search/query?querytext='contenttype:Corporate Event'&selectproperties='Title,Path,SPWebUrl,PublishingRollupImageOWSIMGE'";
    //var _url = 'https://rushenterprises.sharepoint.com/sites/news' + "/_api/search/query?querytext='contenttype:Corporate Event'&selectproperties='Title,Path,SPWebUrl,PublishingImage,PublishingRollupImageOWSIMGE,rEventStartDate'";
    getJson(_url, (data)=>{
      var _queryReponse = data.d.query;
      var searchResults = SearchResults(_queryReponse);
      console.log(JSON.stringify(searchResults,null,4));
    }, (error)=>{
      console.log(JSON.stringify(error));
    });
  }

  getPublishingPage(webUrl,listName,listItemTitle,publishingProperties, success, failure)
  {
      //var itemUri =  webUrl + "/_api/web/lists/getbytitle('" + listName + "')/items(" + listItemId + ")";
      var itemUri =  webUrl + "/_api/web/lists/getbytitle('" + listName + "')/items?$filter=Title eq '" + listItemTitle + "'";
      getJson(itemUri,
         function(data){
             var pageItem = data.d.results[0];

             var selectProperties = [];
             for(var idx in publishingProperties){
                 if(!pageItem.hasOwnProperty(publishingProperties[idx])){
                     selectProperties.push(publishingProperties[idx]);
                 }
             }
             if(selectProperties.length > 0) {
                //construct an additional query
                var query = '/FieldValuesAsHtml?$select=' + selectProperties.join(',');
                //console.log(JSON.stringify(pageItem,null,4));
                //console.log(pageItem['__metadata'].uri);
                var endpointUri = pageItem['__metadata'].uri + query;
                getJson(endpointUri,
                   function(data){
                      for(var property in data.d){
                         if(property == "__metadata") continue;
                         pageItem[property] = data.d[property];
                      }
                      success(pageItem);
                   },
                   failure);
             }
             else {
                success(pageItem);
             }
          },
         failure);
  }

}
