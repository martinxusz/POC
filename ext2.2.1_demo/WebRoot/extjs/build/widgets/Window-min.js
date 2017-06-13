Ext.Window = Ext.extend(Ext.Panel, {
	baseCls : "x-window",
	resizable : true,
	draggable : true,
	closable : true,
	constrain : false,
	constrainHeader : false,
	plain : false,
	minimizable : false,
	maximizable : false,
	minHeight : 100,
	minWidth : 200,
	expandOnShow : true,
	closeAction : "close",
	elements : "header,body",
	collapsible : false,
	initHidden : true,
	monitorResize : true,
	frame : true,
	floating : true,
	initComponent : function() {
		Ext.Window.superclass.initComponent.call(this);
		this.addEvents("resize", "maximize", "minimize", "restore")
	},
	getState : function() {
		return Ext.apply(Ext.Window.superclass.getState.call(this) || {}, this
						.getBox())
	},
	onRender : function(b, a) {
		Ext.Window.superclass.onRender.call(this, b, a);
		if (this.plain) {
			this.el.addClass("x-window-plain")
		}
		this.focusEl = this.el.createChild({
					tag : "a",
					href : "#",
					cls : "x-dlg-focus",
					tabIndex : "-1",
					html : "&#160;"
				});
		this.focusEl.swallowEvent("click", true);
		this.proxy = this.el.createProxy("x-window-proxy");
		this.proxy.enableDisplayMode("block");
		if (this.modal) {
			this.mask = this.container.createChild({
						cls : "ext-el-mask"
					}, this.el.dom);
			this.mask.enableDisplayMode("block");
			this.mask.hide();
			this.mask.on("click", this.focus, this)
		}
	},
	initEvents : function() {
		Ext.Window.superclass.initEvents.call(this);
		if (this.animateTarget) {
			this.setAnimateTarget(this.animateTarget)
		}
		if (this.resizable) {
			this.resizer = new Ext.Resizable(this.el, {
						minWidth : this.minWidth,
						minHeight : this.minHeight,
						handles : this.resizeHandles || "all",
						pinned : true,
						resizeElement : this.resizerAction
					});
			this.resizer.window = this;
			this.resizer.on("beforeresize", this.beforeResize, this)
		}
		if (this.draggable) {
			this.header.addClass("x-window-draggable")
		}
		this.initTools();
		this.el.on("mousedown", this.toFront, this);
		this.manager = this.manager || Ext.WindowMgr;
		this.manager.register(this);
		this.hidden = true;
		if (this.maximized) {
			this.maximized = false;
			this.maximize()
		}
		if (this.closable) {
			var a = this.getKeyMap();
			a.on(27, this.onEsc, this);
			a.disable()
		}
	},
	initDraggable : function() {
		this.dd = new Ext.Window.DD(this)
	},
	onEsc : function() {
		this[this.closeAction]()
	},
	beforeDestroy : function() {
		this.hide();
		if (this.doAnchor) {
			Ext.EventManager.removeResizeListener(this.doAnchor, this);
			Ext.EventManager.un(window, "scroll", this.doAnchor, this)
		}
		Ext.destroy(this.focusEl, this.resizer, this.dd, this.proxy, this.mask);
		Ext.Window.superclass.beforeDestroy.call(this)
	},
	onDestroy : function() {
		if (this.manager) {
			this.manager.unregister(this)
		}
		Ext.Window.superclass.onDestroy.call(this)
	},
	initTools : function() {
		if (this.minimizable) {
			this.addTool({
						id : "minimize",
						handler : this.minimize.createDelegate(this, [])
					})
		}
		if (this.maximizable) {
			this.addTool({
						id : "maximize",
						handler : this.maximize.createDelegate(this, [])
					});
			this.addTool({
						id : "restore",
						handler : this.restore.createDelegate(this, []),
						hidden : true
					});
			this.header.on("dblclick", this.toggleMaximize, this)
		}
		if (this.closable) {
			this.addTool({
						id : "close",
						handler : this[this.closeAction].createDelegate(this,
								[])
					})
		}
	},
	resizerAction : function() {
		var a = this.proxy.getBox();
		this.proxy.hide();
		this.window.handleResize(a);
		return a
	},
	beforeResize : function() {
		this.resizer.minHeight = Math.max(this.minHeight, this.getFrameHeight()
						+ 40);
		this.resizer.minWidth = Math.max(this.minWidth, this.getFrameWidth()
						+ 40);
		this.resizeBox = this.el.getBox()
	},
	updateHandles : function() {
		if (Ext.isIE && this.resizer) {
			this.resizer.syncHandleHeight();
			this.el.repaint()
		}
	},
	handleResize : function(b) {
		var a = this.resizeBox;
		if (a.x != b.x || a.y != b.y) {
			this.updateBox(b)
		} else {
			this.setSize(b)
		}
		this.focus();
		this.updateHandles();
		this.saveState();
		if (this.layout) {
			this.doLayout()
		}
		this.fireEvent("resize", this, b.width, b.height)
	},
	focus : function() {
		var c = this.focusEl, a = this.defaultButton, b = typeof a;
		if (b != "undefined") {
			if (b == "number") {
				c = this.buttons[a]
			} else {
				if (b == "string") {
					c = Ext.getCmp(a)
				} else {
					c = a
				}
			}
		}
		c.focus.defer(10, c)
	},
	setAnimateTarget : function(a) {
		a = Ext.get(a);
		this.animateTarget = a
	},
	beforeShow : function() {
		delete this.el.lastXY;
		delete this.el.lastLT;
		if (this.x === undefined || this.y === undefined) {
			var a = this.el.getAlignToXY(this.container, "c-c");
			var b = this.el.translatePoints(a[0], a[1]);
			this.x = this.x === undefined ? b.left : this.x;
			this.y = this.y === undefined ? b.top : this.y
		}
		this.el.setLeftTop(this.x, this.y);
		if (this.expandOnShow) {
			this.expand(false)
		}
		if (this.modal) {
			Ext.getBody().addClass("x-body-masked");
			this.mask.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom
							.getViewHeight(true));
			this.mask.show()
		}
	},
	show : function(c, a, b) {
		if (!this.rendered) {
			this.render(Ext.getBody())
		}
		if (this.hidden === false) {
			this.toFront();
			return
		}
		if (this.fireEvent("beforeshow", this) === false) {
			return
		}
		if (a) {
			this.on("show", a, b, {
						single : true
					})
		}
		this.hidden = false;
		if (c !== undefined) {
			this.setAnimateTarget(c)
		}
		this.beforeShow();
		if (this.animateTarget) {
			this.animShow()
		} else {
			this.afterShow()
		}
	},
	afterShow : function() {
		this.proxy.hide();
		this.el.setStyle("display", "block");
		this.el.show();
		if (this.maximized) {
			this.fitContainer()
		}
		if (Ext.isMac && Ext.isGecko) {
			this.cascade(this.setAutoScroll)
		}
		if (this.monitorResize || this.modal || this.constrain
				|| this.constrainHeader) {
			Ext.EventManager.onWindowResize(this.onWindowResize, this)
		}
		this.doConstrain();
		if (this.layout) {
			this.doLayout()
		}
		if (this.keyMap) {
			this.keyMap.enable()
		}
		this.toFront();
		this.updateHandles();
		this.fireEvent("show", this)
	},
	animShow : function() {
		this.proxy.show();
		this.proxy.setBox(this.animateTarget.getBox());
		this.proxy.setOpacity(0);
		var a = this.getBox(false);
		a.callback = this.afterShow;
		a.scope = this;
		a.duration = 0.25;
		a.easing = "easeNone";
		a.opacity = 0.5;
		a.block = true;
		this.el.setStyle("display", "none");
		this.proxy.shift(a)
	},
	hide : function(c, a, b) {
		if (this.activeGhost) {
			this.hide.defer(100, this, [c, a, b]);
			return
		}
		if (this.hidden || this.fireEvent("beforehide", this) === false) {
			return
		}
		if (a) {
			this.on("hide", a, b, {
						single : true
					})
		}
		this.hidden = true;
		if (c !== undefined) {
			this.setAnimateTarget(c)
		}
		if (this.animateTarget) {
			this.animHide()
		} else {
			this.el.hide();
			this.afterHide()
		}
	},
	afterHide : function() {
		this.proxy.hide();
		if (this.monitorResize || this.modal || this.constrain
				|| this.constrainHeader) {
			Ext.EventManager.removeResizeListener(this.onWindowResize, this)
		}
		if (this.modal) {
			this.mask.hide();
			Ext.getBody().removeClass("x-body-masked")
		}
		if (this.keyMap) {
			this.keyMap.disable()
		}
		this.fireEvent("hide", this)
	},
	animHide : function() {
		this.proxy.setOpacity(0.5);
		this.proxy.show();
		var c = this.getBox(false);
		this.proxy.setBox(c);
		this.el.hide();
		var a = this.animateTarget.getBox();
		a.callback = this.afterHide;
		a.scope = this;
		a.duration = 0.25;
		a.easing = "easeNone";
		a.block = true;
		a.opacity = 0;
		this.proxy.shift(a)
	},
	onWindowResize : function() {
		if (this.maximized) {
			this.fitContainer()
		}
		if (this.modal) {
			this.mask.setSize("100%", "100%");
			var a = this.mask.dom.offsetHeight;
			this.mask.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom
							.getViewHeight(true))
		}
		this.doConstrain()
	},
	doConstrain : function() {
		if (this.constrain || this.constrainHeader) {
			var b;
			if (this.constrain) {
				b = {
					right : this.el.shadowOffset,
					left : this.el.shadowOffset,
					bottom : this.el.shadowOffset
				}
			} else {
				var a = this.getSize();
				b = {
					right : -(a.width - 100),
					bottom : -(a.height - 25)
				}
			}
			var c = this.el.getConstrainToXY(this.container, true, b);
			if (c) {
				this.setPosition(c[0], c[1])
			}
		}
	},
	ghost : function(a) {
		var c = this.createGhost(a);
		var b = this.getBox(true);
		c.setLeftTop(b.x, b.y);
		c.setWidth(b.width);
		this.el.hide();
		this.activeGhost = c;
		return c
	},
	unghost : function(b, a) {
		if (b !== false) {
			this.el.show();
			this.focus();
			if (Ext.isMac && Ext.isGecko) {
				this.cascade(this.setAutoScroll)
			}
		}
		if (a !== false) {
			this.setPosition(this.activeGhost.getLeft(true), this.activeGhost
							.getTop(true))
		}
		this.activeGhost.hide();
		this.activeGhost.remove();
		delete this.activeGhost
	},
	minimize : function() {
		this.fireEvent("minimize", this)
	},
	close : function() {
		if (this.fireEvent("beforeclose", this) !== false) {
			this.hide(null, function() {
						this.fireEvent("close", this);
						this.destroy()
					}, this)
		}
	},
	maximize : function() {
		if (!this.maximized) {
			this.expand(false);
			this.restoreSize = this.getSize();
			this.restorePos = this.getPosition(true);
			if (this.maximizable) {
				this.tools.maximize.hide();
				this.tools.restore.show()
			}
			this.maximized = true;
			this.el.disableShadow();
			if (this.dd) {
				this.dd.lock()
			}
			if (this.collapsible) {
				this.tools.toggle.hide()
			}
			this.el.addClass("x-window-maximized");
			this.container.addClass("x-window-maximized-ct");
			this.setPosition(0, 0);
			this.fitContainer();
			this.fireEvent("maximize", this)
		}
	},
	restore : function() {
		if (this.maximized) {
			this.el.removeClass("x-window-maximized");
			this.tools.restore.hide();
			this.tools.maximize.show();
			this.setPosition(this.restorePos[0], this.restorePos[1]);
			this.setSize(this.restoreSize.width, this.restoreSize.height);
			delete this.restorePos;
			delete this.restoreSize;
			this.maximized = false;
			this.el.enableShadow(true);
			if (this.dd) {
				this.dd.unlock()
			}
			if (this.collapsible) {
				this.tools.toggle.show()
			}
			this.container.removeClass("x-window-maximized-ct");
			this.doConstrain();
			this.fireEvent("restore", this)
		}
	},
	toggleMaximize : function() {
		this[this.maximized ? "restore" : "maximize"]()
	},
	fitContainer : function() {
		var a = this.container.getViewSize();
		this.setSize(a.width, a.height)
	},
	setZIndex : function(a) {
		if (this.modal) {
			this.mask.setStyle("z-index", a)
		}
		this.el.setZIndex(++a);
		a += 5;
		if (this.resizer) {
			this.resizer.proxy.setStyle("z-index", ++a)
		}
		this.lastZIndex = a
	},
	alignTo : function(b, a, c) {
		var d = this.el.getAlignToXY(b, a, c);
		this.setPagePosition(d[0], d[1]);
		return this
	},
	anchorTo : function(c, e, d, b) {
		if (this.doAnchor) {
			Ext.EventManager.removeResizeListener(this.doAnchor, this);
			Ext.EventManager.un(window, "scroll", this.doAnchor, this)
		}
		this.doAnchor = function() {
			this.alignTo(c, e, d)
		};
		Ext.EventManager.onWindowResize(this.doAnchor, this);
		var a = typeof b;
		if (a != "undefined") {
			Ext.EventManager.on(window, "scroll", this.doAnchor, this, {
						buffer : a == "number" ? b : 50
					})
		}
		this.doAnchor();
		return this
	},
	toFront : function(a) {
		if (this.manager.bringToFront(this)) {
			if (!a || !a.getTarget().focus) {
				this.focus()
			}
		}
		return this
	},
	setActive : function(a) {
		if (a) {
			if (!this.maximized) {
				this.el.enableShadow(true)
			}
			this.fireEvent("activate", this)
		} else {
			this.el.disableShadow();
			this.fireEvent("deactivate", this)
		}
	},
	toBack : function() {
		this.manager.sendToBack(this);
		return this
	},
	center : function() {
		var a = this.el.getAlignToXY(this.container, "c-c");
		this.setPagePosition(a[0], a[1]);
		return this
	}
});
Ext.reg("window", Ext.Window);
Ext.Window.DD = function(a) {
	this.win = a;
	Ext.Window.DD.superclass.constructor
			.call(this, a.el.id, "WindowDD-" + a.id);
	this.setHandleElId(a.header.id);
	this.scroll = false
};
Ext.extend(Ext.Window.DD, Ext.dd.DD, {
			moveOnly : true,
			headerOffsets : [100, 25],
			startDrag : function() {
				var a = this.win;
				this.proxy = a.ghost();
				if (a.constrain !== false) {
					var c = a.el.shadowOffset;
					this.constrainTo(a.container, {
								right : c,
								left : c,
								bottom : c
							})
				} else {
					if (a.constrainHeader !== false) {
						var b = this.proxy.getSize();
						this.constrainTo(a.container, {
									right : -(b.width - this.headerOffsets[0]),
									bottom : -(b.height - this.headerOffsets[1])
								})
					}
				}
			},
			b4Drag : Ext.emptyFn,
			onDrag : function(a) {
				this.alignElWithMouse(this.proxy, a.getPageX(), a.getPageY())
			},
			endDrag : function(a) {
				this.win.unghost();
				this.win.saveState()
			}
		});