Ext.enableFx = true;
Ext.Fx = {
	slideIn : function(a, c) {
		var b = this.getFxEl();
		c = c || {};
		b.queueFx(c, function() {
					a = a || "t";
					this.fixDisplay();
					var d = this.getFxRestore();
					var i = this.getBox();
					this.setSize(i);
					var f = this.fxWrap(d.pos, c, "hidden");
					var k = this.dom.style;
					k.visibility = "visible";
					k.position = "absolute";
					var e = function() {
						b.fxUnwrap(f, d.pos, c);
						k.width = d.width;
						k.height = d.height;
						b.afterFx(c)
					};
					var j, l = {
						to : [i.x, i.y]
					}, h = {
						to : i.width
					}, g = {
						to : i.height
					};
					switch (a.toLowerCase()) {
						case "t" :
							f.setSize(i.width, 0);
							k.left = k.bottom = "0";
							j = {
								height : g
							};
							break;
						case "l" :
							f.setSize(0, i.height);
							k.right = k.top = "0";
							j = {
								width : h
							};
							break;
						case "r" :
							f.setSize(0, i.height);
							f.setX(i.right);
							k.left = k.top = "0";
							j = {
								width : h,
								points : l
							};
							break;
						case "b" :
							f.setSize(i.width, 0);
							f.setY(i.bottom);
							k.left = k.top = "0";
							j = {
								height : g,
								points : l
							};
							break;
						case "tl" :
							f.setSize(0, 0);
							k.right = k.bottom = "0";
							j = {
								width : h,
								height : g
							};
							break;
						case "bl" :
							f.setSize(0, 0);
							f.setY(i.y + i.height);
							k.right = k.top = "0";
							j = {
								width : h,
								height : g,
								points : l
							};
							break;
						case "br" :
							f.setSize(0, 0);
							f.setXY([i.right, i.bottom]);
							k.left = k.top = "0";
							j = {
								width : h,
								height : g,
								points : l
							};
							break;
						case "tr" :
							f.setSize(0, 0);
							f.setX(i.x + i.width);
							k.left = k.bottom = "0";
							j = {
								width : h,
								height : g,
								points : l
							};
							break
					}
					this.dom.style.visibility = "visible";
					f.show();
					arguments.callee.anim = f.fxanim(j, c, "motion", 0.5,
							"easeOut", e)
				});
		return this
	},
	slideOut : function(a, c) {
		var b = this.getFxEl();
		c = c || {};
		b.queueFx(c, function() {
					a = a || "t";
					var i = this.getFxRestore();
					var d = this.getBox();
					this.setSize(d);
					var g = this.fxWrap(i.pos, c, "visible");
					var f = this.dom.style;
					f.visibility = "visible";
					f.position = "absolute";
					g.setSize(d);
					var j = function() {
						if (c.useDisplay) {
							b.setDisplayed(false)
						} else {
							b.hide()
						}
						b.fxUnwrap(g, i.pos, c);
						f.width = i.width;
						f.height = i.height;
						b.afterFx(c)
					};
					var e, h = {
						to : 0
					};
					switch (a.toLowerCase()) {
						case "t" :
							f.left = f.bottom = "0";
							e = {
								height : h
							};
							break;
						case "l" :
							f.right = f.top = "0";
							e = {
								width : h
							};
							break;
						case "r" :
							f.left = f.top = "0";
							e = {
								width : h,
								points : {
									to : [d.right, d.y]
								}
							};
							break;
						case "b" :
							f.left = f.top = "0";
							e = {
								height : h,
								points : {
									to : [d.x, d.bottom]
								}
							};
							break;
						case "tl" :
							f.right = f.bottom = "0";
							e = {
								width : h,
								height : h
							};
							break;
						case "bl" :
							f.right = f.top = "0";
							e = {
								width : h,
								height : h,
								points : {
									to : [d.x, d.bottom]
								}
							};
							break;
						case "br" :
							f.left = f.top = "0";
							e = {
								width : h,
								height : h,
								points : {
									to : [d.x + d.width, d.bottom]
								}
							};
							break;
						case "tr" :
							f.left = f.bottom = "0";
							e = {
								width : h,
								height : h,
								points : {
									to : [d.right, d.y]
								}
							};
							break
					}
					arguments.callee.anim = g.fxanim(e, c, "motion", 0.5,
							"easeOut", j)
				});
		return this
	},
	puff : function(b) {
		var a = this.getFxEl();
		b = b || {};
		a.queueFx(b, function() {
					this.clearOpacity();
					this.show();
					var f = this.getFxRestore();
					var d = this.dom.style;
					var g = function() {
						if (b.useDisplay) {
							a.setDisplayed(false)
						} else {
							a.hide()
						}
						a.clearOpacity();
						a.setPositioning(f.pos);
						d.width = f.width;
						d.height = f.height;
						d.fontSize = "";
						a.afterFx(b)
					};
					var e = this.getWidth();
					var c = this.getHeight();
					arguments.callee.anim = this.fxanim({
								width : {
									to : this.adjustWidth(e * 2)
								},
								height : {
									to : this.adjustHeight(c * 2)
								},
								points : {
									by : [-(e * 0.5), -(c * 0.5)]
								},
								opacity : {
									to : 0
								},
								fontSize : {
									to : 200,
									unit : "%"
								}
							}, b, "motion", 0.5, "easeOut", g)
				});
		return this
	},
	switchOff : function(b) {
		var a = this.getFxEl();
		b = b || {};
		a.queueFx(b, function() {
					this.clearOpacity();
					this.clip();
					var d = this.getFxRestore();
					var c = this.dom.style;
					var e = function() {
						if (b.useDisplay) {
							a.setDisplayed(false)
						} else {
							a.hide()
						}
						a.clearOpacity();
						a.setPositioning(d.pos);
						c.width = d.width;
						c.height = d.height;
						a.afterFx(b)
					};
					this.fxanim({
								opacity : {
									to : 0.3
								}
							}, null, null, 0.1, null, function() {
								this.clearOpacity();
								(function() {
									this.fxanim({
												height : {
													to : 1
												},
												points : {
													by : [
															0,
															this.getHeight()
																	* 0.5]
												}
											}, b, "motion", 0.3, "easeIn", e)
								}).defer(100, this)
							})
				});
		return this
	},
	highlight : function(a, c) {
		var b = this.getFxEl();
		c = c || {};
		b.queueFx(c, function() {
					a = a || "ffff9c";
					var d = c.attr || "backgroundColor";
					this.clearOpacity();
					this.show();
					var g = this.getColor(d);
					var h = this.dom.style[d];
					var f = (c.endColor || g) || "ffffff";
					var i = function() {
						b.dom.style[d] = h;
						b.afterFx(c)
					};
					var e = {};
					e[d] = {
						from : a,
						to : f
					};
					arguments.callee.anim = this.fxanim(e, c, "color", 1,
							"easeIn", i)
				});
		return this
	},
	frame : function(a, c, d) {
		var b = this.getFxEl();
		d = d || {};
		b.queueFx(d, function() {
					a = a || "#C3DAF9";
					if (a.length == 6) {
						a = "#" + a
					}
					c = c || 1;
					var g = d.duration || 1;
					this.show();
					var e = this.getBox();
					var f = function() {
						var h = Ext.getBody().createChild({
									style : {
										visbility : "hidden",
										position : "absolute",
										"z-index" : "35000",
										border : "0px solid " + a
									}
								});
						var i = Ext.isBorderBox ? 2 : 1;
						h.animate({
									top : {
										from : e.y,
										to : e.y - 20
									},
									left : {
										from : e.x,
										to : e.x - 20
									},
									borderWidth : {
										from : 0,
										to : 10
									},
									opacity : {
										from : 1,
										to : 0
									},
									height : {
										from : e.height,
										to : (e.height + (20 * i))
									},
									width : {
										from : e.width,
										to : (e.width + (20 * i))
									}
								}, g, function() {
									h.remove();
									if (--c > 0) {
										f()
									} else {
										b.afterFx(d)
									}
								})
					};
					f.call(this)
				});
		return this
	},
	pause : function(c) {
		var a = this.getFxEl();
		var b = {};
		a.queueFx(b, function() {
					setTimeout(function() {
								a.afterFx(b)
							}, c * 1000)
				});
		return this
	},
	fadeIn : function(b) {
		var a = this.getFxEl();
		b = b || {};
		a.queueFx(b, function() {
					this.setOpacity(0);
					this.fixDisplay();
					this.dom.style.visibility = "visible";
					var c = b.endOpacity || 1;
					arguments.callee.anim = this.fxanim({
								opacity : {
									to : c
								}
							}, b, null, 0.5, "easeOut", function() {
								if (c == 1) {
									this.clearOpacity()
								}
								a.afterFx(b)
							})
				});
		return this
	},
	fadeOut : function(b) {
		var a = this.getFxEl();
		b = b || {};
		a.queueFx(b, function() {
					var c = b.endOpacity || 0;
					arguments.callee.anim = this.fxanim({
								opacity : {
									to : c
								}
							}, b, null, 0.5, "easeOut", function() {
								if (c === 0) {
									if (this.visibilityMode == Ext.Element.DISPLAY
											|| b.useDisplay) {
										this.dom.style.display = "none"
									} else {
										this.dom.style.visibility = "hidden"
									}
									this.clearOpacity()
								}
								a.afterFx(b)
							})
				});
		return this
	},
	scale : function(a, b, c) {
		this.shift(Ext.apply({}, c, {
					width : a,
					height : b
				}));
		return this
	},
	shift : function(b) {
		var a = this.getFxEl();
		b = b || {};
		a.queueFx(b, function() {
			var e = {}, d = b.width, f = b.height, c = b.x, i = b.y, g = b.opacity;
			if (d !== undefined) {
				e.width = {
					to : this.adjustWidth(d)
				}
			}
			if (f !== undefined) {
				e.height = {
					to : this.adjustHeight(f)
				}
			}
			if (b.left !== undefined) {
				e.left = {
					to : b.left
				}
			}
			if (b.top !== undefined) {
				e.top = {
					to : b.top
				}
			}
			if (b.right !== undefined) {
				e.right = {
					to : b.right
				}
			}
			if (b.bottom !== undefined) {
				e.bottom = {
					to : b.bottom
				}
			}
			if (c !== undefined || i !== undefined) {
				e.points = {
					to : [c !== undefined ? c : this.getX(),
							i !== undefined ? i : this.getY()]
				}
			}
			if (g !== undefined) {
				e.opacity = {
					to : g
				}
			}
			if (b.xy !== undefined) {
				e.points = {
					to : b.xy
				}
			}
			arguments.callee.anim = this.fxanim(e, b, "motion", 0.35,
					"easeOut", function() {
						a.afterFx(b)
					})
		});
		return this
	},
	ghost : function(a, c) {
		var b = this.getFxEl();
		c = c || {};
		b.queueFx(c, function() {
					a = a || "b";
					var i = this.getFxRestore();
					var e = this.getWidth(), g = this.getHeight();
					var f = this.dom.style;
					var k = function() {
						if (c.useDisplay) {
							b.setDisplayed(false)
						} else {
							b.hide()
						}
						b.clearOpacity();
						b.setPositioning(i.pos);
						f.width = i.width;
						f.height = i.height;
						b.afterFx(c)
					};
					var d = {
						opacity : {
							to : 0
						},
						points : {}
					}, j = d.points;
					switch (a.toLowerCase()) {
						case "t" :
							j.by = [0, -g];
							break;
						case "l" :
							j.by = [-e, 0];
							break;
						case "r" :
							j.by = [e, 0];
							break;
						case "b" :
							j.by = [0, g];
							break;
						case "tl" :
							j.by = [-e, -g];
							break;
						case "bl" :
							j.by = [-e, g];
							break;
						case "br" :
							j.by = [e, g];
							break;
						case "tr" :
							j.by = [e, -g];
							break
					}
					arguments.callee.anim = this.fxanim(d, c, "motion", 0.5,
							"easeOut", k)
				});
		return this
	},
	syncFx : function() {
		this.fxDefaults = Ext.apply(this.fxDefaults || {}, {
					block : false,
					concurrent : true,
					stopFx : false
				});
		return this
	},
	sequenceFx : function() {
		this.fxDefaults = Ext.apply(this.fxDefaults || {}, {
					block : false,
					concurrent : false,
					stopFx : false
				});
		return this
	},
	nextFx : function() {
		var a = this.fxQueue[0];
		if (a) {
			a.call(this)
		}
	},
	hasActiveFx : function() {
		return this.fxQueue && this.fxQueue[0]
	},
	stopFx : function() {
		if (this.hasActiveFx()) {
			var a = this.fxQueue[0];
			if (a && a.anim && a.anim.isAnimated()) {
				this.fxQueue = [a];
				a.anim.stop(true)
			}
		}
		return this
	},
	beforeFx : function(a) {
		if (this.hasActiveFx() && !a.concurrent) {
			if (a.stopFx) {
				this.stopFx();
				return true
			}
			return false
		}
		return true
	},
	hasFxBlock : function() {
		var a = this.fxQueue;
		return a && a[0] && a[0].block
	},
	queueFx : function(c, a) {
		if (!this.fxQueue) {
			this.fxQueue = []
		}
		if (!this.hasFxBlock()) {
			Ext.applyIf(c, this.fxDefaults);
			if (!c.concurrent) {
				var b = this.beforeFx(c);
				a.block = c.block;
				this.fxQueue.push(a);
				if (b) {
					this.nextFx()
				}
			} else {
				a.call(this)
			}
		}
		return this
	},
	fxWrap : function(f, d, c) {
		var b;
		if (!d.wrap || !(b = Ext.get(d.wrap))) {
			var a;
			if (d.fixPosition) {
				a = this.getXY()
			}
			var e = document.createElement("div");
			e.style.visibility = c;
			b = Ext.get(this.dom.parentNode.insertBefore(e, this.dom));
			b.setPositioning(f);
			if (b.getStyle("position") == "static") {
				b.position("relative")
			}
			this.clearPositioning("auto");
			b.clip();
			b.dom.appendChild(this.dom);
			if (a) {
				b.setXY(a)
			}
		}
		return b
	},
	fxUnwrap : function(a, c, b) {
		this.clearPositioning();
		this.setPositioning(c);
		if (!b.wrap) {
			a.dom.parentNode.insertBefore(this.dom, a.dom);
			a.remove()
		}
	},
	getFxRestore : function() {
		var a = this.dom.style;
		return {
			pos : this.getPositioning(),
			width : a.width,
			height : a.height
		}
	},
	afterFx : function(a) {
		if (a.afterStyle) {
			this.applyStyles(a.afterStyle)
		}
		if (a.afterCls) {
			this.addClass(a.afterCls)
		}
		if (a.remove === true) {
			this.remove()
		}
		Ext.callback(a.callback, a.scope, [this]);
		if (!a.concurrent) {
			this.fxQueue.shift();
			this.nextFx()
		}
	},
	getFxEl : function() {
		return Ext.get(this.dom)
	},
	fxanim : function(d, e, b, f, c, a) {
		b = b || "run";
		e = e || {};
		var g = Ext.lib.Anim[b](this.dom, d, (e.duration || f) || 0.35,
				(e.easing || c) || "easeOut", function() {
					Ext.callback(a, this)
				}, this);
		e.anim = g;
		return g
	}
};
Ext.Fx.resize = Ext.Fx.scale;
Ext.apply(Ext.Element.prototype, Ext.Fx);