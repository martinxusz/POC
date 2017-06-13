/*
 * 显示指定年份，
 * 如果不做任何设置，默认显示当前年份的前10年和后5年。
 * 其他参数及事件，参考其父类Ext.form.ComboBox
 * author：jfc
 */
 Ext.form.Year = Ext.extend(Ext.form.ComboBox, {
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
	mode : "local",
	minListWidth : 70,
	forceSelection : false,
	typeAheadDelay : 250,
	lazyInit : true,
	beforeYears : 10,
	lastYears : 10,
	currentYear :0,
	affixText : '',
	minYear : 2005,
	initComponent : function() {
		/*
		 * alter
		 */
		Ext.form.Year.superclass.initComponent.call(this);
		this.addEvents("expand", "collapse", "beforeselect", "select", "beforequery");
		
		if (this.transform) {
			this.allowDomMove = false;
			var c = Ext.getDom(this.transform);
			
			if (!this.hiddenName) {
				this.hiddenName = c.name
			}
			
			if (!this.store) {
				this.mode = "local";
				var k = [], e = c.options;
				
				for (var b = 0, a = e.length; b < a; b++) {
					var h = e[b];
					var g = (Ext.isIE
							? h.getAttributeNode("value").specified
							: h.hasAttribute("value"))
							? h.value
							: h.text;
					
					if (h.selected) {
						this.value = g
					}
					
					k.push([g, h.text])
				}
				
				this.store = new Ext.data.SimpleStore({
					id : 0,
					fields : ["value", "text"],
					data : k
				});
				
				this.valueField = "value";
				this.displayField = "text"
			}
			
			c.name = Ext.id();
			
			if (!this.lazyRender) {
				this.target = true;
				this.el = Ext.DomHelper.insertBefore(c, this.autoCreate || this.defaultAutoCreate);
				Ext.removeNode(c);
				this.render(this.el.parentNode)
			} else {
				Ext.removeNode(c)
			}
		} else {
			if(!this.store){					
				var k = [];
				
				if(!this.currentYear || this.currentYear == '' || this.currentYear == 0){
					var cy = new Date().getYear();
					cy = cy < 1900 ? (1900 + cy) : cy;
					this.currentYear = cy;
				
				}	
				
				/*
				 * 开始年份
				 */
				var startYear = this.currentYear;	
				
				if(!this.beforeYears || this.beforeYears == ''){
					this.beforeYears = 10;
				}
				
				startYear -= this.beforeYears;
				
				//如果起始年份小于最小年份，则取最小年份
				if(startYear < this.minYear){
					startYear = this.minYear;
				}
				
				/*
				 * 结束年份
				 */
				var endYear = this.currentYear;
				
				if(!this.lastYears || this.lastYears == ''){
					this.lastYears = 10;
				}
				
				endYear += this.lastYears;
				
				for(var i = startYear; i <= endYear; i++){
					k.push([i, i + '年' + this.affixText])
				}
				
				this.store = new Ext.data.SimpleStore({
					id : 0,
					fields : ["value", "text"],
					data : k
				});
				
				this.valueField = "value";
				this.displayField = "text"
			}
			
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
		/*
		 * alter
		 */
		Ext.form.Year.superclass.onRender.call(this, b, a);
		
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
		Ext.form.Year.superclass.initValue.call(this);
		
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
			
			var b = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
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
				this.tpl = '<tpl for="."><div class="' + a + '-item">{' + this.displayField + "}</div></tpl>"
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
		Ext.form.Year.superclass.initEvents.call(this);
		
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
		
		this.queryDelay = Math.max(this.queryDelay || 10, this.mode == "local" ? 10 : 250);
		this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
		
		if (this.typeAhead) {
			this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this)
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
		Ext.form.Year.superclass.onDestroy.call(this)
	},
	unsetDelayCheck : function() {
		delete this.delayedCheck
	},
	fireKey : function(a) {
		if (a.isNavKeyPress() && !this.isExpanded() && !this.delayedCheck) {
			this.fireEvent("specialkey", this, a)
		}
	},
	onResize : function(a, b) {
		Ext.form.Year.superclass.onResize.apply(this, arguments);
		
		if (this.list && this.listWidth === undefined) {
			var c = Math.max(a, this.minListWidth);
			this.list.setWidth(c);
			this.innerList.setWidth(c - this.list.getFrameWidth("lr"))
		}
	},
	onEnable : function() {
		Ext.form.Year.superclass.onEnable.apply(this, arguments);
		
		if (this.hiddenField) {
			this.hiddenField.disabled = false
		}
	},
	onDisable : function() {
		Ext.form.Year.superclass.onDisable.apply(this, arguments);
		
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
		
		this.innerList.update(this.loadingText ? '<div class="loading-indicator">' + this.loadingText + "</div>" : "");
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
			return Ext.form.Year.superclass.getValue.call(this)
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
		
		Ext.form.Year.superclass.setValue.call(this, c);
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
		var g = Ext.lib.Dom.getViewHeight() - a - this.getSize().height;
		var d = Math.max(a, g, this.minHeight || 0)
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
			this.applyEmptyText();
		}
	},
	doQuery : function(c, b) {
		if (c === undefined || c === null) {
			c = "";
		}
		
		var a = {
			query : c,
			forceAll : b,
			combo : this,
			cancel : false
		};
		
		if (this.fireEvent("beforequery", a) === false || a.cancel) {
			return false;
		}
		
		c = a.query;
		b = a.forceAll;
		
		if (b === true || (c.length >= this.minChars)) {
			if (this.lastQuery !== c) {
				this.lastQuery = c;
				
				if (this.mode == "local") {
					this.selectedIndex = -1;
					
					if (b) {
						this.store.clearFilter();
					} else {
						this.store.filter(this.displayField, c);
					}
					
					this.onLoad();
				} else {
					this.store.baseParams[this.queryParam] = c;
					this.store.load({
						params : this.getParams(c)
					});
					
					this.expand();
				}
			} else {
				this.selectedIndex = -1;
				this.onLoad();
			}
		}
	},
	getParams : function(a) {
		var b = {};
		
		if (this.pageSize) {
			b.start = 0;
			b.limit = this.pageSize
		}
		
		return b;
	},
	collapse : function() {
		if (!this.isExpanded()) {
			return;
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
			return;
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
			return;
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
			
			this.el.focus();
		}
	}
});

