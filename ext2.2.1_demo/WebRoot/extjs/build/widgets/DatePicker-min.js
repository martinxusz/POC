Ext.DatePicker = Ext.extend(Ext.Component, {
	todayText : "Today",
	okText : "&#160;OK&#160;",
	cancelText : "Cancel",
	todayTip : "{0} (Spacebar)",
	minText : "This date is before the minimum date",
	maxText : "This date is after the maximum date",
	format : "m/d/y",
	disabledDaysText : "Disabled",
	disabledDatesText : "Disabled",
	constrainToViewport : true,
	monthNames : Date.monthNames,
	dayNames : Date.dayNames,
	nextText : "Next Month (Control+Right)",
	prevText : "Previous Month (Control+Left)",
	monthYearText : "Choose a month (Control+Up/Down to move years)",
	startDay : 0,
	showToday : true,
	initComponent : function() {
		Ext.DatePicker.superclass.initComponent.call(this);
		this.value = this.value ? this.value.clearTime() : new Date()
				.clearTime();
		this.addEvents("select");
		if (this.handler) {
			this.on("select", this.handler, this.scope || this)
		}
		this.initDisabledDays()
	},
	initDisabledDays : function() {
		if (!this.disabledDatesRE && this.disabledDates) {
			var a = this.disabledDates;
			var c = "(?:";
			for (var b = 0; b < a.length; b++) {
				c += a[b];
				if (b != a.length - 1) {
					c += "|"
				}
			}
			this.disabledDatesRE = new RegExp(c + ")")
		}
	},
	setDisabledDates : function(a) {
		if (Ext.isArray(a)) {
			this.disabledDates = a;
			this.disabledDatesRE = null
		} else {
			this.disabledDatesRE = a
		}
		this.initDisabledDays();
		this.update(this.value, true)
	},
	setDisabledDays : function(a) {
		this.disabledDays = a;
		this.update(this.value, true)
	},
	setMinDate : function(a) {
		this.minDate = a;
		this.update(this.value, true)
	},
	setMaxDate : function(a) {
		this.maxDate = a;
		this.update(this.value, true)
	},
	setValue : function(b) {
		var a = this.value;
		this.value = b.clearTime(true);
		if (this.el) {
			this.update(this.value)
		}
	},
	getValue : function() {
		return this.value
	},
	focus : function() {
		if (this.el) {
			this.update(this.activeDate)
		}
	},
	onRender : function(a, g) {
		var c = [
				'<table cellspacing="0">',
				'<tr><td class="x-date-left"><a href="#" title="',
				this.prevText,
				'">&#160;</a></td><td class="x-date-middle" align="center"></td><td class="x-date-right"><a href="#" title="',
				this.nextText, '">&#160;</a></td></tr>',
				'<tr><td colspan="3"><table class="x-date-inner" cellspacing="0"><thead><tr>'];
		var f = this.dayNames;
		for (var e = 0; e < 7; e++) {
			var h = this.startDay + e;
			if (h > 6) {
				h = h - 7
			}
			c.push("<th><span>", f[h].substr(0, 1), "</span></th>")
		}
		c[c.length] = "</tr></thead><tbody><tr>";
		for (var e = 0; e < 42; e++) {
			if (e % 7 == 0 && e != 0) {
				c[c.length] = "</tr><tr>"
			}
			c[c.length] = '<td><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span></span></em></a></td>'
		}
		c
				.push(
						"</tr></tbody></table></td></tr>",
						this.showToday
								? '<tr><td colspan="3" class="x-date-bottom" align="center"></td></tr>'
								: "", '</table><div class="x-date-mp"></div>');
		var b = document.createElement("div");
		b.className = "x-date-picker";
		b.innerHTML = c.join("");
		a.dom.insertBefore(b, g);
		this.el = Ext.get(b);
		this.eventEl = Ext.get(b.firstChild);
		this.leftClickRpt = new Ext.util.ClickRepeater(this.el
						.child("td.x-date-left a"), {
					handler : this.showPrevMonth,
					scope : this,
					preventDefault : true,
					stopDefault : true
				});
		this.rightClickRpt = new Ext.util.ClickRepeater(this.el
						.child("td.x-date-right a"), {
					handler : this.showNextMonth,
					scope : this,
					preventDefault : true,
					stopDefault : true
				});
		this.eventEl.on("mousewheel", this.handleMouseWheel, this);
		this.monthPicker = this.el.down("div.x-date-mp");
		this.monthPicker.enableDisplayMode("block");
		var k = new Ext.KeyNav(this.eventEl, {
					left : function(d) {
						d.ctrlKey ? this.showPrevMonth() : this
								.update(this.activeDate.add("d", -1))
					},
					right : function(d) {
						d.ctrlKey ? this.showNextMonth() : this
								.update(this.activeDate.add("d", 1))
					},
					up : function(d) {
						d.ctrlKey ? this.showNextYear() : this
								.update(this.activeDate.add("d", -7))
					},
					down : function(d) {
						d.ctrlKey ? this.showPrevYear() : this
								.update(this.activeDate.add("d", 7))
					},
					pageUp : function(d) {
						this.showNextMonth()
					},
					pageDown : function(d) {
						this.showPrevMonth()
					},
					enter : function(d) {
						d.stopPropagation();
						return true
					},
					scope : this
				});
		this.eventEl.on("click", this.handleDateClick, this, {
					delegate : "a.x-date-date"
				});
		this.el.unselectable();
		this.cells = this.el.select("table.x-date-inner tbody td");
		this.textNodes = this.el.query("table.x-date-inner tbody span");
		this.mbtn = new Ext.Button({
					text : "&#160;",
					tooltip : this.monthYearText,
					renderTo : this.el.child("td.x-date-middle", true)
				});
		this.mbtn.on("click", this.showMonthPicker, this);
		this.mbtn.el.child(this.mbtn.menuClassTarget)
				.addClass("x-btn-with-menu");
		if (this.showToday) {
			this.todayKeyListener = this.eventEl.addKeyListener(
					Ext.EventObject.SPACE, this.selectToday, this);
			var j = (new Date()).dateFormat(this.format);
			this.todayBtn = new Ext.Button({
						renderTo : this.el.child("td.x-date-bottom", true),
						text : String.format(this.todayText, j),
						tooltip : String.format(this.todayTip, j),
						handler : this.selectToday,
						scope : this
					})
		}
		if (Ext.isIE) {
			this.el.repaint()
		}
		this.update(this.value)
	},
	createMonthPicker : function() {
		if (!this.monthPicker.dom.firstChild) {
			var a = ['<table border="0" cellspacing="0">'];
			for (var b = 0; b < 6; b++) {
				a
						.push(
								'<tr><td class="x-date-mp-month"><a href="#">',
								this.monthNames[b].substr(0, 3),
								"</a></td>",
								'<td class="x-date-mp-month x-date-mp-sep"><a href="#">',
								this.monthNames[b + 6].substr(0, 3),
								"</a></td>",
								b == 0
										? '<td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-prev"></a></td><td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-next"></a></td></tr>'
										: '<td class="x-date-mp-year"><a href="#"></a></td><td class="x-date-mp-year"><a href="#"></a></td></tr>')
			}
			a
					.push(
							'<tr class="x-date-mp-btns"><td colspan="4"><button type="button" class="x-date-mp-ok">',
							this.okText,
							'</button><button type="button" class="x-date-mp-cancel">',
							this.cancelText, "</button></td></tr>", "</table>");
			this.monthPicker.update(a.join(""));
			this.monthPicker.on("click", this.onMonthClick, this);
			this.monthPicker.on("dblclick", this.onMonthDblClick, this);
			this.mpMonths = this.monthPicker.select("td.x-date-mp-month");
			this.mpYears = this.monthPicker.select("td.x-date-mp-year");
			this.mpMonths.each(function(c, d, e) {
						e += 1;
						if ((e % 2) == 0) {
							c.dom.xmonth = 5 + Math.round(e * 0.5)
						} else {
							c.dom.xmonth = Math.round((e - 1) * 0.5)
						}
					})
		}
	},
	showMonthPicker : function() {
		this.createMonthPicker();
		var a = this.el.getSize();
		this.monthPicker.setSize(a);
		this.monthPicker.child("table").setSize(a);
		this.mpSelMonth = (this.activeDate || this.value).getMonth();
		this.updateMPMonth(this.mpSelMonth);
		this.mpSelYear = (this.activeDate || this.value).getFullYear();
		this.updateMPYear(this.mpSelYear);
		this.monthPicker.slideIn("t", {
					duration : 0.2
				})
	},
	updateMPYear : function(e) {
		this.mpyear = e;
		var c = this.mpYears.elements;
		for (var b = 1; b <= 10; b++) {
			var d = c[b - 1], a;
			if ((b % 2) == 0) {
				a = e + Math.round(b * 0.5);
				d.firstChild.innerHTML = a;
				d.xyear = a
			} else {
				a = e - (5 - Math.round(b * 0.5));
				d.firstChild.innerHTML = a;
				d.xyear = a
			}
			this.mpYears.item(b - 1)[a == this.mpSelYear
					? "addClass"
					: "removeClass"]("x-date-mp-sel")
		}
	},
	updateMPMonth : function(a) {
		this.mpMonths.each(function(b, c, d) {
					b[b.dom.xmonth == a ? "addClass" : "removeClass"]("x-date-mp-sel")
				})
	},
	selectMPMonth : function(a) {
	},
	onMonthClick : function(f, b) {
		f.stopEvent();
		var c = new Ext.Element(b), a;
		if (c.is("button.x-date-mp-cancel")) {
			this.hideMonthPicker()
		} else {
			if (c.is("button.x-date-mp-ok")) {
				var g = new Date(this.mpSelYear, this.mpSelMonth,
						(this.activeDate || this.value).getDate());
				if (g.getMonth() != this.mpSelMonth) {
					g = new Date(this.mpSelYear, this.mpSelMonth, 1)
							.getLastDateOfMonth()
				}
				this.update(g);
				this.hideMonthPicker()
			} else {
				if (a = c.up("td.x-date-mp-month", 2)) {
					this.mpMonths.removeClass("x-date-mp-sel");
					a.addClass("x-date-mp-sel");
					this.mpSelMonth = a.dom.xmonth
				} else {
					if (a = c.up("td.x-date-mp-year", 2)) {
						this.mpYears.removeClass("x-date-mp-sel");
						a.addClass("x-date-mp-sel");
						this.mpSelYear = a.dom.xyear
					} else {
						if (c.is("a.x-date-mp-prev")) {
							this.updateMPYear(this.mpyear - 10)
						} else {
							if (c.is("a.x-date-mp-next")) {
								this.updateMPYear(this.mpyear + 10)
							}
						}
					}
				}
			}
		}
	},
	onMonthDblClick : function(d, b) {
		d.stopEvent();
		var c = new Ext.Element(b), a;
		if (a = c.up("td.x-date-mp-month", 2)) {
			this.update(new Date(this.mpSelYear, a.dom.xmonth,
					(this.activeDate || this.value).getDate()));
			this.hideMonthPicker()
		} else {
			if (a = c.up("td.x-date-mp-year", 2)) {
				this.update(new Date(a.dom.xyear, this.mpSelMonth,
						(this.activeDate || this.value).getDate()));
				this.hideMonthPicker()
			}
		}
	},
	hideMonthPicker : function(a) {
		if (this.monthPicker) {
			if (a === true) {
				this.monthPicker.hide()
			} else {
				this.monthPicker.slideOut("t", {
							duration : 0.2
						})
			}
		}
	},
	showPrevMonth : function(a) {
		this.update(this.activeDate.add("mo", -1))
	},
	showNextMonth : function(a) {
		this.update(this.activeDate.add("mo", 1))
	},
	showPrevYear : function() {
		this.update(this.activeDate.add("y", -1))
	},
	showNextYear : function() {
		this.update(this.activeDate.add("y", 1))
	},
	handleMouseWheel : function(a) {
		var b = a.getWheelDelta();
		if (b > 0) {
			this.showPrevMonth();
			a.stopEvent()
		} else {
			if (b < 0) {
				this.showNextMonth();
				a.stopEvent()
			}
		}
	},
	handleDateClick : function(b, a) {
		b.stopEvent();
		if (a.dateValue && !Ext.fly(a.parentNode).hasClass("x-date-disabled")) {
			this.setValue(new Date(a.dateValue));
			this.fireEvent("select", this, this.value)
		}
	},
	selectToday : function() {
		if (this.todayBtn && !this.todayBtn.disabled) {
			this.setValue(new Date().clearTime());
			this.fireEvent("select", this, this.value)
		}
	},
	update : function(F, z) {
		var a = this.activeDate;
		this.activeDate = F;
		if (!z && a && this.el) {
			var n = F.getTime();
			if (a.getMonth() == F.getMonth()
					&& a.getFullYear() == F.getFullYear()) {
				this.cells.removeClass("x-date-selected");
				this.cells.each(function(d) {
							if (d.dom.firstChild.dateValue == n) {
								d.addClass("x-date-selected");
								setTimeout(function() {
											try {
												d.dom.firstChild.focus()
											} catch (i) {
											}
										}, 50);
								return false
							}
						});
				return
			}
		}
		var j = F.getDaysInMonth();
		var o = F.getFirstDateOfMonth();
		var f = o.getDay() - this.startDay;
		if (f <= this.startDay) {
			f += 7
		}
		var A = F.add("mo", -1);
		var g = A.getDaysInMonth() - f;
		var e = this.cells.elements;
		var p = this.textNodes;
		j += f;
		var v = 86400000;
		var C = (new Date(A.getFullYear(), A.getMonth(), g)).clearTime();
		var B = new Date().clearTime().getTime();
		var s = F.clearTime().getTime();
		var r = this.minDate
				? this.minDate.clearTime()
				: Number.NEGATIVE_INFINITY;
		var x = this.maxDate
				? this.maxDate.clearTime()
				: Number.POSITIVE_INFINITY;
		var E = this.disabledDatesRE;
		var q = this.disabledDatesText;
		var H = this.disabledDays ? this.disabledDays.join("") : false;
		var D = this.disabledDaysText;
		var y = this.format;
		if (this.showToday) {
			var l = new Date().clearTime();
			var c = (l < r || l > x || (E && y && E.test(l.dateFormat(y))) || (H && H
					.indexOf(l.getDay()) != -1));
			this.todayBtn.setDisabled(c);
			this.todayKeyListener[c ? "disable" : "enable"]()
		}
		var k = function(I, d) {
			d.title = "";
			var i = C.getTime();
			d.firstChild.dateValue = i;
			if (i == B) {
				d.className += " x-date-today";
				d.title = I.todayText
			}
			if (i == s) {
				d.className += " x-date-selected";
				setTimeout(function() {
							try {
								d.firstChild.focus()
							} catch (t) {
							}
						}, 50)
			}
			if (i < r) {
				d.className = " x-date-disabled";
				d.title = I.minText;
				return
			}
			if (i > x) {
				d.className = " x-date-disabled";
				d.title = I.maxText;
				return
			}
			if (H) {
				if (H.indexOf(C.getDay()) != -1) {
					d.title = D;
					d.className = " x-date-disabled"
				}
			}
			if (E && y) {
				var w = C.dateFormat(y);
				if (E.test(w)) {
					d.title = q.replace("%0", w);
					d.className = " x-date-disabled"
				}
			}
		};
		var u = 0;
		for (; u < f; u++) {
			p[u].innerHTML = (++g);
			C.setDate(C.getDate() + 1);
			e[u].className = "x-date-prevday";
			k(this, e[u])
		}
		for (; u < j; u++) {
			var b = u - f + 1;
			p[u].innerHTML = (b);
			C.setDate(C.getDate() + 1);
			e[u].className = "x-date-active";
			k(this, e[u])
		}
		var G = 0;
		for (; u < 42; u++) {
			p[u].innerHTML = (++G);
			C.setDate(C.getDate() + 1);
			e[u].className = "x-date-nextday";
			k(this, e[u])
		}
		this.mbtn
				.setText(this.monthNames[F.getMonth()] + " " + F.getFullYear());
		if (!this.internalRender) {
			var h = this.el.dom.firstChild;
			var m = h.offsetWidth;
			this.el.setWidth(m + this.el.getBorderWidth("lr"));
			Ext.fly(h).setWidth(m);
			this.internalRender = true;
			if (Ext.isOpera && !this.secondPass) {
				h.rows[0].cells[1].style.width = (m - (h.rows[0].cells[0].offsetWidth + h.rows[0].cells[2].offsetWidth))
						+ "px";
				this.secondPass = true;
				this.update.defer(10, this, [F])
			}
		}
	},
	beforeDestroy : function() {
		if (this.rendered) {
			Ext.destroy(this.leftClickRpt, this.rightClickRpt,
					this.monthPicker, this.eventEl, this.mbtn, this.todayBtn)
		}
	}
});
Ext.reg("datepicker", Ext.DatePicker);