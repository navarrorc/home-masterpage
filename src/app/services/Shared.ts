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

export var fileImages = [
        {key: 'pdf', value:'/_layouts/15/images/lg_icpdf.png'},
        {key: 'docx', value:'_layouts/15/images/lg_icdocx.png'},
        {key: 'doc', value:'_layouts/15/images/lg_icdoc.png'},
        {key: 'xlsx', value: '_layouts/15/images/lg_icxlsx.png'},
        {key: 'xls', value: '_layouts/15/images/lg_icxls.png'},
        {key: 'pptx', value: '/_layouts/15/images/lg_icpptx.png'},
        {key: 'ppt', value: '/_layouts/15/images/lg_icppt.png'},
        {key: 'xlsm', value: '/_layouts/15/images/lg_icxlsm.png'},
        {key: 'txt', value: '/_layouts/15/images/lg_ictxt.gif'}
]