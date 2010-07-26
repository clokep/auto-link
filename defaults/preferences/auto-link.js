/*JSON.stringify([
					{
						"pattern" : /bug[ #]*?(\d+)/gi.toString(),
						"link" : "https://bugzilla.mozilla.org/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.mozilla.org",
						"protocols" : ["prpl-irc"],
						"accountName" : ".+",
						"conversationName" : /#(?!(instant|song)bird).+/i.toString() // Possibly remove this constraint and just run the other two first since they're more "specific"
					},
					{
						"pattern" : /bug[ #]*?(\d+)/gi.toString(),
						"link" : "https://bugzilla.instantbird.org/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.instantbird.org",
						"protocols" : ["prpl-irc"],
						"accountName" : ".+",
						"conversationName" : /#instantbird/i.toString()
					},
					{
						"pattern" : /bug[ #]*?(\d+)/gi.toString(),
						"link" : "http://bugzilla.songbirdnest.com/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.songbirdnest.com",
						"protocols" : ["prpl-irc"],
						"accountName" : ".+",
						"conversationName" : /#songbird/i.toString()
					}
				]).replace(/\\/g, "\\\\")*/
pref("extensions.autolink.rules",'[{"pattern":"/bug[ #]*?(\\\\d+)/gi","link":"https://bugzilla.mozilla.org/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.mozilla.org","protocols":["prpl-irc"],"accountName":".+","conversationName":"/#(?!(instant|song)bird).+/i"},{"pattern":"/bug[ #]*?(\\\\d+)/gi","link":"https://bugzilla.instantbird.org/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.instantbird.org","protocols":["prpl-irc"],"accountName":".+","conversationName":"/#instantbird/i"},{"pattern":"/bug[ #]*?(\\\\d+)/gi","link":"http://bugzilla.songbirdnest.com/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.songbirdnest.com","protocols":["prpl-irc"],"accountName":".+","conversationName":"/#songbird/i"}]');