Ext.Shadow = function(d) {
	Ext.apply(this, d);
	if (typeof this.mode != "string") {
		this.mode = this.defaultMode
	}
	var e = this.offset, c = {
		h : 0
	};
	var b = Math.floor(this.offset / 2);
	switch (this.mode.toLowerCase()) {
		case "drop" :
			c.w = 0;
			c.l = c.t = e;
			c.t -= 1;
			if (Ext.isIE) {
				c.l -= this.offset + b;
				c.t -= this.offset + b;
				c.w -= b;
				c.h -= b;
				c.t += 1
			}
			break;
		case "sides" :
			c.w = (e * 2);
			c.l = -e;
			c.t = e - 1;
			if (Ext.isIE) {
				c.l -= (this.offset - b);
				c.t -= this.offset + b;
				c.l += 1;
				c.w -= (this.offset - b) * 2;
				c.w -= b + 1;
				c.h -= 1
			}
			break;
		case "frame" :
			c.w = c.h = (e * 2);
			c.l = c.t = -e;
			c.t += 1;
			c.h -= 2;
			if (Ext.isIE) {
				c.l -= (this.offset - b);
				c.t -= (this.offset - b);
				c.l += 1;
				c.w -= (this.offset + b + 1);
				c.h -= (this.offset + b);
				c.h += 1
			}
			break
	}
	this.adjusts = c
};
Ext.Shadow.prototype = {
	offset : 4,
	defaultMode : "drop",
	show : function(a) {
		a = Ext.get(a);
		if (!this.el) {
			this.el = Ext.Shadow.Pool.pull();
			if (this.el.dom.nextSibling != a.dom) {
				this.el.insertBefore(a)
			}
		}
		this.el.setStyle("z-index", this.zIndex
						|| parseInt(a.getStyle("z-index"), 10) - 1);
		if (Ext.isIE) {
			this.el.dom.style.filter = "progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius="
					+ (this.offset) + ")"
		}
		this.realign(a.getLeft(true), a.getTop(true), a.getWidth(), a
						.getHeight());
		this.el.dom.style.display = "block"
	},
	isVisible : function() {
		return this.el ? true : false
	},
	realign : function(b, q, p, f) {
		if (!this.el) {
			return
		}
		var m = this.adjusts, j = this.el.dom, r = j.style;
		var g = 0;
		r.left = (b + m.l) + "px";
		r.top = (q + m.t) + "px";
		var o = (p + m.w), e = (f + m.h), i = o + "px", n = e + "px";
		if (r.width != i || r.height != n) {
			r.width = i;
			r.height = n;
			if (!Ext.isIE) {
				var k = j.childNodes;
				var c = Math.max(0, (o - 12)) + "px";
				k[0].childNodes[1].style.width = c;
				k[1].childNodes[1].style.width = c;
				k[2].childNodes[1].style.width = c;
				k[1].style.height = Math.max(0, (e - 12)) + "px"
			}
		}
	},
	hide : function() {
		if (this.el) {
			this.el.dom.style.display = "none";
			Ext.Shadow.Pool.push(this.el);
			delete this.el
		}
	},
	setZIndex : function(a) {
		this.zIndex = a;
		if (this.el) {
			this.el.setStyle("z-index", a)
		}
	}
};
Ext.Shadow.Pool = function() {
	var b = [];
	var a = Ext.isIE
			? '<div class="x-ie-shadow"></div>'
			: '<div class="x-shadow"><div class="xst"><div class="xstl"></div><div class="xstc"></div><div class="xstr"></div></div><div class="xsc"><div class="xsml"></div><div class="xsmc"></div><div class="xsmr"></div></div><div class="xsb"><div class="xsbl"></div><div class="xsbc"></div><div class="xsbr"></div></div></div>';
	return {
		pull : function() {
			var c = b.shift();
			if (!c) {
				c = Ext.get(Ext.DomHelper.insertHtml("beforeBegin",
						document.body.firstChild, a));
				c.autoBoxAdjust = false
			}
			return c
		},
		push : function(c) {
			b.push(c)
		}
	}
}();