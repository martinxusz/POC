Ext.form.TextField = Ext.extend(Ext.form.Field, {
	grow : false,
	growMin : 30,
	growMax : 800,
	vtype : null,
	maskRe : null,
	disableKeyFilter : false,
	allowBlank : true,
	minLength : 0,
	maxLength : Number.MAX_VALUE,
	minLengthText : "The minimum length for this field is {0}",
	maxLengthText : "The maximum length for this field is {0}",
	selectOnFocus : false,
	blankText : "This field is required",
	validator : null,
	regex : null,
	regexText : "",
	emptyText : null,
	emptyClass : "x-form-empty-field",
	initComponent : function() {
		Ext.form.TextField.superclass.initComponent.call(this);
		this.addEvents("autosize", "keydown", "keyup", "keypress")
	},
	initEvents : function() {
		Ext.form.TextField.superclass.initEvents.call(this);
		if (this.validationEvent == "keyup") {
			this.validationTask = new Ext.util.DelayedTask(this.validate, this);
			this.el.on("keyup", this.filterValidation, this)
		} else {
			if (this.validationEvent !== false) {
				this.el.on(this.validationEvent, this.validate, this, {
							buffer : this.validationDelay
						})
			}
		}
		if (this.selectOnFocus || this.emptyText) {
			this.on("focus", this.preFocus, this);
			this.el.on("mousedown", function() {
						if (!this.hasFocus) {
							this.el.on("mouseup", function(a) {
										a.preventDefault()
									}, this, {
										single : true
									})
						}
					}, this);
			if (this.emptyText) {
				this.on("blur", this.postBlur, this);
				this.applyEmptyText()
			}
		}
		if (this.maskRe
				|| (this.vtype && this.disableKeyFilter !== true && (this.maskRe = Ext.form.VTypes[this.vtype
						+ "Mask"]))) {
			this.el.on("keypress", this.filterKeys, this)
		}
		if (this.grow) {
			this.el.on("keyup", this.onKeyUpBuffered, this, {
						buffer : 50
					});
			this.el.on("click", this.autoSize, this)
		}
		if (this.enableKeyEvents) {
			this.el.on("keyup", this.onKeyUp, this);
			this.el.on("keydown", this.onKeyDown, this);
			this.el.on("keypress", this.onKeyPress, this)
		}
	},
	processValue : function(a) {
		if (this.stripCharsRe) {
			var b = a.replace(this.stripCharsRe, "");
			if (b !== a) {
				this.setRawValue(b);
				return b
			}
		}
		return a
	},
	filterValidation : function(a) {
		if (!a.isNavKeyPress()) {
			this.validationTask.delay(this.validationDelay)
		}
	},
	onDisable : function() {
		Ext.form.TextField.superclass.onDisable.call(this);
		if (Ext.isIE) {
			this.el.dom.unselectable = "on"
		}
	},
	onEnable : function() {
		Ext.form.TextField.superclass.onEnable.call(this);
		if (Ext.isIE) {
			this.el.dom.unselectable = ""
		}
	},
	onKeyUpBuffered : function(a) {
		if (!a.isNavKeyPress()) {
			this.autoSize()
		}
	},
	onKeyUp : function(a) {
		this.fireEvent("keyup", this, a)
	},
	onKeyDown : function(a) {
		this.fireEvent("keydown", this, a)
	},
	onKeyPress : function(a) {
		this.fireEvent("keypress", this, a)
	},
	reset : function() {
		Ext.form.TextField.superclass.reset.call(this);
		this.applyEmptyText()
	},
	applyEmptyText : function() {
		if (this.rendered && this.emptyText && this.getRawValue().length < 1
				&& !this.hasFocus) {
			this.setRawValue(this.emptyText);
			this.el.addClass(this.emptyClass)
		}
	},
	preFocus : function() {
		if (this.emptyText) {
			if (this.el.dom.value == this.emptyText) {
				this.setRawValue("")
			}
			this.el.removeClass(this.emptyClass)
		}
		if (this.selectOnFocus) {
			this.el.dom.select()
		}
	},
	postBlur : function() {
		this.applyEmptyText()
	},
	filterKeys : function(b) {
		if (b.ctrlKey) {
			return
		}
		var a = b.getKey();
		if (Ext.isGecko
				&& (b.isNavKeyPress() || a == b.BACKSPACE || (a == b.DELETE && b.button == -1))) {
			return
		}
		var f = b.getCharCode(), d = String.fromCharCode(f);
		if (!Ext.isGecko && b.isSpecialKey() && !d) {
			return
		}
		if (!this.maskRe.test(d)) {
			b.stopEvent()
		}
	},
	setValue : function(a) {
		if (this.emptyText && this.el && a !== undefined && a !== null
				&& a !== "") {
			this.el.removeClass(this.emptyClass)
		}
		Ext.form.TextField.superclass.setValue.apply(this, arguments);
		this.applyEmptyText();
		this.autoSize()
	},
	validateValue : function(a) {
		if (a.length < 1 || a === this.emptyText) {
			if (this.allowBlank) {
				this.clearInvalid();
				return true
			} else {
				this.markInvalid(this.blankText);
				return false
			}
		}
		if (a.length < this.minLength) {
			this.markInvalid(String.format(this.minLengthText, this.minLength));
			return false
		}
		if (a.length > this.maxLength) {
			this.markInvalid(String.format(this.maxLengthText, this.maxLength));
			return false
		}
		if (this.vtype) {
			var c = Ext.form.VTypes;
			if (!c[this.vtype](a, this)) {
				this.markInvalid(this.vtypeText || c[this.vtype + "Text"]);
				return false
			}
		}
		if (typeof this.validator == "function") {
			var b = this.validator(a);
			if (b !== true) {
				this.markInvalid(b);
				return false
			}
		}
		if (this.regex && !this.regex.test(a)) {
			this.markInvalid(this.regexText);
			return false
		}
		return true
	},
	selectText : function(g, a) {
		var c = this.getRawValue();
		var e = false;
		if (c.length > 0) {
			g = g === undefined ? 0 : g;
			a = a === undefined ? c.length : a;
			var f = this.el.dom;
			if (f.setSelectionRange) {
				f.setSelectionRange(g, a)
			} else {
				if (f.createTextRange) {
					var b = f.createTextRange();
					b.moveStart("character", g);
					b.moveEnd("character", a - c.length);
					b.select()
				}
			}
			e = Ext.isGecko || Ext.isOpera
		} else {
			e = true
		}
		if (e) {
			this.focus()
		}
	},
	autoSize : function() {
		if (!this.grow || !this.rendered) {
			return
		}
		if (!this.metrics) {
			this.metrics = Ext.util.TextMetrics.createInstance(this.el)
		}
		var c = this.el;
		var b = c.dom.value;
		var e = document.createElement("div");
		e.appendChild(document.createTextNode(b));
		b = e.innerHTML;
		Ext.removeNode(e);
		e = null;
		b += "&#160;";
		var a = Math.min(this.growMax, Math.max(this.metrics.getWidth(b) + 10,
						this.growMin));
		this.el.setWidth(a);
		this.fireEvent("autosize", this, a)
	}
});
Ext.reg("textfield", Ext.form.TextField);