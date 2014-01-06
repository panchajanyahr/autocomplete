var allTickers = [];
var fadeDuration = 500;
var colorTable = ["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"];

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

function removeLoadingIndicator() {
	$('#dimmer').remove();
	$('#loading-indicator').remove();	
}

$(function() {
	processCsv('FullList.csv', function(rows) {
		removeLoadingIndicator();
		allTickers = $.grep(rows, function(row) {
			return !isNaN(marketCapValue(row["Market Cap"]));
		});

		$.each(allTickers, function(i, row) {
			var company = row["Company"].toLowerCase();
			var sector = row["Sector"].toLowerCase();
			var ticker = row["Ticker"].toLowerCase();
			row["SearchKeywords"] = company + " " + sector + " " + ticker; 
		});
	});

	$(".query").keyup(search);

	$('.remove-all').click(function() {
		$('.basket li.item').fadeOut(fadeDuration, function() { 
			$(this).remove();
			$(".results").removeClass("basket-full");
			resetBasket();
			search(); 
		});
	});

	noQuery();
	resetBasket();

	$(".basket ul").click(function() {
		$(".query").focus();
	});
	$(".query").focus();
	window.onfocus = function() { $('.popover').remove(); };
});

function search() {
	$('.popover').remove();

	var query = $(".query").val();
	if (query.length == 0) {
		noQuery();	
	} else {
		showResults(filterTags(query));	
	}
}

function filterTags(query) {
	return $.grep(allTickers, function(ticker) {
		return matches(ticker, query);
	}).sort(function(a,b){
		return marketCapValue(b['Market Cap']) - marketCapValue(a['Market Cap']);
	});	
}

function marketCapValue(str) {
	str = str.trim();

	if (/B$/.test(str)) {
		return parseFloat(str.substring(0, str.length - 1)) * 1000;
	} else if (/M$/.test(str)) {
		return parseFloat(str.substring(0, str.length - 1));
	}

	return Number.NaN;
}

function matches(row, query) {
	var words = query.toLowerCase().split(/\s+/);
	for (var i = words.length - 1; i >= 0; i--) {
		var regex = new RegExp(words[i]);

		if(!regex.test(row["SearchKeywords"])) {
			return false;
		}
	};

	return true;
}

function inBasket(data) {
	var allData = $.map($('.basket li.item'), function(node) {
		return $(node).prop('_data');
	});

	return $.inArray(data, allData) != -1;
}

function addToBasket(tag) {
	var data = tag.prop('_data');

	if ($(".basket li.item").size() == 8 || inBasket(data)) {
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
	tagNode.addClass("item");
	tagNode.append(nameNode);
	tagNode.append(closeNode);
	tagNode.css('background-color', colorTable[$(".basket li.item").length]);
	tagNode.prop('_data', data);
	tagNode.insertBefore($('.basket li.query-li'));

	tagNode.hide().fadeIn(fadeDuration);

	closeNode.click(function() {
		tagNode.fadeOut(fadeDuration, function() { 
			$(this).remove(); 
			$(".results").removeClass("basket-full");
			resetBasket();
			search();
		});
		
	});

	if($(".basket li.item").size() == 8) {
		$(".results").addClass("basket-full");	
	} 

	resetBasket();
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

			var marketCap = '<li><label>Market Cap:</label><span> ' + ticker["Market Cap"] + '</span></li>';
			var sales = '<li><label>Revenue:</label><span> ' + ticker["Sales"] + '</span></li>';
			var ebitda = '<li><label>EBITDA:</label><span> ' + ticker["EBITDA"] + '</span></li>';
			var tooltip = "<ul class='details'>"  + marketCap + sales + ebitda + "</ul>";

			tagNode.attr('data-html', 'true');
			tagNode.attr('data-title', ticker["Company"]);
			tagNode.attr('data-content', tooltip);
			tagNode.attr('data-container', 'body');
			tagNode.prop('_data', ticker);

			tagNode.appendTo($(".with-results.results ul"));

			tagNode.click(function() {
				addToBasket(tagNode);
			});

			tagNode.hover(function() {
				$('.popover').remove();
				$(this).popover('show');
			}, function() {
				$(this).popover('hide');
			});
		});
		adjustHeightOfResults();
	}
}

function adjustHeightOfResults() {
	var maxHeight = Math.max.apply(Math, $.map($('.results li'), function(node) {
		return $(node).height();
	}));

	$('.results li').each(function(i, node) {
		$(node).height(maxHeight);
	});
}

function resetBasket() {
	$('.basket li.item').each(function(i, node) {
		$(node).css('background-color', colorTable[i]);
	});

	$('.basket li.item').size() > 0 ? $('.remove-all').show()
							   : $('.remove-all').hide();	
	resetBasketFormInput();
}

function resetBasketFormInput() {
	var value = $.map($('.basket li.item'), function(d) { return $(d).text(); }).join(",");
	$('input[name=tickers]').val(value);
}