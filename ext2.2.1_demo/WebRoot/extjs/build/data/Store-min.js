Ext.data.Store = function(a) {
	this.data = new Ext.util.MixedCollection(false);
	this.data.getKey = function(b) {
		return b.id
	};
	this.baseParams = {};
	this.paramNames = {
		start : "start",
		limit : "limit",
		sort : "sort",
		dir : "dir"
	};
	if (a && a.data) {
		this.inlineData = a.data;
		delete a.data
	}
	Ext.apply(this, a);
	if (this.url && !this.proxy) {
		this.proxy = new Ext.data.HttpProxy({
					url : this.url
				})
	}
	if (this.reader) {
		if (!this.recordType) {
			this.recordType = this.reader.recordType
		}
		if (this.reader.onMetaChange) {
			this.reader.onMetaChange = this.onMetaChange.createDelegate(this)
		}
	}
	if (this.recordType) {
		this.fields = this.recordType.prototype.fields
	}
	this.modified = [];
	this.addEvents("datachanged", "metachange", "add", "remove", "update",
			"clear", "beforeload", "load", "loadexception");
	if (this.proxy) {
		this.relayEvents(this.proxy, ["loadexception"])
	}
	this.sortToggle = {};
	if (this.sortInfo) {
		this.setDefaultSort(this.sortInfo.field, this.sortInfo.direction)
	}
	Ext.data.Store.superclass.constructor.call(this);
	if (this.storeId || this.id) {
		Ext.StoreMgr.register(this)
	}
	if (this.inlineData) {
		this.loadData(this.inlineData);
		delete this.inlineData
	} else {
		if (this.autoLoad) {
			this.load.defer(10, this, [typeof this.autoLoad == "object"
							? this.autoLoad
							: undefined])
		}
	}
};
Ext.extend(Ext.data.Store, Ext.util.Observable, {
			remoteSort : false,
			pruneModifiedRecords : false,
			lastOptions : null,
			destroy : function() {
				if (this.storeId || this.id) {
					Ext.StoreMgr.unregister(this)
				}
				this.data = null;
				this.purgeListeners()
			},
			add : function(b) {
				b = [].concat(b);
				if (b.length < 1) {
					return
				}
				for (var d = 0, a = b.length; d < a; d++) {
					b[d].join(this)
				}
				var c = this.data.length;
				this.data.addAll(b);
				if (this.snapshot) {
					this.snapshot.addAll(b)
				}
				this.fireEvent("add", this, b, c)
			},
			addSorted : function(a) {
				var b = this.findInsertIndex(a);
				this.insert(b, a)
			},
			remove : function(a) {
				var b = this.data.indexOf(a);
				this.data.removeAt(b);
				if (this.pruneModifiedRecords) {
					this.modified.remove(a)
				}
				if (this.snapshot) {
					this.snapshot.remove(a)
				}
				this.fireEvent("remove", this, a, b)
			},
			removeAt : function(a) {
				this.remove(this.getAt(a))
			},
			removeAll : function() {
				this.data.clear();
				if (this.snapshot) {
					this.snapshot.clear()
				}
				if (this.pruneModifiedRecords) {
					this.modified = []
				}
				this.fireEvent("clear", this)
			},
			insert : function(c, b) {
				b = [].concat(b);
				for (var d = 0, a = b.length; d < a; d++) {
					this.data.insert(c, b[d]);
					b[d].join(this)
				}
				this.fireEvent("add", this, b, c)
			},
			indexOf : function(a) {
				return this.data.indexOf(a)
			},
			indexOfId : function(a) {
				return this.data.indexOfKey(a)
			},
			getById : function(a) {
				return this.data.key(a)
			},
			getAt : function(a) {
				return this.data.itemAt(a)
			},
			getRange : function(b, a) {
				return this.data.getRange(b, a)
			},
			storeOptions : function(a) {
				a = Ext.apply({}, a);
				delete a.callback;
				delete a.scope;
				this.lastOptions = a
			},
			load : function(b) {
				b = b || {};
				if (this.fireEvent("beforeload", this, b) !== false) {
					this.storeOptions(b);
					var c = Ext.apply(b.params || {}, this.baseParams);
					if (this.sortInfo && this.remoteSort) {
						var a = this.paramNames;
						c[a.sort] = this.sortInfo.field;
						c[a.dir] = this.sortInfo.direction
					}
					this.proxy.load(c, this.reader, this.loadRecords, this, b);
					return true
				} else {
					return false
				}
			},
			reload : function(a) {
				this.load(Ext.applyIf(a || {}, this.lastOptions))
			},
			loadRecords : function(g, b, f) {
				if (!g || f === false) {
					if (f !== false) {
						this.fireEvent("load", this, [], b)
					}
					if (b.callback) {
						b.callback.call(b.scope || this, [], b, false)
					}
					return
				}
				var e = g.records, d = g.totalRecords || e.length;
				if (!b || b.add !== true) {
					if (this.pruneModifiedRecords) {
						this.modified = []
					}
					for (var c = 0, a = e.length; c < a; c++) {
						e[c].join(this)
					}
					if (this.snapshot) {
						this.data = this.snapshot;
						delete this.snapshot
					}
					this.data.clear();
					this.data.addAll(e);
					this.totalLength = d;
					this.applySort();
					this.fireEvent("datachanged", this)
				} else {
					this.totalLength = Math.max(d, this.data.length + e.length);
					this.add(e)
				}
				this.fireEvent("load", this, e, b);
				if (b.callback) {
					b.callback.call(b.scope || this, e, b, true)
				}
			},
			loadData : function(c, a) {
				var b = this.reader.readRecords(c);
				this.loadRecords(b, {
							add : a
						}, true)
			},
			getCount : function() {
				return this.data.length || 0
			},
			getTotalCount : function() {
				return this.totalLength || 0
			},
			getSortState : function() {
				return this.sortInfo
			},
			applySort : function() {
				if (this.sortInfo && !this.remoteSort) {
					var a = this.sortInfo, b = a.field;
					this.sortData(b, a.direction)
				}
			},
			sortData : function(c, d) {
				d = d || "ASC";
				var a = this.fields.get(c).sortType;
				var b = function(f, e) {
					var h = a(f.data[c]), g = a(e.data[c]);
					return h > g ? 1 : (h < g ? -1 : 0)
				};
				this.data.sort(d, b);
				if (this.snapshot && this.snapshot != this.data) {
					this.snapshot.sort(d, b)
				}
			},
			setDefaultSort : function(b, a) {
				a = a ? a.toUpperCase() : "ASC";
				this.sortInfo = {
					field : b,
					direction : a
				};
				this.sortToggle[b] = a
			},
			sort : function(e, c) {
				var d = this.fields.get(e);
				if (!d) {
					return false
				}
				if (!c) {
					if (this.sortInfo && this.sortInfo.field == d.name) {
						c = (this.sortToggle[d.name] || "ASC").toggle("ASC",
								"DESC")
					} else {
						c = d.sortDir
					}
				}
				var b = (this.sortToggle) ? this.sortToggle[d.name] : null;
				var a = (this.sortInfo) ? this.sortInfo : null;
				this.sortToggle[d.name] = c;
				this.sortInfo = {
					field : d.name,
					direction : c
				};
				if (!this.remoteSort) {
					this.applySort();
					this.fireEvent("datachanged", this)
				} else {
					if (!this.load(this.lastOptions)) {
						if (b) {
							this.sortToggle[d.name] = b
						}
						if (a) {
							this.sortInfo = a
						}
					}
				}
			},
			each : function(b, a) {
				this.data.each(b, a)
			},
			getModifiedRecords : function() {
				return this.modified
			},
			createFilterFn : function(c, b, d, a) {
				if (Ext.isEmpty(b, false)) {
					return false
				}
				b = this.data.createValueMatcher(b, d, a);
				return function(e) {
					return b.test(e.data[c])
				}
			},
			sum : function(e, f, a) {
				var c = this.data.items, b = 0;
				f = f || 0;
				a = (a || a === 0) ? a : c.length - 1;
				for (var d = f; d <= a; d++) {
					b += (c[d].data[e] || 0)
				}
				return b
			},
			filter : function(d, c, e, a) {
				var b = this.createFilterFn(d, c, e, a);
				return b ? this.filterBy(b) : this.clearFilter()
			},
			filterBy : function(b, a) {
				this.snapshot = this.snapshot || this.data;
				this.data = this.queryBy(b, a || this);
				this.fireEvent("datachanged", this)
			},
			query : function(d, c, e, a) {
				var b = this.createFilterFn(d, c, e, a);
				return b ? this.queryBy(b) : this.data.clone()
			},
			queryBy : function(b, a) {
				var c = this.snapshot || this.data;
				return c.filterBy(b, a || this)
			},
			find : function(d, c, f, e, a) {
				var b = this.createFilterFn(d, c, e, a);
				return b ? this.data.findIndexBy(b, null, f) : -1
			},
			findBy : function(b, a, c) {
				return this.data.findIndexBy(b, a, c)
			},
			collect : function(h, j, b) {
				var g = (b === true && this.snapshot)
						? this.snapshot.items
						: this.data.items;
				var k, m, a = [], c = {};
				for (var e = 0, f = g.length; e < f; e++) {
					k = g[e].data[h];
					m = String(k);
					if ((j || !Ext.isEmpty(k)) && !c[m]) {
						c[m] = true;
						a[a.length] = k
					}
				}
				return a
			},
			clearFilter : function(a) {
				if (this.isFiltered()) {
					this.data = this.snapshot;
					delete this.snapshot;
					if (a !== true) {
						this.fireEvent("datachanged", this)
					}
				}
			},
			isFiltered : function() {
				return this.snapshot && this.snapshot != this.data
			},
			afterEdit : function(a) {
				if (this.modified.indexOf(a) == -1) {
					this.modified.push(a)
				}
				this.fireEvent("update", this, a, Ext.data.Record.EDIT)
			},
			afterReject : function(a) {
				this.modified.remove(a);
				this.fireEvent("update", this, a, Ext.data.Record.REJECT)
			},
			afterCommit : function(a) {
				this.modified.remove(a);
				this.fireEvent("update", this, a, Ext.data.Record.COMMIT)
			},
			commitChanges : function() {
				var b = this.modified.slice(0);
				this.modified = [];
				for (var c = 0, a = b.length; c < a; c++) {
					b[c].commit()
				}
			},
			rejectChanges : function() {
				var b = this.modified.slice(0);
				this.modified = [];
				for (var c = 0, a = b.length; c < a; c++) {
					b[c].reject()
				}
			},
			onMetaChange : function(b, a, c) {
				this.recordType = a;
				this.fields = a.prototype.fields;
				delete this.snapshot;
				this.sortInfo = b.sortInfo;
				this.modified = [];
				this.fireEvent("metachange", this, this.reader.meta)
			},
			findInsertIndex : function(a) {
				this.suspendEvents();
				var c = this.data.clone();
				this.data.add(a);
				this.applySort();
				var b = this.data.indexOf(a);
				this.data = c;
				this.resumeEvents();
				return b
			}
		});