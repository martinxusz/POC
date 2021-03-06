Ext.menu.ColorMenu = function(a) {
	Ext.menu.ColorMenu.superclass.constructor.call(this, a);
	this.plain = true;
	var b = new Ext.menu.ColorItem(a);
	this.add(b);
	this.palette = b.palette;
	this.relayEvents(b, ["select"])
};
Ext.extend(Ext.menu.ColorMenu, Ext.menu.Menu, {
			beforeDestroy : function() {
				this.palette.destroy()
			}
		});