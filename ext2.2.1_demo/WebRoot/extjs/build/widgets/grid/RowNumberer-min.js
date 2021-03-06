Ext.grid.RowNumberer = function(a) {
	Ext.apply(this, a);
	if (this.rowspan) {
		this.renderer = this.renderer.createDelegate(this)
	}
};
Ext.grid.RowNumberer.prototype = {
	header : "",
	width : 23,
	sortable : false,
	fixed : true,
	menuDisabled : true,
	dataIndex : "",
	id : "numberer",
	rowspan : undefined,
	renderer : function(b, c, a, d) {
		if (this.rowspan) {
			c.cellAttr = 'rowspan="' + this.rowspan + '"'
		}
		return d + 1
	}
};