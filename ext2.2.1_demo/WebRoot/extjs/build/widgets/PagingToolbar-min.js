Ext.PagingToolbar = Ext.extend(Ext.Toolbar, {
			pageSize : 20,
			displayMsg : "Displaying {0} - {1} of {2}",
			emptyMsg : "No data to display",
			beforePageText : "Page",
			afterPageText : "of {0}",
			firstText : "First Page",
			prevText : "Previous Page",
			nextText : "Next Page",
			lastText : "Last Page",
			refreshText : "Refresh",
			paramNames : {
				start : "start",
				limit : "limit"
			},
			initComponent : function() {
				this.addEvents("change", "beforechange");
				Ext.PagingToolbar.superclass.initComponent.call(this);
				this.cursor = 0;
				this.bind(this.store)
			},
			onRender : function(b, a) {
				Ext.PagingToolbar.superclass.onRender.call(this, b, a);
				this.first = this.addButton({
							tooltip : this.firstText,
							iconCls : "x-tbar-page-first",
							disabled : true,
							handler : this.onClick.createDelegate(this,
									["first"])
						});
				this.prev = this.addButton({
							tooltip : this.prevText,
							iconCls : "x-tbar-page-prev",
							disabled : true,
							handler : this.onClick.createDelegate(this,
									["prev"])
						});
				this.addSeparator();
				this.add(this.beforePageText);
				this.field = Ext.get(this.addDom({
							tag : "input",
							type : "text",
							size : "3",
							value : "1",
							cls : "x-tbar-page-number"
						}).el);
				this.field.on("keydown", this.onPagingKeydown, this);
				this.field.on("focus", function() {
							this.dom.select()
						});
				this.field.on("blur", this.onPagingBlur, this);
				this.afterTextEl = this.addText(String.format(
						this.afterPageText, 1));
				this.field.setHeight(18);
				this.addSeparator();
				this.next = this.addButton({
							tooltip : this.nextText,
							iconCls : "x-tbar-page-next",
							disabled : true,
							handler : this.onClick.createDelegate(this,
									["next"])
						});
				this.last = this.addButton({
							tooltip : this.lastText,
							iconCls : "x-tbar-page-last",
							disabled : true,
							handler : this.onClick.createDelegate(this,
									["last"])
						});
				this.addSeparator();
				this.loading = this.addButton({
							tooltip : this.refreshText,
							iconCls : "x-tbar-loading",
							handler : this.onClick.createDelegate(this,
									["refresh"])
						});
				if (this.displayInfo) {
					this.displayEl = Ext.fly(this.el.dom).createChild({
								cls : "x-paging-info"
							})
				}
				if (this.dsLoaded) {
					this.onLoad.apply(this, this.dsLoaded)
				}
			},
			updateInfo : function() {
				if (this.displayEl) {
					var a = this.store.getCount();
					var b = a == 0 ? this.emptyMsg : String.format(
							this.displayMsg, this.cursor + 1, this.cursor + a,
							this.store.getTotalCount());
					this.displayEl.update(b)
				}
			},
			onLoad : function(a, c, g) {
				if (!this.rendered) {
					this.dsLoaded = [a, c, g];
					return
				}
				this.cursor = g.params ? g.params[this.paramNames.start] : 0;
				var f = this.getPageData(), b = f.activePage, e = f.pages;
				this.afterTextEl.el.innerHTML = String.format(
						this.afterPageText, f.pages);
				this.field.dom.value = b;
				this.first.setDisabled(b == 1);
				this.prev.setDisabled(b == 1);
				this.next.setDisabled(b == e);
				this.last.setDisabled(b == e);
				this.loading.enable();
				this.updateInfo();
				this.fireEvent("change", this, f)
			},
			getPageData : function() {
				var a = this.store.getTotalCount();
				return {
					total : a,
					activePage : Math.ceil((this.cursor + this.pageSize)
							/ this.pageSize),
					pages : a < this.pageSize ? 1 : Math
							.ceil(a / this.pageSize)
				}
			},
			onLoadError : function() {
				if (!this.rendered) {
					return
				}
				this.loading.enable()
			},
			readPage : function(c) {
				var a = this.field.dom.value, b;
				if (!a || isNaN(b = parseInt(a, 10))) {
					this.field.dom.value = c.activePage;
					return false
				}
				return b
			},
			onPagingBlur : function(a) {
				this.field.dom.value = this.getPageData().activePage
			},
			onPagingKeydown : function(f) {
				var b = f.getKey(), g = this.getPageData(), c;
				if (b == f.RETURN) {
					f.stopEvent();
					c = this.readPage(g);
					if (c !== false) {
						c = Math.min(Math.max(1, c), g.pages) - 1;
						this.doLoad(c * this.pageSize)
					}
				} else {
					if (b == f.HOME || b == f.END) {
						f.stopEvent();
						c = b == f.HOME ? 1 : g.pages;
						this.field.dom.value = c
					} else {
						if (b == f.UP || b == f.PAGEUP || b == f.DOWN
								|| b == f.PAGEDOWN) {
							f.stopEvent();
							if (c = this.readPage(g)) {
								var a = f.shiftKey ? 10 : 1;
								if (b == f.DOWN || b == f.PAGEDOWN) {
									a *= -1
								}
								c += a;
								if (c >= 1 & c <= g.pages) {
									this.field.dom.value = c
								}
							}
						}
					}
				}
			},
			beforeLoad : function() {
				if (this.rendered && this.loading) {
					this.loading.disable()
				}
			},
			doLoad : function(c) {
				var b = {}, a = this.paramNames;
				b[a.start] = c;
				b[a.limit] = this.pageSize;
				if (this.fireEvent("beforechange", this, b) !== false) {
					this.store.load({
								params : b
							})
				}
			},
			changePage : function(a) {
				this.doLoad(((a - 1) * this.pageSize).constrain(0, this.store
								.getTotalCount()))
			},
			onClick : function(e) {
				var b = this.store;
				switch (e) {
					case "first" :
						this.doLoad(0);
						break;
					case "prev" :
						this.doLoad(Math.max(0, this.cursor - this.pageSize));
						break;
					case "next" :
						this.doLoad(this.cursor + this.pageSize);
						break;
					case "last" :
						var d = b.getTotalCount();
						var a = d % this.pageSize;
						var c = a ? (d - a) : d - this.pageSize;
						this.doLoad(c);
						break;
					case "refresh" :
						this.doLoad(this.cursor);
						break
				}
			},
			unbind : function(a) {
				a = Ext.StoreMgr.lookup(a);
				a.un("beforeload", this.beforeLoad, this);
				a.un("load", this.onLoad, this);
				a.un("loadexception", this.onLoadError, this);
				this.store = undefined
			},
			bind : function(a) {
				a = Ext.StoreMgr.lookup(a);
				a.on("beforeload", this.beforeLoad, this);
				a.on("load", this.onLoad, this);
				a.on("loadexception", this.onLoadError, this);
				this.store = a
			},
			onDestroy : function() {
				if (this.store) {
					this.unbind(this.store)
				}
				Ext.PagingToolbar.superclass.onDestroy.call(this)
			}
		});
Ext.reg("paging", Ext.PagingToolbar);