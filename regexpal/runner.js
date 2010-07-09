
function startup() {
	var el = document.getElementById("regex"),
			text = el.value;
			
	alert(highlightJsReSyntax(text));

	// this is where the magic happens
	document.getElementById("bgs").innerHTML = highlightJsReSyntax(text);
}

window.addEventListener("load", function(e) {startup();}, false);
