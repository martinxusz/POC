Ext.form.Checkbox = Ext.extend(Ext.form.Field, {
	checkedCls : "x-form-check-checked",
	focusCls : "x-form-check-focus",
	overCls : "x-form-check-over",
	mouseDownCls : "x-form-check-down",
	tabIndex : 0,
	checked : false,
	defaultAutoCreate : {
		tag : "input",
		type : "checkbox",
		autocomplete : "off"
	},
	baseCls : "x-form-check",
	initComponent : function() {
		Ext.form.Checkbox.superclass.initComponent.call(this);
		this.addEvents("check")
	},
	initEvents : function() {
		Ext.form.Checkbox.superclass.initEvents.call(this);
		this.initCheckEvents()
	},
	initCheckEvents : function() {
		this.innerWrap.removeAllListeners();
		this.innerWrap.addClassOnOver(this.overCls);
		this.innerWrap.addClassOnClick(this.mouseDownCls);
		this.innerWrap.on("click", this.onClick, this);
		this.innerWrap.on("keyup", this.onKeyUp, this)
	},
	onRender : function(b, a) {
		Ext.form.Checkbox.superclass.onRender.call(this, b, a);
		if (this.inputValue !== undefined) {
			this.el.dom.value = this.inputValue
		}
		this.el.addClass("x-hidden");
		this.innerWrap = this.el.wrap({
					tabIndex : this.tabIndex,
					cls : this.baseCls + "-wrap-inner"
				});
		this.wrap = this.innerWrap.wrap({
					cls : this.baseCls + "-wrap"
				});
		if (this.boxLabel) {
			this.labelEl = this.innerWrap.createChild({
						tag : "label",
						htmlFor : this.el.id,
						cls : "x-form-cb-label",
						html : this.boxLabel
					})
		}
		this.imageEl = this.innerWrap.createChild({
					tag : "img",
					src : Ext.BLANK_IMAGE_URL,
					cls : this.baseCls
				}, this.el);
		if (this.checked) {
			this.setValue(true)
		} else {
			this.checked = this.el.dom.checked
		}
		this.originalValue = this.checked
	},
	afterRender : function() {
		Ext.form.Checkbox.superclass.afterRender.call(this);
		this.wrap[this.checked ? "addClass" : "removeClass"](this.checkedCls)
	},
	onDestroy : function() {
		if (this.rendered) {
			Ext.destroy(this.imageEl, this.labelEl, this.innerWrap, this.wrap)
		}
		Ext.form.Checkbox.superclass.onDestroy.call(this)
	},
	onFocus : function(a) {
		Ext.form.Checkbox.superclass.onFocus.call(this, a);
		this.el.addClass(this.focusCls)
	},
	onBlur : function(a) {
		Ext.form.Checkbox.superclass.onBlur.call(this, a);
		this.el.removeClass(this.focusCls)
	},
	onResize : function() {
		Ext.form.Checkbox.superclass.onResize.apply(this, arguments);
		if (!this.boxLabel && !this.fieldLabel) {
			this.el.alignTo(this.wrap, "c-c")
		}
	},
	onKeyUp : function(a) {
		if (a.getKey() == Ext.EventObject.SPACE) {
			this.onClick(a)
		}
	},
	onClick : function(a) {
		if (!this.disabled && !this.readOnly) {
			this.toggleValue()
		}
		a.stopEvent()
	},
	onEnable : function() {
		Ext.form.Checkbox.superclass.onEnable.call(this);
		this.initCheckEvents()
	},
	onDisable : function() {
		Ext.form.Checkbox.superclass.onDisable.call(this);
		this.innerWrap.removeAllListeners()
	},
	toggleValue : function() {
		this.setValue(!this.checked)
	},
	getResizeEl : function() {
		if (!this.resizeEl) {
			this.resizeEl = Ext.isSafari ? this.wrap : (this.wrap.up(
					".x-form-element", 5) || this.wrap)
		}
		return this.resizeEl
	},
	getPositionEl : function() {
		return this.wrap
	},
	getActionEl : function() {
		return this.wrap
	},
	markInvalid : Ext.emptyFn,
	clearInvalid : Ext.emptyFn,
	initValue : Ext.emptyFn,
	getValue : function() {
		if (this.rendered) {
			return this.el.dom.checked
		}
		return this.checked
	},
	setValue : function(a) {
		var b = this.checked;
		this.checked = (a === true || a === "true" || a == "1" || String(a)
				.toLowerCase() == "on");
		if (this.rendered) {
			this.el.dom.checked = this.checked;
			this.el.dom.defaultChecked = this.checked;
			this.wrap[this.checked ? "addClass" : "removeClass"](this.checkedCls)
		}
		if (b != this.checked) {
			this.fireEvent("check", this, this.checked);
			if (this.handler) {
				this.handler.call(this.scope || this, this, this.checked)
			}
		}
	}
});
Ext.reg("checkbox", Ext.form.Checkbox);