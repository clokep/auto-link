/*JSON.stringify([
					{
						"pattern" : "bug (\\d+)",
						"flags" : "gi",
						"link" : "https://bugzilla.mozilla.org/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.mozilla.org",
						"protocols" : ["prpl-irc"],
						"users" : ["clokep","clokep_work"],
						"rooms" : ["#[^(instant|song)bird]"]
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
						"pattern" : "AIO",
						"flags" : "gi",
						"link" : "http://addons.instantbird.org/",
						"title" : "addons.instantbird.org",
						"protocols" : ["prpl-irc"],
						"users" : [".+"],
						"rooms" : ["#instantbird"]
					},
					{
						"pattern" : "AIO",
						"flags" : "gi",
						"link" : "http://addons.instantbird.org/",
						"title" : "addons.instantbird.org",
						"protocols" : ["prpl-irc"],
						"users" : [".+"],
						"rooms" : ["#instantbird"]
					},
					{
						"pattern" : "bug (\\d+)",
						"flags" : "gi",
						"link" : "https://bugzilla.songbird.org/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.songbird.org",
						"protocols" : ["prpl-irc"],
						"users" : [".+"],
						"rooms" : ["#songbird"]
					}
				]).replace(/\\/g,"\\\\")*/
pref("extensions.autolink.rules",'[{"pattern":"bug (\\\\d+)","flags":"gi","link":"https://bugzilla.mozilla.org/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.mozilla.org","protocols":["prpl-irc"],"users":["clokep","clokep_work"],"rooms":["#[^(instant|song)bird]"]},{"pattern":"bug (\\\\d+)","flags":"gi","link":"https://bugzilla.instantbird.org/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.instantbird.org","protocols":["prpl-irc"],"users":[".+"],"rooms":["#instantbird"]},{"pattern":"AIO","flags":"gi","link":"http://addons.instantbird.org/","title":"addons.instantbird.org","protocols":["prpl-irc"],"users":[".+"],"rooms":["#instantbird"]},{"pattern":"AIO","flags":"gi","link":"http://addons.instantbird.org/","title":"addons.instantbird.org","protocols":["prpl-irc"],"users":[".+"],"rooms":["#instantbird"]},{"pattern":"bug (\\\\d+)","flags":"gi","link":"https://bugzilla.songbird.org/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.songbird.org","protocols":["prpl-irc"],"users":[".+"],"rooms":["#songbird"]}]');