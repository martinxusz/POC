Ext.QuickTips = function() {
	var b, a = [];
	return {
		init : function(c) {
			if (!b) {
				if (!Ext.isReady) {
					Ext.onReady(function() {
								Ext.QuickTips.init(c)
							});
					return
				}
				b = new Ext.QuickTip({
							elements : "header,body"
						});
				if (c !== false) {
					b.render(Ext.getBody())
				}
			}
		},
		enable : function() {
			if (b) {
				a.pop();
				if (a.length < 1) {
					b.enable()
				}
			}
		},
		disable : function() {
			if (b) {
				b.disable()
			}
			a.push(1)
		},
		isEnabled : function() {
			return b !== undefined && !b.disabled
		},
		getQuickTip : function() {
			return b
		},
		register : function() {
			b.register.apply(b, arguments)
		},
		unregister : function() {
			b.unregister.apply(b, arguments)
		},
		tips : function() {
			b.register.apply(b, arguments)
		}
	}
}();