Ext.menu.DateMenu = function(a) {
	Ext.menu.DateMenu.superclass.constructor.call(this, a);
	this.plain = true;
	var b = new Ext.menu.DateItem(a);
	this.add(b);
	this.picker = b.picker;
	this.relayEvents(b, ["select"]);
	this.on("beforeshow", function() {
				if (this.picker) {
					this.picker.hideMonthPicker(true)
				}
			}, this)
};
Ext.extend(Ext.menu.DateMenu, Ext.menu.Menu, {
			cls : "x-date-menu",
			beforeDestroy : function() {
				this.picker.destroy()
			}
		});