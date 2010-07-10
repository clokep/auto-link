/*JSON.stringify([
					{
						"pattern" : "bug (\\d+)",
						"flags" : "gi",
						"link" : "https://bugzilla.mozilla.org/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.mozilla.org",
						"protocols" : ["prpl-irc"],
						"users" : [".+"],
						"rooms" : ["#(?!(instant|song)bird).+"] // Possibly remove this constraint and just run the other two first since they're more "specific"
					},
					{
						"pattern" : "bug (\\d+)",
						"flags" : "gi",
						"link" : "https://bugzilla.instantbird.org/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.instantbird.org",
						"protocols" : ["prpl-irc"],
						"users" : [".+"],
						"rooms" : ["#instantbird"]
					},
					{
						"pattern" : "bug (\\d+)",
						"flags" : "gi",
						"link" : "http://bugzilla.songbirdnest.com/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.songbirdnest.com",
						"protocols" : ["prpl-irc"],
						"users" : [".+"],
						"rooms" : ["#songbird"]
					}
				]).replace(/\\/g,"\\\\")*/
pref("extensions.autolink.rules",'[{"pattern":"bug (\\\\d+)","flags":"gi","link":"https://bugzilla.mozilla.org/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.mozilla.org","protocols":["prpl-irc"],"users":[".+"],"rooms":["#(?!(instant|song)bird).+"]},{"pattern":"bug (\\\\d+)","flags":"gi","link":"https://bugzilla.instantbird.org/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.instantbird.org","protocols":["prpl-irc"],"users":[".+"],"rooms":["#instantbird"]},{"pattern":"bug (\\\\d+)","flags":"gi","link":"http://bugzilla.songbirdnest.com/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.songbirdnest.com","protocols":["prpl-irc"],"users":[".+"],"rooms":["#songbird"]}]');