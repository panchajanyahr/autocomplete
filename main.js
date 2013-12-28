var allTags = [
	{name: "Twitter", description: "Microblogging"},
	{name: "Google", description: "Search"},
	{name: "Gmail", description: "Email"},
	{name: "Yahoo", description: "Search"},
	{name: "Yahoo Mail", description: "Email"},
	{name: "Facebook", description: "Social"},
	{name: "Wikipedia", description: "Information"},
	{name: "Youtube", description: "Videos"}
];

$(function() {
	$(".query").keyup(function() {
		var query = $(this).val();
		var tags= filterTags(query);
		showResults(tags);
	});

	showResults(allTags);
});

function filterTags(query) {
	return $.grep(allTags, function(tag) {
		return matches(tag.name, query) || matches(tag.description, query);
	});
}

function matches(a, b) {
	return a.toLowerCase().indexOf(b.toLowerCase()) != -1;
}

function showResults(results) {
	$("ul.results li").remove();

	$.each(results, function(i, tag) {
		console.log(tag);
		var nameNode = $("<div/>");
		nameNode.addClass("name");
		nameNode.text(tag.name);

		var descriptionNode = $("<div/>");
		descriptionNode.addClass("description");
		descriptionNode.text(tag.description);

		var tagNode = $("<li/>");
		tagNode.append(nameNode);
		tagNode.append(descriptionNode);

		tagNode.appendTo($("ul.results")).fadeIn(2000);
	});
}

