Ext.data.JsonReader = function(a, b) {
	a = a || {};
	Ext.data.JsonReader.superclass.constructor.call(this, a, b || a.fields)
};
Ext.extend(Ext.data.JsonReader, Ext.data.DataReader, {
	read : function(response) {
		var json = response.responseText;
		var o = eval("(" + json + ")");
		if (!o) {
			throw {
				message : "JsonReader.read: Json object not found"
			}
		}
		return this.readRecords(o)
	},
	onMetaChange : function(a, c, b) {
	},
	simpleAccess : function(b, a) {
		return b[a]
	},
	getJsonAccessor : function() {
		var a = /[\[\.]/;
		return function(c) {
			try {
				return (a.test(c))
						? new Function("obj", "return obj." + c)
						: function(d) {
							return d[c]
						}
			} catch (b) {
			}
			return Ext.emptyFn
		}
	}(),
	readRecords : function(r) {
		this.jsonData = r;
		if (r.metaData) {
			delete this.ef;
			this.meta = r.metaData;
			this.recordType = Ext.data.Record.create(r.metaData.fields);
			this.onMetaChange(this.meta, this.recordType, r)
		}
		var m = this.meta, a = this.recordType, A = a.prototype.fields, k = A.items, h = A.length;
		if (!this.ef) {
			if (m.totalProperty) {
				this.getTotal = this.getJsonAccessor(m.totalProperty)
			}
			if (m.successProperty) {
				this.getSuccess = this.getJsonAccessor(m.successProperty)
			}
			this.getRoot = m.root ? this.getJsonAccessor(m.root) : function(c) {
				return c
			};
			if (m.id) {
				var z = this.getJsonAccessor(m.id);
				this.getId = function(f) {
					var c = z(f);
					return (c === undefined || c === "") ? null : c
				}
			} else {
				this.getId = function() {
					return null
				}
			}
			this.ef = [];
			for (var x = 0; x < h; x++) {
				A = k[x];
				var C = (A.mapping !== undefined && A.mapping !== null)
						? A.mapping
						: A.name;
				this.ef[x] = this.getJsonAccessor(C)
			}
		}
		var u = this.getRoot(r), B = u.length, p = B, e = true;
		if (m.totalProperty) {
			var l = parseInt(this.getTotal(r), 10);
			if (!isNaN(l)) {
				p = l
			}
		}
		if (m.successProperty) {
			var l = this.getSuccess(r);
			if (l === false || l === "false") {
				e = false
			}
		}
		var y = [];
		for (var x = 0; x < B; x++) {
			var t = u[x];
			var b = {};
			var q = this.getId(t);
			for (var w = 0; w < h; w++) {
				A = k[w];
				var l = this.ef[w](t);
				b[A.name] = A
						.convert((l !== undefined) ? l : A.defaultValue, t)
			}
			var d = new a(b, q);
			d.json = t;
			y[x] = d
		}
		return {
			success : e,
			records : y,
			totalRecords : p
		}
	}
});