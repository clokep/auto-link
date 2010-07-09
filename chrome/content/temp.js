this.pcs = Components.classes["@instantbird.org/purple/core;1"].getService(Ci.purpleICoreService);

    for (let proto in getIter(this.pcs.getProtocols()))
      protos.push(proto);
    protos.sort(function(a, b) a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    protos.forEach(function(proto) {
      var id = proto.id;
      var item = protoList.appendItem(proto.name, id, id);
      item.setAttribute("image", proto.iconBaseURI + "icon.png");
      item.setAttribute("class", "listitem-iconic");
    });

	
	
var pcs = Components.classes["@instantbird.org/purple/core;1"]
			 .getService(Ci.purpleICoreService);
var protos = [];
for (let proto in getIter(pcs.getProtocols()))
  protos.push(proto);
protos.sort(function(a, b) a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
protos.forEach(function(proto) {
  dump(proto.id);
});