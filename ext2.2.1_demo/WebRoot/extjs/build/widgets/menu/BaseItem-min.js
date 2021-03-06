Ext.menu.BaseItem = function(a) {
	Ext.menu.BaseItem.superclass.constructor.call(this, a);
	this.addEvents("click", "activate", "deactivate");
	if (this.handler) {
		this.on("click", this.handler, this.scope)
	}
};
Ext.extend(Ext.menu.BaseItem, Ext.Component, {
			canActivate : false,
			activeClass : "x-menu-item-active",
			hideOnClick : true,
			hideDelay : 100,
			ctype : "Ext.menu.BaseItem",
			actionMode : "container",
			render : function(a, b) {
				this.parentMenu = b;
				Ext.menu.BaseItem.superclass.render.call(this, a);
				this.container.menuItemId = this.id
			},
			onRender : function(b, a) {
				this.el = Ext.get(this.el);
				if (this.id) {
					this.el.id = this.id
				}
				b.dom.appendChild(this.el.dom)
			},
			setHandler : function(b, a) {
				if (this.handler) {
					this.un("click", this.handler, this.scope)
				}
				this.on("click", this.handler = b, this.scope = a)
			},
			onClick : function(a) {
				if (!this.disabled
						&& this.fireEvent("click", this, a) !== false
						&& this.parentMenu.fireEvent("itemclick", this, a) !== false) {
					this.handleClick(a)
				} else {
					a.stopEvent()
				}
			},
			activate : function() {
				if (this.disabled) {
					return false
				}
				var a = this.container;
				a.addClass(this.activeClass);
				this.region = a.getRegion().adjust(2, 2, -2, -2);
				this.fireEvent("activate", this);
				return true
			},
			deactivate : function() {
				this.container.removeClass(this.activeClass);
				this.fireEvent("deactivate", this)
			},
			shouldDeactivate : function(a) {
				return !this.region || !this.region.contains(a.getPoint())
			},
			handleClick : function(a) {
				if (this.hideOnClick) {
					this.parentMenu.hide.defer(this.hideDelay, this.parentMenu,
							[true])
				}
			},
			expandMenu : function(a) {
			},
			hideMenu : function() {
			}
		});