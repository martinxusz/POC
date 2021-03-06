Ext.Button = Ext.extend(Ext.Component, {
	hidden : false,
	disabled : false,
	pressed : false,
	enableToggle : false,
	menuAlign : "tl-bl?",
	type : "button",
	menuClassTarget : "tr",
	clickEvent : "click",
	handleMouseEvents : true,
	tooltipType : "qtip",
	buttonSelector : "button:first-child",
	initComponent : function() {
		Ext.Button.superclass.initComponent.call(this);
		this.addEvents("click", "toggle", "mouseover", "mouseout", "menushow",
				"menuhide", "menutriggerover", "menutriggerout");
		if (this.menu) {
			this.menu = Ext.menu.MenuMgr.get(this.menu)
		}
		if (typeof this.toggleGroup === "string") {
			this.enableToggle = true
		}
	},
	onRender : function(c, a) {
		if (!this.template) {
			if (!Ext.Button.buttonTemplate) {
				Ext.Button.buttonTemplate = new Ext.Template(
						'<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr>',
						'<td class="x-btn-left"><i>&#160;</i></td><td class="x-btn-center"><em unselectable="on"><button class="x-btn-text" type="{1}">{0}</button></em></td><td class="x-btn-right"><i>&#160;</i></td>',
						"</tr></tbody></table>")
			}
			this.template = Ext.Button.buttonTemplate
		}
		var b, e = [this.text || "&#160;", this.type];
		if (a) {
			b = this.template.insertBefore(a, e, true)
		} else {
			b = this.template.append(c, e, true)
		}
		var d = b.child(this.buttonSelector);
		d.on("focus", this.onFocus, this);
		d.on("blur", this.onBlur, this);
		this.initButtonEl(b, d);
		if (this.menu) {
			this.el.child(this.menuClassTarget).addClass("x-btn-with-menu")
		}
		Ext.ButtonToggleMgr.register(this)
	},
	initButtonEl : function(b, c) {
		this.el = b;
		b.addClass("x-btn");
		if (this.id) {
			this.el.dom.id = this.el.id = this.id
		}
		if (this.icon) {
			c.setStyle("background-image", "url(" + this.icon + ")")
		}
		if (this.iconCls) {
			c.addClass(this.iconCls);
			if (!this.cls) {
				b.addClass(this.text ? "x-btn-text-icon" : "x-btn-icon")
			}
		}
		if (this.tabIndex !== undefined) {
			c.dom.tabIndex = this.tabIndex
		}
		if (this.tooltip) {
			if (typeof this.tooltip == "object") {
				Ext.QuickTips.register(Ext.apply({
							target : c.id
						}, this.tooltip))
			} else {
				c.dom[this.tooltipType] = this.tooltip
			}
		}
		if (this.pressed) {
			this.el.addClass("x-btn-pressed")
		}
		if (this.handleMouseEvents) {
			b.on("mouseover", this.onMouseOver, this);
			b.on("mousedown", this.onMouseDown, this)
		}
		if (this.menu) {
			this.menu.on("show", this.onMenuShow, this);
			this.menu.on("hide", this.onMenuHide, this)
		}
		if (this.repeat) {
			var a = new Ext.util.ClickRepeater(b,
					typeof this.repeat == "object" ? this.repeat : {});
			a.on("click", this.onClick, this)
		}
		b.on(this.clickEvent, this.onClick, this)
	},
	afterRender : function() {
		Ext.Button.superclass.afterRender.call(this);
		if (Ext.isIE6) {
			this.autoWidth.defer(1, this)
		} else {
			this.autoWidth()
		}
	},
	setIconClass : function(a) {
		if (this.el) {
			this.el.child(this.buttonSelector).replaceClass(this.iconCls, a)
		}
		this.iconCls = a
	},
	beforeDestroy : function() {
		if (this.rendered) {
			var a = this.el.child(this.buttonSelector);
			if (a) {
				if (this.tooltip) {
					Ext.QuickTips.unregister(a)
				}
				a.removeAllListeners()
			}
		}
		if (this.menu) {
			Ext.destroy(this.menu)
		}
	},
	onDestroy : function() {
		if (this.rendered) {
			Ext.ButtonToggleMgr.unregister(this)
		}
	},
	autoWidth : function() {
		if (this.el) {
			this.el.setWidth("auto");
			if (Ext.isIE7 && Ext.isStrict) {
				var a = this.el.child(this.buttonSelector);
				if (a && a.getWidth() > 20) {
					a.clip();
					a.setWidth(Ext.util.TextMetrics.measure(a, this.text).width
							+ a.getFrameWidth("lr"))
				}
			}
			if (this.minWidth) {
				if (this.el.getWidth() < this.minWidth) {
					this.el.setWidth(this.minWidth)
				}
			}
		}
	},
	setHandler : function(b, a) {
		this.handler = b;
		this.scope = a
	},
	setText : function(a) {
		this.text = a;
		if (this.el) {
			this.el.child("td.x-btn-center " + this.buttonSelector).update(a)
		}
		this.autoWidth()
	},
	getText : function() {
		return this.text
	},
	toggle : function(a) {
		a = a === undefined ? !this.pressed : a;
		if (a != this.pressed) {
			if (a) {
				this.el.addClass("x-btn-pressed");
				this.pressed = true;
				this.fireEvent("toggle", this, true)
			} else {
				this.el.removeClass("x-btn-pressed");
				this.pressed = false;
				this.fireEvent("toggle", this, false)
			}
			if (this.toggleHandler) {
				this.toggleHandler.call(this.scope || this, this, a)
			}
		}
	},
	focus : function() {
		this.el.child(this.buttonSelector).focus()
	},
	onDisable : function() {
		if (this.el) {
			if (!Ext.isIE6 || !this.text) {
				this.el.addClass(this.disabledClass)
			}
			this.el.dom.disabled = true
		}
		this.disabled = true
	},
	onEnable : function() {
		if (this.el) {
			if (!Ext.isIE6 || !this.text) {
				this.el.removeClass(this.disabledClass)
			}
			this.el.dom.disabled = false
		}
		this.disabled = false
	},
	showMenu : function() {
		if (this.menu) {
			this.menu.show(this.el, this.menuAlign)
		}
		return this
	},
	hideMenu : function() {
		if (this.menu) {
			this.menu.hide()
		}
		return this
	},
	hasVisibleMenu : function() {
		return this.menu && this.menu.isVisible()
	},
	onClick : function(a) {
		if (a) {
			a.preventDefault()
		}
		if (a.button != 0) {
			return
		}
		if (!this.disabled) {
			if (this.enableToggle
					&& (this.allowDepress !== false || !this.pressed)) {
				this.toggle()
			}
			if (this.menu && !this.menu.isVisible() && !this.ignoreNextClick) {
				this.showMenu()
			}
			this.fireEvent("click", this, a);
			if (this.handler) {
				this.handler.call(this.scope || this, this, a)
			}
		}
	},
	isMenuTriggerOver : function(b, a) {
		return this.menu && !a
	},
	isMenuTriggerOut : function(b, a) {
		return this.menu && !a
	},
	onMouseOver : function(b) {
		if (!this.disabled) {
			var a = b.within(this.el, true);
			if (!a) {
				this.el.addClass("x-btn-over");
				if (!this.monitoringMouseOver) {
					Ext.getDoc().on("mouseover", this.monitorMouseOver, this);
					this.monitoringMouseOver = true
				}
				this.fireEvent("mouseover", this, b)
			}
			if (this.isMenuTriggerOver(b, a)) {
				this.fireEvent("menutriggerover", this, this.menu, b)
			}
		}
	},
	monitorMouseOver : function(a) {
		if (a.target != this.el.dom && !a.within(this.el)) {
			if (this.monitoringMouseOver) {
				Ext.getDoc().un("mouseover", this.monitorMouseOver, this);
				this.monitoringMouseOver = false
			}
			this.onMouseOut(a)
		}
	},
	onMouseOut : function(b) {
		var a = b.within(this.el) && b.target != this.el.dom;
		this.el.removeClass("x-btn-over");
		this.fireEvent("mouseout", this, b);
		if (this.isMenuTriggerOut(b, a)) {
			this.fireEvent("menutriggerout", this, this.menu, b)
		}
	},
	onFocus : function(a) {
		if (!this.disabled) {
			this.el.addClass("x-btn-focus")
		}
	},
	onBlur : function(a) {
		this.el.removeClass("x-btn-focus")
	},
	getClickEl : function(b, a) {
		return this.el
	},
	onMouseDown : function(a) {
		if (!this.disabled && a.button == 0) {
			this.getClickEl(a).addClass("x-btn-click");
			Ext.getDoc().on("mouseup", this.onMouseUp, this)
		}
	},
	onMouseUp : function(a) {
		if (a.button == 0) {
			this.getClickEl(a, true).removeClass("x-btn-click");
			Ext.getDoc().un("mouseup", this.onMouseUp, this)
		}
	},
	onMenuShow : function(a) {
		this.ignoreNextClick = 0;
		this.el.addClass("x-btn-menu-active");
		this.fireEvent("menushow", this, this.menu)
	},
	onMenuHide : function(a) {
		this.el.removeClass("x-btn-menu-active");
		this.ignoreNextClick = this.restoreClick.defer(250, this);
		this.fireEvent("menuhide", this, this.menu)
	},
	restoreClick : function() {
		this.ignoreNextClick = 0
	}
});
Ext.reg("button", Ext.Button);
Ext.ButtonToggleMgr = function() {
	var a = {};
	function b(e, h) {
		if (h) {
			var f = a[e.toggleGroup];
			for (var d = 0, c = f.length; d < c; d++) {
				if (f[d] != e) {
					f[d].toggle(false)
				}
			}
		}
	}
	return {
		register : function(c) {
			if (!c.toggleGroup) {
				return
			}
			var d = a[c.toggleGroup];
			if (!d) {
				d = a[c.toggleGroup] = []
			}
			d.push(c);
			c.on("toggle", b)
		},
		unregister : function(c) {
			if (!c.toggleGroup) {
				return
			}
			var d = a[c.toggleGroup];
			if (d) {
				d.remove(c);
				c.un("toggle", b)
			}
		}
	}
}();