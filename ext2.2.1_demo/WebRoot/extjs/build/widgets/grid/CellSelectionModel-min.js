Ext.grid.CellSelectionModel = function(a) {
	Ext.apply(this, a);
	this.selection = null;
	this.addEvents("beforecellselect", "cellselect", "selectionchange");
	Ext.grid.CellSelectionModel.superclass.constructor.call(this)
};
Ext.extend(Ext.grid.CellSelectionModel, Ext.grid.AbstractSelectionModel, {
			initEvents : function() {
				this.grid.on("cellmousedown", this.handleMouseDown, this);
				this.grid.getGridEl().on(
						Ext.isIE || Ext.isSafari3 ? "keydown" : "keypress",
						this.handleKeyDown, this);
				var a = this.grid.view;
				a.on("refresh", this.onViewChange, this);
				a.on("rowupdated", this.onRowUpdated, this);
				a.on("beforerowremoved", this.clearSelections, this);
				a.on("beforerowsinserted", this.clearSelections, this);
				if (this.grid.isEditor) {
					this.grid.on("beforeedit", this.beforeEdit, this)
				}
			},
			beforeEdit : function(a) {
				this.select(a.row, a.column, false, true, a.record)
			},
			onRowUpdated : function(a, b, c) {
				if (this.selection && this.selection.record == c) {
					a.onCellSelect(b, this.selection.cell[1])
				}
			},
			onViewChange : function() {
				this.clearSelections(true)
			},
			getSelectedCell : function() {
				return this.selection ? this.selection.cell : null
			},
			clearSelections : function(b) {
				var a = this.selection;
				if (a) {
					if (b !== true) {
						this.grid.view.onCellDeselect(a.cell[0], a.cell[1])
					}
					this.selection = null;
					this.fireEvent("selectionchange", this, null)
				}
			},
			hasSelection : function() {
				return this.selection ? true : false
			},
			handleMouseDown : function(b, d, a, c) {
				if (c.button !== 0 || this.isLocked()) {
					return
				}
				this.select(d, a)
			},
			select : function(f, c, b, e, d) {
				if (this.fireEvent("beforecellselect", this, f, c) !== false) {
					this.clearSelections();
					d = d || this.grid.store.getAt(f);
					this.selection = {
						record : d,
						cell : [f, c]
					};
					if (!b) {
						var a = this.grid.getView();
						a.onCellSelect(f, c);
						if (e !== true) {
							a.focusCell(f, c)
						}
					}
					this.fireEvent("cellselect", this, f, c);
					this.fireEvent("selectionchange", this, this.selection)
				}
			},
			isSelectable : function(c, b, a) {
				return !a.isHidden(b)
			},
			handleKeyDown : function(i) {
				if (!i.isNavKeyPress()) {
					return
				}
				var h = this.grid, n = this.selection;
				if (!n) {
					i.stopEvent();
					var m = h.walkCells(0, 0, 1, this.isSelectable, this);
					if (m) {
						this.select(m[0], m[1])
					}
					return
				}
				var b = this;
				var l = function(g, c, e) {
					return h.walkCells(g, c, e, b.isSelectable, b)
				};
				var d = i.getKey(), a = n.cell[0], j = n.cell[1];
				var f;
				switch (d) {
					case i.TAB :
						if (i.shiftKey) {
							f = l(a, j - 1, -1)
						} else {
							f = l(a, j + 1, 1)
						}
						break;
					case i.DOWN :
						f = l(a + 1, j, 1);
						break;
					case i.UP :
						f = l(a - 1, j, -1);
						break;
					case i.RIGHT :
						f = l(a, j + 1, 1);
						break;
					case i.LEFT :
						f = l(a, j - 1, -1);
						break;
					case i.ENTER :
						if (h.isEditor && !h.editing) {
							h.startEditing(a, j);
							i.stopEvent();
							return
						}
						break
				}
				if (f) {
					this.select(f[0], f[1]);
					i.stopEvent()
				}
			},
			acceptsNav : function(c, b, a) {
				return !a.isHidden(b) && a.isCellEditable(b, c)
			},
			onEditorKey : function(f, d) {
				var b = d.getKey(), h, c = this.grid, a = c.activeEditor;
				if (b == d.TAB) {
					if (d.shiftKey) {
						h = c.walkCells(a.row, a.col - 1, -1, this.acceptsNav,
								this)
					} else {
						h = c.walkCells(a.row, a.col + 1, 1, this.acceptsNav,
								this)
					}
					d.stopEvent()
				} else {
					if (b == d.ENTER) {
						a.completeEdit();
						d.stopEvent()
					} else {
						if (b == d.ESC) {
							d.stopEvent();
							a.cancelEdit()
						}
					}
				}
				if (h) {
					c.startEditing(h[0], h[1])
				}
			}
		});