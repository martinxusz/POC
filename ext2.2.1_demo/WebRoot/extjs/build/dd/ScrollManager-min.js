Ext.dd.ScrollManager = function() {
	var c = Ext.dd.DragDropMgr;
	var e = {};
	var b = null;
	var h = {};
	var g = function(k) {
		b = null;
		a()
	};
	var i = function() {
		if (c.dragCurrent) {
			c.refreshCache(c.dragCurrent.groups)
		}
	};
	var d = function() {
		if (c.dragCurrent) {
			var k = Ext.dd.ScrollManager;
			var l = h.el.ddScrollConfig
					? h.el.ddScrollConfig.increment
					: k.increment;
			if (!k.animate) {
				if (h.el.scroll(h.dir, l)) {
					i()
				}
			} else {
				h.el.scroll(h.dir, l, true, k.animDuration, i)
			}
		}
	};
	var a = function() {
		if (h.id) {
			clearInterval(h.id)
		}
		h.id = 0;
		h.el = null;
		h.dir = ""
	};
	var f = function(l, k) {
		a();
		h.el = l;
		h.dir = k;
		var m = (l.ddScrollConfig && l.ddScrollConfig.frequency)
				? l.ddScrollConfig.frequency
				: Ext.dd.ScrollManager.frequency;
		h.id = setInterval(d, m)
	};
	var j = function(n, p) {
		if (p || !c.dragCurrent) {
			return
		}
		var q = Ext.dd.ScrollManager;
		if (!b || b != c.dragCurrent) {
			b = c.dragCurrent;
			q.refreshCache()
		}
		var s = Ext.lib.Event.getXY(n);
		var t = new Ext.lib.Point(s[0], s[1]);
		for (var l in e) {
			var m = e[l], k = m._region;
			var o = m.ddScrollConfig ? m.ddScrollConfig : q;
			if (k && k.contains(t) && m.isScrollable()) {
				if (k.bottom - t.y <= o.vthresh) {
					if (h.el != m) {
						f(m, "down")
					}
					return
				} else {
					if (k.right - t.x <= o.hthresh) {
						if (h.el != m) {
							f(m, "left")
						}
						return
					} else {
						if (t.y - k.top <= o.vthresh) {
							if (h.el != m) {
								f(m, "up")
							}
							return
						} else {
							if (t.x - k.left <= o.hthresh) {
								if (h.el != m) {
									f(m, "right")
								}
								return
							}
						}
					}
				}
			}
		}
		a()
	};
	c.fireEvents = c.fireEvents.createSequence(j, c);
	c.stopDrag = c.stopDrag.createSequence(g, c);
	return {
		register : function(m) {
			if (Ext.isArray(m)) {
				for (var l = 0, k = m.length; l < k; l++) {
					this.register(m[l])
				}
			} else {
				m = Ext.get(m);
				e[m.id] = m
			}
		},
		unregister : function(m) {
			if (Ext.isArray(m)) {
				for (var l = 0, k = m.length; l < k; l++) {
					this.unregister(m[l])
				}
			} else {
				m = Ext.get(m);
				delete e[m.id]
			}
		},
		vthresh : 25,
		hthresh : 25,
		increment : 100,
		frequency : 500,
		animate : true,
		animDuration : 0.4,
		refreshCache : function() {
			for (var k in e) {
				if (typeof e[k] == "object") {
					e[k]._region = e[k].getRegion()
				}
			}
		}
	}
}();