Ext.reg("year", Ext.form.Year);

/*
 * 显示半年
 */
Ext.form.HalfYear = Ext.extend(Ext.form.ComboBox, {
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
	mode : "local",
	minListWidth : 70,
	forceSelection : false,
	typeAheadDelay : 250,
	lazyInit : true,
	startNumber : 1,
	endNumber : 2,	
	displayText : '',
	isupcase : false,		//大写
	initComponent : function() {
		/*
		 * alter
		 */
		Ext.form.HalfYear.superclass.initComponent.call(this);
		this.addEvents("expand", "collapse", "beforeselect", "select", "beforequery");
		
		if (this.transform) {
			this.allowDomMove = false;
			var c = Ext.getDom(this.transform);
			
			if (!this.hiddenName) {
				this.hiddenName = c.name
			}
			
			if (!this.store) {
				this.mode = "local";
				var k = [], e = c.options;
				
				for (var b = 0, a = e.length; b < a; b++) {
					var h = e[b];
					var g = (Ext.isIE
							? h.getAttributeNode("value").specified
							: h.hasAttribute("value"))
							? h.value
							: h.text;
					
					if (h.selected) {
						this.value = g
					}
					
					k.push([g, h.text])
				}
				
				this.store = new Ext.data.SimpleStore({
					id : 0,
					fields : ["value", "text"],
					data : k
				});
				
				this.valueField = "value";
				this.displayField = "text"
			}
			
			c.name = Ext.id();
			
			if (!this.lazyRender) {
				this.target = true;
				this.el = Ext.DomHelper.insertBefore(c, this.autoCreate || this.defaultAutoCreate);
				Ext.removeNode(c);
				this.render(this.el.parentNode)
			} else {
				Ext.removeNode(c)
			}
		} else {
			if(!this.store){					
				var k = [];
				/*
				 * 半年设置
				 */
				k.push(['-1','请选择半年度']);
				
				if(!this.startNumber || this.startNumber == ''){
					this.startNumber = 1;
				}
				
				if(!this.endNumber || this.endNumber == ''){
					this.endNumber = 2;
				}
				
				for(var i = this.startNumber; i <= this.endNumber; i++){
					if(this.isupcase){
						var n = 0;
						
						switch(i){
							case 1:
								n = 1;
								break;
							case 2:
								n = 2;
								break;
							default:
								n = 2;
								break;
						}
						
						k.push([i, '第' + n + this.displayText])
					}else{
						if(i == 1){
							k.push([i, "上" + this.displayText])
						}else{
							k.push([i, "下" + this.displayText])
						}
					}
				}
				
				this.store = new Ext.data.SimpleStore({
					id : 0,
					fields : ["value", "text"],
					data : k
				});
				
				this.valueField = "value";
				this.displayField = "text"
				
			}
			
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
		/*
		 * alter
		 */
		Ext.form.HalfYear.superclass.onRender.call(this, b, a);
		
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
		Ext.form.HalfYear.superclass.initValue.call(this);
		
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
			
			var b = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
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
		Ext.form.HalfYear.superclass.initEvents.call(this);
		
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
		
		this.queryDelay = Math.max(this.queryDelay || 10, this.mode == "local" ? 10 : 250);
		this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
		
		if (this.typeAhead) {
			this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this)
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
		Ext.form.HalfYear.superclass.onDestroy.call(this)
	},
	unsetDelayCheck : function() {
		delete this.delayedCheck
	},
	fireKey : function(a) {
		if (a.isNavKeyPress() && !this.isExpanded() && !this.delayedCheck) {
			this.fireEvent("specialkey", this, a);
		}
	},
	onResize : function(a, b) {
		Ext.form.HalfYear.superclass.onResize.apply(this, arguments);
		
		if (this.list && this.listWidth === undefined) {
			var c = Math.max(a, this.minListWidth);
			this.list.setWidth(c);
			this.innerList.setWidth(c - this.list.getFrameWidth("lr"));
		}
	},
	onEnable : function() {
		Ext.form.HalfYear.superclass.onEnable.apply(this, arguments);
		
		if (this.hiddenField) {
			this.hiddenField.disabled = false;
		}
	},
	onDisable : function() {
		Ext.form.HalfYear.superclass.onDisable.apply(this, arguments);
		
		if (this.hiddenField) {
			this.hiddenField.disabled = true;
		}
	},
	setEditable : function(a) {
		if (a == this.editable) {
			return;
		}
		
		this.editable = a;
		
		if (!a) {
			this.el.dom.setAttribute("readOnly", true);
			this.el.on("mousedown", this.onTriggerClick, this);
			this.el.addClass("x-combo-noedit");
		} else {
			this.el.dom.removeAttribute("readOnly");
			this.el.un("mousedown", this.onTriggerClick, this);
			this.el.removeClass("x-combo-noedit");
		}
	},
	onBeforeLoad : function() {
		if (!this.hasFocus) {
			return;
		}
		
		this.innerList.update(this.loadingText
				? '<div class="loading-indicator">' + this.loadingText + "</div>" : "");
		this.restrictHeight();
		this.selectedIndex = -1
	},
	onLoad : function() {
		if (!this.hasFocus) {
			return;
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
			this.onEmptyResults();
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
				this.selectText(d, c.length);
			}
		}
	},
	onSelect : function(a, b) {
		if (this.fireEvent("beforeselect", this, a, b) !== false) {
			this.setValue(a.data[this.valueField || this.displayField]);
			this.collapse();
			this.fireEvent("select", this, a, b);
		}
	},
	getValue : function() {
		if (this.valueField) {
			return typeof this.value != "undefined" ? this.value : ""
		} else {
			return Ext.form.HalfYear.superclass.getValue.call(this)
		}
	},
	clearValue : function() {
		if (this.hiddenField) {
			this.hiddenField.value = ""
		}
		
		this.setRawValue("");
		this.lastSelectionText = "";
		this.applyEmptyText();
		this.value = "";
	},
	setValue : function(a) {
		var c = a;
		
		if (this.valueField) {
			var b = this.findRecord(this.valueField, a);
			
			if (b) {
				c = b.data[this.displayField];
			} else {
				if (this.valueNotFoundText !== undefined) {
					c = this.valueNotFoundText;
				}
			}
		}
		
		this.lastSelectionText = c;
		
		if (this.hiddenField) {
			this.hiddenField.value = a;
		}
		
		Ext.form.HalfYear.superclass.setValue.call(this, c);
		this.value = a;
		
		var k = [];
		
		if(a == 1){
			k = [];
			k.push(['-1', '请选择季度']);
			k.push([1, '1季度']);
			k.push([2, '2季度']);
		}else if(a == 2){
			k = [];
			k.push(['-1', '请选择季度']);
			k.push([3, '3季度']);
			k.push([4, '4季度']);
		}else if(a == '-1'){
			k = [];	
			k.push(['-1', '请选择季度']);
			k.push([1, '1季度']);
			k.push([2, '2季度']);
			k.push([3, '3季度']);
			k.push([4, '4季度']);
		}
		
		var m = this.ownerCt.Quarter;
		m.store.proxy = new Ext.data.MemoryProxy(k);
		m.store.load();
	},
	findRecord : function(c, b) {
		var a;
		
		if (this.store.getCount() > 0) {
			this.store.each(function(d) {
				if (d.data[c] == b) {
					a = d;
					return false;
				}
			})
		}
		
		return a;
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
			this.select(a, false);
		}
	},
	onViewClick : function(b) {
		var a = this.view.getSelectedIndexes()[0];
		var c = this.store.getAt(a);
		
		if (c) {
			this.onSelect(c, a);
		}
		
		if (b !== false) {
			this.el.focus();
		}
	},
	restrictHeight : function() {
		this.innerList.dom.style.height = "";
		var b = this.innerList.dom;
		var e = this.list.getFrameWidth("tb")
				+ (this.resizable ? this.handleHeight : 0)
				+ this.assetHeight;
		var c = Math.max(b.clientHeight, b.offsetHeight, b.scrollHeight);
		var a = this.getPosition()[1] - Ext.getBody().getScroll().top;
		var g = Ext.lib.Dom.getViewHeight() - a - this.getSize().height;
		var d = Math.max(a, g, this.minHeight || 0) - this.list.shadowOffset - e - 5;
		c = Math.min(c, d, this.maxHeight);
		this.innerList.setHeight(c);
		this.list.beginUpdate();
		this.list.setHeight(c + e);
		this.list.alignTo(this.wrap, this.listAlign);
		this.list.endUpdate();
	},
	onEmptyResults : function() {
		this.collapse()
	},
	isExpanded : function() {
		return this.list && this.list.isVisible();
	},
	selectByValue : function(a, c) {
		if (a !== undefined && a !== null) {
			var b = this.findRecord(this.valueField || this.displayField, a);
			
			if (b) {
				this.select(this.store.indexOf(b), c);
				return true;
			}
		}
		
		return false;
	},
	select : function(a, c) {
		this.selectedIndex = a;
		this.view.select(a);
		
		if (c !== false) {
			var b = this.view.getNode(a);
			
			if (b) {
				this.innerList.scrollChildIntoView(b, false);
			}
		}
	},
	selectNext : function() {
		var a = this.store.getCount();
		
		if (a > 0) {
			if (this.selectedIndex == -1) {
				this.select(0);
			} else {
				if (this.selectedIndex < a - 1) {
					this.select(this.selectedIndex + 1);
				}
			}
		}
	},
	selectPrev : function() {
		var a = this.store.getCount();
		
		if (a > 0) {
			if (this.selectedIndex == -1) {
				this.select(0);
			} else {
				if (this.selectedIndex != 0) {
					this.select(this.selectedIndex - 1);
				}
			}
		}
	},
	onKeyUp : function(a) {
		if (this.editable !== false && !a.isSpecialKey()) {
			this.lastKey = a.getKey();
			this.dqTask.delay(this.queryDelay);
		}
	},
	validateBlur : function() {
		return !this.list || !this.list.isVisible();
	},
	initQuery : function() {
		this.doQuery(this.getRawValue());
	},
	doForce : function() {
		if (this.el.dom.value.length > 0) {
			this.el.dom.value = this.lastSelectionText === undefined
					? ""
					: this.lastSelectionText;
			this.applyEmptyText();
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
			return false;
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
					
					this.onLoad();
				} else {
					this.store.baseParams[this.queryParam] = c;
					this.store.load({
						params : this.getParams(c)
					});
					this.expand();
				}
			} else {
				this.selectedIndex = -1;
				this.onLoad();
			}
		}
	},
	getParams : function(a) {
		var b = {};
		
		if (this.pageSize) {
			b.start = 0;
			b.limit = this.pageSize;
		}
		
		return b;
	},
	collapse : function() {
		if (!this.isExpanded()) {
			return;
		}
		
		this.list.hide();
		Ext.getDoc().un("mousewheel", this.collapseIf, this);
		Ext.getDoc().un("mousedown", this.collapseIf, this);
		this.fireEvent("collapse", this);
	},
	collapseIf : function(a) {
		if (!a.within(this.wrap) && !a.within(this.list)) {
			this.collapse();
		}
	},
	expand : function() {
		if (this.isExpanded() || !this.hasFocus) {
			return;
		}
		
		this.list.alignTo(this.wrap, this.listAlign);
		this.list.show();
		this.innerList.setOverflow("auto");
		Ext.getDoc().on("mousewheel", this.collapseIf, this);
		Ext.getDoc().on("mousedown", this.collapseIf, this);
		this.fireEvent("expand", this);
	},
	onTriggerClick : function() {
		if (this.disabled) {
			return;
		}
		
		if (this.isExpanded()) {
			this.collapse();
			this.el.focus();
		} else {
			this.onFocus({});
			if (this.triggerAction == "all") {
				this.doQuery(this.allQuery, true);
			} else {
				this.doQuery(this.getRawValue());
			}
			
			this.el.focus();
		}
	}
});

