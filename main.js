var allTickers = [];
var fadeDuration = 500;
var colorTable = ["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"];

$(function() {
	processCsv('List.csv', function(rows) {
		allTickers = rows;
	});

	$(".query").keyup(search);

	$('.remove-all').click(function() {
		$('.basket li').fadeOut(fadeDuration, function() { 
			$(this).remove();
			resetBasket();
			search(); 
		});
	});

	noQuery();
	resetBasket();

	$('.remove-all').popup();
});

function search() {
	var query = $(".query").val();
	if (query.length == 0) {
		noQuery();	
	} else {
		showResults(filterTags(query));	
	}
}

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

function resetBasket() {
	$('.basket li').each(function(i, node) {
		$(node).css('background-color', colorTable[i]);
	});

	$('.basket li').size() > 0 ? $('.remove-all').show()
							   : $('.remove-all').hide();
}

function filterTags(query) {
	return $.grep(allTickers, function(ticker) {
		return matches(ticker['Company'], query) || matches(ticker['Sector'], query);
	}).sort(function(a,b){
		return parseInt(b['Market Cap']) - parseInt(a['Market Cap']);
	});
}

function matches(a, b) {
	return a.toLowerCase().indexOf(b.toLowerCase()) != -1;
}

function inBasket(data) {
	var allData = $.map($('.basket li'), function(node) {
		return $(node).prop('_data');
	});

	return $.inArray(data, allData) != -1;
}

function addToBasket(tag) {
	var data = tag.prop('_data');

	if ($(".basket li").size() == 8 || inBasket(data)) {
		return;
	}

	$(".basket").children().show();

	tag.addClass('added');

	var nameNode = $("<span/>");
	nameNode.text(data['Ticker']);

	var closeNode = $("<i/>");
	closeNode.addClass("fa");
	closeNode.addClass("fa-times");

	var tagNode = $("<li/>");
	tagNode.append(nameNode);
	tagNode.append(closeNode);
	tagNode.css('background-color', colorTable[$(".basket li").length]);
	tagNode.prop('_data', data);

	tagNode.appendTo($(".basket ul")).hide().fadeIn(fadeDuration);

	closeNode.click(function() {
		tagNode.fadeOut(fadeDuration, function() { 
			$(this).remove(); 
			resetBasket();
			search();
		});
		
	});
}

function noQuery() {
	$('.with-results.results').hide();
	$('.no-results.results').hide();
	$('.no-query.results').show();
}
function showResults(results) {
	$('.no-query.results').hide();

	if (results.length == 0) {
		$('.with-results.results').hide();
		$('.no-results.results').show();
	} else {
		$('.with-results.results').show();
		$('.no-results.results').hide();
		
		$(".with-results.results li").remove();
		$.each(results.slice(0, 18), function(i, ticker) {
			var nameNode = $("<div/>");
			nameNode.addClass("name");
			nameNode.text(ticker['Company']);

			var descriptionNode = $("<div/>");
			descriptionNode.addClass("description");
			descriptionNode.text(ticker['Sector']);

			var plusNode = $("<i/>");
			plusNode.addClass("fa");
			plusNode.addClass("fa-plus");

			var checkNode = $("<i/>");
			checkNode.addClass("fa");
			checkNode.addClass("fa-check");

			var tagNode = $("<li/>");
			tagNode.append(nameNode);
			tagNode.append(descriptionNode);
			tagNode.append(plusNode);
			tagNode.append(checkNode);

			if(inBasket(ticker)) {
				tagNode.addClass('added');
			}
			tagNode.prop('_data', ticker);

			tagNode.appendTo($(".with-results.results"));

			tagNode.click(function() {
				addToBasket(tagNode);
			});
		});
	}





}

