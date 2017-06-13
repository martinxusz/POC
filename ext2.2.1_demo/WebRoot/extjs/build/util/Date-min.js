(function() {
	function xf(format) {
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/\{(\d+)\}/g, function(m, i) {
					return args[i]
				})
	}
	Date.formatCodeToRegex = function(character, currentGroup) {
		var p = Date.parseCodes[character];
		if (p) {
			p = Ext.type(p) == "function" ? p() : p;
			Date.parseCodes[character] = p
		}
		return p ? Ext.applyIf({
					c : p.c ? xf(p.c, currentGroup || "{0}") : p.c
				}, p) : {
			g : 0,
			c : null,
			s : Ext.escapeRe(character)
		}
	};
	var $f = Date.formatCodeToRegex;
	Ext.apply(Date, {
		parseFunctions : {
			count : 0
		},
		parseRegexes : [],
		formatFunctions : {
			count : 0
		},
		daysInMonth : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		y2kYear : 50,
		MILLI : "ms",
		SECOND : "s",
		MINUTE : "mi",
		HOUR : "h",
		DAY : "d",
		MONTH : "mo",
		YEAR : "y",
		dayNames : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
				"Friday", "Saturday"],
		monthNames : ["January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November",
				"December"],
		monthNumbers : {
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
		},
		getShortMonthName : function(month) {
			return Date.monthNames[month].substring(0, 3)
		},
		getShortDayName : function(day) {
			return Date.dayNames[day].substring(0, 3)
		},
		getMonthNumber : function(name) {
			return Date.monthNumbers[name.substring(0, 1).toUpperCase()
					+ name.substring(1, 3).toLowerCase()]
		},
		formatCodes : {
			d : "String.leftPad(this.getDate(), 2, '0')",
			D : "Date.getShortDayName(this.getDay())",
			j : "this.getDate()",
			l : "Date.dayNames[this.getDay()]",
			N : "(this.getDay() ? this.getDay() : 7)",
			S : "this.getSuffix()",
			w : "this.getDay()",
			z : "this.getDayOfYear()",
			W : "String.leftPad(this.getWeekOfYear(), 2, '0')",
			F : "Date.monthNames[this.getMonth()]",
			m : "String.leftPad(this.getMonth() + 1, 2, '0')",
			M : "Date.getShortMonthName(this.getMonth())",
			n : "(this.getMonth() + 1)",
			t : "this.getDaysInMonth()",
			L : "(this.isLeapYear() ? 1 : 0)",
			o : "(this.getFullYear() + (this.getWeekOfYear() == 1 && this.getMonth() > 0 ? +1 : (this.getWeekOfYear() >= 52 && this.getMonth() < 11 ? -1 : 0)))",
			Y : "this.getFullYear()",
			y : "('' + this.getFullYear()).substring(2, 4)",
			a : "(this.getHours() < 12 ? 'am' : 'pm')",
			A : "(this.getHours() < 12 ? 'AM' : 'PM')",
			g : "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
			G : "this.getHours()",
			h : "String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
			H : "String.leftPad(this.getHours(), 2, '0')",
			i : "String.leftPad(this.getMinutes(), 2, '0')",
			s : "String.leftPad(this.getSeconds(), 2, '0')",
			u : "String.leftPad(this.getMilliseconds(), 3, '0')",
			O : "this.getGMTOffset()",
			P : "this.getGMTOffset(true)",
			T : "this.getTimezone()",
			Z : "(this.getTimezoneOffset() * -60)",
			c : function() {
				for (var c = "Y-m-dTH:i:sP", code = [], i = 0, l = c.length; i < l; ++i) {
					var e = c.charAt(i);
					code.push(e == "T" ? "'T'" : Date.getFormatCode(e))
				}
				return code.join(" + ")
			},
			U : "Math.round(this.getTime() / 1000)"
		},
		parseDate : function(input, format) {
			var p = Date.parseFunctions;
			if (p[format] == null) {
				Date.createParser(format)
			}
			var func = p[format];
			return Date[func](input)
		},
		getFormatCode : function(character) {
			var f = Date.formatCodes[character];
			if (f) {
				f = Ext.type(f) == "function" ? f() : f;
				Date.formatCodes[character] = f
			}
			return f || ("'" + String.escape(character) + "'")
		},
		createNewFormat : function(format) {
			var funcName = "format" + Date.formatFunctions.count++, code = "Date.prototype."
					+ funcName + " = function(){return ", special = false, ch = "";
			Date.formatFunctions[format] = funcName;
			for (var i = 0; i < format.length; ++i) {
				ch = format.charAt(i);
				if (!special && ch == "\\") {
					special = true
				} else {
					if (special) {
						special = false;
						code += "'" + String.escape(ch) + "' + "
					} else {
						code += Date.getFormatCode(ch) + " + "
					}
				}
			}
			eval(code.substring(0, code.length - 3) + ";}")
		},
		createParser : function() {
			var code = [
					"Date.{0} = function(input){",
					"var y, m, d, h = 0, i = 0, s = 0, ms = 0, o, z, u, v;",
					"input = String(input);",
					"d = new Date();",
					"y = d.getFullYear();",
					"m = d.getMonth();",
					"d = d.getDate();",
					"var results = input.match(Date.parseRegexes[{1}]);",
					"if(results && results.length > 0){",
					"{2}",
					"if(u){",
					"v = new Date(u * 1000);",
					"}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0 && ms >= 0){",
					"v = new Date(y, m, d, h, i, s, ms);",
					"}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0){",
					"v = new Date(y, m, d, h, i, s);",
					"}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0){",
					"v = new Date(y, m, d, h, i);",
					"}else if (y >= 0 && m >= 0 && d > 0 && h >= 0){",
					"v = new Date(y, m, d, h);",
					"}else if (y >= 0 && m >= 0 && d > 0){",
					"v = new Date(y, m, d);",
					"}else if (y >= 0 && m >= 0){",
					"v = new Date(y, m);",
					"}else if (y >= 0){",
					"v = new Date(y);",
					"}",
					"}",
					"return (v && (z != null || o != null))? (Ext.type(z) == 'number' ? v.add(Date.SECOND, -v.getTimezoneOffset() * 60 - z) : v.add(Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn))) : v;",
					"}"].join("\n");
			return function(format) {
				var funcName = "parse" + Date.parseFunctions.count++, regexNum = Date.parseRegexes.length, currentGroup = 1, calc = "", regex = "", special = false, ch = "";
				Date.parseFunctions[format] = funcName;
				for (var i = 0; i < format.length; ++i) {
					ch = format.charAt(i);
					if (!special && ch == "\\") {
						special = true
					} else {
						if (special) {
							special = false;
							regex += String.escape(ch)
						} else {
							var obj = $f(ch, currentGroup);
							currentGroup += obj.g;
							regex += obj.s;
							if (obj.g && obj.c) {
								calc += obj.c
							}
						}
					}
				}
				Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$", "i");
				eval(xf(code, funcName, regexNum, calc))
			}
		}(),
		parseCodes : {
			d : {
				g : 1,
				c : "d = parseInt(results[{0}], 10);\n",
				s : "(\\d{2})"
			},
			j : {
				g : 1,
				c : "d = parseInt(results[{0}], 10);\n",
				s : "(\\d{1,2})"
			},
			D : function() {
				for (var a = [], i = 0; i < 7; a.push(Date.getShortDayName(i)), ++i) {
				}
				return {
					g : 0,
					c : null,
					s : "(?:" + a.join("|") + ")"
				}
			},
			l : function() {
				return {
					g : 0,
					c : null,
					s : "(?:" + Date.dayNames.join("|") + ")"
				}
			},
			N : {
				g : 0,
				c : null,
				s : "[1-7]"
			},
			S : {
				g : 0,
				c : null,
				s : "(?:st|nd|rd|th)"
			},
			w : {
				g : 0,
				c : null,
				s : "[0-6]"
			},
			z : {
				g : 0,
				c : null,
				s : "(?:\\d{1,3})"
			},
			W : {
				g : 0,
				c : null,
				s : "(?:\\d{2})"
			},
			F : function() {
				return {
					g : 1,
					c : "m = parseInt(Date.getMonthNumber(results[{0}]), 10);\n",
					s : "(" + Date.monthNames.join("|") + ")"
				}
			},
			M : function() {
				for (var a = [], i = 0; i < 12; a.push(Date
						.getShortMonthName(i)), ++i) {
				}
				return Ext.applyIf({
							s : "(" + a.join("|") + ")"
						}, $f("F"))
			},
			m : {
				g : 1,
				c : "m = parseInt(results[{0}], 10) - 1;\n",
				s : "(\\d{2})"
			},
			n : {
				g : 1,
				c : "m = parseInt(results[{0}], 10) - 1;\n",
				s : "(\\d{1,2})"
			},
			t : {
				g : 0,
				c : null,
				s : "(?:\\d{2})"
			},
			L : {
				g : 0,
				c : null,
				s : "(?:1|0)"
			},
			o : function() {
				return $f("Y")
			},
			Y : {
				g : 1,
				c : "y = parseInt(results[{0}], 10);\n",
				s : "(\\d{4})"
			},
			y : {
				g : 1,
				c : "var ty = parseInt(results[{0}], 10);\ny = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
				s : "(\\d{1,2})"
			},
			a : {
				g : 1,
				c : "if (results[{0}] == 'am') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",
				s : "(am|pm)"
			},
			A : {
				g : 1,
				c : "if (results[{0}] == 'AM') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",
				s : "(AM|PM)"
			},
			g : function() {
				return $f("G")
			},
			G : {
				g : 1,
				c : "h = parseInt(results[{0}], 10);\n",
				s : "(\\d{1,2})"
			},
			h : function() {
				return $f("H")
			},
			H : {
				g : 1,
				c : "h = parseInt(results[{0}], 10);\n",
				s : "(\\d{2})"
			},
			i : {
				g : 1,
				c : "i = parseInt(results[{0}], 10);\n",
				s : "(\\d{2})"
			},
			s : {
				g : 1,
				c : "s = parseInt(results[{0}], 10);\n",
				s : "(\\d{2})"
			},
			u : {
				g : 1,
				c : "ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
				s : "(\\d+)"
			},
			O : {
				g : 1,
				c : [
						"o = results[{0}];",
						"var sn = o.substring(0,1);",
						"var hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60);",
						"var mn = o.substring(3,5) % 60;",
						"o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + String.leftPad(hr, 2, '0') + String.leftPad(mn, 2, '0')) : null;\n"]
						.join("\n"),
				s : "([+-]\\d{4})"
			},
			P : {
				g : 1,
				c : [
						"o = results[{0}];",
						"var sn = o.substring(0,1);",
						"var hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60);",
						"var mn = o.substring(4,6) % 60;",
						"o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + String.leftPad(hr, 2, '0') + String.leftPad(mn, 2, '0')) : null;\n"]
						.join("\n"),
				s : "([+-]\\d{2}:\\d{2})"
			},
			T : {
				g : 0,
				c : null,
				s : "[A-Z]{1,4}"
			},
			Z : {
				g : 1,
				c : "z = results[{0}] * 1;\nz = (-43200 <= z && z <= 50400)? z : null;\n",
				s : "([+-]?\\d{1,5})"
			},
			c : function() {
				var calc = [], arr = [$f("Y", 1), $f("m", 2), $f("d", 3),
						$f("h", 4), $f("i", 5), $f("s", 6), {
							c : "ms = (results[7] || '.0').substring(1); ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n"
						}, {
							c : ["if(results[9] == 'Z'){", "z = 0;", "}else{",
									$f("P", 9).c, "}"].join("\n")
						}];
				for (var i = 0, l = arr.length; i < l; ++i) {
					calc.push(arr[i].c)
				}
				return {
					g : 1,
					c : calc.join(""),
					s : arr[0].s + "-" + arr[1].s + "-" + arr[2].s + "T"
							+ arr[3].s + ":" + arr[4].s + ":" + arr[5].s
							+ "((.|,)\\d+)?(Z|([+-]\\d{2}:\\d{2}))"
				}
			},
			U : {
				g : 1,
				c : "u = parseInt(results[{0}], 10);\n",
				s : "(-?\\d+)"
			}
		}
	})
}());
Ext.apply(Date.prototype, {
			dateFormat : function(b) {
				if (Date.formatFunctions[b] == null) {
					Date.createNewFormat(b)
				}
				var a = Date.formatFunctions[b];
				return this[a]()
			},
			getTimezone : function() {
				return this
						.toString()
						.replace(
								/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/,
								"$1$2").replace(/[^A-Z]/g, "")
			},
			getGMTOffset : function(a) {
				return (this.getTimezoneOffset() > 0 ? "-" : "+")
						+ String.leftPad(Math.floor(Math.abs(this
										.getTimezoneOffset())
										/ 60), 2, "0")
						+ (a ? ":" : "")
						+ String.leftPad(Math
										.abs(this.getTimezoneOffset() % 60), 2,
								"0")
			},
			getDayOfYear : function() {
				var a = 0;
				Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
				for (var b = 0; b < this.getMonth(); ++b) {
					a += Date.daysInMonth[b]
				}
				return a + this.getDate() - 1
			},
			getWeekOfYear : function() {
				var a = 86400000, b = 7 * a;
				return function() {
					var d = Date.UTC(this.getFullYear(), this.getMonth(), this
									.getDate()
									+ 3)
							/ a, c = Math.floor(d / 7), e = new Date(c * b)
							.getUTCFullYear();
					return c - Math.floor(Date.UTC(e, 0, 7) / b) + 1
				}
			}(),
			isLeapYear : function() {
				var a = this.getFullYear();
				return !!((a & 3) == 0 && (a % 100 || (a % 400 == 0 && a)))
			},
			getFirstDayOfMonth : function() {
				var a = (this.getDay() - (this.getDate() - 1)) % 7;
				return (a < 0) ? (a + 7) : a
			},
			getLastDayOfMonth : function() {
				var a = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this
						.getDate()))
						% 7;
				return (a < 0) ? (a + 7) : a
			},
			getFirstDateOfMonth : function() {
				return new Date(this.getFullYear(), this.getMonth(), 1)
			},
			getLastDateOfMonth : function() {
				return new Date(this.getFullYear(), this.getMonth(), this
								.getDaysInMonth())
			},
			getDaysInMonth : function() {
				Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
				return Date.daysInMonth[this.getMonth()]
			},
			getSuffix : function() {
				switch (this.getDate()) {
					case 1 :
					case 21 :
					case 31 :
						return "st";
					case 2 :
					case 22 :
						return "nd";
					case 3 :
					case 23 :
						return "rd";
					default :
						return "th"
				}
			},
			clone : function() {
				return new Date(this.getTime())
			},
			clearTime : function(a) {
				if (a) {
					return this.clone().clearTime()
				}
				this.setHours(0);
				this.setMinutes(0);
				this.setSeconds(0);
				this.setMilliseconds(0);
				return this
			},
			add : function(b, c) {
				var e = this.clone();
				if (!b || c === 0) {
					return e
				}
				switch (b.toLowerCase()) {
					case Date.MILLI :
						e.setMilliseconds(this.getMilliseconds() + c);
						break;
					case Date.SECOND :
						e.setSeconds(this.getSeconds() + c);
						break;
					case Date.MINUTE :
						e.setMinutes(this.getMinutes() + c);
						break;
					case Date.HOUR :
						e.setHours(this.getHours() + c);
						break;
					case Date.DAY :
						e.setDate(this.getDate() + c);
						break;
					case Date.MONTH :
						var a = this.getDate();
						if (a > 28) {
							a = Math.min(a, this.getFirstDateOfMonth().add(
											"mo", c).getLastDateOfMonth()
											.getDate())
						}
						e.setDate(a);
						e.setMonth(this.getMonth() + c);
						break;
					case Date.YEAR :
						e.setFullYear(this.getFullYear() + c);
						break
				}
				return e
			},
			between : function(c, a) {
				var b = this.getTime();
				return c.getTime() <= b && b <= a.getTime()
			}
		});
Date.prototype.format = Date.prototype.dateFormat;
if (Ext.isSafari) {
	Date.brokenSetMonth = Date.prototype.setMonth;
	Date.prototype.setMonth = function(a) {
		if (a <= -1) {
			var d = Math.ceil(-a);
			var c = Math.ceil(d / 12);
			var b = (d % 12) ? 12 - d % 12 : 0;
			this.setFullYear(this.getFullYear() - c);
			return Date.brokenSetMonth.call(this, b)
		} else {
			return Date.brokenSetMonth.apply(this, arguments)
		}
	}
};