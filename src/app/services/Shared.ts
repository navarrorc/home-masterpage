declare var unescape: any;
declare var escape: any;

// Internal Helpers Functions
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

export function SearchResults(queryResponse) {
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

export function getJson(endpointUri, success, error)
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

export var config = {   
    api_url: 'https://rushnet-api.azurewebsites.net/api',
    //abs_url: 'https://rushnetrcn.sharepoint.com/sites/rushnet',
    // abs_url: 'https://rushenterprises.sharepoint.com/sites/rushnet',
};

export function getQueryStringValue (key) {
      return unescape(window.location.search.replace(
        new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + 
            "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
