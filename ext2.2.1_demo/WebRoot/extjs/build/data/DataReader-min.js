Ext.data.DataReader = function(a, b) {
	this.meta = a;
	this.recordType = Ext.isArray(b) ? Ext.data.Record.create(b) : b
};
Ext.data.DataReader.prototype = {};