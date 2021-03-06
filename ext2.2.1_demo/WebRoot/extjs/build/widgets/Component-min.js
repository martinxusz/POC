Ext.Component = function(b) {
	b = b || {};
	if (b.initialConfig) {
		if (b.isAction) {
			this.baseAction = b
		}
		b = b.initialConfig
	} else {
		if (b.tagName || b.dom || typeof b == "string") {
			b = {
				applyTo : b,
				id : b.id || b
			}
		}
	}
	this.initialConfig = b;
	Ext.apply(this, b);
	this.addEvents("disable", "enable", "beforeshow", "show", "beforehide",
			"hide", "beforerender", "render", "beforedestroy", "destroy",
			"beforestaterestore", "staterestore", "beforestatesave",
			"statesave");
	this.getId();
	Ext.ComponentMgr.register(this);
	Ext.Component.superclass.constructor.call(this);
	if (this.baseAction) {
		this.baseAction.addComponent(this)
	}
	this.initComponent();
	if (this.plugins) {
		if (Ext.isArray(this.plugins)) {
			for (var c = 0, a = this.plugins.length; c < a; c++) {
				this.plugins[c] = this.initPlugin(this.plugins[c])
			}
		} else {
			this.plugins = this.initPlugin(this.plugins)
		}
	}
	if (this.stateful !== false) {
		this.initState(b)
	}
	if (this.applyTo) {
		this.applyToMarkup(this.applyTo);
		delete this.applyTo
	} else {
		if (this.renderTo) {
			this.render(this.renderTo);
			delete this.renderTo
		}
	}
};
Ext.Component.AUTO_ID = 1000;
Ext.extend(Ext.Component, Ext.util.Observable, {
	disabledClass : "x-item-disabled",
	allowDomMove : true,
	autoShow : false,
	hideMode : "display",
	hideParent : false,
	hidden : false,
	disabled : false,
	rendered : false,
	ctype : "Ext.Component",
	actionMode : "el",
	getActionEl : function() {
		return this[this.actionMode]
	},
	initPlugin : function(a) {
		a.init(this);
		return a
	},
	initComponent : Ext.emptyFn,
	render : function(b, a) {
		if (!this.rendered && this.fireEvent("beforerender", this) !== false) {
			if (!b && this.el) {
				this.el = Ext.get(this.el);
				b = this.el.dom.parentNode;
				this.allowDomMove = false
			}
			this.container = Ext.get(b);
			if (this.ctCls) {
				this.container.addClass(this.ctCls)
			}
			this.rendered = true;
			if (a !== undefined) {
				if (typeof a == "number") {
					a = this.container.dom.childNodes[a]
				} else {
					a = Ext.getDom(a)
				}
			}
			this.onRender(this.container, a || null);
			if (this.autoShow) {
				this.el.removeClass(["x-hidden", "x-hide-" + this.hideMode])
			}
			if (this.cls) {
				this.el.addClass(this.cls);
				delete this.cls
			}
			if (this.style) {
				this.el.applyStyles(this.style);
				delete this.style
			}
			if (this.overCls) {
				this.el.addClassOnOver(this.overCls)
			}
			this.fireEvent("render", this);
			this.afterRender(this.container);
			if (this.hidden) {
				this.hide()
			}
			if (this.disabled) {
				this.disable()
			}
			if (this.stateful !== false) {
				this.initStateEvents()
			}
		}
		return this
	},
	initState : function(a) {
		if (Ext.state.Manager) {
			var c = this.getStateId();
			if (c) {
				var b = Ext.state.Manager.get(c);
				if (b) {
					if (this.fireEvent("beforestaterestore", this, b) !== false) {
						this.applyState(b);
						this.fireEvent("staterestore", this, b)
					}
				}
			}
		}
	},
	getStateId : function() {
		return this.stateId
				|| ((this.id.indexOf("ext-comp-") == 0 || this.id
						.indexOf("ext-gen") == 0) ? null : this.id)
	},
	initStateEvents : function() {
		if (this.stateEvents) {
			for (var a = 0, b; b = this.stateEvents[a]; a++) {
				this.on(b, this.saveState, this, {
							delay : 100
						})
			}
		}
	},
	applyState : function(b, a) {
		if (b) {
			Ext.apply(this, b)
		}
	},
	getState : function() {
		return null
	},
	saveState : function() {
		if (Ext.state.Manager) {
			var b = this.getStateId();
			if (b) {
				var a = this.getState();
				if (this.fireEvent("beforestatesave", this, a) !== false) {
					Ext.state.Manager.set(b, a);
					this.fireEvent("statesave", this, a)
				}
			}
		}
	},
	applyToMarkup : function(a) {
		this.allowDomMove = false;
		this.el = Ext.get(a);
		this.render(this.el.dom.parentNode)
	},
	addClass : function(a) {
		if (this.el) {
			this.el.addClass(a)
		} else {
			this.cls = this.cls ? this.cls + " " + a : a
		}
	},
	removeClass : function(a) {
		if (this.el) {
			this.el.removeClass(a)
		} else {
			if (this.cls) {
				this.cls = this.cls.split(" ").remove(a).join(" ")
			}
		}
	},
	onRender : function(b, a) {
		if (this.autoEl) {
			if (typeof this.autoEl == "string") {
				this.el = document.createElement(this.autoEl)
			} else {
				var c = document.createElement("div");
				Ext.DomHelper.overwrite(c, this.autoEl);
				this.el = c.firstChild
			}
			if (!this.el.id) {
				this.el.id = this.getId()
			}
		}
		if (this.el) {
			this.el = Ext.get(this.el);
			if (this.allowDomMove !== false) {
				b.dom.insertBefore(this.el.dom, a)
			}
		}
	},
	getAutoCreate : function() {
		var a = typeof this.autoCreate == "object" ? this.autoCreate : Ext
				.apply({}, this.defaultAutoCreate);
		if (this.id && !a.id) {
			a.id = this.id
		}
		return a
	},
	afterRender : Ext.emptyFn,
	destroy : function() {
		if (this.fireEvent("beforedestroy", this) !== false) {
			this.beforeDestroy();
			if (this.rendered) {
				this.el.removeAllListeners();
				this.el.remove();
				if (this.actionMode == "container") {
					this.container.remove()
				}
			}
			this.onDestroy();
			Ext.ComponentMgr.unregister(this);
			this.fireEvent("destroy", this);
			this.purgeListeners()
		}
	},
	beforeDestroy : Ext.emptyFn,
	onDestroy : Ext.emptyFn,
	getEl : function() {
		return this.el
	},
	getId : function() {
		return this.id || (this.id = "ext-comp-" + (++Ext.Component.AUTO_ID))
	},
	getItemId : function() {
		return this.itemId || this.getId()
	},
	focus : function(b, a) {
		if (a) {
			this.focus.defer(typeof a == "number" ? a : 10, this, [b, false]);
			return
		}
		if (this.rendered) {
			this.el.focus();
			if (b === true) {
				this.el.dom.select()
			}
		}
		return this
	},
	blur : function() {
		if (this.rendered) {
			this.el.blur()
		}
		return this
	},
	disable : function() {
		if (this.rendered) {
			this.onDisable()
		}
		this.disabled = true;
		this.fireEvent("disable", this);
		return this
	},
	onDisable : function() {
		this.getActionEl().addClass(this.disabledClass);
		this.el.dom.disabled = true
	},
	enable : function() {
		if (this.rendered) {
			this.onEnable()
		}
		this.disabled = false;
		this.fireEvent("enable", this);
		return this
	},
	onEnable : function() {
		this.getActionEl().removeClass(this.disabledClass);
		this.el.dom.disabled = false
	},
	setDisabled : function(a) {
		this[a ? "disable" : "enable"]()
	},
	show : function() {
		if (this.fireEvent("beforeshow", this) !== false) {
			this.hidden = false;
			if (this.autoRender) {
				this.render(typeof this.autoRender == "boolean"
						? Ext.getBody()
						: this.autoRender)
			}
			if (this.rendered) {
				this.onShow()
			}
			this.fireEvent("show", this)
		}
		return this
	},
	onShow : function() {
		if (this.hideParent) {
			this.container.removeClass("x-hide-" + this.hideMode)
		} else {
			this.getActionEl().removeClass("x-hide-" + this.hideMode)
		}
	},
	hide : function() {
		if (this.fireEvent("beforehide", this) !== false) {
			this.hidden = true;
			if (this.rendered) {
				this.onHide()
			}
			this.fireEvent("hide", this)
		}
		return this
	},
	onHide : function() {
		if (this.hideParent) {
			this.container.addClass("x-hide-" + this.hideMode)
		} else {
			this.getActionEl().addClass("x-hide-" + this.hideMode)
		}
	},
	setVisible : function(a) {
		if (a) {
			this.show()
		} else {
			this.hide()
		}
		return this
	},
	isVisible : function() {
		return this.rendered && this.getActionEl().isVisible()
	},
	cloneConfig : function(b) {
		b = b || {};
		var c = b.id || Ext.id();
		var a = Ext.applyIf(b, this.initialConfig);
		a.id = c;
		return new this.constructor(a)
	},
	getXType : function() {
		return this.constructor.xtype
	},
	isXType : function(b, a) {
		if (typeof b == "function") {
			b = b.xtype
		} else {
			if (typeof b == "object") {
				b = b.constructor.xtype
			}
		}
		return !a
				? ("/" + this.getXTypes() + "/").indexOf("/" + b + "/") != -1
				: this.constructor.xtype == b
	},
	getXTypes : function() {
		var a = this.constructor;
		if (!a.xtypes) {
			var d = [], b = this;
			while (b && b.constructor.xtype) {
				d.unshift(b.constructor.xtype);
				b = b.constructor.superclass
			}
			a.xtypeChain = d;
			a.xtypes = d.join("/")
		}
		return a.xtypes
	},
	findParentBy : function(a) {
		for (var b = this.ownerCt; (b != null) && !a(b, this); b = b.ownerCt) {
		}
		return b || null
	},
	findParentByType : function(a) {
		return typeof a == "function" ? this.findParentBy(function(b) {
					return b.constructor === a
				}) : this.findParentBy(function(b) {
					return b.constructor.xtype === a
				})
	},
	mon : function(e, b, d, c, a) {
		if (!this.mons) {
			this.mons = [];
			this.on("beforedestroy", function() {
						for (var h = 0, g = this.mons.length; h < g; h++) {
							var f = this.mons[h];
							f.item.un(f.ename, f.fn, f.scope)
						}
					}, this)
		}
		this.mons.push({
					item : e,
					ename : b,
					fn : d,
					scope : c
				});
		e.on(b, d, c, a)
	}
});
Ext.reg("component", Ext.Component);