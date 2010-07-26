/*JSON.stringify([
					{
						"rule" : /bug[ #]*?(\d+)/gi.toString(),
						"link" : "https://bugzilla.mozilla.org/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.mozilla.org",
						"protocols" : ["prpl-irc"],
						"users" : ".+",
						"rooms" : "#(?!(instant|song)bird).+" // Possibly remove this constraint and just run the other two first since they're more "specific"
					},
					{
						"rule" : /bug[ #]*?(\d+)/gi.toString(),
						"link" : "https://bugzilla.instantbird.org/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.instantbird.org",
						"protocols" : ["prpl-irc"],
						"users" : ".+",
						"rooms" : "#instantbird"
					},
					{
						"rule" : /bug[ #]*?(\d+)/gi.toString(),
						"link" : "http://bugzilla.songbirdnest.com/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.songbirdnest.com",
						"protocols" : ["prpl-irc"],
						"users" : ".+",
						"rooms" : "#songbird"
					}
				])*/
pref("extensions.autolink.rules",'[{"rule":"/bug[ #]*?(\\d+)/gi","link":"https://bugzilla.mozilla.org/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.mozilla.org","protocols":["prpl-irc"],"users":".+","rooms":"#(?!(instant|song)bird).+"},{"rule":"/bug[ #]*?(\\d+)/gi","link":"https://bugzilla.instantbird.org/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.instantbird.org","protocols":["prpl-irc"],"users":".+","rooms":"#instantbird"},{"rule":"/bug[ #]*?(\\d+)/gi","link":"http://bugzilla.songbirdnest.com/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.songbirdnest.com","protocols":["prpl-irc"],"users":".+","rooms":"#songbird"}]');