Ext.data.XmlReader = function(a, b) {
	a = a || {};
	Ext.data.XmlReader.superclass.constructor.call(this, a, b || a.fields)
};
Ext.extend(Ext.data.XmlReader, Ext.data.DataReader, {
			read : function(a) {
				var b = a.responseXML;
				if (!b) {
					throw {
						message : "XmlReader.read: XML Document not available"
					}
				}
				return this.readRecords(b)
			},
			readRecords : function(z) {
				this.xmlData = z;
				var s = z.documentElement || z;
				var l = Ext.DomQuery;
				var b = this.recordType, p = b.prototype.fields;
				var d = this.meta.id;
				var h = 0, e = true;
				if (this.meta.totalRecords) {
					h = l.selectNumber(this.meta.totalRecords, s, 0)
				}
				if (this.meta.success) {
					var o = l.selectValue(this.meta.success, s, true);
					e = o !== false && o !== "false"
				}
				var w = [];
				var A = l.select(this.meta.record, s);
				for (var u = 0, x = A.length; u < x; u++) {
					var r = A[u];
					var a = {};
					var m = d ? l.selectValue(d, r) : undefined;
					for (var t = 0, k = p.length; t < k; t++) {
						var y = p.items[t];
						var g = l.selectValue(y.mapping || y.name, r,
								y.defaultValue);
						g = y.convert(g, r);
						a[y.name] = g
					}
					var c = new b(a, m);
					c.node = r;
					w[w.length] = c
				}
				return {
					success : e,
					records : w,
					totalRecords : h || w.length
				}
			}
		});