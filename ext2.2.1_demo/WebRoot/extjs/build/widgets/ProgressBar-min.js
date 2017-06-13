Ext.ProgressBar = Ext.extend(Ext.BoxComponent, {
			baseCls : "x-progress",
			animate : false,
			waitTimer : null,
			initComponent : function() {
				Ext.ProgressBar.superclass.initComponent.call(this);
				this.addEvents("update")
			},
			onRender : function(d, a) {
				Ext.ProgressBar.superclass.onRender.call(this, d, a);
				var c = new Ext.Template('<div class="{cls}-wrap">',
						'<div class="{cls}-inner">', '<div class="{cls}-bar">',
						'<div class="{cls}-text">', "<div>&#160;</div>",
						"</div>", "</div>",
						'<div class="{cls}-text {cls}-text-back">',
						"<div>&#160;</div>", "</div>", "</div>", "</div>");
				if (a) {
					this.el = c.insertBefore(a, {
								cls : this.baseCls
							}, true)
				} else {
					this.el = c.append(d, {
								cls : this.baseCls
							}, true)
				}
				if (this.id) {
					this.el.dom.id = this.id
				}
				var b = this.el.dom.firstChild;
				this.progressBar = Ext.get(b.firstChild);
				if (this.textEl) {
					this.textEl = Ext.get(this.textEl);
					delete this.textTopEl
				} else {
					this.textTopEl = Ext.get(this.progressBar.dom.firstChild);
					var e = Ext.get(b.childNodes[1]);
					this.textTopEl.setStyle("z-index", 99).addClass("x-hidden");
					this.textEl = new Ext.CompositeElement([
							this.textTopEl.dom.firstChild, e.dom.firstChild]);
					this.textEl.setWidth(b.offsetWidth)
				}
				this.progressBar.setHeight(b.offsetHeight)
			},
			afterRender : function() {
				Ext.ProgressBar.superclass.afterRender.call(this);
				if (this.value) {
					this.updateProgress(this.value, this.text)
				} else {
					this.updateText(this.text)
				}
			},
			updateProgress : function(c, d, b) {
				this.value = c || 0;
				if (d) {
					this.updateText(d)
				}
				if (this.rendered) {
					var a = Math.floor(c * this.el.dom.firstChild.offsetWidth);
					this.progressBar.setWidth(a, b === true
									|| (b !== false && this.animate));
					if (this.textTopEl) {
						this.textTopEl.removeClass("x-hidden").setWidth(a)
					}
				}
				this.fireEvent("update", this, c, d);
				return this
			},
			wait : function(b) {
				if (!this.waitTimer) {
					var a = this;
					b = b || {};
					this.updateText(b.text);
					this.waitTimer = Ext.TaskMgr.start({
								run : function(c) {
									var d = b.increment || 10;
									this.updateProgress(
											((((c + d) % d) + 1) * (100 / d))
													* 0.01, null, b.animate)
								},
								interval : b.interval || 1000,
								duration : b.duration,
								onStop : function() {
									if (b.fn) {
										b.fn.apply(b.scope || this)
									}
									this.reset()
								},
								scope : a
							})
				}
				return this
			},
			isWaiting : function() {
				return this.waitTimer != null
			},
			updateText : function(a) {
				this.text = a || "&#160;";
				if (this.rendered) {
					this.textEl.update(this.text)
				}
				return this
			},
			syncProgressBar : function() {
				if (this.value) {
					this.updateProgress(this.value, this.text)
				}
				return this
			},
			setSize : function(a, c) {
				Ext.ProgressBar.superclass.setSize.call(this, a, c);
				if (this.textTopEl) {
					var b = this.el.dom.firstChild;
					this.textEl.setSize(b.offsetWidth, b.offsetHeight)
				}
				this.syncProgressBar();
				return this
			},
			reset : function(a) {
				this.updateProgress(0);
				if (this.textTopEl) {
					this.textTopEl.addClass("x-hidden")
				}
				if (this.waitTimer) {
					this.waitTimer.onStop = null;
					Ext.TaskMgr.stop(this.waitTimer);
					this.waitTimer = null
				}
				if (a === true) {
					this.hide()
				}
				return this
			}
		});
Ext.reg("progress", Ext.ProgressBar);