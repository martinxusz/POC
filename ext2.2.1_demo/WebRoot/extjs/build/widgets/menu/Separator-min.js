Ext.menu.Separator = function(a) {
	Ext.menu.Separator.superclass.constructor.call(this, a)
};
Ext.extend(Ext.menu.Separator, Ext.menu.BaseItem, {
			itemCls : "x-menu-sep",
			hideOnClick : false,
			onRender : function(a) {
				var b = document.createElement("span");
				b.className = this.itemCls;
				b.innerHTML = "&#160;";
				this.el = b;
				a.addClass("x-menu-sep-li");
				Ext.menu.Separator.superclass.onRender.apply(this, arguments)
			}
		});