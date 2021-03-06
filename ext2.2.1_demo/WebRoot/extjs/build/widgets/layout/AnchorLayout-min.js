Ext.layout.AnchorLayout = Ext.extend(Ext.layout.ContainerLayout, {
	monitorResize : true,
	getAnchorViewSize : function(a, b) {
		return b.dom == document.body ? b.getViewSize() : b.getStyleSize()
	},
	onLayout : function(j, m) {
		Ext.layout.AnchorLayout.superclass.onLayout.call(this, j, m);
		var s = this.getAnchorViewSize(j, m);
		var q = s.width, g = s.height;
		if (q < 20 || g < 20) {
			return
		}
		var d, o;
		if (j.anchorSize) {
			if (typeof j.anchorSize == "number") {
				d = j.anchorSize
			} else {
				d = j.anchorSize.width;
				o = j.anchorSize.height
			}
		} else {
			d = j.initialConfig.width;
			o = j.initialConfig.height
		}
		var l = j.items.items, k = l.length, f, n, p, e, b;
		for (f = 0; f < k; f++) {
			n = l[f];
			if (n.anchor) {
				p = n.anchorSpec;
				if (!p) {
					var r = n.anchor.split(" ");
					n.anchorSpec = p = {
						right : this
								.parseAnchor(r[0], n.initialConfig.width, d),
						bottom : this.parseAnchor(r[1], n.initialConfig.height,
								o)
					}
				}
				e = p.right ? this.adjustWidthAnchor(p.right(q), n) : undefined;
				b = p.bottom
						? this.adjustHeightAnchor(p.bottom(g), n)
						: undefined;
				if (e || b) {
					n.setSize(e || undefined, b || undefined)
				}
			}
		}
	},
	parseAnchor : function(c, g, b) {
		if (c && c != "none") {
			var e;
			if (/^(r|right|b|bottom)$/i.test(c)) {
				var f = b - g;
				return function(a) {
					if (a !== e) {
						e = a;
						return a - f
					}
				}
			} else {
				if (c.indexOf("%") != -1) {
					var d = parseFloat(c.replace("%", "")) * 0.01;
					return function(a) {
						if (a !== e) {
							e = a;
							return Math.floor(a * d)
						}
					}
				} else {
					c = parseInt(c, 10);
					if (!isNaN(c)) {
						return function(a) {
							if (a !== e) {
								e = a;
								return a + c
							}
						}
					}
				}
			}
		}
		return false
	},
	adjustWidthAnchor : function(b, a) {
		return b
	},
	adjustHeightAnchor : function(b, a) {
		return b
	}
});
Ext.Container.LAYOUTS.anchor = Ext.layout.AnchorLayout;