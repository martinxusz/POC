Ext.FormPanel = Ext.extend(Ext.Panel, {
			buttonAlign : "center",
			minButtonWidth : 75,
			labelAlign : "left",
			monitorValid : false,
			monitorPoll : 200,
			layout : "form",
			initComponent : function() {
				this.form = this.createForm();
				this.bodyCfg = {
					tag : "form",
					cls : this.baseCls + "-body",
					method : this.method || "POST",
					id : this.formId || Ext.id()
				};
				if (this.fileUpload) {
					this.bodyCfg.enctype = "multipart/form-data"
				}
				Ext.FormPanel.superclass.initComponent.call(this);
				this.initItems();
				this.addEvents("clientvalidation");
				this.relayEvents(this.form, ["beforeaction", "actionfailed",
								"actioncomplete"])
			},
			createForm : function() {
				delete this.initialConfig.listeners;
				return new Ext.form.BasicForm(null, this.initialConfig)
			},
			initFields : function() {
				var c = this.form;
				var a = this;
				var b = function(d) {
					if (d.isFormField) {
						c.add(d)
					} else {
						if (d.doLayout && d != a) {
							Ext.applyIf(d, {
										labelAlign : d.ownerCt.labelAlign,
										labelWidth : d.ownerCt.labelWidth,
										itemCls : d.ownerCt.itemCls
									});
							if (d.items) {
								d.items.each(b)
							}
						}
					}
				};
				this.items.each(b)
			},
			getLayoutTarget : function() {
				return this.form.el
			},
			getForm : function() {
				return this.form
			},
			onRender : function(b, a) {
				this.initFields();
				Ext.FormPanel.superclass.onRender.call(this, b, a);
				this.form.initEl(this.body)
			},
			beforeDestroy : function() {
				Ext.FormPanel.superclass.beforeDestroy.call(this);
				this.stopMonitoring();
				Ext.destroy(this.form)
			},
			initEvents : function() {
				Ext.FormPanel.superclass.initEvents.call(this);
				this.items.on("remove", this.onRemove, this);
				this.items.on("add", this.onAdd, this);
				if (this.monitorValid) {
					this.startMonitoring()
				}
			},
			onAdd : function(a, b) {
				if (b.isFormField) {
					this.form.add(b)
				}
			},
			onRemove : function(a) {
				if (a.isFormField) {
					Ext.destroy(a.container.up(".x-form-item"));
					this.form.remove(a)
				}
			},
			startMonitoring : function() {
				if (!this.bound) {
					this.bound = true;
					Ext.TaskMgr.start({
								run : this.bindHandler,
								interval : this.monitorPoll || 200,
								scope : this
							})
				}
			},
			stopMonitoring : function() {
				this.bound = false
			},
			load : function() {
				this.form.load.apply(this.form, arguments)
			},
			onDisable : function() {
				Ext.FormPanel.superclass.onDisable.call(this);
				if (this.form) {
					this.form.items.each(function() {
								this.disable()
							})
				}
			},
			onEnable : function() {
				Ext.FormPanel.superclass.onEnable.call(this);
				if (this.form) {
					this.form.items.each(function() {
								this.enable()
							})
				}
			},
			bindHandler : function() {
				if (!this.bound) {
					return false
				}
				var d = true;
				this.form.items.each(function(e) {
							if (!e.isValid(true)) {
								d = false;
								return false
							}
						});
				if (this.buttons) {
					for (var c = 0, a = this.buttons.length; c < a; c++) {
						var b = this.buttons[c];
						if (b.formBind === true && b.disabled === d) {
							b.setDisabled(!d)
						}
					}
				}
				this.fireEvent("clientvalidation", this, d)
			}
		});
Ext.reg("form", Ext.FormPanel);
Ext.form.FormPanel = Ext.FormPanel;