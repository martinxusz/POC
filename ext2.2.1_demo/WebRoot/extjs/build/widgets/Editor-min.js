Ext.Editor = function(b, a) {
	this.field = b;
	Ext.Editor.superclass.constructor.call(this, a)
};
Ext.extend(Ext.Editor, Ext.Component, {
	value : "",
	alignment : "c-c?",
	shadow : "frame",
	constrain : false,
	swallowKeys : true,
	completeOnEnter : false,
	cancelOnEsc : false,
	updateEl : false,
	initComponent : function() {
		Ext.Editor.superclass.initComponent.call(this);
		this.addEvents("beforestartedit", "startedit", "beforecomplete",
				"complete", "canceledit", "specialkey")
	},
	onRender : function(b, a) {
		this.el = new Ext.Layer({
					shadow : this.shadow,
					cls : "x-editor",
					parentEl : b,
					shim : this.shim,
					shadowOffset : 4,
					id : this.id,
					constrain : this.constrain
				});
		this.el.setStyle("overflow", Ext.isGecko ? "auto" : "hidden");
		if (this.field.msgTarget != "title") {
			this.field.msgTarget = "qtip"
		}
		this.field.inEditor = true;
		this.field.render(this.el);
		if (Ext.isGecko) {
			this.field.el.dom.setAttribute("autocomplete", "off")
		}
		this.field.on("specialkey", this.onSpecialKey, this);
		if (this.swallowKeys) {
			this.field.el.swallowEvent(["keydown", "keypress"])
		}
		this.field.show();
		this.field.on("blur", this.onBlur, this);
		if (this.field.grow) {
			this.field.on("autosize", this.el.sync, this.el, {
						delay : 1
					})
		}
	},
	onSpecialKey : function(c, b) {
		var a = b.getKey();
		if (this.completeOnEnter && a == b.ENTER) {
			b.stopEvent();
			this.completeEdit()
		} else {
			if (this.cancelOnEsc && a == b.ESC) {
				this.cancelEdit()
			} else {
				this.fireEvent("specialkey", c, b)
			}
		}
		if (this.field.triggerBlur
				&& (a == b.ENTER || a == b.ESC || a == b.TAB)) {
			this.field.triggerBlur()
		}
	},
	startEdit : function(b, c) {
		if (this.editing) {
			this.completeEdit()
		}
		this.boundEl = Ext.get(b);
		var a = c !== undefined ? c : this.boundEl.dom.innerHTML;
		if (!this.rendered) {
			this.render(this.parentEl || document.body)
		}
		if (this.fireEvent("beforestartedit", this, this.boundEl, a) === false) {
			return
		}
		this.startValue = a;
		this.field.setValue(a);
		this.doAutoSize();
		this.el.alignTo(this.boundEl, this.alignment);
		this.editing = true;
		this.show()
	},
	doAutoSize : function() {
		if (this.autoSize) {
			var a = this.boundEl.getSize();
			switch (this.autoSize) {
				case "width" :
					this.setSize(a.width, "");
					break;
				case "height" :
					this.setSize("", a.height);
					break;
				default :
					this.setSize(a.width, a.height)
			}
		}
	},
	setSize : function(a, b) {
		delete this.field.lastSize;
		this.field.setSize(a, b);
		if (this.el) {
			if (Ext.isGecko2 || Ext.isOpera) {
				this.el.setSize(a, b)
			}
			this.el.sync()
		}
	},
	realign : function() {
		this.el.alignTo(this.boundEl, this.alignment)
	},
	completeEdit : function(a) {
		if (!this.editing) {
			return
		}
		var b = this.getValue();
		if (this.revertInvalid !== false && !this.field.isValid()) {
			b = this.startValue;
			this.cancelEdit(true)
		}
		if (String(b) === String(this.startValue) && this.ignoreNoChange) {
			this.editing = false;
			this.hide();
			return
		}
		if (this.fireEvent("beforecomplete", this, b, this.startValue) !== false) {
			this.editing = false;
			if (this.updateEl && this.boundEl) {
				this.boundEl.update(b)
			}
			if (a !== true) {
				this.hide()
			}
			this.fireEvent("complete", this, b, this.startValue)
		}
	},
	onShow : function() {
		this.el.show();
		if (this.hideEl !== false) {
			this.boundEl.hide()
		}
		this.field.show();
		if (Ext.isIE && !this.fixIEFocus) {
			this.fixIEFocus = true;
			this.deferredFocus.defer(50, this)
		} else {
			this.field.focus()
		}
		this.fireEvent("startedit", this.boundEl, this.startValue)
	},
	deferredFocus : function() {
		if (this.editing) {
			this.field.focus()
		}
	},
	cancelEdit : function(a) {
		if (this.editing) {
			var b = this.getValue();
			this.setValue(this.startValue);
			if (a !== true) {
				this.hide()
			}
			this.fireEvent("canceledit", this, b, this.startValue)
		}
	},
	onBlur : function() {
		if (this.allowBlur !== true && this.editing) {
			this.completeEdit()
		}
	},
	onHide : function() {
		if (this.editing) {
			this.completeEdit();
			return
		}
		this.field.blur();
		if (this.field.collapse) {
			this.field.collapse()
		}
		this.el.hide();
		if (this.hideEl !== false) {
			this.boundEl.show()
		}
	},
	setValue : function(a) {
		this.field.setValue(a)
	},
	getValue : function() {
		return this.field.getValue()
	},
	beforeDestroy : function() {
		Ext.destroy(this.field);
		this.field = null
	}
});
Ext.reg("editor", Ext.Editor);