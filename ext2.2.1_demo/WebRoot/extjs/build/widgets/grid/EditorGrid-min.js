Ext.grid.EditorGridPanel = Ext.extend(Ext.grid.GridPanel, {
			clicksToEdit : 2,
			isEditor : true,
			detectEdit : false,
			autoEncode : false,
			trackMouseOver : false,
			initComponent : function() {
				Ext.grid.EditorGridPanel.superclass.initComponent.call(this);
				if (!this.selModel) {
					this.selModel = new Ext.grid.CellSelectionModel()
				}
				this.activeEditor = null;
				this.addEvents("beforeedit", "afteredit", "validateedit")
			},
			initEvents : function() {
				Ext.grid.EditorGridPanel.superclass.initEvents.call(this);
				this.on("bodyscroll", this.stopEditing, this, [true]);
				this.on("columnresize", this.stopEditing, this, [true]);
				if (this.clicksToEdit == 1) {
					this.on("cellclick", this.onCellDblClick, this)
				} else {
					if (this.clicksToEdit == "auto" && this.view.mainBody) {
						this.view.mainBody.on("mousedown",
								this.onAutoEditClick, this)
					}
					this.on("celldblclick", this.onCellDblClick, this)
				}
			},
			onCellDblClick : function(b, c, a) {
				this.startEditing(c, a)
			},
			onAutoEditClick : function(c, b) {
				if (c.button !== 0) {
					return
				}
				var f = this.view.findRowIndex(b);
				var a = this.view.findCellIndex(b);
				if (f !== false && a !== false) {
					this.stopEditing();
					if (this.selModel.getSelectedCell) {
						var d = this.selModel.getSelectedCell();
						if (d && d.cell[0] === f && d.cell[1] === a) {
							this.startEditing(f, a)
						}
					} else {
						if (this.selModel.isSelected(f)) {
							this.startEditing(f, a)
						}
					}
				}
			},
			onEditComplete : function(b, d, a) {
				this.editing = false;
				this.activeEditor = null;
				b.un("specialkey", this.selModel.onEditorKey, this.selModel);
				var c = b.record;
				var g = this.colModel.getDataIndex(b.col);
				d = this.postEditValue(d, a, c, g);
				if (String(d) !== String(a)) {
					var f = {
						grid : this,
						record : c,
						field : g,
						originalValue : a,
						value : d,
						row : b.row,
						column : b.col,
						cancel : false
					};
					if (this.fireEvent("validateedit", f) !== false
							&& !f.cancel) {
						c.set(g, f.value);
						delete f.cancel;
						this.fireEvent("afteredit", f)
					}
				}
				this.view.focusCell(b.row, b.col)
			},
			startEditing : function(g, b) {
				this.stopEditing();
				if (this.colModel.isCellEditable(b, g)) {
					this.view.ensureVisible(g, b, true);
					var c = this.store.getAt(g);
					var f = this.colModel.getDataIndex(b);
					var d = {
						grid : this,
						record : c,
						field : f,
						value : c.data[f],
						row : g,
						column : b,
						cancel : false
					};
					if (this.fireEvent("beforeedit", d) !== false && !d.cancel) {
						this.editing = true;
						var a = this.colModel.getCellEditor(b, g);
						if (!a.rendered) {
							a.render(this.view.getEditorParent(a))
						}
(function				() {
							a.row = g;
							a.col = b;
							a.record = c;
							a.on("complete", this.onEditComplete, this, {
										single : true
									});
							a.on("specialkey", this.selModel.onEditorKey,
									this.selModel);
							this.activeEditor = a;
							var e = this.preEditValue(c, f);
							a.startEdit(this.view.getCell(g, b).firstChild,
									e === undefined ? "" : e)
						}).defer(50, this)
					}
				}
			},
			preEditValue : function(a, c) {
				var b = a.data[c];
				return this.autoEncode && typeof b == "string"
						? Ext.util.Format.htmlDecode(b)
						: b
			},
			postEditValue : function(c, a, b, d) {
				return this.autoEncode && typeof c == "string"
						? Ext.util.Format.htmlEncode(c)
						: c
			},
			stopEditing : function(a) {
				if (this.activeEditor) {
					this.activeEditor[a === true
							? "cancelEdit"
							: "completeEdit"]()
				}
				this.activeEditor = null
			},
			onDestroy : function() {
				if (this.rendered) {
					var d = this.colModel.config;
					for (var b = 0, a = d.length; b < a; b++) {
						var e = d[b];
						Ext.destroy(e.editor)
					}
				}
				Ext.grid.EditorGridPanel.superclass.onDestroy.call(this)
			}
		});
Ext.reg("editorgrid", Ext.grid.EditorGridPanel);