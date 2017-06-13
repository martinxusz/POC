Ext.dd.DragSource = function(b, a) {
	this.el = Ext.get(b);
	if (!this.dragData) {
		this.dragData = {}
	}
	Ext.apply(this, a);
	if (!this.proxy) {
		this.proxy = new Ext.dd.StatusProxy()
	}
	Ext.dd.DragSource.superclass.constructor.call(this, this.el.dom,
			this.ddGroup || this.group, {
				dragElId : this.proxy.id,
				resizeFrame : false,
				isTarget : false,
				scroll : this.scroll === true
			});
	this.dragging = false
};
Ext.extend(Ext.dd.DragSource, Ext.dd.DDProxy, {
			dropAllowed : "x-dd-drop-ok",
			dropNotAllowed : "x-dd-drop-nodrop",
			getDragData : function(a) {
				return this.dragData
			},
			onDragEnter : function(c, d) {
				var b = Ext.dd.DragDropMgr.getDDById(d);
				this.cachedTarget = b;
				if (this.beforeDragEnter(b, c, d) !== false) {
					if (b.isNotifyTarget) {
						var a = b.notifyEnter(this, c, this.dragData);
						this.proxy.setStatus(a)
					} else {
						this.proxy.setStatus(this.dropAllowed)
					}
					if (this.afterDragEnter) {
						this.afterDragEnter(b, c, d)
					}
				}
			},
			beforeDragEnter : function(b, a, c) {
				return true
			},
			alignElWithMouse : function() {
				Ext.dd.DragSource.superclass.alignElWithMouse.apply(this,
						arguments);
				this.proxy.sync()
			},
			onDragOver : function(c, d) {
				var b = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(d);
				if (this.beforeDragOver(b, c, d) !== false) {
					if (b.isNotifyTarget) {
						var a = b.notifyOver(this, c, this.dragData);
						this.proxy.setStatus(a)
					}
					if (this.afterDragOver) {
						this.afterDragOver(b, c, d)
					}
				}
			},
			beforeDragOver : function(b, a, c) {
				return true
			},
			onDragOut : function(b, c) {
				var a = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(c);
				if (this.beforeDragOut(a, b, c) !== false) {
					if (a.isNotifyTarget) {
						a.notifyOut(this, b, this.dragData)
					}
					this.proxy.reset();
					if (this.afterDragOut) {
						this.afterDragOut(a, b, c)
					}
				}
				this.cachedTarget = null
			},
			beforeDragOut : function(b, a, c) {
				return true
			},
			onDragDrop : function(b, c) {
				var a = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(c);
				if (this.beforeDragDrop(a, b, c) !== false) {
					if (a.isNotifyTarget) {
						if (a.notifyDrop(this, b, this.dragData)) {
							this.onValidDrop(a, b, c)
						} else {
							this.onInvalidDrop(a, b, c)
						}
					} else {
						this.onValidDrop(a, b, c)
					}
					if (this.afterDragDrop) {
						this.afterDragDrop(a, b, c)
					}
				}
				delete this.cachedTarget
			},
			beforeDragDrop : function(b, a, c) {
				return true
			},
			onValidDrop : function(b, a, c) {
				this.hideProxy();
				if (this.afterValidDrop) {
					this.afterValidDrop(b, a, c)
				}
			},
			getRepairXY : function(b, a) {
				return this.el.getXY()
			},
			onInvalidDrop : function(b, a, c) {
				this.beforeInvalidDrop(b, a, c);
				if (this.cachedTarget) {
					if (this.cachedTarget.isNotifyTarget) {
						this.cachedTarget.notifyOut(this, a, this.dragData)
					}
					this.cacheTarget = null
				}
				this.proxy.repair(this.getRepairXY(a, this.dragData),
						this.afterRepair, this);
				if (this.afterInvalidDrop) {
					this.afterInvalidDrop(a, c)
				}
			},
			afterRepair : function() {
				if (Ext.enableFx) {
					this.el.highlight(this.hlColor || "c3daf9")
				}
				this.dragging = false
			},
			beforeInvalidDrop : function(b, a, c) {
				return true
			},
			handleMouseDown : function(b) {
				if (this.dragging) {
					return
				}
				var a = this.getDragData(b);
				if (a && this.onBeforeDrag(a, b) !== false) {
					this.dragData = a;
					this.proxy.stop();
					Ext.dd.DragSource.superclass.handleMouseDown.apply(this,
							arguments)
				}
			},
			onBeforeDrag : function(a, b) {
				return true
			},
			onStartDrag : Ext.emptyFn,
			startDrag : function(a, b) {
				this.proxy.reset();
				this.dragging = true;
				this.proxy.update("");
				this.onInitDrag(a, b);
				this.proxy.show()
			},
			onInitDrag : function(a, c) {
				var b = this.el.dom.cloneNode(true);
				b.id = Ext.id();
				this.proxy.update(b);
				this.onStartDrag(a, c);
				return true
			},
			getProxy : function() {
				return this.proxy
			},
			hideProxy : function() {
				this.proxy.hide();
				this.proxy.reset(true);
				this.dragging = false
			},
			triggerCacheRefresh : function() {
				Ext.dd.DDM.refreshCache(this.groups)
			},
			b4EndDrag : function(a) {
			},
			endDrag : function(a) {
				this.onEndDrag(this.dragData, a)
			},
			onEndDrag : function(a, b) {
			},
			autoOffset : function(a, b) {
				this.setDelta(-12, -20)
			}
		});