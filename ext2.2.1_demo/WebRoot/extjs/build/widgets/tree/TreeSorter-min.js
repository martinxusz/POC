Ext.tree.TreeSorter = function(b, c) {
	Ext.apply(this, c);
	b.on("beforechildrenrendered", this.doSort, this);
	b.on("append", this.updateSort, this);
	b.on("insert", this.updateSort, this);
	b.on("textchange", this.updateSortParent, this);
	var e = this.dir && this.dir.toLowerCase() == "desc";
	var f = this.property || "text";
	var g = this.sortType;
	var a = this.folderSort;
	var d = this.caseSensitive === true;
	var h = this.leafAttr || "leaf";
	this.sortFn = function(j, i) {
		if (a) {
			if (j.attributes[h] && !i.attributes[h]) {
				return 1
			}
			if (!j.attributes[h] && i.attributes[h]) {
				return -1
			}
		}
		var l = g
				? g(j)
				: (d ? j.attributes[f] : j.attributes[f].toUpperCase());
		var k = g
				? g(i)
				: (d ? i.attributes[f] : i.attributes[f].toUpperCase());
		if (l < k) {
			return e ? +1 : -1
		} else {
			if (l > k) {
				return e ? -1 : +1
			} else {
				return 0
			}
		}
	}
};
Ext.tree.TreeSorter.prototype = {
	doSort : function(a) {
		a.sort(this.sortFn)
	},
	compareNodes : function(b, a) {
		return (b.text.toUpperCase() > a.text.toUpperCase() ? 1 : -1)
	},
	updateSort : function(a, b) {
		if (b.childrenRendered) {
			this.doSort.defer(1, this, [b])
		}
	},
	updateSortParent : function(a) {
		var b = a.parentNode;
		if (b && b.childrenRendered) {
			this.doSort.defer(1, this, [b])
		}
	}
};