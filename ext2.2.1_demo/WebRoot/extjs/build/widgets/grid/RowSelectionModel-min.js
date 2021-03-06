Ext.grid.RowSelectionModel = function(a) {
	Ext.apply(this, a);
	this.selections = new Ext.util.MixedCollection(false, function(b) {
				return b.id
			});
	this.last = false;
	this.lastActive = false;
	this.addEvents("selectionchange", "beforerowselect", "rowselect",
			"rowdeselect");
	Ext.grid.RowSelectionModel.superclass.constructor.call(this)
};
Ext.extend(Ext.grid.RowSelectionModel, Ext.grid.AbstractSelectionModel, {
			singleSelect : false,
			initEvents : function() {
				if (!this.grid.enableDragDrop && !this.grid.enableDrag) {
					this.grid.on("rowmousedown", this.handleMouseDown, this)
				} else {
					this.grid.on("rowclick", function(b, d, c) {
								if (c.button === 0 && !c.shiftKey && !c.ctrlKey) {
									this.selectRow(d, false);
									b.view.focusRow(d)
								}
							}, this)
				}
				this.rowNav = new Ext.KeyNav(this.grid.getGridEl(), {
							up : function(c) {
								if (!c.shiftKey || this.singleSelect) {
									this.selectPrevious(false)
								} else {
									if (this.last !== false
											&& this.lastActive !== false) {
										var b = this.last;
										this.selectRange(this.last,
												this.lastActive - 1);
										this.grid.getView()
												.focusRow(this.lastActive);
										if (b !== false) {
											this.last = b
										}
									} else {
										this.selectFirstRow()
									}
								}
							},
							down : function(c) {
								if (!c.shiftKey || this.singleSelect) {
									this.selectNext(false)
								} else {
									if (this.last !== false
											&& this.lastActive !== false) {
										var b = this.last;
										this.selectRange(this.last,
												this.lastActive + 1);
										this.grid.getView()
												.focusRow(this.lastActive);
										if (b !== false) {
											this.last = b
										}
									} else {
										this.selectFirstRow()
									}
								}
							},
							scope : this
						});
				var a = this.grid.view;
				a.on("refresh", this.onRefresh, this);
				a.on("rowupdated", this.onRowUpdated, this);
				a.on("rowremoved", this.onRemove, this)
			},
			onRefresh : function() {
				var f = this.grid.store, b;
				var d = this.getSelections();
				this.clearSelections(true);
				for (var c = 0, a = d.length; c < a; c++) {
					var e = d[c];
					if ((b = f.indexOfId(e.id)) != -1) {
						this.selectRow(b, true)
					}
				}
				if (d.length != this.selections.getCount()) {
					this.fireEvent("selectionchange", this)
				}
			},
			onRemove : function(a, b, c) {
				if (this.selections.remove(c) !== false) {
					this.fireEvent("selectionchange", this)
				}
			},
			onRowUpdated : function(a, b, c) {
				if (this.isSelected(c)) {
					a.onRowSelect(b)
				}
			},
			selectRecords : function(b, e) {
				if (!e) {
					this.clearSelections()
				}
				var d = this.grid.store;
				for (var c = 0, a = b.length; c < a; c++) {
					this.selectRow(d.indexOf(b[c]), true)
				}
			},
			getCount : function() {
				return this.selections.length
			},
			selectFirstRow : function() {
				this.selectRow(0)
			},
			selectLastRow : function(a) {
				this.selectRow(this.grid.store.getCount() - 1, a)
			},
			selectNext : function(a) {
				if (this.hasNext()) {
					this.selectRow(this.last + 1, a);
					this.grid.getView().focusRow(this.last);
					return true
				}
				return false
			},
			selectPrevious : function(a) {
				if (this.hasPrevious()) {
					this.selectRow(this.last - 1, a);
					this.grid.getView().focusRow(this.last);
					return true
				}
				return false
			},
			hasNext : function() {
				return this.last !== false
						&& (this.last + 1) < this.grid.store.getCount()
			},
			hasPrevious : function() {
				return !!this.last
			},
			getSelections : function() {
				return [].concat(this.selections.items)
			},
			getSelected : function() {
				return this.selections.itemAt(0)
			},
			each : function(e, d) {
				var c = this.getSelections();
				for (var b = 0, a = c.length; b < a; b++) {
					if (e.call(d || this, c[b], b) === false) {
						return false
					}
				}
				return true
			},
			clearSelections : function(a) {
				if (this.isLocked()) {
					return
				}
				if (a !== true) {
					var c = this.grid.store;
					var b = this.selections;
					b.each(function(d) {
								this.deselectRow(c.indexOfId(d.id))
							}, this);
					b.clear()
				} else {
					this.selections.clear()
				}
				this.last = false
			},
			selectAll : function() {
				if (this.isLocked()) {
					return
				}
				this.selections.clear();
				for (var b = 0, a = this.grid.store.getCount(); b < a; b++) {
					this.selectRow(b, true)
				}
			},
			hasSelection : function() {
				return this.selections.length > 0
			},
			isSelected : function(a) {
				var b = typeof a == "number" ? this.grid.store.getAt(a) : a;
				return (b && this.selections.key(b.id) ? true : false)
			},
			isIdSelected : function(a) {
				return (this.selections.key(a) ? true : false)
			},
			handleMouseDown : function(d, h, f) {
				if (f.button !== 0 || this.isLocked()) {
					return
				}
				var a = this.grid.getView();
				if (f.shiftKey && !this.singleSelect && this.last !== false) {
					var c = this.last;
					this.selectRange(c, h, f.ctrlKey);
					this.last = c;
					a.focusRow(h)
				} else {
					var b = this.isSelected(h);
					if (f.ctrlKey && b) {
						this.deselectRow(h)
					} else {
						if (!b || this.getCount() > 1) {
							this.selectRow(h, f.ctrlKey || f.shiftKey);
							a.focusRow(h)
						}
					}
				}
			},
			selectRows : function(c, d) {
				if (!d) {
					this.clearSelections()
				}
				for (var b = 0, a = c.length; b < a; b++) {
					this.selectRow(c[b], true)
				}
			},
			selectRange : function(b, a, d) {
				if (this.isLocked()) {
					return
				}
				if (!d) {
					this.clearSelections()
				}
				if (b <= a) {
					for (var c = b; c <= a; c++) {
						this.selectRow(c, true)
					}
				} else {
					for (var c = b; c >= a; c--) {
						this.selectRow(c, true)
					}
				}
			},
			deselectRange : function(c, b, a) {
				if (this.isLocked()) {
					return
				}
				for (var d = c; d <= b; d++) {
					this.deselectRow(d, a)
				}
			},
			selectRow : function(b, d, a) {
				if (this.isLocked()
						|| (b < 0 || b >= this.grid.store.getCount())
						|| this.isSelected(b)) {
					return
				}
				var c = this.grid.store.getAt(b);
				if (c
						&& this.fireEvent("beforerowselect", this, b, d, c) !== false) {
					if (!d || this.singleSelect) {
						this.clearSelections()
					}
					this.selections.add(c);
					this.last = this.lastActive = b;
					if (!a) {
						this.grid.getView().onRowSelect(b)
					}
					this.fireEvent("rowselect", this, b, c);
					this.fireEvent("selectionchange", this)
				}
			},
			deselectRow : function(b, a) {
				if (this.isLocked()) {
					return
				}
				if (this.last == b) {
					this.last = false
				}
				if (this.lastActive == b) {
					this.lastActive = false
				}
				var c = this.grid.store.getAt(b);
				if (c) {
					this.selections.remove(c);
					if (!a) {
						this.grid.getView().onRowDeselect(b)
					}
					this.fireEvent("rowdeselect", this, b, c);
					this.fireEvent("selectionchange", this)
				}
			},
			restoreLast : function() {
				if (this._last) {
					this.last = this._last
				}
			},
			acceptsNav : function(c, b, a) {
				return !a.isHidden(b) && a.isCellEditable(b, c)
			},
			onEditorKey : function(h, f) {
				var c = f.getKey(), i, d = this.grid, b = d.activeEditor;
				var a = f.shiftKey;
				if (c == f.TAB) {
					f.stopEvent();
					b.completeEdit();
					if (a) {
						i = d.walkCells(b.row, b.col - 1, -1, this.acceptsNav,
								this)
					} else {
						i = d.walkCells(b.row, b.col + 1, 1, this.acceptsNav,
								this)
					}
				} else {
					if (c == f.ENTER) {
						f.stopEvent();
						b.completeEdit();
						if (this.moveEditorOnEnter !== false) {
							if (a) {
								i = d.walkCells(b.row - 1, b.col, -1,
										this.acceptsNav, this)
							} else {
								i = d.walkCells(b.row + 1, b.col, 1,
										this.acceptsNav, this)
							}
						}
					} else {
						if (c == f.ESC) {
							b.cancelEdit()
						}
					}
				}
				if (i) {
					d.startEditing(i[0], i[1])
				}
			}
		});