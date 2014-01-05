function processCsv(path, callback) {
	$.ajax({
		type: 'GET',
		url: path,
        data: null,
        success: function(text) {
    		var rows = [];
        	var fields = text.split(/\n/);
			var headers = fields[0].split(',');
			for(var i = 1; i < fields.length; i += 1) {
				var tick = {};
				var values = fields[i].split(',');

				if (values.length > 1) {
					for (var j = 0; j < headers.length; j += 1) {
						tick[headers[j].trim()] = values[j];
					}

					rows.push(tick);					
				}
           }

           callback(rows);
        }
	});
}

function removeLoadingIndicator() {
	$('#dimmer').remove();
	$('#loading-indicator').remove();	
}