Ext.reg("halfyear", Ext.form.HalfYear);

/*
 * 显示季度
 */
Ext.form.NumberComboBox = Ext.extend(Ext.form.ComboBox, {
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
	mode : "local",
	minListWidth : 70,
	forceSelection : false,
	typeAheadDelay : 250,
	lazyInit : true,
	startNumber : 1,
	endNumber : 4,	
	displayText : '',
	isupcase : false,		//大写
	initComponent : function() {
		/*
		 * alter
		 */
		Ext.form.NumberComboBox.superclass.initComponent.call(this);
		this.addEvents("expand", "collapse", "beforeselect", "select", "beforequery");
		
		if (this.transform) {
			this.allowDomMove = false;
			var c = Ext.getDom(this.transform);
			
			if (!this.hiddenName) {
				this.hiddenName = c.name
			}
			
			if (!this.store) {
				this.mode = "local";
				var k = [], e = c.options;
				
				for (var b = 0, a = e.length; b < a; b++) {
					var h = e[b];
					var g = (Ext.isIE
							? h.getAttributeNode("value").specified
							: h.hasAttribute("value"))
							? h.value
							: h.text;
					
					if (h.selected) {
						this.value = g
					}
					
					k.push([g, h.text])
				}
				
				this.store = new Ext.data.SimpleStore({
					id : 0,
					fields : ["value", "text"],
					data : k
				});
				
				this.valueField = "value";
				this.displayField = "text"
			}
			
			c.name = Ext.id();
			
			if (!this.lazyRender) {
				this.target = true;
				this.el = Ext.DomHelper.insertBefore(c, this.autoCreate || this.defaultAutoCreate);
				Ext.removeNode(c);
				this.render(this.el.parentNode)
			} else {
				Ext.removeNode(c)
			}
		} else {
			if(!this.store){					
				var k = [];
				/*
				 * 季度设置
				 */
				k.push(['-1','请选择季度']);
				
				if(!this.startNumber || this.startNumber == ''){
					this.startNumber = 1;
				}
				
				if(!this.endNumber || this.endNumber == ''){
					this.endNumber = 4;
				}
				
				for(var i = this.startNumber; i <= this.endNumber; i++){
					if(this.isupcase){
						var n = '';
						
						switch(i){
							case 1:
								n = '一';
								break;
							case 2:
								n = '二';
								break;
							case 3:
								n = '三';
								break;
							default:
								n = '四';
								break;
						}
						
						k.push([i, '第' + n + this.displayText]);
					}else{
						k.push([i, i + this.displayText]);
					}
				}
				
				this.store = new Ext.data.SimpleStore({
					id : 0,
					fields : ["value", "text"],
					data : k
				});
				
				this.valueField = "value";
				this.displayField = "text";
			}
			
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
				this.mode = "local";
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
		/*
		 * alter
		 */
		Ext.form.NumberComboBox.superclass.onRender.call(this, b, a);
		
		if (this.hiddenName) {
			this.hiddenField = this.el.insertSibling({
				tag : "input",
				type : "hidden",
				name : this.hiddenName,
				id : (this.hiddenId || this.hiddenName)
			}, "before", true);
			
			this.el.dom.removeAttribute("name");
		}
		
		if (Ext.isGecko) {
			this.el.dom.setAttribute("autocomplete", "off");
		}
		
		if (!this.lazyInit) {
			this.initList();
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
		Ext.form.NumberComboBox.superclass.initValue.call(this);
		
		if (this.hiddenField) {
			this.hiddenField.value = this.hiddenValue !== undefined
					? this.hiddenValue
					: this.value !== undefined ? this.value : "";
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
			
			var b = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
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
				this.tpl = '<tpl for="."><div class="' + a + '-item">{' + this.displayField + "}</div></tpl>"
			}
			
			this.view = new Ext.DataView({
				applyTo : this.innerList,
				tpl : this.tpl,
				singleSelect : true,
				selectedClass : this.selectedClass,
				itemSelector : this.itemSelector || "." + a + "-item"
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
				
				this[this.pageSize ? "footer" : "innerList"].setStyle("margin-bottom", this.handleHeight + "px");
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
					this.view.setStore(null);
				}
			}
		}
		
		if (a) {
			this.store = Ext.StoreMgr.lookup(a);
			this.store.on("beforeload", this.onBeforeLoad, this);
			this.store.on("load", this.onLoad, this);
			this.store.on("loadexception", this.collapse, this);
			
			if (this.view) {
				this.view.setStore(a);
			}
		}
	},
	initEvents : function() {
		Ext.form.NumberComboBox.superclass.initEvents.call(this);
		
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
					return Ext.KeyNav.prototype.doRelay.apply(this, arguments);
				}
				
				return true
			},
			forceKeyDown : true
		});
		
		this.queryDelay = Math.max(this.queryDelay || 10, this.mode == "local" ? 10 : 250);
		this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
		
		if (this.typeAhead) {
			this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this);
		}
		
		if (this.editable !== false) {
			this.el.on("keyup", this.onKeyUp, this);
		}
		
		if (this.forceSelection) {
			this.on("blur", this.doForce, this);
		}
	},
	onDestroy : function() {
		if (this.view) {
			Ext.destroy(this.view);
		}
		
		if (this.list) {
			if (this.innerList) {
				this.innerList.un("mouseover", this.onViewOver, this);
				this.innerList.un("mousemove", this.onViewMove, this);
			}
			
			this.list.destroy();
		}
		
		if (this.dqTask) {
			this.dqTask.cancel();
			this.dqTask = null;
		}
		
		this.bindStore(null);
		Ext.form.NumberComboBox.superclass.onDestroy.call(this);
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
		Ext.form.NumberComboBox.superclass.onResize.apply(this, arguments);
		
		if (this.list && this.listWidth === undefined) {
			var c = Math.max(a, this.minListWidth);
			this.list.setWidth(c);
			this.innerList.setWidth(c - this.list.getFrameWidth("lr"))
		}
	},
	onEnable : function() {
		Ext.form.NumberComboBox.superclass.onEnable.apply(this, arguments);
		
		if (this.hiddenField) {
			this.hiddenField.disabled = false
		}
	},
	onDisable : function() {
		Ext.form.NumberComboBox.superclass.onDisable.apply(this, arguments);
		
		if (this.hiddenField) {
			this.hiddenField.disabled = true
		}
	},
	setEditable : function(a) {
		if (a == this.editable) {
			return;
		}
		
		this.editable = a;
		
		if (!a) {
			this.el.dom.setAttribute("readOnly", true);
			this.el.on("mousedown", this.onTriggerClick, this);
			this.el.addClass("x-combo-noedit");
		} else {
			this.el.dom.removeAttribute("readOnly");
			this.el.un("mousedown", this.onTriggerClick, this);
			this.el.removeClass("x-combo-noedit");
		}
	},
	onBeforeLoad : function() {
		if (!this.hasFocus) {
			return;
		}
		
		this.innerList.update(this.loadingText
				? '<div class="loading-indicator">' + this.loadingText + "</div>" : "");
		this.restrictHeight();
		this.selectedIndex = -1
	},
	onLoad : function() {
		if (!this.hasFocus) {
			return;
		}
		
		if (this.store.getCount() > 0) {
			this.expand();
			this.restrictHeight();
			
			if (this.lastQuery == this.allQuery) {
				if (this.editable) {
					this.el.dom.select();
				}
				
				if (!this.selectByValue(this.value, true)) {
					this.select(0, true);
				}
			} else {
				this.selectNext();
				
				if (this.typeAhead
						&& this.lastKey != Ext.EventObject.BACKSPACE
						&& this.lastKey != Ext.EventObject.DELETE) {
					this.taTask.delay(this.typeAheadDelay);
				}
			}
		} else {
			this.onEmptyResults();
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
				this.selectText(d, c.length);
			}
		}
	},
	onSelect : function(a, b) {
		if (this.fireEvent("beforeselect", this, a, b) !== false) {
			this.setValue(a.data[this.valueField || this.displayField]);
			this.collapse();
			this.fireEvent("select", this, a, b);
		}
	},
	getValue : function() {
		if (this.valueField) {
			return typeof this.value != "undefined" ? this.value : "";
		} else {
			return Ext.form.NumberComboBox.superclass.getValue.call(this);
		}
	},
	clearValue : function() {
		if (this.hiddenField) {
			this.hiddenField.value = "";
		}
		
		this.setRawValue("");
		this.lastSelectionText = "";
		this.applyEmptyText();
		this.value = "";
	},
	setValue : function(a) {
		var c = a;
		
		if (this.valueField) {
			var b = this.findRecord(this.valueField, a);
			
			if (b) {
				c = b.data[this.displayField];
			} else {
				if (this.valueNotFoundText !== undefined) {
					c = this.valueNotFoundText;
				}
			}
		}
		
		this.lastSelectionText = c;
		
		if (this.hiddenField) {
			this.hiddenField.value = a;
		}
		
		Ext.form.NumberComboBox.superclass.setValue.call(this, c);
		this.value = a;
		
		var k = [];
		
		if(a == 1){
			k = [];
			k.push(['-1', '请选择月份']);
			k.push([1, '1月']);
			k.push([2, '2月']);
			k.push([3, '3月']);
		}else if(a == 2){
			k = [];
			k.push(['-1', '请选择月份']);
			k.push([4, '4月']);
			k.push([5, '5月']);
			k.push([6, '6月']);
			
		}else if(a == 3){
			k = [];
			k.push(['-1', '请选择月份']);
			k.push([7, '7月']);
			k.push([8, '8月']);
			k.push([9, '9月']);
		}else if(a == 4){
			k = [];
			k.push(['-1', '请选择月份']);
			k.push([10, '10月']);
			k.push([11, '11月']);
			k.push([12, '12月']);
		}else if(a == '-1'){
			k = [];	
			k.push(['-1', '请选择月份']);
			k.push([1, '1月']);
			k.push([2, '2月']);
			k.push([3, '3月']);
			k.push([4, '4月']);
			k.push([5, '5月']);
			k.push([6, '6月']);
			k.push([7, '7月']);
			k.push([8, '8月']);
			k.push([9, '9月']);
			k.push([10, '10月']);
			k.push([11, '11月']);
			k.push([12, '12月']);
		}
		
		var m = this.ownerCt.Month;
		m.store.proxy = new Ext.data.MemoryProxy(k);
		m.store.load();
	},
	findRecord : function(c, b) {
		var a;
		
		if (this.store.getCount() > 0) {
			this.store.each(function(d) {
				if (d.data[c] == b) {
					a = d;
					return false;
				}
			})
		}
		
		return a;
	},
	onViewMove : function(b, a) {
		this.inKeyMode = false;
	},
	onViewOver : function(d, b) {
		if (this.inKeyMode) {
			return;
		}
		
		var c = this.view.findItemFromChild(b);
		
		if (c) {
			var a = this.view.indexOf(c);
			this.select(a, false);
		}
	},
	onViewClick : function(b) {
		var a = this.view.getSelectedIndexes()[0];
		var c = this.store.getAt(a);
		
		if (c) {
			this.onSelect(c, a);
		}
		
		if (b !== false) {
			this.el.focus();
		}
	},
	restrictHeight : function() {
		this.innerList.dom.style.height = "";
		var b = this.innerList.dom;
		var e = this.list.getFrameWidth("tb")
				+ (this.resizable ? this.handleHeight : 0)
				+ this.assetHeight;
		var c = Math.max(b.clientHeight, b.offsetHeight, b.scrollHeight);
		var a = this.getPosition()[1] - Ext.getBody().getScroll().top;
		var g = Ext.lib.Dom.getViewHeight() - a - this.getSize().height;
		var d = Math.max(a, g, this.minHeight || 0) - this.list.shadowOffset - e - 5;
		c = Math.min(c, d, this.maxHeight);
		this.innerList.setHeight(c);
		this.list.beginUpdate();
		this.list.setHeight(c + e);
		this.list.alignTo(this.wrap, this.listAlign);
		this.list.endUpdate()
	},
	onEmptyResults : function() {
		this.collapse();
	},
	isExpanded : function() {
		return this.list && this.list.isVisible();
	},
	selectByValue : function(a, c) {
		if (a !== undefined && a !== null) {
			var b = this.findRecord(this.valueField || this.displayField, a);
			
			if (b) {
				this.select(this.store.indexOf(b), c);
				return true;
			}
		}
		
		return false;
	},
	select : function(a, c) {
		this.selectedIndex = a;
		this.view.select(a);
		
		if (c !== false) {
			var b = this.view.getNode(a);
			
			if (b) {
				this.innerList.scrollChildIntoView(b, false);
			}
		}
	},
	selectNext : function() {
		var a = this.store.getCount();
		
		if (a > 0) {
			if (this.selectedIndex == -1) {
				this.select(0);
			} else {
				if (this.selectedIndex < a - 1) {
					this.select(this.selectedIndex + 1);
				}
			}
		}
	},
	selectPrev : function() {
		var a = this.store.getCount();
		
		if (a > 0) {
			if (this.selectedIndex == -1) {
				this.select(0);
			} else {
				if (this.selectedIndex != 0) {
					this.select(this.selectedIndex - 1);
				}
			}
		}
	},
	onKeyUp : function(a) {
		if (this.editable !== false && !a.isSpecialKey()) {
			this.lastKey = a.getKey();
			this.dqTask.delay(this.queryDelay);
		}
	},
	validateBlur : function() {
		return !this.list || !this.list.isVisible();
	},
	initQuery : function() {
		this.doQuery(this.getRawValue());
	},
	doForce : function() {
		if (this.el.dom.value.length > 0) {
			this.el.dom.value = this.lastSelectionText === undefined
					? ""
					: this.lastSelectionText;
			this.applyEmptyText();
		}
	},
	doQuery : function(c, b) {
		if (c === undefined || c === null) {
			c = "";
		}
		
		var a = {
			query : c,
			forceAll : b,
			combo : this,
			cancel : false
		};
		
		if (this.fireEvent("beforequery", a) === false || a.cancel) {
			return false;
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
					
					this.onLoad();
				} else {
					this.store.baseParams[this.queryParam] = c;
					
					this.store.load({
						params : this.getParams(c)
					});
					
					this.expand();
				}
			} else {
				this.selectedIndex = -1;
				this.onLoad();
			}
		}
	},
	getParams : function(a) {
		var b = {};
		
		if (this.pageSize) {
			b.start = 0;
			b.limit = this.pageSize
		}
		
		return b;
	},
	collapse : function() {
		if (!this.isExpanded()) {
			return;
		}
		
		this.list.hide();
		Ext.getDoc().un("mousewheel", this.collapseIf, this);
		Ext.getDoc().un("mousedown", this.collapseIf, this);
		this.fireEvent("collapse", this);
	},
	collapseIf : function(a) {
		if (!a.within(this.wrap) && !a.within(this.list)) {
			this.collapse();
		}
	},
	expand : function() {
		if (this.isExpanded() || !this.hasFocus) {
			return;
		}
		
		this.list.alignTo(this.wrap, this.listAlign);
		this.list.show();
		this.innerList.setOverflow("auto");
		Ext.getDoc().on("mousewheel", this.collapseIf, this);
		Ext.getDoc().on("mousedown", this.collapseIf, this);
		this.fireEvent("expand", this);
	},
	onTriggerClick : function() {
		if (this.disabled) {
			return;
		}
		
		if (this.isExpanded()) {
			this.collapse();
			this.el.focus();
		} else {
			this.onFocus({});
			
			if (this.triggerAction == "all") {
				this.doQuery(this.allQuery, true);
			} else {
				this.doQuery(this.getRawValue());
			}
			
			this.el.focus();
		}
	}
});

