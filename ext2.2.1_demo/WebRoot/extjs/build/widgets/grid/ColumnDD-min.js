Ext.grid.HeaderDragZone = function(a, c, b) {
	this.grid = a;
	this.view = a.getView();
	this.ddGroup = "gridHeader" + this.grid.getGridEl().id;
	Ext.grid.HeaderDragZone.superclass.constructor.call(this, c);
	if (b) {
		this.setHandleElId(Ext.id(c));
		this.setOuterHandleElId(Ext.id(b))
	}
	this.scroll = false
};
Ext.extend(Ext.grid.HeaderDragZone, Ext.dd.DragZone, {
			maxDragWidth : 120,
			getDragData : function(c) {
				var a = Ext.lib.Event.getTarget(c);
				var b = this.view.findHeaderCell(a);
				if (b) {
					return {
						ddel : b.firstChild,
						header : b
					}
				}
				return false
			},
			onInitDrag : function(a) {
				this.view.headersDisabled = true;
				var b = this.dragData.ddel.cloneNode(true);
				b.id = Ext.id();
				b.style.width = Math.min(this.dragData.header.offsetWidth,
						this.maxDragWidth)
						+ "px";
				this.proxy.update(b);
				return true
			},
			afterValidDrop : function() {
				var a = this.view;
				setTimeout(function() {
							a.headersDisabled = false
						}, 50)
			},
			afterInvalidDrop : function() {
				var a = this.view;
				setTimeout(function() {
							a.headersDisabled = false
						}, 50)
			}
		});
Ext.grid.HeaderDropZone = function(a, c, b) {
	this.grid = a;
	this.view = a.getView();
	this.proxyTop = Ext.DomHelper.append(document.body, {
				cls : "col-move-top",
				html : "&#160;"
			}, true);
	this.proxyBottom = Ext.DomHelper.append(document.body, {
				cls : "col-move-bottom",
				html : "&#160;"
			}, true);
	this.proxyTop.hide = this.proxyBottom.hide = function() {
		this.setLeftTop(-100, -100);
		this.setStyle("visibility", "hidden")
	};
	this.ddGroup = "gridHeader" + this.grid.getGridEl().id;
	Ext.grid.HeaderDropZone.superclass.constructor
			.call(this, a.getGridEl().dom)
};
Ext.extend(Ext.grid.HeaderDropZone, Ext.dd.DropZone, {
			proxyOffsets : [-4, -9],
			fly : Ext.Element.fly,
			getTargetFromEvent : function(c) {
				var a = Ext.lib.Event.getTarget(c);
				var b = this.view.findCellIndex(a);
				if (b !== false) {
					return this.view.getHeaderCell(b)
				}
			},
			nextVisible : function(c) {
				var b = this.view, a = this.grid.colModel;
				c = c.nextSibling;
				while (c) {
					if (!a.isHidden(b.getCellIndex(c))) {
						return c
					}
					c = c.nextSibling
				}
				return null
			},
			prevVisible : function(c) {
				var b = this.view, a = this.grid.colModel;
				c = c.prevSibling;
				while (c) {
					if (!a.isHidden(b.getCellIndex(c))) {
						return c
					}
					c = c.prevSibling
				}
				return null
			},
			positionIndicator : function(d, b, f) {
				var j = Ext.lib.Event.getPageX(f);
				var a = Ext.lib.Dom.getRegion(b.firstChild);
				var k, m, i = a.top + this.proxyOffsets[1];
				if ((a.right - j) <= (a.right - a.left) / 2) {
					k = a.right + this.view.borderWidth;
					m = "after"
				} else {
					k = a.left;
					m = "before"
				}
				var g = this.view.getCellIndex(d);
				var l = this.view.getCellIndex(b);
				if (this.grid.colModel.isFixed(l)) {
					return false
				}
				var c = this.grid.colModel.isLocked(l);
				if (m == "after") {
					l++
				}
				if (g < l) {
					l--
				}
				if (g == l && (c == this.grid.colModel.isLocked(g))) {
					return false
				}
				k += this.proxyOffsets[0];
				this.proxyTop.setLeftTop(k, i);
				this.proxyTop.show();
				if (!this.bottomOffset) {
					this.bottomOffset = this.view.mainHd.getHeight()
				}
				this.proxyBottom.setLeftTop(k, i
								+ this.proxyTop.dom.offsetHeight
								+ this.bottomOffset);
				this.proxyBottom.show();
				return m
			},
			onNodeEnter : function(d, a, c, b) {
				if (b.header != d) {
					this.positionIndicator(b.header, d, c)
				}
			},
			onNodeOver : function(f, b, d, c) {
				var a = false;
				if (c.header != f) {
					a = this.positionIndicator(c.header, f, d)
				}
				if (!a) {
					this.proxyTop.hide();
					this.proxyBottom.hide()
				}
				return a ? this.dropAllowed : this.dropNotAllowed
			},
			onNodeOut : function(d, a, c, b) {
				this.proxyTop.hide();
				this.proxyBottom.hide()
			},
			onNodeDrop : function(b, m, g, d) {
				var f = d.header;
				if (f != b) {
					var k = this.grid.colModel;
					var j = Ext.lib.Event.getPageX(g);
					var a = Ext.lib.Dom.getRegion(b.firstChild);
					var o = (a.right - j) <= ((a.right - a.left) / 2)
							? "after"
							: "before";
					var i = this.view.getCellIndex(f);
					var l = this.view.getCellIndex(b);
					var c = k.isLocked(l);
					if (o == "after") {
						l++
					}
					if (i < l) {
						l--
					}
					if (i == l && (c == k.isLocked(i))) {
						return false
					}
					k.setLocked(i, c, true);
					k.moveColumn(i, l);
					this.grid.fireEvent("columnmove", i, l);
					return true
				}
				return false
			}
		});
Ext.grid.GridView.ColumnDragZone = function(a, b) {
	Ext.grid.GridView.ColumnDragZone.superclass.constructor.call(this, a, b,
			null);
	this.proxy.el.addClass("x-grid3-col-dd")
};
Ext.extend(Ext.grid.GridView.ColumnDragZone, Ext.grid.HeaderDragZone, {
			handleMouseDown : function(a) {
			},
			callHandleMouseDown : function(a) {
				Ext.grid.GridView.ColumnDragZone.superclass.handleMouseDown
						.call(this, a)
			}
		});