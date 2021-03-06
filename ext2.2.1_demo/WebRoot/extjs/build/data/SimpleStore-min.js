Ext.data.SimpleStore = function(a) {
	Ext.data.SimpleStore.superclass.constructor.call(this, Ext.apply(a, {
						reader : new Ext.data.ArrayReader({
									id : a.id
								}, Ext.data.Record.create(a.fields))
					}))
};
Ext.extend(Ext.data.SimpleStore, Ext.data.Store, {
			loadData : function(e, b) {
				if (this.expandData === true) {
					var d = [];
					for (var c = 0, a = e.length; c < a; c++) {
						d[d.length] = [e[c]]
					}
					e = d
				}
				Ext.data.SimpleStore.superclass.loadData.call(this, e, b)
			}
		});