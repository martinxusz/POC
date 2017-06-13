Ext.Resizable = function(d, e) {
	this.el = Ext.get(d);
	if (e && e.wrap) {
		e.resizeChild = this.el;
		this.el = this.el.wrap(typeof e.wrap == "object" ? e.wrap : {
			cls : "xresizable-wrap"
		});
		this.el.id = this.el.dom.id = e.resizeChild.id + "-rzwrap";
		this.el.setStyle("overflow", "hidden");
		this.el.setPositioning(e.resizeChild.getPositioning());
		e.resizeChild.clearPositioning();
		if (!e.width || !e.height) {
			var f = e.resizeChild.getSize();
			this.el.setSize(f.width, f.height)
		}
		if (e.pinned && !e.adjustments) {
			e.adjustments = "auto"
		}
	}
	this.proxy = this.el.createProxy({
				tag : "div",
				cls : "x-resizable-proxy",
				id : this.el.id + "-rzproxy"
			}, Ext.getBody());
	this.proxy.unselectable();
	this.proxy.enableDisplayMode("block");
	Ext.apply(this, e);
	if (this.pinned) {
		this.disableTrackOver = true;
		this.el.addClass("x-resizable-pinned")
	}
	var j = this.el.getStyle("position");
	if (j != "absolute" && j != "fixed") {
		this.el.setStyle("position", "relative")
	}
	if (!this.handles) {
		this.handles = "s,e,se";
		if (this.multiDirectional) {
			this.handles += ",n,w"
		}
	}
	if (this.handles == "all") {
		this.handles = "n s e w ne nw se sw"
	}
	var n = this.handles.split(/\s*?[,;]\s*?| /);
	var c = Ext.Resizable.positions;
	for (var h = 0, k = n.length; h < k; h++) {
		if (n[h] && c[n[h]]) {
			var m = c[n[h]];
			this[m] = new Ext.Resizable.Handle(this, m, this.disableTrackOver,
					this.transparent)
		}
	}
	this.corner = this.southeast;
	if (this.handles.indexOf("n") != -1 || this.handles.indexOf("w") != -1) {
		this.updateBox = true
	}
	this.activeHandle = null;
	if (this.resizeChild) {
		if (typeof this.resizeChild == "boolean") {
			this.resizeChild = Ext.get(this.el.dom.firstChild, true)
		} else {
			this.resizeChild = Ext.get(this.resizeChild, true)
		}
	}
	if (this.adjustments == "auto") {
		var b = this.resizeChild;
		var l = this.west, g = this.east, a = this.north, n = this.south;
		if (b && (l || a)) {
			b.position("relative");
			b.setLeft(l ? l.el.getWidth() : 0);
			b.setTop(a ? a.el.getHeight() : 0)
		}
		this.adjustments = [
				(g ? -g.el.getWidth() : 0) + (l ? -l.el.getWidth() : 0),
				(a ? -a.el.getHeight() : 0) + (n ? -n.el.getHeight() : 0) - 1]
	}
	if (this.draggable) {
		this.dd = this.dynamic ? this.el.initDD(null) : this.el.initDDProxy(
				null, {
					dragElId : this.proxy.id
				});
		this.dd.setHandleElId(this.resizeChild
				? this.resizeChild.id
				: this.el.id)
	}
	this.addEvents("beforeresize", "resize");
	if (this.width !== null && this.height !== null) {
		this.resizeTo(this.width, this.height)
	} else {
		this.updateChildSize()
	}
	if (Ext.isIE) {
		this.el.dom.style.zoom = 1
	}
	Ext.Resizable.superclass.constructor.call(this)
};
Ext.extend(Ext.Resizable, Ext.util.Observable, {
			resizeChild : false,
			adjustments : [0, 0],
			minWidth : 5,
			minHeight : 5,
			maxWidth : 10000,
			maxHeight : 10000,
			enabled : true,
			animate : false,
			duration : 0.35,
			dynamic : false,
			handles : false,
			multiDirectional : false,
			disableTrackOver : false,
			easing : "easeOutStrong",
			widthIncrement : 0,
			heightIncrement : 0,
			pinned : false,
			width : null,
			height : null,
			preserveRatio : false,
			transparent : false,
			minX : 0,
			minY : 0,
			draggable : false,
			resizeTo : function(b, a) {
				this.el.setSize(b, a);
				this.updateChildSize();
				this.fireEvent("resize", this, b, a, null)
			},
			startSizing : function(c, b) {
				this.fireEvent("beforeresize", this, c);
				if (this.enabled) {
					if (!this.overlay) {
						this.overlay = this.el.createProxy({
									tag : "div",
									cls : "x-resizable-overlay",
									html : "&#160;"
								}, Ext.getBody());
						this.overlay.unselectable();
						this.overlay.enableDisplayMode("block");
						this.overlay.on("mousemove", this.onMouseMove, this);
						this.overlay.on("mouseup", this.onMouseUp, this)
					}
					this.overlay.setStyle("cursor", b.el.getStyle("cursor"));
					this.resizing = true;
					this.startBox = this.el.getBox();
					this.startPoint = c.getXY();
					this.offsets = [
							(this.startBox.x + this.startBox.width)
									- this.startPoint[0],
							(this.startBox.y + this.startBox.height)
									- this.startPoint[1]];
					this.overlay.setSize(Ext.lib.Dom.getViewWidth(true),
							Ext.lib.Dom.getViewHeight(true));
					this.overlay.show();
					if (this.constrainTo) {
						var a = Ext.get(this.constrainTo);
						this.resizeRegion = a.getRegion().adjust(
								a.getFrameWidth("t"), a.getFrameWidth("l"),
								-a.getFrameWidth("b"), -a.getFrameWidth("r"))
					}
					this.proxy.setStyle("visibility", "hidden");
					this.proxy.show();
					this.proxy.setBox(this.startBox);
					if (!this.dynamic) {
						this.proxy.setStyle("visibility", "visible")
					}
				}
			},
			onMouseDown : function(a, b) {
				if (this.enabled) {
					b.stopEvent();
					this.activeHandle = a;
					this.startSizing(b, a)
				}
			},
			onMouseUp : function(b) {
				var a = this.resizeElement();
				this.resizing = false;
				this.handleOut();
				this.overlay.hide();
				this.proxy.hide();
				this.fireEvent("resize", this, a.width, a.height, b)
			},
			updateChildSize : function() {
				if (this.resizeChild) {
					var d = this.el;
					var e = this.resizeChild;
					var c = this.adjustments;
					if (d.dom.offsetWidth) {
						var a = d.getSize(true);
						e.setSize(a.width + c[0], a.height + c[1])
					}
					if (Ext.isIE) {
						setTimeout(function() {
									if (d.dom.offsetWidth) {
										var f = d.getSize(true);
										e.setSize(f.width + c[0], f.height
														+ c[1])
									}
								}, 10)
					}
				}
			},
			snap : function(c, e, b) {
				if (!e || !c) {
					return c
				}
				var d = c;
				var a = c % e;
				if (a > 0) {
					if (a > (e / 2)) {
						d = c + (e - a)
					} else {
						d = c - a
					}
				}
				return Math.max(b, d)
			},
			resizeElement : function() {
				var a = this.proxy.getBox();
				if (this.updateBox) {
					this.el.setBox(a, false, this.animate, this.duration, null,
							this.easing)
				} else {
					this.el.setSize(a.width, a.height, this.animate,
							this.duration, null, this.easing)
				}
				this.updateChildSize();
				if (!this.dynamic) {
					this.proxy.hide()
				}
				return a
			},
			constrain : function(b, c, a, d) {
				if (b - c < a) {
					c = b - a
				} else {
					if (b - c > d) {
						c = d - b
					}
				}
				return c
			},
			onMouseMove : function(u) {
				if (this.enabled) {
					try {
						if (this.resizeRegion
								&& !this.resizeRegion.contains(u.getPoint())) {
							return
						}
						var s = this.curSize || this.startBox;
						var k = this.startBox.x, j = this.startBox.y;
						var c = k, b = j;
						var l = s.width, t = s.height;
						var d = l, n = t;
						var m = this.minWidth, v = this.minHeight;
						var r = this.maxWidth, B = this.maxHeight;
						var g = this.widthIncrement;
						var a = this.heightIncrement;
						var z = u.getXY();
						var q = -(this.startPoint[0] - Math
								.max(this.minX, z[0]));
						var o = -(this.startPoint[1] - Math
								.max(this.minY, z[1]));
						var i = this.activeHandle.position;
						switch (i) {
							case "east" :
								l += q;
								l = Math.min(Math.max(m, l), r);
								break;
							case "south" :
								t += o;
								t = Math.min(Math.max(v, t), B);
								break;
							case "southeast" :
								l += q;
								t += o;
								l = Math.min(Math.max(m, l), r);
								t = Math.min(Math.max(v, t), B);
								break;
							case "north" :
								o = this.constrain(t, o, v, B);
								j += o;
								t -= o;
								break;
							case "west" :
								q = this.constrain(l, q, m, r);
								k += q;
								l -= q;
								break;
							case "northeast" :
								l += q;
								l = Math.min(Math.max(m, l), r);
								o = this.constrain(t, o, v, B);
								j += o;
								t -= o;
								break;
							case "northwest" :
								q = this.constrain(l, q, m, r);
								o = this.constrain(t, o, v, B);
								j += o;
								t -= o;
								k += q;
								l -= q;
								break;
							case "southwest" :
								q = this.constrain(l, q, m, r);
								t += o;
								t = Math.min(Math.max(v, t), B);
								k += q;
								l -= q;
								break
						}
						var p = this.snap(l, g, m);
						var A = this.snap(t, a, v);
						if (p != l || A != t) {
							switch (i) {
								case "northeast" :
									j -= A - t;
									break;
								case "north" :
									j -= A - t;
									break;
								case "southwest" :
									k -= p - l;
									break;
								case "west" :
									k -= p - l;
									break;
								case "northwest" :
									k -= p - l;
									j -= A - t;
									break
							}
							l = p;
							t = A
						}
						if (this.preserveRatio) {
							switch (i) {
								case "southeast" :
								case "east" :
									t = n * (l / d);
									t = Math.min(Math.max(v, t), B);
									l = d * (t / n);
									break;
								case "south" :
									l = d * (t / n);
									l = Math.min(Math.max(m, l), r);
									t = n * (l / d);
									break;
								case "northeast" :
									l = d * (t / n);
									l = Math.min(Math.max(m, l), r);
									t = n * (l / d);
									break;
								case "north" :
									var C = l;
									l = d * (t / n);
									l = Math.min(Math.max(m, l), r);
									t = n * (l / d);
									k += (C - l) / 2;
									break;
								case "southwest" :
									t = n * (l / d);
									t = Math.min(Math.max(v, t), B);
									var C = l;
									l = d * (t / n);
									k += C - l;
									break;
								case "west" :
									var f = t;
									t = n * (l / d);
									t = Math.min(Math.max(v, t), B);
									j += (f - t) / 2;
									var C = l;
									l = d * (t / n);
									k += C - l;
									break;
								case "northwest" :
									var C = l;
									var f = t;
									t = n * (l / d);
									t = Math.min(Math.max(v, t), B);
									l = d * (t / n);
									j += f - t;
									k += C - l;
									break
							}
						}
						this.proxy.setBounds(k, j, l, t);
						if (this.dynamic) {
							this.resizeElement()
						}
					} catch (u) {
					}
				}
			},
			handleOver : function() {
				if (this.enabled) {
					this.el.addClass("x-resizable-over")
				}
			},
			handleOut : function() {
				if (!this.resizing) {
					this.el.removeClass("x-resizable-over")
				}
			},
			getEl : function() {
				return this.el
			},
			getResizeChild : function() {
				return this.resizeChild
			},
			destroy : function(b) {
				if (this.dd) {
					this.dd.destroy()
				}
				if (this.overlay) {
					Ext.destroy(this.overlay);
					this.overlay = null
				}
				Ext.destroy(this.proxy);
				this.proxy = null;
				var c = Ext.Resizable.positions;
				for (var a in c) {
					if (typeof c[a] != "function" && this[c[a]]) {
						this[c[a]].destroy()
					}
				}
				if (b) {
					this.el.update("");
					Ext.destroy(this.el);
					this.el = null
				}
			},
			syncHandleHeight : function() {
				var a = this.el.getHeight(true);
				if (this.west) {
					this.west.el.setHeight(a)
				}
				if (this.east) {
					this.east.el.setHeight(a)
				}
			}
		});
