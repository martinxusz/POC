Ext.data.MemoryProxy = function(a) {
	Ext.data.MemoryProxy.superclass.constructor.call(this);
	this.data = a
};
Ext.extend(Ext.data.MemoryProxy, Ext.data.DataProxy, {
			load : function(g, c, h, d, b) {
				g = g || {};
				var a;
				try {
					a = c.readRecords(this.data)
				} catch (f) {
					this.fireEvent("loadexception", this, b, null, f);
					h.call(d, null, b, false);
					return
				}
				h.call(d, a, b, true)
			},
			update : function(b, a) {
			}
		});