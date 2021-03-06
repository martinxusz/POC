(function() {
	var a = Ext.EventManager;
	var b = Ext.lib.Dom;
	Ext.dd.DragDrop = function(e, c, d) {
		if (e) {
			this.init(e, c, d)
		}
	};
	Ext.dd.DragDrop.prototype = {
		id : null,
		config : null,
		dragElId : null,
		handleElId : null,
		invalidHandleTypes : null,
		invalidHandleIds : null,
		invalidHandleClasses : null,
		startPageX : 0,
		startPageY : 0,
		groups : null,
		locked : false,
		lock : function() {
			this.locked = true
		},
		moveOnly : false,
		unlock : function() {
			this.locked = false
		},
		isTarget : true,
		padding : null,
		_domRef : null,
		__ygDragDrop : true,
		constrainX : false,
		constrainY : false,
		minX : 0,
		maxX : 0,
		minY : 0,
		maxY : 0,
		maintainOffset : false,
		xTicks : null,
		yTicks : null,
		primaryButtonOnly : true,
		available : false,
		hasOuterHandles : false,
		b4StartDrag : function(c, d) {
		},
		startDrag : function(c, d) {
		},
		b4Drag : function(c) {
		},
		onDrag : function(c) {
		},
		onDragEnter : function(c, d) {
		},
		b4DragOver : function(c) {
		},
		onDragOver : function(c, d) {
		},
		b4DragOut : function(c) {
		},
		onDragOut : function(c, d) {
		},
		b4DragDrop : function(c) {
		},
		onDragDrop : function(c, d) {
		},
		onInvalidDrop : function(c) {
		},
		b4EndDrag : function(c) {
		},
		endDrag : function(c) {
		},
		b4MouseDown : function(c) {
		},
		onMouseDown : function(c) {
		},
		onMouseUp : function(c) {
		},
		onAvailable : function() {
		},
		defaultPadding : {
			left : 0,
			right : 0,
			top : 0,
			bottom : 0
		},
		constrainTo : function(i, g, o) {
			if (typeof g == "number") {
				g = {
					left : g,
					right : g,
					top : g,
					bottom : g
				}
			}
			g = g || this.defaultPadding;
			var l = Ext.get(this.getEl()).getBox();
			var d = Ext.get(i);
			var n = d.getScroll();
			var k, e = d.dom;
			if (e == document.body) {
				k = {
					x : n.left,
					y : n.top,
					width : Ext.lib.Dom.getViewWidth(),
					height : Ext.lib.Dom.getViewHeight()
				}
			} else {
				var m = d.getXY();
				k = {
					x : m[0] + n.left,
					y : m[1] + n.top,
					width : e.clientWidth,
					height : e.clientHeight
				}
			}
			var h = l.y - k.y;
			var f = l.x - k.x;
			this.resetConstraints();
			this.setXConstraint(f - (g.left || 0), k.width - f - l.width
							- (g.right || 0), this.xTickSize);
			this.setYConstraint(h - (g.top || 0), k.height - h - l.height
							- (g.bottom || 0), this.yTickSize)
		},
		getEl : function() {
			if (!this._domRef) {
				this._domRef = Ext.getDom(this.id)
			}
			return this._domRef
		},
		getDragEl : function() {
			return Ext.getDom(this.dragElId)
		},
		init : function(e, c, d) {
			this.initTarget(e, c, d);
			a.on(this.id, "mousedown", this.handleMouseDown, this)
		},
		initTarget : function(e, c, d) {
			this.config = d || {};
			this.DDM = Ext.dd.DDM;
			this.groups = {};
			if (typeof e !== "string") {
				e = Ext.id(e)
			}
			this.id = e;
			this.addToGroup((c) ? c : "default");
			this.handleElId = e;
			this.setDragElId(e);
			this.invalidHandleTypes = {
				A : "A"
			};
			this.invalidHandleIds = {};
			this.invalidHandleClasses = [];
			this.applyConfig();
			this.handleOnAvailable()
		},
		applyConfig : function() {
			this.padding = this.config.padding || [0, 0, 0, 0];
			this.isTarget = (this.config.isTarget !== false);
			this.maintainOffset = (this.config.maintainOffset);
			this.primaryButtonOnly = (this.config.primaryButtonOnly !== false)
		},
		handleOnAvailable : function() {
			this.available = true;
			this.resetConstraints();
			this.onAvailable()
		},
		setPadding : function(e, c, f, d) {
			if (!c && 0 !== c) {
				this.padding = [e, e, e, e]
			} else {
				if (!f && 0 !== f) {
					this.padding = [e, c, e, c]
				} else {
					this.padding = [e, c, f, d]
				}
			}
		},
		setInitPosition : function(f, e) {
			var g = this.getEl();
			if (!this.DDM.verifyEl(g)) {
				return
			}
			var d = f || 0;
			var c = e || 0;
			var h = b.getXY(g);
			this.initPageX = h[0] - d;
			this.initPageY = h[1] - c;
			this.lastPageX = h[0];
			this.lastPageY = h[1];
			this.setStartPosition(h)
		},
		setStartPosition : function(d) {
			var c = d || b.getXY(this.getEl());
			this.deltaSetXY = null;
			this.startPageX = c[0];
			this.startPageY = c[1]
		},
		addToGroup : function(c) {
			this.groups[c] = true;
			this.DDM.regDragDrop(this, c)
		},
		removeFromGroup : function(c) {
			if (this.groups[c]) {
				delete this.groups[c]
			}
			this.DDM.removeDDFromGroup(this, c)
		},
		setDragElId : function(c) {
			this.dragElId = c
		},
		setHandleElId : function(c) {
			if (typeof c !== "string") {
				c = Ext.id(c)
			}
			this.handleElId = c;
			this.DDM.regHandle(this.id, c)
		},
		setOuterHandleElId : function(c) {
			if (typeof c !== "string") {
				c = Ext.id(c)
			}
			a.on(c, "mousedown", this.handleMouseDown, this);
			this.setHandleElId(c);
			this.hasOuterHandles = true
		},
		unreg : function() {
			a.un(this.id, "mousedown", this.handleMouseDown);
			this._domRef = null;
			this.DDM._remove(this)
		},
		destroy : function() {
			this.unreg()
		},
		isLocked : function() {
			return (this.DDM.isLocked() || this.locked)
		},
		handleMouseDown : function(f, d) {
			if (this.primaryButtonOnly && f.button != 0) {
				return
			}
			if (this.isLocked()) {
				return
			}
			this.DDM.refreshCache(this.groups);
			var c = new Ext.lib.Point(Ext.lib.Event.getPageX(f), Ext.lib.Event
							.getPageY(f));
			if (!this.hasOuterHandles && !this.DDM.isOverTarget(c, this)) {
			} else {
				if (this.clickValidator(f)) {
					this.setStartPosition();
					this.b4MouseDown(f);
					this.onMouseDown(f);
					this.DDM.handleMouseDown(f, this);
					this.DDM.stopEvent(f)
				} else {
				}
			}
		},
		clickValidator : function(d) {
			var c = d.getTarget();
			return (this.isValidHandleChild(c) && (this.id == this.handleElId || this.DDM
					.handleWasClicked(c, this.id)))
		},
		addInvalidHandleType : function(c) {
			var d = c.toUpperCase();
			this.invalidHandleTypes[d] = d
		},
		addInvalidHandleId : function(c) {
			if (typeof c !== "string") {
				c = Ext.id(c)
			}
			this.invalidHandleIds[c] = c
		},
		addInvalidHandleClass : function(c) {
			this.invalidHandleClasses.push(c)
		},
		removeInvalidHandleType : function(c) {
			var d = c.toUpperCase();
			delete this.invalidHandleTypes[d]
		},
		removeInvalidHandleId : function(c) {
			if (typeof c !== "string") {
				c = Ext.id(c)
			}
			delete this.invalidHandleIds[c]
		},
		removeInvalidHandleClass : function(d) {
			for (var e = 0, c = this.invalidHandleClasses.length; e < c; ++e) {
				if (this.invalidHandleClasses[e] == d) {
					delete this.invalidHandleClasses[e]
				}
			}
		},
		isValidHandleChild : function(g) {
			var f = true;
			var k;
			try {
				k = g.nodeName.toUpperCase()
			} catch (h) {
				k = g.nodeName
			}
			f = f && !this.invalidHandleTypes[k];
			f = f && !this.invalidHandleIds[g.id];
			for (var d = 0, c = this.invalidHandleClasses.length; f && d < c; ++d) {
				f = !Ext.fly(g).hasClass(this.invalidHandleClasses[d])
			}
			return f
		},
		setXTicks : function(f, c) {
			this.xTicks = [];
			this.xTickSize = c;
			var e = {};
			for (var d = this.initPageX; d >= this.minX; d = d - c) {
				if (!e[d]) {
					this.xTicks[this.xTicks.length] = d;
					e[d] = true
				}
			}
			for (d = this.initPageX; d <= this.maxX; d = d + c) {
				if (!e[d]) {
					this.xTicks[this.xTicks.length] = d;
					e[d] = true
				}
			}
			this.xTicks.sort(this.DDM.numericSort)
		},
		setYTicks : function(f, c) {
			this.yTicks = [];
			this.yTickSize = c;
			var e = {};
			for (var d = this.initPageY; d >= this.minY; d = d - c) {
				if (!e[d]) {
					this.yTicks[this.yTicks.length] = d;
					e[d] = true
				}
			}
			for (d = this.initPageY; d <= this.maxY; d = d + c) {
				if (!e[d]) {
					this.yTicks[this.yTicks.length] = d;
					e[d] = true
				}
			}
			this.yTicks.sort(this.DDM.numericSort)
		},
		setXConstraint : function(e, d, c) {
			this.leftConstraint = e;
			this.rightConstraint = d;
			this.minX = this.initPageX - e;
			this.maxX = this.initPageX + d;
			if (c) {
				this.setXTicks(this.initPageX, c)
			}
			this.constrainX = true
		},
		clearConstraints : function() {
			this.constrainX = false;
			this.constrainY = false;
			this.clearTicks()
		},
		clearTicks : function() {
			this.xTicks = null;
			this.yTicks = null;
			this.xTickSize = 0;
			this.yTickSize = 0
		},
		setYConstraint : function(c, e, d) {
			this.topConstraint = c;
			this.bottomConstraint = e;
			this.minY = this.initPageY - c;
			this.maxY = this.initPageY + e;
			if (d) {
				this.setYTicks(this.initPageY, d)
			}
			this.constrainY = true
		},
		resetConstraints : function() {
			if (this.initPageX || this.initPageX === 0) {
				var d = (this.maintainOffset)
						? this.lastPageX - this.initPageX
						: 0;
				var c = (this.maintainOffset)
						? this.lastPageY - this.initPageY
						: 0;
				this.setInitPosition(d, c)
			} else {
				this.setInitPosition()
			}
			if (this.constrainX) {
				this.setXConstraint(this.leftConstraint, this.rightConstraint,
						this.xTickSize)
			}
			if (this.constrainY) {
				this.setYConstraint(this.topConstraint, this.bottomConstraint,
						this.yTickSize)
			}
		},
		getTick : function(k, f) {
			if (!f) {
				return k
			} else {
				if (f[0] >= k) {
					return f[0]
				} else {
					for (var d = 0, c = f.length; d < c; ++d) {
						var e = d + 1;
						if (f[e] && f[e] >= k) {
							var h = k - f[d];
							var g = f[e] - k;
							return (g > h) ? f[d] : f[e]
						}
					}
					return f[f.length - 1]
				}
			}
		},
		toString : function() {
			return ("DragDrop " + this.id)
		}
	}
})();
if (!Ext.dd.DragDropMgr) {
	Ext.dd.DragDropMgr = function() {
		var a = Ext.EventManager;
		return {
			ids : {},
			handleIds : {},
			dragCurrent : null,
			dragOvers : {},
			deltaX : 0,
			deltaY : 0,
			preventDefault : true,
			stopPropagation : true,
			initialized : false,
			locked : false,
			init : function() {
				this.initialized = true
			},
			POINT : 0,
			INTERSECT : 1,
			mode : 0,
			_execOnAll : function(d, c) {
				for (var e in this.ids) {
					for (var b in this.ids[e]) {
						var f = this.ids[e][b];
						if (!this.isTypeOfDD(f)) {
							continue
						}
						f[d].apply(f, c)
					}
				}
			},
			_onLoad : function() {
				this.init();
				a.on(document, "mouseup", this.handleMouseUp, this, true);
				a.on(document, "mousemove", this.handleMouseMove, this, true);
				a.on(window, "unload", this._onUnload, this, true);
				a.on(window, "resize", this._onResize, this, true)
			},
			_onResize : function(b) {
				this._execOnAll("resetConstraints", [])
			},
			lock : function() {
				this.locked = true
			},
			unlock : function() {
				this.locked = false
			},
			isLocked : function() {
				return this.locked
			},
			locationCache : {},
			useCache : true,
			clickPixelThresh : 3,
			clickTimeThresh : 350,
			dragThreshMet : false,
			clickTimeout : null,
			startX : 0,
			startY : 0,
			regDragDrop : function(c, b) {
				if (!this.initialized) {
					this.init()
				}
				if (!this.ids[b]) {
					this.ids[b] = {}
				}
				this.ids[b][c.id] = c
			},
			removeDDFromGroup : function(d, b) {
				if (!this.ids[b]) {
					this.ids[b] = {}
				}
				var c = this.ids[b];
				if (c && c[d.id]) {
					delete c[d.id]
				}
			},
			_remove : function(c) {
				for (var b in c.groups) {
					if (b && this.ids[b] && this.ids[b][c.id]) {
						delete this.ids[b][c.id]
					}
				}
				delete this.handleIds[c.id]
			},
			regHandle : function(c, b) {
				if (!this.handleIds[c]) {
					this.handleIds[c] = {}
				}
				this.handleIds[c][b] = b
			},
			isDragDrop : function(b) {
				return (this.getDDById(b)) ? true : false
			},
			getRelated : function(f, c) {
				var e = [];
				for (var d in f.groups) {
					for (j in this.ids[d]) {
						var b = this.ids[d][j];
						if (!this.isTypeOfDD(b)) {
							continue
						}
						if (!c || b.isTarget) {
							e[e.length] = b
						}
					}
				}
				return e
			},
			isLegalTarget : function(f, e) {
				var c = this.getRelated(f, true);
				for (var d = 0, b = c.length; d < b; ++d) {
					if (c[d].id == e.id) {
						return true
					}
				}
				return false
			},
			isTypeOfDD : function(b) {
				return (b && b.__ygDragDrop)
			},
			isHandle : function(c, b) {
				return (this.handleIds[c] && this.handleIds[c][b])
			},
			getDDById : function(c) {
				for (var b in this.ids) {
					if (this.ids[b][c]) {
						return this.ids[b][c]
					}
				}
				return null
			},
			handleMouseDown : function(d, c) {
				if (Ext.QuickTips) {
					Ext.QuickTips.disable()
				}
				if (this.dragCurrent) {
					this.handleMouseUp(d)
				}
				this.currentTarget = d.getTarget();
				this.dragCurrent = c;
				var b = c.getEl();
				this.startX = d.getPageX();
				this.startY = d.getPageY();
				this.deltaX = this.startX - b.offsetLeft;
				this.deltaY = this.startY - b.offsetTop;
				this.dragThreshMet = false;
				this.clickTimeout = setTimeout(function() {
							var e = Ext.dd.DDM;
							e.startDrag(e.startX, e.startY)
						}, this.clickTimeThresh)
			},
			startDrag : function(b, c) {
				clearTimeout(this.clickTimeout);
				if (this.dragCurrent) {
					this.dragCurrent.b4StartDrag(b, c);
					this.dragCurrent.startDrag(b, c)
				}
				this.dragThreshMet = true
			},
			handleMouseUp : function(b) {
				if (Ext.QuickTips) {
					Ext.QuickTips.enable()
				}
				if (!this.dragCurrent) {
					return
				}
				clearTimeout(this.clickTimeout);
				if (this.dragThreshMet) {
					this.fireEvents(b, true)
				} else {
				}
				this.stopDrag(b);
				this.stopEvent(b)
			},
			stopEvent : function(b) {
				if (this.stopPropagation) {
					b.stopPropagation()
				}
				if (this.preventDefault) {
					b.preventDefault()
				}
			},
			stopDrag : function(b) {
				if (this.dragCurrent) {
					if (this.dragThreshMet) {
						this.dragCurrent.b4EndDrag(b);
						this.dragCurrent.endDrag(b)
					}
					this.dragCurrent.onMouseUp(b)
				}
				this.dragCurrent = null;
				this.dragOvers = {}
			},
			handleMouseMove : function(d) {
				if (!this.dragCurrent) {
					return true
				}
				if (Ext.isIE
						&& (d.button !== 0 && d.button !== 1 && d.button !== 2)) {
					this.stopEvent(d);
					return this.handleMouseUp(d)
				}
				if (!this.dragThreshMet) {
					var c = Math.abs(this.startX - d.getPageX());
					var b = Math.abs(this.startY - d.getPageY());
					if (c > this.clickPixelThresh || b > this.clickPixelThresh) {
						this.startDrag(this.startX, this.startY)
					}
				}
				if (this.dragThreshMet) {
					this.dragCurrent.b4Drag(d);
					this.dragCurrent.onDrag(d);
					if (!this.dragCurrent.moveOnly) {
						this.fireEvents(d, false)
					}
				}
				this.stopEvent(d);
				return true
			},
			fireEvents : function(n, o) {
				var q = this.dragCurrent;
				if (!q || q.isLocked()) {
					return
				}
				var r = n.getPoint();
				var b = [];
				var f = [];
				var l = [];
				var h = [];
				var d = [];
				for (var g in this.dragOvers) {
					var c = this.dragOvers[g];
					if (!this.isTypeOfDD(c)) {
						continue
					}
					if (!this.isOverTarget(r, c, this.mode)) {
						f.push(c)
					}
					b[g] = true;
					delete this.dragOvers[g]
				}
				for (var p in q.groups) {
					if ("string" != typeof p) {
						continue
					}
					for (g in this.ids[p]) {
						var k = this.ids[p][g];
						if (!this.isTypeOfDD(k)) {
							continue
						}
						if (k.isTarget && !k.isLocked() && k != q) {
							if (this.isOverTarget(r, k, this.mode)) {
								if (o) {
									h.push(k)
								} else {
									if (!b[k.id]) {
										d.push(k)
									} else {
										l.push(k)
									}
									this.dragOvers[k.id] = k
								}
							}
						}
					}
				}
				if (this.mode) {
					if (f.length) {
						q.b4DragOut(n, f);
						q.onDragOut(n, f)
					}
					if (d.length) {
						q.onDragEnter(n, d)
					}
					if (l.length) {
						q.b4DragOver(n, l);
						q.onDragOver(n, l)
					}
					if (h.length) {
						q.b4DragDrop(n, h);
						q.onDragDrop(n, h)
					}
				} else {
					var m = 0;
					for (g = 0, m = f.length; g < m; ++g) {
						q.b4DragOut(n, f[g].id);
						q.onDragOut(n, f[g].id)
					}
					for (g = 0, m = d.length; g < m; ++g) {
						q.onDragEnter(n, d[g].id)
					}
					for (g = 0, m = l.length; g < m; ++g) {
						q.b4DragOver(n, l[g].id);
						q.onDragOver(n, l[g].id)
					}
					for (g = 0, m = h.length; g < m; ++g) {
						q.b4DragDrop(n, h[g].id);
						q.onDragDrop(n, h[g].id)
					}
				}
				if (o && !h.length) {
					q.onInvalidDrop(n)
				}
			},
			getBestMatch : function(d) {
				var f = null;
				var c = d.length;
				if (c == 1) {
					f = d[0]
				} else {
					for (var e = 0; e < c; ++e) {
						var b = d[e];
						if (b.cursorIsOver) {
							f = b;
							break
						} else {
							if (!f || f.overlap.getArea() < b.overlap.getArea()) {
								f = b
							}
						}
					}
				}
				return f
			},
			refreshCache : function(c) {
				for (var b in c) {
					if ("string" != typeof b) {
						continue
					}
					for (var d in this.ids[b]) {
						var e = this.ids[b][d];
						if (this.isTypeOfDD(e)) {
							var f = this.getLocation(e);
							if (f) {
								this.locationCache[e.id] = f
							} else {
								delete this.locationCache[e.id]
							}
						}
					}
				}
			},
			verifyEl : function(c) {
				if (c) {
					var b;
					if (Ext.isIE) {
						try {
							b = c.offsetParent
						} catch (d) {
						}
					} else {
						b = c.offsetParent
					}
					if (b) {
						return true
					}
				}
				return false
			},
			getLocation : function(i) {
				if (!this.isTypeOfDD(i)) {
					return null
				}
				var g = i.getEl(), n, f, d, p, o, q, c, m, h;
				try {
					n = Ext.lib.Dom.getXY(g)
				} catch (k) {
				}
				if (!n) {
					return null
				}
				f = n[0];
				d = f + g.offsetWidth;
				p = n[1];
				o = p + g.offsetHeight;
				q = p - i.padding[0];
				c = d + i.padding[1];
				m = o + i.padding[2];
				h = f - i.padding[3];
				return new Ext.lib.Region(q, c, m, h)
			},
			isOverTarget : function(k, b, d) {
				var f = this.locationCache[b.id];
				if (!f || !this.useCache) {
					f = this.getLocation(b);
					this.locationCache[b.id] = f
				}
				if (!f) {
					return false
				}
				b.cursorIsOver = f.contains(k);
				var i = this.dragCurrent;
				if (!i || !i.getTargetCoord
						|| (!d && !i.constrainX && !i.constrainY)) {
					return b.cursorIsOver
				}
				b.overlap = null;
				var g = i.getTargetCoord(k.x, k.y);
				var c = i.getDragEl();
				var e = new Ext.lib.Region(g.y, g.x + c.offsetWidth, g.y
								+ c.offsetHeight, g.x);
				var h = e.intersect(f);
				if (h) {
					b.overlap = h;
					return (d) ? true : b.cursorIsOver
				} else {
					return false
				}
			},
			_onUnload : function(c, b) {
				Ext.dd.DragDropMgr.unregAll()
			},
			unregAll : function() {
				if (this.dragCurrent) {
					this.stopDrag();
					this.dragCurrent = null
				}
				this._execOnAll("unreg", []);
				for (var b in this.elementCache) {
					delete this.elementCache[b]
				}
				this.elementCache = {};
				this.ids = {}
			},
			elementCache : {},
			getElWrapper : function(c) {
				var b = this.elementCache[c];
				if (!b || !b.el) {
					b = this.elementCache[c] = new this.ElementWrapper(Ext
							.getDom(c))
				}
				return b
			},
			getElement : function(b) {
				return Ext.getDom(b)
			},
			getCss : function(c) {
				var b = Ext.getDom(c);
				return (b) ? b.style : null
			},
			ElementWrapper : function(b) {
				this.el = b || null;
				this.id = this.el && b.id;
				this.css = this.el && b.style
			},
			getPosX : function(b) {
				return Ext.lib.Dom.getX(b)
			},
			getPosY : function(b) {
				return Ext.lib.Dom.getY(b)
			},
			swapNode : function(d, b) {
				if (d.swapNode) {
					d.swapNode(b)
				} else {
					var e = b.parentNode;
					var c = b.nextSibling;
					if (c == d) {
						e.insertBefore(d, b)
					} else {
						if (b == d.nextSibling) {
							e.insertBefore(b, d)
						} else {
							d.parentNode.replaceChild(b, d);
							e.insertBefore(d, c)
						}
					}
				}
			},
			getScroll : function() {
				var d, b, e = document.documentElement, c = document.body;
				if (e && (e.scrollTop || e.scrollLeft)) {
					d = e.scrollTop;
					b = e.scrollLeft
				} else {
					if (c) {
						d = c.scrollTop;
						b = c.scrollLeft
					} else {
					}
				}
				return {
					top : d,
					left : b
				}
			},
			getStyle : function(c, b) {
				return Ext.fly(c).getStyle(b)
			},
			getScrollTop : function() {
				return this.getScroll().top
			},
			getScrollLeft : function() {
				return this.getScroll().left
			},
			moveToEl : function(b, d) {
				var c = Ext.lib.Dom.getXY(d);
				Ext.lib.Dom.setXY(b, c)
			},
			numericSort : function(d, c) {
				return (d - c)
			},
			_timeoutCount : 0,
			_addListeners : function() {
				var b = Ext.dd.DDM;
				if (Ext.lib.Event && document) {
					b._onLoad()
				} else {
					if (b._timeoutCount > 2000) {
					} else {
						setTimeout(b._addListeners, 10);
						if (document && document.body) {
							b._timeoutCount += 1
						}
					}
				}
			},
			handleWasClicked : function(b, d) {
				if (this.isHandle(d, b.id)) {
					return true
				} else {
					var c = b.parentNode;
					while (c) {
						if (this.isHandle(d, c.id)) {
							return true
						} else {
							c = c.parentNode
						}
					}
				}
				return false
			}
		}
	}();
	Ext.dd.DDM = Ext.dd.DragDropMgr;
	Ext.dd.DDM._addListeners()
}
Ext.dd.DD = function(c, a, b) {
	if (c) {
		this.init(c, a, b)
	}
};
Ext.extend(Ext.dd.DD, Ext.dd.DragDrop, {
			scroll : true,
			autoOffset : function(c, b) {
				var a = c - this.startPageX;
				var d = b - this.startPageY;
				this.setDelta(a, d)
			},
			setDelta : function(b, a) {
				this.deltaX = b;
				this.deltaY = a
			},
			setDragElPos : function(c, b) {
				var a = this.getDragEl();
				this.alignElWithMouse(a, c, b)
			},
			alignElWithMouse : function(c, g, f) {
				var e = this.getTargetCoord(g, f);
				var b = c.dom ? c : Ext.fly(c, "_dd");
				if (!this.deltaSetXY) {
					var h = [e.x, e.y];
					b.setXY(h);
					var d = b.getLeft(true);
					var a = b.getTop(true);
					this.deltaSetXY = [d - e.x, a - e.y]
				} else {
					b.setLeftTop(e.x + this.deltaSetXY[0], e.y
									+ this.deltaSetXY[1])
				}
				this.cachePosition(e.x, e.y);
				this.autoScroll(e.x, e.y, c.offsetHeight, c.offsetWidth);
				return e
			},
			cachePosition : function(b, a) {
				if (b) {
					this.lastPageX = b;
					this.lastPageY = a
				} else {
					var c = Ext.lib.Dom.getXY(this.getEl());
					this.lastPageX = c[0];
					this.lastPageY = c[1]
				}
			},
			autoScroll : function(l, k, e, m) {
				if (this.scroll) {
					var n = Ext.lib.Dom.getViewHeight();
					var b = Ext.lib.Dom.getViewWidth();
					var p = this.DDM.getScrollTop();
					var d = this.DDM.getScrollLeft();
					var i = e + k;
					var o = m + l;
					var g = (n + p - k - this.deltaY);
					var f = (b + d - l - this.deltaX);
					var c = 40;
					var a = (document.all) ? 80 : 30;
					if (i > n && g < c) {
						window.scrollTo(d, p + a)
					}
					if (k < p && p > 0 && k - p < c) {
						window.scrollTo(d, p - a)
					}
					if (o > b && f < c) {
						window.scrollTo(d + a, p)
					}
					if (l < d && d > 0 && l - d < c) {
						window.scrollTo(d - a, p)
					}
				}
			},
			getTargetCoord : function(c, b) {
				var a = c - this.deltaX;
				var d = b - this.deltaY;
				if (this.constrainX) {
					if (a < this.minX) {
						a = this.minX
					}
					if (a > this.maxX) {
						a = this.maxX
					}
				}
				if (this.constrainY) {
					if (d < this.minY) {
						d = this.minY
					}
					if (d > this.maxY) {
						d = this.maxY
					}
				}
				a = this.getTick(a, this.xTicks);
				d = this.getTick(d, this.yTicks);
				return {
					x : a,
					y : d
				}
			},
			applyConfig : function() {
				Ext.dd.DD.superclass.applyConfig.call(this);
				this.scroll = (this.config.scroll !== false)
			},
			b4MouseDown : function(a) {
				this.autoOffset(a.getPageX(), a.getPageY())
			},
			b4Drag : function(a) {
				this.setDragElPos(a.getPageX(), a.getPageY())
			},
			toString : function() {
				return ("DD " + this.id)
			}
		});
