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
 * The Original Code is the Link Bugzilla Instantbird add-on, released
 * 2009.
 *
 * The Initial Developer of the Original Code is
 * Benedikt P. <leeraccount@yahoo.de>.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *	Parts of this code were taken from instantbird.js or supplied by Florian Quèze
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

function dump(aMessage) {
	var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
									 .getService(Components.interfaces.nsIConsoleService);
	consoleService.logStringMessage("Auto-Link: " + aMessage);
}

var autoLink = {
	// See https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Working_with_Objects#Defining_Getters_and_Setters
	get events() { return ["conversation-loaded"]; },

	observer: {
		// Implements Components.interfaces.nsIObserver
		observe: function(aObject, aTopic, aData) {
			if (aTopic == "conversation-loaded") {
				var prefs =	Cc["@mozilla.org/preferences-service;1"]
								.getService(Ci.nsIPrefService)
								.getBranch("extensions.autolink.");
				let rules = [];
				try {
					rules = JSON.parse(prefs.getCharPref("rules"));
				} catch(e) {
					// Well, just do nothing.
					// Should probably throw an error
				}

				// See http://lxr.instantbird.org/instantbird/source/purple/purplexpcom/public/purpleIConversation.idl
				let conversation = aObject._conv;
				// Loop over each ruleset
				for each (var rule in rules) {
					// XXX Probably needs a try block around it (or maybe we should try it before trying to add the rule?)
					rule.pattern = autoLink.stringToRegex(rule.pattern);
					rule.accountName = autoLink.stringToRegex(rule.accountName);
					rule.conversationName = autoLink.stringToRegex(rule.conversationName);

					// Count the number of capturing groups: ( )
					// We don't want non-capturing or look-aheads: (?: ), (?= ), (?! )
					rule.capturingGroups = 0; // XXX move to utilities file?
					for (var i = 0; i < (rule.pattern.source.length - 1); i++)
						if (rule.pattern.source.charAt(i) == "(" && rule.pattern.source.charAt(i + 1) != "?")
							rule.capturingGroups++;
						else if (rule.pattern.source.charAt(i) == "\\") // If we're escaping then we don't care about the next char
							i++; // Skip the next char

					// Check that the user/room names & protocol are valid
					if ((conversation.account.protocol.id in rule.protocols
							|| !rule.protocols.length)
						&& rule.accountName.test(conversation.account.name) // XXX Does this work if your account has an alias?
						&& rule.conversationName.test(conversation.name)) { // XXX Does this work if you have an alias for the buddy?
							// Add rule to current conversation
							aObject.addTextModifier(autoLink.getLinkModifier(rule));
					}
				}
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
	
	// Reforms a regular expression from a string
	stringToRegex: function(str) { // XXX move to utilities file
		let separator = str.lastIndexOf('/');
		return (new RegExp(str.slice(1,separator), str.slice(separator + 1)));
	},
	
	// This will convert between "some string $1" to "some string " + matches[0]
	convertRegexMatch: function(aString, aMatchedString, arrMatches) {
		return aString.replace(/\$&/gi, aMatchedString) // XXX Should be able to handle $$, $` and $'
					  .replace(/\$(([1-9]\d?)/gi, // XXX Handles 1 - 99, which is the full range for JS
								(function(str, p1, offset, s) {
									if (parseInt(p1) <= arrMatches.length)
										return arrMatches[parseInt(p1) - 1];
									else if (p1.length > arrMatches.length.toString().length) {
										return arrMatches[parseInt(p1.slice(0,arrMatches.length.toString().length) - 1)]
											   + p1.slice(arrMatches.length.toString().length);
									}
									return str; // Treat it as literal and return
								})
						);
	},

	getLinkModifier: function(rule) {
		return (function(aNode) {
			let expression = rule.pattern;
			let capturingGroups = rule.capturingGroups;

			let result = 0;
			let lastIndex = 0;
			while (expression(aNode.data)) {
				aNode.data.replace(expression,
								 // See https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter
								 (function() {
									 // See http://www.devsource.com/c/a/Using-VS/Regular-Expressions-and-Strings-in-JavaScript/
									 let str = arguments[0]; // Matching string
									 let offset = arguments[capturingGroups + 1] - lastIndex; // Offset to start of match
									 if (offset < 0) // We found a second match before the end of the previous match
										return;
									 let s = arguments[capturingGroups + 2]; // The original string passed
									 let matches = [];
									 if (capturingGroups > 0) {
										 // See https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Functions_and_function_scope/arguments
										 matches = Array.prototype.slice.call(arguments).slice(1,1 + capturingGroups); // Each capturing group
									 }

									 // For some reason aNode.ownerDocument won't
									 // create any 'a' elements. Hack around it.
									 let linkNode = this.document.createElement('a');
									 aNode.ownerDocument.adoptNode(linkNode);

									 linkNode.setAttribute("href", autoLink.convertRegexMatch(rule.link, str, matches));
									 linkNode.setAttribute("title", autoLink.convertRegexMatch(rule.title, str, matches));
									 linkNode.setAttribute("class", "autoLink");

									 // Split into two text nodes
									 let linkTextNode = aNode.splitText(offset);
									 // Split the second node again
									 aNode = linkTextNode.splitText(str.length);

									 linkTextNode.parentNode.insertBefore(linkNode, linkTextNode);
									 linkNode.appendChild(linkTextNode);
									 
									 lastIndex = offset + str.length; // Beginning to search next time
									 result += 2;
								 })
						   );
				}
			return result;
		});
	}
};

this.addEventListener("load", autoLink.observer.load, false);
