Ext.form.Radio = Ext.extend(Ext.form.Checkbox, {
			inputType : "radio",
			baseCls : "x-form-radio",
			getGroupValue : function() {
				var a = this.getParent().child(
						"input[name=" + this.el.dom.name + "]:checked", true);
				return a ? a.value : null
			},
			getParent : function() {
				return this.el.up("form") || Ext.getBody()
			},
			toggleValue : function() {
				if (!this.checked) {
					var a = this.getParent().select("input[name="
							+ this.el.dom.name + "]");
					a.each(function(b) {
								if (b.dom.id == this.id) {
									this.setValue(true)
								} else {
									Ext.getCmp(b.dom.id).setValue(false)
								}
							}, this)
				}
			},
			setValue : function(a) {
				if (typeof a == "boolean") {
					Ext.form.Radio.superclass.setValue.call(this, a)
				} else {
					var b = this.getParent().child(
							"input[name=" + this.el.dom.name + "][value=" + a
									+ "]", true);
					if (b && !b.checked) {
						Ext.getCmp(b.id).toggleValue()
					}
				}
			},
			markInvalid : Ext.emptyFn,
			clearInvalid : Ext.emptyFn
		});
Ext.reg("radio", Ext.form.Radio);