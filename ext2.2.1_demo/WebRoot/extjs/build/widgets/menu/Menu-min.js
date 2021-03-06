Ext.menu.Menu = function(a) {
	if (Ext.isArray(a)) {
		a = {
			items : a
		}
	}
	Ext.apply(this, a);
	this.id = this.id || Ext.id();
	this.addEvents("beforeshow", "beforehide", "show", "hide", "click",
			"mouseover", "mouseout", "itemclick");
	Ext.menu.MenuMgr.register(this);
	Ext.menu.Menu.superclass.constructor.call(this);
	var b = this.items;
	this.items = new Ext.util.MixedCollection();
	if (b) {
		this.add.apply(this, b)
	}
};
Ext.extend(Ext.menu.Menu, Ext.util.Observable, {
			minWidth : 120,
			shadow : "sides",
			subMenuAlign : "tl-tr?",
			defaultAlign : "tl-bl?",
			allowOtherMenus : false,
			ignoreParentClicks : false,
			hidden : true,
			createEl : function() {
				return new Ext.Layer({
							cls : "x-menu",
							shadow : this.shadow,
							constrain : false,
							parentEl : this.parentEl || document.body,
							zindex : 15000
						})
			},
			render : function() {
				if (this.el) {
					return
				}
				var b = this.el = this.createEl();
				if (!this.keyNav) {
					this.keyNav = new Ext.menu.MenuNav(this)
				}
				if (this.plain) {
					b.addClass("x-menu-plain")
				}
				if (this.cls) {
					b.addClass(this.cls)
				}
				this.focusEl = b.createChild({
							tag : "a",
							cls : "x-menu-focus",
							href : "#",
							onclick : "return false;",
							tabIndex : "-1"
						});
				var a = b.createChild({
							tag : "ul",
							cls : "x-menu-list"
						});
				a.on("click", this.onClick, this);
				a.on("mouseover", this.onMouseOver, this);
				a.on("mouseout", this.onMouseOut, this);
				this.items.each(function(d) {
							var c = document.createElement("li");
							c.className = "x-menu-list-item";
							a.dom.appendChild(c);
							d.render(c, this)
						}, this);
				this.ul = a;
				this.autoWidth()
			},
			autoWidth : function() {
				var d = this.el, c = this.ul;
				if (!d) {
					return
				}
				var a = this.width;
				if (a) {
					d.setWidth(a)
				} else {
					if (Ext.isIE) {
						d.setWidth(this.minWidth);
						var b = d.dom.offsetWidth;
						d.setWidth(c.getWidth() + d.getFrameWidth("lr"))
					}
				}
			},
			delayAutoWidth : function() {
				if (this.el) {
					if (!this.awTask) {
						this.awTask = new Ext.util.DelayedTask(this.autoWidth,
								this)
					}
					this.awTask.delay(20)
				}
			},
			findTargetItem : function(b) {
				var a = b.getTarget(".x-menu-list-item", this.ul, true);
				if (a && a.menuItemId) {
					return this.items.get(a.menuItemId)
				}
			},
			onClick : function(b) {
				var a;
				if (a = this.findTargetItem(b)) {
					if (a.menu && this.ignoreParentClicks) {
						a.expandMenu()
					} else {
						a.onClick(b);
						this.fireEvent("click", this, a, b)
					}
				}
			},
			setActiveItem : function(a, b) {
				if (a != this.activeItem) {
					if (this.activeItem) {
						this.activeItem.deactivate()
					}
					this.activeItem = a;
					a.activate(b)
				} else {
					if (b) {
						a.expandMenu()
					}
				}
			},
			tryActivate : function(f, e) {
				var b = this.items;
				for (var c = f, a = b.length; c >= 0 && c < a; c += e) {
					var d = b.get(c);
					if (!d.disabled && d.canActivate) {
						this.setActiveItem(d, false);
						return d
					}
				}
				return false
			},
			onMouseOver : function(b) {
				var a;
				if (a = this.findTargetItem(b)) {
					if (a.canActivate && !a.disabled) {
						this.setActiveItem(a, true)
					}
				}
				this.over = true;
				this.fireEvent("mouseover", this, b, a)
			},
			onMouseOut : function(b) {
				var a;
				if (a = this.findTargetItem(b)) {
					if (a == this.activeItem && a.shouldDeactivate(b)) {
						this.activeItem.deactivate();
						delete this.activeItem
					}
				}
				this.over = false;
				this.fireEvent("mouseout", this, b, a)
			},
			isVisible : function() {
				return this.el && !this.hidden
			},
			show : function(b, c, a) {
				this.parentMenu = a;
				if (!this.el) {
					this.render()
				}
				this.fireEvent("beforeshow", this);
				this.showAt(this.el.getAlignToXY(b, c || this.defaultAlign), a,
						false)
			},
			showAt : function(c, b, a) {
				this.parentMenu = b;
				if (!this.el) {
					this.render()
				}
				if (a !== false) {
					this.fireEvent("beforeshow", this);
					c = this.el.adjustForConstraints(c)
				}
				this.el.setXY(c);
				this.el.show();
				this.hidden = false;
				this.focus();
				this.fireEvent("show", this)
			},
			focus : function() {
				if (!this.hidden) {
					this.doFocus.defer(50, this)
				}
			},
			doFocus : function() {
				if (!this.hidden) {
					this.focusEl.focus()
				}
			},
			hide : function(a) {
				if (this.el && this.isVisible()) {
					this.fireEvent("beforehide", this);
					if (this.activeItem) {
						this.activeItem.deactivate();
						this.activeItem = null
					}
					this.el.hide();
					this.hidden = true;
					this.fireEvent("hide", this)
				}
				if (a === true && this.parentMenu) {
					this.parentMenu.hide(true)
				}
			},
			add : function() {
				var c = arguments, b = c.length, f;
				for (var d = 0; d < b; d++) {
					var e = c[d];
					if (e.render) {
						f = this.addItem(e)
					} else {
						if (typeof e == "string") {
							if (e == "separator" || e == "-") {
								f = this.addSeparator()
							} else {
								f = this.addText(e)
							}
						} else {
							if (e.tagName || e.el) {
								f = this.addElement(e)
							} else {
								if (typeof e == "object") {
									Ext.applyIf(e, this.defaults);
									f = this.addMenuItem(e)
								}
							}
						}
					}
				}
				return f
			},
			getEl : function() {
				if (!this.el) {
					this.render()
				}
				return this.el
			},
			addSeparator : function() {
				return this.addItem(new Ext.menu.Separator())
			},
			addElement : function(a) {
				return this.addItem(new Ext.menu.BaseItem(a))
			},
			addItem : function(b) {
				this.items.add(b);
				if (this.ul) {
					var a = document.createElement("li");
					a.className = "x-menu-list-item";
					this.ul.dom.appendChild(a);
					b.render(a, this);
					this.delayAutoWidth()
				}
				return b
			},
			addMenuItem : function(a) {
				if (!(a instanceof Ext.menu.Item)) {
					if (typeof a.checked == "boolean") {
						a = new Ext.menu.CheckItem(a)
					} else {
						a = new Ext.menu.Item(a)
					}
				}
				return this.addItem(a)
			},
			addText : function(a) {
				return this.addItem(new Ext.menu.TextItem(a))
			},
			insert : function(b, c) {
				this.items.insert(b, c);
				if (this.ul) {
					var a = document.createElement("li");
					a.className = "x-menu-list-item";
					this.ul.dom.insertBefore(a, this.ul.dom.childNodes[b]);
					c.render(a, this);
					this.delayAutoWidth()
				}
				return c
			},
			remove : function(a) {
				this.items.removeKey(a.id);
				a.destroy()
			},
			removeAll : function() {
				if (this.items) {
					var a;
					while (a = this.items.first()) {
						this.remove(a)
					}
				}
			},
			destroy : function() {
				this.beforeDestroy();
				Ext.menu.MenuMgr.unregister(this);
				if (this.keyNav) {
					this.keyNav.disable()
				}
				this.removeAll();
				if (this.ul) {
					this.ul.removeAllListeners()
				}
				if (this.el) {
					this.el.destroy()
				}
			},
			beforeDestroy : Ext.emptyFn
		});
