Ext.form.CheckboxGroup = Ext.extend(Ext.form.Field, {
	columns : "auto",
	vertical : false,
	allowBlank : true,
	blankText : "You must select at least one item in this group",
	defaultType : "checkbox",
	groupCls : "x-form-check-group",
	onRender : function(h, f) {
		if (!this.el) {
			var o = {
				cls : this.groupCls,
				layout : "column",
				border : false,
				renderTo : h
			};
			var a = {
				defaultType : this.defaultType,
				layout : "form",
				border : false,
				defaults : {
					hideLabel : true,
					anchor : "100%"
				}
			};
			if (this.items[0].items) {
				Ext.apply(o, {
							layoutConfig : {
								columns : this.items.length
							},
							defaults : this.defaults,
							items : this.items
						});
				for (var e = 0, k = this.items.length; e < k; e++) {
					Ext.applyIf(this.items[e], a)
				}
			} else {
				var d, m = [];
				if (typeof this.columns == "string") {
					this.columns = this.items.length
				}
				if (!Ext.isArray(this.columns)) {
					var j = [];
					for (var e = 0; e < this.columns; e++) {
						j.push((100 / this.columns) * 0.01)
					}
					this.columns = j
				}
				d = this.columns.length;
				for (var e = 0; e < d; e++) {
					var b = Ext.apply({
								items : []
							}, a);
					b[this.columns[e] <= 1 ? "columnWidth" : "width"] = this.columns[e];
					if (this.defaults) {
						b.defaults = Ext.apply(b.defaults || {}, this.defaults)
					}
					m.push(b)
				}
				if (this.vertical) {
					var q = Math.ceil(this.items.length / d), n = 0;
					for (var e = 0, k = this.items.length; e < k; e++) {
						if (e > 0 && e % q == 0) {
							n++
						}
						if (this.items[e].fieldLabel) {
							this.items[e].hideLabel = false
						}
						m[n].items.push(this.items[e])
					}
				} else {
					for (var e = 0, k = this.items.length; e < k; e++) {
						var p = e % d;
						if (this.items[e].fieldLabel) {
							this.items[e].hideLabel = false
						}
						m[p].items.push(this.items[e])
					}
				}
				Ext.apply(o, {
							layoutConfig : {
								columns : d
							},
							items : m
						})
			}
			this.panel = new Ext.Panel(o);
			this.el = this.panel.getEl();
			if (this.forId && this.itemCls) {
				var c = this.el.up(this.itemCls).child("label", true);
				if (c) {
					c.setAttribute("htmlFor", this.forId)
				}
			}
			var g = this.panel.findBy(function(i) {
						return i.isFormField
					}, this);
			this.items = new Ext.util.MixedCollection();
			this.items.addAll(g)
		}
		Ext.form.CheckboxGroup.superclass.onRender.call(this, h, f)
	},
	validateValue : function(a) {
		if (!this.allowBlank) {
			var b = true;
			this.items.each(function(c) {
						if (c.checked) {
							return b = false
						}
					}, this);
			if (b) {
				this.markInvalid(this.blankText);
				return false
			}
		}
		return true
	},
	onDisable : function() {
		this.items.each(function(a) {
					a.disable()
				})
	},
	onEnable : function() {
		this.items.each(function(a) {
					a.enable()
				})
	},
	onResize : function(a, b) {
		this.panel.setSize(a, b);
		this.panel.doLayout()
	},
	reset : function() {
		Ext.form.CheckboxGroup.superclass.reset.call(this);
		this.items.each(function(a) {
					if (a.reset) {
						a.reset()
					}
				}, this)
	},
	initValue : Ext.emptyFn,
	getValue : Ext.emptyFn,
	getRawValue : Ext.emptyFn,
	setValue : Ext.emptyFn,
	setRawValue : Ext.emptyFn
});
Ext.reg("checkboxgroup", Ext.form.CheckboxGroup);