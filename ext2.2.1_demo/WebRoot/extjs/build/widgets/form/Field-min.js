Ext.form.Field = Ext.extend(Ext.BoxComponent, {
			invalidClass : "x-form-invalid",
			invalidText : "The value in this field is invalid",
			focusClass : "x-form-focus",
			validationEvent : "keyup",
			validateOnBlur : true,
			validationDelay : 250,
			defaultAutoCreate : {
				tag : "input",
				type : "text",
				size : "20",
				autocomplete : "off"
			},
			fieldClass : "x-form-field",
			msgTarget : "qtip",
			msgFx : "normal",
			readOnly : false,
			disabled : false,
			isFormField : true,
			hasFocus : false,
			initComponent : function() {
				Ext.form.Field.superclass.initComponent.call(this);
				this.addEvents("focus", "blur", "specialkey", "change",
						"invalid", "valid")
			},
			getName : function() {
				return this.rendered && this.el.dom.name
						? this.el.dom.name
						: (this.hiddenName || "")
			},
			onRender : function(c, a) {
				Ext.form.Field.superclass.onRender.call(this, c, a);
				if (!this.el) {
					var b = this.getAutoCreate();
					if (!b.name) {
						b.name = this.name || this.id
					}
					if (this.inputType) {
						b.type = this.inputType
					}
					this.el = c.createChild(b, a)
				}
				var d = this.el.dom.type;
				if (d) {
					if (d == "password") {
						d = "text"
					}
					this.el.addClass("x-form-" + d)
				}
				if (this.readOnly) {
					this.el.dom.readOnly = true
				}
				if (this.tabIndex !== undefined) {
					this.el.dom.setAttribute("tabIndex", this.tabIndex)
				}
				this.el.addClass([this.fieldClass, this.cls])
			},
			initValue : function() {
				if (this.value !== undefined) {
					this.setValue(this.value)
				} else {
					if (this.el.dom.value.length > 0
							&& this.el.dom.value != this.emptyText) {
						this.setValue(this.el.dom.value)
					}
				}
				this.originalValue = this.getValue()
			},
			isDirty : function() {
				if (this.disabled) {
					return false
				}
				return String(this.getValue()) !== String(this.originalValue)
			},
			afterRender : function() {
				Ext.form.Field.superclass.afterRender.call(this);
				this.initEvents();
				this.initValue()
			},
			fireKey : function(a) {
				if (a.isSpecialKey()) {
					this.fireEvent("specialkey", this, a)
				}
			},
			reset : function() {
				this.setValue(this.originalValue);
				this.clearInvalid()
			},
			initEvents : function() {
				this.el.on(Ext.isIE || Ext.isSafari3 ? "keydown" : "keypress",
						this.fireKey, this);
				this.el.on("focus", this.onFocus, this);
				var a = this.inEditor && Ext.isWindows && Ext.isGecko ? {
					buffer : 10
				} : null;
				this.el.on("blur", this.onBlur, this, a)
			},
			onFocus : function() {
				if (this.focusClass) {
					this.el.addClass(this.focusClass)
				}
				if (!this.hasFocus) {
					this.hasFocus = true;
					this.startValue = this.getValue();
					this.fireEvent("focus", this)
				}
			},
			beforeBlur : Ext.emptyFn,
			onBlur : function() {
				this.beforeBlur();
				if (this.focusClass) {
					this.el.removeClass(this.focusClass)
				}
				this.hasFocus = false;
				if (this.validationEvent !== false && this.validateOnBlur
						&& this.validationEvent != "blur") {
					this.validate()
				}
				var a = this.getValue();
				if (String(a) !== String(this.startValue)) {
					this.fireEvent("change", this, a, this.startValue)
				}
				this.fireEvent("blur", this)
			},
			isValid : function(a) {
				if (this.disabled) {
					return true
				}
				var c = this.preventMark;
				this.preventMark = a === true;
				var b = this.validateValue(this
						.processValue(this.getRawValue()));
				this.preventMark = c;
				return b
			},
			validate : function() {
				if (this.disabled
						|| this.validateValue(this.processValue(this
								.getRawValue()))) {
					this.clearInvalid();
					return true
				}
				return false
			},
			processValue : function(a) {
				return a
			},
			validateValue : function(a) {
				return true
			},
			markInvalid : function(c) {
				if (!this.rendered || this.preventMark) {
					return
				}
				this.el.addClass(this.invalidClass);
				c = c || this.invalidText;
				switch (this.msgTarget) {
					case "qtip" :
						this.el.dom.qtip = c;
						this.el.dom.qclass = "x-form-invalid-tip";
						if (Ext.QuickTips) {
							Ext.QuickTips.enable()
						}
						break;
					case "title" :
						this.el.dom.title = c;
						break;
					case "under" :
						if (!this.errorEl) {
							var b = this.getErrorCt();
							if (!b) {
								this.el.dom.title = c;
								break
							}
							this.errorEl = b.createChild({
										cls : "x-form-invalid-msg"
									});
							this.errorEl.setWidth(b.getWidth(true) - 20)
						}
						this.errorEl.update(c);
						Ext.form.Field.msgFx[this.msgFx].show(this.errorEl,
								this);
						break;
					case "side" :
						if (!this.errorIcon) {
							var b = this.getErrorCt();
							if (!b) {
								this.el.dom.title = c;
								break
							}
							this.errorIcon = b.createChild({
										cls : "x-form-invalid-icon"
									})
						}
						this.alignErrorIcon();
						this.errorIcon.dom.qtip = c;
						this.errorIcon.dom.qclass = "x-form-invalid-tip";
						this.errorIcon.show();
						this.on("resize", this.alignErrorIcon, this);
						break;
					default :
						var a = Ext.getDom(this.msgTarget);
						a.innerHTML = c;
						a.style.display = this.msgDisplay;
						break
				}
				this.fireEvent("invalid", this, c)
			},
			getErrorCt : function() {
				return this.el.findParent(".x-form-element", 5, true)
						|| this.el.findParent(".x-form-field-wrap", 5, true)
			},
			alignErrorIcon : function() {
				this.errorIcon.alignTo(this.el, "tl-tr", [2, 0])
			},
			clearInvalid : function() {
				if (!this.rendered || this.preventMark) {
					return
				}
				this.el.removeClass(this.invalidClass);
				switch (this.msgTarget) {
					case "qtip" :
						this.el.dom.qtip = "";
						break;
					case "title" :
						this.el.dom.title = "";
						break;
					case "under" :
						if (this.errorEl) {
							Ext.form.Field.msgFx[this.msgFx].hide(this.errorEl,
									this)
						}
						break;
					case "side" :
						if (this.errorIcon) {
							this.errorIcon.dom.qtip = "";
							this.errorIcon.hide();
							this.un("resize", this.alignErrorIcon, this)
						}
						break;
					default :
						var a = Ext.getDom(this.msgTarget);
						a.innerHTML = "";
						a.style.display = "none";
						break
				}
				this.fireEvent("valid", this)
			},
			getRawValue : function() {
				var a = this.rendered ? this.el.getValue() : Ext.value(
						this.value, "");
				if (a === this.emptyText) {
					a = ""
				}
				return a
			},
			getValue : function() {
				if (!this.rendered) {
					return this.value
				}
				var a = this.el.getValue();
				if (a === this.emptyText || a === undefined) {
					a = ""
				}
				return a
			},
			setRawValue : function(a) {
				return this.el.dom.value = (a === null || a === undefined
						? ""
						: a)
			},
			setValue : function(a) {
				this.value = a;
				if (this.rendered) {
					this.el.dom.value = (a === null || a === undefined ? "" : a);
					this.validate()
				}
			},
			adjustSize : function(a, c) {
				var b = Ext.form.Field.superclass.adjustSize.call(this, a, c);
				b.width = this.adjustWidth(this.el.dom.tagName, b.width);
				return b
			},
			adjustWidth : function(a, b) {
				a = a.toLowerCase();
				if (typeof b == "number" && !Ext.isSafari) {
					if (Ext.isIE && (a == "input" || a == "textarea")) {
						if (a == "input" && !Ext.isStrict) {
							return this.inEditor ? b : b - 3
						}
						if (a == "input" && Ext.isStrict) {
							return b - (Ext.isIE6 ? 4 : 1)
						}
						if (a == "textarea" && Ext.isStrict) {
							return b - 2
						}
					} else {
						if (Ext.isOpera && Ext.isStrict) {
							if (a == "input") {
								return b + 2
							}
							if (a == "textarea") {
								return b - 2
							}
						}
					}
				}
				return b
			}
		});
