Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">加载�...</div>';
if (Ext.View) {
	Ext.View.prototype.emptyText = ""
}
if (Ext.grid.GridPanel) {
	Ext.grid.GridPanel.prototype.ddText = "{0} 选择行"
}
if (Ext.TabPanelItem) {
	Ext.TabPanelItem.prototype.closeText = "关�"
}
if (Ext.form.Field) {
	Ext.form.Field.prototype.invalidText = "输入值�?�法"
}
Date.monthNames = ["一月", "二月", "三月", "四月", "五月", "�月", "七月", "八月", "�?月",
		"�??月", "�??一月", "�??二月"];
Date.dayNames = ["日", "一", "二", "三", "四", "五", "�"];
if (Ext.MessageBox) {
	Ext.MessageBox.buttonText = {
		ok : "确定",
		cancel : "�?�消",
		yes : "是",
		no : "�?�"
	}
}
if (Ext.util.Format) {
	Ext.util.Format.date = function(a, b) {
		if (!a) {
			return ""
		}
		if (!(a instanceof Date)) {
			a = new Date(Date.parse(a))
		}
		return a.dateFormat(b || "y年m月d日")
	}
}
if (Ext.DatePicker) {
	Ext.apply(Ext.DatePicker.prototype, {
				todayText : "今天",
				minText : "日期在最�?日期之�?",
				maxText : "日期在最大日期之�?�",
				disabledDaysText : "",
				disabledDatesText : "",
				monthNames : Date.monthNames,
				dayNames : Date.dayNames,
				nextText : "下月 (Control+Right)",
				prevText : "上月 (Control+Left)",
				monthYearText : "选择一个月 (Control+Up/Down �?�改�?�年)",
				todayTip : "{0} (空格键选择)",
				format : "y年m月d日",
				okText : "确定",
				cancelText : "�?�消"
			})
}
if (Ext.PagingToolbar) {
	Ext.apply(Ext.PagingToolbar.prototype, {
				beforePageText : "页",
				afterPageText : "页共 {0} 页",
				firstText : "第一页",
				prevText : "�?一页",
				nextText : "下一页",
				lastText : "最�?�页",
				refreshText : "刷新",
				displayMsg : "显示 {0} - {1}，共 {2} �?�",
				emptyMsg : "没有数�?�需�?显示"
			})
}
if (Ext.form.TextField) {
	Ext.apply(Ext.form.TextField.prototype, {
				minLengthText : "该输入项的最�?长度是 {0}",
				maxLengthText : "该输入项的最大长度是 {0}",
				blankText : "该输入项为必输项",
				regexText : "",
				emptyText : null
			})
}
if (Ext.form.NumberField) {
	Ext.apply(Ext.form.NumberField.prototype, {
				minText : "该输入项的最�?值是 {0}",
				maxText : "该输入项的最大值是 {0}",
				nanText : "{0} �?是有效数值"
			})
}
if (Ext.form.DateField) {
	Ext.apply(Ext.form.DateField.prototype, {
				disabledDaysText : "�?用",
				disabledDatesText : "�?用",
				minText : "该输入项的日期必须在 {0} 之�?�",
				maxText : "该输入项的日期必须在 {0} 之�?",
				invalidText : "{0} 是无效的日期 - 必须符�?�格�?： {1}",
				format : "y年m月d日"
			})
}
if (Ext.form.ComboBox) {
	Ext.apply(Ext.form.ComboBox.prototype, {
				loadingText : "加载...",
				valueNotFoundText : undefined
			})
}
if (Ext.form.VTypes) {
	Ext.apply(Ext.form.VTypes, {
				emailText : '该输入项必须是电�?邮件地�?�，格�?如： "user@domain.com"',
				urlText : '该输入项必须是URL地�?�，格�?如： "http://www.domain.com"',
				alphaText : "该输入项�?�能包�?��符和_",
				alphanumText : "该输入项�?�能包�?��符,数�和_"
			})
}
if (Ext.grid.GridView) {
	Ext.apply(Ext.grid.GridView.prototype, {
				sortAscText : "��?",
				sortDescText : "逆�?",
				lockText : "�?列",
				unlockText : "解�?列",
				columnsText : "列"
			})
}
if (Ext.grid.PropertyColumnModel) {
	Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
				nameText : "�??称",
				valueText : "值",
				dateFormat : "y年m月d日"
			})
}
if (Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion) {
	Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
				splitTip : "拖动�?�改�?�尺寸.",
				collapsibleSplitTip : "拖动�?�改�?�尺寸. �?�击�?�?."
			})
};