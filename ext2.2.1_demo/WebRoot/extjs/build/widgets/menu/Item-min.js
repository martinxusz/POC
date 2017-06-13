Ext.menu.Item = function(a) {
	Ext.menu.Item.superclass.constructor.call(this, a);
	if (this.menu) {
		this.menu = Ext.menu.MenuMgr.get(this.menu)
	}
};
Ext.extend(Ext.menu.Item, Ext.menu.BaseItem, {
			itemCls : "x-menu-item",
			canActivate : true,
			showDelay : 200,
			hideDelay : 200,
			ctype : "Ext.menu.Item",
			onRender : function(b, a) {
				var c = document.createElement("a");
				c.hideFocus = true;
				c.unselectable = "on";
				c.href = this.href || "#";
				if (this.hrefTarget) {
					c.target = this.hrefTarget
				}
				c.className = this.itemCls
						+ (this.menu ? " x-menu-item-arrow" : "")
						+ (this.cls ? " " + this.cls : "");
				c.innerHTML = String.format(
						'<img src="{0}" class="x-menu-item-icon {2}" />{1}',
						this.icon || Ext.BLANK_IMAGE_URL, this.itemText
								|| this.text, this.iconCls || "");
				this.el = c;
				Ext.menu.Item.superclass.onRender.call(this, b, a)
			},
			setText : function(a) {
				this.text = a;
				if (this.rendered) {
					this.el.update(String.format(
							'<img src="{0}" class="x-menu-item-icon {2}">{1}',
							this.icon || Ext.BLANK_IMAGE_URL, this.text,
							this.iconCls || ""));
					this.parentMenu.autoWidth()
				}
			},
			setIconClass : function(a) {
				var b = this.iconCls;
				this.iconCls = a;
				if (this.rendered) {
					this.el.child("img.x-menu-item-icon").replaceClass(b,
							this.iconCls)
				}
			},
			beforeDestroy : function() {
				if (this.menu) {
					this.menu.destroy()
				}
				Ext.menu.Item.superclass.beforeDestroy.call(this)
			},
			handleClick : function(a) {
				if (!this.href) {
					a.stopEvent()
				}
				Ext.menu.Item.superclass.handleClick.apply(this, arguments)
			},
			activate : function(a) {
				if (Ext.menu.Item.superclass.activate.apply(this, arguments)) {
					this.focus();
					if (a) {
						this.expandMenu()
					}
				}
				return true
			},
			shouldDeactivate : function(a) {
				if (Ext.menu.Item.superclass.shouldDeactivate.call(this, a)) {
					if (this.menu && this.menu.isVisible()) {
						return !this.menu.getEl().getRegion().contains(a
								.getPoint())
					}
					return true
				}
				return false
			},
			deactivate : function() {
				Ext.menu.Item.superclass.deactivate.apply(this, arguments);
				this.hideMenu()
			},
			expandMenu : function(a) {
				if (!this.disabled && this.menu) {
					clearTimeout(this.hideTimer);
					delete this.hideTimer;
					if (!this.menu.isVisible() && !this.showTimer) {
						this.showTimer = this.deferExpand.defer(this.showDelay,
								this, [a])
					} else {
						if (this.menu.isVisible() && a) {
							this.menu.tryActivate(0, 1)
						}
					}
				}
			},
			deferExpand : function(a) {
				delete this.showTimer;
				this.menu.show(this.container, this.parentMenu.subMenuAlign
								|| "tl-tr?", this.parentMenu);
				if (a) {
					this.menu.tryActivate(0, 1)
				}
			},
			hideMenu : function() {
				clearTimeout(this.showTimer);
				delete this.showTimer;
				if (!this.hideTimer && this.menu && this.menu.isVisible()) {
					this.hideTimer = this.deferHide.defer(this.hideDelay, this)
				}
			},
			deferHide : function() {
				delete this.hideTimer;
				if (this.menu.over) {
					this.parentMenu.setActiveItem(this, false)
				} else {
					this.menu.hide()
				}
			}
		});