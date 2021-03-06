Ext.form.FieldSet = Ext.extend(Ext.Panel, {
	baseCls : "x-fieldset",
	layout : "form",
	animCollapse : false,
	onRender : function(b, a) {
		if (!this.el) {
			this.el = document.createElement("fieldset");
			this.el.id = this.id;
			if (this.title || this.header || this.checkboxToggle) {
				this.el.appendChild(document.createElement("legend")).className = "x-fieldset-header"
			}
		}
		Ext.form.FieldSet.superclass.onRender.call(this, b, a);
		if (this.checkboxToggle) {
			var c = typeof this.checkboxToggle == "object"
					? this.checkboxToggle
					: {
						tag : "input",
						type : "checkbox",
						name : this.checkboxName || this.id + "-checkbox"
					};
			this.checkbox = this.header.insertFirst(c);
			this.checkbox.dom.checked = !this.collapsed;
			this.checkbox.on("click", this.onCheckClick, this)
		}
	},
	onCollapse : function(a, b) {
		if (this.checkbox) {
			this.checkbox.dom.checked = false
		}
		Ext.form.FieldSet.superclass.onCollapse.call(this, a, b)
	},
	onExpand : function(a, b) {
		if (this.checkbox) {
			this.checkbox.dom.checked = true
		}
		Ext.form.FieldSet.superclass.onExpand.call(this, a, b)
	},
	onCheckClick : function() {
		this[this.checkbox.dom.checked ? "expand" : "collapse"]()
	},
	beforeDestroy : function() {
		if (this.checkbox) {
			this.checkbox.un("click", this.onCheckClick, this)
		}
		Ext.form.FieldSet.superclass.beforeDestroy.call(this)
	}
});
Ext.reg("fieldset", Ext.form.FieldSet);