Ext.data.DataProxy = function() {
	this.addEvents("beforeload", "load");
	Ext.data.DataProxy.superclass.constructor.call(this)
};
Ext.extend(Ext.data.DataProxy, Ext.util.Observable);