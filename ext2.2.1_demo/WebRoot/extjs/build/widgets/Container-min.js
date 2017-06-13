Ext.Container = Ext.extend(Ext.BoxComponent, {
			autoDestroy : true,
			defaultType : "panel",
			initComponent : function() {
				Ext.Container.superclass.initComponent.call(this);
				this.addEvents("afterlayout", "beforeadd", "beforeremove",
						"add", "remove");
				var a = this.items;
				if (a) {
					delete this.items;
					if (Ext.isArray(a) && a.length > 0) {
						this.add.apply(this, a)
					} else {
						this.add(a)
					}
				}
			},
			initItems : function() {
				if (!this.items) {
					this.items = new Ext.util.MixedCollection(false,
							this.getComponentId);
					this.getLayout()
				}
			},
			setLayout : function(a) {
				if (this.layout && this.layout != a) {
					this.layout.setContainer(null)
				}
				this.initItems();
				this.layout = a;
				a.setContainer(this)
			},
			render : function() {
				Ext.Container.superclass.render.apply(this, arguments);
				if (this.layout) {
					if (typeof this.layout == "string") {
						this.layout = new Ext.Container.LAYOUTS[this.layout
								.toLowerCase()](this.layoutConfig)
					}
					this.setLayout(this.layout);
					if (this.activeItem !== undefined) {
						var a = this.activeItem;
						delete this.activeItem;
						this.layout.setActiveItem(a);
						return
					}
				}
				if (!this.ownerCt) {
					this.doLayout()
				}
				if (this.monitorResize === true) {
					Ext.EventManager.onWindowResize(this.doLayout, this,
							[false])
				}
			},
			getLayoutTarget : function() {
				return this.el
			},
			getComponentId : function(a) {
				return a.itemId || a.id
			},
			add : function(e) {
				if (!this.items) {
					this.initItems()
				}
				var d = arguments, b = d.length;
				if (b > 1) {
					for (var f = 0; f < b; f++) {
						this.add(d[f])
					}
					return
				}
				var h = this.lookupComponent(this.applyDefaults(e));
				var g = this.items.length;
				if (this.fireEvent("beforeadd", this, h, g) !== false
						&& this.onBeforeAdd(h) !== false) {
					this.items.add(h);
					h.ownerCt = this;
					this.fireEvent("add", this, h, g)
				}
				return h
			},
			insert : function(f, e) {
				if (!this.items) {
					this.initItems()
				}
				var d = arguments, b = d.length;
				if (b > 2) {
					for (var g = b - 1; g >= 1; --g) {
						this.insert(f, d[g])
					}
					return
				}
				var h = this.lookupComponent(this.applyDefaults(e));
				if (h.ownerCt == this && this.items.indexOf(h) < f) {
					--f
				}
				if (this.fireEvent("beforeadd", this, h, f) !== false
						&& this.onBeforeAdd(h) !== false) {
					this.items.insert(f, h);
					h.ownerCt = this;
					this.fireEvent("add", this, h, f)
				}
				return h
			},
			applyDefaults : function(a) {
				if (this.defaults) {
					if (typeof a == "string") {
						a = Ext.ComponentMgr.get(a);
						Ext.apply(a, this.defaults)
					} else {
						if (!a.events) {
							Ext.applyIf(a, this.defaults)
						} else {
							Ext.apply(a, this.defaults)
						}
					}
				}
				return a
			},
			onBeforeAdd : function(a) {
				if (a.ownerCt) {
					a.ownerCt.remove(a, false)
				}
				if (this.hideBorders === true) {
					a.border = (a.border === true)
				}
			},
			remove : function(a, b) {
				var d = this.getComponent(a);
				if (d && this.fireEvent("beforeremove", this, d) !== false) {
					this.items.remove(d);
					delete d.ownerCt;
					if (b === true || (b !== false && this.autoDestroy)) {
						d.destroy()
					}
					if (this.layout && this.layout.activeItem == d) {
						delete this.layout.activeItem
					}
					this.fireEvent("remove", this, d)
				}
				return d
			},
			removeAll : function(b) {
				var c, a = [];
				while ((c = this.items.last())) {
					a.unshift(this.remove(c, b))
				}
				return a
			},
			getComponent : function(a) {
				if (typeof a == "object") {
					return a
				}
				return this.items.get(a)
			},
			lookupComponent : function(a) {
				if (typeof a == "string") {
					return Ext.ComponentMgr.get(a)
				} else {
					if (!a.events) {
						return this.createComponent(a)
					}
				}
				return a
			},
			createComponent : function(a) {
				return Ext.ComponentMgr.create(a, this.defaultType)
			},
			doLayout : function(e) {
				if (this.rendered && this.layout) {
					this.layout.layout()
				}
				if (e !== false && this.items) {
					var d = this.items.items;
					for (var b = 0, a = d.length; b < a; b++) {
						var f = d[b];
						if (f.doLayout) {
							f.doLayout()
						}
					}
				}
			},
			getLayout : function() {
				if (!this.layout) {
					var a = new Ext.layout.ContainerLayout(this.layoutConfig);
					this.setLayout(a)
				}
				return this.layout
			},
			beforeDestroy : function() {
				if (this.items) {
					Ext.destroy.apply(Ext, this.items.items)
				}
				if (this.monitorResize) {
					Ext.EventManager.removeResizeListener(this.doLayout, this)
				}
				if (this.layout && this.layout.destroy) {
					this.layout.destroy()
				}
				Ext.Container.superclass.beforeDestroy.call(this)
			},
			bubble : function(c, b, a) {
				var d = this;
				while (d) {
					if (c.apply(b || d, a || [d]) === false) {
						break
					}
					d = d.ownerCt
				}
			},
			cascade : function(f, e, b) {
				if (f.apply(e || this, b || [this]) !== false) {
					if (this.items) {
						var d = this.items.items;
						for (var c = 0, a = d.length; c < a; c++) {
							if (d[c].cascade) {
								d[c].cascade(f, e, b)
							} else {
								f.apply(e || d[c], b || [d[c]])
							}
						}
					}
				}
			},
			findById : function(c) {
				var a, b = this;
				this.cascade(function(d) {
							if (b != d && d.id === c) {
								a = d;
								return false
							}
						});
				return a || null
			},
			findByType : function(b, a) {
				return this.findBy(function(d) {
							return d.isXType(b, a)
						})
			},
			find : function(b, a) {
				return this.findBy(function(d) {
							return d[b] === a
						})
			},
			findBy : function(d, c) {
				var a = [], b = this;
				this.cascade(function(e) {
							if (b != e && d.call(c || e, e, b) === true) {
								a.push(e)
							}
						});
				return a
			}
		});
Ext.Container.LAYOUTS = {};
Ext.reg("container", Ext.Container);