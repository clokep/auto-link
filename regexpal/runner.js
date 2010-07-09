function parse() {
	var regex = document.getElementById("regex"),
			text = regex.value,
			regex_bg = document.getElementById("regex_bg");
			
	var range = document.createRange();
	range.selectNode(regex);
	var doc = range.createContextualFragment("<span class=\"regex\">" + highlightJsReSyntax(text) + "</span>");

	// Remove all current children
	while (regex_bg.childNodes.length >= 1 )
		regex_bg.removeChild(regex_bg.firstChild);       

	// Replace with new children
	for (var i = 0; i < doc.childNodes.length; i++) {
		regex_bg.appendChild(doc.childNodes[i]);
	}
}

window.addEventListener("load", function(e) {parse();}, false);

