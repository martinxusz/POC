Ext.form.Hidden = Ext.extend(Ext.form.Field, {
			inputType : "hidden",
			onRender : function() {
				Ext.form.Hidden.superclass.onRender.apply(this, arguments)
			},
			initEvents : function() {
				this.originalValue = this.getValue()
			},
			setSize : Ext.emptyFn,
			setWidth : Ext.emptyFn,
			setHeight : Ext.emptyFn,
			setPosition : Ext.emptyFn,
			setPagePosition : Ext.emptyFn,
			markInvalid : Ext.emptyFn,
			clearInvalid : Ext.emptyFn
		});
Ext.reg("hidden", Ext.form.Hidden);