Ext.Resizable.positions = {
	n : "north",
	s : "south",
	e : "east",
	w : "west",
	se : "southeast",
	sw : "southwest",
	nw : "northwest",
	ne : "northeast"
};
Ext.Resizable.Handle = function(c, e, b, d) {
	if (!this.tpl) {
		var a = Ext.DomHelper.createTemplate({
					tag : "div",
					cls : "x-resizable-handle x-resizable-handle-{0}"
				});
		a.compile();
		Ext.Resizable.Handle.prototype.tpl = a
	}
	this.position = e;
	this.rz = c;
	this.el = this.tpl.append(c.el.dom, [this.position], true);
	this.el.unselectable();
	if (d) {
		this.el.setOpacity(0)
	}
	this.el.on("mousedown", this.onMouseDown, this);
	if (!b) {
		this.el.on("mouseover", this.onMouseOver, this);
		this.el.on("mouseout", this.onMouseOut, this)
	}
};
Ext.Resizable.Handle.prototype = {
	afterResize : function(a) {
	},
	onMouseDown : function(a) {
		this.rz.onMouseDown(this, a)
	},
	onMouseOver : function(a) {
		this.rz.handleOver(this, a)
	},
	onMouseOut : function(a) {
		this.rz.handleOut(this, a)
	},
	destroy : function() {
		Ext.destroy(this.el);
		this.el = null
	}
};