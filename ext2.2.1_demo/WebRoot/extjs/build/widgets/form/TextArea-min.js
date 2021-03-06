Ext.form.TextArea = Ext.extend(Ext.form.TextField, {
			growMin : 60,
			growMax : 1000,
			growAppend : "&#160;\n&#160;",
			growPad : 0,
			enterIsSpecial : false,
			preventScrollbars : false,
			onRender : function(b, a) {
				if (!this.el) {
					this.defaultAutoCreate = {
						tag : "textarea",
						style : "width:100px;height:60px;",
						autocomplete : "off"
					}
				}
				Ext.form.TextArea.superclass.onRender.call(this, b, a);
				if (this.grow) {
					this.textSizeEl = Ext.DomHelper.append(document.body, {
								tag : "pre",
								cls : "x-form-grow-sizer"
							});
					if (this.preventScrollbars) {
						this.el.setStyle("overflow", "hidden")
					}
					this.el.setHeight(this.growMin)
				}
			},
			onDestroy : function() {
				if (this.textSizeEl) {
					Ext.removeNode(this.textSizeEl)
				}
				Ext.form.TextArea.superclass.onDestroy.call(this)
			},
			fireKey : function(a) {
				if (a.isSpecialKey()
						&& (this.enterIsSpecial || (a.getKey() != a.ENTER || a
								.hasModifier()))) {
					this.fireEvent("specialkey", this, a)
				}
			},
			onKeyUp : function(a) {
				if (!a.isNavKeyPress() || a.getKey() == a.ENTER) {
					this.autoSize()
				}
				Ext.form.TextArea.superclass.onKeyUp.call(this, a)
			},
			autoSize : function() {
				if (!this.grow || !this.textSizeEl) {
					return
				}
				var c = this.el;
				var a = c.dom.value;
				var d = this.textSizeEl;
				d.innerHTML = "";
				d.appendChild(document.createTextNode(a));
				a = d.innerHTML;
				Ext.fly(d).setWidth(this.el.getWidth());
				if (a.length < 1) {
					a = "&#160;&#160;"
				} else {
					if (Ext.isIE) {
						a = a.replace(/\n/g, "<p>&#160;</p>")
					}
					a += this.growAppend
				}
				d.innerHTML = a;
				var b = Math.min(this.growMax, Math.max(d.offsetHeight,
								this.growMin)
								+ this.growPad);
				if (b != this.lastHeight) {
					this.lastHeight = b;
					this.el.setHeight(b);
					this.fireEvent("autosize", this, b)
				}
			}
		});
Ext.reg("textarea", Ext.form.TextArea);