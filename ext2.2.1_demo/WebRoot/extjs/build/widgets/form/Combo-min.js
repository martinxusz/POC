Ext.form.ComboBox = Ext.extend(Ext.form.TriggerField, {
			defaultAutoCreate : {
				tag : "input",
				type : "text",
				size : "24",
				autocomplete : "off"
			},
			listClass : "",
			selectedClass : "x-combo-selected",
			triggerClass : "x-form-arrow-trigger",
			shadow : "sides",
			listAlign : "tl-bl?",
			maxHeight : 300,
			minHeight : 90,
			triggerAction : "query",
			minChars : 4,
			typeAhead : false,
			queryDelay : 500,
			pageSize : 0,
			selectOnFocus : false,
			queryParam : "query",
			loadingText : "Loading...",
			resizable : false,
			handleHeight : 8,
			editable : true,
			allQuery : "",
			mode : "remote",
			minListWidth : 70,
			forceSelection : false,
			typeAheadDelay : 250,
			lazyInit : true,
			initComponent : function() {
				Ext.form.ComboBox.superclass.initComponent.call(this);
				this.addEvents("expand", "collapse", "beforeselect", "select",
						"beforequery");
				if (this.transform) {
					this.allowDomMove = false;
					var c = Ext.getDom(this.transform);
					if (!this.hiddenName) {
						this.hiddenName = c.name
					}
					if (!this.store) {
						this.mode = "local";
						var h = [], e = c.options;
						for (var b = 0, a = e.length; b < a; b++) {
							var g = e[b];
							var f = (Ext.isIE
									? g.getAttributeNode("value").specified
									: g.hasAttribute("value"))
									? g.value
									: g.text;
							if (g.selected) {
								this.value = f
							}
							h.push([f, g.text])
						}
						this.store = new Ext.data.SimpleStore({
									id : 0,
									fields : ["value", "text"],
									data : h
								});
						this.valueField = "value";
						this.displayField = "text"
					}
					c.name = Ext.id();
					if (!this.lazyRender) {
						this.target = true;
						this.el = Ext.DomHelper.insertBefore(c, this.autoCreate
										|| this.defaultAutoCreate);
						Ext.removeNode(c);
						this.render(this.el.parentNode)
					} else {
						Ext.removeNode(c)
					}
				} else {
					if (Ext.isArray(this.store)) {
						if (Ext.isArray(this.store[0])) {
							this.store = new Ext.data.SimpleStore({
										fields : ["value", "text"],
										data : this.store
									});
							this.valueField = "value"
						} else {
							this.store = new Ext.data.SimpleStore({
										fields : ["text"],
										data : this.store,
										expandData : true
									});
							this.valueField = "text"
						}
						this.displayField = "text";
						this.mode = "local"
					}
				}
				this.selectedIndex = -1;
				if (this.mode == "local") {
					if (this.initialConfig.queryDelay === undefined) {
						this.queryDelay = 10
					}
					if (this.initialConfig.minChars === undefined) {
						this.minChars = 0
					}
				}
			},
			onRender : function(b, a) {
				Ext.form.ComboBox.superclass.onRender.call(this, b, a);
				if (this.hiddenName) {
					this.hiddenField = this.el.insertSibling({
								tag : "input",
								type : "hidden",
								name : this.hiddenName,
								id : (this.hiddenId || this.hiddenName)
							}, "before", true);
					this.el.dom.removeAttribute("name")
				}
				if (Ext.isGecko) {
					this.el.dom.setAttribute("autocomplete", "off")
				}
				if (!this.lazyInit) {
					this.initList()
				} else {
					this.on("focus", this.initList, this, {
								single : true
							})
				}
				if (!this.editable) {
					this.editable = true;
					this.setEditable(false)
				}
			},
			initValue : function() {
				Ext.form.ComboBox.superclass.initValue.call(this);
				if (this.hiddenField) {
					this.hiddenField.value = this.hiddenValue !== undefined
							? this.hiddenValue
							: this.value !== undefined ? this.value : ""
				}
			},
			initList : function() {
				if (!this.list) {
					var a = "x-combo-list";
					this.list = new Ext.Layer({
								shadow : this.shadow,
								cls : [a, this.listClass].join(" "),
								constrain : false
							});
					var b = this.listWidth
							|| Math
									.max(this.wrap.getWidth(),
											this.minListWidth);
					this.list.setWidth(b);
					this.list.swallowEvent("mousewheel");
					this.assetHeight = 0;
					if (this.title) {
						this.header = this.list.createChild({
									cls : a + "-hd",
									html : this.title
								});
						this.assetHeight += this.header.getHeight()
					}
					this.innerList = this.list.createChild({
								cls : a + "-inner"
							});
					this.innerList.on("mouseover", this.onViewOver, this);
					this.innerList.on("mousemove", this.onViewMove, this);
					this.innerList.setWidth(b - this.list.getFrameWidth("lr"));
					if (this.pageSize) {
						this.footer = this.list.createChild({
									cls : a + "-ft"
								});
						this.pageTb = new Ext.PagingToolbar({
									store : this.store,
									pageSize : this.pageSize,
									renderTo : this.footer
								});
						this.assetHeight += this.footer.getHeight()
					}
					if (!this.tpl) {
						this.tpl = '<tpl for="."><div class="' + a + '-item">{'
								+ this.displayField + "}</div></tpl>"
					}
					this.view = new Ext.DataView({
								applyTo : this.innerList,
								tpl : this.tpl,
								singleSelect : true,
								selectedClass : this.selectedClass,
								itemSelector : this.itemSelector || "." + a
										+ "-item"
							});
					this.view.on("click", this.onViewClick, this);
					this.bindStore(this.store, true);
					if (this.resizable) {
						this.resizer = new Ext.Resizable(this.list, {
									pinned : true,
									handles : "se"
								});
						this.resizer.on("resize", function(e, c, d) {
									this.maxHeight = d - this.handleHeight
											- this.list.getFrameWidth("tb")
											- this.assetHeight;
									this.listWidth = c;
									this.innerList.setWidth(c
											- this.list.getFrameWidth("lr"));
									this.restrictHeight()
								}, this);
						this[this.pageSize ? "footer" : "innerList"].setStyle(
								"margin-bottom", this.handleHeight + "px")
					}
				}
			},
			getStore : function() {
				return this.store
			},
			bindStore : function(a, b) {
				if (this.store && !b) {
					this.store.un("beforeload", this.onBeforeLoad, this);
					this.store.un("load", this.onLoad, this);
					this.store.un("loadexception", this.collapse, this);
					if (!a) {
						this.store = null;
						if (this.view) {
							this.view.setStore(null)
						}
					}
				}
				if (a) {
					this.store = Ext.StoreMgr.lookup(a);
					this.store.on("beforeload", this.onBeforeLoad, this);
					this.store.on("load", this.onLoad, this);
					this.store.on("loadexception", this.collapse, this);
					if (this.view) {
						this.view.setStore(a)
					}
				}
			},
			initEvents : function() {
				Ext.form.ComboBox.superclass.initEvents.call(this);
				this.keyNav = new Ext.KeyNav(this.el, {
							up : function(a) {
								this.inKeyMode = true;
								this.selectPrev()
							},
							down : function(a) {
								if (!this.isExpanded()) {
									this.onTriggerClick()
								} else {
									this.inKeyMode = true;
									this.selectNext()
								}
							},
							enter : function(a) {
								this.onViewClick();
								this.delayedCheck = true;
								this.unsetDelayCheck.defer(10, this)
							},
							esc : function(a) {
								this.collapse()
							},
							tab : function(a) {
								this.onViewClick(false);
								return true
							},
							scope : this,
							doRelay : function(c, b, a) {
								if (a == "down" || this.scope.isExpanded()) {
									return Ext.KeyNav.prototype.doRelay.apply(
											this, arguments)
								}
								return true
							},
							forceKeyDown : true
						});
				this.queryDelay = Math.max(this.queryDelay || 10,
						this.mode == "local" ? 10 : 250);
				this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
				if (this.typeAhead) {
					this.taTask = new Ext.util.DelayedTask(this.onTypeAhead,
							this)
				}
				if (this.editable !== false) {
					this.el.on("keyup", this.onKeyUp, this)
				}
				if (this.forceSelection) {
					this.on("blur", this.doForce, this)
				}
			},
			onDestroy : function() {
				if (this.view) {
					Ext.destroy(this.view)
				}
				if (this.list) {
					if (this.innerList) {
						this.innerList.un("mouseover", this.onViewOver, this);
						this.innerList.un("mousemove", this.onViewMove, this)
					}
					this.list.destroy()
				}
				if (this.dqTask) {
					this.dqTask.cancel();
					this.dqTask = null
				}
				this.bindStore(null);
				Ext.form.ComboBox.superclass.onDestroy.call(this)
			},
			unsetDelayCheck : function() {
				delete this.delayedCheck
			},
			fireKey : function(a) {
				if (a.isNavKeyPress() && !this.isExpanded()
						&& !this.delayedCheck) {
					this.fireEvent("specialkey", this, a)
				}
			},
			onResize : function(a, b) {
				Ext.form.ComboBox.superclass.onResize.apply(this, arguments);
				if (this.list && this.listWidth === undefined) {
					var c = Math.max(a, this.minListWidth);
					this.list.setWidth(c);
					this.innerList.setWidth(c - this.list.getFrameWidth("lr"))
				}
			},
			onEnable : function() {
				Ext.form.ComboBox.superclass.onEnable.apply(this, arguments);
				if (this.hiddenField) {
					this.hiddenField.disabled = false
				}
			},
			onDisable : function() {
				Ext.form.ComboBox.superclass.onDisable.apply(this, arguments);
				if (this.hiddenField) {
					this.hiddenField.disabled = true
				}
			},
			setEditable : function(a) {
				if (a == this.editable) {
					return
				}
				this.editable = a;
				if (!a) {
					this.el.dom.setAttribute("readOnly", true);
					this.el.on("mousedown", this.onTriggerClick, this);
					this.el.addClass("x-combo-noedit")
				} else {
					this.el.dom.removeAttribute("readOnly");
					this.el.un("mousedown", this.onTriggerClick, this);
					this.el.removeClass("x-combo-noedit")
				}
			},
			onBeforeLoad : function() {
				if (!this.hasFocus) {
					return
				}
				this.innerList.update(this.loadingText
						? '<div class="loading-indicator">' + this.loadingText
								+ "</div>"
						: "");
				this.restrictHeight();
				this.selectedIndex = -1
			},
			onLoad : function() {
				if (!this.hasFocus) {
					return
				}
				if (this.store.getCount() > 0) {
					this.expand();
					this.restrictHeight();
					if (this.lastQuery == this.allQuery) {
						if (this.editable) {
							this.el.dom.select()
						}
						if (!this.selectByValue(this.value, true)) {
							this.select(0, true)
						}
					} else {
						this.selectNext();
						if (this.typeAhead
								&& this.lastKey != Ext.EventObject.BACKSPACE
								&& this.lastKey != Ext.EventObject.DELETE) {
							this.taTask.delay(this.typeAheadDelay)
						}
					}
				} else {
					this.onEmptyResults()
				}
			},
			onTypeAhead : function() {
				if (this.store.getCount() > 0) {
					var b = this.store.getAt(0);
					var c = b.data[this.displayField];
					var a = c.length;
					var d = this.getRawValue().length;
					if (d != a) {
						this.setRawValue(c);
						this.selectText(d, c.length)
					}
				}
			},
			onSelect : function(a, b) {
				if (this.fireEvent("beforeselect", this, a, b) !== false) {
					this.setValue(a.data[this.valueField || this.displayField]);
					this.collapse();
					this.fireEvent("select", this, a, b)
				}
			},
			getValue : function() {
				if (this.valueField) {
					return typeof this.value != "undefined" ? this.value : ""
				} else {
					return Ext.form.ComboBox.superclass.getValue.call(this)
				}
			},
			clearValue : function() {
				if (this.hiddenField) {
					this.hiddenField.value = ""
				}
				this.setRawValue("");
				this.lastSelectionText = "";
				this.applyEmptyText();
				this.value = ""
			},
			setValue : function(a) {
				var c = a;
				if (this.valueField) {
					var b = this.findRecord(this.valueField, a);
					if (b) {
						c = b.data[this.displayField]
					} else {
						if (this.valueNotFoundText !== undefined) {
							c = this.valueNotFoundText
						}
					}
				}
				this.lastSelectionText = c;
				if (this.hiddenField) {
					this.hiddenField.value = a
				}
				Ext.form.ComboBox.superclass.setValue.call(this, c);
				this.value = a
			},
			findRecord : function(c, b) {
				var a;
				if (this.store.getCount() > 0) {
					this.store.each(function(d) {
								if (d.data[c] == b) {
									a = d;
									return false
								}
							})
				}
				return a
			},
			onViewMove : function(b, a) {
				this.inKeyMode = false
			},
			onViewOver : function(d, b) {
				if (this.inKeyMode) {
					return
				}
				var c = this.view.findItemFromChild(b);
				if (c) {
					var a = this.view.indexOf(c);
					this.select(a, false)
				}
			},
			onViewClick : function(b) {
				var a = this.view.getSelectedIndexes()[0];
				var c = this.store.getAt(a);
				if (c) {
					this.onSelect(c, a)
				}
				if (b !== false) {
					this.el.focus()
				}
			},
			restrictHeight : function() {
				this.innerList.dom.style.height = "";
				var b = this.innerList.dom;
				var e = this.list.getFrameWidth("tb")
						+ (this.resizable ? this.handleHeight : 0)
						+ this.assetHeight;
				var c = Math
						.max(b.clientHeight, b.offsetHeight, b.scrollHeight);
				var a = this.getPosition()[1] - Ext.getBody().getScroll().top;
				var f = Ext.lib.Dom.getViewHeight() - a - this.getSize().height;
				var d = Math.max(a, f, this.minHeight || 0)
						- this.list.shadowOffset - e - 5;
				c = Math.min(c, d, this.maxHeight);
				this.innerList.setHeight(c);
				this.list.beginUpdate();
				this.list.setHeight(c + e);
				this.list.alignTo(this.wrap, this.listAlign);
				this.list.endUpdate()
			},
			onEmptyResults : function() {
				this.collapse()
			},
			isExpanded : function() {
				return this.list && this.list.isVisible()
			},
			selectByValue : function(a, c) {
				if (a !== undefined && a !== null) {
					var b = this.findRecord(this.valueField
									|| this.displayField, a);
					if (b) {
						this.select(this.store.indexOf(b), c);
						return true
					}
				}
				return false
			},
			select : function(a, c) {
				this.selectedIndex = a;
				this.view.select(a);
				if (c !== false) {
					var b = this.view.getNode(a);
					if (b) {
						this.innerList.scrollChildIntoView(b, false)
					}
				}
			},
			selectNext : function() {
				var a = this.store.getCount();
				if (a > 0) {
					if (this.selectedIndex == -1) {
						this.select(0)
					} else {
						if (this.selectedIndex < a - 1) {
							this.select(this.selectedIndex + 1)
						}
					}
				}
			},
			selectPrev : function() {
				var a = this.store.getCount();
				if (a > 0) {
					if (this.selectedIndex == -1) {
						this.select(0)
					} else {
						if (this.selectedIndex != 0) {
							this.select(this.selectedIndex - 1)
						}
					}
				}
			},
			onKeyUp : function(a) {
				if (this.editable !== false && !a.isSpecialKey()) {
					this.lastKey = a.getKey();
					this.dqTask.delay(this.queryDelay)
				}
			},
			validateBlur : function() {
				return !this.list || !this.list.isVisible()
			},
			initQuery : function() {
				this.doQuery(this.getRawValue())
			},
			doForce : function() {
				if (this.el.dom.value.length > 0) {
					this.el.dom.value = this.lastSelectionText === undefined
							? ""
							: this.lastSelectionText;
					this.applyEmptyText()
				}
			},
			doQuery : function(c, b) {
				if (c === undefined || c === null) {
					c = ""
				}
				var a = {
					query : c,
					forceAll : b,
					combo : this,
					cancel : false
				};
				if (this.fireEvent("beforequery", a) === false || a.cancel) {
					return false
				}
				c = a.query;
				b = a.forceAll;
				if (b === true || (c.length >= this.minChars)) {
					if (this.lastQuery !== c) {
						this.lastQuery = c;
						if (this.mode == "local") {
							this.selectedIndex = -1;
							if (b) {
								this.store.clearFilter()
							} else {
								this.store.filter(this.displayField, c)
							}
							this.onLoad()
						} else {
							this.store.baseParams[this.queryParam] = c;
							this.store.load({
										params : this.getParams(c)
									});
							this.expand()
						}
					} else {
						this.selectedIndex = -1;
						this.onLoad()
					}
				}
			},
			getParams : function(a) {
				var b = {};
				if (this.pageSize) {
					b.start = 0;
					b.limit = this.pageSize
				}
				return b
			},
			collapse : function() {
				if (!this.isExpanded()) {
					return
				}
				this.list.hide();
				Ext.getDoc().un("mousewheel", this.collapseIf, this);
				Ext.getDoc().un("mousedown", this.collapseIf, this);
				this.fireEvent("collapse", this)
			},
			collapseIf : function(a) {
				if (!a.within(this.wrap) && !a.within(this.list)) {
					this.collapse()
				}
			},
			expand : function() {
				if (this.isExpanded() || !this.hasFocus) {
					return
				}
				this.list.alignTo(this.wrap, this.listAlign);
				this.list.show();
				this.innerList.setOverflow("auto");
				Ext.getDoc().on("mousewheel", this.collapseIf, this);
				Ext.getDoc().on("mousedown", this.collapseIf, this);
				this.fireEvent("expand", this)
			},
			onTriggerClick : function() {
				if (this.disabled) {
					return
				}
				if (this.isExpanded()) {
					this.collapse();
					this.el.focus()
				} else {
					this.onFocus({});
					if (this.triggerAction == "all") {
						this.doQuery(this.allQuery, true)
					} else {
						this.doQuery(this.getRawValue())
					}
					this.el.focus()
				}
			}
		});
Ext.reg("combo", Ext.form.ComboBox);