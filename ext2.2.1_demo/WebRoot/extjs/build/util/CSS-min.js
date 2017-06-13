Ext.util.CSS = function() {
	var d = null;
	var c = document;
	var b = /(-[a-z])/gi;
	var a = function(e, f) {
		return f.charAt(1).toUpperCase()
	};
	return {
		createStyleSheet : function(h, k) {
			var g;
			var f = c.getElementsByTagName("head")[0];
			var j = c.createElement("style");
			j.setAttribute("type", "text/css");
			if (k) {
				j.setAttribute("id", k)
			}
			if (Ext.isIE) {
				f.appendChild(j);
				g = j.styleSheet;
				g.cssText = h
			} else {
				try {
					j.appendChild(c.createTextNode(h))
				} catch (i) {
					j.cssText = h
				}
				f.appendChild(j);
				g = j.styleSheet
						? j.styleSheet
						: (j.sheet || c.styleSheets[c.styleSheets.length - 1])
			}
			this.cacheStyleSheet(g);
			return g
		},
		removeStyleSheet : function(f) {
			var e = c.getElementById(f);
			if (e) {
				e.parentNode.removeChild(e)
			}
		},
		swapStyleSheet : function(g, e) {
			this.removeStyleSheet(g);
			var f = c.createElement("link");
			f.setAttribute("rel", "stylesheet");
			f.setAttribute("type", "text/css");
			f.setAttribute("id", g);
			f.setAttribute("href", e);
			c.getElementsByTagName("head")[0].appendChild(f)
		},
		refreshCache : function() {
			return this.getRules(true)
		},
		cacheStyleSheet : function(g) {
			if (!d) {
				d = {}
			}
			try {
				var i = g.cssRules || g.rules;
				for (var f = i.length - 1; f >= 0; --f) {
					d[i[f].selectorText] = i[f]
				}
			} catch (h) {
			}
		},
		getRules : function(g) {
			if (d == null || g) {
				d = {};
				var j = c.styleSheets;
				for (var h = 0, f = j.length; h < f; h++) {
					try {
						this.cacheStyleSheet(j[h])
					} catch (k) {
					}
				}
			}
			return d
		},
		getRule : function(e, g) {
			var f = this.getRules(g);
			if (!Ext.isArray(e)) {
				return f[e]
			}
			for (var h = 0; h < e.length; h++) {
				if (f[e[h]]) {
					return f[e[h]]
				}
			}
			return null
		},
		updateRule : function(e, h, g) {
			if (!Ext.isArray(e)) {
				var j = this.getRule(e);
				if (j) {
					j.style[h.replace(b, a)] = g;
					return true
				}
			} else {
				for (var f = 0; f < e.length; f++) {
					if (this.updateRule(e[f], h, g)) {
						return true
					}
				}
			}
			return false
		}
	}
}();