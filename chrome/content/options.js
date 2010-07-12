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
 * Patrick Cloke (clokep@gmail.com).
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

var supportProtocols = [];
function loadSupportedProtocols() {
	alert("Start");
	var pcs = Components.classes["@instantbird.org/purple/core;1"]
				 .getService(Ci.purpleICoreService);
	var protos = [];
	alert("Load");
	for (let proto in getIter(pcs.getProtocols()))
		protos.push(proto);
	protos.sort(function(a, b) a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	protos.forEach(function(proto) {
		supportProtocols.push(proto.id);
	});
	
	dump(supportProtocols.toSource());
}

function doShowPopup(event) {
	// See https://developer.mozilla.org/en/XUL/menupopup
	let treeElement = event.rangeParent;
  let row = new Object();
  let col = new Object();
  let treeCell = new Object();
  treeElement.treeBoxObject.getCellAt(event.clientX, event.clientY, row, col, treeCell)

  if (col.value.id != "protocol")
		return false; // prevent popup from appearing
	
	let ruleProtocols = JSON.parse(treeCell.value);
	let menu = document.getElementById("clipmenu");
	for each (var protocol in supportedProtocols)
		menu.getElementById(protocol.name).checked = protocol.checked;
}

function closePopup(event) {
	// See https://developer.mozilla.org/en/XUL/menupopup
	let treeElement = document.getElementById("thetree");
	let treeCell = treeElement.currentIndex;

  let ruleProtocols = [];
	for each (var protocol in supportedProtocols) {
		let menuitem = document.getElementById("clipmenu");
		ruleProtocols.push({"name" : menuitem.id, "checked" : menuitem.checked});
		//popup.checked = false; // Reset
	}
	treeCell.value = JSON.stringify(ruleProtocols);
}

function parse() {
	let regex_bg = document.getElementById("regex_bg");
	// Remove all current children
	while (regex_bg.childNodes.length >= 1 )
		regex_bg.removeChild(regex_bg.firstChild);

	// If we don't want syntax highlight then don't do any
	if (!document.getElementById("highlightSyntax").hasAttribute("checked"))
		return;

	let regex = document.getElementById("regex");
	let text = regex.value;
	
	// From http://jszen.blogspot.com/2007/02/how-to-parse-html-strings-into-dom.html
	var range = document.createRange();
	range.selectNode(regex);
	var doc = range.createContextualFragment("<span class=\"regex\">" + highlightJsReSyntax(text) + "</span>");

	// Replace with new children
	for (var i = 0; i < doc.childNodes.length; i++) {
		regex_bg.appendChild(doc.childNodes[i]);
	}
}

var treeView = {
	rowCount : 10000,
	getCellText : function(row,column){
		if (column.id != "protocol")
			return "Row "+row;
		else
			return "February 18";
	},
	setTree: function(treebox){ this.treebox = treebox; },
	isContainer: function(row){ return false; },
	isSeparator: function(row){ return false; },
	isSorted: function(){ return false; },
	getLevel: function(row){ return 0; },
	getImageSrc: function(row,col){ return null; },
	getRowProperties: function(row,props){},
	getCellProperties: function(row,col,props){},
	getColumnProperties: function(colid,col,props){}
};

window.addEventListener("load",
						(function(e) {
							//loadSupportedProtocols();
							parse();
							//document.getElementById('thetree').view = treeView;
						}),
						false);
