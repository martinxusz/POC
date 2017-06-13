Ext.menu.CheckItem = function(a) {
	Ext.menu.CheckItem.superclass.constructor.call(this, a);
	this.addEvents("beforecheckchange", "checkchange");
	if (this.checkHandler) {
		this.on("checkchange", this.checkHandler, this.scope)
	}
	Ext.menu.MenuMgr.registerCheckable(this)
};
Ext.extend(Ext.menu.CheckItem, Ext.menu.Item, {
	itemCls : "x-menu-item x-menu-check-item",
	groupClass : "x-menu-group-item",
	checked : false,
	ctype : "Ext.menu.CheckItem",
	onRender : function(a) {
		Ext.menu.CheckItem.superclass.onRender.apply(this, arguments);
		if (this.group) {
			this.el.addClass(this.groupClass)
		}
		if (this.checked) {
			this.checked = false;
			this.setChecked(true, true)
		}
	},
	destroy : function() {
		Ext.menu.MenuMgr.unregisterCheckable(this);
		Ext.menu.CheckItem.superclass.destroy.apply(this, arguments)
	},
	setChecked : function(b, a) {
		if (this.checked != b
				&& this.fireEvent("beforecheckchange", this, b) !== false) {
			if (this.container) {
				this.container[b ? "addClass" : "removeClass"]("x-menu-item-checked")
			}
			this.checked = b;
			if (a !== true) {
				this.fireEvent("checkchange", this, b)
			}
		}
	},
	handleClick : function(a) {
		if (!this.disabled && !(this.checked && this.group)) {
			this.setChecked(!this.checked)
		}
		Ext.menu.CheckItem.superclass.handleClick.apply(this, arguments)
	}
});