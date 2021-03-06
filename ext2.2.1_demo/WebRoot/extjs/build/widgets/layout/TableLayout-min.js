Ext.layout.TableLayout = Ext.extend(Ext.layout.ContainerLayout, {
			monitorResize : false,
			setContainer : function(a) {
				Ext.layout.TableLayout.superclass.setContainer.call(this, a);
				this.currentRow = 0;
				this.currentColumn = 0;
				this.cells = []
			},
			onLayout : function(d, f) {
				var e = d.items.items, a = e.length, g, b;
				if (!this.table) {
					f.addClass("x-table-layout-ct");
					this.table = f.createChild({
								tag : "table",
								cls : "x-table-layout",
								cellspacing : 0,
								cn : {
									tag : "tbody"
								}
							}, null, true);
					this.renderAll(d, f)
				}
			},
			getRow : function(a) {
				var b = this.table.tBodies[0].childNodes[a];
				if (!b) {
					b = document.createElement("tr");
					this.table.tBodies[0].appendChild(b)
				}
				return b
			},
			getNextCell : function(i) {
				var a = this
						.getNextNonSpan(this.currentColumn, this.currentRow);
				var f = this.currentColumn = a[0], e = this.currentRow = a[1];
				for (var h = e; h < e + (i.rowspan || 1); h++) {
					if (!this.cells[h]) {
						this.cells[h] = []
					}
					for (var d = f; d < f + (i.colspan || 1); d++) {
						this.cells[h][d] = true
					}
				}
				var g = document.createElement("td");
				if (i.cellId) {
					g.id = i.cellId
				}
				var b = "x-table-layout-cell";
				if (i.cellCls) {
					b += " " + i.cellCls
				}
				g.className = b;
				if (i.colspan) {
					g.colSpan = i.colspan
				}
				if (i.rowspan) {
					g.rowSpan = i.rowspan
				}
				this.getRow(e).appendChild(g);
				return g
			},
			getNextNonSpan : function(a, c) {
				var b = this.columns;
				while ((b && a >= b) || (this.cells[c] && this.cells[c][a])) {
					if (b && a >= b) {
						c++;
						a = 0
					} else {
						a++
					}
				}
				return [a, c]
			},
			renderItem : function(e, a, d) {
				if (e && !e.rendered) {
					e.render(this.getNextCell(e));
					if (this.extraCls) {
						var b = e.getPositionEl ? e.getPositionEl() : e;
						b.addClass(this.extraCls)
					}
				}
			},
			isValidParent : function(b, a) {
				return true
			}
		});
Ext.Container.LAYOUTS.table = Ext.layout.TableLayout;