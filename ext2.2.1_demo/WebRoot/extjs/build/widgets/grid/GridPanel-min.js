Ext.grid.GridPanel = Ext.extend(Ext.Panel, {
	ddText : "{0} selected row{1}",
	minColumnWidth : 25,
	trackMouseOver : true,
	enableDragDrop : false,
	enableColumnMove : true,
	enableColumnHide : true,
	enableHdMenu : true,
	stripeRows : false,
	autoExpandColumn : false,
	autoExpandMin : 50,
	autoExpandMax : 1000,
	view : null,
	loadMask : false,
	deferRowRender : true,
	rendered : false,
	viewReady : false,
	stateEvents : ["columnmove", "columnresize", "sortchange"],
	initComponent : function() {
		Ext.grid.GridPanel.superclass.initComponent.call(this);
		this.autoScroll = false;
		this.autoWidth = false;
		if (Ext.isArray(this.columns)) {
			this.colModel = new Ext.grid.ColumnModel(this.columns);
			delete this.columns
		}
		if (this.ds) {
			this.store = this.ds;
			delete this.ds
		}
		if (this.cm) {
			this.colModel = this.cm;
			delete this.cm
		}
		if (this.sm) {
			this.selModel = this.sm;
			delete this.sm
		}
		this.store = Ext.StoreMgr.lookup(this.store);
		this.addEvents("click", "dblclick", "contextmenu", "mousedown",
				"mouseup", "mouseover", "mouseout", "keypress", "keydown",
				"cellmousedown", "rowmousedown", "headermousedown",
				"cellclick", "celldblclick", "rowclick", "rowdblclick",
				"headerclick", "headerdblclick", "rowcontextmenu",
				"cellcontextmenu", "headercontextmenu", "bodyscroll",
				"columnresize", "columnmove", "sortchange")
	},
	onRender : function(d, a) {
		Ext.grid.GridPanel.superclass.onRender.apply(this, arguments);
		var e = this.body;
		this.el.addClass("x-grid-panel");
		var b = this.getView();
		b.init(this);
		e.on("mousedown", this.onMouseDown, this);
		e.on("click", this.onClick, this);
		e.on("dblclick", this.onDblClick, this);
		e.on("contextmenu", this.onContextMenu, this);
		e.on("keydown", this.onKeyDown, this);
		this.relayEvents(e, ["mousedown", "mouseup", "mouseover", "mouseout",
						"keypress"]);
		this.getSelectionModel().init(this);
		this.view.render()
	},
	initEvents : function() {
		Ext.grid.GridPanel.superclass.initEvents.call(this);
		if (this.loadMask) {
			this.loadMask = new Ext.LoadMask(this.bwrap, Ext.apply({
								store : this.store
							}, this.loadMask))
		}
	},
	initStateEvents : function() {
		Ext.grid.GridPanel.superclass.initStateEvents.call(this);
		this.colModel.on("hiddenchange", this.saveState, this, {
					delay : 100
				})
	},
	applyState : function(g) {
		var b = this.colModel;
		var f = g.columns;
		if (f) {
			for (var d = 0, a = f.length; d < a; d++) {
				var e = f[d];
				var j = b.getColumnById(e.id);
				if (j) {
					j.hidden = e.hidden;
					j.width = e.width;
					var h = b.getIndexById(e.id);
					if (h != d) {
						b.moveColumn(h, d)
					}
				}
			}
		}
		if (g.sort) {
			this.store[this.store.remoteSort ? "setDefaultSort" : "sort"](
					g.sort.field, g.sort.direction)
		}
	},
	getState : function() {
		var d = {
			columns : []
		};
		for (var b = 0, e; e = this.colModel.config[b]; b++) {
			d.columns[b] = {
				id : e.id,
				width : e.width
			};
			if (e.hidden) {
				d.columns[b].hidden = true
			}
		}
		var a = this.store.getSortState();
		if (a) {
			d.sort = a
		}
		return d
	},
	afterRender : function() {
		Ext.grid.GridPanel.superclass.afterRender.call(this);
		this.view.layout();
		if (this.deferRowRender) {
			this.view.afterRender.defer(10, this.view)
		} else {
			this.view.afterRender()
		}
		this.viewReady = true
	},
	reconfigure : function(a, b) {
		if (this.loadMask) {
			this.loadMask.destroy();
			this.loadMask = new Ext.LoadMask(this.bwrap, Ext.apply({
								store : a
							}, this.initialConfig.loadMask))
		}
		this.view.bind(a, b);
		this.store = a;
		this.colModel = b;
		if (this.rendered) {
			this.view.refresh(true)
		}
	},
	onKeyDown : function(a) {
		this.fireEvent("keydown", a)
	},
	onDestroy : function() {
		if (this.rendered) {
			if (this.loadMask) {
				this.loadMask.destroy()
			}
			var a = this.body;
			a.removeAllListeners();
			this.view.destroy();
			a.update("")
		}
		this.colModel.purgeListeners();
		Ext.grid.GridPanel.superclass.onDestroy.call(this)
	},
	processEvent : function(c, f) {
		this.fireEvent(c, f);
		var d = f.getTarget();
		var b = this.view;
		var h = b.findHeaderIndex(d);
		if (h !== false) {
			this.fireEvent("header" + c, this, h, f)
		} else {
			var g = b.findRowIndex(d);
			var a = b.findCellIndex(d);
			if (g !== false) {
				this.fireEvent("row" + c, this, g, f);
				if (a !== false) {
					this.fireEvent("cell" + c, this, g, a, f)
				}
			}
		}
	},
	onClick : function(a) {
		this.processEvent("click", a)
	},
	onMouseDown : function(a) {
		this.processEvent("mousedown", a)
	},
	onContextMenu : function(b, a) {
		this.processEvent("contextmenu", b)
	},
	onDblClick : function(a) {
		this.processEvent("dblclick", a)
	},
	walkCells : function(j, c, b, e, i) {
		var h = this.colModel, f = h.getColumnCount();
		var a = this.store, g = a.getCount(), d = true;
		if (b < 0) {
			if (c < 0) {
				j--;
				d = false
			}
			while (j >= 0) {
				if (!d) {
					c = f - 1
				}
				d = false;
				while (c >= 0) {
					if (e.call(i || this, j, c, h) === true) {
						return [j, c]
					}
					c--
				}
				j--
			}
		} else {
			if (c >= f) {
				j++;
				d = false
			}
			while (j < g) {
				if (!d) {
					c = 0
				}
				d = false;
				while (c < f) {
					if (e.call(i || this, j, c, h) === true) {
						return [j, c]
					}
					c++
				}
				j++
			}
		}
		return null
	},
	getSelections : function() {
		return this.selModel.getSelections()
	},
	onResize : function() {
		Ext.grid.GridPanel.superclass.onResize.apply(this, arguments);
		if (this.viewReady) {
			this.view.layout()
		}
	},
	getGridEl : function() {
		return this.body
	},
	stopEditing : Ext.emptyFn,
	getSelectionModel : function() {
		if (!this.selModel) {
			this.selModel = new Ext.grid.RowSelectionModel(this.disableSelection
					? {
						selectRow : Ext.emptyFn
					}
					: null)
		}
		return this.selModel
	},
	getStore : function() {
		return this.store
	},
	getColumnModel : function() {
		return this.colModel
	},
	getView : function() {
		if (!this.view) {
			this.view = new Ext.grid.GridView(this.viewConfig)
		}
		return this.view
	},
	getDragDropText : function() {
		var a = this.selModel.getCount();
		return String.format(this.ddText, a, a == 1 ? "" : "s")
	}
});
Ext.reg("grid", Ext.grid.GridPanel);