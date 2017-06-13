Ext.grid.GridView = function(a) {
	Ext.apply(this, a);
	this.addEvents("beforerowremoved", "beforerowsinserted", "beforerefresh",
			"rowremoved", "rowsinserted", "rowupdated", "refresh");
	Ext.grid.GridView.superclass.constructor.call(this)
};
Ext.extend(Ext.grid.GridView, Ext.util.Observable, {
	deferEmptyText : true,
	scrollOffset : 19,
	autoFill : false,
	forceFit : false,
	sortClasses : ["sort-asc", "sort-desc"],
	sortAscText : "Sort Ascending",
	sortDescText : "Sort Descending",
	columnsText : "Columns",
	borderWidth : 2,
	tdClass : "x-grid3-cell",
	hdCls : "x-grid3-hd",
	cellSelectorDepth : 4,
	rowSelectorDepth : 10,
	cellSelector : "td.x-grid3-cell",
	rowSelector : "div.x-grid3-row",
	initTemplates : function() {
		var c = this.templates || {};
		if (!c.master) {
			c.master = new Ext.Template(
					'<div class="x-grid3" hidefocus="true">',
					'<div class="x-grid3-viewport">',
					'<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset">{header}</div></div><div class="x-clear"></div></div>',
					'<div class="x-grid3-scroller"><div class="x-grid3-body">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>',
					"</div>",
					'<div class="x-grid3-resize-marker">&#160;</div>',
					'<div class="x-grid3-resize-proxy">&#160;</div>', "</div>")
		}
		if (!c.header) {
			c.header = new Ext.Template(
					'<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
					'<thead><tr class="x-grid3-hd-row">{cells}</tr></thead>',
					"</table>")
		}
		if (!c.hcell) {
			c.hcell = new Ext.Template(
					'<td class="x-grid3-hd x-grid3-cell x-grid3-td-{id} {css}" style="{style}"><div {tooltip} {attr} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">',
					this.grid.enableHdMenu
							? '<a class="x-grid3-hd-btn" href="#"></a>'
							: "",
					'{value}<img class="x-grid3-sort-icon" src="',
					Ext.BLANK_IMAGE_URL, '" />', "</div></td>")
		}
		if (!c.body) {
			c.body = new Ext.Template("{rows}")
		}
		if (!c.row) {
			c.row = new Ext.Template(
					'<div class="x-grid3-row {alt}" style="{tstyle}"><table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
					"<tbody><tr>{cells}</tr>",
					(this.enableRowBody
							? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on"><div class="x-grid3-row-body">{body}</div></td></tr>'
							: ""), "</tbody></table></div>")
		}
		if (!c.cell) {
			c.cell = new Ext.Template(
					'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
					'<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
					"</td>")
		}
		for (var a in c) {
			var b = c[a];
			if (b && typeof b.compile == "function" && !b.compiled) {
				b.disableFormats = true;
				b.compile()
			}
		}
		this.templates = c;
		this.colRe = new RegExp("x-grid3-td-([^\\s]+)", "")
	},
	fly : function(a) {
		if (!this._flyweight) {
			this._flyweight = new Ext.Element.Flyweight(document.body)
		}
		this._flyweight.dom = a;
		return this._flyweight
	},
	getEditorParent : function() {
		return this.scroller.dom
	},
	initElements : function() {
		var c = Ext.Element;
		var b = this.grid.getGridEl().dom.firstChild;
		var a = b.childNodes;
		this.el = new c(b);
		this.mainWrap = new c(a[0]);
		this.mainHd = new c(this.mainWrap.dom.firstChild);
		if (this.grid.hideHeaders) {
			this.mainHd.setDisplayed(false)
		}
		this.innerHd = this.mainHd.dom.firstChild;
		this.scroller = new c(this.mainWrap.dom.childNodes[1]);
		if (this.forceFit) {
			this.scroller.setStyle("overflow-x", "hidden")
		}
		this.mainBody = new c(this.scroller.dom.firstChild);
		this.focusEl = new c(this.scroller.dom.childNodes[1]);
		this.focusEl.swallowEvent("click", true);
		this.resizeMarker = new c(a[1]);
		this.resizeProxy = new c(a[2])
	},
	getRows : function() {
		return this.hasRows() ? this.mainBody.dom.childNodes : []
	},
	findCell : function(a) {
		if (!a) {
			return false
		}
		return this.fly(a)
				.findParent(this.cellSelector, this.cellSelectorDepth)
	},
	findCellIndex : function(c, b) {
		var a = this.findCell(c);
		if (a && (!b || this.fly(a).hasClass(b))) {
			return this.getCellIndex(a)
		}
		return false
	},
	getCellIndex : function(b) {
		if (b) {
			var a = b.className.match(this.colRe);
			if (a && a[1]) {
				return this.cm.getIndexById(a[1])
			}
		}
		return false
	},
	findHeaderCell : function(b) {
		var a = this.findCell(b);
		return a && this.fly(a).hasClass(this.hdCls) ? a : null
	},
	findHeaderIndex : function(a) {
		return this.findCellIndex(a, this.hdCls)
	},
	findRow : function(a) {
		if (!a) {
			return false
		}
		return this.fly(a).findParent(this.rowSelector, this.rowSelectorDepth)
	},
	findRowIndex : function(a) {
		var b = this.findRow(a);
		return b ? b.rowIndex : false
	},
	getRow : function(a) {
		return this.getRows()[a]
	},
	getCell : function(b, a) {
		return this.getRow(b).getElementsByTagName("td")[a]
	},
	getHeaderCell : function(a) {
		return this.mainHd.dom.getElementsByTagName("td")[a]
	},
	addRowClass : function(c, a) {
		var b = this.getRow(c);
		if (b) {
			this.fly(b).addClass(a)
		}
	},
	removeRowClass : function(c, a) {
		var b = this.getRow(c);
		if (b) {
			this.fly(b).removeClass(a)
		}
	},
	removeRow : function(a) {
		Ext.removeNode(this.getRow(a));
		this.syncFocusEl(a)
	},
	removeRows : function(c, a) {
		var b = this.mainBody.dom;
		for (var d = c; d <= a; d++) {
			Ext.removeNode(b.childNodes[c])
		}
		this.syncFocusEl(c)
	},
	getScrollState : function() {
		var a = this.scroller.dom;
		return {
			left : a.scrollLeft,
			top : a.scrollTop
		}
	},
	restoreScroll : function(a) {
		var b = this.scroller.dom;
		b.scrollLeft = a.left;
		b.scrollTop = a.top
	},
	scrollToTop : function() {
		this.scroller.dom.scrollTop = 0;
		this.scroller.dom.scrollLeft = 0
	},
	syncScroll : function() {
		this.syncHeaderScroll();
		var a = this.scroller.dom;
		this.grid.fireEvent("bodyscroll", a.scrollLeft, a.scrollTop)
	},
	syncHeaderScroll : function() {
		var a = this.scroller.dom;
		this.innerHd.scrollLeft = a.scrollLeft;
		this.innerHd.scrollLeft = a.scrollLeft
	},
	updateSortIcon : function(b, a) {
		var d = this.sortClasses;
		var c = this.mainHd.select("td").removeClass(d);
		c.item(b).addClass(d[a == "DESC" ? 1 : 0])
	},
	updateAllColumnWidths : function() {
		var d = this.getTotalWidth();
		var k = this.cm.getColumnCount();
		var f = [];
		for (var b = 0; b < k; b++) {
			f[b] = this.getColumnWidth(b)
		}
		this.innerHd.firstChild.firstChild.style.width = d;
		for (var b = 0; b < k; b++) {
			var c = this.getHeaderCell(b);
			c.style.width = f[b]
		}
		var g = this.getRows(), l, h;
		for (var b = 0, e = g.length; b < e; b++) {
			l = g[b];
			l.style.width = d;
			if (l.firstChild) {
				l.firstChild.style.width = d;
				h = l.firstChild.rows[0];
				for (var a = 0; a < k; a++) {
					h.childNodes[a].style.width = f[a]
				}
			}
		}
		this.onAllColumnWidthsUpdated(f, d)
	},
	updateColumnWidth : function(b, a) {
		var h = this.getColumnWidth(b);
		var e = this.getTotalWidth();
		this.innerHd.firstChild.firstChild.style.width = e;
		var d = this.getHeaderCell(b);
		d.style.width = h;
		var g = this.getRows(), j;
		for (var c = 0, f = g.length; c < f; c++) {
			j = g[c];
			j.style.width = e;
			if (j.firstChild) {
				j.firstChild.style.width = e;
				j.firstChild.rows[0].childNodes[b].style.width = h
			}
		}
		this.onColumnWidthUpdated(b, h, e)
	},
	updateColumnHidden : function(a, e) {
		var d = this.getTotalWidth();
		this.innerHd.firstChild.firstChild.style.width = d;
		var g = e ? "none" : "";
		var c = this.getHeaderCell(a);
		c.style.display = g;
		var h = this.getRows(), j;
		for (var b = 0, f = h.length; b < f; b++) {
			j = h[b];
			j.style.width = d;
			if (j.firstChild) {
				j.firstChild.style.width = d;
				j.firstChild.rows[0].childNodes[a].style.display = g
			}
		}
		this.onColumnHiddenUpdated(a, e, d);
		delete this.lastViewWidth;
		this.layout()
	},
	doRender : function(f, h, q, a, o, v) {
		var b = this.templates, e = b.cell, g = b.row, k = o - 1;
		var d = "width:" + this.getTotalWidth() + ";";
		var y = [], s, z, t = {}, l = {
			tstyle : d
		}, n;
		for (var u = 0, x = h.length; u < x; u++) {
			n = h[u];
			s = [];
			var m = (u + a);
			for (var w = 0; w < o; w++) {
				z = f[w];
				t.id = z.id;
				t.css = w == 0 ? "x-grid3-cell-first " : (w == k
						? "x-grid3-cell-last "
						: "");
				t.attr = t.cellAttr = "";
				t.value = z.renderer(n.data[z.name], t, n, m, w, q);
				t.style = z.style;
				if (t.value == undefined || t.value === "") {
					t.value = "&#160;"
				}
				if (n.dirty && typeof n.modified[z.name] !== "undefined") {
					t.css += " x-grid3-dirty-cell"
				}
				s[s.length] = e.apply(t)
			}
			var A = [];
			if (v && ((m + 1) % 2 == 0)) {
				A[0] = "x-grid3-row-alt"
			}
			if (n.dirty) {
				A[1] = " x-grid3-dirty-row"
			}
			l.cols = o;
			if (this.getRowClass) {
				A[2] = this.getRowClass(n, m, l, q)
			}
			l.alt = A.join(" ");
			l.cells = s.join("");
			y[y.length] = g.apply(l)
		}
		return y.join("")
	},
	processRows : function(e, d) {
		if (this.ds.getCount() < 1) {
			return
		}
		d = d || !this.grid.stripeRows;
		e = e || 0;
		var j = this.getRows();
		var f = " x-grid3-row-alt ";
		j[0].className += " x-grid3-row-first";
		j[j.length - 1].className += " x-grid3-row-last";
		for (var b = e, c = j.length; b < c; b++) {
			var h = j[b];
			h.rowIndex = b;
			if (!d) {
				var a = ((b + 1) % 2 == 0);
				var g = (" " + h.className + " ").indexOf(f) != -1;
				if (a == g) {
					continue
				}
				if (a) {
					h.className += " x-grid3-row-alt"
				} else {
					h.className = h.className.replace("x-grid3-row-alt", "")
				}
			}
		}
	},
	afterRender : function() {
		this.mainBody.dom.innerHTML = this.renderRows();
		this.processRows(0, true);
		if (this.deferEmptyText !== true) {
			this.applyEmptyText()
		}
	},
	renderUI : function() {
		var d = this.renderHeaders();
		var a = this.templates.body.apply({
					rows : ""
				});
		var b = this.templates.master.apply({
					body : a,
					header : d
				});
		var c = this.grid;
		c.getGridEl().dom.innerHTML = b;
		this.initElements();
		Ext.fly(this.innerHd).on("click", this.handleHdDown, this);
		this.mainHd.on("mouseover", this.handleHdOver, this);
		this.mainHd.on("mouseout", this.handleHdOut, this);
		this.mainHd.on("mousemove", this.handleHdMove, this);
		this.scroller.on("scroll", this.syncScroll, this);
		if (c.enableColumnResize !== false) {
			this.splitZone = new Ext.grid.GridView.SplitDragZone(c,
					this.mainHd.dom)
		}
		if (c.enableColumnMove) {
			this.columnDrag = new Ext.grid.GridView.ColumnDragZone(c,
					this.innerHd);
			this.columnDrop = new Ext.grid.HeaderDropZone(c, this.mainHd.dom)
		}
		if (c.enableHdMenu !== false) {
			if (c.enableColumnHide !== false) {
				this.colMenu = new Ext.menu.Menu({
							id : c.id + "-hcols-menu"
						});
				this.colMenu.on("beforeshow", this.beforeColMenuShow, this);
				this.colMenu.on("itemclick", this.handleHdMenuClick, this)
			}
			this.hmenu = new Ext.menu.Menu({
						id : c.id + "-hctx"
					});
			this.hmenu.add({
						id : "asc",
						text : this.sortAscText,
						cls : "xg-hmenu-sort-asc"
					}, {
						id : "desc",
						text : this.sortDescText,
						cls : "xg-hmenu-sort-desc"
					});
			if (c.enableColumnHide !== false) {
				this.hmenu.add("-", {
							id : "columns",
							text : this.columnsText,
							menu : this.colMenu,
							iconCls : "x-cols-icon"
						})
			}
			this.hmenu.on("itemclick", this.handleHdMenuClick, this)
		}
		if (c.trackMouseOver) {
			this.mainBody.on("mouseover", this.onRowOver, this);
			this.mainBody.on("mouseout", this.onRowOut, this)
		}
		if (c.enableDragDrop || c.enableDrag) {
			this.dragZone = new Ext.grid.GridDragZone(c, {
						ddGroup : c.ddGroup || "GridDD"
					})
		}
		this.updateHeaderSortState()
	},
	layout : function() {
		if (!this.mainBody) {
			return
		}
		var d = this.grid;
		var h = d.getGridEl();
		var a = h.getSize(true);
		var b = a.width;
		if (b < 20 || a.height < 20) {
			return
		}
		if (d.autoHeight) {
			this.scroller.dom.style.overflow = "visible";
			if (Ext.isSafari) {
				this.scroller.dom.style.position = "static"
			}
		} else {
			this.el.setSize(a.width, a.height);
			var f = this.mainHd.getHeight();
			var e = a.height - (f);
			this.scroller.setSize(b, e);
			if (this.innerHd) {
				this.innerHd.style.width = (b) + "px"
			}
		}
		if (this.forceFit) {
			if (this.lastViewWidth != b) {
				this.fitColumns(false, false);
				this.lastViewWidth = b
			}
		} else {
			this.autoExpand();
			this.syncHeaderScroll()
		}
		this.onLayout(b, e)
	},
	onLayout : function(a, b) {
	},
	onColumnWidthUpdated : function(c, a, b) {
		this.focusEl.setWidth(b)
	},
	onAllColumnWidthsUpdated : function(a, b) {
		this.focusEl.setWidth(b)
	},
	onColumnHiddenUpdated : function(b, c, a) {
		this.focusEl.setWidth(a)
	},
	updateColumnText : function(a, b) {
	},
	afterMove : function(a) {
	},
	init : function(a) {
		this.grid = a;
		this.initTemplates();
		this.initData(a.store, a.colModel);
		this.initUI(a)
	},
	getColumnId : function(a) {
		return this.cm.getColumnId(a)
	},
	renderHeaders : function() {
		var h = this.cm, f = this.templates;
		var d = f.hcell;
		var b = [], g = [], a = {};
		var e = h.getColumnCount();
		var j = e - 1;
		for (var c = 0; c < e; c++) {
			a.id = h.getColumnId(c);
			a.value = h.getColumnHeader(c) || "";
			a.style = this.getColumnStyle(c, true);
			a.tooltip = this.getColumnTooltip(c);
			a.css = c == 0 ? "x-grid3-cell-first " : (c == j
					? "x-grid3-cell-last "
					: "");
			if (h.config[c].align == "right") {
				a.istyle = "padding-right:16px"
			} else {
				delete a.istyle
			}
			b[b.length] = d.apply(a)
		}
		return f.header.apply({
					cells : b.join(""),
					tstyle : "width:" + this.getTotalWidth() + ";"
				})
	},
	getColumnTooltip : function(a) {
		var b = this.cm.getColumnTooltip(a);
		if (b) {
			if (Ext.QuickTips.isEnabled()) {
				return 'ext:qtip="' + b + '"'
			} else {
				return 'title="' + b + '"'
			}
		}
		return ""
	},
	beforeUpdate : function() {
		this.grid.stopEditing(true)
	},
	updateHeaders : function() {
		this.innerHd.firstChild.innerHTML = this.renderHeaders()
	},
	focusRow : function(a) {
		this.focusCell(a, 0, false)
	},
	focusCell : function(c, a, b) {
		this.syncFocusEl(this.ensureVisible(c, a, b));
		if (Ext.isGecko) {
			this.focusEl.focus()
		} else {
			this.focusEl.focus.defer(1, this.focusEl)
		}
	},
	resolveCell : function(e, c, d) {
		if (typeof e != "number") {
			e = e.rowIndex
		}
		if (!this.ds) {
			return null
		}
		if (e < 0 || e >= this.ds.getCount()) {
			return null
		}
		c = (c !== undefined ? c : 0);
		var b = this.getRow(e), a;
		if (!(d === false && c === 0)) {
			while (this.cm.isHidden(c)) {
				c++
			}
			a = this.getCell(e, c)
		}
		return {
			row : b,
			cell : a
		}
	},
	getResolvedXY : function(a) {
		if (!a) {
			return null
		}
		var b = this.scroller.dom, e = a.cell, d = a.row;
		return e ? Ext.fly(e).getXY() : [this.el.getX(), Ext.fly(d).getY()]
	},
	syncFocusEl : function(d, a, c) {
		var b = d;
		if (!Ext.isArray(b)) {
			d = Math.min(d, Math.max(0, this.getRows().length - 1));
			b = this.getResolvedXY(this.resolveCell(d, a, c))
		}
		this.focusEl.setXY(b || this.scroller.getXY())
	},
	ensureVisible : function(s, f, e) {
		var q = this.resolveCell(s, f, e);
		if (!q || !q.row) {
			return
		}
		var j = q.row, g = q.cell;
		var m = this.scroller.dom;
		var r = 0;
		var d = j, n = this.el.dom;
		while (d && d != n) {
			r += d.offsetTop;
			d = d.offsetParent
		}
		r -= this.mainHd.dom.offsetHeight;
		var o = r + j.offsetHeight;
		var a = m.clientHeight;
		var n = parseInt(m.scrollTop, 10);
		var l = n + a;
		if (r < n) {
			m.scrollTop = r
		} else {
			if (o > l) {
				m.scrollTop = o - a
			}
		}
		if (e !== false) {
			var k = parseInt(g.offsetLeft, 10);
			var i = k + g.offsetWidth;
			var h = parseInt(m.scrollLeft, 10);
			var b = h + m.clientWidth;
			if (k < h) {
				m.scrollLeft = k
			} else {
				if (i > b) {
					m.scrollLeft = i - m.clientWidth
				}
			}
		}
		return this.getResolvedXY(q)
	},
	insertRows : function(a, f, c, e) {
		if (!e && f === 0 && c >= a.getCount() - 1) {
			this.refresh()
		} else {
			if (!e) {
				this.fireEvent("beforerowsinserted", this, f, c)
			}
			var b = this.renderRows(f, c);
			var d = this.getRow(f);
			if (d) {
				Ext.DomHelper.insertHtml("beforeBegin", d, b)
			} else {
				Ext.DomHelper.insertHtml("beforeEnd", this.mainBody.dom, b)
			}
			if (!e) {
				this.fireEvent("rowsinserted", this, f, c);
				this.processRows(f)
			}
		}
		this.syncFocusEl(f)
	},
	deleteRows : function(a, c, b) {
		if (a.getRowCount() < 1) {
			this.refresh()
		} else {
			this.fireEvent("beforerowsdeleted", this, c, b);
			this.removeRows(c, b);
			this.processRows(c);
			this.fireEvent("rowsdeleted", this, c, b)
		}
	},
	getColumnStyle : function(a, c) {
		var b = !c ? (this.cm.config[a].css || "") : "";
		b += "width:" + this.getColumnWidth(a) + ";";
		if (this.cm.isHidden(a)) {
			b += "display:none;"
		}
		var d = this.cm.config[a].align;
		if (d) {
			b += "text-align:" + d + ";"
		}
		return b
	},
	getColumnWidth : function(b) {
		var a = this.cm.getColumnWidth(b);
		if (typeof a == "number") {
			return (Ext.isBorderBox ? a : (a - this.borderWidth > 0 ? a
					- this.borderWidth : 0))
					+ "px"
		}
		return a
	},
	getTotalWidth : function() {
		return this.cm.getTotalWidth() + "px"
	},
	fitColumns : function(d, g, e) {
		var f = this.cm, t, m, p;
		var s = f.getTotalWidth(false);
		var k = this.grid.getGridEl().getWidth(true) - this.scrollOffset;
		if (k < 20) {
			return
		}
		var b = k - s;
		if (b === 0) {
			return false
		}
		var a = f.getColumnCount(true);
		var q = a - (typeof e == "number" ? 1 : 0);
		if (q === 0) {
			q = 1;
			e = undefined
		}
		var l = f.getColumnCount();
		var j = [];
		var o = 0;
		var n = 0;
		var h;
		for (p = 0; p < l; p++) {
			if (!f.isHidden(p) && !f.isFixed(p) && p !== e) {
				h = f.getColumnWidth(p);
				j.push(p);
				o = p;
				j.push(h);
				n += h
			}
		}
		var c = (k - f.getTotalWidth()) / n;
		while (j.length) {
			h = j.pop();
			p = j.pop();
			f.setColumnWidth(p, Math.max(this.grid.minColumnWidth, Math.floor(h
									+ h * c)), true)
		}
		if ((s = f.getTotalWidth(false)) > k) {
			var r = q != a ? e : o;
			f.setColumnWidth(r, Math.max(1, f.getColumnWidth(r) - (s - k)),
					true)
		}
		if (d !== true) {
			this.updateAllColumnWidths()
		}
		return true
	},
	autoExpand : function(b) {
		var h = this.grid, a = this.cm;
		if (!this.userResized && h.autoExpandColumn) {
			var d = a.getTotalWidth(false);
			var i = this.grid.getGridEl().getWidth(true) - this.scrollOffset;
			if (d != i) {
				var f = a.getIndexById(h.autoExpandColumn);
				var e = a.getColumnWidth(f);
				var c = Math.min(Math.max(((i - d) + e), h.autoExpandMin),
						h.autoExpandMax);
				if (c != e) {
					a.setColumnWidth(f, c, true);
					if (b !== true) {
						this.updateColumnWidth(f, c)
					}
				}
			}
		}
	},
	getColumnData : function() {
		var d = [], a = this.cm, e = a.getColumnCount();
		for (var c = 0; c < e; c++) {
			var b = a.getDataIndex(c);
			d[c] = {
				name : (typeof b == "undefined"
						? this.ds.fields.get(c).name
						: b),
				renderer : a.getRenderer(c),
				id : a.getColumnId(c),
				style : this.getColumnStyle(c)
			}
		}
		return d
	},
	renderRows : function(i, c) {
		var d = this.grid, f = d.colModel, a = d.store, j = d.stripeRows;
		var h = f.getColumnCount();
		if (a.getCount() < 1) {
			return ""
		}
		var e = this.getColumnData();
		i = i || 0;
		c = typeof c == "undefined" ? a.getCount() - 1 : c;
		var b = a.getRange(i, c);
		return this.doRender(e, b, a, i, h, j)
	},
	renderBody : function() {
		var a = this.renderRows();
		return this.templates.body.apply({
					rows : a
				})
	},
	refreshRow : function(b) {
		var d = this.ds, c;
		if (typeof b == "number") {
			c = b;
			b = d.getAt(c)
		} else {
			c = d.indexOf(b)
		}
		var a = [];
		this.insertRows(d, c, c, true);
		this.getRow(c).rowIndex = c;
		this.onRemove(d, b, c + 1, true);
		this.fireEvent("rowupdated", this, c, b)
	},
	refresh : function(b) {
		this.fireEvent("beforerefresh", this);
		this.grid.stopEditing(true);
		var a = this.renderBody();
		this.mainBody.update(a);
		if (b === true) {
			this.updateHeaders();
			this.updateHeaderSortState()
		}
		this.processRows(0, true);
		this.layout();
		this.applyEmptyText();
		this.fireEvent("refresh", this)
	},
	applyEmptyText : function() {
		if (this.emptyText && !this.hasRows()) {
			this.mainBody.update('<div class="x-grid-empty">' + this.emptyText
					+ "</div>")
		}
	},
	updateHeaderSortState : function() {
		var b = this.ds.getSortState();
		if (!b) {
			return
		}
		if (!this.sortState
				|| (this.sortState.field != b.field || this.sortState.direction != b.direction)) {
			this.grid.fireEvent("sortchange", this.grid, b)
		}
		this.sortState = b;
		var c = this.cm.findColumnIndex(b.field);
		if (c != -1) {
			var a = b.direction;
			this.updateSortIcon(c, a)
		}
	},
	destroy : function() {
		if (this.colMenu) {
			Ext.menu.MenuMgr.unregister(this.colMenu);
			this.colMenu.destroy();
			delete this.colMenu
		}
		if (this.hmenu) {
			Ext.menu.MenuMgr.unregister(this.hmenu);
			this.hmenu.destroy();
			delete this.hmenu
		}
		if (this.grid.enableColumnMove) {
			var c = Ext.dd.DDM.ids["gridHeader" + this.grid.getGridEl().id];
			if (c) {
				for (var a in c) {
					if (!c[a].config.isTarget && c[a].dragElId) {
						var b = c[a].dragElId;
						c[a].unreg();
						Ext.get(b).remove()
					} else {
						if (c[a].config.isTarget) {
							c[a].proxyTop.remove();
							c[a].proxyBottom.remove();
							c[a].unreg()
						}
					}
					if (Ext.dd.DDM.locationCache[a]) {
						delete Ext.dd.DDM.locationCache[a]
					}
				}
				delete Ext.dd.DDM.ids["gridHeader" + this.grid.getGridEl().id]
			}
		}
		if (this.dragZone) {
			this.dragZone.unreg()
		}
		Ext.fly(this.innerHd).removeAllListeners();
		Ext.removeNode(this.innerHd);
		Ext
				.destroy(this.resizeMarker, this.resizeProxy, this.focusEl,
						this.mainBody, this.scroller, this.mainHd,
						this.mainWrap, this.dragZone, this.splitZone,
						this.columnDrag, this.columnDrop);
		this.initData(null, null);
		Ext.EventManager.removeResizeListener(this.onWindowResize, this);
		this.purgeListeners()
	},
	onDenyColumnHide : function() {
	},
	render : function() {
		if (this.autoFill) {
			var a = this.grid.ownerCt;
			if (a && a.getLayout()) {
				a.on("afterlayout", function() {
							this.fitColumns(true, true);
							this.updateHeaders()
						}, this, {
							single : true
						})
			} else {
				this.fitColumns(true, true)
			}
		} else {
			if (this.forceFit) {
				this.fitColumns(true, false)
			} else {
				if (this.grid.autoExpandColumn) {
					this.autoExpand(true)
				}
			}
		}
		this.renderUI()
	},
	initData : function(b, a) {
		if (this.ds) {
			this.ds.un("load", this.onLoad, this);
			this.ds.un("datachanged", this.onDataChange, this);
			this.ds.un("add", this.onAdd, this);
			this.ds.un("remove", this.onRemove, this);
			this.ds.un("update", this.onUpdate, this);
			this.ds.un("clear", this.onClear, this)
		}
		if (b) {
			b.on("load", this.onLoad, this);
			b.on("datachanged", this.onDataChange, this);
			b.on("add", this.onAdd, this);
			b.on("remove", this.onRemove, this);
			b.on("update", this.onUpdate, this);
			b.on("clear", this.onClear, this)
		}
		this.ds = b;
		if (this.cm) {
			this.cm.un("configchange", this.onColConfigChange, this);
			this.cm.un("widthchange", this.onColWidthChange, this);
			this.cm.un("headerchange", this.onHeaderChange, this);
			this.cm.un("hiddenchange", this.onHiddenChange, this);
			this.cm.un("columnmoved", this.onColumnMove, this);
			this.cm.un("columnlockchange", this.onColumnLock, this)
		}
		if (a) {
			delete this.lastViewWidth;
			a.on("configchange", this.onColConfigChange, this);
			a.on("widthchange", this.onColWidthChange, this);
			a.on("headerchange", this.onHeaderChange, this);
			a.on("hiddenchange", this.onHiddenChange, this);
			a.on("columnmoved", this.onColumnMove, this);
			a.on("columnlockchange", this.onColumnLock, this)
		}
		this.cm = a
	},
	onDataChange : function() {
		this.refresh();
		this.updateHeaderSortState();
		this.syncFocusEl(0)
	},
	onClear : function() {
		this.refresh();
		this.syncFocusEl(0)
	},
	onUpdate : function(b, a) {
		this.refreshRow(a)
	},
	onAdd : function(c, a, b) {
		this.insertRows(c, b, b + (a.length - 1))
	},
	onRemove : function(d, a, b, c) {
		if (c !== true) {
			this.fireEvent("beforerowremoved", this, b, a)
		}
		this.removeRow(b);
		if (c !== true) {
			this.processRows(b);
			this.applyEmptyText();
			this.fireEvent("rowremoved", this, b, a)
		}
	},
	onLoad : function() {
		this.scrollToTop()
	},
	onColWidthChange : function(a, b, c) {
		this.updateColumnWidth(b, c)
	},
	onHeaderChange : function(a, b, c) {
		this.updateHeaders()
	},
	onHiddenChange : function(a, b, c) {
		this.updateColumnHidden(b, c)
	},
	onColumnMove : function(a, d, b) {
		this.indexMap = null;
		var c = this.getScrollState();
		this.refresh(true);
		this.restoreScroll(c);
		this.afterMove(b)
	},
	onColConfigChange : function() {
		delete this.lastViewWidth;
		this.indexMap = null;
		this.refresh(true)
	},
	initUI : function(a) {
		a.on("headerclick", this.onHeaderClick, this)
	},
	initEvents : function() {
	},
	onHeaderClick : function(b, a) {
		if (this.headersDisabled || !this.cm.isSortable(a)) {
			return
		}
		b.stopEditing(true);
		b.store.sort(this.cm.getDataIndex(a))
	},
	onRowOver : function(b, a) {
		var c;
		if ((c = this.findRowIndex(a)) !== false) {
			this.addRowClass(c, "x-grid3-row-over")
		}
	},
	onRowOut : function(b, a) {
		var c;
		if ((c = this.findRowIndex(a)) !== false
				&& !b.within(this.getRow(c), true)) {
			this.removeRowClass(c, "x-grid3-row-over")
		}
	},
	handleWheel : function(a) {
		a.stopPropagation()
	},
	onRowSelect : function(a) {
		this.addRowClass(a, "x-grid3-row-selected")
	},
	onRowDeselect : function(a) {
		this.removeRowClass(a, "x-grid3-row-selected")
	},
	onCellSelect : function(c, b) {
		var a = this.getCell(c, b);
		if (a) {
			this.fly(a).addClass("x-grid3-cell-selected")
		}
	},
	onCellDeselect : function(c, b) {
		var a = this.getCell(c, b);
		if (a) {
			this.fly(a).removeClass("x-grid3-cell-selected")
		}
	},
	onColumnSplitterMoved : function(c, b) {
		this.userResized = true;
		var a = this.grid.colModel;
		a.setColumnWidth(c, b, true);
		if (this.forceFit) {
			this.fitColumns(true, false, c);
			this.updateAllColumnWidths()
		} else {
			this.updateColumnWidth(c, b);
			this.syncHeaderScroll()
		}
		this.grid.fireEvent("columnresize", c, b)
	},
	handleHdMenuClick : function(c) {
		var b = this.hdCtxIndex;
		var a = this.cm, d = this.ds;
		switch (c.id) {
			case "asc" :
				d.sort(a.getDataIndex(b), "ASC");
				break;
			case "desc" :
				d.sort(a.getDataIndex(b), "DESC");
				break;
			default :
				b = a.getIndexById(c.id.substr(4));
				if (b != -1) {
					if (c.checked
							&& a.getColumnsBy(this.isHideableColumn, this).length <= 1) {
						this.onDenyColumnHide();
						return false
					}
					a.setHidden(b, c.checked)
				}
		}
		return true
	},
	isHideableColumn : function(a) {
		return !a.hidden && !a.fixed
	},
	beforeColMenuShow : function() {
		var a = this.cm, c = a.getColumnCount();
		this.colMenu.removeAll();
		for (var b = 0; b < c; b++) {
			if (a.config[b].fixed !== true && a.config[b].hideable !== false) {
				this.colMenu.add(new Ext.menu.CheckItem({
							id : "col-" + a.getColumnId(b),
							text : a.getColumnHeader(b),
							checked : !a.isHidden(b),
							hideOnClick : false,
							disabled : a.config[b].hideable === false
						}))
			}
		}
	},
	handleHdDown : function(g, d) {
		if (Ext.fly(d).hasClass("x-grid3-hd-btn")) {
			g.stopEvent();
			var f = this.findHeaderCell(d);
			Ext.fly(f).addClass("x-grid3-hd-menu-open");
			var c = this.getCellIndex(f);
			this.hdCtxIndex = c;
			var b = this.hmenu.items, a = this.cm;
			b.get("asc").setDisabled(!a.isSortable(c));
			b.get("desc").setDisabled(!a.isSortable(c));
			this.hmenu.on("hide", function() {
						Ext.fly(f).removeClass("x-grid3-hd-menu-open")
					}, this, {
						single : true
					});
			this.hmenu.show(d, "tl-bl?")
		}
	},
	handleHdOver : function(d, a) {
		var c = this.findHeaderCell(a);
		if (c && !this.headersDisabled) {
			this.activeHd = c;
			this.activeHdIndex = this.getCellIndex(c);
			var b = this.fly(c);
			this.activeHdRegion = b.getRegion();
			if (!this.cm.isMenuDisabled(this.activeHdIndex)) {
				b.addClass("x-grid3-hd-over");
				this.activeHdBtn = b.child(".x-grid3-hd-btn");
				if (this.activeHdBtn) {
					this.activeHdBtn.dom.style.height = (c.firstChild.offsetHeight - 1)
							+ "px"
				}
			}
		}
	},
	handleHdMove : function(g, d) {
		if (this.activeHd && !this.headersDisabled) {
			var b = this.splitHandleWidth || 5;
			var f = this.activeHdRegion;
			var a = g.getPageX();
			var c = this.activeHd.style;
			if (a - f.left <= b && this.cm.isResizable(this.activeHdIndex - 1)) {
				c.cursor = Ext.isAir ? "move" : Ext.isSafari
						? "e-resize"
						: "col-resize"
			} else {
				if (f.right - a <= (!this.activeHdBtn ? b : 2)
						&& this.cm.isResizable(this.activeHdIndex)) {
					c.cursor = Ext.isAir ? "move" : Ext.isSafari
							? "w-resize"
							: "col-resize"
				} else {
					c.cursor = ""
				}
			}
		}
	},
	handleHdOut : function(c, a) {
		var b = this.findHeaderCell(a);
		if (b && (!Ext.isIE || !c.within(b, true))) {
			this.activeHd = null;
			this.fly(b).removeClass("x-grid3-hd-over");
			b.style.cursor = ""
		}
	},
	hasRows : function() {
		var a = this.mainBody.dom.firstChild;
		return a && a.className != "x-grid-empty"
	},
	bind : function(a, b) {
		this.initData(a, b)
	}
});
Ext.grid.GridView.SplitDragZone = function(a, b) {
	this.grid = a;
	this.view = a.getView();
	this.marker = this.view.resizeMarker;
	this.proxy = this.view.resizeProxy;
	Ext.grid.GridView.SplitDragZone.superclass.constructor.call(this, b,
			"gridSplitters" + this.grid.getGridEl().id, {
				dragElId : Ext.id(this.proxy.dom),
				resizeFrame : false
			});
	this.scroll = false;
	this.hw = this.view.splitHandleWidth || 5
};
Ext.extend(Ext.grid.GridView.SplitDragZone, Ext.dd.DDProxy, {
			b4StartDrag : function(a, e) {
				this.view.headersDisabled = true;
				var d = this.view.mainWrap.getHeight();
				this.marker.setHeight(d);
				this.marker.show();
				this.marker.alignTo(this.view.getHeaderCell(this.cellIndex),
						"tl-tl", [-2, 0]);
				this.proxy.setHeight(d);
				var b = this.cm.getColumnWidth(this.cellIndex);
				var c = Math.max(b - this.grid.minColumnWidth, 0);
				this.resetConstraints();
				this.setXConstraint(c, 1000);
				this.setYConstraint(0, 0);
				this.minX = a - c;
				this.maxX = a + 1000;
				this.startPos = a;
				Ext.dd.DDProxy.prototype.b4StartDrag.call(this, a, e)
			},
			handleMouseDown : function(a) {
				var i = this.view.findHeaderCell(a.getTarget());
				if (i) {
					var l = this.view.fly(i).getXY(), f = l[0], d = l[1];
					var j = a.getXY(), c = j[0], b = j[1];
					var h = i.offsetWidth, g = false;
					if ((c - f) <= this.hw) {
						g = -1
					} else {
						if ((f + h) - c <= this.hw) {
							g = 0
						}
					}
					if (g !== false) {
						this.cm = this.grid.colModel;
						var k = this.view.getCellIndex(i);
						if (g == -1) {
							if (k + g < 0) {
								return
							}
							while (this.cm.isHidden(k + g)) {
								--g;
								if (k + g < 0) {
									return
								}
							}
						}
						this.cellIndex = k + g;
						this.split = i.dom;
						if (this.cm.isResizable(this.cellIndex)
								&& !this.cm.isFixed(this.cellIndex)) {
							Ext.grid.GridView.SplitDragZone.superclass.handleMouseDown
									.apply(this, arguments)
						}
					} else {
						if (this.view.columnDrag) {
							this.view.columnDrag.callHandleMouseDown(a)
						}
					}
				}
			},
			endDrag : function(d) {
				this.marker.hide();
				var a = this.view;
				var b = Math.max(this.minX, d.getPageX());
				var c = b - this.startPos;
				a.onColumnSplitterMoved(this.cellIndex, this.cm
								.getColumnWidth(this.cellIndex)
								+ c);
				setTimeout(function() {
							a.headersDisabled = false
						}, 50)
			},
			autoOffset : function() {
				this.setDelta(0, 0)
			}
		});