Ext.Panel = Ext.extend(Ext.Container, {
	baseCls : "x-panel",
	collapsedCls : "x-panel-collapsed",
	maskDisabled : true,
	animCollapse : Ext.enableFx,
	headerAsText : true,
	buttonAlign : "right",
	collapsed : false,
	collapseFirst : true,
	minButtonWidth : 75,
	elements : "body",
	toolTarget : "header",
	collapseEl : "bwrap",
	slideAnchor : "t",
	disabledClass : "",
	deferHeight : true,
	expandDefaults : {
		duration : 0.25
	},
	collapseDefaults : {
		duration : 0.25
	},
	initComponent : function() {
		Ext.Panel.superclass.initComponent.call(this);
		this.addEvents("bodyresize", "titlechange", "iconchange", "collapse",
				"expand", "beforecollapse", "beforeexpand", "beforeclose",
				"close", "activate", "deactivate");
		if (this.tbar) {
			this.elements += ",tbar";
			if (typeof this.tbar == "object") {
				this.topToolbar = this.tbar
			}
			delete this.tbar
		}
		if (this.bbar) {
			this.elements += ",bbar";
			if (typeof this.bbar == "object") {
				this.bottomToolbar = this.bbar
			}
			delete this.bbar
		}
		if (this.header === true) {
			this.elements += ",header";
			delete this.header
		} else {
			if (this.title && this.header !== false) {
				this.elements += ",header"
			}
		}
		if (this.footer === true) {
			this.elements += ",footer";
			delete this.footer
		}
		if (this.buttons) {
			var c = this.buttons;
			this.buttons = [];
			for (var b = 0, a = c.length; b < a; b++) {
				if (c[b].render) {
					c[b].ownerCt = this;
					this.buttons.push(c[b])
				} else {
					this.addButton(c[b])
				}
			}
		}
		if (this.autoLoad) {
			this.on("render", this.doAutoLoad, this, {
						delay : 10
					})
		}
	},
	createElement : function(a, c) {
		if (this[a]) {
			c.appendChild(this[a].dom);
			return
		}
		if (a === "bwrap" || this.elements.indexOf(a) != -1) {
			if (this[a + "Cfg"]) {
				this[a] = Ext.fly(c).createChild(this[a + "Cfg"])
			} else {
				var b = document.createElement("div");
				b.className = this[a + "Cls"];
				this[a] = Ext.get(c.appendChild(b))
			}
			if (this[a + "CssClass"]) {
				this[a].addClass(this[a + "CssClass"])
			}
			if (this[a + "Style"]) {
				this[a].applyStyles(this[a + "Style"])
			}
		}
	},
	onRender : function(k, j) {
		Ext.Panel.superclass.onRender.call(this, k, j);
		this.createClasses();
		if (this.el) {
			this.el.addClass(this.baseCls);
			this.header = this.el.down("." + this.headerCls);
			this.bwrap = this.el.down("." + this.bwrapCls);
			var p = this.bwrap ? this.bwrap : this.el;
			this.tbar = p.down("." + this.tbarCls);
			this.body = p.down("." + this.bodyCls);
			this.bbar = p.down("." + this.bbarCls);
			this.footer = p.down("." + this.footerCls);
			this.fromMarkup = true
		} else {
			this.el = k.createChild({
						id : this.id,
						cls : this.baseCls
					}, j)
		}
		var a = this.el, n = a.dom;
		if (this.cls) {
			this.el.addClass(this.cls)
		}
		if (this.buttons) {
			this.elements += ",footer"
		}
		if (this.frame) {
			a.insertHtml("afterBegin", String.format(Ext.Element.boxMarkup,
							this.baseCls));
			this.createElement("header", n.firstChild.firstChild.firstChild);
			this.createElement("bwrap", n);
			var r = this.bwrap.dom;
			var g = n.childNodes[1], c = n.childNodes[2];
			r.appendChild(g);
			r.appendChild(c);
			var s = r.firstChild.firstChild.firstChild;
			this.createElement("tbar", s);
			this.createElement("body", s);
			this.createElement("bbar", s);
			this.createElement("footer", r.lastChild.firstChild.firstChild);
			if (!this.footer) {
				this.bwrap.dom.lastChild.className += " x-panel-nofooter"
			}
		} else {
			this.createElement("header", n);
			this.createElement("bwrap", n);
			var r = this.bwrap.dom;
			this.createElement("tbar", r);
			this.createElement("body", r);
			this.createElement("bbar", r);
			this.createElement("footer", r);
			if (!this.header) {
				this.body.addClass(this.bodyCls + "-noheader");
				if (this.tbar) {
					this.tbar.addClass(this.tbarCls + "-noheader")
				}
			}
		}
		if (this.border === false) {
			this.el.addClass(this.baseCls + "-noborder");
			this.body.addClass(this.bodyCls + "-noborder");
			if (this.header) {
				this.header.addClass(this.headerCls + "-noborder")
			}
			if (this.footer) {
				this.footer.addClass(this.footerCls + "-noborder")
			}
			if (this.tbar) {
				this.tbar.addClass(this.tbarCls + "-noborder")
			}
			if (this.bbar) {
				this.bbar.addClass(this.bbarCls + "-noborder")
			}
		}
		if (this.bodyBorder === false) {
			this.body.addClass(this.bodyCls + "-noborder")
		}
		this.bwrap.enableDisplayMode("block");
		if (this.header) {
			this.header.unselectable();
			if (this.headerAsText) {
				this.header.dom.innerHTML = '<span class="'
						+ this.headerTextCls + '">' + this.header.dom.innerHTML
						+ "</span>";
				if (this.iconCls) {
					this.setIconClass(this.iconCls)
				}
			}
		}
		if (this.floating) {
			this.makeFloating(this.floating)
		}
		if (this.collapsible) {
			this.tools = this.tools ? this.tools.slice(0) : [];
			if (!this.hideCollapseTool) {
				this.tools[this.collapseFirst ? "unshift" : "push"]({
							id : "toggle",
							handler : this.toggleCollapse,
							scope : this
						})
			}
			if (this.titleCollapse && this.header) {
				this.header.on("click", this.toggleCollapse, this);
				this.header.setStyle("cursor", "pointer")
			}
		}
		if (this.tools) {
			var m = this.tools;
			this.tools = {};
			this.addTool.apply(this, m)
		} else {
			this.tools = {}
		}
		if (this.buttons && this.buttons.length > 0) {
			var f = this.footer.createChild({
				cls : "x-panel-btns-ct",
				cn : {
					cls : "x-panel-btns x-panel-btns-" + this.buttonAlign,
					html : '<table cellspacing="0"><tbody><tr></tr></tbody></table><div class="x-clear"></div>'
				}
			}, null, true);
			var o = f.getElementsByTagName("tr")[0];
			for (var h = 0, l = this.buttons.length; h < l; h++) {
				var q = this.buttons[h];
				var e = document.createElement("td");
				e.className = "x-panel-btn-td";
				q.render(o.appendChild(e))
			}
		}
		if (this.tbar && this.topToolbar) {
			if (Ext.isArray(this.topToolbar)) {
				this.topToolbar = new Ext.Toolbar(this.topToolbar)
			}
			this.topToolbar.render(this.tbar);
			this.topToolbar.ownerCt = this
		}
		if (this.bbar && this.bottomToolbar) {
			if (Ext.isArray(this.bottomToolbar)) {
				this.bottomToolbar = new Ext.Toolbar(this.bottomToolbar)
			}
			this.bottomToolbar.render(this.bbar);
			this.bottomToolbar.ownerCt = this
		}
	},
	setIconClass : function(b) {
		var a = this.iconCls;
		this.iconCls = b;
		if (this.rendered && this.header) {
			if (this.frame) {
				this.header.addClass("x-panel-icon");
				this.header.replaceClass(a, this.iconCls)
			} else {
				var d = this.header.dom;
				var c = d.firstChild
						&& String(d.firstChild.tagName).toLowerCase() == "img"
						? d.firstChild
						: null;
				if (c) {
					Ext.fly(c).replaceClass(a, this.iconCls)
				} else {
					Ext.DomHelper.insertBefore(d.firstChild, {
								tag : "img",
								src : Ext.BLANK_IMAGE_URL,
								cls : "x-panel-inline-icon " + this.iconCls
							})
				}
			}
		}
		this.fireEvent("iconchange", this, b, a)
	},
	makeFloating : function(a) {
		this.floating = true;
		this.el = new Ext.Layer(typeof a == "object" ? a : {
					shadow : this.shadow !== undefined ? this.shadow : "sides",
					shadowOffset : this.shadowOffset,
					constrain : false,
					shim : this.shim === false ? false : undefined
				}, this.el)
	},
	getTopToolbar : function() {
		return this.topToolbar
	},
	getBottomToolbar : function() {
		return this.bottomToolbar
	},
	addButton : function(a, d, c) {
		var e = {
			handler : d,
			scope : c,
			minWidth : this.minButtonWidth,
			hideParent : true
		};
		if (typeof a == "string") {
			e.text = a
		} else {
			Ext.apply(e, a)
		}
		var b = new Ext.Button(e);
		b.ownerCt = this;
		if (!this.buttons) {
			this.buttons = []
		}
		this.buttons.push(b);
		return b
	},
	addTool : function() {
		if (!this[this.toolTarget]) {
			return
		}
		if (!this.toolTemplate) {
			var g = new Ext.Template('<div class="x-tool x-tool-{id}">&#160;</div>');
			g.disableFormats = true;
			g.compile();
			Ext.Panel.prototype.toolTemplate = g
		}
		for (var f = 0, d = arguments, c = d.length; f < c; f++) {
			var b = d[f];
			if (!this.tools[b.id]) {
				var h = "x-tool-" + b.id + "-over";
				var e = this.toolTemplate.insertFirst((b.align !== "left")
								? this[this.toolTarget]
								: this[this.toolTarget].child("span"), b, true);
				this.tools[b.id] = e;
				e.enableDisplayMode("block");
				e.on("click", this.createToolHandler(e, b, h, this));
				if (b.on) {
					e.on(b.on)
				}
				if (b.hidden) {
					e.hide()
				}
				if (b.qtip) {
					if (typeof b.qtip == "object") {
						Ext.QuickTips.register(Ext.apply({
									target : e.id
								}, b.qtip))
					} else {
						e.dom.qtip = b.qtip
					}
				}
				e.addClassOnOver(h)
			}
		}
	},
	onShow : function() {
		if (this.floating) {
			return this.el.show()
		}
		Ext.Panel.superclass.onShow.call(this)
	},
	onHide : function() {
		if (this.floating) {
			return this.el.hide()
		}
		Ext.Panel.superclass.onHide.call(this)
	},
	createToolHandler : function(c, a, d, b) {
		return function(f) {
			c.removeClass(d);
			f.stopEvent();
			if (a.handler) {
				a.handler.call(a.scope || c, f, c, b)
			}
		}
	},
	afterRender : function() {
		if (this.fromMarkup && this.height === undefined && !this.autoHeight) {
			this.height = this.el.getHeight()
		}
		if (this.floating && !this.hidden && !this.initHidden) {
			this.el.show()
		}
		if (this.title) {
			this.setTitle(this.title)
		}
		this.setAutoScroll();
		if (this.html) {
			this.body.update(typeof this.html == "object" ? Ext.DomHelper
					.markup(this.html) : this.html);
			delete this.html
		}
		if (this.contentEl) {
			var a = Ext.getDom(this.contentEl);
			Ext.fly(a).removeClass(["x-hidden", "x-hide-display"]);
			this.body.dom.appendChild(a)
		}
		if (this.collapsed) {
			this.collapsed = false;
			this.collapse(false)
		}
		Ext.Panel.superclass.afterRender.call(this);
		this.initEvents()
	},
	setAutoScroll : function() {
		if (this.rendered && this.autoScroll) {
			var a = this.body || this.el;
			if (a) {
				a.setOverflow("auto")
			}
		}
	},
	getKeyMap : function() {
		if (!this.keyMap) {
			this.keyMap = new Ext.KeyMap(this.el, this.keys)
		}
		return this.keyMap
	},
	initEvents : function() {
		if (this.keys) {
			this.getKeyMap()
		}
		if (this.draggable) {
			this.initDraggable()
		}
	},
	initDraggable : function() {
		this.dd = new Ext.Panel.DD(this, typeof this.draggable == "boolean"
						? null
						: this.draggable)
	},
	beforeEffect : function() {
		if (this.floating) {
			this.el.beforeAction()
		}
		this.el.addClass("x-panel-animated")
	},
	afterEffect : function() {
		this.syncShadow();
		this.el.removeClass("x-panel-animated")
	},
	createEffect : function(c, b, d) {
		var e = {
			scope : d,
			block : true
		};
		if (c === true) {
			e.callback = b;
			return e
		} else {
			if (!c.callback) {
				e.callback = b
			} else {
				e.callback = function() {
					b.call(d);
					Ext.callback(c.callback, c.scope)
				}
			}
		}
		return Ext.applyIf(e, c)
	},
	collapse : function(b) {
		if (this.collapsed || this.el.hasFxBlock()
				|| this.fireEvent("beforecollapse", this, b) === false) {
			return
		}
		var a = b === true || (b !== false && this.animCollapse);
		this.beforeEffect();
		this.onCollapse(a, b);
		return this
	},
	onCollapse : function(a, b) {
		if (a) {
			this[this.collapseEl].slideOut(this.slideAnchor, Ext.apply(this
									.createEffect(b || true,
											this.afterCollapse, this),
							this.collapseDefaults))
		} else {
			this[this.collapseEl].hide();
			this.afterCollapse()
		}
	},
	afterCollapse : function() {
		this.collapsed = true;
		this.el.addClass(this.collapsedCls);
		this.afterEffect();
		this.fireEvent("collapse", this)
	},
	expand : function(b) {
		if (!this.collapsed || this.el.hasFxBlock()
				|| this.fireEvent("beforeexpand", this, b) === false) {
			return
		}
		var a = b === true || (b !== false && this.animCollapse);
		this.el.removeClass(this.collapsedCls);
		this.beforeEffect();
		this.onExpand(a, b);
		return this
	},
	onExpand : function(a, b) {
		if (a) {
			this[this.collapseEl].slideIn(this.slideAnchor, Ext.apply(this
									.createEffect(b || true, this.afterExpand,
											this), this.expandDefaults))
		} else {
			this[this.collapseEl].show();
			this.afterExpand()
		}
	},
	afterExpand : function() {
		this.collapsed = false;
		this.afterEffect();
		this.fireEvent("expand", this)
	},
	toggleCollapse : function(a) {
		this[this.collapsed ? "expand" : "collapse"](a);
		return this
	},
	onDisable : function() {
		if (this.rendered && this.maskDisabled) {
			this.el.mask()
		}
		Ext.Panel.superclass.onDisable.call(this)
	},
	onEnable : function() {
		if (this.rendered && this.maskDisabled) {
			this.el.unmask()
		}
		Ext.Panel.superclass.onEnable.call(this)
	},
	onResize : function(a, b) {
		if (a !== undefined || b !== undefined) {
			if (!this.collapsed) {
				if (typeof a == "number") {
					this.body.setWidth(this.adjustBodyWidth(a
							- this.getFrameWidth()))
				} else {
					if (a == "auto") {
						this.body.setWidth(a)
					}
				}
				if (typeof b == "number") {
					this.body.setHeight(this.adjustBodyHeight(b
							- this.getFrameHeight()))
				} else {
					if (b == "auto") {
						this.body.setHeight(b)
					}
				}
				if (this.disabled && this.el._mask) {
					this.el._mask.setSize(this.el.dom.clientWidth, this.el
									.getHeight())
				}
			} else {
				this.queuedBodySize = {
					width : a,
					height : b
				};
				if (!this.queuedExpand && this.allowQueuedExpand !== false) {
					this.queuedExpand = true;
					this.on("expand", function() {
								delete this.queuedExpand;
								this.onResize(this.queuedBodySize.width,
										this.queuedBodySize.height);
								this.doLayout()
							}, this, {
								single : true
							})
				}
			}
			this.fireEvent("bodyresize", this, a, b)
		}
		this.syncShadow()
	},
	adjustBodyHeight : function(a) {
		return a
	},
	adjustBodyWidth : function(a) {
		return a
	},
	onPosition : function() {
		this.syncShadow()
	},
	getFrameWidth : function() {
		var b = this.el.getFrameWidth("lr");
		if (this.frame) {
			var a = this.bwrap.dom.firstChild;
			b += (Ext.fly(a).getFrameWidth("l") + Ext.fly(a.firstChild)
					.getFrameWidth("r"));
			var c = this.bwrap.dom.firstChild.firstChild.firstChild;
			b += Ext.fly(c).getFrameWidth("lr")
		}
		return b
	},
	getFrameHeight : function() {
		var a = this.el.getFrameWidth("tb");
		a += (this.tbar ? this.tbar.getHeight() : 0)
				+ (this.bbar ? this.bbar.getHeight() : 0);
		if (this.frame) {
			var c = this.el.dom.firstChild;
			var d = this.bwrap.dom.lastChild;
			a += (c.offsetHeight + d.offsetHeight);
			var b = this.bwrap.dom.firstChild.firstChild.firstChild;
			a += Ext.fly(b).getFrameWidth("tb")
		} else {
			a += (this.header ? this.header.getHeight() : 0)
					+ (this.footer ? this.footer.getHeight() : 0)
		}
		return a
	},
	getInnerWidth : function() {
		return this.getSize().width - this.getFrameWidth()
	},
	getInnerHeight : function() {
		return this.getSize().height - this.getFrameHeight()
	},
	syncShadow : function() {
		if (this.floating) {
			this.el.sync(true)
		}
	},
	getLayoutTarget : function() {
		return this.body
	},
	setTitle : function(b, a) {
		this.title = b;
		if (this.header && this.headerAsText) {
			this.header.child("span").update(b)
		}
		if (a) {
			this.setIconClass(a)
		}
		this.fireEvent("titlechange", this, b);
		return this
	},
	getUpdater : function() {
		return this.body.getUpdater()
	},
	load : function() {
		var a = this.body.getUpdater();
		a.update.apply(a, arguments);
		return this
	},
	beforeDestroy : function() {
		if (this.header) {
			this.header.removeAllListeners();
			if (this.headerAsText) {
				Ext.Element.uncache(this.header.child("span"))
			}
		}
		Ext.Element.uncache(this.header, this.tbar, this.bbar, this.footer,
				this.body, this.bwrap);
		if (this.tools) {
			for (var c in this.tools) {
				Ext.destroy(this.tools[c])
			}
		}
		if (this.buttons) {
			for (var a in this.buttons) {
				Ext.destroy(this.buttons[a])
			}
		}
		Ext.destroy(this.topToolbar, this.bottomToolbar);
		Ext.Panel.superclass.beforeDestroy.call(this)
	},
	createClasses : function() {
		this.headerCls = this.baseCls + "-header";
		this.headerTextCls = this.baseCls + "-header-text";
		this.bwrapCls = this.baseCls + "-bwrap";
		this.tbarCls = this.baseCls + "-tbar";
		this.bodyCls = this.baseCls + "-body";
		this.bbarCls = this.baseCls + "-bbar";
		this.footerCls = this.baseCls + "-footer"
	},
	createGhost : function(a, e, b) {
		var d = document.createElement("div");
		d.className = "x-panel-ghost " + (a ? a : "");
		if (this.header) {
			d.appendChild(this.el.dom.firstChild.cloneNode(true))
		}
		Ext.fly(d.appendChild(document.createElement("ul")))
				.setHeight(this.bwrap.getHeight());
		d.style.width = this.el.dom.offsetWidth + "px";
		if (!b) {
			this.container.dom.appendChild(d)
		} else {
			Ext.getDom(b).appendChild(d)
		}
		if (e !== false && this.el.useShim !== false) {
			var c = new Ext.Layer({
						shadow : false,
						useDisplay : true,
						constrain : false
					}, d);
			c.show();
			return c
		} else {
			return new Ext.Element(d)
		}
	},
	doAutoLoad : function() {
		this.body.load(typeof this.autoLoad == "object" ? this.autoLoad : {
			url : this.autoLoad
		})
	},
	getTool : function(a) {
		return this.tools[a]
	}
});
Ext.reg("panel", Ext.Panel);