Ext.form.MessageTargets = {
	qtip : {
		mark : function(a) {
			this.el.dom.qtip = msg;
			this.el.dom.qclass = "x-form-invalid-tip";
			if (Ext.QuickTips) {
				Ext.QuickTips.enable()
			}
		},
		clear : function(a) {
			this.el.dom.qtip = ""
		}
	},
	title : {
		mark : function(a) {
			this.el.dom.title = msg
		},
		clear : function(a) {
			this.el.dom.title = ""
		}
	},
	under : {
		mark : function(b) {
			if (!this.errorEl) {
				var a = this.getErrorCt();
				if (!a) {
					this.el.dom.title = msg;
					return
				}
				this.errorEl = a.createChild({
							cls : "x-form-invalid-msg"
						});
				this.errorEl.setWidth(a.getWidth(true) - 20)
			}
			this.errorEl.update(msg);
			Ext.form.Field.msgFx[this.msgFx].show(this.errorEl, this)
		},
		clear : function(a) {
			if (this.errorEl) {
				Ext.form.Field.msgFx[this.msgFx].hide(this.errorEl, this)
			} else {
				this.el.dom.title = ""
			}
		}
	},
	side : {
		mark : function(b) {
			if (!this.errorIcon) {
				var a = this.getErrorCt();
				if (!a) {
					this.el.dom.title = msg;
					return
				}
				this.errorIcon = a.createChild({
							cls : "x-form-invalid-icon"
						})
			}
			this.alignErrorIcon();
			this.errorIcon.dom.qtip = msg;
			this.errorIcon.dom.qclass = "x-form-invalid-tip";
			this.errorIcon.show();
			this.on("resize", this.alignErrorIcon, this)
		},
		clear : function(a) {
			if (this.errorIcon) {
				this.errorIcon.dom.qtip = "";
				this.errorIcon.hide();
				this.un("resize", this.alignErrorIcon, this)
			} else {
				this.el.dom.title = ""
			}
		}
	},
	around : {
		mark : function(a) {
		},
		clear : function(a) {
		}
	}
};
Ext.form.Field.msgFx = {
	normal : {
		show : function(a, b) {
			a.setDisplayed("block")
		},
		hide : function(a, b) {
			a.setDisplayed(false).update("")
		}
	},
	slide : {
		show : function(a, b) {
			a.slideIn("t", {
						stopFx : true
					})
		},
		hide : function(a, b) {
			a.slideOut("t", {
						stopFx : true,
						useDisplay : true
					})
		}
	},
	slideRight : {
		show : function(a, b) {
			a.fixDisplay();
			a.alignTo(b.el, "tl-tr");
			a.slideIn("l", {
						stopFx : true
					})
		},
		hide : function(a, b) {
			a.slideOut("l", {
						stopFx : true,
						useDisplay : true
					})
		}
	}
};
Ext.reg("field", Ext.form.Field);