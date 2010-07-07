/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the Link Bugzilla	Instantbird add-on, released
 * 2009.
 *
 * The Initial Developer of the Original Code is
 * Benedikt P. <leeraccount@yahoo.de>.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *	Parts of this code were taken from instantbird.js or supplied by Florian Qu�ze
 *  Patrick Cloke (clokep@gmail.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var autoLink = {
	get events() { return ["conversation-loaded"]; } // https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Working_with_Objects#Defining_Getters_and_Setters

	observer: {
		// Components.interfaces.nsIObserver
		observe: function(aObject, aTopic, aData) {
			if (aTopic == "conversation-loaded") {
				aObject.addTextModifier(link, aObject); // CHECK ME
			}
		},
		load: function() {
			addObservers(autoLink.observer, autoLink.events);
			window.addEventListener("unload", autoLink.observer.unload, false);
		},
		unload: function() {
			removeObservers(autoLink.observer, autoLink.events);
		}
	},
	
	// This will convert between "some string $1" to "some string " + matches[0]
	convertRegexMatch: function(aString, aMatchedString, arrMatches) {
		return aString.replace(/\$&/gi, aMatchedString).replace(/\$(\d+)/gi,function(str, p1, offset, s) {
			return s.slice(0,offset) + arrMatches[parseInt(p1) - 1] + s.slice(offset + str.length);
		});
	},

	link: function(aNode) {
		var prefs =
			Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService)
													.getBranch("extensions.autolink.");
		let rules = [];
		try {
			rules = JSON.parse(prefs.getCharPref("rules"));
		} catch(e) {
			// Well, just do nothing.
			// Should probably throw an error
		}
		
		// REMOVE ME
		rules = [
			{
				"pattern" : "bug (\\d+)",
				"flags" : "gi",
				"link" : "https://bugzilla.mozilla.org/show_bug.cgi?id=$1",
				"title" : "Bug $1 @ bugzilla.mozilla.org",
				"room" : "#[^(instant|song)bird]",
				"protocol" : "prpl-irc",
				"subgroups" : 1 // Hopefully this can be calculated
			},
			{
				"pattern" : "(test (\\d+))",
				"flags" : "gi",
				"link" : "https://google.com/$2/$1",
				"title" : "Bug $1 @ $2",
				"room" : ".*",
				"protocol" : ".*",
				"subgroups" : 1
			},
			{
				"pattern" : "bug (\\d+)",
				"flags" : "gi",
				"link" : "https://bugzilla.instantbird.org/show_bug.cgi?id=$1",
				"title" : "Bug $1 @ bugzilla.mozilla.org",
				"room" : "#instantbird",
				"protocol" : "prpl-irc",
				"subgroups" : 1
			}
		];

		for each (var rule in rules) {
			//if () {
				let expression = new RegExp(rule.pattern, rule.flags);
				let subgroups = rule.subgroups;

				aNode.data.replace(expression,
							   // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter
							   function() { // http://www.devsource.com/c/a/Using-VS/Regular-Expressions-and-Strings-in-JavaScript/
								   let str = arguments[0];
								   let offset = arguments[subgroups + 1];
								   let s = arguments[subgroups + 2];
								   let matches = [];
								   if (subgroups > 0) {
									   // https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Functions_and_function_scope/arguments
									   matches = Array.prototype.slice.call(arguments).slice(1,1 + subgroups);
								   }
								
								   let newNode = aNode.splitText(offset);
								   aNode = newNode.splitText(str.length);
								   let link = node.ownerDocument.createElement("a");
								   link.setAttribute("href", convertRegexMatch(rule.link, str, matches));
								   link.setAttribute("title", convertRegexMatch(rule.title, str, matches));
								   link.setAttribute("class", "ib-bug-link");
								
								   newNode.parentNode.insertBefore(link, newNode);
								   link.appendChild(newNode);
							   }
							);
				//alert(result);

				/*let result = 0;
				let match;
				while ((match = expression(aNode.data))) {
					let linkBugzillaNode = aNode.splitText(match.index);
					aNode = linkBugzillaNode.splitText(exp.lastIndex - match.index);
					let elt = aNode.ownerDocument.createElement("a");
					elt.setAttribute("href", serverURL + match[1]);
					elt.setAttribute("title", "Bug " + match[1] + " @ " + serverPrettyName);
					elt.setAttribute("class", "ib-bug-link");
					linkBugzillaNode.parentNode.insertBefore(elt, linkBugzillaNode);
					elt.appendChild(linkBugzillaNode);
					result += 2;
					exp.lastIndex = 0;
				}*/
			//}
		}

		return aNode.data;
	}
}

this.addEventListener("load", autoLink.observer.load, false);
