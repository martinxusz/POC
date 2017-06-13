Ext.SplitButton = Ext.extend(Ext.Button, {
	arrowSelector : "button:last",
	initComponent : function() {
		Ext.SplitButton.superclass.initComponent.call(this);
		this.addEvents("arrowclick")
	},
	onRender : function(d, a) {
		var b = new Ext.Template(
				'<table cellspacing="0" class="x-btn-menu-wrap x-btn"><tr><td>',
				'<table cellspacing="0" class="x-btn-wrap x-btn-menu-text-wrap"><tbody>',
				'<tr><td class="x-btn-left"><i>&#160;</i></td><td class="x-btn-center"><button class="x-btn-text" type="{1}">{0}</button></td></tr>',
				"</tbody></table></td><td>",
				'<table cellspacing="0" class="x-btn-wrap x-btn-menu-arrow-wrap"><tbody>',
				'<tr><td class="x-btn-center"><button class="x-btn-menu-arrow-el" type="button">&#160;</button></td><td class="x-btn-right"><i>&#160;</i></td></tr>',
				"</tbody></table></td></tr></table>");
		var c, f = [this.text || "&#160;", this.type];
		if (a) {
			c = b.insertBefore(a, f, true)
		} else {
			c = b.append(d, f, true)
		}
		var e = c.child(this.buttonSelector);
		this.initButtonEl(c, e);
		this.arrowBtnTable = c.child("table:last");
		if (this.arrowTooltip) {
			c.child(this.arrowSelector).dom[this.tooltipType] = this.arrowTooltip
		}
	},
	autoWidth : function() {
		if (this.el) {
			var c = this.el.child("table:first");
			var b = this.el.child("table:last");
			this.el.setWidth("auto");
			c.setWidth("auto");
			if (Ext.isIE7 && Ext.isStrict) {
				var a = this.el.child(this.buttonSelector);
				if (a && a.getWidth() > 20) {
					a.clip();
					a.setWidth(Ext.util.TextMetrics.measure(a, this.text).width
							+ a.getFrameWidth("lr"))
				}
			}
			if (this.minWidth) {
				if ((c.getWidth() + b.getWidth()) < this.minWidth) {
					c.setWidth(this.minWidth - b.getWidth())
				}
			}
			this.el.setWidth(c.getWidth() + b.getWidth())
		}
	},
	setArrowHandler : function(b, a) {
		this.arrowHandler = b;
		this.scope = a
	},
	onClick : function(a) {
		a.preventDefault();
		if (!this.disabled) {
			if (a.getTarget(".x-btn-menu-arrow-wrap")) {
				if (this.menu && !this.menu.isVisible()
						&& !this.ignoreNextClick) {
					this.showMenu()
				}
				this.fireEvent("arrowclick", this, a);
				if (this.arrowHandler) {
					this.arrowHandler.call(this.scope || this, this, a)
				}
			} else {
				if (this.enableToggle) {
					this.toggle()
				}
				this.fireEvent("click", this, a);
				if (this.handler) {
					this.handler.call(this.scope || this, this, a)
				}
			}
		}
	},
	getClickEl : function(b, a) {
		if (!a) {
			return (this.lastClickEl = b.getTarget("table", 10, true))
		}
		return this.lastClickEl
	},
	onDisable : function() {
		if (this.el) {
			if (!Ext.isIE6) {
				this.el.addClass("x-item-disabled")
			}
			this.el.child(this.buttonSelector).dom.disabled = true;
			this.el.child(this.arrowSelector).dom.disabled = true
		}
		this.disabled = true
	},
	onEnable : function() {
		if (this.el) {
			if (!Ext.isIE6) {
				this.el.removeClass("x-item-disabled")
			}
			this.el.child(this.buttonSelector).dom.disabled = false;
			this.el.child(this.arrowSelector).dom.disabled = false
		}
		this.disabled = false
	},
	isMenuTriggerOver : function(a) {
		return this.menu && a.within(this.arrowBtnTable)
				&& !a.within(this.arrowBtnTable, true)
	},
	isMenuTriggerOut : function(b, a) {
		return this.menu && !b.within(this.arrowBtnTable)
	},
	onDestroy : function() {
		Ext.destroy(this.arrowBtnTable);
		Ext.SplitButton.superclass.onDestroy.call(this)
	}
});
Ext.MenuButton = Ext.SplitButton;
Ext.reg("splitbutton", Ext.SplitButton);