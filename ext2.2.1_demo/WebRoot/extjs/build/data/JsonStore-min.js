Ext.data.JsonStore = function(a) {
	Ext.data.JsonStore.superclass.constructor.call(this, Ext.apply(a, {
						proxy : a.proxy || (!a.data ? new Ext.data.HttpProxy({
									url : a.url
								}) : undefined),
						reader : new Ext.data.JsonReader(a, a.fields)
					}))
};
Ext.extend(Ext.data.JsonStore, Ext.data.Store);