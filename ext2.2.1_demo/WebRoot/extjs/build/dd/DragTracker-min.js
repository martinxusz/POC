Ext.dd.DragTracker = function(a) {
	Ext.apply(this, a);
	this.addEvents("mousedown", "mouseup", "mousemove", "dragstart", "dragend",
			"drag");
	this.dragRegion = new Ext.lib.Region(0, 0, 0, 0);
	if (this.el) {
		this.initEl(this.el)
	}
};
Ext.extend(Ext.dd.DragTracker, Ext.util.Observable, {
			active : false,
			tolerance : 5,
			autoStart : false,
			initEl : function(a) {
				this.el = Ext.get(a);
				a.on("mousedown", this.onMouseDown, this, this.delegate ? {
							delegate : this.delegate
						} : undefined)
			},
			destroy : function() {
				this.el.un("mousedown", this.onMouseDown, this)
			},
			onMouseDown : function(c, b) {
				if (this.fireEvent("mousedown", this, c) !== false
						&& this.onBeforeStart(c) !== false) {
					this.startXY = this.lastXY = c.getXY();
					this.dragTarget = this.delegate ? b : this.el.dom;
					c.preventDefault();
					var a = Ext.getDoc();
					a.on("mouseup", this.onMouseUp, this);
					a.on("mousemove", this.onMouseMove, this);
					a.on("selectstart", this.stopSelect, this);
					if (this.autoStart) {
						this.timer = this.triggerStart
								.defer(	this.autoStart === true
												? 1000
												: this.autoStart, this)
					}
				}
			},
			onMouseMove : function(d, c) {
				d.preventDefault();
				var b = d.getXY(), a = this.startXY;
				this.lastXY = b;
				if (!this.active) {
					if (Math.abs(a[0] - b[0]) > this.tolerance
							|| Math.abs(a[1] - b[1]) > this.tolerance) {
						this.triggerStart()
					} else {
						return
					}
				}
				this.fireEvent("mousemove", this, d);
				this.onDrag(d);
				this.fireEvent("drag", this, d)
			},
			onMouseUp : function(b) {
				var a = Ext.getDoc();
				a.un("mousemove", this.onMouseMove, this);
				a.un("mouseup", this.onMouseUp, this);
				a.un("selectstart", this.stopSelect, this);
				b.preventDefault();
				this.clearStart();
				this.active = false;
				delete this.elRegion;
				this.fireEvent("mouseup", this, b);
				this.onEnd(b);
				this.fireEvent("dragend", this, b)
			},
			triggerStart : function(a) {
				this.clearStart();
				this.active = true;
				this.onStart(this.startXY);
				this.fireEvent("dragstart", this, this.startXY)
			},
			clearStart : function() {
				if (this.timer) {
					clearTimeout(this.timer);
					delete this.timer
				}
			},
			stopSelect : function(a) {
				a.stopEvent();
				return false
			},
			onBeforeStart : function(a) {
			},
			onStart : function(a) {
			},
			onDrag : function(a) {
			},
			onEnd : function(a) {
			},
			getDragTarget : function() {
				return this.dragTarget
			},
			getDragCt : function() {
				return this.el
			},
			getXY : function(a) {
				return a
						? this.constrainModes[a].call(this, this.lastXY)
						: this.lastXY
			},
			getOffset : function(c) {
				var b = this.getXY(c);
				var a = this.startXY;
				return [a[0] - b[0], a[1] - b[1]]
			},
			constrainModes : {
				point : function(b) {
					if (!this.elRegion) {
						this.elRegion = this.getDragCt().getRegion()
					}
					var a = this.dragRegion;
					a.left = b[0];
					a.top = b[1];
					a.right = b[0];
					a.bottom = b[1];
					a.constrainTo(this.elRegion);
					return [a.left, a.top]
				}
			}
		});