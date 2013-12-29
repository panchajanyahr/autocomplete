var allTickers = [];
var fadeDuration = 500;
var colorTable = ["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"];

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

	$('.remove-all').click(function() {
		$('.basket ul li').fadeOut(fadeDuration, function() { 
			$(this).remove(); 
		});
	});

});

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

function recolorBasket() {
	$('.basket ul li').each(function(i, node) {
		$(node).css('background-color', colorTable[i]);
	});
}

function filterTags(query) {
	return $.grep(allTickers, function(ticker) {
		return matches(ticker['Company'], query) || matches(ticker['Sector'], query);
	});
}

function matches(a, b) {
	return a.toLowerCase().indexOf(b.toLowerCase()) != -1;
}

function addToBasket(tag) {
	var data = tag.prop('_data');
	tag.fadeOut(fadeDuration, function() { $(this).remove(); });

	var nameNode = $("<span/>");
	nameNode.text(data['Ticker']);

	var closeNode = $("<a/>");
	closeNode.addClass("close");
	closeNode.text("x");

	var tagNode = $("<li/>");
	tagNode.append(nameNode);
	tagNode.append(closeNode);
	tagNode.css('background-color', colorTable[$(".basket ul li").length]);
	tagNode.prop('_data', data);

	tagNode.appendTo($(".basket ul")).hide().fadeIn(fadeDuration);

	closeNode.click(function() {
		tagNode.fadeOut(fadeDuration, function() { 
			$(this).remove(); 
			recolorBasket();
		});
		
	});
}

function showResults(results) {
	$("ul.results li").remove();

	$.each(results.slice(0, 18), function(i, ticker) {
		var nameNode = $("<div/>");
		nameNode.addClass("name");
		nameNode.text(ticker['Company']);

		var descriptionNode = $("<div/>");
		descriptionNode.addClass("description");
		descriptionNode.text(ticker['Sector']);

		var plusNode = $("<a/>");
		plusNode.addClass("plus");
		plusNode.text("+");

		var tagNode = $("<li/>");
		tagNode.append(nameNode);
		tagNode.append(descriptionNode);
		tagNode.append(plusNode);
		tagNode.prop('_data', ticker);

		tagNode.appendTo($("ul.results"));

		tagNode.click(function() {
			addToBasket(tagNode);
		});
	});
}

