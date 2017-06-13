Ext.data.Field = function(d) {
	if (typeof d == "string") {
		d = {
			name : d
		}
	}
	Ext.apply(this, d);
	if (!this.type) {
		this.type = "auto"
	}
	var c = Ext.data.SortTypes;
	if (typeof this.sortType == "string") {
		this.sortType = c[this.sortType]
	}
	if (!this.sortType) {
		switch (this.type) {
			case "string" :
				this.sortType = c.asUCString;
				break;
			case "date" :
				this.sortType = c.asDate;
				break;
			default :
				this.sortType = c.none
		}
	}
	var e = /[\$,%]/g;
	if (!this.convert) {
		var b, a = this.dateFormat;
		switch (this.type) {
			case "" :
			case "auto" :
			case undefined :
				b = function(f) {
					return f
				};
				break;
			case "string" :
				b = function(f) {
					return (f === undefined || f === null) ? "" : String(f)
				};
				break;
			case "int" :
				b = function(f) {
					return f !== undefined && f !== null && f !== ""
							? parseInt(String(f).replace(e, ""), 10)
							: ""
				};
				break;
			case "float" :
				b = function(f) {
					return f !== undefined && f !== null && f !== ""
							? parseFloat(String(f).replace(e, ""), 10)
							: ""
				};
				break;
			case "bool" :
			case "boolean" :
				b = function(f) {
					return f === true || f === "true" || f == 1
				};
				break;
			case "date" :
				b = function(g) {
					if (!g) {
						return ""
					}
					if (Ext.isDate(g)) {
						return g
					}
					if (a) {
						if (a == "timestamp") {
							return new Date(g * 1000)
						}
						if (a == "time") {
							return new Date(parseInt(g, 10))
						}
						return Date.parseDate(g, a)
					}
					var f = Date.parse(g);
					return f ? new Date(f) : null
				};
				break
		}
		this.convert = b
	}
};
Ext.data.Field.prototype = {
	dateFormat : null,
	defaultValue : "",
	mapping : null,
	sortType : null,
	sortDir : "ASC"
};