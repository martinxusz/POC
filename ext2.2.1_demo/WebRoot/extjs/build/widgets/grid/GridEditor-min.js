Ext.grid.GridEditor = function(b, a) {
	Ext.grid.GridEditor.superclass.constructor.call(this, b, a);
	b.monitorTab = false
};
Ext.extend(Ext.grid.GridEditor, Ext.Editor, {
			alignment : "tl-tl",
			autoSize : "width",
			hideEl : false,
			cls : "x-small-editor x-grid-editor",
			shim : false,
			shadow : false
		});