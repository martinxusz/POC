Ext.CycleButton = Ext.extend(Ext.SplitButton, {
			getItemText : function(a) {
				if (a && this.showText === true) {
					var b = "";
					if (this.prependText) {
						b += this.prependText
					}
					b += a.text;
					return b
				}
				return undefined
			},
			setActiveItem : function(c, a) {
				if (typeof c != "object") {
					c = this.menu.items.get(c)
				}
				if (c) {
					if (!this.rendered) {
						this.text = this.getItemText(c);
						this.iconCls = c.iconCls
					} else {
						var b = this.getItemText(c);
						if (b) {
							this.setText(b)
						}
						this.setIconClass(c.iconCls)
					}
					this.activeItem = c;
					if (!c.checked) {
						c.setChecked(true, true)
					}
					if (this.forceIcon) {
						this.setIconClass(this.forceIcon)
					}
					if (!a) {
						this.fireEvent("change", this, c)
					}
				}
			},
			getActiveItem : function() {
				return this.activeItem
			},
			initComponent : function() {
				this.addEvents("change");
				if (this.changeHandler) {
					this.on("change", this.changeHandler, this.scope || this);
					delete this.changeHandler
				}
				this.itemCount = this.items.length;
				this.menu = {
					cls : "x-cycle-menu",
					items : []
				};
				var d;
				for (var b = 0, a = this.itemCount; b < a; b++) {
					var c = this.items[b];
					c.group = c.group || this.id;
					c.itemIndex = b;
					c.checkHandler = this.checkHandler;
					c.scope = this;
					c.checked = c.checked || false;
					this.menu.items.push(c);
					if (c.checked) {
						d = c
					}
				}
				this.setActiveItem(d, true);
				Ext.CycleButton.superclass.initComponent.call(this);
				this.on("click", this.toggleSelected, this)
			},
			checkHandler : function(a, b) {
				if (b) {
					this.setActiveItem(a)
				}
			},
			toggleSelected : function() {
				this.menu.render();
				var c, a;
				for (var b = 1; b < this.itemCount; b++) {
					c = (this.activeItem.itemIndex + b) % this.itemCount;
					a = this.menu.items.itemAt(c);
					if (!a.disabled) {
						a.setChecked(true);
						break
					}
				}
			}
		});
Ext.reg("cycle", Ext.CycleButton);