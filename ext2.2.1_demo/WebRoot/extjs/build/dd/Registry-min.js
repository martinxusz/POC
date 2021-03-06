Ext.dd.Registry = function() {
	var d = {};
	var b = {};
	var a = 0;
	var c = function(f, e) {
		if (typeof f == "string") {
			return f
		}
		var g = f.id;
		if (!g && e !== false) {
			g = "extdd-" + (++a);
			f.id = g
		}
		return g
	};
	return {
		register : function(h, j) {
			j = j || {};
			if (typeof h == "string") {
				h = document.getElementById(h)
			}
			j.ddel = h;
			d[c(h)] = j;
			if (j.isHandle !== false) {
				b[j.ddel.id] = j
			}
			if (j.handles) {
				var g = j.handles;
				for (var f = 0, e = g.length; f < e; f++) {
					b[c(g[f])] = j
				}
			}
		},
		unregister : function(h) {
			var k = c(h, false);
			var j = d[k];
			if (j) {
				delete d[k];
				if (j.handles) {
					var g = j.handles;
					for (var f = 0, e = g.length; f < e; f++) {
						delete b[c(g[f], false)]
					}
				}
			}
		},
		getHandle : function(e) {
			if (typeof e != "string") {
				e = e.id
			}
			return b[e]
		},
		getHandleFromEvent : function(g) {
			var f = Ext.lib.Event.getTarget(g);
			return f ? b[f.id] : null
		},
		getTarget : function(e) {
			if (typeof e != "string") {
				e = e.id
			}
			return d[e]
		},
		getTargetFromEvent : function(g) {
			var f = Ext.lib.Event.getTarget(g);
			return f ? d[f.id] || b[f.id] : null
		}
	}
}();