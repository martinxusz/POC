Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">در �ال بارگذاری ...</div>';
if (Ext.View) {
	Ext.View.prototype.emptyText = ""
}
if (Ext.grid.GridPanel) {
	Ext.grid.GridPanel.prototype.ddText = "{0} رکورد انتخاب شده"
}
if (Ext.TabPanelItem) {
	Ext.TabPanelItem.prototype.closeText = "بستن"
}
if (Ext.form.Field) {
	Ext.form.Field.prototype.invalidText = "مقدار �?یلد ص�ی� نیست"
}
if (Ext.LoadMask) {
	Ext.LoadMask.prototype.msg = "در �ال بارگذاری ..."
}
Date.monthNames = ["ژانویه", "�?وریه", "مارس", "آپریل", "می", "ژوئن", "جولای",
		"آگوست", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"];
Date.monthNumbers = {
	Jan : 0,
	Feb : 1,
	Mar : 2,
	Apr : 3,
	May : 4,
	Jun : 5,
	Jul : 6,
	Aug : 7,
	Sep : 8,
	Oct : 9,
	Nov : 10,
	Dec : 11
};
Date.dayNames = ["یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه",
		"شنبه"];
if (Ext.MessageBox) {
	Ext.MessageBox.buttonText = {
		ok : "تایید",
		cancel : "بازگشت",
		yes : "بله",
		no : "خیر"
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
		return a.dateFormat(b || "Y/m/d")
	}
}
if (Ext.DatePicker) {
	Ext.apply(Ext.DatePicker.prototype, {
		todayText : "امروز",
		minText : "این تاریخ قبل از م�دوده مجاز است",
		maxText : "این تاریخ پس از م�دوده مجاز است",
		disabledDaysText : "",
		disabledDatesText : "",
		monthNames : Date.monthNames,
		dayNames : Date.dayNames,
		nextText : "ماه بعد (Control + Right)",
		prevText : "ماه قبل (Control+Left)",
		monthYearText : "یک ماه را انتخاب کنید (Control+Up/Down برای انتقال در سال)",
		todayTip : "{0} (Spacebar)",
		format : "y/m/d",
		okText : "&#160;OK&#160;",
		cancelText : "Cancel",
		startDay : 0
	})
}
if (Ext.PagingToolbar) {
	Ext.apply(Ext.PagingToolbar.prototype, {
				beforePageText : "ص�?�ه",
				afterPageText : "از {0}",
				firstText : "ص�?�ه اول",
				prevText : "ص�?�ه قبل",
				nextText : "ص�?�ه بعد",
				lastText : "ص�?�ه آخر",
				refreshText : "بازخوانی",
				displayMsg : "نمایش {0} - {1} of {2}",
				emptyMsg : "داده ای برای نمایش وجود ندارد"
			})
}
if (Ext.form.TextField) {
	Ext.apply(Ext.form.TextField.prototype, {
				minLengthText : "�داقل طول این �?یلد برابر است با {0}",
				maxLengthText : "�داکثر طول این �?یلد برابر است با {0}",
				blankText : "این �?یلد باید مقداری داشته باشد",
				regexText : "",
				emptyText : null
			})
}
if (Ext.form.NumberField) {
	Ext.apply(Ext.form.NumberField.prototype, {
				minText : "�داقل مقدار این �?یلد برابر است با {0}",
				maxText : "�داکثر مقدار این �?یلد برابر است با {0}",
				nanText : "{0} یک عدد نیست"
			})
}
if (Ext.form.DateField) {
	Ext.apply(Ext.form.DateField.prototype, {
				disabledDaysText : "غیر�?عال",
				disabledDatesText : "غیر�?عال",
				minText : "تاریخ باید پس از {0} باشد",
				maxText : "تاریخ باید پس از {0} باشد",
				invalidText : "{0} تاریخ ص�ی�ی نیست - �?رمت ص�ی� {1}",
				format : "y/m/d"
			})
}
if (Ext.form.ComboBox) {
	Ext.apply(Ext.form.ComboBox.prototype, {
				loadingText : "در �ال بارگذاری ...",
				valueNotFoundText : undefined
			})
}
if (Ext.form.VTypes) {
	Ext.apply(Ext.form.VTypes, {
		emailText : 'مقدار این �?یلد باید یک ایمیل با این �?رمت باشد "user@domain.com"',
		urlText : 'مقدار این آدرس باید یک آدرس سایت با این �?رمت باشد "http://www.domain.com"',
		alphaText : "مقدار این �?یلد باید �?قط از �رو�? ال�?با و _ تشکیل شده باشد ",
		alphanumText : "مقدار این �?یلد باید �?قط از �رو�? ال�?با، اعداد و _ تشکیل شده باشد"
	})
}
if (Ext.form.HtmlEditor) {
	Ext.apply(Ext.form.HtmlEditor.prototype, {
				createLinkText : "لط�?ا آدرس لینک را وارد کنید:",
				buttonTips : {
					bold : {
						title : "تیره (Ctrl+B)",
						text : "متن انتخاب شده را تیره می کند.",
						cls : "x-html-editor-tip"
					},
					italic : {
						title : "ایتالیک (Ctrl+I)",
						text : "متن انتخاب شده را ایتالیک می کند.",
						cls : "x-html-editor-tip"
					},
					underline : {
						title : "زیرخط (Ctrl+U)",
						text : "زیر هر نوشته یک خط نمایش می دهد.",
						cls : "x-html-editor-tip"
					},
					increasefontsize : {
						title : "ا�?زایش اندازه",
						text : "اندازه �?ونت را ا�?زایش می دهد.",
						cls : "x-html-editor-tip"
					},
					decreasefontsize : {
						title : "کاهش اندازه",
						text : "اندازه متن را کاهش می دهد.",
						cls : "x-html-editor-tip"
					},
					backcolor : {
						title : "رنگ زمینه متن",
						text : "برای تغییر رنگ زمینه متن است�?اده می شود.",
						cls : "x-html-editor-tip"
					},
					forecolor : {
						title : "رنگ قلم",
						text : "رنگ  قلم متن را تغییر می دهد.",
						cls : "x-html-editor-tip"
					},
					justifyleft : {
						title : "چیدن متن از سمت چپ",
						text : "متن از سمت چپ چیده شده می شود.",
						cls : "x-html-editor-tip"
					},
					justifycenter : {
						title : "متن در وسط ",
						text : "نمایش متن در قسمت وسط ص�?�ه و رعابت سمت چپ و راست.",
						cls : "x-html-editor-tip"
					},
					justifyright : {
						title : "چیدن متن از سمت راست",
						text : "متن از سمت راست پیده خواهد شد.",
						cls : "x-html-editor-tip"
					},
					insertunorderedlist : {
						title : "لیست همراه با علامت",
						text : "یک لیست جدید ایجاد می کند.",
						cls : "x-html-editor-tip"
					},
					insertorderedlist : {
						title : "لیست عددی",
						text : "یک لیست عددی ایجاد می کند. ",
						cls : "x-html-editor-tip"
					},
					createlink : {
						title : "لینک",
						text : "متن انتخاب شده را به لینک تبدیل کنید.",
						cls : "x-html-editor-tip"
					},
					sourceedit : {
						title : "ویرایش سورس",
						text : "ر�?تن به �الت ویرایش سورس.",
						cls : "x-html-editor-tip"
					}
				}
			})
}
if (Ext.grid.GridView) {
	Ext.apply(Ext.grid.GridView.prototype, {
				sortAscText : "مرتب سازی ا�?زایشی",
				sortDescText : "مرتب سازی کاهشی",
				lockText : "ق�?ل ستون ها",
				unlockText : "بازکردن ستون ها",
				columnsText : "ستون ها"
			})
}
if (Ext.grid.PropertyColumnModel) {
	Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
				nameText : "نام",
				valueText : "مقدار",
				dateFormat : "Y/m/d"
			})
}
if (Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion) {
	Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
				splitTip : "درگ برای تغییر اندازه.",
				collapsibleSplitTip : "برای تغییر اندازه درگ کنید."
			})
};