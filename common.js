function processCsv(path, callback) {
	$.ajax({
		type: 'GET',
		url: path,
        data: null,
        success: function(text) {
        	var result = $.parse(text, {
    		    delimiter: ",",
			    header: true,
			    dynamicTyping: false
        	});

        	callback(result.results.rows);
        }
	});
}

function removeLoadingIndicator() {
	$('#dimmer').remove();
	$('#loading-indicator').remove();	
}
