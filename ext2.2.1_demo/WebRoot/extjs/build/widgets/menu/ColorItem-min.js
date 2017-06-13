Ext.menu.ColorItem = function(a) {
	Ext.menu.ColorItem.superclass.constructor.call(this,
			new Ext.ColorPalette(a), a);
	this.palette = this.component;
	this.relayEvents(this.palette, ["select"]);
	if (this.selectHandler) {
		this.on("select", this.selectHandler, this.scope)
	}
};
Ext.extend(Ext.menu.ColorItem, Ext.menu.Adapter);