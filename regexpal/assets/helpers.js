/*
	Helper functions for RegexPal
	(c) 2007 Steven Levithan <http://stevenlevithan.com>
	MIT license
*/

var trim = function() {
	// See <http://blog.stevenlevithan.com/archives/faster-trim-javascript>
	var	lSpace = /^\s\s*/,
		rSpace = /\s\s*$/;
	return function (str) {
		return str.replace(lSpace, "").replace(rSpace, "");
	};
}();

// This is much faster than simple use of innerHTML in some browsers
// See <http://blog.stevenlevithan.com/archives/faster-than-innerhtml>
function replaceHtml(el, html) {
	var oldEl = document.getElementById(el);
	var newEl = oldEl.cloneNode(false);
	newEl.innerHTML = html;
	oldEl.parentNode.replaceChild(newEl, oldEl);
	/* Since we just removed the old element from the DOM, return a reference
	to the new element, which can be used to restore variable references. */
	return newEl;
};

/* outerHTML is used to work around the fact that IE applies text normalization when using innerHTML,
which can cause problems with whitespace, etc. Note that even this approach doesn't work with some
elements such as <div>. However, it mostly works with <pre> elements, at least. */
function replaceOuterHtml(el, html) {
	el = replaceHtml(el, "");
	el.innerHTML = html;
	return el;
};

// Return an array of all elements with a specified class name, optionally filtered by tag name and parent
function getElementsByClassName(className, tagName, parentNode) {
	var	els = (document.getElementById(parentNode) || document).getElementsByTagName(tagName || "*"),
		results = [];
	for (var i = 0; i < els.length; i++) {
		if (hasClass(className, els[i])) results.push(els[i]);
	}
	return results;
};

function hasClass(className, el) {
	/* It might not make sense to cache all regexes in a more widely used hasClass function,
	but RegexPal uses it with a small number of classes so there is little memory overhead. */
	return XRegExp.cache("(?:^|\\s)" + className + "(?:\\s|$)").test(document.getElementById(el).className);
};

function addClass(className, el) {
	el = document.getElementById(el);
	if (!hasClass(className, el)) {
		el.className = trim(el.className + " " + className);
	}
};

function removeClass(className, el) {
	el = document.getElementById(el);
	el.className = trim(el.className.replace(XRegExp.cache("(?:^|\\s)" + className + "(?:\\s|$)", "g"), " "));
};

function toggleClass(className, el) {
	if (hasClass(className, el)) {
		removeClass(className, el);
	} else {
		addClass(className, el);
	}
};

function swapClass(oldClass, newClass, el) {
	removeClass(oldClass, el);
	addClass(newClass, el);
};

function replaceSelection(textbox, str) {
	if (textbox.setSelectionRange) {
		var	start = textbox.selectionStart,
			end = textbox.selectionEnd,
			offset = (start + str.length);
		textbox.value = (textbox.value.substring(0, start) + str + textbox.value.substring(end));
		textbox.setSelectionRange(offset, offset);
	} else if (document.selection) { // If IE (Opera has setSelectionRange and Selection objects)
		var range = document.selection.createRange();
		range.text = str;
		range.select();
	}
};

function extend(to, from) {
	for (var property in from) to[property] = from[property];
	return to;
};

// purge by Douglas Crockford <http://javascript.crockford.com/memory/leak.html>
function purge(d) {
	var a = d.attributes, i, l, n;
	if (a) {
		l = a.length;
		for (i = 0; i < l; i += 1) {
			n = a[i].name;
			if (typeof d[n] === 'function') {
				d[n] = null;
			}
		}
	}
	a = d.childNodes;
	if (a) {
		l = a.length;
		for (i = 0; i < l; i += 1) {
			purge(d.childNodes[i]);
		}
	}
};
