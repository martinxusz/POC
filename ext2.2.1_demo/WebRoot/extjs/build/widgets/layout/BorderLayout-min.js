Ext.layout.BorderLayout = Ext.extend(Ext.layout.ContainerLayout, {
	monitorResize : true,
	rendered : false,
	onLayout : function(d, G) {
		var f;
		if (!this.rendered) {
			G.position();
			G.addClass("x-border-layout-ct");
			var u = d.items.items;
			f = [];
			for (var z = 0, A = u.length; z < A; z++) {
				var D = u[z];
				var k = D.region;
				if (D.collapsed) {
					f.push(D)
				}
				D.collapsed = false;
				if (!D.rendered) {
					D.cls = D.cls
							? D.cls + " x-border-panel"
							: "x-border-panel";
					D.render(G, z)
				}
				this[k] = k != "center" && D.split
						? new Ext.layout.BorderLayout.SplitRegion(this,
								D.initialConfig, k)
						: new Ext.layout.BorderLayout.Region(this,
								D.initialConfig, k);
				this[k].render(G, D)
			}
			this.rendered = true
		}
		var t = G.getViewSize();
		if (t.width < 20 || t.height < 20) {
			if (f) {
				this.restoreCollapsed = f
			}
			return
		} else {
			if (this.restoreCollapsed) {
				f = this.restoreCollapsed;
				delete this.restoreCollapsed
			}
		}
		var q = t.width, B = t.height;
		var p = q, y = B, l = 0, o = 0;
		var v = this.north, r = this.south, j = this.west, C = this.east, D = this.center;
		if (!D && Ext.layout.BorderLayout.WARN !== false) {
			throw "No center region defined in BorderLayout " + d.id
		}
		if (v && v.isVisible()) {
			var F = v.getSize();
			var x = v.getMargins();
			F.width = q - (x.left + x.right);
			F.x = x.left;
			F.y = x.top;
			l = F.height + F.y + x.bottom;
			y -= l;
			v.applyLayout(F)
		}
		if (r && r.isVisible()) {
			var F = r.getSize();
			var x = r.getMargins();
			F.width = q - (x.left + x.right);
			F.x = x.left;
			var E = (F.height + x.top + x.bottom);
			F.y = B - E + x.top;
			y -= E;
			r.applyLayout(F)
		}
		if (j && j.isVisible()) {
			var F = j.getSize();
			var x = j.getMargins();
			F.height = y - (x.top + x.bottom);
			F.x = x.left;
			F.y = l + x.top;
			var a = (F.width + x.left + x.right);
			o += a;
			p -= a;
			j.applyLayout(F)
		}
		if (C && C.isVisible()) {
			var F = C.getSize();
			var x = C.getMargins();
			F.height = y - (x.top + x.bottom);
			var a = (F.width + x.left + x.right);
			F.x = q - a + x.left;
			F.y = l + x.top;
			p -= a;
			C.applyLayout(F)
		}
		if (D) {
			var x = D.getMargins();
			var g = {
				x : o + x.left,
				y : l + x.top,
				width : p - (x.left + x.right),
				height : y - (x.top + x.bottom)
			};
			D.applyLayout(g)
		}
		if (f) {
			for (var z = 0, A = f.length; z < A; z++) {
				f[z].collapse(false)
			}
		}
		if (Ext.isIE && Ext.isStrict) {
			G.repaint()
		}
	},
	destroy : function() {
		var b = ["north", "south", "east", "west"];
		for (var a = 0; a < b.length; a++) {
			var c = this[b[a]];
			if (c) {
				if (c.destroy) {
					c.destroy()
				} else {
					if (c.split) {
						c.split.destroy(true)
					}
				}
			}
		}
		Ext.layout.BorderLayout.superclass.destroy.call(this)
	}
});
Ext.layout.BorderLayout.Region = function(b, a, c) {
	Ext.apply(this, a);
	this.layout = b;
	this.position = c;
	this.state = {};
	if (typeof this.margins == "string") {
		this.margins = this.layout.parseMargins(this.margins)
	}
	this.margins = Ext.applyIf(this.margins || {}, this.defaultMargins);
	if (this.collapsible) {
		if (typeof this.cmargins == "string") {
			this.cmargins = this.layout.parseMargins(this.cmargins)
		}
		if (this.collapseMode == "mini" && !this.cmargins) {
			this.cmargins = {
				left : 0,
				top : 0,
				right : 0,
				bottom : 0
			}
		} else {
			this.cmargins = Ext.applyIf(this.cmargins || {}, c == "north"
							|| c == "south"
							? this.defaultNSCMargins
							: this.defaultEWCMargins)
		}
	}
};
Ext.layout.BorderLayout.Region.prototype = {
	collapsible : false,
	split : false,
	floatable : true,
	minWidth : 50,
	minHeight : 50,
	defaultMargins : {
		left : 0,
		top : 0,
		right : 0,
		bottom : 0
	},
	defaultNSCMargins : {
		left : 5,
		top : 5,
		right : 5,
		bottom : 5
	},
	defaultEWCMargins : {
		left : 5,
		top : 0,
		right : 5,
		bottom : 0
	},
	isCollapsed : false,
	render : function(b, c) {
		this.panel = c;
		c.el.enableDisplayMode();
		this.targetEl = b;
		this.el = c.el;
		var a = c.getState, d = this.position;
		c.getState = function() {
			return Ext.apply(a.call(c) || {}, this.state)
		}.createDelegate(this);
		if (d != "center") {
			c.allowQueuedExpand = false;
			c.on({
						beforecollapse : this.beforeCollapse,
						collapse : this.onCollapse,
						beforeexpand : this.beforeExpand,
						expand : this.onExpand,
						hide : this.onHide,
						show : this.onShow,
						scope : this
					});
			if (this.collapsible) {
				c.collapseEl = "el";
				c.slideAnchor = this.getSlideAnchor()
			}
			if (c.tools && c.tools.toggle) {
				c.tools.toggle.addClass("x-tool-collapse-" + d);
				c.tools.toggle.addClassOnOver("x-tool-collapse-" + d + "-over")
			}
		}
	},
	getCollapsedEl : function() {
		if (!this.collapsedEl) {
			if (!this.toolTemplate) {
				var b = new Ext.Template('<div class="x-tool x-tool-{id}">&#160;</div>');
				b.disableFormats = true;
				b.compile();
				Ext.layout.BorderLayout.Region.prototype.toolTemplate = b
			}
			this.collapsedEl = this.targetEl.createChild({
						cls : "x-layout-collapsed x-layout-collapsed-"
								+ this.position,
						id : this.panel.id + "-xcollapsed"
					});
			this.collapsedEl.enableDisplayMode("block");
			if (this.collapseMode == "mini") {
				this.collapsedEl.addClass("x-layout-cmini-" + this.position);
				this.miniCollapsedEl = this.collapsedEl.createChild({
							cls : "x-layout-mini x-layout-mini-"
									+ this.position,
							html : "&#160;"
						});
				this.miniCollapsedEl.addClassOnOver("x-layout-mini-over");
				this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
				this.collapsedEl.on("click", this.onExpandClick, this, {
							stopEvent : true
						})
			} else {
				var a = this.toolTemplate.append(this.collapsedEl.dom, {
							id : "expand-" + this.position
						}, true);
				a.addClassOnOver("x-tool-expand-" + this.position + "-over");
				a.on("click", this.onExpandClick, this, {
							stopEvent : true
						});
				if (this.floatable !== false) {
					this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
					this.collapsedEl.on("click", this.collapseClick, this)
				}
			}
		}
		return this.collapsedEl
	},
	onExpandClick : function(a) {
		if (this.isSlid) {
			this.afterSlideIn();
			this.panel.expand(false)
		} else {
			this.panel.expand()
		}
	},
	onCollapseClick : function(a) {
		this.panel.collapse()
	},
	beforeCollapse : function(b, a) {
		this.lastAnim = a;
		if (this.splitEl) {
			this.splitEl.hide()
		}
		this.getCollapsedEl().show();
		this.panel.el.setStyle("z-index", 100);
		this.isCollapsed = true;
		this.layout.layout()
	},
	onCollapse : function(a) {
		this.panel.el.setStyle("z-index", 1);
		if (this.lastAnim === false || this.panel.animCollapse === false) {
			this.getCollapsedEl().dom.style.visibility = "visible"
		} else {
			this.getCollapsedEl().slideIn(this.panel.slideAnchor, {
						duration : 0.2
					})
		}
		this.state.collapsed = true;
		this.panel.saveState()
	},
	beforeExpand : function(a) {
		var b = this.getCollapsedEl();
		this.el.show();
		if (this.position == "east" || this.position == "west") {
			this.panel.setSize(undefined, b.getHeight())
		} else {
			this.panel.setSize(b.getWidth(), undefined)
		}
		b.hide();
		b.dom.style.visibility = "hidden";
		this.panel.el.setStyle("z-index", 100)
	},
	onExpand : function() {
		this.isCollapsed = false;
		if (this.splitEl) {
			this.splitEl.show()
		}
		this.layout.layout();
		this.panel.el.setStyle("z-index", 1);
		this.state.collapsed = false;
		this.panel.saveState()
	},
	collapseClick : function(a) {
		if (this.isSlid) {
			a.stopPropagation();
			this.slideIn()
		} else {
			a.stopPropagation();
			this.slideOut()
		}
	},
	onHide : function() {
		if (this.isCollapsed) {
			this.getCollapsedEl().hide()
		} else {
			if (this.splitEl) {
				this.splitEl.hide()
			}
		}
	},
	onShow : function() {
		if (this.isCollapsed) {
			this.getCollapsedEl().show()
		} else {
			if (this.splitEl) {
				this.splitEl.show()
			}
		}
	},
	isVisible : function() {
		return !this.panel.hidden
	},
	getMargins : function() {
		return this.isCollapsed && this.cmargins ? this.cmargins : this.margins
	},
	getSize : function() {
		return this.isCollapsed ? this.getCollapsedEl().getSize() : this.panel
				.getSize()
	},
	setPanel : function(a) {
		this.panel = a
	},
	getMinWidth : function() {
		return this.minWidth
	},
	getMinHeight : function() {
		return this.minHeight
	},
	applyLayoutCollapsed : function(a) {
		var b = this.getCollapsedEl();
		b.setLeftTop(a.x, a.y);
		b.setSize(a.width, a.height)
	},
	applyLayout : function(a) {
		if (this.isCollapsed) {
			this.applyLayoutCollapsed(a)
		} else {
			this.panel.setPosition(a.x, a.y);
			this.panel.setSize(a.width, a.height)
		}
	},
	beforeSlide : function() {
		this.panel.beforeEffect()
	},
	afterSlide : function() {
		this.panel.afterEffect()
	},
	initAutoHide : function() {
		if (this.autoHide !== false) {
			if (!this.autoHideHd) {
				var a = new Ext.util.DelayedTask(this.slideIn, this);
				this.autoHideHd = {
					mouseout : function(b) {
						if (!b.within(this.el, true)) {
							a.delay(500)
						}
					},
					mouseover : function(b) {
						a.cancel()
					},
					scope : this
				}
			}
			this.el.on(this.autoHideHd)
		}
	},
	clearAutoHide : function() {
		if (this.autoHide !== false) {
			this.el.un("mouseout", this.autoHideHd.mouseout);
			this.el.un("mouseover", this.autoHideHd.mouseover)
		}
	},
	clearMonitor : function() {
		Ext.getDoc().un("click", this.slideInIf, this)
	},
	slideOut : function() {
		if (this.isSlid || this.el.hasActiveFx()) {
			return
		}
		this.isSlid = true;
		var a = this.panel.tools;
		if (a && a.toggle) {
			a.toggle.hide()
		}
		this.el.show();
		if (this.position == "east" || this.position == "west") {
			this.panel.setSize(undefined, this.collapsedEl.getHeight())
		} else {
			this.panel.setSize(this.collapsedEl.getWidth(), undefined)
		}
		this.restoreLT = [this.el.dom.style.left, this.el.dom.style.top];
		this.el.alignTo(this.collapsedEl, this.getCollapseAnchor());
		this.el.setStyle("z-index", 102);
		this.panel.el.replaceClass("x-panel-collapsed", "x-panel-floating");
		if (this.animFloat !== false) {
			this.beforeSlide();
			this.el.slideIn(this.getSlideAnchor(), {
						callback : function() {
							this.afterSlide();
							this.initAutoHide();
							Ext.getDoc().on("click", this.slideInIf, this)
						},
						scope : this,
						block : true
					})
		} else {
			this.initAutoHide();
			Ext.getDoc().on("click", this.slideInIf, this)
		}
	},
	afterSlideIn : function() {
		this.clearAutoHide();
		this.isSlid = false;
		this.clearMonitor();
		this.el.setStyle("z-index", "");
		this.panel.el.replaceClass("x-panel-floating", "x-panel-collapsed");
		this.el.dom.style.left = this.restoreLT[0];
		this.el.dom.style.top = this.restoreLT[1];
		var a = this.panel.tools;
		if (a && a.toggle) {
			a.toggle.show()
		}
	},
	slideIn : function(a) {
		if (!this.isSlid || this.el.hasActiveFx()) {
			Ext.callback(a);
			return
		}
		this.isSlid = false;
		if (this.animFloat !== false) {
			this.beforeSlide();
			this.el.slideOut(this.getSlideAnchor(), {
						callback : function() {
							this.el.hide();
							this.afterSlide();
							this.afterSlideIn();
							Ext.callback(a)
						},
						scope : this,
						block : true
					})
		} else {
			this.el.hide();
			this.afterSlideIn()
		}
	},
	slideInIf : function(a) {
		if (!a.within(this.el)) {
			this.slideIn()
		}
	},
	anchors : {
		west : "left",
		east : "right",
		north : "top",
		south : "bottom"
	},
	sanchors : {
		west : "l",
		east : "r",
		north : "t",
		south : "b"
	},
	canchors : {
		west : "tl-tr",
		east : "tr-tl",
		north : "tl-bl",
		south : "bl-tl"
	},
	getAnchor : function() {
		return this.anchors[this.position]
	},
	getCollapseAnchor : function() {
		return this.canchors[this.position]
	},
	getSlideAnchor : function() {
		return this.sanchors[this.position]
	},
	getAlignAdj : function() {
		var a = this.cmargins;
		switch (this.position) {
			case "west" :
				return [0, 0];
				break;
			case "east" :
				return [0, 0];
				break;
			case "north" :
				return [0, 0];
				break;
			case "south" :
				return [0, 0];
				break
		}
	},
	getExpandAdj : function() {
		var b = this.collapsedEl, a = this.cmargins;
		switch (this.position) {
			case "west" :
				return [-(a.right + b.getWidth() + a.left), 0];
				break;
			case "east" :
				return [a.right + b.getWidth() + a.left, 0];
				break;
			case "north" :
				return [0, -(a.top + a.bottom + b.getHeight())];
				break;
			case "south" :
				return [0, a.top + a.bottom + b.getHeight()];
				break
		}
	}
};
Ext.layout.BorderLayout.SplitRegion = function(b, a, c) {
	Ext.layout.BorderLayout.SplitRegion.superclass.constructor.call(this, b, a,
			c);
	this.applyLayout = this.applyFns[c]
};
Ext.extend(Ext.layout.BorderLayout.SplitRegion, Ext.layout.BorderLayout.Region,
		{
			splitTip : "Drag to resize.",
			collapsibleSplitTip : "Drag to resize. Double click to hide.",
			useSplitTips : false,
			splitSettings : {
				north : {
					orientation : Ext.SplitBar.VERTICAL,
					placement : Ext.SplitBar.TOP,
					maxFn : "getVMaxSize",
					minProp : "minHeight",
					maxProp : "maxHeight"
				},
				south : {
					orientation : Ext.SplitBar.VERTICAL,
					placement : Ext.SplitBar.BOTTOM,
					maxFn : "getVMaxSize",
					minProp : "minHeight",
					maxProp : "maxHeight"
				},
				east : {
					orientation : Ext.SplitBar.HORIZONTAL,
					placement : Ext.SplitBar.RIGHT,
					maxFn : "getHMaxSize",
					minProp : "minWidth",
					maxProp : "maxWidth"
				},
				west : {
					orientation : Ext.SplitBar.HORIZONTAL,
					placement : Ext.SplitBar.LEFT,
					maxFn : "getHMaxSize",
					minProp : "minWidth",
					maxProp : "maxWidth"
				}
			},
			applyFns : {
				west : function(c) {
					if (this.isCollapsed) {
						return this.applyLayoutCollapsed(c)
					}
					var d = this.splitEl.dom, b = d.style;
					this.panel.setPosition(c.x, c.y);
					var a = d.offsetWidth;
					b.left = (c.x + c.width - a) + "px";
					b.top = (c.y) + "px";
					b.height = Math.max(0, c.height) + "px";
					this.panel.setSize(c.width - a, c.height)
				},
				east : function(c) {
					if (this.isCollapsed) {
						return this.applyLayoutCollapsed(c)
					}
					var d = this.splitEl.dom, b = d.style;
					var a = d.offsetWidth;
					this.panel.setPosition(c.x + a, c.y);
					b.left = (c.x) + "px";
					b.top = (c.y) + "px";
					b.height = Math.max(0, c.height) + "px";
					this.panel.setSize(c.width - a, c.height)
				},
				north : function(c) {
					if (this.isCollapsed) {
						return this.applyLayoutCollapsed(c)
					}
					var d = this.splitEl.dom, b = d.style;
					var a = d.offsetHeight;
					this.panel.setPosition(c.x, c.y);
					b.left = (c.x) + "px";
					b.top = (c.y + c.height - a) + "px";
					b.width = Math.max(0, c.width) + "px";
					this.panel.setSize(c.width, c.height - a)
				},
				south : function(c) {
					if (this.isCollapsed) {
						return this.applyLayoutCollapsed(c)
					}
					var d = this.splitEl.dom, b = d.style;
					var a = d.offsetHeight;
					this.panel.setPosition(c.x, c.y + a);
					b.left = (c.x) + "px";
					b.top = (c.y) + "px";
					b.width = Math.max(0, c.width) + "px";
					this.panel.setSize(c.width, c.height - a)
				}
			},
			render : function(a, c) {
				Ext.layout.BorderLayout.SplitRegion.superclass.render.call(
						this, a, c);
				var d = this.position;
				this.splitEl = a.createChild({
							cls : "x-layout-split x-layout-split-" + d,
							html : "&#160;",
							id : this.panel.id + "-xsplit"
						});
				if (this.collapseMode == "mini") {
					this.miniSplitEl = this.splitEl.createChild({
								cls : "x-layout-mini x-layout-mini-" + d,
								html : "&#160;"
							});
					this.miniSplitEl.addClassOnOver("x-layout-mini-over");
					this.miniSplitEl.on("click", this.onCollapseClick, this, {
								stopEvent : true
							})
				}
				var b = this.splitSettings[d];
				this.split = new Ext.SplitBar(this.splitEl.dom, c.el,
						b.orientation);
				this.split.placement = b.placement;
				this.split.getMaximumSize = this[b.maxFn].createDelegate(this);
				this.split.minSize = this.minSize || this[b.minProp];
				this.split.on("beforeapply", this.onSplitMove, this);
				this.split.useShim = this.useShim === true;
				this.maxSize = this.maxSize || this[b.maxProp];
				if (c.hidden) {
					this.splitEl.hide()
				}
				if (this.useSplitTips) {
					this.splitEl.dom.title = this.collapsible
							? this.collapsibleSplitTip
							: this.splitTip
				}
				if (this.collapsible) {
					this.splitEl.on("dblclick", this.onCollapseClick, this)
				}
			},
			getSize : function() {
				if (this.isCollapsed) {
					return this.collapsedEl.getSize()
				}
				var a = this.panel.getSize();
				if (this.position == "north" || this.position == "south") {
					a.height += this.splitEl.dom.offsetHeight
				} else {
					a.width += this.splitEl.dom.offsetWidth
				}
				return a
			},
			getHMaxSize : function() {
				var b = this.maxSize || 10000;
				var a = this.layout.center;
				return Math.min(b, (this.el.getWidth() + a.el.getWidth())
								- a.getMinWidth())
			},
			getVMaxSize : function() {
				var b = this.maxSize || 10000;
				var a = this.layout.center;
				return Math.min(b, (this.el.getHeight() + a.el.getHeight())
								- a.getMinHeight())
			},
			onSplitMove : function(b, a) {
				var c = this.panel.getSize();
				this.lastSplitSize = a;
				if (this.position == "north" || this.position == "south") {
					this.panel.setSize(c.width, a);
					this.state.height = a
				} else {
					this.panel.setSize(a, c.height);
					this.state.width = a
				}
				this.layout.layout();
				this.panel.saveState();
				return false
			},
			getSplitBar : function() {
				return this.split
			},
			destroy : function() {
				Ext.destroy(this.miniSplitEl, this.split, this.splitEl)
			}
		});
Ext.Container.LAYOUTS.border = Ext.layout.BorderLayout;