Ext.reg("numbercombo", Ext.form.NumberComboBox);

/**
 * 上报日期组件
 * 其中封装了年/半年/季度/月
 * @class Ext.form.ReportPeriod
 * @extends Ext.Panel
 */
Ext.form.ReportPeriod = Ext.extend(Ext.Panel, {
	layout : 'column',
	yearName : 'year',
	yearLabelText : '',
	allowYearNull : false,
	halfYearName : 'halfyear',
	halfYearLabelText : '',
	allowHalfYearNull : false,
	quarterName : 'quarter',
	quarterLabelText : '',
	allowQuarterNull : false,
	monthName : 'month',
	monthLabelText : '',
	seperator: '',
	allowMonthNull : true,
	monthEmtyText : '月',
	yearEmtyText : '年',
	halfYearEmtyText : '半年',
	quarterEmtyText : '季',
	width:480,
	reportLabelText : '上报周期  ',		//上报周期的名称
	editable : false,
	yearHasDefaultValue : false,
	yearDefaultValue : '',
	halfYearHasDefaultValue : false,
	halfYearDefaultValue : '-1',
	quarterDefaultValue:'-1',
	initComponent : function(){
		this.ReportLabel = new Ext.form.Label({
			cls : 'x-form-item-label',
			html : "<div class=\"x-form-item\" tabindex='-1' style='width:100px'><label  class=\"x-form-item-label\">" + this.reportLabelText + ":" + '&nbsp;&nbsp;</label></div>'
		});
		
		this.Year = new Ext.form.Year({
			name : this.yearName,
	        emptyText: this.yearEmtyText,
	        mode: 'local',
	        triggerAction: 'all',	
	        beforeYears :'',
	        lastYears : '',
	        currentYear : '',
	        width : 80,
	        editable : this.editable
		});
		
		if(this.yearHasDefaultValue){
			if(!this.yearDefaultValue || this.yearDefaultValue == '' || this.yearDefaultValue == 0){
				var cy = new Date().getYear();
				cy = cy < 1900 ? (1900 + cy) : cy;
				this.yearDefaultValue = cy;
			}
			
			this.Year.setValue(this.yearDefaultValue);
		}
		
		this.yearLabel = new Ext.form.Label({
			text : this.yearLabelText + this.seperator
		});
		
		this.HalfYear = new Ext.form.HalfYear({
			name : this.halfYearName,
	        emptyText: this.halfYearEmtyText,
	        mode: 'local',
	        triggerAction: 'all',	
	        width : 80,
	        displayText : '半年',
	        editable : this.editable
		});
		
		if(this.halfYearHasDefaultValue){
			if(!this.halfYearDefaultValue || this.halfYearDefaultValue == '' || this.halfYearDefaultValue == 0){
				this.halfYearDefaultValue = 2;
			}
			
			this.HalfYear.setValue(this.halfYearDefaultValue);
		}
		
		this.halfYearLabel = new Ext.form.Label({
			text : this.halfYearLabelText + this.seperator
		});
		
		var half_k = [];
		
		switch(this.halfYearDefaultValue){
			case 1 : 
				half_k.push(['-1', '请选择季度']);
				half_k.push([1, '1季度']);
				half_k.push([2, '2季度']);
				break;
			case 2 : 
				half_k.push(['-1', '请选择季度']);
				half_k.push([3, '3季度']);
				half_k.push([4, '4季度']);
				break;
			default :	
				half_k.push(['-1', '请选择季度']);
				half_k.push([1, '1季度']);
				half_k.push([2, '2季度']);
				half_k.push([3, '3季度']);
				half_k.push([4, '4季度']);
		}
		
		this.halfYearStore = new Ext.data.SimpleStore({
			id : 0,
			fields : ["value", "text"],
			data : half_k
		});
		
		this.Quarter = new Ext.form.NumberComboBox({
			name : this.quarterName,
	        emptyText: this.quarterEmtyText,
	        mode: 'local',
	        triggerAction: 'all',
	        width : 80,
	        displayText : '季度',
	        store: this.halfYearStore,
	        valueField : 'value',
	        displayField : 'text',
	        editable : this.editable
		});
		
		this.quarterLabel = new Ext.form.Label({
			text : this.quarterLabelText + this.seperator
		});
		
		if(typeof this.quarterDefaultValue == 'string'){
			this.quarterDefaultValue = Number(this.quarterDefaultValue);
		}
		
		var k = [];
		
		switch(this.quarterDefaultValue){
			case 1 : 
				k.push(['-1', '请选择月份']);
				k.push([1, '1月']);
				k.push([2, '2月']);
				k.push([3, '3月']);
				break;
			case 2 : 
				k.push(['-1', '请选择月份']);
				k.push([4, '4月']);
				k.push([5, '5月']);
				k.push([6, '6月']);
				break;
			case 3 : 
				k.push(['-1', '请选择月份']);
				k.push([7, '7月']);
				k.push([8, '8月']);
				k.push([9, '9月']);
				break;
			case 4 : 
				k.push(['-1', '请选择月份']);
				k.push([10, '10月']);
				k.push([11, '11月']);
				k.push([12, '12月']);
				break;
			default :	
				k.push(['-1', '请选择月份']);
				k.push([1, '1月']);
				k.push([2, '2月']);
				k.push([3, '3月']);
				k.push([4, '4月']);
				k.push([5, '5月']);
				k.push([6, '6月']);
				k.push([7, '7月']);
				k.push([8, '8月']);
				k.push([9, '9月']);
				k.push([10, '10月']);
				k.push([11, '11月']);
				k.push([12, '12月']);
		}
		
		this.monthStore = new Ext.data.SimpleStore({
			id : 0,
			fields : ["value", "text"],
			data : k
		});
		
		this.Month = new Ext.form.ComboBox({
			name : this.monthName,
	        emptyText: this.monthEmtyText,
	        mode: 'local',
	        triggerAction: 'all',
	        startNumber : 1,
	        endNumber : 12,
	        store: this.monthStore,
	        valueField : 'value',
	        displayField : 'text',
	        width : 80,
	        editable : this.editable,
	        disabled : false
		});
		
		this.monthLabel = new Ext.form.Label({
			text : this.monthLabelText + this.seperator
		});
		
		this.HalfYear.on('select', function(combox) {
			var k = []; var mk = [];
			
			if(combox.value == 1){
				k = [];
				k.push(['-1', '请选择季度']);
				k.push([1, '1季度']);
				k.push([2, '2季度']);
				mk = [];
				mk.push(['-1', '请选择月份']);
				mk.push([1, '1月']);
				mk.push([2, '2月']);
				mk.push([3, '3月']);
				mk.push([4, '4月']);
				mk.push([5, '5月']);
				mk.push([6, '6月']);
			}else if(combox.value == 2){
				k = [];
				k.push(['-1', '请选择季度']);
				k.push([3, '3季度']);
				k.push([4, '4季度']);
				mk = [];
				mk.push(['-1', '请选择月份']);
				mk.push([7, '7月']);
				mk.push([8, '8月']);
				mk.push([9, '9月']);
				mk.push([10, '10月']);
				mk.push([11, '11月']);
				mk.push([12, '12月']);
			}else if(combox.value == '-1'){
				k = [];	
				k.push(['-1', '请选择季度']);
				k.push([1, '1季度']);
				k.push([2, '2季度']);
				k.push([3, '3季度']);
				k.push([4, '4季度']);
				mk = [];
				mk.push(['-1', '请选择月份']);
				mk.push([1, '1月']);
				mk.push([2, '2月']);
				mk.push([3, '3月']);
				mk.push([4, '4月']);
				mk.push([5, '5月']);
				mk.push([6, '6月']);
				mk.push([7, '7月']);
				mk.push([8, '8月']);
				mk.push([9, '9月']);
				mk.push([10, '10月']);
				mk.push([11, '11月']);
				mk.push([12, '12月']);
			}
			
			var m = this.ownerCt.Quarter;
			m.store.proxy = new Ext.data.MemoryProxy(k);
			
			m.store.load({
				callback : function(r) {
					if (r.length >= 1) {
						var key = r[0].get('value');						
						m.setValue('-1');
					}
				}
			});
			
			var m2 = this.ownerCt.Month;
			m2.store.proxy = new Ext.data.MemoryProxy(mk);
			
			m2.store.load({
				callback : function(r) {
					if (r.length >= 1) {
						var key = r[0].get('value');						
						m2.setValue('-1');
					}
				}
			});
		});
		
		this.Quarter.on('select', function(combox) {
			var k = []; var hk = []; var hk_val = '-1';

			if(combox.value == 1){
				k = [];
				k.push(['-1', '请选择月份']);
				k.push([1, '1月']);
				k.push([2, '2月']);
				k.push([3, '3月']);
				hk_val = '1';
			}else if(combox.value == 2){
				k = [];
				k.push(['-1', '请选择月份']);
				k.push([4, '4月']);
				k.push([5, '5月']);
				k.push([6, '6月']);
				hk_val = '1';
			}else if(combox.value == 3){
				k = [];
				k.push(['-1', '请选择月份']);
				k.push([7, '7月']);
				k.push([8, '8月']);
				k.push([9, '9月']);
				hk_val = '2';
			}else if(combox.value == 4){
				k = [];
				k.push(['-1', '请选择月份']);
				k.push([10, '10月']);
				k.push([11, '11月']);
				k.push([12, '12月']);
				hk_val = '2';
			}else if(combox.value == '-1'){
				k = [];
				k.push(['-1', '请选择月份']);
				
				if(this.ownerCt.HalfYear.getValue() == '1'){
					k.push([1, '1月']);
					k.push([2, '2月']);
					k.push([3, '3月']);
					k.push([4, '4月']);
					k.push([5, '5月']);
					k.push([6, '6月']);
				}else if(this.ownerCt.HalfYear.getValue() == '2'){
					k.push([7, '7月']);
					k.push([8, '8月']);
					k.push([9, '9月']);
					k.push([10, '10月']);
					k.push([11, '11月']);
					k.push([12, '12月']);
				}else if(this.ownerCt.HalfYear.getValue() == '-1'){
					k.push([1, '1月']);
					k.push([2, '2月']);
					k.push([3, '3月']);
					k.push([4, '4月']);
					k.push([5, '5月']);
					k.push([6, '6月']);
					k.push([7, '7月']);
					k.push([8, '8月']);
					k.push([9, '9月']);
					k.push([10, '10月']);
					k.push([11, '11月']);
					k.push([12, '12月']);
				}
				
				hk_val = '0';
			}
			
			var m = this.ownerCt.Month;
			m.store.proxy = new Ext.data.MemoryProxy(k);
			m.store.load({
				callback : function(r) {
					if (r.length >= 1) {
						var key = r[0].get('value');						
						m.setValue('-1');
					}
				}
			});
			
			if(hk_val != '0'){
				hk = [];
				hk.push(['-1', '请选择半年度']);
				hk.push([1, '上半年']);
				hk.push([2, '下半年']);
				var hm = this.ownerCt.HalfYear;
				hm.store.proxy = new Ext.data.MemoryProxy(hk);
				hm.store.load({
					callback : function(r) {
						if (r.length >= 1) {
							var key = r[0].get('value');
							hm.setValue(hk_val);
						}
					}
				});
				
				this.collapse();
			}
		});
		
		this.Month.on('select', function(combox) {
			var hk = []; var hk_val = '-1'; var qk = []; var qk_val = '-1';

			if(combox.value == 1){
				qk = [];
				qk.push(['-1', '请选择季度']);
				qk.push([1, '1季度']);
				qk.push([2, '2季度']);
				hk_val = '1';
				qk_val = '1';
			}else if(combox.value == 2){
				qk = [];
				qk.push(['-1', '请选择季度']);
				qk.push([1, '1季度']);
				qk.push([2, '2季度']);
				hk_val = '1';
				qk_val = '1';
			}else if(combox.value == 3){
				qk = [];
				qk.push(['-1', '请选择季度']);
				qk.push([1, '1季度']);
				qk.push([2, '2季度']);
				hk_val = '1';
				qk_val = '1';
			}else if(combox.value == 4){
				qk = [];
				qk.push(['-1', '请选择季度']);
				qk.push([1, '1季度']);
				qk.push([2, '2季度']);
				hk_val = '1';
				qk_val = '2';
			}else if(combox.value == 5){
				qk = [];
				qk.push(['-1', '请选择季度']);
				qk.push([1, '1季度']);
				qk.push([2, '2季度']);
				hk_val = '1';
				qk_val = '2';
			}else if(combox.value == 6){
				qk = [];
				qk.push(['-1', '请选择季度']);
				qk.push([1, '1季度']);
				qk.push([2, '2季度']);
				hk_val = '1';
				qk_val = '2';
			}else if(combox.value == 7){
				qk = [];
				qk.push(['-1', '请选择季度']);
				qk.push([3, '3季度']);
				qk.push([4, '4季度']);
				hk_val = '2';
				qk_val = '3';
			}else if(combox.value == 8){
				qk = [];
				qk.push(['-1', '请选择季度']);
				qk.push([3, '3季度']);
				qk.push([4, '4季度']);
				hk_val = '2';
				qk_val = '3';
			}else if(combox.value == 9){
				qk = [];
				qk.push(['-1', '请选择季度']);
				qk.push([3, '3季度']);
				qk.push([4, '4季度']);
				hk_val = '2';
				qk_val = '3';
			}else if(combox.value == 10){
				qk = [];
				qk.push(['-1', '请选择季度']);
				qk.push([3, '3季度']);
				qk.push([4, '4季度']);
				hk_val = '2';
				qk_val = '4';
			}else if(combox.value == 11){
				qk = [];
				qk.push(['-1', '请选择季度']);
				qk.push([3, '3季度']);
				qk.push([4, '4季度']);
				hk_val = '2';
				qk_val = '4';
			}else if(combox.value == 12){
				qk = [];
				qk.push(['-1', '请选择季度']);
				qk.push([3, '3季度']);
				qk.push([4, '4季度']);
				hk_val = '2';
				qk_val = '4';
			}
			
			if(combox.value != '-1'){
				hk = [];
				hk.push(['-1', '请选择半年度']);
				hk.push([1, '上半年']);
				hk.push([2, '下半年']);
				var hm = this.ownerCt.HalfYear;
				hm.store.proxy = new Ext.data.MemoryProxy(hk);
				hm.store.load({
					callback : function(r) {
						if (r.length >= 1) {
							var key = r[0].get('value');						
							hm.setValue(hk_val);
						}
					}
				});
				
				var qm = this.ownerCt.Quarter;
				qm.store.proxy = new Ext.data.MemoryProxy(qk);
				qm.store.load({
					callback : function(r) {
						if (r.length >= 1) {
							var key = r[0].get('value');						
							qm.setValue(qk_val);
						}
					}
				});
				
				this.collapse();
			}
		});
		
		this.items = [this.ReportLabel,this.yearLabel,this.Year,this.halfYearLabel,this.HalfYear,this.quarterLabel,this.Quarter,this.monthLabel,this.Month];
		Ext.form.ReportPeriod.superclass.initComponent.call(this);
	},
	getYearValue : function(){
		return this.Year.getValue();
	},
	getHalfYearValue : function(){
		return this.HalfYear.getValue();
	},
	getMonthValue : function(){
		return this.Month.getValue();
	},
	getQuarterValue : function(){
		return this.Quarter.getValue();
	}
});

Ext.reg("reportperiod", Ext.form.ReportPeriod);