Ext.form.Label = Ext.extend(Ext.BoxComponent, {
			onRender : function(b, a) {
				if (!this.el) {
					this.el = document.createElement("label");
					this.el.id = this.getId();
					this.el.innerHTML = this.text ? Ext.util.Format
							.htmlEncode(this.text) : (this.html || "");
					if (this.forId) {
						this.el.setAttribute("for", this.forId)
					}
				}
				Ext.form.Label.superclass.onRender.call(this, b, a)
			},
			setText : function(a, b) {
				this.text = a;
				if (this.rendered) {
					this.el.dom.innerHTML = b !== false ? Ext.util.Format
							.htmlEncode(a) : a
				}
				return this
			}
		});
Ext.reg("label", Ext.form.Label);