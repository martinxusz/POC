Ext.form.TriggerField = Ext.extend(Ext.form.TextField, {
			defaultAutoCreate : {
				tag : "input",
				type : "text",
				size : "16",
				autocomplete : "off"
			},
			hideTrigger : false,
			autoSize : Ext.emptyFn,
			monitorTab : true,
			deferHeight : true,
			mimicing : false,
			onResize : function(a, b) {
				Ext.form.TriggerField.superclass.onResize.call(this, a, b);
				if (typeof a == "number") {
					this.el.setWidth(this.adjustWidth("input", a
									- this.trigger.getWidth()))
				}
				this.wrap
						.setWidth(this.el.getWidth() + this.trigger.getWidth())
			},
			adjustSize : Ext.BoxComponent.prototype.adjustSize,
			getResizeEl : function() {
				return this.wrap
			},
			getPositionEl : function() {
				return this.wrap
			},
			alignErrorIcon : function() {
				if (this.wrap) {
					this.errorIcon.alignTo(this.wrap, "tl-tr", [2, 0])
				}
			},
			onRender : function(b, a) {
				Ext.form.TriggerField.superclass.onRender.call(this, b, a);
				this.wrap = this.el.wrap({
							cls : "x-form-field-wrap"
						});
				this.trigger = this.wrap.createChild(this.triggerConfig || {
					tag : "img",
					src : Ext.BLANK_IMAGE_URL,
					cls : "x-form-trigger " + this.triggerClass
				});
				if (this.hideTrigger) {
					this.trigger.setDisplayed(false)
				}
				this.initTrigger();
				if (!this.width) {
					this.wrap.setWidth(this.el.getWidth()
							+ this.trigger.getWidth())
				}
			},
			afterRender : function() {
				Ext.form.TriggerField.superclass.afterRender.call(this);
				var a;
				if (Ext.isIE && !this.hideTrigger
						&& this.el.getY() != (a = this.trigger.getY())) {
					this.el.position();
					this.el.setY(a)
				}
			},
			initTrigger : function() {
				this.trigger.on("click", this.onTriggerClick, this, {
							preventDefault : true
						});
				this.trigger.addClassOnOver("x-form-trigger-over");
				this.trigger.addClassOnClick("x-form-trigger-click")
			},
			onDestroy : function() {
				if (this.trigger) {
					this.trigger.removeAllListeners();
					this.trigger.remove()
				}
				if (this.wrap) {
					this.wrap.remove()
				}
				Ext.form.TriggerField.superclass.onDestroy.call(this)
			},
			onFocus : function() {
				Ext.form.TriggerField.superclass.onFocus.call(this);
				if (!this.mimicing) {
					this.wrap.addClass("x-trigger-wrap-focus");
					this.mimicing = true;
					Ext.get(Ext.isIE ? document.body : document).on(
							"mousedown", this.mimicBlur, this, {
								delay : 10
							});
					if (this.monitorTab) {
						this.el.on("keydown", this.checkTab, this)
					}
				}
			},
			checkTab : function(a) {
				if (a.getKey() == a.TAB) {
					this.triggerBlur()
				}
			},
			onBlur : function() {
			},
			mimicBlur : function(a) {
				if (!this.wrap.contains(a.target) && this.validateBlur(a)) {
					this.triggerBlur()
				}
			},
			triggerBlur : function() {
				this.mimicing = false;
				Ext.get(Ext.isIE ? document.body : document).un("mousedown",
						this.mimicBlur, this);
				if (this.monitorTab && this.el) {
					this.el.un("keydown", this.checkTab, this)
				}
				this.beforeBlur();
				if (this.wrap) {
					this.wrap.removeClass("x-trigger-wrap-focus")
				}
				Ext.form.TriggerField.superclass.onBlur.call(this)
			},
			beforeBlur : Ext.emptyFn,
			validateBlur : function(a) {
				return true
			},
			onDisable : function() {
				Ext.form.TriggerField.superclass.onDisable.call(this);
				if (this.wrap) {
					this.wrap.addClass(this.disabledClass);
					this.el.removeClass(this.disabledClass)
				}
			},
			onEnable : function() {
				Ext.form.TriggerField.superclass.onEnable.call(this);
				if (this.wrap) {
					this.wrap.removeClass(this.disabledClass)
				}
			},
			onShow : function() {
				if (this.wrap) {
					this.wrap.dom.style.display = "";
					this.wrap.dom.style.visibility = "visible"
				}
			},
			onHide : function() {
				this.wrap.dom.style.display = "none"
			},
			onTriggerClick : Ext.emptyFn
		});
Ext.form.TwinTriggerField = Ext.extend(Ext.form.TriggerField, {
			initComponent : function() {
				Ext.form.TwinTriggerField.superclass.initComponent.call(this);
				this.triggerConfig = {
					tag : "span",
					cls : "x-form-twin-triggers",
					cn : [{
								tag : "img",
								src : Ext.BLANK_IMAGE_URL,
								cls : "x-form-trigger " + this.trigger1Class
							}, {
								tag : "img",
								src : Ext.BLANK_IMAGE_URL,
								cls : "x-form-trigger " + this.trigger2Class
							}]
				}
			},
			getTrigger : function(a) {
				return this.triggers[a]
			},
			initTrigger : function() {
				var a = this.trigger.select(".x-form-trigger", true);
				this.wrap.setStyle("overflow", "hidden");
				var b = this;
				a.each(function(d, f, c) {
							d.hide = function() {
								var g = b.wrap.getWidth();
								this.dom.style.display = "none";
								b.el.setWidth(g - b.trigger.getWidth())
							};
							d.show = function() {
								var g = b.wrap.getWidth();
								this.dom.style.display = "";
								b.el.setWidth(g - b.trigger.getWidth())
							};
							var e = "Trigger" + (c + 1);
							if (this["hide" + e]) {
								d.dom.style.display = "none"
							}
							d.on("click", this["on" + e + "Click"], this, {
										preventDefault : true
									});
							d.addClassOnOver("x-form-trigger-over");
							d.addClassOnClick("x-form-trigger-click")
						}, this);
				this.triggers = a.elements
			},
			onTrigger1Click : Ext.emptyFn,
			onTrigger2Click : Ext.emptyFn
		});
Ext.reg("trigger", Ext.form.TriggerField);