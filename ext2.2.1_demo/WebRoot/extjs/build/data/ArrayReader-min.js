Ext.data.ArrayReader = Ext.extend(Ext.data.JsonReader, {
			readRecords : function(c) {
				var b = this.meta ? this.meta.id : null;
				var h = this.recordType, q = h.prototype.fields;
				var e = [];
				var s = c;
				for (var m = 0; m < s.length; m++) {
					var d = s[m];
					var u = {};
					var a = ((b || b === 0) && d[b] !== undefined
							&& d[b] !== "" ? d[b] : null);
					for (var l = 0, w = q.length; l < w; l++) {
						var r = q.items[l];
						var g = r.mapping !== undefined && r.mapping !== null
								? r.mapping
								: l;
						var t = d[g] !== undefined ? d[g] : r.defaultValue;
						t = r.convert(t, d);
						u[r.name] = t
					}
					var p = new h(u, a);
					p.json = d;
					e[e.length] = p
				}
				return {
					records : e,
					totalRecords : e.length
				}
			}
		});