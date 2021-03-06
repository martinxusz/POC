Ext.grid.SplitDragZone = function(a, c, b) {
	this.grid = a;
	this.view = a.getView();
	this.proxy = this.view.resizeProxy;
	Ext.grid.SplitDragZone.superclass.constructor.call(this, c, "gridSplitters"
					+ this.grid.getGridEl().id, {
				dragElId : Ext.id(this.proxy.dom),
				resizeFrame : false
			});
	this.setHandleElId(Ext.id(c));
	this.setOuterHandleElId(Ext.id(b));
	this.scroll = false
};
Ext.extend(Ext.grid.SplitDragZone, Ext.dd.DDProxy, {
			fly : Ext.Element.fly,
			b4StartDrag : function(a, d) {
				this.view.headersDisabled = true;
				this.proxy.setHeight(this.view.mainWrap.getHeight());
				var b = this.cm.getColumnWidth(this.cellIndex);
				var c = Math.max(b - this.grid.minColumnWidth, 0);
				this.resetConstraints();
				this.setXConstraint(c, 1000);
				this.setYConstraint(0, 0);
				this.minX = a - c;
				this.maxX = a + 1000;
				this.startPos = a;
				Ext.dd.DDProxy.prototype.b4StartDrag.call(this, a, d)
			},
			handleMouseDown : function(b) {
				ev = Ext.EventObject.setEvent(b);
				var a = this.fly(ev.getTarget());
				if (a.hasClass("x-grid-split")) {
					this.cellIndex = this.view.getCellIndex(a.dom);
					this.split = a.dom;
					this.cm = this.grid.colModel;
					if (this.cm.isResizable(this.cellIndex)
							&& !this.cm.isFixed(this.cellIndex)) {
						Ext.grid.SplitDragZone.superclass.handleMouseDown
								.apply(this, arguments)
					}
				}
			},
			endDrag : function(c) {
				this.view.headersDisabled = false;
				var a = Math.max(this.minX, Ext.lib.Event.getPageX(c));
				var b = a - this.startPos;
				this.view.onColumnSplitterMoved(this.cellIndex, this.cm
								.getColumnWidth(this.cellIndex)
								+ b)
			},
			autoOffset : function() {
				this.setDelta(0, 0)
			}
		});