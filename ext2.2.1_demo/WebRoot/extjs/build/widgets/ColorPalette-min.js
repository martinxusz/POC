Ext.ColorPalette = function(a) {
	Ext.ColorPalette.superclass.constructor.call(this, a);
	this.addEvents("select");
	if (this.handler) {
		this.on("select", this.handler, this.scope, true)
	}
};
Ext.extend(Ext.ColorPalette, Ext.Component, {
	itemCls : "x-color-palette",
	value : null,
	clickEvent : "click",
	ctype : "Ext.ColorPalette",
	allowReselect : false,
	colors : ["000000", "993300", "333300", "003300", "003366", "000080",
			"333399", "333333", "800000", "FF6600", "808000", "008000",
			"008080", "0000FF", "666699", "808080", "FF0000", "FF9900",
			"99CC00", "339966", "33CCCC", "3366FF", "800080", "969696",
			"FF00FF", "FFCC00", "FFFF00", "00FF00", "00FFFF", "00CCFF",
			"993366", "C0C0C0", "FF99CC", "FFCC99", "FFFF99", "CCFFCC",
			"CCFFFF", "99CCFF", "CC99FF", "FFFFFF"],
	onRender : function(b, a) {
		var c = this.tpl
				|| new Ext.XTemplate('<tpl for="."><a href="#" class="color-{.}" hidefocus="on"><em><span style="background:#{.}" unselectable="on">&#160;</span></em></a></tpl>');
		var d = document.createElement("div");
		d.id = this.getId();
		d.className = this.itemCls;
		c.overwrite(d, this.colors);
		b.dom.insertBefore(d, a);
		this.el = Ext.get(d);
		this.el.on(this.clickEvent, this.handleClick, this, {
					delegate : "a"
				});
		if (this.clickEvent != "click") {
			this.el.on("click", Ext.emptyFn, this, {
						delegate : "a",
						preventDefault : true
					})
		}
	},
	afterRender : function() {
		Ext.ColorPalette.superclass.afterRender.call(this);
		if (this.value) {
			var a = this.value;
			this.value = null;
			this.select(a)
		}
	},
	handleClick : function(b, a) {
		b.preventDefault();
		if (!this.disabled) {
			var d = a.className.match(/(?:^|\s)color-(.{6})(?:\s|$)/)[1];
			this.select(d.toUpperCase())
		}
	},
	select : function(a) {
		a = a.replace("#", "");
		if (a != this.value || this.allowReselect) {
			var b = this.el;
			if (this.value) {
				b.child("a.color-" + this.value)
						.removeClass("x-color-palette-sel")
			}
			b.child("a.color-" + a).addClass("x-color-palette-sel");
			this.value = a;
			this.fireEvent("select", this, a)
		}
	}
});
Ext.reg("colorpalette", Ext.ColorPalette);