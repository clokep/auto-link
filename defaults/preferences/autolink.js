/*JSON.stringify([
					{
						"pattern" : "bug (\\d+)",
						"flags" : "i",
						"link" : "https://bugzilla.mozilla.org/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.mozilla.org",
						"protocols" : ["prpl-irc"],
						"users" : ["clokep","clokep_work"],
						"rooms" : ["#[^(instant|song)bird]"]
					},
					{
						"pattern" : "(test (\\d+))",
						"flags" : "gi",
						"link" : "https://google.com/$2/$1",
						"title" : "Bug $1 @ $2",
						"protocols" : [".+"],
						"users" : [".+"],
						"rooms" : [".+"]
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
						"link" : "https://bugzilla.songbird.org/show_bug.cgi?id=$1",
						"title" : "Bug $1 @ bugzilla.songbird.org",
						"protocols" : [".+"],
						"users" : [".+"],
						"rooms" : [".+"]
					}
				]).replace(/\\/g,"\\\\")*/
pref("extensions.autolink.rules",'[{"pattern":"bug (\\\\d+)","flags":"i","link":"https://bugzilla.mozilla.org/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.mozilla.org","protocols":["prpl-irc"],"users":["clokep","clokep_work"],"rooms":["#[^(instant|song)bird]"]},{"pattern":"(test (\\\\d+))","flags":"gi","link":"https://google.com/$2/$1","title":"Bug $1 @ $2","protocols":[".+"],"users":[".+"],"rooms":[".+"]},{"pattern":"bug (\\\\d+)","flags":"gi","link":"https://bugzilla.instantbird.org/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.instantbird.org","protocols":["prpl-irc"],"users":[".+"],"rooms":["#instantbird"]},{"pattern":"bug (\\\\d+)","flags":"gi","link":"https://bugzilla.songbird.org/show_bug.cgi?id=$1","title":"Bug $1 @ bugzilla.songbird.org","protocols":[".+"],"users":[".+"],"rooms":[".+"]}]');