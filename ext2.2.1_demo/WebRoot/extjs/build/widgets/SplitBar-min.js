Ext.SplitBar = function(c, e, b, d, a) {
	this.el = Ext.get(c, true);
	this.el.dom.unselectable = "on";
	this.resizingEl = Ext.get(e, true);
	this.orientation = b || Ext.SplitBar.HORIZONTAL;
	this.minSize = 0;
	this.maxSize = 2000;
	this.animate = false;
	this.useShim = false;
	this.shim = null;
	if (!a) {
		this.proxy = Ext.SplitBar.createProxy(this.orientation)
	} else {
		this.proxy = Ext.get(a).dom
	}
	this.dd = new Ext.dd.DDProxy(this.el.dom.id, "XSplitBars", {
				dragElId : this.proxy.id
			});
	this.dd.b4StartDrag = this.onStartProxyDrag.createDelegate(this);
	this.dd.endDrag = this.onEndProxyDrag.createDelegate(this);
	this.dragSpecs = {};
	this.adapter = new Ext.SplitBar.BasicLayoutAdapter();
	this.adapter.init(this);
	if (this.orientation == Ext.SplitBar.HORIZONTAL) {
		this.placement = d
				|| (this.el.getX() > this.resizingEl.getX()
						? Ext.SplitBar.LEFT
						: Ext.SplitBar.RIGHT);
		this.el.addClass("x-splitbar-h")
	} else {
		this.placement = d
				|| (this.el.getY() > this.resizingEl.getY()
						? Ext.SplitBar.TOP
						: Ext.SplitBar.BOTTOM);
		this.el.addClass("x-splitbar-v")
	}
	this.addEvents("resize", "moved", "beforeresize", "beforeapply");
	Ext.SplitBar.superclass.constructor.call(this)
};
Ext.extend(Ext.SplitBar, Ext.util.Observable, {
			onStartProxyDrag : function(a, e) {
				this.fireEvent("beforeresize", this);
				this.overlay = Ext.DomHelper.append(document.body, {
							cls : "x-drag-overlay",
							html : "&#160;"
						}, true);
				this.overlay.unselectable();
				this.overlay.setSize(Ext.lib.Dom.getViewWidth(true),
						Ext.lib.Dom.getViewHeight(true));
				this.overlay.show();
				Ext.get(this.proxy).setDisplayed("block");
				var c = this.adapter.getElementSize(this);
				this.activeMinSize = this.getMinimumSize();
				this.activeMaxSize = this.getMaximumSize();
				var d = c - this.activeMinSize;
				var b = Math.max(this.activeMaxSize - c, 0);
				if (this.orientation == Ext.SplitBar.HORIZONTAL) {
					this.dd.resetConstraints();
					this.dd.setXConstraint(this.placement == Ext.SplitBar.LEFT
									? d
									: b, this.placement == Ext.SplitBar.LEFT
									? b
									: d);
					this.dd.setYConstraint(0, 0)
				} else {
					this.dd.resetConstraints();
					this.dd.setXConstraint(0, 0);
					this.dd.setYConstraint(this.placement == Ext.SplitBar.TOP
									? d
									: b, this.placement == Ext.SplitBar.TOP
									? b
									: d)
				}
				this.dragSpecs.startSize = c;
				this.dragSpecs.startPoint = [a, e];
				Ext.dd.DDProxy.prototype.b4StartDrag.call(this.dd, a, e)
			},
			onEndProxyDrag : function(c) {
				Ext.get(this.proxy).setDisplayed(false);
				var b = Ext.lib.Event.getXY(c);
				if (this.overlay) {
					Ext.destroy(this.overlay);
					delete this.overlay
				}
				var a;
				if (this.orientation == Ext.SplitBar.HORIZONTAL) {
					a = this.dragSpecs.startSize
							+ (this.placement == Ext.SplitBar.LEFT
									? b[0] - this.dragSpecs.startPoint[0]
									: this.dragSpecs.startPoint[0] - b[0])
				} else {
					a = this.dragSpecs.startSize
							+ (this.placement == Ext.SplitBar.TOP
									? b[1] - this.dragSpecs.startPoint[1]
									: this.dragSpecs.startPoint[1] - b[1])
				}
				a = Math.min(Math.max(a, this.activeMinSize),
						this.activeMaxSize);
				if (a != this.dragSpecs.startSize) {
					if (this.fireEvent("beforeapply", this, a) !== false) {
						this.adapter.setElementSize(this, a);
						this.fireEvent("moved", this, a);
						this.fireEvent("resize", this, a)
					}
				}
			},
			getAdapter : function() {
				return this.adapter
			},
			setAdapter : function(a) {
				this.adapter = a;
				this.adapter.init(this)
			},
			getMinimumSize : function() {
				return this.minSize
			},
			setMinimumSize : function(a) {
				this.minSize = a
			},
			getMaximumSize : function() {
				return this.maxSize
			},
			setMaximumSize : function(a) {
				this.maxSize = a
			},
			setCurrentSize : function(b) {
				var a = this.animate;
				this.animate = false;
				this.adapter.setElementSize(this, b);
				this.animate = a
			},
			destroy : function(a) {
				if (this.shim) {
					this.shim.remove()
				}
				this.dd.unreg();
				Ext.destroy(Ext.get(this.proxy));
				if (a) {
					this.el.remove()
				}
			}
		});