Ext.menu.MenuNav = function(a) {
	Ext.menu.MenuNav.superclass.constructor.call(this, a.el);
	this.scope = this.menu = a
};
Ext.extend(Ext.menu.MenuNav, Ext.KeyNav, {
			doRelay : function(c, b) {
				var a = c.getKey();
				if (!this.menu.activeItem && c.isNavKeyPress() && a != c.SPACE
						&& a != c.RETURN) {
					this.menu.tryActivate(0, 1);
					return false
				}
				return b.call(this.scope || this, c, this.menu)
			},
			up : function(b, a) {
				if (!a.tryActivate(a.items.indexOf(a.activeItem) - 1, -1)) {
					a.tryActivate(a.items.length - 1, -1)
				}
			},
			down : function(b, a) {
				if (!a.tryActivate(a.items.indexOf(a.activeItem) + 1, 1)) {
					a.tryActivate(0, 1)
				}
			},
			right : function(b, a) {
				if (a.activeItem) {
					a.activeItem.expandMenu(true)
				}
			},
			left : function(b, a) {
				a.hide();
				if (a.parentMenu && a.parentMenu.activeItem) {
					a.parentMenu.activeItem.activate()
				}
			},
			enter : function(b, a) {
				if (a.activeItem) {
					b.stopPropagation();
					a.activeItem.onClick(b);
					a.fireEvent("click", this, a.activeItem);
					return true
				}
			}
		});