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
 *  Florian Quèze <florian@instantbird.org>
 *  Patrick Cloke <clokep@gmail.com>
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

const {interfaces: Ci, utils: Cu} = Components;

Cu.import("resource:///modules/imServices.jsm");

// See http://starkravingfinkle.org/blog/2011/01/restartless-add-ons-%e2%80%93-default-preferences/
const PREF_BRANCH = "extensions.autolink.";
const PREFS = {
  rules: JSON.stringify([
    {
      name: "Test",
      pattern: /test (\d+)/gi.toString(),
      link: "http://$1",
      title: "TEST $1"
    },
    {
      name: "Mozilla Bugzilla",
      pattern: /bug[ #]*?(\d+)/gi.toString(),
      link: "https://bugzilla.mozilla.org/show_bug.cgi?id=$1",
      title: "Bug $1 @ bugzilla.mozilla.org",
      protocols: ["prpl-irc"],
      accountName: /.+/.toString(),
      conversationName: /#(?!(instant|song)bird).+/i.toString() // Possibly remove this constraint and just run the other two first since they're more "specific"
    },
    {
      name: "Instantbird Bugzilla",
      pattern: /bug[ #]*?(\d+)/gi.toString(),
      link: "https://bugzilla.instantbird.org/show_bug.cgi?id=$1",
      title: "Bug $1 @ bugzilla.instantbird.org",
      protocols: ["prpl-irc"],
      accountName: /.+/.toString(),
      conversationName: /#instantbird/i.toString()
    },
    {
      name: "Songbird Bugzilla",
      pattern: /bug[ #]*?(\d+)/gi.toString(),
      link: "http://bugzilla.songbirdnest.com/show_bug.cgi?id=$1",
      title: "Bug $1 @ bugzilla.songbirdnest.com",
      protocols: ["prpl-irc"],
      accountName: /.+/.toString(),
      conversationName: /#songbird/i.toString()
    }
  ]).replace(/\\/g, "\\\\") };
const EVENTS = ["conversation-loaded"];

var rules = [];

function setDefaultPrefs() {
  let branch = Services.prefs.getDefaultBranch(PREF_BRANCH);
  for (let [key, val] in Iterator(PREFS)) {
    switch (typeof val) {
      case "boolean":
        branch.setBoolPref(key, val);
        break;
      case "number":
        branch.setIntPref(key, val);
        break;
      case "string":
        branch.setCharPref(key, val);
        break;
    }
  }
}

// Returns undefined if the pref doesn't exist.
function getPref(aName) {
  switch (Services.prefs.getPrefType(PREF_BRANCH + aName)) {
    case Ci.nsIPrefBranch.PREF_BOOL:
      return Services.prefs.getBoolPref(PREF_BRANCH + aName);
      break;
    case Ci.nsIPrefBranch.PREF_INT:
      return Services.prefs.getIntPref(PREF_BRANCH + aName);
      break;
    case Ci.nsIPrefBranch.PREF_STRING:
      return Services.prefs.getCharPref(PREF_BRANCH + aName);
      break;
  }
  return undefined;
}

// Reforms a regular expression from a string
function stringToRegExp(aStr) {
  let separator = aStr.lastIndexOf('/');
  return (new RegExp(aStr.slice(1, separator).replace("\\\\", "\\"),
                     aStr.slice(separator + 1)));
}

// This will convert between "some string $1" to "some string " + matches[0]
function convertRegExpMatch(aMatchedString, aOffset, aStr, aRepString, aMatches) {
  for (let i = 0; i < aRepString.length; i++) {
    if (aRepString[i] != '$')
      continue;

    // See https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
    if (aRepString[i + 1] == '$') {
      // Inserts a "$".
      aRepString = aRepString.slice(0, i) + aRepString.slice(i + 1);
    } else if (aRepString[i + 1] == '&') {
      // Inserts the matched substring.
      aRepString = aRepString.slice(0, i) + aMatchedString +
                   aRepString.slice(i + 2);
      i += aMatchedString.length + 1;
    } else if (aRepString[i + 1] == '`') {
      // Inserts the portion of the string that precedes the matched substring.
      aRepString = aRepString.slice(0, i) + aStr.slice(0, offset) +
                   aRepString.slice(i + 2);
      i++;
    } else if (aRepString[i + 1] == '\'') {
      // Inserts the portion of the string that follows the matched substring.
      aRepString = aRepString.slice(0, i) +
                   aStr.slice(offset + aMatchedString.length) +
                   aRepString.slice(i + 2);
      i += (aStr.length - (offset + aMatchedString.length)) + 1;
    } else if (/\d/.test(aRepString[i + 1])) {
      // Where n or nn are decimal digits, inserts the nth parenthesized
      // submatch string, provided the first argument was a RegExp object.
      // Handles 1 - 99, which is the full range for JS
      let num = aRepString[i + 1];
      Cu.reportError(num + aMatches.length);
      // If there are two digits, include both of them...
      if (/\d/.test(aRepString[i + 2])) {
        num += aRepString[i + 2];

        // ...but only if there's enough matching groups.
        if (parseInt(num) > aMatches.length)
          num = num[0];
      }

      if (parseInt(num) <= aMatches.length) {
        let match = aMatches[parseInt(num) - 1];
        aRepString = aRepString.slice(0, i) + aMatches[parseInt(num) - 1] +
                     aRepString.slice(i + num.length + 1);
        i += aMatches[parseInt(num) - 1].length;
      }

      i += num.length;
    }
  }

  return aRepString;
}

function applyRule(aNode, aRule) {
  let result = 0;
  let lastIndex = 0;

  while (aRule.pattern.test(aNode.data)) {
    aNode.data.replace(aRule.pattern,
                      // See https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter
                      (function() {
                        // See http://www.devsource.com/c/a/Using-VS/Regular-Expressions-and-Strings-in-JavaScript/
                        // Matching string.
                        let str = arguments[0];

                        // Offset to start of match.
                        let offset = arguments[aRule.capturingGroups + 1] - lastIndex;
                        // If a second match is found before the end of the
                        // previous match.
                        if (offset < 0)
                         return;

                        // The original string passed.
                        let s = arguments[aRule.capturingGroups + 2];

                        let matches = [];
                        if (aRule.capturingGroups > 0) {
                          // See https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Functions_and_function_scope/arguments
                          // Get each capturing group.
                          matches = Array.prototype.slice.call(arguments).slice(1, 1 + aRule.capturingGroups);
                        }

                        // For some reason aNode.ownerDocument won't create any 'a' elements.
                        let linkNode = aNode.ownerDocument.createElement('a');

                        linkNode.setAttribute("href", convertRegExpMatch(str, offset, s, aRule.link, matches));
                        linkNode.setAttribute("title", convertRegExpMatch(str, offset, s, aRule.title, matches));
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
}

// |this| is bound to the purpleIConversation object.
function autoLink(aNode) {
  let results = 0;

  for each (let rule in rules) {
    // Check that the user/room names & protocol are valid
    if ((this.account.protocol.id in rule.protocols ||
         !rule.protocols.length) &&
        rule.accountName.test(this.account.name) && // XXX Does this work if your account has an alias?
        rule.conversationName.test(this.name)) { // XXX Does this work if you have an alias for the buddy?
      // Add rule to current conversation.
      results += applyRule(aNode, rule);
    }
  }

  return results;
}

function observer(aObject, aTopic, aData) {
  if (aTopic != "conversation-loaded")
    return;

  aObject.addTextModifier(autoLink.bind(aObject._conv));
}

// XXX add an observer to the prefs and reload the rules if they change.
function loadRules() {
  try {
    rules = JSON.parse(getPref("rules"));
  } catch(e) {
    // Well, just do nothing.
    Cu.reportError("Error reading rules.");
  }

  // Loop over each ruleset
  for each (let rule in rules) {
    try {
      rule.pattern = stringToRegExp(rule.pattern);
      // By default match every account or conversation name.
      rule.accountName =
        rule.accountName ? stringToRegExp(rule.accountName) : /.*/;
      rule.conversationName =
        rule.conversationName ? stringToRegExp(rule.conversationName) : /.*/;
    } catch(e) {
      Cu.reportError("Error parsing rules: " + e);
      rules = [];
      return;
    }

    // Count the number of capturing groups: ( )
    // We don't want non-capturing or look-aheads: (?: ), (?= ), (?! )
    rule.capturingGroups = 0;
    for (var i = 0; i < (rule.pattern.source.length - 1); i++) {
      if (rule.pattern.source.charAt(i) == "(" &&
          rule.pattern.source.charAt(i + 1) != "?")
        rule.capturingGroups++;
      else if (rule.pattern.source.charAt(i) == "\\") {
        // If we're escaping the next character, skip it.
        i++;
      }
    }

    if (!rule.protocols)
      rule.protocols = [];
  }
}

function startup(data, reason) {
  // Always set the default prefs as they disappear on restart.
  setDefaultPrefs();

  // Initialize the rules.
  loadRules();

  Services.obs.addObserver(observer, EVENTS, false);
}

function shutdown(data, reason) {
  Services.obs.removeObserver(observer, EVENTS, false);
}

// Shut up a warning about missing bootstrap methods
function install() { }
function uninstall() { }
