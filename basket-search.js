$(function() {
	processCsv('FullList.csv', function(rows) {
		removeLoadingIndicator();
		$.each(rows, function(i, row) {
			var option = $('<option/>');
			option.text(row['Ticker']);
			$('.tickers-select').append(option);
		});
		$('.tickers-select').chosen();
	});
});