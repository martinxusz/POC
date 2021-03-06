Ext.data.Record = function(a, b) {
	this.id = (b || b === 0) ? b : ++Ext.data.Record.AUTO_ID;
	this.data = a
};
Ext.data.Record.create = function(e) {
	var c = Ext.extend(Ext.data.Record, {});
	var d = c.prototype;
	d.fields = new Ext.util.MixedCollection(false, function(f) {
				return f.name
			});
	for (var b = 0, a = e.length; b < a; b++) {
		d.fields.add(new Ext.data.Field(e[b]))
	}
	c.getField = function(f) {
		return d.fields.get(f)
	};
	return c
};
Ext.data.Record.AUTO_ID = 1000;
Ext.data.Record.EDIT = "edit";
Ext.data.Record.REJECT = "reject";
Ext.data.Record.COMMIT = "commit";
Ext.data.Record.prototype = {
	dirty : false,
	editing : false,
	error : null,
	modified : null,
	join : function(a) {
		this.store = a
	},
	set : function(a, b) {
		if (String(this.data[a]) == String(b)) {
			return
		}
		this.dirty = true;
		if (!this.modified) {
			this.modified = {}
		}
		if (typeof this.modified[a] == "undefined") {
			this.modified[a] = this.data[a]
		}
		this.data[a] = b;
		if (!this.editing && this.store) {
			this.store.afterEdit(this)
		}
	},
	get : function(a) {
		return this.data[a]
	},
	beginEdit : function() {
		this.editing = true;
		this.modified = {}
	},
	cancelEdit : function() {
		this.editing = false;
		delete this.modified
	},
	endEdit : function() {
		this.editing = false;
		if (this.dirty && this.store) {
			this.store.afterEdit(this)
		}
	},
	reject : function(b) {
		var a = this.modified;
		for (var c in a) {
			if (typeof a[c] != "function") {
				this.data[c] = a[c]
			}
		}
		this.dirty = false;
		delete this.modified;
		this.editing = false;
		if (this.store && b !== true) {
			this.store.afterReject(this)
		}
	},
	commit : function(a) {
		this.dirty = false;
		delete this.modified;
		this.editing = false;
		if (this.store && a !== true) {
			this.store.afterCommit(this)
		}
	},
	getChanges : function() {
		var a = this.modified, b = {};
		for (var c in a) {
			if (a.hasOwnProperty(c)) {
				b[c] = this.data[c]
			}
		}
		return b
	},
	hasError : function() {
		return this.error != null
	},
	clearError : function() {
		this.error = null
	},
	copy : function(a) {
		return new this.constructor(Ext.apply({}, this.data), a || this.id)
	},
	isModified : function(a) {
		return !!(this.modified && this.modified.hasOwnProperty(a))
	}
};