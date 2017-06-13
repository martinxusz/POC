Ext.util.DelayedTask = function(f, e, a) {
	var h = null, g, b;
	var c = function() {
		var d = new Date().getTime();
		if (d - b >= g) {
			clearInterval(h);
			h = null;
			f.apply(e, a || [])
		}
	};
	this.delay = function(i, k, j, d) {
		if (h && i != g) {
			this.cancel()
		}
		g = i;
		b = new Date().getTime();
		f = k || f;
		e = j || e;
		a = d || a;
		if (!h) {
			h = setInterval(c, g)
		}
	};
	this.cancel = function() {
		if (h) {
			clearInterval(h);
			h = null
		}
	}
};