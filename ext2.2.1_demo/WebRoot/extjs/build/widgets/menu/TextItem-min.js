Ext.menu.TextItem = function(a) {
	if (typeof a == "string") {
		a = {
			text : a
		}
	}
	Ext.menu.TextItem.superclass.constructor.call(this, a)
};
Ext.extend(Ext.menu.TextItem, Ext.menu.BaseItem, {
			hideOnClick : false,
			itemCls : "x-menu-text",
			onRender : function() {
				var a = document.createElement("span");
				a.className = this.itemCls;
				a.innerHTML = this.text;
				this.el = a;
				Ext.menu.TextItem.superclass.onRender.apply(this, arguments)
			}
		});