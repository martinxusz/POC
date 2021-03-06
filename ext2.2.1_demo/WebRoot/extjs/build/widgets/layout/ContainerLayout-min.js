Ext.layout.ContainerLayout = function(a) {
	Ext.apply(this, a)
};
Ext.layout.ContainerLayout.prototype = {
	monitorResize : false,
	activeItem : null,
	layout : function() {
		var a = this.container.getLayoutTarget();
		this.onLayout(this.container, a);
		this.container.fireEvent("afterlayout", this.container, this)
	},
	onLayout : function(a, b) {
		this.renderAll(a, b)
	},
	isValidParent : function(d, b) {
		var a = d.getPositionEl ? d.getPositionEl() : d.getEl();
		return a.dom.parentNode == b.dom
	},
	renderAll : function(e, f) {
		var b = e.items.items;
		for (var d = 0, a = b.length; d < a; d++) {
			var g = b[d];
			if (g && (!g.rendered || !this.isValidParent(g, f))) {
				this.renderItem(g, d, f)
			}
		}
	},
	renderItem : function(e, a, d) {
		if (e && !e.rendered) {
			e.render(d, a);
			if (this.extraCls) {
				var b = e.getPositionEl ? e.getPositionEl() : e;
				b.addClass(this.extraCls)
			}
			if (this.renderHidden && e != this.activeItem) {
				e.hide()
			}
		} else {
			if (e && !this.isValidParent(e, d)) {
				if (this.extraCls) {
					var b = e.getPositionEl ? e.getPositionEl() : e;
					b.addClass(this.extraCls)
				}
				if (typeof a == "number") {
					a = d.dom.childNodes[a]
				}
				d.dom.insertBefore(e.getEl().dom, a || null);
				if (this.renderHidden && e != this.activeItem) {
					e.hide()
				}
			}
		}
	},
	onResize : function() {
		if (this.container.collapsed) {
			return
		}
		var a = this.container.bufferResize;
		if (a) {
			if (!this.resizeTask) {
				this.resizeTask = new Ext.util.DelayedTask(this.layout, this);
				this.resizeBuffer = typeof a == "number" ? a : 100
			}
			this.resizeTask.delay(this.resizeBuffer)
		} else {
			this.layout()
		}
	},
	setContainer : function(a) {
		if (this.monitorResize && a != this.container) {
			if (this.container) {
				this.container.un("resize", this.onResize, this)
			}
			if (a) {
				a.on("resize", this.onResize, this)
			}
		}
		this.container = a
	},
	parseMargins : function(b) {
		var c = b.split(" ");
		var a = c.length;
		if (a == 1) {
			c[1] = c[0];
			c[2] = c[0];
			c[3] = c[0]
		}
		if (a == 2) {
			c[2] = c[0];
			c[3] = c[1]
		}
		return {
			top : parseInt(c[0], 10) || 0,
			right : parseInt(c[1], 10) || 0,
			bottom : parseInt(c[2], 10) || 0,
			left : parseInt(c[3], 10) || 0
		}
	},
	destroy : Ext.emptyFn
};
Ext.Container.LAYOUTS.auto = Ext.layout.ContainerLayout;