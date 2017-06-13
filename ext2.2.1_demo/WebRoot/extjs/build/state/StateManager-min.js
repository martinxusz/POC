Ext.state.Manager = function() {
	var a = new Ext.state.Provider();
	return {
		setProvider : function(b) {
			a = b
		},
		get : function(c, b) {
			return a.get(c, b)
		},
		set : function(b, c) {
			a.set(b, c)
		},
		clear : function(b) {
			a.clear(b)
		},
		getProvider : function() {
			return a
		}
	}
}();