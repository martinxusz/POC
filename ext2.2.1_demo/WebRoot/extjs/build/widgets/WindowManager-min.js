Ext.WindowGroup = function() {
	var f = {};
	var d = [];
	var e = null;
	var c = function(i, h) {
		return (!i._lastAccess || i._lastAccess < h._lastAccess) ? -1 : 1
	};
	var g = function() {
		var k = d, h = k.length;
		if (h > 0) {
			k.sort(c);
			var j = k[0].manager.zseed;
			for (var l = 0; l < h; l++) {
				var m = k[l];
				if (m && !m.hidden) {
					m.setZIndex(j + (l * 10))
				}
			}
		}
		a()
	};
	var b = function(h) {
		if (h != e) {
			if (e) {
				e.setActive(false)
			}
			e = h;
			if (h) {
				h.setActive(true)
			}
		}
	};
	var a = function() {
		for (var h = d.length - 1; h >= 0; --h) {
			if (!d[h].hidden) {
				b(d[h]);
				return
			}
		}
		b(null)
	};
	return {
		zseed : 9000,
		register : function(h) {
			f[h.id] = h;
			d.push(h);
			h.on("hide", a)
		},
		unregister : function(h) {
			delete f[h.id];
			h.un("hide", a);
			d.remove(h)
		},
		get : function(h) {
			return typeof h == "object" ? h : f[h]
		},
		bringToFront : function(h) {
			h = this.get(h);
			if (h != e) {
				h._lastAccess = new Date().getTime();
				g();
				return true
			}
			return false
		},
		sendToBack : function(h) {
			h = this.get(h);
			h._lastAccess = -(new Date().getTime());
			g();
			return h
		},
		hideAll : function() {
			for (var h in f) {
				if (f[h] && typeof f[h] != "function" && f[h].isVisible()) {
					f[h].hide()
				}
			}
		},
		getActive : function() {
			return e
		},
		getBy : function(k, j) {
			var l = [];
			for (var h = d.length - 1; h >= 0; --h) {
				var m = d[h];
				if (k.call(j || m, m) !== false) {
					l.push(m)
				}
			}
			return l
		},
		each : function(i, h) {
			for (var j in f) {
				if (f[j] && typeof f[j] != "function") {
					if (i.call(h || f[j], f[j]) === false) {
						return
					}
				}
			}
		}
	}
};
Ext.WindowMgr = new Ext.WindowGroup();