Ext.SplitBar.createProxy = function(b) {
	var c = new Ext.Element(document.createElement("div"));
	c.unselectable();
	var a = "x-splitbar-proxy";
	c.addClass(a + " " + (b == Ext.SplitBar.HORIZONTAL ? a + "-h" : a + "-v"));
	document.body.appendChild(c.dom);
	return c.dom
};
Ext.SplitBar.BasicLayoutAdapter = function() {
};
Ext.SplitBar.BasicLayoutAdapter.prototype = {
	init : function(a) {
	},
	getElementSize : function(a) {
		if (a.orientation == Ext.SplitBar.HORIZONTAL) {
			return a.resizingEl.getWidth()
		} else {
			return a.resizingEl.getHeight()
		}
	},
	setElementSize : function(b, a, c) {
		if (b.orientation == Ext.SplitBar.HORIZONTAL) {
			if (!b.animate) {
				b.resizingEl.setWidth(a);
				if (c) {
					c(b, a)
				}
			} else {
				b.resizingEl.setWidth(a, true, 0.1, c, "easeOut")
			}
		} else {
			if (!b.animate) {
				b.resizingEl.setHeight(a);
				if (c) {
					c(b, a)
				}
			} else {
				b.resizingEl.setHeight(a, true, 0.1, c, "easeOut")
			}
		}
	}
};
Ext.SplitBar.AbsoluteLayoutAdapter = function(a) {
	this.basic = new Ext.SplitBar.BasicLayoutAdapter();
	this.container = Ext.get(a)
};
Ext.SplitBar.AbsoluteLayoutAdapter.prototype = {
	init : function(a) {
		this.basic.init(a)
	},
	getElementSize : function(a) {
		return this.basic.getElementSize(a)
	},
	setElementSize : function(b, a, c) {
		this.basic.setElementSize(b, a, this.moveSplitter.createDelegate(this,
						[b]))
	},
	moveSplitter : function(a) {
		var b = Ext.SplitBar;
		switch (a.placement) {
			case b.LEFT :
				a.el.setX(a.resizingEl.getRight());
				break;
			case b.RIGHT :
				a.el.setStyle("right",
						(this.container.getWidth() - a.resizingEl.getLeft())
								+ "px");
				break;
			case b.TOP :
				a.el.setY(a.resizingEl.getBottom());
				break;
			case b.BOTTOM :
				a.el.setY(a.resizingEl.getTop() - a.el.getHeight());
				break
		}
	}
};
Ext.SplitBar.VERTICAL = 1;
Ext.SplitBar.HORIZONTAL = 2;
Ext.SplitBar.LEFT = 1;
Ext.SplitBar.RIGHT = 2;
Ext.SplitBar.TOP = 3;
Ext.SplitBar.BOTTOM = 4;