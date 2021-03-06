Ext.BoxComponent = Ext.extend(Ext.Component, {
			initComponent : function() {
				Ext.BoxComponent.superclass.initComponent.call(this);
				this.addEvents("resize", "move")
			},
			boxReady : false,
			deferHeight : false,
			setSize : function(b, d) {
				if (typeof b == "object") {
					d = b.height;
					b = b.width
				}
				if (!this.boxReady) {
					this.width = b;
					this.height = d;
					return this
				}
				if (this.lastSize && this.lastSize.width == b
						&& this.lastSize.height == d) {
					return this
				}
				this.lastSize = {
					width : b,
					height : d
				};
				var c = this.adjustSize(b, d);
				var f = c.width, a = c.height;
				if (f !== undefined || a !== undefined) {
					var e = this.getResizeEl();
					if (!this.deferHeight && f !== undefined && a !== undefined) {
						e.setSize(f, a)
					} else {
						if (!this.deferHeight && a !== undefined) {
							e.setHeight(a)
						} else {
							if (f !== undefined) {
								e.setWidth(f)
							}
						}
					}
					this.onResize(f, a, b, d);
					this.fireEvent("resize", this, f, a, b, d)
				}
				return this
			},
			setWidth : function(a) {
				return this.setSize(a)
			},
			setHeight : function(a) {
				return this.setSize(undefined, a)
			},
			getSize : function() {
				return this.el.getSize()
			},
			getPosition : function(a) {
				if (a === true) {
					return [this.el.getLeft(true), this.el.getTop(true)]
				}
				return this.xy || this.el.getXY()
			},
			getBox : function(a) {
				var b = this.el.getSize();
				if (a === true) {
					b.x = this.el.getLeft(true);
					b.y = this.el.getTop(true)
				} else {
					var c = this.xy || this.el.getXY();
					b.x = c[0];
					b.y = c[1]
				}
				return b
			},
			updateBox : function(a) {
				this.setSize(a.width, a.height);
				this.setPagePosition(a.x, a.y);
				return this
			},
			getResizeEl : function() {
				return this.resizeEl || this.el
			},
			getPositionEl : function() {
				return this.positionEl || this.el
			},
			setPosition : function(a, f) {
				if (a && typeof a[1] == "number") {
					f = a[1];
					a = a[0]
				}
				this.x = a;
				this.y = f;
				if (!this.boxReady) {
					return this
				}
				var b = this.adjustPosition(a, f);
				var e = b.x, d = b.y;
				var c = this.getPositionEl();
				if (e !== undefined || d !== undefined) {
					if (e !== undefined && d !== undefined) {
						c.setLeftTop(e, d)
					} else {
						if (e !== undefined) {
							c.setLeft(e)
						} else {
							if (d !== undefined) {
								c.setTop(d)
							}
						}
					}
					this.onPosition(e, d);
					this.fireEvent("move", this, e, d)
				}
				return this
			},
			setPagePosition : function(a, c) {
				if (a && typeof a[1] == "number") {
					c = a[1];
					a = a[0]
				}
				this.pageX = a;
				this.pageY = c;
				if (!this.boxReady) {
					return
				}
				if (a === undefined || c === undefined) {
					return
				}
				var b = this.el.translatePoints(a, c);
				this.setPosition(b.left, b.top);
				return this
			},
			onRender : function(b, a) {
				Ext.BoxComponent.superclass.onRender.call(this, b, a);
				if (this.resizeEl) {
					this.resizeEl = Ext.get(this.resizeEl)
				}
				if (this.positionEl) {
					this.positionEl = Ext.get(this.positionEl)
				}
			},
			afterRender : function() {
				Ext.BoxComponent.superclass.afterRender.call(this);
				this.boxReady = true;
				this.setSize(this.width, this.height);
				if (this.x || this.y) {
					this.setPosition(this.x, this.y)
				} else {
					if (this.pageX || this.pageY) {
						this.setPagePosition(this.pageX, this.pageY)
					}
				}
			},
			syncSize : function() {
				delete this.lastSize;
				this.setSize(this.autoWidth ? undefined : this.el.getWidth(),
						this.autoHeight ? undefined : this.el.getHeight());
				return this
			},
			onResize : function(d, b, a, c) {
			},
			onPosition : function(a, b) {
			},
			adjustSize : function(a, b) {
				if (this.autoWidth) {
					a = "auto"
				}
				if (this.autoHeight) {
					b = "auto"
				}
				return {
					width : a,
					height : b
				}
			},
			adjustPosition : function(a, b) {
				return {
					x : a,
					y : b
				}
			}
		});
Ext.reg("box", Ext.BoxComponent);