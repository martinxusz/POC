Ext.grid.ColumnModel = function(a) {
	this.defaultWidth = 100;
	this.defaultSortable = false;
	if (a.columns) {
		Ext.apply(this, a);
		this.setConfig(a.columns, true)
	} else {
		this.setConfig(a, true)
	}
	this.addEvents("widthchange", "headerchange", "hiddenchange",
			"columnmoved", "columnlockchange", "configchange");
	Ext.grid.ColumnModel.superclass.constructor.call(this)
};
Ext.extend(Ext.grid.ColumnModel, Ext.util.Observable, {
	getColumnId : function(a) {
		return this.config[a].id
	},
	setConfig : function(d, b) {
		if (!b) {
			delete this.totalWidth;
			for (var e = 0, a = this.config.length; e < a; e++) {
				var f = this.config[e];
				if (f.editor) {
					f.editor.destroy()
				}
			}
		}
		this.config = d;
		this.lookup = {};
		for (var e = 0, a = d.length; e < a; e++) {
			var f = d[e];
			if (typeof f.renderer == "string") {
				f.renderer = Ext.util.Format[f.renderer]
			}
			if (typeof f.id == "undefined") {
				f.id = e
			}
			if (f.editor && f.editor.isFormField) {
				f.editor = new Ext.grid.GridEditor(f.editor)
			}
			this.lookup[f.id] = f
		}
		if (!b) {
			this.fireEvent("configchange", this)
		}
	},
	getColumnById : function(a) {
		return this.lookup[a]
	},
	getIndexById : function(c) {
		for (var b = 0, a = this.config.length; b < a; b++) {
			if (this.config[b].id == c) {
				return b
			}
		}
		return -1
	},
	moveColumn : function(d, a) {
		var b = this.config[d];
		this.config.splice(d, 1);
		this.config.splice(a, 0, b);
		this.dataMap = null;
		this.fireEvent("columnmoved", this, d, a)
	},
	isLocked : function(a) {
		return this.config[a].locked === true
	},
	setLocked : function(b, c, a) {
		if (this.isLocked(b) == c) {
			return
		}
		this.config[b].locked = c;
		if (!a) {
			this.fireEvent("columnlockchange", this, b, c)
		}
	},
	getTotalLockedWidth : function() {
		var a = 0;
		for (var b = 0; b < this.config.length; b++) {
			if (this.isLocked(b) && !this.isHidden(b)) {
				this.totalWidth += this.getColumnWidth(b)
			}
		}
		return a
	},
	getLockedCount : function() {
		for (var b = 0, a = this.config.length; b < a; b++) {
			if (!this.isLocked(b)) {
				return b
			}
		}
	},
	getColumnCount : function(d) {
		if (d === true) {
			var e = 0;
			for (var b = 0, a = this.config.length; b < a; b++) {
				if (!this.isHidden(b)) {
					e++
				}
			}
			return e
		}
		return this.config.length
	},
	getColumnsBy : function(e, d) {
		var f = [];
		for (var b = 0, a = this.config.length; b < a; b++) {
			var g = this.config[b];
			if (e.call(d || this, g, b) === true) {
				f[f.length] = g
			}
		}
		return f
	},
	isSortable : function(a) {
		if (typeof this.config[a].sortable == "undefined") {
			return this.defaultSortable
		}
		return this.config[a].sortable
	},
	isMenuDisabled : function(a) {
		return !!this.config[a].menuDisabled
	},
	getRenderer : function(a) {
		if (!this.config[a].renderer) {
			return Ext.grid.ColumnModel.defaultRenderer
		}
		return this.config[a].renderer
	},
	setRenderer : function(a, b) {
		this.config[a].renderer = b
	},
	getColumnWidth : function(a) {
		return this.config[a].width || this.defaultWidth
	},
	setColumnWidth : function(b, c, a) {
		this.config[b].width = c;
		this.totalWidth = null;
		if (!a) {
			this.fireEvent("widthchange", this, b, c)
		}
	},
	getTotalWidth : function(b) {
		if (!this.totalWidth) {
			this.totalWidth = 0;
			for (var c = 0, a = this.config.length; c < a; c++) {
				if (b || !this.isHidden(c)) {
					this.totalWidth += this.getColumnWidth(c)
				}
			}
		}
		return this.totalWidth
	},
	getColumnHeader : function(a) {
		return this.config[a].header
	},
	setColumnHeader : function(a, b) {
		this.config[a].header = b;
		this.fireEvent("headerchange", this, a, b)
	},
	getColumnTooltip : function(a) {
		return this.config[a].tooltip
	},
	setColumnTooltip : function(a, b) {
		this.config[a].tooltip = b
	},
	getDataIndex : function(a) {
		return this.config[a].dataIndex
	},
	setDataIndex : function(a, b) {
		this.config[a].dataIndex = b
	},
	findColumnIndex : function(d) {
		var e = this.config;
		for (var b = 0, a = e.length; b < a; b++) {
			if (e[b].dataIndex == d) {
				return b
			}
		}
		return -1
	},
	isCellEditable : function(a, b) {
		return (this.config[a].editable || (typeof this.config[a].editable == "undefined" && this.config[a].editor))
				? true
				: false
	},
	getCellEditor : function(a, b) {
		return this.config[a].editor
	},
	setEditable : function(a, b) {
		this.config[a].editable = b
	},
	isHidden : function(a) {
		return this.config[a].hidden
	},
	isFixed : function(a) {
		return this.config[a].fixed
	},
	isResizable : function(a) {
		return a >= 0 && this.config[a].resizable !== false
				&& this.config[a].fixed !== true
	},
	setHidden : function(a, b) {
		var d = this.config[a];
		if (d.hidden !== b) {
			d.hidden = b;
			this.totalWidth = null;
			this.fireEvent("hiddenchange", this, a, b)
		}
	},
	setEditor : function(a, b) {
		this.config[a].editor = b
	}
});
Ext.grid.ColumnModel.defaultRenderer = function(a) {
	if (typeof a == "string" && a.length < 1) {
		return "&#160;"
	}
	return a
};
Ext.grid.DefaultColumnModel = Ext.grid.ColumnModel;