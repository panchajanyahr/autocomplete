function processCsv(path, callback) {
	$.ajax({
		type: 'GET',
		url: path,
        data: null,
        success: function(text) {
        	var result = $.csv.toObjects(text);
        	callback(result);
        }
	});
}

function removeLoadingIndicator() {
	$('#dimmer').remove();
	$('#loading-indicator').remove();	
}
