Ext.DataView = Ext.extend(Ext.BoxComponent, {
			selectedClass : "x-view-selected",
			emptyText : "",
			deferEmptyText : true,
			trackOver : false,
			last : false,
			initComponent : function() {
				Ext.DataView.superclass.initComponent.call(this);
				if (typeof this.tpl == "string") {
					this.tpl = new Ext.XTemplate(this.tpl)
				}
				this.addEvents("beforeclick", "click", "mouseenter",
						"mouseleave", "containerclick", "dblclick",
						"contextmenu", "selectionchange", "beforeselect");
				this.all = new Ext.CompositeElementLite();
				this.selected = new Ext.CompositeElementLite()
			},
			onRender : function() {
				if (!this.el) {
					this.el = document.createElement("div");
					this.el.id = this.id
				}
				Ext.DataView.superclass.onRender.apply(this, arguments)
			},
			afterRender : function() {
				Ext.DataView.superclass.afterRender.call(this);
				this.el.on({
							click : this.onClick,
							dblclick : this.onDblClick,
							contextmenu : this.onContextMenu,
							scope : this
						});
				if (this.overClass || this.trackOver) {
					this.el.on({
								mouseover : this.onMouseOver,
								mouseout : this.onMouseOut,
								scope : this
							})
				}
				if (this.store) {
					this.setStore(this.store, true)
				}
			},
			refresh : function() {
				this.clearSelections(false, true);
				this.el.update("");
				var a = this.store.getRange();
				if (a.length < 1) {
					if (!this.deferEmptyText || this.hasSkippedEmptyText) {
						this.el.update(this.emptyText)
					}
					this.hasSkippedEmptyText = true;
					this.all.clear();
					return
				}
				this.tpl.overwrite(this.el, this.collectData(a, 0));
				this.all.fill(Ext.query(this.itemSelector, this.el.dom));
				this.updateIndexes(0)
			},
			prepareData : function(a) {
				return a
			},
			collectData : function(b, e) {
				var d = [];
				for (var c = 0, a = b.length; c < a; c++) {
					d[d.length] = this.prepareData(b[c].data, e + c, b[c])
				}
				return d
			},
			bufferRender : function(a) {
				var b = document.createElement("div");
				this.tpl.overwrite(b, this.collectData(a));
				return Ext.query(this.itemSelector, b)
			},
			onUpdate : function(f, a) {
				var b = this.store.indexOf(a);
				var e = this.isSelected(b);
				var c = this.all.elements[b];
				var d = this.bufferRender([a], b)[0];
				this.all.replaceElement(b, d, true);
				if (e) {
					this.selected.replaceElement(c, d);
					this.all.item(b).addClass(this.selectedClass)
				}
				this.updateIndexes(b, b)
			},
			onAdd : function(f, d, e) {
				if (this.all.getCount() == 0) {
					this.refresh();
					return
				}
				var c = this.bufferRender(d, e), g, b = this.all.elements;
				if (e < this.all.getCount()) {
					g = this.all.item(e).insertSibling(c, "before", true);
					b.splice.apply(b, [e, 0].concat(c))
				} else {
					g = this.all.last().insertSibling(c, "after", true);
					b.push.apply(b, c)
				}
				this.updateIndexes(e)
			},
			onRemove : function(c, a, b) {
				this.deselect(b);
				this.all.removeElement(b, true);
				this.updateIndexes(b)
			},
			refreshNode : function(a) {
				this.onUpdate(this.store, this.store.getAt(a))
			},
			updateIndexes : function(d, c) {
				var b = this.all.elements;
				d = d || 0;
				c = c || ((c === 0) ? 0 : (b.length - 1));
				for (var a = d; a <= c; a++) {
					b[a].viewIndex = a
				}
			},
			getStore : function() {
				return this.store
			},
			setStore : function(a, b) {
				if (!b && this.store) {
					this.store.un("beforeload", this.onBeforeLoad, this);
					this.store.un("datachanged", this.refresh, this);
					this.store.un("add", this.onAdd, this);
					this.store.un("remove", this.onRemove, this);
					this.store.un("update", this.onUpdate, this);
					this.store.un("clear", this.refresh, this)
				}
				if (a) {
					a = Ext.StoreMgr.lookup(a);
					a.on("beforeload", this.onBeforeLoad, this);
					a.on("datachanged", this.refresh, this);
					a.on("add", this.onAdd, this);
					a.on("remove", this.onRemove, this);
					a.on("update", this.onUpdate, this);
					a.on("clear", this.refresh, this)
				}
				this.store = a;
				if (a) {
					this.refresh()
				}
			},
			findItemFromChild : function(a) {
				return Ext.fly(a).findParent(this.itemSelector, this.el)
			},
			onClick : function(c) {
				var b = c.getTarget(this.itemSelector, this.el);
				if (b) {
					var a = this.indexOf(b);
					if (this.onItemClick(b, a, c) !== false) {
						this.fireEvent("click", this, a, b, c)
					}
				} else {
					if (this.fireEvent("containerclick", this, c) !== false) {
						this.clearSelections()
					}
				}
			},
			onContextMenu : function(b) {
				var a = b.getTarget(this.itemSelector, this.el);
				if (a) {
					this.fireEvent("contextmenu", this, this.indexOf(a), a, b)
				}
			},
			onDblClick : function(b) {
				var a = b.getTarget(this.itemSelector, this.el);
				if (a) {
					this.fireEvent("dblclick", this, this.indexOf(a), a, b)
				}
			},
			onMouseOver : function(b) {
				var a = b.getTarget(this.itemSelector, this.el);
				if (a && a !== this.lastItem) {
					this.lastItem = a;
					Ext.fly(a).addClass(this.overClass);
					this.fireEvent("mouseenter", this, this.indexOf(a), a, b)
				}
			},
			onMouseOut : function(a) {
				if (this.lastItem) {
					if (!a.within(this.lastItem, true, true)) {
						Ext.fly(this.lastItem).removeClass(this.overClass);
						this.fireEvent("mouseleave", this, this
										.indexOf(this.lastItem), this.lastItem,
								a);
						delete this.lastItem
					}
				}
			},
			onItemClick : function(b, a, c) {
				if (this.fireEvent("beforeclick", this, a, b, c) === false) {
					return false
				}
				if (this.multiSelect) {
					this.doMultiSelection(b, a, c);
					c.preventDefault()
				} else {
					if (this.singleSelect) {
						this.doSingleSelection(b, a, c);
						c.preventDefault()
					}
				}
				return true
			},
			doSingleSelection : function(b, a, c) {
				if (c.ctrlKey && this.isSelected(a)) {
					this.deselect(a)
				} else {
					this.select(a, false)
				}
			},
			doMultiSelection : function(c, a, d) {
				if (d.shiftKey && this.last !== false) {
					var b = this.last;
					this.selectRange(b, a, d.ctrlKey);
					this.last = b
				} else {
					if ((d.ctrlKey || this.simpleSelect) && this.isSelected(a)) {
						this.deselect(a)
					} else {
						this.select(a, d.ctrlKey || d.shiftKey
										|| this.simpleSelect)
					}
				}
			},
			getSelectionCount : function() {
				return this.selected.getCount()
			},
			getSelectedNodes : function() {
				return this.selected.elements
			},
			getSelectedIndexes : function() {
				var b = [], d = this.selected.elements;
				for (var c = 0, a = d.length; c < a; c++) {
					b.push(d[c].viewIndex)
				}
				return b
			},
			getSelectedRecords : function() {
				var d = [], c = this.selected.elements;
				for (var b = 0, a = c.length; b < a; b++) {
					d[d.length] = this.store.getAt(c[b].viewIndex)
				}
				return d
			},
			getRecords : function(b) {
				var e = [], d = b;
				for (var c = 0, a = d.length; c < a; c++) {
					e[e.length] = this.store.getAt(d[c].viewIndex)
				}
				return e
			},
			getRecord : function(a) {
				return this.store.getAt(a.viewIndex)
			},
			clearSelections : function(a, b) {
				if ((this.multiSelect || this.singleSelect)
						&& this.selected.getCount() > 0) {
					if (!b) {
						this.selected.removeClass(this.selectedClass)
					}
					this.selected.clear();
					this.last = false;
					if (!a) {
						this.fireEvent("selectionchange", this,
								this.selected.elements)
					}
				}
			},
			isSelected : function(a) {
				return this.selected.contains(this.getNode(a))
			},
			deselect : function(a) {
				if (this.isSelected(a)) {
					a = this.getNode(a);
					this.selected.removeElement(a);
					if (this.last == a.viewIndex) {
						this.last = false
					}
					Ext.fly(a).removeClass(this.selectedClass);
					this.fireEvent("selectionchange", this,
							this.selected.elements)
				}
			},
			select : function(d, f, b) {
				if (Ext.isArray(d)) {
					if (!f) {
						this.clearSelections(true)
					}
					for (var c = 0, a = d.length; c < a; c++) {
						this.select(d[c], true, true)
					}
					if (!b) {
						this.fireEvent("selectionchange", this,
								this.selected.elements)
					}
				} else {
					var e = this.getNode(d);
					if (!f) {
						this.clearSelections(true)
					}
					if (e && !this.isSelected(e)) {
						if (this.fireEvent("beforeselect", this, e,
								this.selected.elements) !== false) {
							Ext.fly(e).addClass(this.selectedClass);
							this.selected.add(e);
							this.last = e.viewIndex;
							if (!b) {
								this.fireEvent("selectionchange", this,
										this.selected.elements)
							}
						}
					}
				}
			},
			selectRange : function(c, a, b) {
				if (!b) {
					this.clearSelections(true)
				}
				this.select(this.getNodes(c, a), true)
			},
			getNode : function(a) {
				if (typeof a == "string") {
					return document.getElementById(a)
				} else {
					if (typeof a == "number") {
						return this.all.elements[a]
					}
				}
				return a
			},
			getNodes : function(e, a) {
				var d = this.all.elements;
				e = e || 0;
				a = typeof a == "undefined" ? Math.max(d.length - 1, 0) : a;
				var b = [], c;
				if (e <= a) {
					for (c = e; c <= a && d[c]; c++) {
						b.push(d[c])
					}
				} else {
					for (c = e; c >= a && d[c]; c--) {
						b.push(d[c])
					}
				}
				return b
			},
			indexOf : function(a) {
				a = this.getNode(a);
				if (typeof a.viewIndex == "number") {
					return a.viewIndex
				}
				return this.all.indexOf(a)
			},
			onBeforeLoad : function() {
				if (this.loadingText) {
					this.clearSelections(false, true);
					this.el.update('<div class="loading-indicator">'
							+ this.loadingText + "</div>");
					this.all.clear()
				}
			},
			onDestroy : function() {
				Ext.DataView.superclass.onDestroy.call(this);
				this.setStore(null)
			}
		});
Ext.reg("dataview", Ext.DataView);