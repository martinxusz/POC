Ext.Toolbar = function(a) {
	if (Ext.isArray(a)) {
		a = {
			buttons : a
		}
	}
	Ext.Toolbar.superclass.constructor.call(this, a)
};
(function() {
	var a = Ext.Toolbar;
	Ext.extend(a, Ext.BoxComponent, {
				trackMenus : true,
				initComponent : function() {
					a.superclass.initComponent.call(this);
					if (this.items) {
						this.buttons = this.items
					}
					this.items = new Ext.util.MixedCollection(false,
							function(b) {
								return b.itemId || b.id || Ext.id()
							})
				},
				autoCreate : {
					cls : "x-toolbar x-small-editor",
					html : '<table cellspacing="0"><tr></tr></table>'
				},
				onRender : function(c, b) {
					this.el = c.createChild(Ext.apply({
										id : this.id
									}, this.autoCreate), b);
					this.tr = this.el.child("tr", true)
				},
				afterRender : function() {
					a.superclass.afterRender.call(this);
					if (this.buttons) {
						this.add.apply(this, this.buttons);
						delete this.buttons
					}
				},
				add : function() {
					var c = arguments, b = c.length;
					for (var d = 0; d < b; d++) {
						var e = c[d];
						if (e.isFormField) {
							this.addField(e)
						} else {
							if (e.render) {
								this.addItem(e)
							} else {
								if (typeof e == "string") {
									if (e == "separator" || e == "-") {
										this.addSeparator()
									} else {
										if (e == " ") {
											this.addSpacer()
										} else {
											if (e == "->") {
												this.addFill()
											} else {
												this.addText(e)
											}
										}
									}
								} else {
									if (e.tagName) {
										this.addElement(e)
									} else {
										if (typeof e == "object") {
											if (e.xtype) {
												this.addField(Ext.ComponentMgr
														.create(e, "button"))
											} else {
												this.addButton(e)
											}
										}
									}
								}
							}
						}
					}
				},
				addSeparator : function() {
					return this.addItem(new a.Separator())
				},
				addSpacer : function() {
					return this.addItem(new a.Spacer())
				},
				addFill : function() {
					return this.addItem(new a.Fill())
				},
				addElement : function(b) {
					return this.addItem(new a.Item(b))
				},
				addItem : function(b) {
					var c = this.nextBlock();
					this.initMenuTracking(b);
					b.render(c);
					this.items.add(b);
					return b
				},
				addButton : function(e) {
					if (Ext.isArray(e)) {
						var g = [];
						for (var f = 0, d = e.length; f < d; f++) {
							g.push(this.addButton(e[f]))
						}
						return g
					}
					var c = e;
					if (!(e instanceof a.Button)) {
						c = e.split ? new a.SplitButton(e) : new a.Button(e)
					}
					var h = this.nextBlock();
					this.initMenuTracking(c);
					c.render(h);
					this.items.add(c);
					return c
				},
				initMenuTracking : function(b) {
					if (this.trackMenus && b.menu) {
						b.on({
									menutriggerover : this.onButtonTriggerOver,
									menushow : this.onButtonMenuShow,
									menuhide : this.onButtonMenuHide,
									scope : this
								})
					}
				},
				addText : function(b) {
					return this.addItem(new a.TextItem(b))
				},
				insertButton : function(c, f) {
					if (Ext.isArray(f)) {
						var e = [];
						for (var d = 0, b = f.length; d < b; d++) {
							e.push(this.insertButton(c + d, f[d]))
						}
						return e
					}
					if (!(f instanceof a.Button)) {
						f = new a.Button(f)
					}
					var g = document.createElement("td");
					this.tr.insertBefore(g, this.tr.childNodes[c]);
					this.initMenuTracking(f);
					f.render(g);
					this.items.insert(c, f);
					return f
				},
				addDom : function(c, b) {
					var e = this.nextBlock();
					Ext.DomHelper.overwrite(e, c);
					var d = new a.Item(e.firstChild);
					d.render(e);
					this.items.add(d);
					return d
				},
				addField : function(c) {
					var d = this.nextBlock();
					c.render(d);
					var b = new a.Item(d.firstChild);
					b.render(d);
					this.items.add(c);
					return b
				},
				nextBlock : function() {
					var b = document.createElement("td");
					this.tr.appendChild(b);
					return b
				},
				onDestroy : function() {
					Ext.Toolbar.superclass.onDestroy.call(this);
					if (this.rendered) {
						if (this.items) {
							Ext.destroy.apply(Ext, this.items.items)
						}
						Ext.Element.uncache(this.tr)
					}
				},
				onDisable : function() {
					this.items.each(function(b) {
								if (b.disable) {
									b.disable()
								}
							})
				},
				onEnable : function() {
					this.items.each(function(b) {
								if (b.enable) {
									b.enable()
								}
							})
				},
				onButtonTriggerOver : function(b) {
					if (this.activeMenuBtn && this.activeMenuBtn != b) {
						this.activeMenuBtn.hideMenu();
						b.showMenu();
						this.activeMenuBtn = b
					}
				},
				onButtonMenuShow : function(b) {
					this.activeMenuBtn = b
				},
				onButtonMenuHide : function(b) {
					delete this.activeMenuBtn
				}
			});
	Ext.reg("toolbar", Ext.Toolbar);
	a.Item = function(b) {
		this.el = Ext.getDom(b);
		this.id = Ext.id(this.el);
		this.hidden = false
	};
	a.Item.prototype = {
		getEl : function() {
			return this.el
		},
		render : function(b) {
			this.td = b;
			b.appendChild(this.el)
		},
		destroy : function() {
			if (this.el) {
				var b = Ext.get(this.el);
				Ext.destroy(b)
			}
			Ext.removeNode(this.td)
		},
		show : function() {
			this.hidden = false;
			this.td.style.display = ""
		},
		hide : function() {
			this.hidden = true;
			this.td.style.display = "none"
		},
		setVisible : function(b) {
			if (b) {
				this.show()
			} else {
				this.hide()
			}
		},
		focus : function() {
			Ext.fly(this.el).focus()
		},
		disable : function() {
			Ext.fly(this.td).addClass("x-item-disabled");
			this.disabled = true;
			this.el.disabled = true
		},
		enable : function() {
			Ext.fly(this.td).removeClass("x-item-disabled");
			this.disabled = false;
			this.el.disabled = false
		}
	};
	Ext.reg("tbitem", a.Item);
	a.Separator = function() {
		var b = document.createElement("span");
		b.className = "ytb-sep";
		a.Separator.superclass.constructor.call(this, b)
	};
	Ext.extend(a.Separator, a.Item, {
				enable : Ext.emptyFn,
				disable : Ext.emptyFn,
				focus : Ext.emptyFn
			});
	Ext.reg("tbseparator", a.Separator);
	a.Spacer = function() {
		var b = document.createElement("div");
		b.className = "ytb-spacer";
		a.Spacer.superclass.constructor.call(this, b)
	};
	Ext.extend(a.Spacer, a.Item, {
				enable : Ext.emptyFn,
				disable : Ext.emptyFn,
				focus : Ext.emptyFn
			});
	Ext.reg("tbspacer", a.Spacer);
	a.Fill = Ext.extend(a.Spacer, {
				render : function(b) {
					b.style.width = "100%";
					a.Fill.superclass.render.call(this, b)
				}
			});
	Ext.reg("tbfill", a.Fill);
	a.TextItem = function(b) {
		var c = document.createElement("span");
		c.className = "ytb-text";
		c.innerHTML = b.text ? b.text : b;
		a.TextItem.superclass.constructor.call(this, c)
	};
	Ext.extend(a.TextItem, a.Item, {
				enable : Ext.emptyFn,
				disable : Ext.emptyFn,
				focus : Ext.emptyFn
			});
	Ext.reg("tbtext", a.TextItem);
	a.Button = Ext.extend(Ext.Button, {
				hideParent : true,
				onDestroy : function() {
					a.Button.superclass.onDestroy.call(this);
					if (this.container) {
						this.container.remove()
					}
				}
			});
	Ext.reg("tbbutton", a.Button);
	a.SplitButton = Ext.extend(Ext.SplitButton, {
				hideParent : true,
				onDestroy : function() {
					a.SplitButton.superclass.onDestroy.call(this);
					if (this.container) {
						this.container.remove()
					}
				}
			});
	Ext.reg("tbsplit", a.SplitButton);
	a.MenuButton = a.SplitButton
})();