Ext.util.TaskRunner = function(e) {
	e = e || 10;
	var f = [], a = [];
	var b = 0;
	var g = false;
	var d = function() {
		g = false;
		clearInterval(b);
		b = 0
	};
	var h = function() {
		if (!g) {
			g = true;
			b = setInterval(i, e)
		}
	};
	var c = function(j) {
		a.push(j);
		if (j.onStop) {
			j.onStop.apply(j.scope || j)
		}
	};
	var i = function() {
		if (a.length > 0) {
			for (var o = 0, k = a.length; o < k; o++) {
				f.remove(a[o])
			}
			a = [];
			if (f.length < 1) {
				d();
				return
			}
		}
		var m = new Date().getTime();
		for (var o = 0, k = f.length; o < k; ++o) {
			var n = f[o];
			var j = m - n.taskRunTime;
			if (n.interval <= j) {
				var l = n.run.apply(n.scope || n, n.args || [++n.taskRunCount]);
				n.taskRunTime = m;
				if (l === false || n.taskRunCount === n.repeat) {
					c(n);
					return
				}
			}
			if (n.duration && n.duration <= (m - n.taskStartTime)) {
				c(n)
			}
		}
	};
	this.start = function(j) {
		f.push(j);
		j.taskStartTime = new Date().getTime();
		j.taskRunTime = 0;
		j.taskRunCount = 0;
		h();
		return j
	};
	this.stop = function(j) {
		c(j);
		return j
	};
	this.stopAll = function() {
		d();
		for (var k = 0, j = f.length; k < j; k++) {
			if (f[k].onStop) {
				f[k].onStop()
			}
		}
		f = [];
		a = []
	}
};
Ext.TaskMgr = new Ext.util.TaskRunner();