Ext.dd.DDProxy = function(c, a, b) {
	if (c) {
		this.init(c, a, b);
		this.initFrame()
	}
};
Ext.dd.DDProxy.dragElId = "ygddfdiv";
Ext.extend(Ext.dd.DDProxy, Ext.dd.DD, {
			resizeFrame : true,
			centerFrame : false,
			createFrame : function() {
				var b = this;
				var a = document.body;
				if (!a || !a.firstChild) {
					setTimeout(function() {
								b.createFrame()
							}, 50);
					return
				}
				var d = this.getDragEl();
				if (!d) {
					d = document.createElement("div");
					d.id = this.dragElId;
					var c = d.style;
					c.position = "absolute";
					c.visibility = "hidden";
					c.cursor = "move";
					c.border = "2px solid #aaa";
					c.zIndex = 999;
					a.insertBefore(d, a.firstChild)
				}
			},
			initFrame : function() {
				this.createFrame()
			},
			applyConfig : function() {
				Ext.dd.DDProxy.superclass.applyConfig.call(this);
				this.resizeFrame = (this.config.resizeFrame !== false);
				this.centerFrame = (this.config.centerFrame);
				this.setDragElId(this.config.dragElId
						|| Ext.dd.DDProxy.dragElId)
			},
			showFrame : function(e, d) {
				var c = this.getEl();
				var a = this.getDragEl();
				var b = a.style;
				this._resizeProxy();
				if (this.centerFrame) {
					this.setDelta(Math.round(parseInt(b.width, 10) / 2), Math
									.round(parseInt(b.height, 10) / 2))
				}
				this.setDragElPos(e, d);
				Ext.fly(a).show()
			},
			_resizeProxy : function() {
				if (this.resizeFrame) {
					var a = this.getEl();
					Ext.fly(this.getDragEl()).setSize(a.offsetWidth,
							a.offsetHeight)
				}
			},
			b4MouseDown : function(b) {
				var a = b.getPageX();
				var c = b.getPageY();
				this.autoOffset(a, c);
				this.setDragElPos(a, c)
			},
			b4StartDrag : function(a, b) {
				this.showFrame(a, b)
			},
			b4EndDrag : function(a) {
				Ext.fly(this.getDragEl()).hide()
			},
			endDrag : function(c) {
				var b = this.getEl();
				var a = this.getDragEl();
				a.style.visibility = "";
				this.beforeMove();
				b.style.visibility = "hidden";
				Ext.dd.DDM.moveToEl(b, a);
				a.style.visibility = "hidden";
				b.style.visibility = "";
				this.afterDrag()
			},
			beforeMove : function() {
			},
			afterDrag : function() {
			},
			toString : function() {
				return ("DDProxy " + this.id)
			}
		});
Ext.dd.DDTarget = function(c, a, b) {
	if (c) {
		this.initTarget(c, a, b)
	}
};
Ext.extend(Ext.dd.DDTarget, Ext.dd.DragDrop, {
			toString : function() {
				return ("DDTarget " + this.id)
			}
		});