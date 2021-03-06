Ext.menu.DateItem = function(a) {
	Ext.menu.DateItem.superclass.constructor.call(this, new Ext.DatePicker(a),
			a);
	this.picker = this.component;
	this.addEvents("select");
	this.picker.on("render", function(b) {
				b.getEl().swallowEvent("click");
				b.container.addClass("x-menu-date-item")
			});
	this.picker.on("select", this.onSelect, this)
};
Ext.extend(Ext.menu.DateItem, Ext.menu.Adapter, {
			onSelect : function(b, a) {
				this.fireEvent("select", this, a, b);
				Ext.menu.DateItem.superclass.handleClick.call(this)
			}
		});