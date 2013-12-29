var allTickers = [];

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
					for (var j = 0; j < headers.length - 1; j += 1) {
						tick[headers[j]] = values[j];
					}

					rows.push(tick);					
				}
           }

           callback(rows);
        }
	});
}

$(function() {
	processCsv('List.csv', function(rows) {
		allTickers = rows;
		showResults(allTickers);
	});

	$(".query").keyup(function() {
		var query = $(this).val();
		var tickers= filterTags(query);
		showResults(tickers);
	});


});

function filterTags(query) {
	return $.grep(allTickers, function(ticker) {
		return matches(ticker['Company'], query);
	});
}

function matches(a, b) {
	return a.toLowerCase().indexOf(b.toLowerCase()) != -1;
}

function showResults(results) {
	$("ul.results li").remove();

	$.each(results, function(i, ticker) {
		var nameNode = $("<div/>");
		nameNode.addClass("name");
		nameNode.text(ticker['Company']);

		var descriptionNode = $("<div/>");
		descriptionNode.addClass("description");
		descriptionNode.text(ticker['Sector']);

		var plusNode = $("<a/>");
		plusNode.addClass("plus");
		plusNode.text("+");
		plusNode.click(function() {
			console.log("clicked");
		});

		var tagNode = $("<li/>");
		tagNode.append(nameNode);
		tagNode.append(descriptionNode);
		tagNode.append(plusNode);
		tagNode.prop('_data', ticker);

		tagNode.appendTo($("ul.results")).fadeIn(2000);
	});


}

