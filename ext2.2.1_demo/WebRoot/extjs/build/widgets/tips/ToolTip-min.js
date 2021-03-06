Ext.ToolTip = Ext.extend(Ext.Tip, {
			showDelay : 500,
			hideDelay : 200,
			dismissDelay : 5000,
			mouseOffset : [15, 18],
			trackMouse : false,
			constrainPosition : true,
			initComponent : function() {
				Ext.ToolTip.superclass.initComponent.call(this);
				this.lastActive = new Date();
				this.initTarget()
			},
			initTarget : function() {
				if (this.target) {
					this.target = Ext.get(this.target);
					this.target.on("mouseover", this.onTargetOver, this);
					this.target.on("mouseout", this.onTargetOut, this);
					this.target.on("mousemove", this.onMouseMove, this)
				}
			},
			onMouseMove : function(a) {
				this.targetXY = a.getXY();
				if (!this.hidden && this.trackMouse) {
					this.setPagePosition(this.getTargetXY())
				}
			},
			getTargetXY : function() {
				return [this.targetXY[0] + this.mouseOffset[0],
						this.targetXY[1] + this.mouseOffset[1]]
			},
			onTargetOver : function(a) {
				if (this.disabled || a.within(this.target.dom, true)) {
					return
				}
				this.clearTimer("hide");
				this.targetXY = a.getXY();
				this.delayShow()
			},
			delayShow : function() {
				if (this.hidden && !this.showTimer) {
					if (this.lastActive.getElapsed() < this.quickShowInterval) {
						this.show()
					} else {
						this.showTimer = this.show.defer(this.showDelay, this)
					}
				} else {
					if (!this.hidden && this.autoHide !== false) {
						this.show()
					}
				}
			},
			onTargetOut : function(a) {
				if (this.disabled || a.within(this.target.dom, true)) {
					return
				}
				this.clearTimer("show");
				if (this.autoHide !== false) {
					this.delayHide()
				}
			},
			delayHide : function() {
				if (!this.hidden && !this.hideTimer) {
					this.hideTimer = this.hide.defer(this.hideDelay, this)
				}
			},
			hide : function() {
				this.clearTimer("dismiss");
				this.lastActive = new Date();
				Ext.ToolTip.superclass.hide.call(this)
			},
			show : function() {
				this.showAt(this.getTargetXY())
			},
			showAt : function(a) {
				this.lastActive = new Date();
				this.clearTimers();
				Ext.ToolTip.superclass.showAt.call(this, a);
				if (this.dismissDelay && this.autoHide !== false) {
					this.dismissTimer = this.hide
							.defer(this.dismissDelay, this)
				}
			},
			clearTimer : function(a) {
				a = a + "Timer";
				clearTimeout(this[a]);
				delete this[a]
			},
			clearTimers : function() {
				this.clearTimer("show");
				this.clearTimer("dismiss");
				this.clearTimer("hide")
			},
			onShow : function() {
				Ext.ToolTip.superclass.onShow.call(this);
				Ext.getDoc().on("mousedown", this.onDocMouseDown, this)
			},
			onHide : function() {
				Ext.ToolTip.superclass.onHide.call(this);
				Ext.getDoc().un("mousedown", this.onDocMouseDown, this)
			},
			onDocMouseDown : function(a) {
				if (this.autoHide !== false && !a.within(this.el.dom)) {
					this.disable();
					this.enable.defer(100, this)
				}
			},
			onDisable : function() {
				this.clearTimers();
				this.hide()
			},
			adjustPosition : function(a, d) {
				var c = this.targetXY[1], b = this.getSize().height;
				if (this.constrainPosition && d <= c && (d + b) >= c) {
					d = c - b - 5
				}
				return {
					x : a,
					y : d
				}
			},
			onDestroy : function() {
				Ext.ToolTip.superclass.onDestroy.call(this);
				if (this.target) {
					this.target.un("mouseover", this.onTargetOver, this);
					this.target.un("mouseout", this.onTargetOut, this);
					this.target.un("mousemove", this.onMouseMove, this)
				}
			}
		});