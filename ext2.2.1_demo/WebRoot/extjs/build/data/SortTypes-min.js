Ext.data.SortTypes = {
	none : function(a) {
		return a
	},
	stripTagsRE : /<\/?[^>]+>/gi,
	asText : function(a) {
		return String(a).replace(this.stripTagsRE, "")
	},
	asUCText : function(a) {
		return String(a).toUpperCase().replace(this.stripTagsRE, "")
	},
	asUCString : function(a) {
		return String(a).toUpperCase()
	},
	asDate : function(a) {
		if (!a) {
			return 0
		}
		if (Ext.isDate(a)) {
			return a.getTime()
		}
		return Date.parse(String(a))
	},
	asFloat : function(a) {
		var b = parseFloat(String(a).replace(/,/g, ""));
		if (isNaN(b)) {
			b = 0
		}
		return b
	},
	asInt : function(a) {
		var b = parseInt(String(a).replace(/,/g, ""));
		if (isNaN(b)) {
			b = 0
		}
		return b
	}
};