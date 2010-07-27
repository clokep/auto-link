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
 * The Original Code is Auto Link code.
 *
 * The Initial Developer of the Original Code is
 * Patrick Cloke <clokep@gmail.com>.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
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

var protos = [];
function loadSupportedProtocols() {
	var pcs = Cc["@instantbird.org/purple/core;1"]
				 .getService(Ci.purpleICoreService);

	for (var proto in getIter(pcs.getProtocols())) {
		protos.push(proto);
	}
	protos.sort(function(a, b) a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
}

function loadRules() {
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

	// Loop over each ruleset
	for each (var rule in rules) {
		rule.pattern = stringToRegex(rule.pattern);
		rule.accountName = stringToRegex(rule.accountName);
		rule.conversationName = stringToRegex(rule.conversationName);

		let elt = document.createElement("richlistitem"); // Really its a ruleitem, but we want richlistitem's styles
		document.getElementById("rules").appendChild(elt);
		elt.build(rule, protos);
	}
}
	
// Reforms a regular expression from a string
function stringToRegex(str) {
	let separator = str.lastIndexOf('/');
	return (new RegExp(str.slice(1,separator), str.slice(separator + 1)));
}

function saveAll() {
	let richlist = document.getElementById("rules");
	let ruleElements = richlist.children;
	let rules = [];
	for (var i = 0; i < ruleElements.length; i++)
		rules.push(ruleElements[i].save());

	dump(JSON.stringify(rules));
	
	return true;
}

window.addEventListener("load",
						(function(e) {
							loadSupportedProtocols();
							loadRules();
						}),
						false);
