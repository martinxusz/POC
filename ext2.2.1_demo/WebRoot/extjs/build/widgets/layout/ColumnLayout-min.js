Ext.layout.ColumnLayout = Ext.extend(Ext.layout.ContainerLayout, {
	monitorResize : true,
	extraCls : "x-column",
	scrollOffset : 0,
	isValidParent : function(b, a) {
		return (b.getPositionEl ? b.getPositionEl() : b.getEl()).dom.parentNode == this.innerCt.dom
	},
	onLayout : function(d, g) {
		var e = d.items.items, f = e.length, j, a;
		if (!this.innerCt) {
			g.addClass("x-column-layout-ct");
			this.innerCt = g.createChild({
						cls : "x-column-inner"
					});
			this.innerCt.createChild({
						cls : "x-clear"
					})
		}
		this.renderAll(d, this.innerCt);
		var m = Ext.isIE && g.dom != Ext.getBody().dom ? g.getStyleSize() : g
				.getViewSize();
		if (m.width < 1 && m.height < 1) {
			return
		}
		var k = m.width - g.getPadding("lr") - this.scrollOffset, b = m.height
				- g.getPadding("tb"), l = k;
		this.innerCt.setWidth(k);
		for (a = 0; a < f; a++) {
			j = e[a];
			if (!j.columnWidth) {
				l -= (j.getSize().width + j.getEl().getMargins("lr"))
			}
		}
		l = l < 0 ? 0 : l;
		for (a = 0; a < f; a++) {
			j = e[a];
			if (j.columnWidth) {
				j.setSize(Math.floor(j.columnWidth * l)
						- j.getEl().getMargins("lr"))
			}
		}
	}
});
Ext.Container.LAYOUTS.column = Ext.layout.ColumnLayout;