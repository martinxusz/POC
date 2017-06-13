Ext.StatusBar = Ext.extend(Ext.Toolbar, {
			cls : "x-statusbar",
			busyIconCls : "x-status-busy",
			busyText : "Loading...",
			autoClear : 5000,
			activeThreadId : 0,
			initComponent : function() {
				if (this.statusAlign == "right") {
					this.cls += " x-status-right"
				}
				Ext.StatusBar.superclass.initComponent.call(this)
			},
			afterRender : function() {
				Ext.StatusBar.superclass.afterRender.call(this);
				var a = this.statusAlign == "right", b = Ext.get(this
						.nextBlock());
				if (a) {
					this.tr.appendChild(b.dom)
				} else {
					b.insertBefore(this.tr.firstChild)
				}
				this.statusEl = b.createChild({
							cls : "x-status-text "
									+ (this.iconCls || this.defaultIconCls || ""),
							html : this.text || this.defaultText || ""
						});
				this.statusEl.unselectable();
				this.spacerEl = b.insertSibling({
							tag : "td",
							style : "width:100%",
							cn : [{
										cls : "ytb-spacer"
									}]
						}, a ? "before" : "after")
			},
			setStatus : function(d) {
				d = d || {};
				if (typeof d == "string") {
					d = {
						text : d
					}
				}
				if (d.text !== undefined) {
					this.setText(d.text)
				}
				if (d.iconCls !== undefined) {
					this.setIcon(d.iconCls)
				}
				if (d.clear) {
					var e = d.clear, b = this.autoClear, a = {
						useDefaults : true,
						anim : true
					};
					if (typeof e == "object") {
						e = Ext.applyIf(e, a);
						if (e.wait) {
							b = e.wait
						}
					} else {
						if (typeof e == "number") {
							b = e;
							e = a
						} else {
							if (typeof e == "boolean") {
								e = a
							}
						}
					}
					e.threadId = this.activeThreadId;
					this.clearStatus.defer(b, this, [e])
				}
				return this
			},
			clearStatus : function(c) {
				c = c || {};
				if (c.threadId && c.threadId !== this.activeThreadId) {
					return this
				}
				var b = c.useDefaults ? this.defaultText : "", a = c.useDefaults
						? (this.defaultIconCls ? this.defaultIconCls : "")
						: "";
				if (c.anim) {
					this.statusEl.fadeOut({
								remove : false,
								useDisplay : true,
								scope : this,
								callback : function() {
									this.setStatus({
												text : b,
												iconCls : a
											});
									this.statusEl.show()
								}
							})
				} else {
					this.statusEl.hide();
					this.setStatus({
								text : b,
								iconCls : a
							});
					this.statusEl.show()
				}
				return this
			},
			setText : function(a) {
				this.activeThreadId++;
				this.text = a || "";
				if (this.rendered) {
					this.statusEl.update(this.text)
				}
				return this
			},
			getText : function() {
				return this.text
			},
			setIcon : function(a) {
				this.activeThreadId++;
				a = a || "";
				if (this.rendered) {
					if (this.currIconCls) {
						this.statusEl.removeClass(this.currIconCls);
						this.currIconCls = null
					}
					if (a.length > 0) {
						this.statusEl.addClass(a);
						this.currIconCls = a
					}
				} else {
					this.currIconCls = a
				}
				return this
			},
			showBusy : function(a) {
				if (typeof a == "string") {
					a = {
						text : a
					}
				}
				a = Ext.applyIf(a || {}, {
							text : this.busyText,
							iconCls : this.busyIconCls
						});
				return this.setStatus(a)
			}
		});
Ext.reg("statusbar", Ext.StatusBar);