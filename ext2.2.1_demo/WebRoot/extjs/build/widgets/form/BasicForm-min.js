Ext.form.BasicForm = function(b, a) {
	Ext.apply(this, a);
	this.items = new Ext.util.MixedCollection(false, function(c) {
				return c.id || (c.id = Ext.id())
			});
	this.addEvents("beforeaction", "actionfailed", "actioncomplete");
	if (b) {
		this.initEl(b)
	}
	Ext.form.BasicForm.superclass.constructor.call(this)
};
Ext.extend(Ext.form.BasicForm, Ext.util.Observable, {
	timeout : 30,
	activeAction : null,
	trackResetOnLoad : false,
	initEl : function(a) {
		this.el = Ext.get(a);
		this.id = this.el.id || Ext.id();
		if (!this.standardSubmit) {
			this.el.on("submit", this.onSubmit, this)
		}
		this.el.addClass("x-form")
	},
	getEl : function() {
		return this.el
	},
	onSubmit : function(a) {
		a.stopEvent()
	},
	destroy : function() {
		this.items.each(function(a) {
					Ext.destroy(a)
				});
		if (this.el) {
			this.el.removeAllListeners();
			this.el.remove()
		}
		this.purgeListeners()
	},
	isValid : function() {
		var a = true;
		this.items.each(function(b) {
					if (!b.validate()) {
						a = false
					}
				});
		return a
	},
	isDirty : function() {
		var a = false;
		this.items.each(function(b) {
					if (b.isDirty()) {
						a = true;
						return false
					}
				});
		return a
	},
	doAction : function(b, a) {
		if (typeof b == "string") {
			b = new Ext.form.Action.ACTION_TYPES[b](this, a)
		}
		if (this.fireEvent("beforeaction", this, b) !== false) {
			this.beforeAction(b);
			b.run.defer(100, b)
		}
		return this
	},
	submit : function(b) {
		if (this.standardSubmit) {
			var a = this.isValid();
			if (a) {
				this.el.dom.submit()
			}
			return a
		}
		this.doAction("submit", b);
		return this
	},
	load : function(a) {
		this.doAction("load", a);
		return this
	},
	updateRecord : function(b) {
		b.beginEdit();
		var a = b.fields;
		a.each(function(c) {
					var d = this.findField(c.name);
					if (d) {
						b.set(c.name, d.getValue())
					}
				}, this);
		b.endEdit();
		return this
	},
	loadRecord : function(a) {
		this.setValues(a.data);
		return this
	},
	beforeAction : function(a) {
		var b = a.options;
		if (b.waitMsg) {
			if (this.waitMsgTarget === true) {
				this.el.mask(b.waitMsg, "x-mask-loading")
			} else {
				if (this.waitMsgTarget) {
					this.waitMsgTarget = Ext.get(this.waitMsgTarget);
					this.waitMsgTarget.mask(b.waitMsg, "x-mask-loading")
				} else {
					Ext.MessageBox.wait(b.waitMsg, b.waitTitle
									|| this.waitTitle || "Please Wait...")
				}
			}
		}
	},
	afterAction : function(a, c) {
		this.activeAction = null;
		var b = a.options;
		if (b.waitMsg) {
			if (this.waitMsgTarget === true) {
				this.el.unmask()
			} else {
				if (this.waitMsgTarget) {
					this.waitMsgTarget.unmask()
				} else {
					Ext.MessageBox.updateProgress(1);
					Ext.MessageBox.hide()
				}
			}
		}
		if (c) {
			if (b.reset) {
				this.reset()
			}
			Ext.callback(b.success, b.scope, [this, a]);
			this.fireEvent("actioncomplete", this, a)
		} else {
			Ext.callback(b.failure, b.scope, [this, a]);
			this.fireEvent("actionfailed", this, a)
		}
	},
	findField : function(b) {
		var a = this.items.get(b);
		if (!a) {
			this.items.each(function(c) {
				if (c.isFormField
						&& (c.dataIndex == b || c.id == b || c.getName() == b)) {
					a = c;
					return false
				}
			})
		}
		return a || null
	},
	markInvalid : function(h) {
		if (Ext.isArray(h)) {
			for (var c = 0, a = h.length; c < a; c++) {
				var b = h[c];
				var d = this.findField(b.id);
				if (d) {
					d.markInvalid(b.msg)
				}
			}
		} else {
			var e, g;
			for (g in h) {
				if (typeof h[g] != "function" && (e = this.findField(g))) {
					e.markInvalid(h[g])
				}
			}
		}
		return this
	},
	setValues : function(c) {
		if (Ext.isArray(c)) {
			for (var d = 0, a = c.length; d < a; d++) {
				var b = c[d];
				var e = this.findField(b.id);
				if (e) {
					e.setValue(b.value);
					if (this.trackResetOnLoad) {
						e.originalValue = e.getValue()
					}
				}
			}
		} else {
			var g, h;
			for (h in c) {
				if (typeof c[h] != "function" && (g = this.findField(h))) {
					g.setValue(c[h]);
					if (this.trackResetOnLoad) {
						g.originalValue = g.getValue()
					}
				}
			}
		}
		return this
	},
	getValues : function(b) {
		var a = Ext.lib.Ajax.serializeForm(this.el.dom);
		if (b === true) {
			return a
		}
		return Ext.urlDecode(a)
	},
	clearInvalid : function() {
		this.items.each(function(a) {
					a.clearInvalid()
				});
		return this
	},
	reset : function() {
		this.items.each(function(a) {
					a.reset()
				});
		return this
	},
	add : function() {
		this.items.addAll(Array.prototype.slice.call(arguments, 0));
		return this
	},
	remove : function(a) {
		this.items.remove(a);
		return this
	},
	render : function() {
		this.items.each(function(a) {
					if (a.isFormField && !a.rendered
							&& document.getElementById(a.id)) {
						a.applyToMarkup(a.id)
					}
				});
		return this
	},
	applyToFields : function(a) {
		this.items.each(function(b) {
					Ext.apply(b, a)
				});
		return this
	},
	applyIfToFields : function(a) {
		this.items.each(function(b) {
					Ext.applyIf(b, a)
				});
		return this
	}
});
Ext.BasicForm = Ext.form.BasicForm;