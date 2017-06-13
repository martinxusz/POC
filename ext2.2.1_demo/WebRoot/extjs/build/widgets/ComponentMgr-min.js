Ext.ComponentMgr = function() {
	var b = new Ext.util.MixedCollection();
	var a = {};
	return {
		register : function(d) {
			b.add(d)
		},
		unregister : function(d) {
			b.remove(d)
		},
		get : function(c) {
			return b.get(c)
		},
		onAvailable : function(e, d, c) {
			b.on("add", function(f, g) {
						if (g.id == e) {
							d.call(c || g, g);
							b.un("add", d, c)
						}
					})
		},
		all : b,
		registerType : function(d, c) {
			a[d] = c;
			c.xtype = d
		},
		create : function(c, d) {
			return new a[c.xtype || d](c)
		}
	}
}();
Ext.reg = Ext.ComponentMgr.registerType;