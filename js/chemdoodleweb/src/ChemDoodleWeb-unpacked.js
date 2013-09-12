//
// ChemDoodle Web Components 5.2.3
//
// http://web.chemdoodle.com
//
// Copyright 2009-2013 iChemLabs, LLC.  All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// As a special exception to the GPL, any HTML file in a public website
// or any free web service which merely makes function calls to this
// code, and for that purpose includes it by reference, shall be deemed
// a separate work for copyright law purposes. If you modify this code,
// you may extend this exception to your version of the code, but you
// are not obligated to do so. If you do not wish to do so, delete this
// exception statement from your version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// Please contact iChemLabs <http://www.ichemlabs.com/contact-us> for
// alternate licensing options.
//
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2934 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-08 20:53:47 -0500 (Wed, 08 Dec 2010) $
//
var ChemDoodle = (function() {
	'use strict';
	var c = {};

	c.structures = {};
	c.structures.d2 = {};
	c.structures.d3 = {};
	c.iChemLabs = {};
	c.informatics = {};
	c.io = {};

	var VERSION = '5.2.3';

	c.getVersion = function() {
		return VERSION;
	};

	return c;

})();
//
//  Copyright 2006-2010 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4401 $
//  $Author: kevin $
//  $LastChangedDate: 2013-06-08 12:26:27 -0400 (Sat, 08 Jun 2013) $
//

ChemDoodle.extensions = (function(structures, v3, m) {
	'use strict';
	var ext = {};

	ext.stringStartsWith = function(str, match) {
		return str.slice(0, match.length) === match;
	};

	ext.vec3AngleFrom = function(v1, v2) {
		var length1 = v3.length(v1);
		var length2 = v3.length(v2);
		var dot = v3.dot(v1, v2);
		var cosine = dot / length1 / length2;
		return m.acos(cosine);
	};

	ext.contextHashTo = function(ctx, xs, ys, xt, yt, width, spacing) {
		var travelled = 0;
		var dist = new structures.Point(xs, ys).distance(new structures.Point(xt, yt));
		var space = false;
		var lastX = xs;
		var lastY = ys;
		var difX = xt - xs;
		var difY = yt - ys;
		while (travelled < dist) {
			if (space) {
				if (travelled + spacing > dist) {
					ctx.moveTo(xt, yt);
					break;
				} else {
					var percent = spacing / dist;
					lastX += percent * difX;
					lastY += percent * difY;
					ctx.moveTo(lastX, lastY);
					travelled += spacing;
				}
			} else {
				if (travelled + width > dist) {
					ctx.lineTo(xt, yt);
					break;
				} else {
					var percent = width / dist;
					lastX += percent * difX;
					lastY += percent * difY;
					ctx.lineTo(lastX, lastY);
					travelled += width;
				}
			}
			space = !space;
		}
	};

	ext.contextRoundRect = function(ctx, x, y, width, height, radius) {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
	};

	ext.contextEllipse = function(ctx, x, y, w, h) {
		var kappa = .5522848;
		var ox = (w / 2) * kappa;
		var oy = (h / 2) * kappa;
		var xe = x + w;
		var ye = y + h;
		var xm = x + w / 2;
		var ym = y + h / 2;

		ctx.beginPath();
		ctx.moveTo(x, ym);
		ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
		ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		ctx.closePath();
	};

	ext.getFontString = function(size, families, bold, italic) {
		var sb = [];
		if (bold) {
			sb.push('bold ');
		}
		if (italic) {
			sb.push('italic ');
		}
		sb.push(size + 'px ');
		for ( var i = 0, ii = families.length; i < ii; i++) {
			var use = families[i];
			if (use.indexOf(' ') !== -1) {
				use = '"' + use + '"';
			}
			sb.push((i !== 0 ? ',' : '') + use);
		}
		return sb.join('');
	};

	return ext;

})(ChemDoodle.structures, vec3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4459 $
//  $Author: kevin $
//  $LastChangedDate: 2013-08-06 14:09:43 -0400 (Tue, 06 Aug 2013) $
//

ChemDoodle.math = (function(extensions, structures, m) {
	'use strict';
	var pack = {};

	var namedColors = {
		'aliceblue' : '#f0f8ff',
		'antiquewhite' : '#faebd7',
		'aqua' : '#00ffff',
		'aquamarine' : '#7fffd4',
		'azure' : '#f0ffff',
		'beige' : '#f5f5dc',
		'bisque' : '#ffe4c4',
		'black' : '#000000',
		'blanchedalmond' : '#ffebcd',
		'blue' : '#0000ff',
		'blueviolet' : '#8a2be2',
		'brown' : '#a52a2a',
		'burlywood' : '#deb887',
		'cadetblue' : '#5f9ea0',
		'chartreuse' : '#7fff00',
		'chocolate' : '#d2691e',
		'coral' : '#ff7f50',
		'cornflowerblue' : '#6495ed',
		'cornsilk' : '#fff8dc',
		'crimson' : '#dc143c',
		'cyan' : '#00ffff',
		'darkblue' : '#00008b',
		'darkcyan' : '#008b8b',
		'darkgoldenrod' : '#b8860b',
		'darkgray' : '#a9a9a9',
		'darkgreen' : '#006400',
		'darkkhaki' : '#bdb76b',
		'darkmagenta' : '#8b008b',
		'darkolivegreen' : '#556b2f',
		'darkorange' : '#ff8c00',
		'darkorchid' : '#9932cc',
		'darkred' : '#8b0000',
		'darksalmon' : '#e9967a',
		'darkseagreen' : '#8fbc8f',
		'darkslateblue' : '#483d8b',
		'darkslategray' : '#2f4f4f',
		'darkturquoise' : '#00ced1',
		'darkviolet' : '#9400d3',
		'deeppink' : '#ff1493',
		'deepskyblue' : '#00bfff',
		'dimgray' : '#696969',
		'dodgerblue' : '#1e90ff',
		'firebrick' : '#b22222',
		'floralwhite' : '#fffaf0',
		'forestgreen' : '#228b22',
		'fuchsia' : '#ff00ff',
		'gainsboro' : '#dcdcdc',
		'ghostwhite' : '#f8f8ff',
		'gold' : '#ffd700',
		'goldenrod' : '#daa520',
		'gray' : '#808080',
		'green' : '#008000',
		'greenyellow' : '#adff2f',
		'honeydew' : '#f0fff0',
		'hotpink' : '#ff69b4',
		'indianred ' : '#cd5c5c',
		'indigo ' : '#4b0082',
		'ivory' : '#fffff0',
		'khaki' : '#f0e68c',
		'lavender' : '#e6e6fa',
		'lavenderblush' : '#fff0f5',
		'lawngreen' : '#7cfc00',
		'lemonchiffon' : '#fffacd',
		'lightblue' : '#add8e6',
		'lightcoral' : '#f08080',
		'lightcyan' : '#e0ffff',
		'lightgoldenrodyellow' : '#fafad2',
		'lightgrey' : '#d3d3d3',
		'lightgreen' : '#90ee90',
		'lightpink' : '#ffb6c1',
		'lightsalmon' : '#ffa07a',
		'lightseagreen' : '#20b2aa',
		'lightskyblue' : '#87cefa',
		'lightslategray' : '#778899',
		'lightsteelblue' : '#b0c4de',
		'lightyellow' : '#ffffe0',
		'lime' : '#00ff00',
		'limegreen' : '#32cd32',
		'linen' : '#faf0e6',
		'magenta' : '#ff00ff',
		'maroon' : '#800000',
		'mediumaquamarine' : '#66cdaa',
		'mediumblue' : '#0000cd',
		'mediumorchid' : '#ba55d3',
		'mediumpurple' : '#9370d8',
		'mediumseagreen' : '#3cb371',
		'mediumslateblue' : '#7b68ee',
		'mediumspringgreen' : '#00fa9a',
		'mediumturquoise' : '#48d1cc',
		'mediumvioletred' : '#c71585',
		'midnightblue' : '#191970',
		'mintcream' : '#f5fffa',
		'mistyrose' : '#ffe4e1',
		'moccasin' : '#ffe4b5',
		'navajowhite' : '#ffdead',
		'navy' : '#000080',
		'oldlace' : '#fdf5e6',
		'olive' : '#808000',
		'olivedrab' : '#6b8e23',
		'orange' : '#ffa500',
		'orangered' : '#ff4500',
		'orchid' : '#da70d6',
		'palegoldenrod' : '#eee8aa',
		'palegreen' : '#98fb98',
		'paleturquoise' : '#afeeee',
		'palevioletred' : '#d87093',
		'papayawhip' : '#ffefd5',
		'peachpuff' : '#ffdab9',
		'peru' : '#cd853f',
		'pink' : '#ffc0cb',
		'plum' : '#dda0dd',
		'powderblue' : '#b0e0e6',
		'purple' : '#800080',
		'red' : '#ff0000',
		'rosybrown' : '#bc8f8f',
		'royalblue' : '#4169e1',
		'saddlebrown' : '#8b4513',
		'salmon' : '#fa8072',
		'sandybrown' : '#f4a460',
		'seagreen' : '#2e8b57',
		'seashell' : '#fff5ee',
		'sienna' : '#a0522d',
		'silver' : '#c0c0c0',
		'skyblue' : '#87ceeb',
		'slateblue' : '#6a5acd',
		'slategray' : '#708090',
		'snow' : '#fffafa',
		'springgreen' : '#00ff7f',
		'steelblue' : '#4682b4',
		'tan' : '#d2b48c',
		'teal' : '#008080',
		'thistle' : '#d8bfd8',
		'tomato' : '#ff6347',
		'turquoise' : '#40e0d0',
		'violet' : '#ee82ee',
		'wheat' : '#f5deb3',
		'white' : '#ffffff',
		'whitesmoke' : '#f5f5f5',
		'yellow' : '#ffff00',
		'yellowgreen' : '#9acd32'
	};

	pack.angleBetweenLargest = function(angles) {
		if (angles.length === 0) {
			return {
				angle : 0,
				largest : m.PI * 2
			};
		}
		if (angles.length === 1) {
			return {
				angle : angles[0] + m.PI,
				largest : m.PI * 2
			};
		}
		var largest = 0;
		var angle = 0;
		var index = -1;
		for ( var i = 0, ii = angles.length - 1; i < ii; i++) {
			var dif = angles[i + 1] - angles[i];
			if (dif > largest) {
				largest = dif;
				angle = (angles[i + 1] + angles[i]) / 2;
				index = i;
			}
		}
		var last = angles[0] + m.PI * 2 - angles[angles.length - 1];
		if (last > largest) {
			angle = angles[0] - last / 2;
			largest = last;
			if (angle < 0) {
				angle += m.PI * 2;
			}
			index = angles.length - 1;
		}
		return {
			angle : angle,
			largest : largest
		};
	};

	pack.isBetween = function(x, left, right) {
		if (left > right) {
			var tmp = left;
			left = right;
			right = tmp;
		}
		return x >= left && x <= right;
	};

	pack.getRGB = function(color, multiplier) {
		var err = [ 0, 0, 0 ];
		if (namedColors[color.toLowerCase()]) {
			color = namedColors[color.toLowerCase()];
		}
		if (color.charAt(0) === '#') {
			if (color.length === 4) {
				color = '#' + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3);
			}
			return [ parseInt(color.substring(1, 3), 16) / 255.0 * multiplier, parseInt(color.substring(3, 5), 16) / 255.0 * multiplier, parseInt(color.substring(5, 7), 16) / 255.0 * multiplier ];
		} else if (extensions.stringStartsWith(color, 'rgb')) {
			var cs = color.replace(/rgb\(|\)/g, '').split(',');
			if (cs.length !== 3) {
				return err;
			}
			return [ parseInt(cs[0]) / 255.0 * multiplier, parseInt(cs[1]) / 255.0 * multiplier, parseInt(cs[2]) / 255.0 * multiplier ];
		}
		return err;
	};

	pack.idx2color = function(value) {
		var hex = value.toString(16);

		// add '0' padding
		for ( var i = 0, ii = 6 - hex.length; i < ii; i++) {
			hex = "0" + hex;
		}

		return "#" + hex;
	};

	pack.distanceFromPointToLineInclusive = function(p, l1, l2) {
		var length = l1.distance(l2);
		var angle = l1.angle(l2);
		var angleDif = m.PI / 2 - angle;
		var newAngleP = l1.angle(p) + angleDif;
		var pDist = l1.distance(p);
		var pcopRot = new structures.Point(pDist * m.cos(newAngleP), -pDist * m.sin(newAngleP));
		if (pack.isBetween(-pcopRot.y, 0, length)) {
			return m.abs(pcopRot.x);
		}
		return -1;
	};

	pack.calculateDistanceInterior = function(to, from, r) {
		if (this.isBetween(from.x, r.x, r.x + r.w) && this.isBetween(from.y, r.y, r.y + r.w)) {
			return to.distance(from);
		}
		// calculates the distance that a line needs to remove from itself to be
		// outside that rectangle
		var lines = [];
		// top
		lines.push({
			x1 : r.x,
			y1 : r.y,
			x2 : r.x + r.w,
			y2 : r.y
		});
		// bottom
		lines.push({
			x1 : r.x,
			y1 : r.y + r.h,
			x2 : r.x + r.w,
			y2 : r.y + r.h
		});
		// left
		lines.push({
			x1 : r.x,
			y1 : r.y,
			x2 : r.x,
			y2 : r.y + r.h
		});
		// right
		lines.push({
			x1 : r.x + r.w,
			y1 : r.y,
			x2 : r.x + r.w,
			y2 : r.y + r.h
		});

		var intersections = [];
		for ( var i = 0; i < 4; i++) {
			var l = lines[i];
			var p = this.intersectLines(from.x, from.y, to.x, to.y, l.x1, l.y1, l.x2, l.y2);
			if (p) {
				intersections.push(p);
			}
		}
		if (intersections.length === 0) {
			return 0;
		}
		var max = 0;
		for ( var i = 0, ii = intersections.length; i < ii; i++) {
			var p = intersections[i];
			var dx = to.x - p.x;
			var dy = to.y - p.y;
			max = m.max(max, m.sqrt(dx * dx + dy * dy));
		}
		return max;
	};

	pack.intersectLines = function(ax, ay, bx, by, cx, cy, dx, dy) {
		// calculate the direction vectors
		bx -= ax;
		by -= ay;
		dx -= cx;
		dy -= cy;

		// are they parallel?
		var denominator = by * dx - bx * dy;
		if (denominator === 0) {
			return false;
		}

		// calculate point of intersection
		var r = (dy * (ax - cx) - dx * (ay - cy)) / denominator;
		var s = (by * (ax - cx) - bx * (ay - cy)) / denominator;
		if ((s >= 0) && (s <= 1) && (r >= 0) && (r <= 1)) {
			return {
				x : (ax + r * bx),
				y : (ay + r * by)
			};
		} else {
			return false;
		}
	};

	pack.hsl2rgb = function(h, s, l) {
		var hue2rgb = function(p, q, t) {
			if (t < 0) {
				t += 1;
			} else if (t > 1) {
				t -= 1;
			}
			if (t < 1 / 6) {
				return p + (q - p) * 6 * t;
			} else if (t < 1 / 2) {
				return q;
			} else if (t < 2 / 3) {
				return p + (q - p) * (2 / 3 - t) * 6;
			}
			return p;
		};
		var r, g, b;
		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}
		return [ r * 255, g * 255, b * 255 ];
	};

	pack.isPointInPoly = function(poly, pt) {
		for ( var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
			((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) && (c = !c);
		}
		return c;
	};

	pack.clamp = function(value, min, max) {
		return value < min ? min : value > max ? max : value;
	};

	return pack;

})(ChemDoodle.extensions, ChemDoodle.structures, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3469 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-21 10:01:03 -0500 (Sat, 21 Jan 2012) $
//

(function(math, m) {
	'use strict';
	math.Bounds = function() {
	};
	var _ = math.Bounds.prototype;
	_.minX = _.minY = _.minZ = Infinity;
	_.maxX = _.maxY = _.maxZ = -Infinity;
	_.expand = function(x1, y1, x2, y2) {
		if (x1 instanceof math.Bounds) {
			// only need to compare min and max since bounds already has
			// them ordered
			this.minX = m.min(this.minX, x1.minX);
			this.minY = m.min(this.minY, x1.minY);
			this.maxX = m.max(this.maxX, x1.maxX);
			this.maxY = m.max(this.maxY, x1.maxY);
			if(x1.maxZ!==Infinity){
				this.minZ = m.min(this.minZ, x1.minZ);
				this.maxZ = m.max(this.maxZ, x1.maxZ);
			}
		} else {
			this.minX = m.min(this.minX, x1);
			this.maxX = m.max(this.maxX, x1);
			this.minY = m.min(this.minY, y1);
			this.maxY = m.max(this.maxY, y1);
			// these two values could be 0, so check if undefined
			if (x2 !== undefined && y2 !== undefined) {
				this.minX = m.min(this.minX, x2);
				this.maxX = m.max(this.maxX, x2);
				this.minY = m.min(this.minY, y2);
				this.maxY = m.max(this.maxY, y2);
			}
		}
	};
	_.expand3D = function(x1, y1, z1, x2, y2, z2) {
		this.minX = m.min(this.minX, x1);
		this.maxX = m.max(this.maxX, x1);
		this.minY = m.min(this.minY, y1);
		this.maxY = m.max(this.maxY, y1);
		this.minZ = m.min(this.minZ, z1);
		this.maxZ = m.max(this.maxZ, z1);
		// these two values could be 0, so check if undefined
		if (x2 !== undefined && y2 !== undefined && z2 !== undefined) {
			this.minX = m.min(this.minX, x2);
			this.maxX = m.max(this.maxX, x2);
			this.minY = m.min(this.minY, y2);
			this.maxY = m.max(this.maxY, y2);
			this.minZ = m.min(this.minZ, z2);
			this.maxZ = m.max(this.maxZ, z2);
		}
	};

})(ChemDoodle.math, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3469 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-21 10:01:03 -0500 (Sat, 21 Jan 2012) $
//

/**
 * jsBezier-0.5
 * 
 * Copyright (c) 2010 - 2011 Simon Porritt (simon.porritt@gmail.com)
 * 
 * licensed under the MIT license.
 * 
 * a set of Bezier curve functions that deal with Beziers, used by jsPlumb, and
 * perhaps useful for other people. These functions work with Bezier curves of
 * arbitrary degree.
 *  - functions are all in the 'jsBezier' namespace.
 *  - all input points should be in the format {x:.., y:..}. all output points
 * are in this format too.
 *  - all input curves should be in the format [ {x:.., y:..}, {x:.., y:..},
 * {x:.., y:..}, {x:.., y:..} ]
 *  - 'location' as used as an input here refers to a decimal in the range 0-1
 * inclusive, which indicates a point some proportion along the length of the
 * curve. location as output has the same format and meaning.
 * 
 * 
 * Function List: --------------
 * 
 * distanceFromCurve(point, curve)
 * 
 * Calculates the distance that the given point lies from the given Bezier. Note
 * that it is computed relative to the center of the Bezier, so if you have
 * stroked the curve with a wide pen you may wish to take that into account! The
 * distance returned is relative to the values of the curve and the point - it
 * will most likely be pixels.
 * 
 * gradientAtPoint(curve, location)
 * 
 * Calculates the gradient to the curve at the given location, as a decimal
 * between 0 and 1 inclusive.
 * 
 * gradientAtPointAlongCurveFrom (curve, location)
 * 
 * Calculates the gradient at the point on the given curve that is 'distance'
 * units from location.
 * 
 * nearestPointOnCurve(point, curve)
 * 
 * Calculates the nearest point to the given point on the given curve. The
 * return value of this is a JS object literal, containing both the point's
 * coordinates and also the 'location' of the point (see above), for example: {
 * point:{x:551,y:150}, location:0.263365 }.
 * 
 * pointOnCurve(curve, location)
 * 
 * Calculates the coordinates of the point on the given Bezier curve at the
 * given location.
 * 
 * pointAlongCurveFrom(curve, location, distance)
 * 
 * Calculates the coordinates of the point on the given curve that is 'distance'
 * units from location. 'distance' should be in the same coordinate space as
 * that used to construct the Bezier curve. For an HTML Canvas usage, for
 * example, distance would be a measure of pixels.
 * 
 * locationAlongCurveFrom(curve, location, distance)
 * 
 * Calculates the location on the given curve that is 'distance' units from
 * location. 'distance' should be in the same coordinate space as that used to
 * construct the Bezier curve. For an HTML Canvas usage, for example, distance
 * would be a measure of pixels.
 * 
 * perpendicularToCurveAt(curve, location, length, distance)
 * 
 * Calculates the perpendicular to the given curve at the given location. length
 * is the length of the line you wish for (it will be centered on the point at
 * 'location'). distance is optional, and allows you to specify a point along
 * the path from the given location as the center of the perpendicular returned.
 * The return value of this is an array of two points: [ {x:...,y:...},
 * {x:...,y:...} ].
 * 
 * 
 */

(function(math) {
	'use strict';
	function sgn(x) {
		return x == 0 ? 0 : x > 0 ? 1 : -1;
	}

	var Vectors = {
		subtract : function(v1, v2) {
			return {
				x : v1.x - v2.x,
				y : v1.y - v2.y
			};
		},
		dotProduct : function(v1, v2) {
			return (v1.x * v2.x) + (v1.y * v2.y);
		},
		square : function(v) {
			return Math.sqrt((v.x * v.x) + (v.y * v.y));
		},
		scale : function(v, s) {
			return {
				x : v.x * s,
				y : v.y * s
			};
		}
	},

	maxRecursion = 64, flatnessTolerance = Math.pow(2.0, -maxRecursion - 1);

	/**
	 * Calculates the distance that the point lies from the curve.
	 * 
	 * @param point
	 *            a point in the form {x:567, y:3342}
	 * @param curve
	 *            a Bezier curve in the form [{x:..., y:...}, {x:..., y:...},
	 *            {x:..., y:...}, {x:..., y:...}]. note that this is currently
	 *            hardcoded to assume cubiz beziers, but would be better off
	 *            supporting any degree.
	 * @return a JS object literal containing location and distance, for
	 *         example: {location:0.35, distance:10}. Location is analogous to
	 *         the location argument you pass to the pointOnPath function: it is
	 *         a ratio of distance travelled along the curve. Distance is the
	 *         distance in pixels from the point to the curve.
	 */
	var _distanceFromCurve = function(point, curve) {
		var candidates = [], w = _convertToBezier(point, curve), degree = curve.length - 1, higherDegree = (2 * degree) - 1, numSolutions = _findRoots(w, higherDegree, candidates, 0), v = Vectors.subtract(point, curve[0]), dist = Vectors.square(v), t = 0.0;

		for ( var i = 0; i < numSolutions; i++) {
			v = Vectors.subtract(point, _bezier(curve, degree, candidates[i], null, null));
			var newDist = Vectors.square(v);
			if (newDist < dist) {
				dist = newDist;
				t = candidates[i];
			}
		}
		v = Vectors.subtract(point, curve[degree]);
		newDist = Vectors.square(v);
		if (newDist < dist) {
			dist = newDist;
			t = 1.0;
		}
		return {
			location : t,
			distance : dist
		};
	};
	/**
	 * finds the nearest point on the curve to the given point.
	 */
	var _nearestPointOnCurve = function(point, curve) {
		var td = _distanceFromCurve(point, curve);
		return {
			point : _bezier(curve, curve.length - 1, td.location, null, null),
			location : td.location
		};
	};
	var _convertToBezier = function(point, curve) {
		var degree = curve.length - 1, higherDegree = (2 * degree) - 1, c = [], d = [], cdTable = [], w = [], z = [ [ 1.0, 0.6, 0.3, 0.1 ], [ 0.4, 0.6, 0.6, 0.4 ], [ 0.1, 0.3, 0.6, 1.0 ] ];

		for ( var i = 0; i <= degree; i++)
			c[i] = Vectors.subtract(curve[i], point);
		for ( var i = 0; i <= degree - 1; i++) {
			d[i] = Vectors.subtract(curve[i + 1], curve[i]);
			d[i] = Vectors.scale(d[i], 3.0);
		}
		for ( var row = 0; row <= degree - 1; row++) {
			for ( var column = 0; column <= degree; column++) {
				if (!cdTable[row])
					cdTable[row] = [];
				cdTable[row][column] = Vectors.dotProduct(d[row], c[column]);
			}
		}
		for (i = 0; i <= higherDegree; i++) {
			if (!w[i])
				w[i] = [];
			w[i].y = 0.0;
			w[i].x = parseFloat(i) / higherDegree;
		}
		var n = degree, m = degree - 1;
		for ( var k = 0; k <= n + m; k++) {
			var lb = Math.max(0, k - m), ub = Math.min(k, n);
			for (i = lb; i <= ub; i++) {
				var j = k - i;
				w[i + j].y += cdTable[j][i] * z[j][i];
			}
		}
		return w;
	};
	/**
	 * counts how many roots there are.
	 */
	var _findRoots = function(w, degree, t, depth) {
		var left = [], right = [], left_count, right_count, left_t = [], right_t = [];

		switch (_getCrossingCount(w, degree)) {
		case 0: {
			return 0;
		}
		case 1: {
			if (depth >= maxRecursion) {
				t[0] = (w[0].x + w[degree].x) / 2.0;
				return 1;
			}
			if (_isFlatEnough(w, degree)) {
				t[0] = _computeXIntercept(w, degree);
				return 1;
			}
			break;
		}
		}
		_bezier(w, degree, 0.5, left, right);
		left_count = _findRoots(left, degree, left_t, depth + 1);
		right_count = _findRoots(right, degree, right_t, depth + 1);
		for ( var i = 0; i < left_count; i++)
			t[i] = left_t[i];
		for ( var i = 0; i < right_count; i++)
			t[i + left_count] = right_t[i];
		return (left_count + right_count);
	};
	var _getCrossingCount = function(curve, degree) {
		var n_crossings = 0, sign, old_sign;
		sign = old_sign = sgn(curve[0].y);
		for ( var i = 1; i <= degree; i++) {
			sign = sgn(curve[i].y);
			if (sign != old_sign)
				n_crossings++;
			old_sign = sign;
		}
		return n_crossings;
	};
	var _isFlatEnough = function(curve, degree) {
		var error, intercept_1, intercept_2, left_intercept, right_intercept, a, b, c, det, dInv, a1, b1, c1, a2, b2, c2;
		a = curve[0].y - curve[degree].y;
		b = curve[degree].x - curve[0].x;
		c = curve[0].x * curve[degree].y - curve[degree].x * curve[0].y;

		var max_distance_above = 0.0, max_distance_below = 0.0;

		for ( var i = 1; i < degree; i++) {
			var value = a * curve[i].x + b * curve[i].y + c;
			if (value > max_distance_above)
				max_distance_above = value;
			else if (value < max_distance_below)
				max_distance_below = value;
		}

		a1 = 0.0;
		b1 = 1.0;
		c1 = 0.0;
		a2 = a;
		b2 = b;
		c2 = c - max_distance_above;
		det = a1 * b2 - a2 * b1;
		dInv = 1.0 / det;
		intercept_1 = (b1 * c2 - b2 * c1) * dInv;
		a2 = a;
		b2 = b;
		c2 = c - max_distance_below;
		det = a1 * b2 - a2 * b1;
		dInv = 1.0 / det;
		intercept_2 = (b1 * c2 - b2 * c1) * dInv;
		left_intercept = Math.min(intercept_1, intercept_2);
		right_intercept = Math.max(intercept_1, intercept_2);
		error = right_intercept - left_intercept;
		return (error < flatnessTolerance) ? 1 : 0;
	};
	var _computeXIntercept = function(curve, degree) {
		var XLK = 1.0, YLK = 0.0, XNM = curve[degree].x - curve[0].x, YNM = curve[degree].y - curve[0].y, XMK = curve[0].x - 0.0, YMK = curve[0].y - 0.0, det = XNM * YLK - YNM * XLK, detInv = 1.0 / det, S = (XNM * YMK - YNM * XMK) * detInv;
		return 0.0 + XLK * S;
	};
	var _bezier = function(curve, degree, t, left, right) {
		var temp = [ [] ];
		for ( var j = 0; j <= degree; j++)
			temp[0][j] = curve[j];
		for ( var i = 1; i <= degree; i++) {
			for ( var j = 0; j <= degree - i; j++) {
				if (!temp[i])
					temp[i] = [];
				if (!temp[i][j])
					temp[i][j] = {};
				temp[i][j].x = (1.0 - t) * temp[i - 1][j].x + t * temp[i - 1][j + 1].x;
				temp[i][j].y = (1.0 - t) * temp[i - 1][j].y + t * temp[i - 1][j + 1].y;
			}
		}
		if (left != null)
			for (j = 0; j <= degree; j++)
				left[j] = temp[j][0];
		if (right != null)
			for (j = 0; j <= degree; j++)
				right[j] = temp[degree - j][j];

		return (temp[degree][0]);
	};

	var _curveFunctionCache = {};
	var _getCurveFunctions = function(order) {
		var fns = _curveFunctionCache[order];
		if (!fns) {
			fns = [];
			var f_term = function() {
				return function(t) {
					return Math.pow(t, order);
				};
			}, l_term = function() {
				return function(t) {
					return Math.pow((1 - t), order);
				};
			}, c_term = function(c) {
				return function(t) {
					return c;
				};
			}, t_term = function() {
				return function(t) {
					return t;
				};
			}, one_minus_t_term = function() {
				return function(t) {
					return 1 - t;
				};
			}, _termFunc = function(terms) {
				return function(t) {
					var p = 1;
					for ( var i = 0; i < terms.length; i++)
						p = p * terms[i](t);
					return p;
				};
			};

			fns.push(new f_term()); // first is t to the power of the curve
									// order
			for ( var i = 1; i < order; i++) {
				var terms = [ new c_term(order) ];
				for ( var j = 0; j < (order - i); j++)
					terms.push(new t_term());
				for ( var j = 0; j < i; j++)
					terms.push(new one_minus_t_term());
				fns.push(new _termFunc(terms));
			}
			fns.push(new l_term()); // last is (1-t) to the power of the curve
									// order

			_curveFunctionCache[order] = fns;
		}

		return fns;
	};

	/**
	 * calculates a point on the curve, for a Bezier of arbitrary order.
	 * 
	 * @param curve
	 *            an array of control points, eg [{x:10,y:20}, {x:50,y:50},
	 *            {x:100,y:100}, {x:120,y:100}]. For a cubic bezier this should
	 *            have four points.
	 * @param location
	 *            a decimal indicating the distance along the curve the point
	 *            should be located at. this is the distance along the curve as
	 *            it travels, taking the way it bends into account. should be a
	 *            number from 0 to 1, inclusive.
	 */
	var _pointOnPath = function(curve, location) {
		var cc = _getCurveFunctions(curve.length - 1), _x = 0, _y = 0;
		for ( var i = 0; i < curve.length; i++) {
			_x = _x + (curve[i].x * cc[i](location));
			_y = _y + (curve[i].y * cc[i](location));
		}

		return {
			x : _x,
			y : _y
		};
	};

	var _dist = function(p1, p2) {
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
	};

	/**
	 * finds the point that is 'distance' along the path from 'location'. this
	 * method returns both the x,y location of the point and also its 'location'
	 * (proportion of travel along the path); the method below -
	 * _pointAlongPathFrom - calls this method and just returns the point.
	 */
	var _pointAlongPath = function(curve, location, distance) {
		var prev = _pointOnPath(curve, location), tally = 0, curLoc = location, direction = distance > 0 ? 1 : -1, cur = null;

		while (tally < Math.abs(distance)) {
			curLoc += (0.005 * direction);
			cur = _pointOnPath(curve, curLoc);
			tally += _dist(cur, prev);
			prev = cur;
		}
		return {
			point : cur,
			location : curLoc
		};
	};

	var _length = function(curve) {
		var prev = _pointOnPath(curve, 0), tally = 0, curLoc = 0, direction = 1, cur = null;

		while (curLoc < 1) {
			curLoc += (0.005 * direction);
			cur = _pointOnPath(curve, curLoc);
			tally += _dist(cur, prev);
			prev = cur;
		}
		return tally;
	};

	/**
	 * finds the point that is 'distance' along the path from 'location'.
	 */
	var _pointAlongPathFrom = function(curve, location, distance) {
		return _pointAlongPath(curve, location, distance).point;
	};

	/**
	 * finds the location that is 'distance' along the path from 'location'.
	 */
	var _locationAlongPathFrom = function(curve, location, distance) {
		return _pointAlongPath(curve, location, distance).location;
	};

	/**
	 * returns the gradient of the curve at the given location, which is a
	 * decimal between 0 and 1 inclusive.
	 * 
	 * thanks // http://bimixual.org/AnimationLibrary/beziertangents.html
	 */
	var _gradientAtPoint = function(curve, location) {
		var p1 = _pointOnPath(curve, location), p2 = _pointOnPath(curve.slice(0, curve.length - 1), location), dy = p2.y - p1.y, dx = p2.x - p1.x;
		return dy == 0 ? Infinity : Math.atan(dy / dx);
	};

	/**
	 * returns the gradient of the curve at the point which is 'distance' from
	 * the given location. if this point is greater than location 1, the
	 * gradient at location 1 is returned. if this point is less than location
	 * 0, the gradient at location 0 is returned.
	 */
	var _gradientAtPointAlongPathFrom = function(curve, location, distance) {
		var p = _pointAlongPath(curve, location, distance);
		if (p.location > 1)
			p.location = 1;
		if (p.location < 0)
			p.location = 0;
		return _gradientAtPoint(curve, p.location);
	};

	/**
	 * calculates a line that is 'length' pixels long, perpendicular to, and
	 * centered on, the path at 'distance' pixels from the given location. if
	 * distance is not supplied, the perpendicular for the given location is
	 * computed (ie. we set distance to zero).
	 */
	var _perpendicularToPathAt = function(curve, location, length, distance) {
		distance = distance == null ? 0 : distance;
		var p = _pointAlongPath(curve, location, distance), m = _gradientAtPoint(curve, p.location), _theta2 = Math.atan(-1 / m), y = length / 2 * Math.sin(_theta2), x = length / 2 * Math.cos(_theta2);
		return [ {
			x : p.point.x + x,
			y : p.point.y + y
		}, {
			x : p.point.x - x,
			y : p.point.y - y
		} ];
	};

	ChemDoodle.math.jsBezier = {
		distanceFromCurve : _distanceFromCurve,
		gradientAtPoint : _gradientAtPoint,
		gradientAtPointAlongCurveFrom : _gradientAtPointAlongPathFrom,
		nearestPointOnCurve : _nearestPointOnCurve,
		pointOnCurve : _pointOnPath,
		pointAlongCurveFrom : _pointAlongPathFrom,
		perpendicularToCurveAt : _perpendicularToPathAt,
		locationAlongCurveFrom : _locationAlongPathFrom,
		getLength : _length
	};
})(ChemDoodle.math);
//
//  Copyright 2006-2010 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4404 $
//  $Author: kevin $
//  $LastChangedDate: 2013-06-09 18:47:35 -0400 (Sun, 09 Jun 2013) $
//

ChemDoodle.featureDetection = (function(iChemLabs, q, document, window) {
	'use strict';
	var features = {};

	features.supports_canvas = function() {
		return !!document.createElement('canvas').getContext;
	};

	features.supports_canvas_text = function() {
		if (!features.supports_canvas()) {
			return false;
		}
		var dummy_canvas = document.createElement('canvas');
		var context = dummy_canvas.getContext('2d');
		return typeof context.fillText === 'function';
	};

	features.supports_webgl = function() {
		var dummy_canvas = document.createElement('canvas');
		try {
			if (dummy_canvas.getContext('webgl')) {
				return true;
			}
			if (dummy_canvas.getContext('experimental-webgl')) {
				return true;
			}
		} catch (b) {
		}
		return false;
	};

	features.supports_xhr2 = function() {
		return q.support.cors;
	};

	features.supports_touch = function() {
		// check the mobile os so we don't interfere with hybrid pcs
		return 'ontouchstart' in window && navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|BB10/i);
	};

	features.supports_gesture = function() {
		return 'ongesturestart' in window;
	};

	return features;

})(ChemDoodle.iChemLabs, jQuery, document, window);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4459 $
//  $Author: kevin $
//  $LastChangedDate: 2013-08-06 14:09:43 -0400 (Tue, 06 Aug 2013) $
//

// all symbols
ChemDoodle.SYMBOLS = [ 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl',
		'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Uut', 'Uuq', 'Uup', 'Uuh', 'Uus', 'Uuo' ];

ChemDoodle.ELEMENT = (function(SYMBOLS) {
	'use strict';
	var E = [];

	function Element(symbol, name, atomicNumber, addH, color, covalentRadius, vdWRadius, valency, mass) {
		this.symbol = symbol;
		this.name = name;
		this.atomicNumber = atomicNumber;
		this.addH = addH;
		this.jmolColor = this.pymolColor = color;
		this.covalentRadius = covalentRadius;
		this.vdWRadius = vdWRadius;
		this.valency = valency;
		this.mass = mass;
	}

	E.H = new Element('H', 'Hydrogen', 1, false, '#FFFFFF', 0.31, 1.2, 1, 1);
	E.He = new Element('He', 'Helium', 2, false, '#D9FFFF', 0.28, 1.4, 0, 4);
	E.Li = new Element('Li', 'Lithium', 3, false, '#CC80FF', 1.28, 1.82, 1, 7);
	E.Be = new Element('Be', 'Beryllium', 4, false, '#C2FF00', 0.96, 0, 2, 9);
	E.B = new Element('B', 'Boron', 5, true, '#FFB5B5', 0.84, 0, 3, 11);
	E.C = new Element('C', 'Carbon', 6, true, '#909090', 0.76, 1.7, 4, 12);
	E.N = new Element('N', 'Nitrogen', 7, true, '#3050F8', 0.71, 1.55, 3, 14);
	E.O = new Element('O', 'Oxygen', 8, true, '#FF0D0D', 0.66, 1.52, 2, 16);
	E.F = new Element('F', 'Fluorine', 9, true, '#90E050', 0.57, 1.47, 1, 19);
	E.Ne = new Element('Ne', 'Neon', 10, false, '#B3E3F5', 0.58, 1.54, 0, 20);
	E.Na = new Element('Na', 'Sodium', 11, false, '#AB5CF2', 1.66, 2.27, 1, 23);
	E.Mg = new Element('Mg', 'Magnesium', 12, false, '#8AFF00', 1.41, 1.73, 0, 24);
	E.Al = new Element('Al', 'Aluminum', 13, false, '#BFA6A6', 1.21, 0, 0, 27);
	E.Si = new Element('Si', 'Silicon', 14, true, '#F0C8A0', 1.11, 2.1, 4, 28);
	E.P = new Element('P', 'Phosphorus', 15, true, '#FF8000', 1.07, 1.8, 3, 31);
	E.S = new Element('S', 'Sulfur', 16, true, '#FFFF30', 1.05, 1.8, 2, 32);
	E.Cl = new Element('Cl', 'Chlorine', 17, true, '#1FF01F', 1.02, 1.75, 1, 35);
	E.Ar = new Element('Ar', 'Argon', 18, false, '#80D1E3', 1.06, 1.88, 0, 40);
	E.K = new Element('K', 'Potassium', 19, false, '#8F40D4', 2.03, 2.75, 0, 39);
	E.Ca = new Element('Ca', 'Calcium', 20, false, '#3DFF00', 1.76, 0, 0, 40);
	E.Sc = new Element('Sc', 'Scandium', 21, false, '#E6E6E6', 1.7, 0, 0, 45);
	E.Ti = new Element('Ti', 'Titanium', 22, false, '#BFC2C7', 1.6, 0, 1, 48);
	E.V = new Element('V', 'Vanadium', 23, false, '#A6A6AB', 1.53, 0, 1, 51);
	E.Cr = new Element('Cr', 'Chromium', 24, false, '#8A99C7', 1.39, 0, 2, 52);
	E.Mn = new Element('Mn', 'Manganese', 25, false, '#9C7AC7', 1.39, 0, 3, 55);
	E.Fe = new Element('Fe', 'Iron', 26, false, '#E06633', 1.32, 0, 2, 56);
	E.Co = new Element('Co', 'Cobalt', 27, false, '#F090A0', 1.26, 0, 1, 59);
	E.Ni = new Element('Ni', 'Nickel', 28, false, '#50D050', 1.24, 1.63, 1, 58);
	E.Cu = new Element('Cu', 'Copper', 29, false, '#C88033', 1.32, 1.4, 0, 63);
	E.Zn = new Element('Zn', 'Zinc', 30, false, '#7D80B0', 1.22, 1.39, 0, 64);
	E.Ga = new Element('Ga', 'Gallium', 31, false, '#C28F8F', 1.22, 1.87, 0, 69);
	E.Ge = new Element('Ge', 'Germanium', 32, false, '#668F8F', 1.2, 0, 4, 74);
	E.As = new Element('As', 'Arsenic', 33, true, '#BD80E3', 1.19, 1.85, 3, 75);
	E.Se = new Element('Se', 'Selenium', 34, true, '#FFA100', 1.2, 1.9, 2, 80);
	E.Br = new Element('Br', 'Bromine', 35, true, '#A62929', 1.2, 1.85, 1, 79);
	E.Kr = new Element('Kr', 'Krypton', 36, false, '#5CB8D1', 1.16, 2.02, 0, 84);
	E.Rb = new Element('Rb', 'Rubidium', 37, false, '#702EB0', 2.2, 0, 0, 85);
	E.Sr = new Element('Sr', 'Strontium', 38, false, '#00FF00', 1.95, 0, 0, 88);
	E.Y = new Element('Y', 'Yttrium', 39, false, '#94FFFF', 1.9, 0, 0, 89);
	E.Zr = new Element('Zr', 'Zirconium', 40, false, '#94E0E0', 1.75, 0, 0, 90);
	E.Nb = new Element('Nb', 'Niobium', 41, false, '#73C2C9', 1.64, 0, 1, 93);
	E.Mo = new Element('Mo', 'Molybdenum', 42, false, '#54B5B5', 1.54, 0, 2, 98);
	E.Tc = new Element('Tc', 'Technetium', 43, false, '#3B9E9E', 1.47, 0, 3, 0);
	E.Ru = new Element('Ru', 'Ruthenium', 44, false, '#248F8F', 1.46, 0, 2, 102);
	E.Rh = new Element('Rh', 'Rhodium', 45, false, '#0A7D8C', 1.42, 0, 1, 103);
	E.Pd = new Element('Pd', 'Palladium', 46, false, '#006985', 1.39, 1.63, 0, 106);
	E.Ag = new Element('Ag', 'Silver', 47, false, '#C0C0C0', 1.45, 1.72, 0, 107);
	E.Cd = new Element('Cd', 'Cadmium', 48, false, '#FFD98F', 1.44, 1.58, 0, 114);
	E.In = new Element('In', 'Indium', 49, false, '#A67573', 1.42, 1.93, 0, 115);
	E.Sn = new Element('Sn', 'Tin', 50, false, '#668080', 1.39, 2.17, 4, 120);
	E.Sb = new Element('Sb', 'Antimony', 51, false, '#9E63B5', 1.39, 0, 3, 121);
	E.Te = new Element('Te', 'Tellurium', 52, true, '#D47A00', 1.38, 2.06, 2, 130);
	E.I = new Element('I', 'Iodine', 53, true, '#940094', 1.39, 1.98, 1, 127);
	E.Xe = new Element('Xe', 'Xenon', 54, false, '#429EB0', 1.4, 2.16, 0, 132);
	E.Cs = new Element('Cs', 'Cesium', 55, false, '#57178F', 2.44, 0, 0, 133);
	E.Ba = new Element('Ba', 'Barium', 56, false, '#00C900', 2.15, 0, 0, 138);
	E.La = new Element('La', 'Lanthanum', 57, false, '#70D4FF', 2.07, 0, 0, 139);
	E.Ce = new Element('Ce', 'Cerium', 58, false, '#FFFFC7', 2.04, 0, 0, 140);
	E.Pr = new Element('Pr', 'Praseodymium', 59, false, '#D9FFC7', 2.03, 0, 0, 141);
	E.Nd = new Element('Nd', 'Neodymium', 60, false, '#C7FFC7', 2.01, 0, 0, 142);
	E.Pm = new Element('Pm', 'Promethium', 61, false, '#A3FFC7', 1.99, 0, 0, 0);
	E.Sm = new Element('Sm', 'Samarium', 62, false, '#8FFFC7', 1.98, 0, 0, 152);
	E.Eu = new Element('Eu', 'Europium', 63, false, '#61FFC7', 1.98, 0, 0, 153);
	E.Gd = new Element('Gd', 'Gadolinium', 64, false, '#45FFC7', 1.96, 0, 0, 158);
	E.Tb = new Element('Tb', 'Terbium', 65, false, '#30FFC7', 1.94, 0, 0, 159);
	E.Dy = new Element('Dy', 'Dysprosium', 66, false, '#1FFFC7', 1.92, 0, 0, 164);
	E.Ho = new Element('Ho', 'Holmium', 67, false, '#00FF9C', 1.92, 0, 0, 165);
	E.Er = new Element('Er', 'Erbium', 68, false, '#00E675', 1.89, 0, 0, 166);
	E.Tm = new Element('Tm', 'Thulium', 69, false, '#00D452', 1.9, 0, 0, 169);
	E.Yb = new Element('Yb', 'Ytterbium', 70, false, '#00BF38', 1.87, 0, 0, 174);
	E.Lu = new Element('Lu', 'Lutetium', 71, false, '#00AB24', 1.87, 0, 0, 175);
	E.Hf = new Element('Hf', 'Hafnium', 72, false, '#4DC2FF', 1.75, 0, 0, 180);
	E.Ta = new Element('Ta', 'Tantalum', 73, false, '#4DA6FF', 1.7, 0, 1, 181);
	E.W = new Element('W', 'Tungsten', 74, false, '#2194D6', 1.62, 0, 2, 184);
	E.Re = new Element('Re', 'Rhenium', 75, false, '#267DAB', 1.51, 0, 3, 187);
	E.Os = new Element('Os', 'Osmium', 76, false, '#266696', 1.44, 0, 2, 192);
	E.Ir = new Element('Ir', 'Iridium', 77, false, '#175487', 1.41, 0, 3, 193);
	E.Pt = new Element('Pt', 'Platinum', 78, false, '#D0D0E0', 1.36, 1.75, 0, 195);
	E.Au = new Element('Au', 'Gold', 79, false, '#FFD123', 1.36, 1.66, 1, 197);
	E.Hg = new Element('Hg', 'Mercury', 80, false, '#B8B8D0', 1.32, 1.55, 0, 202);
	E.Tl = new Element('Tl', 'Thallium', 81, false, '#A6544D', 1.45, 1.96, 0, 205);
	E.Pb = new Element('Pb', 'Lead', 82, false, '#575961', 1.46, 2.02, 4, 208);
	E.Bi = new Element('Bi', 'Bismuth', 83, false, '#9E4FB5', 1.48, 0, 3, 209);
	E.Po = new Element('Po', 'Polonium', 84, false, '#AB5C00', 1.4, 0, 2, 0);
	E.At = new Element('At', 'Astatine', 85, true, '#754F45', 1.5, 0, 1, 0);
	E.Rn = new Element('Rn', 'Radon', 86, false, '#428296', 1.5, 0, 0, 0);
	E.Fr = new Element('Fr', 'Francium', 87, false, '#420066', 2.6, 0, 0, 0);
	E.Ra = new Element('Ra', 'Radium', 88, false, '#007D00', 2.21, 0, 0, 0);
	E.Ac = new Element('Ac', 'Actinium', 89, false, '#70ABFA', 2.15, 0, 0, 0);
	E.Th = new Element('Th', 'Thorium', 90, false, '#00BAFF', 2.06, 0, 0, 232);
	E.Pa = new Element('Pa', 'Protactinium', 91, false, '#00A1FF', 2, 0, 0, 231);
	E.U = new Element('U', 'Uranium', 92, false, '#008FFF', 1.96, 1.86, 0, 238);
	E.Np = new Element('Np', 'Neptunium', 93, false, '#0080FF', 1.9, 0, 0, 0);
	E.Pu = new Element('Pu', 'Plutonium', 94, false, '#006BFF', 1.87, 0, 0, 0);
	E.Am = new Element('Am', 'Americium', 95, false, '#545CF2', 1.8, 0, 0, 0);
	E.Cm = new Element('Cm', 'Curium', 96, false, '#785CE3', 1.69, 0, 0, 0);
	E.Bk = new Element('Bk', 'Berkelium', 97, false, '#8A4FE3', 0, 0, 0, 0);
	E.Cf = new Element('Cf', 'Californium', 98, false, '#A136D4', 0, 0, 0, 0);
	E.Es = new Element('Es', 'Einsteinium', 99, false, '#B31FD4', 0, 0, 0, 0);
	E.Fm = new Element('Fm', 'Fermium', 100, false, '#B31FBA', 0, 0, 0, 0);
	E.Md = new Element('Md', 'Mendelevium', 101, false, '#B30DA6', 0, 0, 0, 0);
	E.No = new Element('No', 'Nobelium', 102, false, '#BD0D87', 0, 0, 0, 0);
	E.Lr = new Element('Lr', 'Lawrencium', 103, false, '#C70066', 0, 0, 0, 0);
	E.Rf = new Element('Rf', 'Rutherfordium', 104, false, '#CC0059', 0, 0, 0, 0);
	E.Db = new Element('Db', 'Dubnium', 105, false, '#D1004F', 0, 0, 0, 0);
	E.Sg = new Element('Sg', 'Seaborgium', 106, false, '#D90045', 0, 0, 0, 0);
	E.Bh = new Element('Bh', 'Bohrium', 107, false, '#E00038', 0, 0, 0, 0);
	E.Hs = new Element('Hs', 'Hassium', 108, false, '#E6002E', 0, 0, 0, 0);
	E.Mt = new Element('Mt', 'Meitnerium', 109, false, '#EB0026', 0, 0, 0, 0);
	E.Ds = new Element('Ds', 'Darmstadtium', 110, false, '#000000', 0, 0, 0, 0);
	E.Rg = new Element('Rg', 'Roentgenium', 111, false, '#000000', 0, 0, 0, 0);
	E.Cn = new Element('Cn', 'Copernicium', 112, false, '#000000', 0, 0, 0, 0);
	E.Uut = new Element('Uut', 'Ununtrium', 113, false, '#000000', 0, 0, 0, 0);
	E.Uuq = new Element('Uuq', 'Ununquadium', 114, false, '#000000', 0, 0, 0, 0);
	E.Uup = new Element('Uup', 'Ununpentium', 115, false, '#000000', 0, 0, 0, 0);
	E.Uuh = new Element('Uuh', 'Ununhexium', 116, false, '#000000', 0, 0, 0, 0);
	E.Uus = new Element('Uus', 'Ununseptium', 117, false, '#000000', 0, 0, 0, 0);
	E.Uuo = new Element('Uuo', 'Ununoctium', 118, false, '#000000', 0, 0, 0, 0);

	E.H.pymolColor = '#E6E6E6';
	E.C.pymolColor = '#33FF33';
	E.N.pymolColor = '#3333FF';
	E.O.pymolColor = '#FF4D4D';
	E.F.pymolColor = '#B3FFFF';
	E.S.pymolColor = '#E6C640';

	return E;

})(ChemDoodle.SYMBOLS);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3008 $
//  $Author: kevin $
//  $LastChangedDate: 2011-01-07 21:28:00 -0500 (Fri, 07 Jan 2011) $
//
ChemDoodle.RESIDUE = (function() {
	'use strict';
	var R = [];

	function Residue(symbol, name, polar, aminoColor, shapelyColor) {
		this.symbol = symbol;
		this.name = name;
		this.polar = polar;
		this.aminoColor = aminoColor;
		this.shapelyColor = shapelyColor;
	}

	R.Ala = new Residue('Ala', 'Alanine', false, '#C8C8C8', '#8CFF8C');
	R.Arg = new Residue('Arg', 'Arginine', true, '#145AFF', '#00007C');
	R.Asn = new Residue('Asn', 'Asparagine', true, '#00DCDC', '#FF7C70');
	R.Asp = new Residue('Asp', 'Aspartic Acid', true, '#E60A0A', '#A00042');
	R.Cys = new Residue('Cys', 'Cysteine', true, '#E6E600', '#FFFF70');
	R.Gln = new Residue('Gln', 'Glutamine', true, '#00DCDC', '#FF4C4C');
	R.Glu = new Residue('Glu', 'Glutamic Acid', true, '#E60A0A', '#660000');
	R.Gly = new Residue('Gly', 'Glycine', false, '#EBEBEB', '#FFFFFF');
	R.His = new Residue('His', 'Histidine', true, '#8282D2', '#7070FF');
	R.Ile = new Residue('Ile', 'Isoleucine', false, '#0F820F', '#004C00');
	R.Leu = new Residue('Leu', 'Leucine', false, '#0F820F', '#455E45');
	R.Lys = new Residue('Lys', 'Lysine', true, '#145AFF', '#4747B8');
	R.Met = new Residue('Met', 'Methionine', false, '#E6E600', '#B8A042');
	R.Phe = new Residue('Phe', 'Phenylalanine', false, '#3232AA', '#534C52');
	R.Pro = new Residue('Pro', 'Proline', false, '#DC9682', '#525252');
	R.Ser = new Residue('Ser', 'Serine', true, '#FA9600', '#FF7042');
	R.Thr = new Residue('Thr', 'Threonine', true, '#FA9600', '#B84C00');
	R.Trp = new Residue('Trp', 'Tryptophan', true, '#B45AB4', '#4F4600');
	R.Tyr = new Residue('Tyr', 'Tyrosine', true, '#3232AA', '#8C704C');
	R.Val = new Residue('Val', 'Valine', false, '#0F820F', '#FF8CFF');
	R.Asx = new Residue('Asx', 'Asparagine/Aspartic Acid', true, '#FF69B4', '#FF00FF');
	R.Glx = new Residue('Glx', 'Glutamine/Glutamic Acid', true, '#FF69B4', '#FF00FF');
	R['*'] = new Residue('*', 'Other', false, '#BEA06E', '#FF00FF');
	R.A = new Residue('A', 'Adenine', false, '#BEA06E', '#A0A0FF');
	R.G = new Residue('G', 'Guanine', false, '#BEA06E', '#FF7070');
	R.I = new Residue('I', '', false, '#BEA06E', '#80FFFF');
	R.C = new Residue('C', 'Cytosine', false, '#BEA06E', '#FF8C4B');
	R.T = new Residue('T', 'Thymine', false, '#BEA06E', '#A0FFA0');
	R.U = new Residue('U', 'Uracil', false, '#BEA06E', '#FF8080');

	return R;

})();
//
//  Copyright 2006-2010 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(structures) {
	'use strict';
	/*
	 * Creates a new Queue. A Queue is a first-in-first-out (FIFO) data
	 * structure. Functions of the Queue object allow elements to be
	 * enthis.queued and dethis.queued, the first element to be obtained without
	 * dequeuing, and for the current size of the Queue and empty/non-empty
	 * status to be obtained.
	 */
	structures.Queue = function() {
		// the list of elements, initialised to the empty array
		this.queue = [];
	};
	var _ = structures.Queue.prototype;

	// the amount of space at the front of the this.queue, initialised to zero
	_.queueSpace = 0;

	/*
	 * Returns the size of this Queue. The size of a Queue is equal to the
	 * number of elements that have been enthis.queued minus the number of
	 * elements that have been dethis.queued.
	 */
	_.getSize = function() {

		// return the number of elements in the this.queue
		return this.queue.length - this.queueSpace;

	};

	/*
	 * Returns true if this Queue is empty, and false otherwise. A Queue is
	 * empty if the number of elements that have been enthis.queued equals the
	 * number of elements that have been dethis.queued.
	 */
	_.isEmpty = function() {

		// return true if the this.queue is empty, and false otherwise
		return this.queue.length === 0;

	};

	/*
	 * Enthis.queues the specified element in this Queue. The parameter is:
	 * 
	 * element - the element to enthis.queue
	 */
	_.enqueue = function(element) {
		this.queue.push(element);
	};

	/*
	 * Dethis.queues an element from this Queue. The oldest element in this
	 * Queue is removed and returned. If this Queue is empty then undefined is
	 * returned.
	 */
	_.dequeue = function() {

		// initialise the element to return to be undefined
		var element;

		// check whether the this.queue is empty
		if (this.queue.length) {

			// fetch the oldest element in the this.queue
			element = this.queue[this.queueSpace];

			// update the amount of space and check whether a shift should
			// occur
			if (++this.queueSpace * 2 >= this.queue.length) {

				// set the this.queue equal to the non-empty portion of the
				// this.queue
				this.queue = this.queue.slice(this.queueSpace);

				// reset the amount of space at the front of the this.queue
				this.queueSpace = 0;

			}

		}

		// return the removed element
		return element;

	};

	/*
	 * Returns the oldest element in this Queue. If this Queue is empty then
	 * undefined is returned. This function returns the same value as the
	 * dethis.queue function, but does not remove the returned element from this
	 * Queue.
	 */
	_.getOldestElement = function() {

		// initialise the element to return to be undefined
		var element;

		// if the this.queue is not element then fetch the oldest element in the
		// this.queue
		if (this.queue.length) {
			element = this.queue[this.queueSpace];
		}

		// return the oldest element
		return element;
	};

})(ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(structures, m) {
	'use strict';
	structures.Point = function(x, y) {
		this.x = x ? x : 0;
		this.y = y ? y : 0;
	};
	var _ = structures.Point.prototype;
	_.sub = function(p) {
		this.x -= p.x;
		this.y -= p.y;
	};
	_.add = function(p) {
		this.x += p.x;
		this.y += p.y;
	};
	_.distance = function(p) {
		var dx = p.x - this.x;
		var dy = p.y - this.y;
		return m.sqrt(dx * dx + dy * dy);
	};
	_.angleForStupidCanvasArcs = function(p) {
		var dx = p.x - this.x;
		var dy = p.y - this.y;
		var angle = 0;
		// Calculate angle
		if (dx === 0) {
			if (dy === 0) {
				angle = 0;
			} else if (dy > 0) {
				angle = m.PI / 2;
			} else {
				angle = 3 * m.PI / 2;
			}
		} else if (dy === 0) {
			if (dx > 0) {
				angle = 0;
			} else {
				angle = m.PI;
			}
		} else {
			if (dx < 0) {
				angle = m.atan(dy / dx) + m.PI;
			} else if (dy < 0) {
				angle = m.atan(dy / dx) + 2 * m.PI;
			} else {
				angle = m.atan(dy / dx);
			}
		}
		while (angle < 0) {
			angle += m.PI * 2;
		}
		angle = angle % (m.PI * 2);
		return angle;
	};
	_.angle = function(p) {
		// y is upside down to account for inverted canvas
		var dx = p.x - this.x;
		var dy = this.y - p.y;
		var angle = 0;
		// Calculate angle
		if (dx === 0) {
			if (dy === 0) {
				angle = 0;
			} else if (dy > 0) {
				angle = m.PI / 2;
			} else {
				angle = 3 * m.PI / 2;
			}
		} else if (dy === 0) {
			if (dx > 0) {
				angle = 0;
			} else {
				angle = m.PI;
			}
		} else {
			if (dx < 0) {
				angle = m.atan(dy / dx) + m.PI;
			} else if (dy < 0) {
				angle = m.atan(dy / dx) + 2 * m.PI;
			} else {
				angle = m.atan(dy / dx);
			}
		}
		while (angle < 0) {
			angle += m.PI * 2;
		}
		angle = angle % (m.PI * 2);
		return angle;
	};

})(ChemDoodle.structures, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4459 $
//  $Author: kevin $
//  $LastChangedDate: 2013-08-06 14:09:43 -0400 (Tue, 06 Aug 2013) $
//

(function(ELEMENT, extensions, math, structures, m, m4) {
	'use strict';
	structures.Atom = function(label, x, y, z) {
		this.label = label ? label.replace(/\s/g, '') : 'C';
		if (!ELEMENT[this.label]) {
			this.label = 'C';
		}
		this.x = x ? x : 0;
		this.y = y ? y : 0;
		this.z = z ? z : 0;
	};
	var _ = structures.Atom.prototype = new structures.Point(0, 0);
	_.charge = 0;
	_.numLonePair = 0;
	_.numRadical = 0;
	_.mass = -1;
	_.coordinationNumber = 0;
	_.bondNumber = 0;
	_.angleOfLeastInterference = 0;
	_.isHidden = false;
	_.altLabel = undefined;
	_.any = false;
	_.rgroup = -1;
	_.isLone = false;
	_.isHover = false;
	_.isSelected = false;
	_.add3D = function(p) {
		this.x += p.x;
		this.y += p.y;
		this.z += p.z;
	};
	_.sub3D = function(p) {
		this.x -= p.x;
		this.y -= p.y;
		this.z -= p.z;
	};
	_.distance3D = function(p) {
		var dx = p.x - this.x;
		var dy = p.y - this.y;
		var dz = p.z - this.z;
		return m.sqrt(dx * dx + dy * dy + dz * dz);
	};
	_.draw = function(ctx, specs) {
		if (this.isLassoed) {
			var grd = ctx.createRadialGradient(this.x - 1, this.y - 1, 0, this.x, this.y, 7);
			grd.addColorStop(0, 'rgba(212, 99, 0, 0)');
			grd.addColorStop(0.7, 'rgba(212, 99, 0, 0.8)');
			ctx.fillStyle = grd;
			ctx.beginPath();
			ctx.arc(this.x, this.y, 5, 0, m.PI * 2, false);
			ctx.fill();
		}
		this.textBounds = [];
		if (this.specs) {
			specs = this.specs;
		}
		var font = extensions.getFontString(specs.atoms_font_size_2D, specs.atoms_font_families_2D, specs.atoms_font_bold_2D, specs.atoms_font_italic_2D);
		ctx.font = font;
		ctx.fillStyle = this.getElementColor(specs.atoms_useJMOLColors, specs.atoms_usePYMOLColors, specs.atoms_color, 2);
		var hAngle;
		if (this.isLone && !specs.atoms_displayAllCarbonLabels_2D || specs.atoms_circles_2D) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, specs.atoms_circleDiameter_2D / 2, 0, m.PI * 2, false);
			ctx.fill();
			if (specs.atoms_circleBorderWidth_2D > 0) {
				ctx.lineWidth = specs.atoms_circleBorderWidth_2D;
				ctx.strokeStyle = 'black';
				ctx.stroke(this.x, this.y, 0, m.PI * 2, specs.atoms_circleDiameter_2D / 2);
			}
		} else if (this.isLabelVisible(specs)) {
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			// keep check to undefined here as dev may set altLabel to empty
			// string
			if (this.altLabel !== undefined) {
				// altLabel can be 0, so check if undefined
				ctx.fillText(this.altLabel, this.x, this.y);
				var symbolWidth = ctx.measureText(this.altLabel).width;
				this.textBounds.push({
					x : this.x - symbolWidth / 2,
					y : this.y - specs.atoms_font_size_2D / 2 + 1,
					w : symbolWidth,
					h : specs.atoms_font_size_2D - 2
				});
			} else if (this.any) {
				ctx.font = extensions.getFontString(specs.atoms_font_size_2D + 5, specs.atoms_font_families_2D, true);
				ctx.fillText('*', this.x + 1, this.y + 3);
				var symbolWidth = ctx.measureText('*').width;
				this.textBounds.push({
					x : this.x - symbolWidth / 2,
					y : this.y - specs.atoms_font_size_2D / 2 + 1,
					w : symbolWidth,
					h : specs.atoms_font_size_2D - 2
				});
			} else if (this.rgroup !== -1) {
				var rlabel = 'R' + this.rgroup;
				ctx.fillText(rlabel, this.x, this.y);
				var symbolWidth = ctx.measureText(rlabel).width;
				this.textBounds.push({
					x : this.x - symbolWidth / 2,
					y : this.y - specs.atoms_font_size_2D / 2 + 1,
					w : symbolWidth,
					h : specs.atoms_font_size_2D - 2
				});
			} else {
				ctx.fillText(this.label, this.x, this.y);
				var symbolWidth = ctx.measureText(this.label).width;
				this.textBounds.push({
					x : this.x - symbolWidth / 2,
					y : this.y - specs.atoms_font_size_2D / 2 + 1,
					w : symbolWidth,
					h : specs.atoms_font_size_2D - 2
				});
				// mass
				var massWidth = 0;
				if (this.mass !== -1) {
					var subFont = extensions.getFontString(specs.atoms_font_size_2D * .7, specs.atoms_font_families_2D, specs.atoms_font_bold_2D, specs.atoms_font_italic_2D);
					var fontSave = ctx.font;
					ctx.font = extensions.getFontString(specs.atoms_font_size_2D * .7, specs.atoms_font_families_2D, specs.atoms_font_bold_2D, specs.atoms_font_italic_2D);
					massWidth = ctx.measureText(this.mass).width;
					ctx.fillText(this.mass, this.x - massWidth - .5, this.y - specs.atoms_font_size_2D / 2 + 1);
					this.textBounds.push({
						x : this.x - symbolWidth / 2 - massWidth - .5,
						y : this.y - (specs.atoms_font_size_2D * 1.7) / 2 + 1,
						w : massWidth,
						h : specs.atoms_font_size_2D / 2 - 1
					});
					ctx.font = fontSave;
				}
				// implicit hydrogens
				var chargeOffset = symbolWidth / 2;
				var numHs = this.getImplicitHydrogenCount();
				if (specs.atoms_implicitHydrogens_2D && numHs > 0) {
					hAngle = 0;
					var hWidth = ctx.measureText('H').width;
					var moveCharge = true;
					if (numHs > 1) {
						var xoffset = symbolWidth / 2 + hWidth / 2;
						var yoffset = 0;
						var subFont = extensions.getFontString(specs.atoms_font_size_2D * .8, specs.atoms_font_families_2D, specs.atoms_font_bold_2D, specs.atoms_font_italic_2D);
						ctx.font = subFont;
						var numWidth = ctx.measureText(numHs).width;
						if (this.bondNumber === 1) {
							if (this.angleOfLeastInterference > m.PI / 2 && this.angleOfLeastInterference < 3 * m.PI / 2) {
								xoffset = -symbolWidth / 2 - numWidth - hWidth / 2 - massWidth / 2;
								moveCharge = false;
								hAngle = m.PI;
							}
						} else {
							if (this.angleOfLeastInterference <= m.PI / 4) {
								// default
							} else if (this.angleOfLeastInterference < 3 * m.PI / 4) {
								xoffset = 0;
								yoffset = -specs.atoms_font_size_2D * .9;
								if (this.charge !== 0) {
									yoffset -= specs.atoms_font_size_2D * .3;
								}
								moveCharge = false;
								hAngle = m.PI / 2;
							} else if (this.angleOfLeastInterference <= 5 * m.PI / 4) {
								xoffset = -symbolWidth / 2 - numWidth - hWidth / 2 - massWidth / 2;
								moveCharge = false;
								hAngle = m.PI;
							} else if (this.angleOfLeastInterference < 7 * m.PI / 4) {
								xoffset = 0;
								yoffset = specs.atoms_font_size_2D * .9;
								moveCharge = false;
								hAngle = 3 * m.PI / 2;
							}
						}
						ctx.font = font;
						ctx.fillText('H', this.x + xoffset, this.y + yoffset);
						ctx.font = subFont;
						ctx.fillText(numHs, this.x + xoffset + hWidth / 2 + numWidth / 2, this.y + yoffset + specs.atoms_font_size_2D * .3);
						this.textBounds.push({
							x : this.x + xoffset - hWidth / 2,
							y : this.y + yoffset - specs.atoms_font_size_2D / 2 + 1,
							w : hWidth,
							h : specs.atoms_font_size_2D - 2
						});
						this.textBounds.push({
							x : this.x + xoffset + hWidth / 2,
							y : this.y + yoffset + specs.atoms_font_size_2D * .3 - specs.atoms_font_size_2D / 2 + 1,
							w : numWidth,
							h : specs.atoms_font_size_2D * .8 - 2
						});
					} else {
						var xoffset = symbolWidth / 2 + hWidth / 2;
						var yoffset = 0;
						if (this.bondNumber === 1) {
							if (this.angleOfLeastInterference > m.PI / 2 && this.angleOfLeastInterference < 3 * m.PI / 2) {
								xoffset = -symbolWidth / 2 - hWidth / 2 - massWidth / 2;
								hAngle = m.PI;
							}
						} else {
							if (this.angleOfLeastInterference <= m.PI / 4) {
								// default
							} else if (this.angleOfLeastInterference < 3 * m.PI / 4) {
								xoffset = 0;
								yoffset = -specs.atoms_font_size_2D * .9;
								moveCharge = false;
								hAngle = m.PI / 2;
							} else if (this.angleOfLeastInterference <= 5 * m.PI / 4) {
								xoffset = -symbolWidth / 2 - hWidth / 2 - massWidth / 2;
								moveCharge = false;
								hAngle = m.PI;
							} else if (this.angleOfLeastInterference < 7 * m.PI / 4) {
								xoffset = 0;
								yoffset = specs.atoms_font_size_2D * .9;
								moveCharge = false;
								hAngle = 3 * m.PI / 2;
							}
						}
						ctx.fillText('H', this.x + xoffset, this.y + yoffset);
						this.textBounds.push({
							x : this.x + xoffset - hWidth / 2,
							y : this.y + yoffset - specs.atoms_font_size_2D / 2 + 1,
							w : hWidth,
							h : specs.atoms_font_size_2D - 2
						});
					}
					if (moveCharge) {
						chargeOffset += hWidth;
					}
					// adjust the angles metadata to account for hydrogen
					// placement
					/*
					 * this.angles.push(hAngle); var angleData =
					 * math.angleBetweenLargest(this.angles);
					 * this.angleOfLeastInterference = angleData.angle % (m.PI *
					 * 2); this.largestAngle = angleData.largest;
					 */
				}
				// charge
				if (this.charge !== 0) {
					var s = this.charge.toFixed(0);
					if (s === '1') {
						s = '+';
					} else if (s === '-1') {
						s = '\u2013';
					} else if (extensions.stringStartsWith(s, '-')) {
						s = s.substring(1) + '\u2013';
					} else {
						s += '+';
					}
					var chargeWidth = ctx.measureText(s).width;
					chargeOffset += chargeWidth / 2;
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.font = extensions.getFontString(m.floor(specs.atoms_font_size_2D * .8), specs.atoms_font_families_2D, specs.atoms_font_bold_2D, specs.atoms_font_italic_2D);
					ctx.fillText(s, this.x + chargeOffset - 1, this.y - specs.atoms_font_size_2D / 2 + 1);
					this.textBounds.push({
						x : this.x + chargeOffset - chargeWidth / 2 - 1,
						y : this.y - (specs.atoms_font_size_2D * 1.8) / 2 + 5,
						w : chargeWidth,
						h : specs.atoms_font_size_2D / 2 - 1
					});
				}
			}
		}
		if (this.numLonePair > 0 || this.numRadical > 0) {
			ctx.fillStyle = 'black';
			var as = this.angles.slice(0);
			var ali = this.angleOfLeastInterference;
			var la = this.largestAngle;
			if (hAngle !== undefined) {
				// have to check for undefined here as this number can be 0
				as.push(hAngle);
				as.sort();
				var angleData = math.angleBetweenLargest(as);
				ali = angleData.angle % (m.PI * 2);
				la = angleData.largest;
			}
			var things = [];
			for ( var i = 0; i < this.numLonePair; i++) {
				things.push({
					t : 2
				});
			}
			for ( var i = 0; i < this.numRadical; i++) {
				things.push({
					t : 1
				});
			}
			if (hAngle === undefined && m.abs(la - 2 * m.PI / as.length) < m.PI / 60) {
				var mid = m.ceil(things.length / as.length);
				for ( var i = 0, ii = things.length; i < ii; i += mid, ali += la) {
					this.drawElectrons(ctx, specs, things.slice(i, m.min(things.length, i + mid)), ali, la, hAngle);
				}
			} else {
				this.drawElectrons(ctx, specs, things, ali, la, hAngle);
			}
		}
		// for debugging atom label dimensions
		// ctx.strokeStyle = 'red'; for(var i = 0, ii =
		// this.textBounds.length;i<ii; i++){ var r = this.textBounds[i];
		// ctx.beginPath();ctx.rect(r.x, r.y, r.w, r.h); ctx.stroke(); }

	};
	_.drawElectrons = function(ctx, specs, things, angle, largest, hAngle) {
		var segment = largest / (things.length + (this.bonds.length === 0 && hAngle === undefined ? 0 : 1));
		var angleStart = angle - largest / 2 + segment;
		for ( var i = 0; i < things.length; i++) {
			var t = things[i];
			var angle = angleStart + i * segment;
			var p1x = this.x + Math.cos(angle) * specs.atoms_lonePairDistance_2D;
			var p1y = this.y - Math.sin(angle) * specs.atoms_lonePairDistance_2D;
			if (t.t === 2) {
				var perp = angle + Math.PI / 2;
				var difx = Math.cos(perp) * specs.atoms_lonePairSpread_2D / 2;
				var dify = -Math.sin(perp) * specs.atoms_lonePairSpread_2D / 2;
				ctx.beginPath();
				ctx.arc(p1x + difx, p1y + dify, specs.atoms_lonePairDiameter_2D, 0, m.PI * 2, false);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(p1x - difx, p1y - dify, specs.atoms_lonePairDiameter_2D, 0, m.PI * 2, false);
				ctx.fill();
			} else if (t.t === 1) {
				ctx.beginPath();
				ctx.arc(p1x, p1y, specs.atoms_lonePairDiameter_2D, 0, m.PI * 2, false);
				ctx.fill();
			}
		}
	};
	_.drawDecorations = function(ctx) {
		if (this.isHover || this.isSelected) {
			ctx.strokeStyle = this.isHover ? '#885110' : '#0060B2';
			ctx.lineWidth = 1.2;
			ctx.beginPath();
			var radius = this.isHover ? 7 : 15;
			ctx.arc(this.x, this.y, radius, 0, m.PI * 2, false);
			ctx.stroke();
		}
		if (this.isOverlap) {
			ctx.strokeStyle = '#C10000';
			ctx.lineWidth = 1.2;
			ctx.beginPath();
			ctx.arc(this.x, this.y, 7, 0, m.PI * 2, false);
			ctx.stroke();
		}
	};
	_.render = function(gl, specs, noColor) {
		if (this.specs) {
			specs = this.specs;
		}
		var transform = m4.translate(gl.modelViewMatrix, [ this.x, this.y, this.z ], []);
		var radius = specs.atoms_useVDWDiameters_3D ? ELEMENT[this.label].vdWRadius * specs.atoms_vdwMultiplier_3D : specs.atoms_sphereDiameter_3D / 2;
		if (radius === 0) {
			radius = 1;
		}
		m4.scale(transform, [ radius, radius, radius ]);

		// colors
		if (!noColor) {
			var color = specs.atoms_color;
			if (specs.atoms_useJMOLColors) {
				color = ELEMENT[this.label].jmolColor;
			} else if (specs.atoms_usePYMOLColors) {
				color = ELEMENT[this.label].pymolColor;
			}
			gl.material.setDiffuseColor(color);
		}

		// render
		gl.setMatrixUniforms(transform);
		var buffer = this.renderAsStar ? gl.starBuffer : gl.sphereBuffer;
		gl.drawElements(gl.TRIANGLES, buffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	};
	_.isLabelVisible = function(specs) {
		if (specs.atoms_displayAllCarbonLabels_2D) {
			// show all carbons
			return true;
		}
		if (this.label !== 'C') {
			// not a carbon
			return true;
		}
		if (this.altLabel) {
			// there is an alternative label
			return true;
		}
		if (this.any || this.rgroup !== -1) {
			// this is a query atom
			return true;
		}
		if (this.mass !== -1 || this.charge !== 0) {
			// an isotope or charge designation, so label must be shown
			return true;
		}
		if (specs.atoms_showAttributedCarbons_2D && (this.numRadical !== 0 || this.numLonePair !== 0)) {
			// there are attributes and we want to show the associated label
			return true;
		}
		if (this.isHidden && specs.atoms_showHiddenCarbons_2D) {
			// if it is hidden and we want to show them
			return true;
		}
		if (specs.atoms_displayTerminalCarbonLabels_2D && this.bondNumber === 1) {
			// if it is terminal and we want to show them
			return true;
		}
		return false;
	};
	_.getImplicitHydrogenCount = function() {
		if (this.label === 'H' || !ELEMENT[this.label] || !ELEMENT[this.label].addH) {
			return 0;
		}
		var valence = ELEMENT[this.label].valency;
		var dif = valence - this.coordinationNumber;
		if (this.numRadical > 0) {
			dif = m.max(0, dif - this.numRadical);
		}
		if (this.charge > 0) {
			var vdif = 4 - valence;
			if (this.charge <= vdif) {
				dif += this.charge;
			} else {
				dif = 4 - this.coordinationNumber - this.charge + vdif;
			}
		} else {
			dif += this.charge;
		}
		return dif < 0 ? 0 : m.floor(dif);
	};
	_.getBounds = function() {
		var bounds = new math.Bounds();
		bounds.expand(this.x, this.y);
		if (this.textBounds) {
			for ( var i = 0, ii = this.textBounds.length; i < ii; i++) {
				var tb = this.textBounds[i];
				bounds.expand(tb.x, tb.y, tb.x + tb.w, tb.y + tb.h);
			}
		}
		return bounds;
	};
	_.getBounds3D = function() {
		var bounds = new math.Bounds();
		bounds.expand3D(this.x, this.y, this.z);
		return bounds;
	};
	/**
	 * Get Color by atom element.
	 *
	 * @param {boolean} useJMOLColors
	 * @param {boolean} usePYMOLColors
	 * @param {string} color The default color
	 * @param {number} dim The render dimension
	 * @return {string} The atom element color
	 */
	_.getElementColor = function(useJMOLColors, usePYMOLColors, color, dim) {
		if(dim==2 && this.any || this.rgroup !== -1){
			return color;
		}
		if (useJMOLColors) {
			color = ELEMENT[this.label].jmolColor;
		} else if (usePYMOLColors) {
			color = ELEMENT[this.label].pymolColor;
		}
		return color;
	};
	
})(ChemDoodle.ELEMENT, ChemDoodle.extensions, ChemDoodle.math, ChemDoodle.structures, Math, mat4);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4500 $
//  $Author: kevin $
//  $LastChangedDate: 2013-09-06 14:28:15 -0400 (Fri, 06 Sep 2013) $
//

(function(ELEMENT, extensions, structures, math, m, m4, v3) {
	'use strict';
	structures.Bond = function(a1, a2, bondOrder) {
		this.a1 = a1;
		this.a2 = a2;
		// bondOrder can be 0, so need to check against undefined
		this.bondOrder = bondOrder !== undefined ? bondOrder : 1;
	};
	structures.Bond.STEREO_NONE = 'none';
	structures.Bond.STEREO_PROTRUDING = 'protruding';
	structures.Bond.STEREO_RECESSED = 'recessed';
	structures.Bond.STEREO_AMBIGUOUS = 'ambiguous';
	var _ = structures.Bond.prototype;
	_.stereo = structures.Bond.STEREO_NONE;
	_.isHover = false;
	_.ring = undefined;
	_.getCenter = function() {
		return new structures.Point((this.a1.x + this.a2.x) / 2, (this.a1.y + this.a2.y) / 2);
	};
	_.getLength = function() {
		return this.a1.distance(this.a2);
	};
	_.getLength3D = function() {
		return this.a1.distance3D(this.a2);
	};
	_.contains = function(a) {
		return a === this.a1 || a === this.a2;
	};
	_.getNeighbor = function(a) {
		if (a === this.a1) {
			return this.a2;
		} else if (a === this.a2) {
			return this.a1;
		}
		return undefined;
	};
	_.draw = function(ctx, specs) {
		if (this.a1.x === this.a2.x && this.a1.y === this.a2.y) {
			// return, as there is nothing to render, will only cause fill
			// overflows
			return;
		}
		if (this.specs) {
			specs = this.specs;
		}
		var x1 = this.a1.x;
		var x2 = this.a2.x;
		var y1 = this.a1.y;
		var y2 = this.a2.y;
		var dist = this.a1.distance(this.a2);
		var difX = x2 - x1;
		var difY = y2 - y1;
		if (this.a1.isLassoed && this.a2.isLassoed) {
			var grd = ctx.createLinearGradient(x1, y1, x2, y2);
			grd.addColorStop(0, 'rgba(212, 99, 0, 0)');
			grd.addColorStop(0.5, 'rgba(212, 99, 0, 0.8)');
			grd.addColorStop(1, 'rgba(212, 99, 0, 0)');
			var useDist = 2.5;
			var perpendicular = this.a1.angle(this.a2) + m.PI / 2;
			var mcosp = m.cos(perpendicular);
			var msinp = m.sin(perpendicular);
			var cx1 = x1 - mcosp * useDist;
			var cy1 = y1 + msinp * useDist;
			var cx2 = x1 + mcosp * useDist;
			var cy2 = y1 - msinp * useDist;
			var cx3 = x2 + mcosp * useDist;
			var cy3 = y2 - msinp * useDist;
			var cx4 = x2 - mcosp * useDist;
			var cy4 = y2 + msinp * useDist;
			ctx.fillStyle = grd;
			ctx.beginPath();
			ctx.moveTo(cx1, cy1);
			ctx.lineTo(cx2, cy2);
			ctx.lineTo(cx3, cy3);
			ctx.lineTo(cx4, cy4);
			ctx.closePath();
			ctx.fill();
		}
		if (specs.atoms_display && !specs.atoms_circles_2D && this.a1.isLabelVisible(specs) && this.a1.textBounds) {
			var distShrink = 0;
			for ( var i = 0, ii = this.a1.textBounds.length; i < ii; i++) {
				distShrink = Math.max(distShrink, math.calculateDistanceInterior(this.a1, this.a2, this.a1.textBounds[i]));
			}
			distShrink += specs.bonds_atomLabelBuffer_2D;
			var perc = distShrink / dist;
			x1 += difX * perc;
			y1 += difY * perc;
		}
		if (specs.atoms_display && !specs.atoms_circles_2D && this.a2.isLabelVisible(specs) && this.a2.textBounds) {
			var distShrink = 0;
			for ( var i = 0, ii = this.a2.textBounds.length; i < ii; i++) {
				distShrink = Math.max(distShrink, math.calculateDistanceInterior(this.a2, this.a1, this.a2.textBounds[i]));
			}
			distShrink += specs.bonds_atomLabelBuffer_2D;
			var perc = distShrink / dist;
			x2 -= difX * perc;
			y2 -= difY * perc;
		}
		if (specs.bonds_clearOverlaps_2D) {
			var xs = x1 + difX * .15;
			var ys = y1 + difY * .15;
			var xf = x2 - difX * .15;
			var yf = y2 - difY * .15;
			ctx.strokeStyle = specs.backgroundColor;
			ctx.lineWidth = specs.bonds_width_2D + specs.bonds_overlapClearWidth_2D * 2;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(xs, ys);
			ctx.lineTo(xf, yf);
			ctx.closePath();
			ctx.stroke();
		}
		ctx.strokeStyle = specs.bonds_color;
		ctx.fillStyle = specs.bonds_color;
		ctx.lineWidth = specs.bonds_width_2D;
		ctx.lineCap = specs.bonds_ends_2D;
		if (specs.bonds_useJMOLColors || specs.bonds_usePYMOLColors) {
			var linearGradient = ctx.createLinearGradient(x1, y1, x2, y2);
			var color1 = this.a1.getElementColor(specs.bonds_useJMOLColors, specs.bonds_usePYMOLColors, specs.atoms_color, 2);
			var color2 = this.a2.getElementColor(specs.bonds_useJMOLColors, specs.bonds_usePYMOLColors, specs.atoms_color, 2);
			linearGradient.addColorStop(0, color1);
			if (!specs.bonds_colorGradient) {
				linearGradient.addColorStop(0.5, color1);
				linearGradient.addColorStop(0.51, color2);
			}
			linearGradient.addColorStop(1, color2);
			ctx.strokeStyle = linearGradient;
			ctx.fillStyle = linearGradient;
		}
		switch (this.bondOrder) {
		case 0:
			var dx = x2 - x1;
			var dy = y2 - y1;
			var innerDist = m.sqrt(dx * dx + dy * dy);
			var num = m.floor(innerDist / specs.bonds_dotSize_2D);
			var remainder = (innerDist - (num - 1) * specs.bonds_dotSize_2D) / 2;
			if (num % 2 === 1) {
				remainder += specs.bonds_dotSize_2D / 4;
			} else {
				remainder -= specs.bonds_dotSize_2D / 4;
				num += 2;
			}
			num /= 2;
			var angle = this.a1.angle(this.a2);
			var xs = x1 + remainder * Math.cos(angle);
			var ys = y1 - remainder * Math.sin(angle);
			ctx.beginPath();
			for ( var i = 0; i < num; i++) {
				ctx.arc(xs, ys, specs.bonds_dotSize_2D / 2, 0, m.PI * 2, false);
				xs += 2 * specs.bonds_dotSize_2D * Math.cos(angle);
				ys -= 2 * specs.bonds_dotSize_2D * Math.sin(angle);
			}
			ctx.fill();
			break;
		case 0.5:
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			extensions.contextHashTo(ctx, x1, y1, x2, y2, specs.bonds_hashSpacing_2D, specs.bonds_hashSpacing_2D);
			ctx.stroke();
			break;
		case 1:
			if (this.stereo === structures.Bond.STEREO_PROTRUDING || this.stereo === structures.Bond.STEREO_RECESSED) {
				var thinSpread = specs.bonds_width_2D / 2;
				var useDist = this.a1.distance(this.a2) * specs.bonds_wedgeThickness_2D / 2;
				var perpendicular = this.a1.angle(this.a2) + m.PI / 2;
				var mcosp = m.cos(perpendicular);
				var msinp = m.sin(perpendicular);
				var cx1 = x1 - mcosp * thinSpread;
				var cy1 = y1 + msinp * thinSpread;
				var cx2 = x1 + mcosp * thinSpread;
				var cy2 = y1 - msinp * thinSpread;
				var cx3 = x2 + mcosp * useDist;
				var cy3 = y2 - msinp * useDist;
				var cx4 = x2 - mcosp * useDist;
				var cy4 = y2 + msinp * useDist;
				ctx.beginPath();
				ctx.moveTo(cx1, cy1);
				ctx.lineTo(cx2, cy2);
				ctx.lineTo(cx3, cy3);
				ctx.lineTo(cx4, cy4);
				ctx.closePath();
				if (this.stereo === structures.Bond.STEREO_PROTRUDING) {
					ctx.fill();
				} else {
					ctx.save();
					ctx.clip();
					ctx.lineWidth = useDist * 2;
					ctx.lineCap = 'butt';
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					extensions.contextHashTo(ctx, x1, y1, x2, y2, specs.bonds_hashWidth_2D, specs.bonds_hashSpacing_2D);
					ctx.stroke();
					ctx.restore();
				}
			} else if (this.stereo === structures.Bond.STEREO_AMBIGUOUS) {
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				var curves = m.floor(m.sqrt(difX * difX + difY * difY) / specs.bonds_wavyLength_2D);
				var x = x1;
				var y = y1;
				var perpendicular = this.a1.angle(this.a2) + m.PI / 2;
				var mcosp = m.cos(perpendicular);
				var msinp = m.sin(perpendicular);

				var curveX = difX / curves;
				var curveY = difY / curves;
				var cpx1, cpx2, cpy1, cpy2;
				for ( var i = 0, ii = curves; i < ii; i++) {
					x += curveX;
					y += curveY;
					cpx1 = specs.bonds_wavyLength_2D * mcosp + x - curveX * 0.5;
					cpy1 = specs.bonds_wavyLength_2D * -msinp + y - curveY * 0.5;
					cpx2 = specs.bonds_wavyLength_2D * -mcosp + x - curveX * 0.5;
					cpy2 = specs.bonds_wavyLength_2D * msinp + y - curveY * 0.5;
					if (i % 2 === 0) {
						ctx.quadraticCurveTo(cpx1, cpy1, x, y);
					} else {
						ctx.quadraticCurveTo(cpx2, cpy2, x, y);
					}
				}
				ctx.stroke();
				break;
			} else {
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.stroke();
			}
			break;
		case 1.5:
		case 2:
			if (this.stereo === structures.Bond.STEREO_AMBIGUOUS) {
				var useDist = this.a1.distance(this.a2) * specs.bonds_saturationWidth_2D / 2;
				var perpendicular = this.a1.angle(this.a2) + m.PI / 2;
				var mcosp = m.cos(perpendicular);
				var msinp = m.sin(perpendicular);
				var cx1 = x1 - mcosp * useDist;
				var cy1 = y1 + msinp * useDist;
				var cx2 = x1 + mcosp * useDist;
				var cy2 = y1 - msinp * useDist;
				var cx3 = x2 + mcosp * useDist;
				var cy3 = y2 - msinp * useDist;
				var cx4 = x2 - mcosp * useDist;
				var cy4 = y2 + msinp * useDist;
				ctx.beginPath();
				ctx.moveTo(cx1, cy1);
				ctx.lineTo(cx3, cy3);
				ctx.moveTo(cx2, cy2);
				ctx.lineTo(cx4, cy4);
				ctx.stroke();
			} else if (!specs.bonds_symmetrical_2D && (this.ring || this.a1.label === 'C' && this.a2.label === 'C')) {
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				var clip = 0;
				var dist = this.a1.distance(this.a2);
				var angle = this.a1.angle(this.a2);
				var perpendicular = angle + m.PI / 2;
				var useDist = dist * specs.bonds_saturationWidth_2D;
				var clipAngle = specs.bonds_saturationAngle_2D;
				if (clipAngle < m.PI / 2) {
					clip = -(useDist / m.tan(clipAngle));
				}
				if (m.abs(clip) < dist / 2) {
					var xuse1 = x1 - m.cos(angle) * clip;
					var xuse2 = x2 + m.cos(angle) * clip;
					var yuse1 = y1 + m.sin(angle) * clip;
					var yuse2 = y2 - m.sin(angle) * clip;
					var mcosp = m.cos(perpendicular);
					var msinp = m.sin(perpendicular);
					var cx1 = xuse1 - mcosp * useDist;
					var cy1 = yuse1 + msinp * useDist;
					var cx2 = xuse1 + mcosp * useDist;
					var cy2 = yuse1 - msinp * useDist;
					var cx3 = xuse2 - mcosp * useDist;
					var cy3 = yuse2 + msinp * useDist;
					var cx4 = xuse2 + mcosp * useDist;
					var cy4 = yuse2 - msinp * useDist;
					var flip = !this.ring || (this.ring.center.angle(this.a1) > this.ring.center.angle(this.a2) && !(this.ring.center.angle(this.a1) - this.ring.center.angle(this.a2) > m.PI) || (this.ring.center.angle(this.a1) - this.ring.center.angle(this.a2) < -m.PI));
					if (flip) {
						ctx.moveTo(cx1, cy1);
						if (this.bondOrder === 2) {
							ctx.lineTo(cx3, cy3);
						} else {
							extensions.contextHashTo(ctx, cx1, cy1, cx3, cy3, specs.bonds_hashSpacing_2D, specs.bonds_hashSpacing_2D);
						}
					} else {
						ctx.moveTo(cx2, cy2);
						if (this.bondOrder === 2) {
							ctx.lineTo(cx4, cy4);
						} else {
							extensions.contextHashTo(ctx, cx2, cy2, cx4, cy4, specs.bonds_hashSpacing_2D, specs.bonds_hashSpacing_2D);
						}
					}
					ctx.stroke();
				}
			} else {
				var useDist = this.a1.distance(this.a2) * specs.bonds_saturationWidth_2D / 2;
				var perpendicular = this.a1.angle(this.a2) + m.PI / 2;
				var mcosp = m.cos(perpendicular);
				var msinp = m.sin(perpendicular);
				var cx1 = x1 - mcosp * useDist;
				var cy1 = y1 + msinp * useDist;
				var cx2 = x1 + mcosp * useDist;
				var cy2 = y1 - msinp * useDist;
				var cx3 = x2 + mcosp * useDist;
				var cy3 = y2 - msinp * useDist;
				var cx4 = x2 - mcosp * useDist;
				var cy4 = y2 + msinp * useDist;
				ctx.beginPath();
				ctx.moveTo(cx1, cy1);
				ctx.lineTo(cx4, cy4);
				ctx.moveTo(cx2, cy2);
				if (this.bondOrder === 2) {
					ctx.lineTo(cx3, cy3);
				} else {
					extensions.contextHashTo(ctx, cx2, cy2, cx3, cy3, specs.bonds_hashSpacing_2D, specs.bonds_hashSpacing_2D);
				}
				ctx.stroke();
			}
			break;
		case 3:
			var useDist = this.a1.distance(this.a2) * specs.bonds_saturationWidth_2D;
			var perpendicular = this.a1.angle(this.a2) + m.PI / 2;
			var mcosp = m.cos(perpendicular);
			var msinp = m.sin(perpendicular);
			var cx1 = x1 - mcosp * useDist;
			var cy1 = y1 + msinp * useDist;
			var cx2 = x1 + mcosp * useDist;
			var cy2 = y1 - msinp * useDist;
			var cx3 = x2 + mcosp * useDist;
			var cy3 = y2 - msinp * useDist;
			var cx4 = x2 - mcosp * useDist;
			var cy4 = y2 + msinp * useDist;
			ctx.beginPath();
			ctx.moveTo(cx1, cy1);
			ctx.lineTo(cx4, cy4);
			ctx.moveTo(cx2, cy2);
			ctx.lineTo(cx3, cy3);
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			break;
		}
	};
	_.drawDecorations = function(ctx) {
		if (this.isHover || this.isSelected) {
			var pi2 = 2 * m.PI;
			var angle = (this.a1.angleForStupidCanvasArcs(this.a2) + m.PI / 2) % pi2;
			ctx.strokeStyle = this.isHover ? '#885110' : '#0060B2';
			ctx.lineWidth = 1.2;
			ctx.beginPath();
			var angleTo = (angle + m.PI) % pi2;
			angleTo = angleTo % (m.PI * 2);
			ctx.arc(this.a1.x, this.a1.y, 7, angle, angleTo, false);
			ctx.stroke();
			ctx.beginPath();
			angle += m.PI;
			angleTo = (angle + m.PI) % pi2;
			ctx.arc(this.a2.x, this.a2.y, 7, angle, angleTo, false);
			ctx.stroke();
		}
	};
	/**
	 * 
	 * @param {WegGLRenderingContext} gl
	 * @param {structures.VisualSpecifications} specs 
	 * @param {boolean} asSegments Using cylinder/solid line or segmented pills/dashed line
	 * @return {void}
	 */
	_.render = function(gl, specs, asSegments) {
		if (this.specs) {
			specs = this.specs;
		}
		// this is the elongation vector for the cylinder
		var height = this.a1.distance3D(this.a2);
		if (height === 0) {
			// if there is no height, then no point in rendering this bond,
			// just return
			return;
		}

		// scale factor for cylinder/pill radius.
		// when scale pill, the cap will affected too.
		var radiusScale = specs.bonds_cylinderDiameter_3D / 2;

		// atom1 color and atom2 color
		var a1Color = specs.bonds_color;
		var a2Color;

		// transform to the atom as well as the opposite atom (for Jmol and
		// PyMOL
		// color splits)
		var transform = m4.translate(gl.modelViewMatrix, [ this.a1.x, this.a1.y, this.a1.z ], []);
		var transformOpposite;

		// vector from atom1 to atom2
		var a2b = [ this.a2.x - this.a1.x, this.a2.y - this.a1.y, this.a2.z - this.a1.z ];

		// calculate the rotation
		var y = [ 0, 1, 0 ];
		var ang = 0;
		var axis;
		if (this.a1.x === this.a2.x && this.a1.z === this.a2.z) {
			axis = [ 0, 0, 1 ];
			if (this.a2.y < this.a1.y) {
				ang = m.PI;
			}
		} else {
			ang = extensions.vec3AngleFrom(y, a2b);
			axis = v3.cross(y, a2b, []);
		}


		var useJMOLColors = specs.bonds_useJMOLColors;
		var usePYMOLColors = specs.bonds_usePYMOLColors;

		// the specs will use JMol or PyMol color are
		// - Line
		// - Stick
		// - Wireframe
		if (useJMOLColors || usePYMOLColors) {

			a1Color = this.a1.getElementColor(useJMOLColors, usePYMOLColors, a1Color);
			a2Color = this.a2.getElementColor(useJMOLColors, usePYMOLColors, specs.bonds_color);

			// the transformOpposite will use for split color.
			// just make it splited if the color different.
			if(a1Color != a2Color) {
				transformOpposite = m4.translate(gl.modelViewMatrix, [ this.a2.x, this.a2.y, this.a2.z ], []);
			}
		}

		// calculate the translations for unsaturated bonds.
		// represenattio use saturatedCross are
		// - Line
		// - Wireframe
		// - Ball and Stick
		// just Stick will set bonds_showBondOrders_3D to false
		var others = [ 0 ];
		var saturatedCross;

		if(asSegments) { // block for draw bond as segmented line/pill

			if (specs.bonds_showBondOrders_3D && this.bondOrder > 1) {

				// The "0.5" part set here,
				// the other part (1) will render as cylinder
				others = [/*-specs.bonds_cylinderDiameter_3D, */ specs.bonds_cylinderDiameter_3D];

				var z = [ 0, 0, 1 ];
				var inverse = m4.inverse(gl.rotationMatrix, []);
				m4.multiplyVec3(inverse, z);
				saturatedCross = v3.cross(a2b, z, []);
				v3.normalize(saturatedCross);
			}

			var segmentScale = 1;

			var spaceBetweenPill = specs.bonds_pillSpacing_3D;

			var pillHeight = specs.bonds_pillHeight_3D;

			if(this.bondOrder == 0) {

				if(specs.bonds_renderAsLines_3D) {
					pillHeight = spaceBetweenPill;
				} else {
					pillHeight = specs.bonds_pillDiameter_3D;

					// Detect Ball and Stick representation
					if(pillHeight < specs.bonds_cylinderDiameter_3D) {
						pillHeight /= 2;
					}

					segmentScale = pillHeight / 2;
					height /= segmentScale;
					spaceBetweenPill /= segmentScale / 2;
				}

			}

			// total space need for one pill, iclude the space.
			var totalSpaceForPill = pillHeight + spaceBetweenPill;

			// segmented pills for one bond.
			var totalPillsPerBond = height / totalSpaceForPill;

			// segmented one unit pill for one bond
			var pillsPerBond = m.floor(totalPillsPerBond);

			var extraSegmentedSpace = height - totalSpaceForPill * pillsPerBond;

			var paddingSpace = (spaceBetweenPill + specs.bonds_pillDiameter_3D + extraSegmentedSpace) / 2;

			// pillSegmentsLength will change if both atom1 and atom2 color used for rendering
			var pillSegmentsLength = pillsPerBond;

			if(transformOpposite) {
				// floor will effected for odd pills, because one pill at the center
				// will replace with splited pills
				pillSegmentsLength = m.floor(pillsPerBond / 2);
			}

			// render bonds
			for ( var i = 0, ii = others.length; i < ii; i++) {
				var transformUse = m4.set(transform, []);

				if (others[i] !== 0) {
					m4.translate(transformUse, v3.scale(saturatedCross, others[i], []));
				}
				if (ang !== 0) {
					m4.rotate(transformUse, ang, axis);
				}

				if(segmentScale != 1) {
					m4.scale(transformUse, [ segmentScale, segmentScale, segmentScale ]);
				}

				// colors
				if(a1Color) gl.material.setDiffuseColor(a1Color);

				m4.translate(transformUse, [0, paddingSpace, 0]);

				for(var j = 0; j < pillSegmentsLength; j++) {

					if (specs.bonds_renderAsLines_3D) {
						if(this.bondOrder == 0) {
							gl.setMatrixUniforms(transformUse);
							gl.drawArrays(gl.POINTS, 0, 1);
						} else {
							m4.scale(transformUse, [1, pillHeight, 1]);

							gl.setMatrixUniforms(transformUse);
							gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);

							m4.scale(transformUse, [1, 1/pillHeight, 1]);
						}
					} else {
						gl.setMatrixUniforms(transformUse);
						if(this.bondOrder == 0) {
							gl.drawElements(gl.TRIANGLES, gl.sphereBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);					
						} else {
							gl.drawElements(gl.TRIANGLES, gl.pillBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);					
						}
					}

					m4.translate(transformUse, [0, totalSpaceForPill, 0]);
				}


				// if rendering segmented pill use atom1 and atom2 color
				if (transformOpposite) {
					// parameter for calculate splited pills
					var scaleY, halfOneMinScaleY;

					if (specs.bonds_renderAsLines_3D) {
						scaleY = pillHeight;
						// if(this.bondOrder != 0) {
						// 	scaleY -= spaceBetweenPill;
						// }
						scaleY /= 2;
						halfOneMinScaleY = 0;
					} else {
						scaleY = 2/3;
						halfOneMinScaleY = (1 - scaleY) / 2;
					}

					// if count of pills per bound is odd,
					// then draw the splited pills of atom1
					if(pillsPerBond % 2 != 0) {

						m4.scale(transformUse, [1, scaleY, 1]);

						gl.setMatrixUniforms(transformUse);

						if (specs.bonds_renderAsLines_3D) {

							if(this.bondOrder == 0) {
								gl.drawArrays(gl.POINTS, 0, 1);
							} else {
								gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);
							}

						} else {

							if(this.bondOrder == 0) {
								gl.drawElements(gl.TRIANGLES, gl.sphereBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);					
							} else {
								gl.drawElements(gl.TRIANGLES, gl.pillBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);					
							}
							
						}

						m4.translate(transformUse, [0, totalSpaceForPill * (1 + halfOneMinScaleY), 0]);
					
						m4.scale(transformUse, [1, 1/scaleY, 1]);
					}

					// prepare to render the atom2

					m4.set(transformOpposite, transformUse);
					if (others[i] !== 0) {
						m4.translate(transformUse, v3.scale(saturatedCross, others[i], []));
					}
					// don't check for 0 here as that means it should be rotated
					// by PI, but PI will be negated
					m4.rotate(transformUse, ang + m.PI, axis);

					if(segmentScale != 1) {
						m4.scale(transformUse, [ segmentScale, segmentScale, segmentScale ]);
					}

					// colors
					if(a2Color) gl.material.setDiffuseColor(a2Color);
					
					m4.translate(transformUse, [0, paddingSpace, 0]);


					// draw the remain pills which use the atom2 color
					for(var j = 0; j < pillSegmentsLength; j++) {

						if (specs.bonds_renderAsLines_3D) {
							if(this.bondOrder == 0) {
								gl.setMatrixUniforms(transformUse);
								gl.drawArrays(gl.POINTS, 0, 1);
							} else {
								m4.scale(transformUse, [1, pillHeight, 1]);

								gl.setMatrixUniforms(transformUse);
								gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);

								m4.scale(transformUse, [1, 1/pillHeight, 1]);
							}
						} else {
							gl.setMatrixUniforms(transformUse);
							if(this.bondOrder == 0) {
								gl.drawElements(gl.TRIANGLES, gl.sphereBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);					
							} else {
								gl.drawElements(gl.TRIANGLES, gl.pillBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);					
							}
						}

						m4.translate(transformUse, [0, totalSpaceForPill, 0]);
					}

					// draw the splited center pills of atom2
					if(pillsPerBond % 2 != 0) {

						m4.scale(transformUse, [1, scaleY, 1]);

						gl.setMatrixUniforms(transformUse);

						if (specs.bonds_renderAsLines_3D) {

							if(this.bondOrder == 0) {
								gl.drawArrays(gl.POINTS, 0, 1);
							} else {
								gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);
							}

						} else {

							if(this.bondOrder == 0) {
								gl.drawElements(gl.TRIANGLES, gl.sphereBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);					
							} else {
								gl.drawElements(gl.TRIANGLES, gl.pillBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);					
							}

						}

						m4.translate(transformUse, [0, totalSpaceForPill * (1 + halfOneMinScaleY), 0]);
					
						m4.scale(transformUse, [1, 1/scaleY, 1]);
					}
				}
			}
		} else {
			// calculate the translations for unsaturated bonds.
			// represenation that use saturatedCross are
			// - Line
			// - Wireframe
			// - Ball and Stick
			// just Stick will set bonds_showBondOrders_3D to false
			if (specs.bonds_showBondOrders_3D) {

				switch (this.bondOrder) {
				// the 0 and 0.5 bond order will draw as segmented pill.
				// so we not set that here.
				// case 0:
				// case 0.5: break;

				case 1.5:
					// The "1" part set here,
					// the other part (0.5) will render as segmented pill
					others = [ -specs.bonds_cylinderDiameter_3D /*, specs.bonds_cylinderDiameter_3D */];
					break;
				case 2:
					others = [ -specs.bonds_cylinderDiameter_3D, specs.bonds_cylinderDiameter_3D ];
					break;
				case 3:
					others = [ -1.2 * specs.bonds_cylinderDiameter_3D, 0, 1.2 * specs.bonds_cylinderDiameter_3D ];
					break;
				}

				// saturatedCross just need for need for bondorder greather than 1
				if(this.bondOrder > 1) {
					var z = [ 0, 0, 1 ];
					var inverse = m4.inverse(gl.rotationMatrix, []);
					m4.multiplyVec3(inverse, z);
					saturatedCross = v3.cross(a2b, z, []);
					v3.normalize(saturatedCross);
				}
			}
			// for Stick representation, we just change the cylinder radius
			else {

				switch (this.bondOrder) {
				case 0:
					radiusScale *= 0.25;
					break;
				case 0.5:
				case 1.5:
					radiusScale *= 0.5;
					break;
				}
			}


			// if transformOpposite is set, the it mean the color must be splited.
			// so the heigh of cylinder will be half.
			// one half for atom1 color the other for atom2 color
			if(transformOpposite) {
				height /= 2;
			}

			// Radius of cylinder already defined when initialize cylinder mesh,
			// so at this rate, the scale just needed for Y to strech
			// cylinder to bond length (height) and X and Z for radius.
			var scaleVector = [ radiusScale, height, radiusScale ];

			// render bonds
			for ( var i = 0, ii = others.length; i < ii; i++) {
				var transformUse = m4.set(transform, []);
				if (others[i] !== 0) {
					m4.translate(transformUse, v3.scale(saturatedCross, others[i], []));
				}
				if (ang !== 0) {
					m4.rotate(transformUse, ang, axis);
				}
				m4.scale(transformUse, scaleVector);
				
				// colors
				if(a1Color) gl.material.setDiffuseColor(a1Color);

				// render
				gl.setMatrixUniforms(transformUse);
				if (specs.bonds_renderAsLines_3D) {
					gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);
				} else {
					gl.drawArrays(gl.TRIANGLE_STRIP, 0, gl.cylinderBuffer.vertexPositionBuffer.numItems);
				}

				// if transformOpposite is set, then a2Color also shoudl be seted as well.
				if (transformOpposite) {

					m4.set(transformOpposite, transformUse);
					if (others[i] !== 0) {
						m4.translate(transformUse, v3.scale(saturatedCross, others[i], []));
					}
					// don't check for 0 here as that means it should be rotated
					// by PI, but PI will be negated
					m4.rotate(transformUse, ang + m.PI, axis);
					m4.scale(transformUse, scaleVector);

					// colors
					if(a2Color) gl.material.setDiffuseColor(a2Color);

					// render
					gl.setMatrixUniforms(transformUse);
					if (specs.bonds_renderAsLines_3D) {
						gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);
					} else {
						gl.drawArrays(gl.TRIANGLE_STRIP, 0, gl.cylinderBuffer.vertexPositionBuffer.numItems);
					}
				}

			}
		}
	};
	/**
	 * 
	 * @param {WegGLRenderingContext} gl
	 * @param {structures.VisualSpecifications} specs 
	 * @return {void}
	 */
	_.renderPicker = function(gl, specs) {

		// gl.cylinderBuffer.bindBuffers(gl);
		// gl.material.setDiffuseColor(
		// 	this.bondOrder == 0   ? '#FF0000' : // merah
		// 	this.bondOrder == 0.5 ? '#FFFF00' : // kuning
		// 	this.bondOrder == 1   ? '#FF00FF' : // ungu
		// 	this.bondOrder == 1.5 ? '#00FF00' : // hijau
		// 	this.bondOrder == 2   ? '#00FFFF' : // cyan
		// 	this.bondOrder == 3   ? '#0000FF' : // biru
		// 	'#FFFFFF');
		// gl.material.setAlpha(1);


		if (this.specs) {
			specs = this.specs;
		}
		// this is the elongation vector for the cylinder
		var height = this.a1.distance3D(this.a2);
		if (height === 0) {
			// if there is no height, then no point in rendering this bond,
			// just return
			return;
		}

		// scale factor for cylinder/pill radius.
		// when scale pill, the cap will affected too.
		var radiusScale = specs.bonds_cylinderDiameter_3D / 2;

		// transform to the atom as well as the opposite atom (for Jmol and
		// PyMOL
		// color splits)
		var transform = m4.translate(gl.modelViewMatrix, [ this.a1.x, this.a1.y, this.a1.z ], []);

		// vector from atom1 to atom2
		var a2b = [ this.a2.x - this.a1.x, this.a2.y - this.a1.y, this.a2.z - this.a1.z ];

		// calculate the rotation
		var y = [ 0, 1, 0 ];
		var ang = 0;
		var axis;
		if (this.a1.x === this.a2.x && this.a1.z === this.a2.z) {
			axis = [ 0, 0, 1 ];
			if (this.a2.y < this.a1.y) {
				ang = m.PI;
			}
		} else {
			ang = extensions.vec3AngleFrom(y, a2b);
			axis = v3.cross(y, a2b, []);
		}

		// calculate the translations for unsaturated bonds.
		// represenattio use saturatedCross are
		// - Line
		// - WIreframe
		// - Ball and Stick
		// just Stick will set bonds_showBondOrders_3D to false
		var others = [ 0 ];
		var saturatedCross;

		if (specs.bonds_showBondOrders_3D) {

			if (specs.bonds_renderAsLines_3D) {

				switch (this.bondOrder) {

				case 1.5:
				case 2:
					others = [ -specs.bonds_cylinderDiameter_3D, specs.bonds_cylinderDiameter_3D ];
					break;
				case 3:
					others = [ -1.2 * specs.bonds_cylinderDiameter_3D, 0, 1.2 * specs.bonds_cylinderDiameter_3D ];
					break;
				}

				// saturatedCross just need for need for bondorder greather than 1
				if(this.bondOrder > 1) {
					var z = [ 0, 0, 1 ];
					var inverse = m4.inverse(gl.rotationMatrix, []);
					m4.multiplyVec3(inverse, z);
					saturatedCross = v3.cross(a2b, z, []);
					v3.normalize(saturatedCross);
				}

			} else {

				switch (this.bondOrder) {
				case 1.5:
				case 2:
					radiusScale *= 3;
					break;
				case 3:
					radiusScale *= 3.4;
					break;
				}

			}

		} else {
			// this is for Stick repersentation because Stick not have bonds_showBondOrders_3D

			switch (this.bondOrder) {

			case 0:
				radiusScale *= 0.25;
				break;
			case 0.5:
			case 1.5:
				radiusScale *= 0.5;
				break;
			}

		}

		// Radius of cylinder already defined when initialize cylinder mesh,
		// so at this rate, the scale just needed for Y to strech
		// cylinder to bond length (height) and X and Z for radius.
		var scaleVector = [ radiusScale, height, radiusScale ];

		// render bonds
		for ( var i = 0, ii = others.length; i < ii; i++) {
			var transformUse = m4.set(transform, []);
			if (others[i] !== 0) {
				m4.translate(transformUse, v3.scale(saturatedCross, others[i], []));
			}
			if (ang !== 0) {
				m4.rotate(transformUse, ang, axis);
			}
			m4.scale(transformUse, scaleVector);

			// render
			gl.setMatrixUniforms(transformUse);
			if (specs.bonds_renderAsLines_3D) {
				gl.drawArrays(gl.LINES, 0, gl.lineBuffer.vertexPositionBuffer.numItems);
			} else {
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, gl.cylinderBuffer.vertexPositionBuffer.numItems);
			}

		}
	};
	
})(ChemDoodle.ELEMENT, ChemDoodle.extensions, ChemDoodle.structures, ChemDoodle.math, Math, mat4, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(structures, m) {
	'use strict';
	structures.Ring = function() {
		this.atoms = [];
		this.bonds = [];
	};
	var _ = structures.Ring.prototype;
	_.center = undefined;
	_.setupBonds = function() {
		for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
			this.bonds[i].ring = this;
		}
		this.center = this.getCenter();
	};
	_.getCenter = function() {
		var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
		for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
			minX = m.min(this.atoms[i].x, minX);
			minY = m.min(this.atoms[i].y, minY);
			maxX = m.max(this.atoms[i].x, maxX);
			maxY = m.max(this.atoms[i].y, maxY);
		}
		return new structures.Point((maxX + minX) / 2, (maxY + minY) / 2);
	};

})(ChemDoodle.structures, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4459 $
//  $Author: kevin $
//  $LastChangedDate: 2013-08-06 14:09:43 -0400 (Tue, 06 Aug 2013) $
//

(function(c, math, structures, RESIDUE, m) {
	'use strict';
	structures.Molecule = function() {
		this.atoms = [];
		this.bonds = [];
		this.rings = [];
	};
	var _ = structures.Molecule.prototype;
	// this can be an extensive algorithm for large molecules, you may want
	// to turn this off
	_.findRings = true;
	_.draw = function(ctx, specs) {
		if (this.specs) {
			specs = this.specs;
		}
		// draw
		// need this weird render of atoms before and after, just in case
		// circles are rendered, as those should be on top
		if (specs.atoms_display && !specs.atoms_circles_2D) {
			for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
				this.atoms[i].draw(ctx, specs);
			}
		}
		if (specs.bonds_display) {
			for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
				this.bonds[i].draw(ctx, specs);
			}
		}
		if (specs.atoms_display && specs.atoms_circles_2D) {
			for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
				this.atoms[i].draw(ctx, specs);
			}
		}
	};
	_.render = function(gl, specs) {
		// uncomment this to render the picking frame
		// return this.renderPickFrame(gl, specs, []);
		if (this.specs) {
			specs = this.specs;
		}
		// check explicitly if it is undefined here, since hetatm is a
		// boolean that can be true or false, as long as it is set, it is
		// macro
		var isMacro = this.atoms.length > 0 && this.atoms[0].hetatm !== undefined;
		if (isMacro) {
			if (specs.macro_displayBonds) {
				if (this.bonds.length > 0) {
					if (specs.bonds_renderAsLines_3D && !this.residueSpecs || this.residueSpecs && this.residueSpecs.bonds_renderAsLines_3D) {
						gl.lineWidth(this.residueSpecs ? this.residueSpecs.bonds_width_2D : specs.bonds_width_2D);
						gl.lineBuffer.bindBuffers(gl);
					} else {
						gl.cylinderBuffer.bindBuffers(gl);
					}
					// colors
					gl.material.setTempColors(specs.bonds_materialAmbientColor_3D, undefined, specs.bonds_materialSpecularColor_3D, specs.bonds_materialShininess_3D);
				}
				for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
					var b = this.bonds[i];
					// closestDistance may be 0, so check if undefined
					if (!b.a1.hetatm && (specs.macro_atomToLigandDistance === -1 || (b.a1.closestDistance !== undefined && specs.macro_atomToLigandDistance >= b.a1.closestDistance && specs.macro_atomToLigandDistance >= b.a2.closestDistance))) {
						b.render(gl, this.residueSpecs ? this.residueSpecs : specs);
					}
				}
			}
			if (specs.macro_displayAtoms) {
				if (this.atoms.length > 0) {
					gl.sphereBuffer.bindBuffers(gl);
					// colors
					gl.material.setTempColors(specs.atoms_materialAmbientColor_3D, undefined, specs.atoms_materialSpecularColor_3D, specs.atoms_materialShininess_3D);
				}
				for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
					var a = this.atoms[i];
					// closestDistance may be 0, so check if undefined
					if (!a.hetatm && (specs.macro_atomToLigandDistance === -1 || (a.closestDistance !== undefined && specs.macro_atomToLigandDistance >= a.closestDistance))) {
						a.render(gl, this.residueSpecs ? this.residueSpecs : specs);
					}
				}
			}
		}
		if (specs.bonds_display) {
			// Array for Half Bonds. It is needed because Half Bonds use the
			// pill buffer.
			var asPills = [];
			// Array for 0 bond order.
			var asSpheres = [];
			if (this.bonds.length > 0) {
				if (specs.bonds_renderAsLines_3D) {
					gl.lineWidth(specs.bonds_width_2D);
					gl.lineBuffer.bindBuffers(gl);
				} else {
					gl.cylinderBuffer.bindBuffers(gl);
				}
				// colors
				gl.material.setTempColors(specs.bonds_materialAmbientColor_3D, undefined, specs.bonds_materialSpecularColor_3D, specs.bonds_materialShininess_3D);
			}
			for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
				var b = this.bonds[i];
				if (!isMacro || b.a1.hetatm) {
					// Check if render as segmented pill will used.
					if (specs.bonds_showBondOrders_3D) {
						if (b.bondOrder == 0) {
							// 0 bond order
							asSpheres.push(b);
						} else if (b.bondOrder == 0.5) {
							// 0.5 bond order
							asPills.push(b);
						} else {
							if (b.bondOrder == 1.5) {
								// For 1.5 bond order, the "1" part will render
								// as cylinder, and the "0.5" part will render
								// as segmented pills
								asPills.push(b);
							}
							b.render(gl, specs);
						}
					} else {
						// this will render the Stick representation
						b.render(gl, specs);
					}

				}
			}
			// Render the Half Bond
			if (asPills.length > 0) {
				// if bonds_renderAsLines_3D is true, then lineBuffer will
				// binded.
				// so in here we just need to check if we need to change
				// the binding buffer to pillBuffer or not.
				if (!specs.bonds_renderAsLines_3D) {
					gl.pillBuffer.bindBuffers(gl);
				}
				for ( var i = 0, ii = asPills.length; i < ii; i++) {
					asPills[i].render(gl, specs, true);
				}
			}
			// Render zero bond order
			if (asSpheres.length > 0) {
				// if bonds_renderAsLines_3D is true, then lineBuffer will
				// binded.
				// so in here we just need to check if we need to change
				// the binding buffer to pillBuffer or not.
				if (!specs.bonds_renderAsLines_3D) {
					gl.sphereBuffer.bindBuffers(gl);
				}
				for ( var i = 0, ii = asSpheres.length; i < ii; i++) {
					asSpheres[i].render(gl, specs, true);
				}
			}
		}
		if (specs.atoms_display) {
			for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
				var a = this.atoms[i];
				a.bondNumber = 0;
				a.renderAsStar = false;
			}
			for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
				var b = this.bonds[i];
				b.a1.bondNumber++;
				b.a2.bondNumber++;
			}
			if (this.atoms.length > 0) {
				gl.sphereBuffer.bindBuffers(gl);
				// colors
				gl.material.setTempColors(specs.atoms_materialAmbientColor_3D, undefined, specs.atoms_materialSpecularColor_3D, specs.atoms_materialShininess_3D);
			}
			var asStars = [];
			for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
				var a = this.atoms[i];
				if (!isMacro || (a.hetatm && (specs.macro_showWater || !a.isWater))) {
					if (specs.atoms_nonBondedAsStars_3D && a.bondNumber === 0) {
						a.renderAsStar = true;
						asStars.push(a);
					} else {
						a.render(gl, specs);
					}
				}
			}
			if (asStars.length > 0) {
				gl.starBuffer.bindBuffers(gl);
				for ( var i = 0, ii = asStars.length; i < ii; i++) {
					asStars[i].render(gl, specs);
				}
			}
		}
		if (this.chains) {
			// set up the model view matrix, since it won't be modified
			// for macromolecules
			gl.setMatrixUniforms(gl.modelViewMatrix);
			// render chains
			if (specs.proteins_displayRibbon) {
				// proteins
				// colors
				gl.material.setTempColors(specs.proteins_materialAmbientColor_3D, undefined, specs.proteins_materialSpecularColor_3D, specs.proteins_materialShininess_3D);
				for ( var j = 0, jj = this.ribbons.length; j < jj; j++) {
					if (specs.proteins_useShapelyColors || specs.proteins_useAminoColors || specs.proteins_usePolarityColors) {
						var use = specs.proteins_ribbonCartoonize ? this.cartoons[j] : this.ribbons[j];
						use.front.bindBuffers(gl);
						for ( var i = 0, ii = use.front.segments.length; i < ii; i++) {
							use.front.segments[i].render(gl, specs);
						}
						use.back.bindBuffers(gl);
						for ( var i = 0, ii = use.back.segments.length; i < ii; i++) {
							use.back.segments[i].render(gl, specs);
						}
					} else {
						if (specs.proteins_ribbonCartoonize) {
							var use = this.cartoons[j];
							use.front.bindBuffers(gl);
							for ( var i = 0, ii = use.front.cartoonSegments.length; i < ii; i++) {
								use.front.cartoonSegments[i].render(gl, specs);
							}
							use.back.bindBuffers(gl);
							for ( var i = 0, ii = use.back.cartoonSegments.length; i < ii; i++) {
								use.back.cartoonSegments[i].render(gl, specs);
							}
						} else {
							var use = this.ribbons[j];
							use.front.render(gl, specs);
							use.back.render(gl, specs);
						}
					}
				}
			}
			if (specs.proteins_displayBackbone) {
				if (!this.alphaCarbonTrace) {
					// cache the alpha carbon trace
					this.alphaCarbonTrace = {
						nodes : [],
						edges : []
					};
					for ( var j = 0, jj = this.chains.length; j < jj; j++) {
						var rs = this.chains[j];
						var isNucleotide = rs.length > 2 && RESIDUE[rs[2].name] && RESIDUE[rs[2].name].aminoColor === '#BEA06E';
						if (!isNucleotide && rs.length > 0) {
							for ( var i = 1, ii = rs.length - 2; i < ii; i++) {
								var n = rs[i].cp1;
								n.chainColor = rs.chainColor;
								this.alphaCarbonTrace.nodes.push(n);
								var b = new structures.Bond(rs[i].cp1, rs[i + 1].cp1);
								b.residueName = rs[i].name;
								b.chainColor = rs.chainColor;
								this.alphaCarbonTrace.edges.push(b);
								if (i === rs.length - 3) {
									n = rs[i + 1].cp1;
									n.chainColor = rs.chainColor;
									this.alphaCarbonTrace.nodes.push(n);
								}
							}
						}
					}
				}
				if (this.alphaCarbonTrace.nodes.length > 0) {
					var traceSpecs = new structures.VisualSpecifications();
					traceSpecs.atoms_display = true;
					traceSpecs.bonds_display = true;
					traceSpecs.atoms_sphereDiameter_3D = specs.proteins_backboneThickness;
					traceSpecs.bonds_cylinderDiameter_3D = specs.proteins_backboneThickness;
					traceSpecs.bonds_useJMOLColors = false;
					traceSpecs.atoms_color = specs.proteins_backboneColor;
					traceSpecs.bonds_color = specs.proteins_backboneColor;
					traceSpecs.atoms_useVDWDiameters_3D = false;
					// colors
					gl.material.setTempColors(specs.proteins_materialAmbientColor_3D, undefined, specs.proteins_materialSpecularColor_3D, specs.proteins_materialShininess_3D);
					gl.material.setDiffuseColor(specs.proteins_backboneColor);
					for ( var i = 0, ii = this.alphaCarbonTrace.nodes.length; i < ii; i++) {
						var n = this.alphaCarbonTrace.nodes[i];
						if (specs.macro_colorByChain) {
							traceSpecs.atoms_color = n.chainColor;
						}
						gl.sphereBuffer.bindBuffers(gl);
						n.render(gl, traceSpecs);
					}
					for ( var i = 0, ii = this.alphaCarbonTrace.edges.length; i < ii; i++) {
						var e = this.alphaCarbonTrace.edges[i];
						var color;
						var r = RESIDUE[e.residueName] ? RESIDUE[e.residueName] : RESIDUE['*'];
						if (specs.macro_colorByChain) {
							color = e.chainColor;
						} else if (specs.proteins_useShapelyColors) {
							color = r.shapelyColor;
						} else if (specs.proteins_useAminoColors) {
							color = r.aminoColor;
						} else if (specs.proteins_usePolarityColors) {
							if (r.polar) {
								color = '#C10000';
							} else {
								color = '#FFFFFF';
							}
						}
						if (color) {
							traceSpecs.bonds_color = color;
						}
						gl.cylinderBuffer.bindBuffers(gl);
						e.render(gl, traceSpecs);
					}
				}
			}
			if (specs.nucleics_display) {
				// nucleic acids
				// colors
				gl.material.setTempColors(specs.nucleics_materialAmbientColor_3D, undefined, specs.nucleics_materialSpecularColor_3D, specs.nucleics_materialShininess_3D);
				for ( var j = 0, jj = this.tubes.length; j < jj; j++) {
					gl.setMatrixUniforms(gl.modelViewMatrix);
					var use = this.tubes[j];
					use.render(gl, specs);
				}
			}
		}
		if (specs.crystals_displayUnitCell && this.unitCell) {
			gl.setMatrixUniforms(gl.modelViewMatrix);
			this.unitCell.bindBuffers(gl);
			// colors
			gl.material.setDiffuseColor(specs.crystals_unitCellColor);
			gl.lineWidth(specs.crystals_unitCellLineWidth);
			// render
			gl.drawElements(gl.LINES, this.unitCell.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
		if (this.surface && specs.surfaces_display) {
			gl.setMatrixUniforms(gl.modelViewMatrix);
			// gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
			// gl.enable(gl.BLEND);
			// gl.disable(gl.DEPTH_TEST);
			this.surface.bindBuffers(gl);
			gl.material.setTempColors(specs.surfaces_materialAmbientColor_3D, specs.surfaces_color, specs.surfaces_materialSpecularColor_3D, specs.surfaces_materialShininess_3D);
			// gl.material.setAlpha(.2);
			if (specs.surfaces_style === 'Dot') {
				gl.drawArrays(gl.POINTS, 0, this.surface.vertexPositionBuffer.numItems);
				// } else if (specs.surfaces_style === 'Mesh') {
				// gl.drawElements(gl.LINES,
				// this.surface.vertexIndexBuffer.numItems,
				// gl.UNSIGNED_SHORT, 0);
			} else {
				gl.drawElements(gl.TRIANGLES, this.surface.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			}
			// gl.disable(gl.BLEND);
			// gl.enable(gl.DEPTH_TEST);
		}
	};
	_.renderPickFrame = function(gl, specs, objects) {
		if (this.specs) {
			specs = this.specs;
		}
		var isMacro = this.atoms.length > 0 && this.atoms[0].hetatm !== undefined;
		if (specs.bonds_display) {
			if (this.bonds.length > 0) {
				if (specs.bonds_renderAsLines_3D) {
					gl.lineWidth(specs.bonds_width_2D);
					gl.lineBuffer.bindBuffers(gl);
				} else {
					gl.cylinderBuffer.bindBuffers(gl);
				}
			}
			for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
				var b = this.bonds[i];
				if (!isMacro || b.a1.hetatm) {
					gl.material.setDiffuseColor(math.idx2color(objects.length));
					b.renderPicker(gl, specs);
					objects.push(b);
				}
			}
		}
		if (specs.atoms_display) {
			for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
				var a = this.atoms[i];
				a.bondNumber = 0;
				a.renderAsStar = false;
			}
			for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
				var b = this.bonds[i];
				b.a1.bondNumber++;
				b.a2.bondNumber++;
			}
			if (this.atoms.length > 0) {
				gl.sphereBuffer.bindBuffers(gl);
			}
			var asStars = [];
			for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
				var a = this.atoms[i];
				if (!isMacro || (a.hetatm && (specs.macro_showWater || !a.isWater))) {
					if (specs.atoms_nonBondedAsStars_3D && a.bondNumber === 0) {
						a.renderAsStar = true;
						asStars.push(a);
					} else {
						gl.material.setDiffuseColor(math.idx2color(objects.length));
						a.render(gl, specs, true);
						objects.push(a);
					}
				}
			}
			if (asStars.length > 0) {
				gl.starBuffer.bindBuffers(gl);
				for ( var i = 0, ii = asStars.length; i < ii; i++) {
					var a = asStars[i];
					gl.material.setDiffuseColor(math.idx2color(objects.length));
					a.render(gl, specs, true);
					objects.push(a);
				}
			}
		}
	};
	_.getCenter3D = function() {
		if (this.atoms.length === 1) {
			return new structures.Atom('C', this.atoms[0].x, this.atoms[0].y, this.atoms[0].z);
		}
		var minX = Infinity, minY = Infinity, minZ = Infinity;
		var maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
		if (this.chains) {
			// residues
			for ( var i = 0, ii = this.chains.length; i < ii; i++) {
				var chain = this.chains[i];
				for ( var j = 0, jj = chain.length; j < jj; j++) {
					var residue = chain[j];
					minX = m.min(residue.cp1.x, residue.cp2.x, minX);
					minY = m.min(residue.cp1.y, residue.cp2.y, minY);
					minZ = m.min(residue.cp1.z, residue.cp2.z, minZ);
					maxX = m.max(residue.cp1.x, residue.cp2.x, maxX);
					maxY = m.max(residue.cp1.y, residue.cp2.y, maxY);
					maxZ = m.max(residue.cp1.z, residue.cp2.z, maxZ);
				}
			}
		}
		for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
			minX = m.min(this.atoms[i].x, minX);
			minY = m.min(this.atoms[i].y, minY);
			minZ = m.min(this.atoms[i].z, minZ);
			maxX = m.max(this.atoms[i].x, maxX);
			maxY = m.max(this.atoms[i].y, maxY);
			maxZ = m.max(this.atoms[i].z, maxZ);
		}
		return new structures.Atom('C', (maxX + minX) / 2, (maxY + minY) / 2, (maxZ + minZ) / 2);
	};
	_.getCenter = function() {
		if (this.atoms.length === 1) {
			return new structures.Point(this.atoms[0].x, this.atoms[0].y);
		}
		var minX = Infinity, minY = Infinity;
		var maxX = -Infinity, maxY = -Infinity;
		for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
			minX = m.min(this.atoms[i].x, minX);
			minY = m.min(this.atoms[i].y, minY);
			maxX = m.max(this.atoms[i].x, maxX);
			maxY = m.max(this.atoms[i].y, maxY);
		}
		return new structures.Point((maxX + minX) / 2, (maxY + minY) / 2);
	};
	_.getDimension = function() {
		if (this.atoms.length === 1) {
			return new structures.Point(0, 0);
		}
		var minX = Infinity, minY = Infinity;
		var maxX = -Infinity, maxY = -Infinity;
		if (this.chains) {
			for ( var i = 0, ii = this.chains.length; i < ii; i++) {
				var chain = this.chains[i];
				for ( var j = 0, jj = chain.length; j < jj; j++) {
					var residue = chain[j];
					minX = m.min(residue.cp1.x, residue.cp2.x, minX);
					minY = m.min(residue.cp1.y, residue.cp2.y, minY);
					maxX = m.max(residue.cp1.x, residue.cp2.x, maxX);
					maxY = m.max(residue.cp1.y, residue.cp2.y, maxY);
				}
			}
			minX -= 30;
			minY -= 30;
			maxX += 30;
			maxY += 30;
		}
		for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
			minX = m.min(this.atoms[i].x, minX);
			minY = m.min(this.atoms[i].y, minY);
			maxX = m.max(this.atoms[i].x, maxX);
			maxY = m.max(this.atoms[i].y, maxY);
		}
		return new structures.Point(maxX - minX, maxY - minY);
	};
	_.check = function(force) {
		// using force improves efficiency, so changes will not be checked
		// until a render occurs
		// you can force a check by sending true to this function after
		// calling check with a false
		if (force && this.doChecks) {
			// only check if the number of bonds has changed
			if (this.findRings) {
				if (this.bonds.length - this.atoms.length !== this.fjNumCache) {
					// find rings
					this.rings = new c.informatics.SSSRFinder(this).rings;
					for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
						this.bonds[i].ring = undefined;
					}
					for ( var i = 0, ii = this.rings.length; i < ii; i++) {
						this.rings[i].setupBonds();
					}
				} else {
					// update rings if any
					for ( var i = 0, ii = this.rings.length; i < ii; i++) {
						var r = this.rings[i];
						r.center = r.getCenter();
					}
				}
			}
			// find lones
			for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
				this.atoms[i].isLone = false;
				if (this.atoms[i].label === 'C') {
					var counter = 0;
					for ( var j = 0, jj = this.bonds.length; j < jj; j++) {
						if (this.bonds[j].a1 === this.atoms[i] || this.bonds[j].a2 === this.atoms[i]) {
							counter++;
						}
					}
					if (counter === 0) {
						this.atoms[i].isLone = true;
					}
				}
			}
			// sort
			var sort = false;
			for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
				if (this.atoms[i].z !== 0) {
					sort = true;
				}
			}
			if (sort) {
				this.sortAtomsByZ();
				this.sortBondsByZ();
			}
			// setup metadata
			this.setupMetaData();
			this.atomNumCache = this.atoms.length;
			this.bondNumCache = this.bonds.length;
			// fj number cache doesnt care if there are separate molecules,
			// as the change will signal a need to check for rings; the
			// accuracy doesn't matter
			this.fjNumCache = this.bonds.length - this.atoms.length;
		}
		this.doChecks = !force;
	};
	_.getAngles = function(a) {
		var angles = [];
		for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
			if (this.bonds[i].contains(a)) {
				angles.push(a.angle(this.bonds[i].getNeighbor(a)));
			}
		}
		angles.sort();
		return angles;
	};
	_.getCoordinationNumber = function(bs) {
		var coordinationNumber = 0;
		for ( var i = 0, ii = bs.length; i < ii; i++) {
			coordinationNumber += bs[i].bondOrder;
		}
		return coordinationNumber;
	};
	_.getBonds = function(a) {
		var bonds = [];
		for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
			if (this.bonds[i].contains(a)) {
				bonds.push(this.bonds[i]);
			}
		}
		return bonds;
	};
	_.sortAtomsByZ = function() {
		for ( var i = 1, ii = this.atoms.length; i < ii; i++) {
			var index = i;
			while (index > 0 && this.atoms[index].z < this.atoms[index - 1].z) {
				var hold = this.atoms[index];
				this.atoms[index] = this.atoms[index - 1];
				this.atoms[index - 1] = hold;
				index--;
			}
		}
	};
	_.sortBondsByZ = function() {
		for ( var i = 1, ii = this.bonds.length; i < ii; i++) {
			var index = i;
			while (index > 0 && (this.bonds[index].a1.z + this.bonds[index].a2.z) < (this.bonds[index - 1].a1.z + this.bonds[index - 1].a2.z)) {
				var hold = this.bonds[index];
				this.bonds[index] = this.bonds[index - 1];
				this.bonds[index - 1] = hold;
				index--;
			}
		}
	};
	_.setupMetaData = function() {
		var center = this.getCenter();
		for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
			var a = this.atoms[i];
			a.bonds = this.getBonds(a);
			a.angles = this.getAngles(a);
			a.isHidden = a.bonds.length === 2 && m.abs(m.abs(a.angles[1] - a.angles[0]) - m.PI) < m.PI / 30 && a.bonds[0].bondOrder === a.bonds[1].bondOrder;
			var angleData = math.angleBetweenLargest(a.angles);
			a.angleOfLeastInterference = angleData.angle % (m.PI * 2);
			a.largestAngle = angleData.largest;
			a.coordinationNumber = this.getCoordinationNumber(a.bonds);
			a.bondNumber = a.bonds.length;
			a.molCenter = center;
		}
		for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
			var b = this.bonds[i];
			b.molCenter = center;
		}
	};
	_.scaleToAverageBondLength = function(length) {
		var avBondLength = this.getAverageBondLength();
		if (avBondLength !== 0) {
			var scale = length / avBondLength;
			for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
				this.atoms[i].x *= scale;
				this.atoms[i].y *= scale;
			}
		}
	};
	_.getAverageBondLength = function() {
		if (this.bonds.length === 0) {
			return 0;
		}
		var tot = 0;
		for ( var i = 0, ii = this.bonds.length; i < ii; i++) {
			tot += this.bonds[i].getLength();
		}
		tot /= this.bonds.length;
		return tot;
	};
	_.getBounds = function() {
		var bounds = new math.Bounds();
		for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
			bounds.expand(this.atoms[i].getBounds());
		}
		if (this.chains) {
			for ( var i = 0, ii = this.chains.length; i < ii; i++) {
				var chain = this.chains[i];
				for ( var j = 0, jj = chain.length; j < jj; j++) {
					var residue = chain[j];
					bounds.expand(residue.cp1.x, residue.cp1.y);
					bounds.expand(residue.cp2.x, residue.cp2.y);
				}
			}
			bounds.minX -= 30;
			bounds.minY -= 30;
			bounds.maxX += 30;
			bounds.maxY += 30;
		}
		return bounds;
	};
	_.getBounds3D = function() {
		var bounds = new math.Bounds();
		for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
			bounds.expand(this.atoms[i].getBounds3D());
		}
		if (this.chains) {
			for ( var i = 0, ii = this.chains.length; i < ii; i++) {
				var chain = this.chains[i];
				for ( var j = 0, jj = chain.length; j < jj; j++) {
					var residue = chain[j];
					bounds.expand3D(residue.cp1.x, residue.cp1.y, residue.cp1.z);
					bounds.expand3D(residue.cp2.x, residue.cp2.y, residue.cp2.z);
				}
			}
		}
		return bounds;
	};

})(ChemDoodle, ChemDoodle.math, ChemDoodle.structures, ChemDoodle.RESIDUE, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(structures, m, m4, v3) {
	'use strict';
	var SB;
	var lastVerticalResolution = -1;

	function setupMatrices(verticalResolution) {
		var n2 = verticalResolution * verticalResolution;
		var n3 = verticalResolution * verticalResolution * verticalResolution;
		var S = [ 6 / n3, 0, 0, 0, 6 / n3, 2 / n2, 0, 0, 1 / n3, 1 / n2, 1 / verticalResolution, 0, 0, 0, 0, 1 ];
		var Bm = [ -1 / 6, 1 / 2, -1 / 2, 1 / 6, 1 / 2, -1, 1 / 2, 0, -1 / 2, 0, 1 / 2, 0, 1 / 6, 2 / 3, 1 / 6, 0 ];
		SB = m4.multiply(Bm, S, []);
		lastVerticalResolution = verticalResolution;
	}

	structures.Residue = function(resSeq) {
		// number of vertical slashes per segment
		this.resSeq = resSeq;
	};
	var _ = structures.Residue.prototype;
	_.setup = function(nextAlpha, horizontalResolution) {
		this.horizontalResolution = horizontalResolution;
		// define plane
		var A = [ nextAlpha.x - this.cp1.x, nextAlpha.y - this.cp1.y, nextAlpha.z - this.cp1.z ];
		var B = [ this.cp2.x - this.cp1.x, this.cp2.y - this.cp1.y, this.cp2.z - this.cp1.z ];
		var C = v3.cross(A, B, []);
		this.D = v3.cross(C, A, []);
		v3.normalize(C);
		v3.normalize(this.D);
		// generate guide coordinates
		// guides for the narrow parts of the ribbons
		this.guidePointsSmall = [];
		// guides for the wide parts of the ribbons
		this.guidePointsLarge = [];
		var P = [ (nextAlpha.x + this.cp1.x) / 2, (nextAlpha.y + this.cp1.y) / 2, (nextAlpha.z + this.cp1.z) / 2 ];
		if (this.helix) {
			// expand helices
			v3.scale(C, 1.5);
			v3.add(P, C);
		}
		this.guidePointsSmall[0] = new structures.Atom('', P[0] - this.D[0] / 2, P[1] - this.D[1] / 2, P[2] - this.D[2] / 2);
		for ( var i = 1; i < horizontalResolution; i++) {
			this.guidePointsSmall[i] = new structures.Atom('', this.guidePointsSmall[0].x + this.D[0] * i / horizontalResolution, this.guidePointsSmall[0].y + this.D[1] * i / horizontalResolution, this.guidePointsSmall[0].z + this.D[2] * i / horizontalResolution);
		}
		v3.scale(this.D, 4);
		this.guidePointsLarge[0] = new structures.Atom('', P[0] - this.D[0] / 2, P[1] - this.D[1] / 2, P[2] - this.D[2] / 2);
		for ( var i = 1; i < horizontalResolution; i++) {
			this.guidePointsLarge[i] = new structures.Atom('', this.guidePointsLarge[0].x + this.D[0] * i / horizontalResolution, this.guidePointsLarge[0].y + this.D[1] * i / horizontalResolution, this.guidePointsLarge[0].z + this.D[2] * i / horizontalResolution);
		}
	};
	_.getGuidePointSet = function(type) {
		if (type === 0) {
			return this.helix || this.sheet ? this.guidePointsLarge : this.guidePointsSmall;
		} else if (type === 1) {
			return this.guidePointsSmall;
		} else if (type === 2) {
			return this.guidePointsLarge;
		}
	};
	_.computeLineSegments = function(b1, a3, a4, doCartoon, verticalResolution) {
		if (verticalResolution !== lastVerticalResolution) {
			setupMatrices(verticalResolution);
		}
		this.split = a3.helix !== this.helix || a3.sheet !== this.sheet;
		this.lineSegments = this.innerCompute(0, b1, a3, a4, false, verticalResolution);
		if (doCartoon) {
			this.lineSegmentsCartoon = this.innerCompute(a3.helix || a3.sheet ? 2 : 1, b1, a3, a4, true, verticalResolution);
		}
	};
	_.innerCompute = function(set, b1, a3, a4, useArrows, verticalResolution) {
		var segments = [];
		var use = this.getGuidePointSet(set);
		var useb1 = b1.getGuidePointSet(set);
		var usea3 = a3.getGuidePointSet(set);
		var usea4 = a4.getGuidePointSet(set);
		for ( var l = 0, ll = this.guidePointsLarge.length; l < ll; l++) {
			var G = [ useb1[l].x, useb1[l].y, useb1[l].z, 1, use[l].x, use[l].y, use[l].z, 1, usea3[l].x, usea3[l].y, usea3[l].z, 1, usea4[l].x, usea4[l].y, usea4[l].z, 1 ];
			var M = m4.multiply(G, SB, []);
			var strand = [];
			for ( var k = 0; k < verticalResolution; k++) {
				for ( var i = 3; i > 0; i--) {
					for ( var j = 0; j < 4; j++) {
						M[i * 4 + j] += M[(i - 1) * 4 + j];
					}
				}
				strand[k] = new structures.Atom('', M[12] / M[15], M[13] / M[15], M[14] / M[15]);
			}
			segments[l] = strand;
		}
		if (useArrows && this.arrow) {
			for ( var i = 0, ii = verticalResolution; i < ii; i++) {
				var mult = 1.5 - 1.3 * i / verticalResolution;
				var mid = m.floor(this.horizontalResolution / 2);
				var center = segments[mid];
				for ( var j = 0, jj = segments.length; j < jj; j++) {
					if (j !== mid) {
						var o = center[i];
						var f = segments[j][i];
						var vec = [ f.x - o.x, f.y - o.y, f.z - o.z ];
						v3.scale(vec, mult);
						f.x = o.x + vec[0];
						f.y = o.y + vec[1];
						f.z = o.z + vec[2];
					}
				}
			}
		}
		return segments;
	};

})(ChemDoodle.structures, Math, mat4, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4402 $
//  $Author: kevin $
//  $LastChangedDate: 2013-06-08 14:47:08 -0400 (Sat, 08 Jun 2013) $
//

(function(extensions, structures, math, q, m) {
	'use strict';
	structures.Spectrum = function() {
		this.data = [];
		this.metadata = [];
		this.dataDisplay = [];
		this.memory = {
			offsetTop : 0,
			offsetLeft : 0,
			offsetBottom : 0,
			flipXAxis : false,
			scale : 1,
			width : 0,
			height : 0
		};
	};
	var _ = structures.Spectrum.prototype;
	_.title = undefined;
	_.xUnit = undefined;
	_.yUnit = undefined;
	_.continuous = true;
	_.integrationSensitivity = 0.01;
	_.draw = function(ctx, specs, width, height) {
		if (this.specs) {
			specs = this.specs;
		}
		var offsetTop = 5;
		var offsetLeft = 0;
		var offsetBottom = 0;
		// draw decorations
		ctx.fillStyle = specs.text_color;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'alphabetic';
		ctx.font = extensions.getFontString(specs.text_font_size, specs.text_font_families);
		if (this.xUnit) {
			offsetBottom += specs.text_font_size;
			ctx.fillText(this.xUnit, width / 2, height - 2);
		}
		if (this.yUnit && specs.plots_showYAxis) {
			offsetLeft += specs.text_font_size;
			ctx.save();
			ctx.translate(specs.text_font_size, height / 2);
			ctx.rotate(-m.PI / 2);
			ctx.fillText(this.yUnit, 0, 0);
			ctx.restore();
		}
		if (this.title) {
			offsetTop += specs.text_font_size;
			ctx.fillText(this.title, width / 2, specs.text_font_size);
		}
		// draw ticks
		offsetBottom += 5 + specs.text_font_size;
		if (specs.plots_showYAxis) {
			offsetLeft += 5 + ctx.measureText('1000').width;
		}
		if (specs.plots_showGrid) {
			ctx.strokeStyle = specs.plots_gridColor;
			ctx.lineWidth = specs.plots_gridLineWidth;
			ctx.strokeRect(offsetLeft, offsetTop, width - offsetLeft, height - offsetBottom - offsetTop);
		}
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		var span = this.maxX - this.minX;
		var t = span / 100;
		var major = .001;
		while (major < t || span / major > 25) {
			major *= 10;
		}
		var counter = 0;
		var overlapX = specs.plots_flipXAxis ? width : 0;
		for ( var i = m.round(this.minX / major) * major; i <= this.maxX; i += major / 2) {
			var x = this.getTransformedX(i, specs, width, offsetLeft);
			if (x > offsetLeft) {
				ctx.strokeStyle = 'black';
				ctx.lineWidth = 1;
				if (counter % 2 === 0) {
					ctx.beginPath();
					ctx.moveTo(x, height - offsetBottom);
					ctx.lineTo(x, height - offsetBottom + 2);
					ctx.stroke();
					var s = i.toFixed(5);
					while (s.charAt(s.length - 1) === '0') {
						s = s.substring(0, s.length - 1);
					}
					if (s.charAt(s.length - 1) === '.') {
						s = s.substring(0, s.length - 1);
					}
					// do this to avoid label overlap
					var numWidth = ctx.measureText(s).width;
					if (specs.plots_flipXAxis) {
						numWidth *= -1;
					}
					var ls = x - numWidth / 2;
					if (specs.plots_flipXAxis ? ls < overlapX : ls > overlapX) {
						ctx.fillText(s, x, height - offsetBottom + 2);
						overlapX = x + numWidth / 2;
					}
					if (specs.plots_showGrid) {
						ctx.strokeStyle = specs.plots_gridColor;
						ctx.lineWidth = specs.plots_gridLineWidth;
						ctx.beginPath();
						ctx.moveTo(x, height - offsetBottom);
						ctx.lineTo(x, offsetTop);
						ctx.stroke();
					}
				} else {
					ctx.beginPath();
					ctx.moveTo(x, height - offsetBottom);
					ctx.lineTo(x, height - offsetBottom + 2);
					ctx.stroke();
				}
			}
			counter++;
		}
		if (specs.plots_showYAxis || specs.plots_showGrid) {
			var spany = 1 / specs.scale;
			var counter = 0;
			ctx.textAlign = 'right';
			ctx.textBaseline = 'middle';
			for ( var i = 0; i <= 10; i++) {
				var yval = spany / 10 * i;
				var y = offsetTop + (height - offsetBottom - offsetTop) * (1 - yval * specs.scale);
				if (specs.plots_showGrid) {
					ctx.strokeStyle = specs.plots_gridColor;
					ctx.lineWidth = specs.plots_gridLineWidth;
					ctx.beginPath();
					ctx.moveTo(offsetLeft, y);
					ctx.lineTo(width, y);
					ctx.stroke();
				}
				if (specs.plots_showYAxis) {
					ctx.strokeStyle = 'black';
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(offsetLeft, y);
					ctx.lineTo(offsetLeft - 3, y);
					ctx.stroke();
					var val = yval * 100;
					var cutoff = m.max(0, 3 - m.floor(val).toString().length);
					var s = val.toFixed(cutoff);
					if (cutoff > 0) {
						while (s.charAt(s.length - 1) === '0') {
							s = s.substring(0, s.length - 1);
						}
					}
					if (s.charAt(s.length - 1) === '.') {
						s = s.substring(0, s.length - 1);
					}
					ctx.fillText(s, offsetLeft - 3, y);
				}
			}
		}
		// draw axes
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1;
		ctx.beginPath();
		// draw x axis
		ctx.moveTo(width, height - offsetBottom);
		ctx.lineTo(offsetLeft, height - offsetBottom);
		// draw y axis
		if (specs.plots_showYAxis) {
			ctx.lineTo(offsetLeft, offsetTop);
		}
		ctx.stroke();
		// draw metadata
		if (this.dataDisplay.length > 0) {
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			var mcount = 0;
			for ( var i = 0, ii = this.dataDisplay.length; i < ii; i++) {
				if (this.dataDisplay[i].value) {
					ctx.fillText([ this.dataDisplay[i].display, ': ', this.dataDisplay[i].value ].join(''), offsetLeft + 10, offsetTop + 10 + mcount * (specs.text_font_size + 5));
					mcount++;
				} else if (this.dataDisplay[i].tag) {
					for ( var j = 0, jj = this.metadata.length; j < jj; j++) {
						if (extensions.stringStartsWith(this.metadata[j], this.dataDisplay[i].tag)) {
							var draw = this.metadata[j];
							if (this.dataDisplay[i].display) {
								var index = this.metadata[j].indexOf('=');
								draw = [ this.dataDisplay[i].display, ': ', index > -1 ? this.metadata[j].substring(index + 2) : this.metadata[j] ].join('');
							}
							ctx.fillText(draw, offsetLeft + 10, offsetTop + 10 + mcount * (specs.text_font_size + 5));
							mcount++;
							break;
						}
					}
				}
			}
		}
		this.drawPlot(ctx, specs, width, height, offsetTop, offsetLeft, offsetBottom);
		this.memory.offsetTop = offsetTop;
		this.memory.offsetLeft = offsetLeft;
		this.memory.offsetBottom = offsetBottom;
		this.memory.flipXAxis = specs.plots_flipXAxis;
		this.memory.scale = specs.scale;
		this.memory.width = width;
		this.memory.height = height;
	};
	_.drawPlot = function(ctx, specs, width, height, offsetTop, offsetLeft, offsetBottom) {
		if (this.specs) {
			specs = this.specs;
		}
		ctx.strokeStyle = specs.plots_color;
		ctx.lineWidth = specs.plots_width;
		var integration = [];
		ctx.beginPath();
		if (this.continuous) {
			var started = false;
			var counter = 0;
			for ( var i = 0, ii = this.data.length; i < ii; i++) {
				var x = this.getTransformedX(this.data[i].x, specs, width, offsetLeft);
				if (x >= offsetLeft && x < width) {
					var y = this.getTransformedY(this.data[i].y, specs, height, offsetBottom, offsetTop);
					if (specs.plots_showIntegration && m.abs(this.data[i].y) > this.integrationSensitivity) {
						integration.push(new structures.Point(this.data[i].x, this.data[i].y));
					}
					if (!started) {
						ctx.moveTo(x, y);
						started = true;
					}
					ctx.lineTo(x, y);
					counter++;
					if (counter % 1000 === 0) {
						// segment the path to avoid crashing safari on mac
						// os x
						ctx.stroke();
						ctx.beginPath();
						ctx.moveTo(x, y);
					}
				} else if (started) {
					break;
				}
			}
		} else {
			for ( var i = 0, ii = this.data.length; i < ii; i++) {
				var x = this.getTransformedX(this.data[i].x, specs, width, offsetLeft);
				if (x >= offsetLeft && x < width) {
					ctx.moveTo(x, height - offsetBottom);
					ctx.lineTo(x, this.getTransformedY(this.data[i].y, specs, height, offsetBottom, offsetTop));
				}
			}
		}
		ctx.stroke();
		if (specs.plots_showIntegration && integration.length > 1) {
			ctx.strokeStyle = specs.plots_integrationColor;
			ctx.lineWidth = specs.plots_integrationLineWidth;
			ctx.beginPath();
			var ascending = integration[1].x > integration[0].x;
			var max;
			if (this.flipXAxis && !ascending || !this.flipXAxis && ascending) {
				for ( var i = integration.length - 2; i >= 0; i--) {
					integration[i].y = integration[i].y + integration[i + 1].y;
				}
				max = integration[0].y;
			} else {
				for ( var i = 1, ii = integration.length; i < ii; i++) {
					integration[i].y = integration[i].y + integration[i - 1].y;
				}
				max = integration[integration.length - 1].y;
			}
			for ( var i = 0, ii = integration.length; i < ii; i++) {
				var x = this.getTransformedX(integration[i].x, specs, width, offsetLeft);
				var y = this.getTransformedY(integration[i].y / specs.scale / max, specs, height, offsetBottom, offsetTop);
				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.stroke();
		}
	};
	_.getTransformedY = function(y, specs, height, offsetBottom, offsetTop) {
		return offsetTop + (height - offsetBottom - offsetTop) * (1 - y * specs.scale);
	};
	_.getInverseTransformedY = function(y) {
		// can only be called after a render when memory is set, this
		// function doesn't make sense without a render first anyway
		return (1 - (y - this.memory.offsetTop) / (this.memory.height - this.memory.offsetBottom - this.memory.offsetTop)) / this.memory.scale * 100;
	};
	_.getTransformedX = function(x, specs, width, offsetLeft) {
		var returning = offsetLeft + (x - this.minX) / (this.maxX - this.minX) * (width - offsetLeft);
		if (specs.plots_flipXAxis) {
			returning = width + offsetLeft - returning;
		}
		return returning;
	};
	_.getInverseTransformedX = function(x) {
		// can only be called after a render when memory is set, this
		// function doesn't make sense without a render first anyway
		if (this.memory.flipXAxis) {
			x = this.memory.width + this.memory.offsetLeft - x;
		}
		return (x - this.memory.offsetLeft) * (this.maxX - this.minX) / (this.memory.width - this.memory.offsetLeft) + this.minX;
	};
	_.setup = function() {
		var xmin = Number.MAX_VALUE;
		var xmax = Number.MIN_VALUE;
		var ymax = Number.MIN_VALUE;
		for ( var i = 0, ii = this.data.length; i < ii; i++) {
			xmin = m.min(xmin, this.data[i].x);
			xmax = m.max(xmax, this.data[i].x);
			ymax = m.max(ymax, this.data[i].y);
		}
		if (this.continuous) {
			this.minX = xmin;
			this.maxX = xmax;
		} else {
			this.minX = xmin - 1;
			this.maxX = xmax + 1;
		}
		for ( var i = 0, ii = this.data.length; i < ii; i++) {
			this.data[i].y /= ymax;
		}
	};
	_.zoom = function(pixel1, pixel2, width, rescaleY) {
		var p1 = this.getInverseTransformedX(pixel1);
		var p2 = this.getInverseTransformedX(pixel2);
		this.minX = m.min(p1, p2);
		this.maxX = m.max(p1, p2);
		if (rescaleY) {
			var ymax = Number.MIN_VALUE;
			for ( var i = 0, ii = this.data.length; i < ii; i++) {
				if (math.isBetween(this.data[i].x, this.minX, this.maxX)) {
					ymax = m.max(ymax, this.data[i].y);
				}
			}
			return 1 / ymax;
		}
	};
	_.translate = function(dif, width) {
		var dist = dif / (width - this.memory.offsetLeft) * (this.maxX - this.minX) * (this.memory.flipXAxis ? 1 : -1);
		this.minX += dist;
		this.maxX += dist;
	};
	_.alertMetadata = function() {
		alert(this.metadata.join('\n'));
	};
	_.getInternalCoordinates = function(x, y) {
		return new ChemDoodle.structures.Point(this.getInverseTransformedX(x), this.getInverseTransformedY(y));
	};
	_.getClosestPlotInternalCoordinates = function(x) {
		var xtl = this.getInverseTransformedX(x - 1);
		var xtr = this.getInverseTransformedX(x + 1);
		if (xtl > xtr) {
			var temp = xtl;
			xtl = xtr;
			xtr = temp;
		}
		var highest = -1;
		var max = -Infinity;
		var inRange = false;
		for ( var i = 0, ii = this.data.length; i < ii; i++) {
			var p = this.data[i];
			if (math.isBetween(p.x, xtl, xtr)) {
				if (p.y > max) {
					inRange = true;
					max = p.y;
					highest = i;
				}
			} else if (inRange) {
				break;
			}
		}
		if (highest === -1) {
			return undefined;
		}
		var p = this.data[highest];
		return new ChemDoodle.structures.Point(p.x, p.y * 100);
	};
	_.getClosestPeakInternalCoordinates = function(x) {
		var xt = this.getInverseTransformedX(x);
		var closest = 0;
		var dif = Infinity;
		for ( var i = 0, ii = this.data.length; i < ii; i++) {
			var sub = m.abs(this.data[i].x - xt);
			if (sub <= dif) {
				dif = sub;
				closest = i;
			} else {
				break;
			}
		}
		var highestLeft = highestRight = closest;
		var maxLeft = maxRight = this.data[closest].y;
		for ( var i = closest + 1, ii = this.data.length; i < ii; i++) {
			if (this.data[i].y + .05 > maxRight) {
				maxRight = this.data[i].y;
				highestRight = i;
			} else {
				break;
			}
		}
		for ( var i = closest - 1; i >= 0; i--) {
			if (this.data[i].y + .05 > maxLeft) {
				maxLeft = this.data[i].y;
				highestLeft = i;
			} else {
				break;
			}
		}
		var p = this.data[highestLeft - closest > highestRight - closest ? highestRight : highestLeft];
		return new ChemDoodle.structures.Point(p.x, p.y * 100);
	};

})(ChemDoodle.extensions, ChemDoodle.structures, ChemDoodle.math, jQuery, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3385 $
//  $Author: kevin $
//  $LastChangedDate: 2011-09-18 11:40:07 -0400 (Sun, 18 Sep 2011) $
//

(function(math, d2, m) {
	'use strict';
	d2._Shape = function() {
	};
	var _ = d2._Shape.prototype;
	_.drawDecorations = function(ctx, specs) {
		if (this.isHover) {
			var ps = this.getPoints();
			for ( var i = 0, ii = ps.length; i < ii; i++) {
				var p = ps[i];
				this.drawAnchor(ctx, specs, p, p === this.hoverPoint);
			}
		}
	};
	_.getBounds = function() {
		var bounds = new math.Bounds();
		var ps = this.getPoints();
		for ( var i = 0, ii = ps.length; i < ii; i++) {
			var p = ps[i];
			bounds.expand(p.x, p.y);
		}
		return bounds;
	};
	_.drawAnchor = function(ctx, specs, p, hovered) {
		ctx.save();
		ctx.translate(p.x, p.y);
		ctx.rotate(m.PI / 4);
		ctx.scale(1 / specs.scale, 1 / specs.scale);
		var boxRadius = 4;
		var innerRadius = boxRadius / 2;

		ctx.beginPath();
		ctx.moveTo(-boxRadius, -boxRadius);
		ctx.lineTo(boxRadius, -boxRadius);
		ctx.lineTo(boxRadius, boxRadius);
		ctx.lineTo(-boxRadius, boxRadius);
		ctx.closePath();
		if (hovered) {
			ctx.fillStyle = '#885110';
		} else {
			ctx.fillStyle = 'white';
		}
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(-boxRadius, -innerRadius);
		ctx.lineTo(-boxRadius, -boxRadius);
		ctx.lineTo(-innerRadius, -boxRadius);
		ctx.moveTo(innerRadius, -boxRadius);
		ctx.lineTo(boxRadius, -boxRadius);
		ctx.lineTo(boxRadius, -innerRadius);
		ctx.moveTo(boxRadius, innerRadius);
		ctx.lineTo(boxRadius, boxRadius);
		ctx.lineTo(innerRadius, boxRadius);
		ctx.moveTo(-innerRadius, boxRadius);
		ctx.lineTo(-boxRadius, boxRadius);
		ctx.lineTo(-boxRadius, innerRadius);
		ctx.moveTo(-boxRadius, -innerRadius);

		ctx.strokeStyle = 'rgba(0,0,0,.2)';
		ctx.lineWidth = 5;
		ctx.stroke();
		ctx.strokeStyle = 'blue';
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.restore();
	};

})(ChemDoodle.math, ChemDoodle.structures.d2, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3462 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-05 15:33:29 -0500 (Thu, 05 Jan 2012) $
//

(function(extensions, math, structures, d2, m) {
	'use strict';
	d2.Bracket = function(p1, p2) {
		this.p1 = p1 ? p1 : new structures.Point();
		this.p2 = p2 ? p2 : new structures.Point();
	};
	var _ = d2.Bracket.prototype = new d2._Shape();
	_.charge = 0;
	_.mult = 0;
	_.repeat = 0;
	_.draw = function(ctx, specs) {
		var minX = m.min(this.p1.x, this.p2.x);
		var maxX = m.max(this.p1.x, this.p2.x);
		var minY = m.min(this.p1.y, this.p2.y);
		var maxY = m.max(this.p1.y, this.p2.y);
		var w = maxX - minX;
		var h = maxY - minY;
		var lip = h / 10;
		ctx.beginPath();
		ctx.moveTo(minX + lip, minY);
		ctx.lineTo(minX, minY);
		ctx.lineTo(minX, maxY);
		ctx.lineTo(minX + lip, maxY);
		ctx.moveTo(maxX - lip, maxY);
		ctx.lineTo(maxX, maxY);
		ctx.lineTo(maxX, minY);
		ctx.lineTo(maxX - lip, minY);
		if (this.isLassoed) {
			var grd = ctx.createLinearGradient(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
			grd.addColorStop(0, 'rgba(212, 99, 0, 0)');
			grd.addColorStop(0.5, 'rgba(212, 99, 0, 0.8)');
			grd.addColorStop(1, 'rgba(212, 99, 0, 0)');
			ctx.lineWidth = specs.shapes_lineWidth_2D + 5;
			ctx.strokeStyle = grd;
			ctx.lineJoin = 'miter';
			ctx.lineCap = 'square';
			ctx.stroke();
		}
		ctx.strokeStyle = specs.shapes_color;
		ctx.lineWidth = specs.shapes_lineWidth_2D;
		ctx.lineJoin = 'miter';
		ctx.lineCap = 'butt';
		ctx.stroke();
		if (this.charge !== 0) {
			ctx.fillStyle = specs.text_color;
			ctx.textAlign = 'left';
			ctx.textBaseline = 'alphabetic';
			ctx.font = extensions.getFontString(specs.text_font_size, specs.text_font_families);
			var s = this.charge.toFixed(0);
			if (s === '1') {
				s = '+';
			} else if (s === '-1') {
				s = '\u2013';
			} else if (extensions.stringStartsWith(s, '-')) {
				s = s.substring(1) + '\u2013';
			} else {
				s += '+';
			}
			ctx.fillText(s, maxX + 5, minY + 5);
		}
		if (this.mult !== 0) {
			ctx.fillStyle = specs.text_color;
			ctx.textAlign = 'right';
			ctx.textBaseline = 'middle';
			ctx.font = extensions.getFontString(specs.text_font_size, specs.text_font_families);
			ctx.fillText(this.mult.toFixed(0), minX - 5, minY + h / 2);
		}
		if (this.repeat !== 0) {
			ctx.fillStyle = specs.text_color;
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			ctx.font = extensions.getFontString(specs.text_font_size, specs.text_font_families);
			var s = this.repeat.toFixed(0);
			ctx.fillText(s, maxX + 5, maxY - 5);
		}
	};
	_.getPoints = function() {
		return [ this.p1, this.p2 ];
	};
	_.isOver = function(p, barrier) {
		return math.isBetween(p.x, this.p1.x, this.p2.x) && math.isBetween(p.y, this.p1.y, this.p2.y);
	};

})(ChemDoodle.extensions, ChemDoodle.math, ChemDoodle.structures, ChemDoodle.structures.d2, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3462 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-05 15:33:29 -0500 (Thu, 05 Jan 2012) $
//

(function(math, structures, d2, m) {
	'use strict';
	d2.Line = function(p1, p2) {
		this.p1 = p1 ? p1 : new structures.Point();
		this.p2 = p2 ? p2 : new structures.Point();
	};
	d2.Line.ARROW_SYNTHETIC = 'synthetic';
	d2.Line.ARROW_RETROSYNTHETIC = 'retrosynthetic';
	d2.Line.ARROW_RESONANCE = 'resonance';
	d2.Line.ARROW_EQUILIBRIUM = 'equilibrium';
	var _ = d2.Line.prototype = new d2._Shape();
	_.arrowType = undefined;
	_.topText = undefined;
	_.bottomText = undefined;
	_.draw = function(ctx, specs) {
		if (this.isLassoed) {
			var grd = ctx.createLinearGradient(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
			grd.addColorStop(0, 'rgba(212, 99, 0, 0)');
			grd.addColorStop(0.5, 'rgba(212, 99, 0, 0.8)');
			grd.addColorStop(1, 'rgba(212, 99, 0, 0)');
			var useDist = 2.5;
			var perpendicular = this.p1.angle(this.p2) + m.PI / 2;
			var mcosp = m.cos(perpendicular);
			var msinp = m.sin(perpendicular);
			var cx1 = this.p1.x - mcosp * useDist;
			var cy1 = this.p1.y + msinp * useDist;
			var cx2 = this.p1.x + mcosp * useDist;
			var cy2 = this.p1.y - msinp * useDist;
			var cx3 = this.p2.x + mcosp * useDist;
			var cy3 = this.p2.y - msinp * useDist;
			var cx4 = this.p2.x - mcosp * useDist;
			var cy4 = this.p2.y + msinp * useDist;
			ctx.fillStyle = grd;
			ctx.beginPath();
			ctx.moveTo(cx1, cy1);
			ctx.lineTo(cx2, cy2);
			ctx.lineTo(cx3, cy3);
			ctx.lineTo(cx4, cy4);
			ctx.closePath();
			ctx.fill();
		}
		ctx.strokeStyle = specs.shapes_color;
		ctx.fillStyle = specs.shapes_color;
		ctx.lineWidth = specs.shapes_lineWidth_2D;
		ctx.lineJoin = 'miter';
		ctx.lineCap = 'butt';
		if (this.p1.x !== this.p2.x || this.p1.y !== this.p2.y) {
			// only render if the points are different, otherwise this will
			// cause fill overflows
			if (this.arrowType === d2.Line.ARROW_RETROSYNTHETIC) {
				var r2 = m.sqrt(2) * 2;
				var useDist = specs.shapes_arrowLength_2D / r2;
				var angle = this.p1.angle(this.p2);
				var perpendicular = angle + m.PI / 2;
				var retract = specs.shapes_arrowLength_2D / r2;
				var mcosa = m.cos(angle);
				var msina = m.sin(angle);
				var mcosp = m.cos(perpendicular);
				var msinp = m.sin(perpendicular);
				var cx1 = this.p1.x - mcosp * useDist;
				var cy1 = this.p1.y + msinp * useDist;
				var cx2 = this.p1.x + mcosp * useDist;
				var cy2 = this.p1.y - msinp * useDist;
				var cx3 = this.p2.x + mcosp * useDist - mcosa * retract;
				var cy3 = this.p2.y - msinp * useDist + msina * retract;
				var cx4 = this.p2.x - mcosp * useDist - mcosa * retract;
				var cy4 = this.p2.y + msinp * useDist + msina * retract;
				var ax1 = this.p2.x + mcosp * useDist * 2 - mcosa * retract * 2;
				var ay1 = this.p2.y - msinp * useDist * 2 + msina * retract * 2;
				var ax2 = this.p2.x - mcosp * useDist * 2 - mcosa * retract * 2;
				var ay2 = this.p2.y + msinp * useDist * 2 + msina * retract * 2;
				ctx.beginPath();
				ctx.moveTo(cx2, cy2);
				ctx.lineTo(cx3, cy3);
				ctx.moveTo(ax1, ay1);
				ctx.lineTo(this.p2.x, this.p2.y);
				ctx.lineTo(ax2, ay2);
				ctx.moveTo(cx4, cy4);
				ctx.lineTo(cx1, cy1);
				ctx.stroke();
			} else if (this.arrowType === d2.Line.ARROW_EQUILIBRIUM) {
				var r2 = m.sqrt(2) * 2;
				var useDist = specs.shapes_arrowLength_2D / r2 / 2;
				var angle = this.p1.angle(this.p2);
				var perpendicular = angle + m.PI / 2;
				var retract = specs.shapes_arrowLength_2D * 2 / m.sqrt(3);
				var mcosa = m.cos(angle);
				var msina = m.sin(angle);
				var mcosp = m.cos(perpendicular);
				var msinp = m.sin(perpendicular);
				var cx1 = this.p1.x - mcosp * useDist;
				var cy1 = this.p1.y + msinp * useDist;
				var cx2 = this.p1.x + mcosp * useDist;
				var cy2 = this.p1.y - msinp * useDist;
				var cx3 = this.p2.x + mcosp * useDist;
				var cy3 = this.p2.y - msinp * useDist;
				var cx4 = this.p2.x - mcosp * useDist;
				var cy4 = this.p2.y + msinp * useDist;
				ctx.beginPath();
				ctx.moveTo(cx2, cy2);
				ctx.lineTo(cx3, cy3);
				ctx.moveTo(cx4, cy4);
				ctx.lineTo(cx1, cy1);
				ctx.stroke();
				// right arrow
				var rx1 = cx3 - mcosa * retract * .8;
				var ry1 = cy3 + msina * retract * .8;
				var ax1 = cx3 + mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract;
				var ay1 = cy3 - msinp * specs.shapes_arrowLength_2D / 3 + msina * retract;
				ctx.beginPath();
				ctx.moveTo(cx3, cy3);
				ctx.lineTo(ax1, ay1);
				ctx.lineTo(rx1, ry1);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
				// left arrow
				rx1 = cx1 + mcosa * retract * .8;
				ry1 = cy1 - msina * retract * .8;
				ax1 = cx1 - mcosp * specs.shapes_arrowLength_2D / 3 + mcosa * retract;
				ay1 = cy1 + msinp * specs.shapes_arrowLength_2D / 3 - msina * retract;
				ctx.beginPath();
				ctx.moveTo(cx1, cy1);
				ctx.lineTo(ax1, ay1);
				ctx.lineTo(rx1, ry1);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			} else if (this.arrowType === d2.Line.ARROW_SYNTHETIC) {
				var angle = this.p1.angle(this.p2);
				var perpendicular = angle + m.PI / 2;
				var retract = specs.shapes_arrowLength_2D * 2 / m.sqrt(3);
				var mcosa = m.cos(angle);
				var msina = m.sin(angle);
				var mcosp = m.cos(perpendicular);
				var msinp = m.sin(perpendicular);
				ctx.beginPath();
				ctx.moveTo(this.p1.x, this.p1.y);
				ctx.lineTo(this.p2.x - mcosa * retract / 2, this.p2.y + msina * retract / 2);
				ctx.stroke();
				var rx1 = this.p2.x - mcosa * retract * .8;
				var ry1 = this.p2.y + msina * retract * .8;
				var ax1 = this.p2.x + mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract;
				var ay1 = this.p2.y - msinp * specs.shapes_arrowLength_2D / 3 + msina * retract;
				var ax2 = this.p2.x - mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract;
				var ay2 = this.p2.y + msinp * specs.shapes_arrowLength_2D / 3 + msina * retract;
				ctx.beginPath();
				ctx.moveTo(this.p2.x, this.p2.y);
				ctx.lineTo(ax2, ay2);
				ctx.lineTo(rx1, ry1);
				ctx.lineTo(ax1, ay1);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			} else if (this.arrowType === d2.Line.ARROW_RESONANCE) {
				var angle = this.p1.angle(this.p2);
				var perpendicular = angle + m.PI / 2;
				var retract = specs.shapes_arrowLength_2D * 2 / m.sqrt(3);
				var mcosa = m.cos(angle);
				var msina = m.sin(angle);
				var mcosp = m.cos(perpendicular);
				var msinp = m.sin(perpendicular);
				ctx.beginPath();
				ctx.moveTo(this.p1.x + mcosa * retract / 2, this.p1.y - msina * retract / 2);
				ctx.lineTo(this.p2.x - mcosa * retract / 2, this.p2.y + msina * retract / 2);
				ctx.stroke();
				// right arrow
				var rx1 = this.p2.x - mcosa * retract * .8;
				var ry1 = this.p2.y + msina * retract * .8;
				var ax1 = this.p2.x + mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract;
				var ay1 = this.p2.y - msinp * specs.shapes_arrowLength_2D / 3 + msina * retract;
				var ax2 = this.p2.x - mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract;
				var ay2 = this.p2.y + msinp * specs.shapes_arrowLength_2D / 3 + msina * retract;
				ctx.beginPath();
				ctx.moveTo(this.p2.x, this.p2.y);
				ctx.lineTo(ax2, ay2);
				ctx.lineTo(rx1, ry1);
				ctx.lineTo(ax1, ay1);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
				// left arrow
				rx1 = this.p1.x + mcosa * retract * .8;
				ry1 = this.p1.y - msina * retract * .8;
				ax1 = this.p1.x - mcosp * specs.shapes_arrowLength_2D / 3 + mcosa * retract;
				ay1 = this.p1.y + msinp * specs.shapes_arrowLength_2D / 3 - msina * retract;
				ax2 = this.p1.x + mcosp * specs.shapes_arrowLength_2D / 3 + mcosa * retract;
				ay2 = this.p1.y - msinp * specs.shapes_arrowLength_2D / 3 - msina * retract;
				ctx.beginPath();
				ctx.moveTo(this.p1.x, this.p1.y);
				ctx.lineTo(ax2, ay2);
				ctx.lineTo(rx1, ry1);
				ctx.lineTo(ax1, ay1);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.moveTo(this.p1.x, this.p1.y);
				ctx.lineTo(this.p2.x, this.p2.y);
				ctx.stroke();
			}
			if(this.topText){
				ctx.textAlign = 'center';
				ctx.textBaseline = 'bottom';
				ctx.fillText(this.topText, (this.p1.x+this.p2.x)/2, this.p1.y-5);
			}
			if(this.bottomText){
				ctx.textAlign = 'center';
				ctx.textBaseline = 'top';
				ctx.fillText(this.bottomText, (this.p1.x+this.p2.x)/2, this.p1.y+5);
			}
		}
	};
	_.getPoints = function() {
		return [ this.p1, this.p2 ];
	};
	_.isOver = function(p, barrier) {
		var dist = math.distanceFromPointToLineInclusive(p, this.p1, this.p2);
		return dist !== -1 && dist < barrier;
	};

})(ChemDoodle.math, ChemDoodle.structures, ChemDoodle.structures.d2, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3462 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-05 15:33:29 -0500 (Thu, 05 Jan 2012) $
//

(function(math, jsb, structures, d2, m) {
	'use strict';
	var getPossibleAngles = function(o) {
		var as = [];
		if (o instanceof structures.Atom) {
			if (o.bondNumber === 0) {
				as.push(m.PI);
			} else if (o.angles) {
				if (o.angles.length === 1) {
					as.push(o.angles[0] + m.PI);
				} else {
					for ( var i = 1, ii = o.angles.length; i < ii; i++) {
						as.push(o.angles[i - 1] + (o.angles[i] - o.angles[i - 1]) / 2);
					}
					var firstIncreased = o.angles[0] + m.PI * 2;
					var last = o.angles[o.angles.length - 1];
					as.push(last + (firstIncreased - last) / 2);
				}
				if (o.largestAngle > m.PI) {
					// always use angle of least interfearence if it is greater
					// than 120
					as = [ o.angleOfLeastInterference ];
				}
				if (o.bonds) {
					// point up towards a carbonyl
					for ( var i = 0, ii = o.bonds.length; i < ii; i++) {
						var b = o.bonds[i];
						if (b.bondOrder === 2) {
							var n = b.getNeighbor(o);
							if (n.label === 'O') {
								as = [ n.angle(o) ];
								break;
							}
						}
					}
				}
			}
		} else {
			var angle = o.a1.angle(o.a2);
			as.push(angle + m.PI / 2);
			as.push(angle + 3 * m.PI / 2);
		}
		for ( var i = 0, ii = as.length; i < ii; i++) {
			while (as[i] > m.PI * 2) {
				as[i] -= m.PI * 2;
			}
			while (as[i] < 0) {
				as[i] += m.PI * 2;
			}
		}
		return as;
	};
	var getPullBack = function(o, specs) {
		var pullback = 3;
		if (o instanceof structures.Atom) {
			if (o.isLabelVisible(specs)) {
				pullback = 8;
			}
			if (o.charge !== 0 || o.numRadical !== 0 || o.numLonePair !== 0) {
				pullback = 13;
			}
		} else if (o instanceof structures.Point) {
			// this is the midpoint of a bond forming pusher
			pullback = 0;
		} else {
			if (o.bondOrder > 1) {
				pullback = 5;
			}
		}
		return pullback;
	};
	var drawPusher = function(ctx, specs, o1, o2, p1, c1, c2, p2, numElectron, caches) {
		var angle1 = c1.angle(p1);
		var angle2 = c2.angle(p2);
		var perpendicular = angle1 + m.PI / 2;
		var mcosa = m.cos(angle1);
		var msina = m.sin(angle1);
		// pull back from start
		var pullBack = getPullBack(o1, specs);
		p1.x -= mcosa * pullBack;
		p1.y += msina * pullBack;
		// arrow
		var perpendicular = angle2 + m.PI / 2;
		var retract = specs.shapes_arrowLength_2D * 2 / m.sqrt(3);
		var mcosa = m.cos(angle2);
		var msina = m.sin(angle2);
		var mcosp = m.cos(perpendicular);
		var msinp = m.sin(perpendicular);
		p2.x -= mcosa * 5;
		p2.y += msina * 5;
		var nap = new structures.Point(p2.x, p2.y);
		// pull back from end
		pullBack = getPullBack(o2, specs) / 3;
		nap.x -= mcosa * pullBack;
		nap.y += msina * pullBack;
		p2.x -= mcosa * (retract * 0.8 + pullBack);
		p2.y += msina * (retract * 0.8 + pullBack);
		var rx1 = nap.x - mcosa * retract * 0.8;
		var ry1 = nap.y + msina * retract * 0.8;
		var a1 = new structures.Point(nap.x + mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract, nap.y - msinp * specs.shapes_arrowLength_2D / 3 + msina * retract);
		var a2 = new structures.Point(nap.x - mcosp * specs.shapes_arrowLength_2D / 3 - mcosa * retract, nap.y + msinp * specs.shapes_arrowLength_2D / 3 + msina * retract);
		var include1 = true, include2 = true;
		if (numElectron === 1) {
			if (a1.distance(c1) > a2.distance(c1)) {
				include2 = false;
			} else {
				include1 = false;
			}
		}
		ctx.beginPath();
		ctx.moveTo(nap.x, nap.y);
		if (include2) {
			ctx.lineTo(a2.x, a2.y);
		}
		ctx.lineTo(rx1, ry1);
		if (include1) {
			ctx.lineTo(a1.x, a1.y);
		}
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		// bezier
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y);
		ctx.stroke();
		caches.push([ p1, c1, c2, p2 ]);
	};

	d2.Pusher = function(o1, o2, numElectron) {
		this.o1 = o1;
		this.o2 = o2;
		this.numElectron = numElectron ? numElectron : 1;
	};
	var _ = d2.Pusher.prototype = new d2._Shape();
	_.drawDecorations = function(ctx, specs) {
		if (this.isHover) {
			var p1 = this.o1 instanceof structures.Atom ? new structures.Point(this.o1.x, this.o1.y) : this.o1.getCenter();
			var p2 = this.o2 instanceof structures.Atom ? new structures.Point(this.o2.x, this.o2.y) : this.o2.getCenter();
			var ps = [ p1, p2 ];
			for ( var i = 0, ii = ps.length; i < ii; i++) {
				var p = ps[i];
				this.drawAnchor(ctx, specs, p, p === this.hoverPoint);
			}
		}
	};
	_.draw = function(ctx, specs) {
		if (this.o1 && this.o2) {
			ctx.strokeStyle = specs.shapes_color;
			ctx.fillStyle = specs.shapes_color;
			ctx.lineWidth = specs.shapes_lineWidth_2D;
			ctx.lineJoin = 'miter';
			ctx.lineCap = 'butt';
			var p1 = this.o1 instanceof structures.Atom ? new structures.Point(this.o1.x, this.o1.y) : this.o1.getCenter();
			var p2 = this.o2 instanceof structures.Atom ? new structures.Point(this.o2.x, this.o2.y) : this.o2.getCenter();
			var controlDist = 35;
			var as1 = getPossibleAngles(this.o1);
			var as2 = getPossibleAngles(this.o2);
			var c1, c2;
			var minDif = Infinity;
			for ( var i = 0, ii = as1.length; i < ii; i++) {
				for ( var j = 0, jj = as2.length; j < jj; j++) {
					var c1c = new structures.Point(p1.x + controlDist * m.cos(as1[i]), p1.y - controlDist * m.sin(as1[i]));
					var c2c = new structures.Point(p2.x + controlDist * m.cos(as2[j]), p2.y - controlDist * m.sin(as2[j]));
					var dif = c1c.distance(c2c);
					if (dif < minDif) {
						minDif = dif;
						c1 = c1c;
						c2 = c2c;
					}
				}
			}
			this.caches = [];
			if (this.numElectron === -1) {
				var dist = p1.distance(p2)/2;
				var angle = p1.angle(p2);
				var perp = angle+m.PI/2;
				var mcosa = m.cos(angle);
				var msina = m.sin(angle);
				var m1 = new structures.Point(p1.x+(dist-1)*mcosa, p1.y-(dist-1)*msina);
				var cm1 = new structures.Point(m1.x+m.cos(perp+m.PI/6)*controlDist, m1.y - m.sin(perp+m.PI/6)*controlDist);
				var m2 = new structures.Point(p1.x+(dist+1)*mcosa, p1.y-(dist+1)*msina);
				var cm2 = new structures.Point(m2.x+m.cos(perp-m.PI/6)*controlDist, m2.y - m.sin(perp-m.PI/6)*controlDist);
				drawPusher(ctx, specs, this.o1, m1, p1, c1, cm1, m1, 1, this.caches);
				drawPusher(ctx, specs, this.o2, m2, p2, c2, cm2, m2, 1, this.caches);
			} else {
				if (math.intersectLines(p1.x, p1.y, c1.x, c1.y, p2.x, p2.y, c2.x, c2.y)) {
					var tmp = c1;
					c1 = c2;
					c2 = tmp;
				}
				// try to clean up problems, like loops
				var angle1 = c1.angle(p1);
				var angle2 = c2.angle(p2);
				var angleDif = (m.max(angle1, angle2) - m.min(angle1, angle2));
				if (m.abs(angleDif - m.PI) < .001 && this.o1.molCenter === this.o2.molCenter) {
					// in the case where the control tangents are parallel
					angle1 += m.PI / 2;
					angle2 -= m.PI / 2;
					c1.x = p1.x + controlDist * m.cos(angle1 + m.PI);
					c1.y = p1.y - controlDist * m.sin(angle1 + m.PI);
					c2.x = p2.x + controlDist * m.cos(angle2 + m.PI);
					c2.y = p2.y - controlDist * m.sin(angle2 + m.PI);
				}
				drawPusher(ctx, specs, this.o1, this.o2, p1, c1, c2, p2, this.numElectron, this.caches);
			}
		}
	};
	_.getPoints = function() {
		return [];
	};
	_.isOver = function(p, barrier) {
		for ( var i = 0, ii = this.caches.length; i < ii; i++) {
			var r = jsb.distanceFromCurve(p, this.caches[i]);
			if (r.distance < barrier) {
				return true;
			}
		}
		return false;
	};

})(ChemDoodle.math, ChemDoodle.math.jsBezier, ChemDoodle.structures, ChemDoodle.structures.d2, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3385 $
//  $Author: kevin $
//  $LastChangedDate: 2011-09-18 11:40:07 -0400 (Sun, 18 Sep 2011) $
//

(function(d3, m) {
	'use strict';
	d3._Mesh = function() {
	};
	var _ = d3._Mesh.prototype;
	_.storeData = function(positionData, normalData, indexData) {
		this.positionData = positionData;
		this.normalData = normalData;
		this.indexData = indexData;
	};
	_.setupBuffers = function(gl) {
		this.vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positionData), gl.STATIC_DRAW);
		this.vertexPositionBuffer.itemSize = 3;
		this.vertexPositionBuffer.numItems = this.positionData.length / 3;

		this.vertexNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalData), gl.STATIC_DRAW);
		this.vertexNormalBuffer.itemSize = 3;
		this.vertexNormalBuffer.numItems = this.normalData.length / 3;

		if (this.indexData) {
			this.vertexIndexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexData), gl.STATIC_DRAW);
			this.vertexIndexBuffer.itemSize = 1;
			this.vertexIndexBuffer.numItems = this.indexData.length;
		}

		if (this.partitions) {
			for ( var i = 0, ii = this.partitions.length; i < ii; i++) {
				var p = this.partitions[i];
				var buffers = this.generateBuffers(gl, p.positionData, p.normalData, p.indexData);
				p.vertexPositionBuffer = buffers[0];
				p.vertexNormalBuffer = buffers[1];
				p.vertexIndexBuffer = buffers[2];
			}
		}
	};
	_.generateBuffers = function(gl, positionData, normalData, indexData) {
		var vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);
		vertexPositionBuffer.itemSize = 3;
		vertexPositionBuffer.numItems = positionData.length / 3;

		var vertexNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
		vertexNormalBuffer.itemSize = 3;
		vertexNormalBuffer.numItems = normalData.length / 3;

		var vertexIndexBuffer;
		if (indexData) {
			vertexIndexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
			vertexIndexBuffer.itemSize = 1;
			vertexIndexBuffer.numItems = indexData.length;
		}

		return [ vertexPositionBuffer, vertexNormalBuffer, vertexIndexBuffer ];
	};
	_.bindBuffers = function(gl) {
		if (!this.vertexPositionBuffer) {
			this.setupBuffers(gl);
		}
		// positions
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		gl.vertexAttribPointer(gl.shader.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		// normals
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
		gl.vertexAttribPointer(gl.shader.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		if (this.vertexIndexBuffer) {
			// indexes
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
		}
	};

})(ChemDoodle.structures.d3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(d3, m) {
	'use strict';
	d3.Arrow = function(radius, longitudeBands) {
		var positionData = [];
		var normalData = [];

		for ( var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
			var theta = longNumber * 2 * m.PI / longitudeBands;
			var sinTheta = m.sin(theta);
			var cosTheta = m.cos(theta);

			var x = cosTheta;
			var y = sinTheta;
			var z = 0;

			normalData.push(
			// base cylinder
			0, 0, -1, 0, 0, -1,
			// cylinder
			x, y, 0, x, y, 0,
			// base cone
			0, 0, -1, 0, 0, -1,
			// cone
			x, y, 1, x, y, 1);

			positionData.push(
			// base cylinder
			0, 0, 0, radius * x, radius * y, 0,
			// cylinder
			radius * x, radius * y, 0, radius * x, radius * y, 2,
			// base cone
			radius * x, radius * y, 2, radius * x * 2, radius * y * 2, 2,
			// cone
			radius * x * 2, radius * y * 2, 2, 0, 0, 3);
		}

		var indexData = [];
		for ( var i = 0; i < longitudeBands; i++) {
			var offset = i * 8;
			for ( var j = 0, jj = 7; j < jj; j++) {
				var first = j + offset;
				var second = first + 1;
				var third = first + jj + 2;
				var forth = third - 1;
				indexData.push(first, third, second, third, first, forth);
			}
		}

		this.storeData(positionData, normalData, indexData);
	};
	var _ = d3.Arrow.prototype = new d3._Mesh();
	_.getLength = function() {
		return 3;
	};

})(ChemDoodle.structures.d3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(d3, m, m4) {
	'use strict';
	d3.Compass = function(gl, specs) {
		// setup text X Y Z
		this.textImage = new d3.TextImage();
		this.textImage.init(gl);
		this.textImage.updateFont(gl, specs.text_font_size, specs.text_font_families, specs.text_font_bold, specs.text_font_italic, specs.text_font_stroke_3D);

		this.textMesh = new d3.TextMesh();
		this.textMesh.init(gl);

		var screenRatioHeight = specs.compass_size_3D / gl.canvas.clientHeight;

		var height = gl.arrowBuffer.getLength() / screenRatioHeight;
		var tanTheta = m.tan(specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * m.PI);
		var depth = height / tanTheta;
		var near = m.max(depth - height, 0.1);
		var far = depth + height;

		// var near = 0.1;
		// var far = 10000;

		var aspec = gl.canvas.clientWidth / gl.canvas.clientHeight;

		var deltaX = -(gl.canvas.clientWidth - specs.compass_size_3D) / 2 + this.textImage.charHeight;
		var deltaY = -(gl.canvas.clientHeight - specs.compass_size_3D) / 2 + this.textImage.charHeight;

		var fnProjection, z;

		if (specs.projectionPerspective_3D) {
			z = near;
			fnProjection = m4.frustum;
		} else {
			z = depth;
			fnProjection = m4.ortho;
		}

		var nearRatio = z / gl.canvas.clientHeight * 2 * tanTheta;
		var x = deltaX * nearRatio;
		var y = deltaY * nearRatio;
		var top = tanTheta * z;
		var bottom = -top;
		var left = aspec * bottom;
		var right = aspec * top;

		this.projectionMatrix = fnProjection(left - x, right - x, bottom - y, top - y, near, far);
		this.translationMatrix = m4.translate(m4.identity([]), [ 0, 0, -depth ]);

		// vertex data for X Y Z text label
		var vertexData = {
			position : [],
			texCoord : [],
			translation : [],
			zDepth : []
		};

		this.textImage.pushVertexData('X', [ 3.5, 0, 0 ], 0, vertexData);
		this.textImage.pushVertexData('Y', [ 0, 3.5, 0 ], 0, vertexData);
		this.textImage.pushVertexData('Z', [ 0, 0, 3.5 ], 0, vertexData);

		this.textMesh.storeData(gl, vertexData.position, vertexData.texCoord, vertexData.translation, vertexData.zDepth);
	};

	var _ = d3.Compass.prototype;
	_.renderArrow = function(gl, color, mvMatrix) {
		gl.material.setDiffuseColor(color);
		gl.setMatrixUniforms(mvMatrix);
		gl.drawElements(gl.TRIANGLES, gl.arrowBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	};
	_.render = function(gl, specs) {
		gl.arrowBuffer.bindBuffers(gl);
		gl.material.setTempColors(specs.bonds_materialAmbientColor_3D, undefined, specs.bonds_materialSpecularColor_3D, specs.bonds_materialShininess_3D);

		var modelMatrix = m4.multiply(this.translationMatrix, gl.rotationMatrix, []);
		var angle = m.PI / 2;

		// compass not need Fogging effect (and other effect)
		gl.fogging.setMode(0);

		// x - axis
		this.renderArrow(gl, specs.compass_axisXColor_3D, m4.rotateY(modelMatrix, angle, []));

		// y-axis
		this.renderArrow(gl, specs.compass_axisYColor_3D, m4.rotateX(modelMatrix, -angle, []));

		// z-axis
		this.renderArrow(gl, specs.compass_axisZColor_3D, modelMatrix);
	};
	_.renderText = function(gl) {
		var modelMatrix = m4.multiply(this.translationMatrix, gl.rotationMatrix, []);
		gl.shaderText.setUniforms(gl, modelMatrix, this.projectionMatrix);
		this.textImage.useTexture(gl);
		this.textMesh.render(gl);
	};

})(ChemDoodle.structures.d3, Math, mat4);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(d3, m) {
	'use strict';
	d3.Cylinder = function(radius, height, bands) {
		var positionData = [];
		var normalData = [];
		for ( var i = 0; i < bands; i++) {
			var theta = i * 2 * m.PI / bands;
			var cosTheta = m.cos(theta);
			var sinTheta = m.sin(theta);
			normalData.push(cosTheta, 0, sinTheta);
			positionData.push(radius * cosTheta, 0, radius * sinTheta);
			normalData.push(cosTheta, 0, sinTheta);
			positionData.push(radius * cosTheta, height, radius * sinTheta);
		}
		normalData.push(1, 0, 0);
		positionData.push(radius, 0, 0);
		normalData.push(1, 0, 0);
		positionData.push(radius, height, 0);

		this.storeData(positionData, normalData);
	};
	d3.Cylinder.prototype = new d3._Mesh();

})(ChemDoodle.structures.d3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(math, d3, v3) {
	'use strict';

	d3.Fog = function(gl) {
		this.gl = gl;
		var prefix = 'u_fog.';
		this.mUL = gl.getUniformLocation(gl.program, prefix + 'mode');
		this.cUL = gl.getUniformLocation(gl.program, prefix + 'color');
		this.sUL = gl.getUniformLocation(gl.program, prefix + 'start');
		this.eUL = gl.getUniformLocation(gl.program, prefix + 'end');
		this.dUL = gl.getUniformLocation(gl.program, prefix + 'density');
	};

	var _ = d3.Fog.prototype;
	_.setTempParameter = function(color, fogStart, fogEnd, density) {
		if (!this.cCache || this.cCache !== color) {
			this.cCache = color;
			var cs = math.getRGB(color, 1);
			this.gl.uniform3f(this.cUL, cs[0], cs[1], cs[2]);
		}
		if (!this.sCache || this.sCache !== fogStart) {
			this.sCache = fogStart;
			this.gl.uniform1f(this.sUL, fogStart);
		}
		if (!this.eCache || this.eCache !== fogEnd) {
			this.eCache = fogEnd;
			this.gl.uniform1f(this.eUL, fogEnd);
		}
		if (!this.dCache || this.dCache !== density) {
			this.dCache = density;
			this.gl.uniform1f(this.dUL, density);
		}
	};
	_.setMode = function(mode) {
		if (!this.mCache || this.mCache !== mode) {
			this.mCache = mode;
			this.gl.uniform1i(this.mUL, mode);
		}
	};
})(ChemDoodle.math, ChemDoodle.structures.d3, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3994 $
//  $Author: kevin $
//  $LastChangedDate: 2012-12-13 18:52:20 -0500 (Thu, 13 Dec 2012) $
//

(function(ELEMENT, d3) {

	d3.Label = function() {
		this.textImage = new d3.TextImage();
	};
	var _ = d3.Label.prototype;
	_.init = function(gl, specs) {
		this.textImage.init(gl);
		this.textImage.updateFont(gl, specs.atoms_font_size_2D, specs.atoms_font_families_2D, specs.atoms_font_bold_2D, specs.atoms_font_italic_2D, specs.text_font_stroke_3D);
	};
	_.updateVerticesBuffer = function(gl, molecules, specs) {
		for ( var i = 0, ii = molecules.length; i < ii; i++) {
			var molecule = molecules[i];
			var moleculeLabel = molecule.labelMesh;
			var atoms = molecule.atoms;
			var textImage = this.textImage;
			var vertexData = {
				position : [],
				texCoord : [],
				translation : [],
				zDepth : []
			};

			var isMacro = atoms.length > 0 && atoms[0].hetatm != undefined;

			for ( var j = 0, jj = atoms.length; j < jj; j++) {
				var atom = atoms[j];
				
				var atomLabel = atom.label;
				var zDepth = 0.05;

				// Sphere or Ball and Stick
				if (specs.atoms_useVDWDiameters_3D) {
					var add = ELEMENT[atomLabel].vdWRadius * specs.atoms_vdwMultiplier_3D;
					if (add === 0) {
						add = 1;
					}
					zDepth += add;
				}
				// if Stick or Wireframe
				else if (specs.atoms_sphereDiameter_3D) {
					zDepth += specs.atoms_sphereDiameter_3D / 2 * 1.5;
				}

				if (isMacro) {
					if (!atom.hetatm) {
						if (!specs.macro_displayAtoms) {
							continue;
						}
					} else if (atom.isWater) {
						if (!specs.macro_showWaters) {
							continue;
						}
					}
				}
				
				textImage.pushVertexData(atomLabel, [ atom.x, atom.y, atom.z ], zDepth, vertexData);

			}

			var chains = molecule.chains;

			if (chains && (specs.proteins_displayRibbon || specs.proteins_displayBackbone)) {

				for ( var j = 0, jj = chains.length; j < jj; j++) {
					var chain = chains[j];

					for ( var k = 0, kk = chain.length; k < kk; k++) {
						var residue = chain[k];

						if (residue.name) {
							var atom = residue.cp1;
							textImage.pushVertexData(residue.name, [ atom.x, atom.y, atom.z ], 2, vertexData);
						}
					}
				}

			}

			moleculeLabel.storeData(gl, vertexData.position, vertexData.texCoord, vertexData.translation, vertexData.zDepth);

		}
	};
	_.render = function(gl, specs, molecules) {
		// use projection for shader text.
		gl.shaderText.setUniforms(gl, gl.modelViewMatrix, gl.projectionMatrix);

		this.textImage.useTexture(gl);
		for ( var i = 0, ii = molecules.length; i < ii; i++) {
			if (molecules[i].labelMesh) {
				molecules[i].labelMesh.render(gl);
			}
		}
	};

})(ChemDoodle.ELEMENT, ChemDoodle.structures.d3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4401 $
//  $Author: kevin $
//  $LastChangedDate: 2013-06-08 12:26:27 -0400 (Sat, 08 Jun 2013) $
//

(function(d3, m) {
	'use strict';
	d3.Sphere = function(radius, latitudeBands, longitudeBands) {
		var positionData = [];
		var normalData = [];
		for ( var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
			var theta = latNumber * m.PI / latitudeBands;
			var sinTheta = m.sin(theta);
			var cosTheta = m.cos(theta);

			for ( var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
				var phi = longNumber * 2 * m.PI / longitudeBands;
				var sinPhi = m.sin(phi);
				var cosPhi = m.cos(phi);

				var x = cosPhi * sinTheta;
				var y = cosTheta;
				var z = sinPhi * sinTheta;

				normalData.push(x, y, z);
				positionData.push(radius * x, radius * y, radius * z);
			}
		}

		var indexData = [];
		longitudeBands += 1;
		for ( var latNumber = 0; latNumber < latitudeBands; latNumber++) {
			for ( var longNumber = 0; longNumber < longitudeBands; longNumber++) {
				var first = (latNumber * longitudeBands) + (longNumber % longitudeBands);
				var second = first + longitudeBands;
				indexData.push(first, first + 1, second);
				if (longNumber < longitudeBands - 1) {
					indexData.push(second, first + 1, second + 1);
				}
			}
		}

		this.storeData(positionData, normalData, indexData);
	};
	d3.Sphere.prototype = new d3._Mesh();

})(ChemDoodle.structures.d3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(RESIDUE, d3, m, v3) {
	'use strict';
	var loadPartition = function(gl, p) {
		// positions
		gl.bindBuffer(gl.ARRAY_BUFFER, p.vertexPositionBuffer);
		gl.vertexAttribPointer(gl.shader.vertexPositionAttribute, p.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		// normals
		gl.bindBuffer(gl.ARRAY_BUFFER, p.vertexNormalBuffer);
		gl.vertexAttribPointer(gl.shader.vertexNormalAttribute, p.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		// indexes
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p.vertexIndexBuffer);
	};

	function SubRibbon(entire, name, indexes, pi) {
		this.entire = entire;
		this.name = name;
		this.indexes = indexes;
		this.pi = pi;
	}
	var _2 = SubRibbon.prototype;
	_2.getColor = function(specs) {
		if (specs.macro_colorByChain) {
			return this.chainColor;
		} else if (this.name) {
			return this.getResidueColor(RESIDUE[this.name] ? this.name : '*', specs);
		} else if (this.helix) {
			return this.entire.front ? specs.proteins_ribbonCartoonHelixPrimaryColor : specs.proteins_ribbonCartoonHelixSecondaryColor;
		} else if (this.sheet) {
			return specs.proteins_ribbonCartoonSheetColor;
		} else {
			return this.entire.front ? specs.proteins_primaryColor : specs.proteins_secondaryColor;
		}
	};
	_2.getResidueColor = function(name, specs) {
		var r = RESIDUE[name];
		if (specs.proteins_useShapelyColors) {
			return r.shapelyColor;
		} else if (specs.proteins_useAminoColors) {
			return r.aminoColor;
		} else if (specs.proteins_usePolarityColors) {
			if (r.polar) {
				return '#C10000';
			} else {
				return '#FFFFFF';
			}
		}
		return '#FFFFFF';
	};
	_2.render = function(gl, specs) {
		if (this.entire.partitions && this.pi !== this.entire.partitions.lastRender) {
			loadPartition(gl, this.entire.partitions[this.pi]);
			this.entire.partitions.lastRender = this.pi;
		}
		if (!this.vertexIndexBuffer) {
			this.vertexIndexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexes), gl.STATIC_DRAW);
			this.vertexIndexBuffer.itemSize = 1;
			this.vertexIndexBuffer.numItems = this.indexes.length;
		}
		// indexes
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
		// colors
		gl.material.setDiffuseColor(this.getColor(specs));
		// render
		gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	};

	d3.Ribbon = function(chain, offset, cartoon) {
		// ribbon meshes build front to back, not side to side, so keep this in
		// mind
		var lineSegmentNum = chain[0].lineSegments.length;
		var lineSegmentLength = chain[0].lineSegments[0].length;
		this.partitions = [];
		this.partitions.lastRender = 0;
		var currentPartition;
		this.front = offset > 0;
		// calculate vertex and normal points
		for ( var i = 0, ii = chain.length - 1; i < ii; i++) {
			if (!currentPartition || currentPartition.positionData.length > 65000) {
				if (this.partitions.length > 0) {
					i--;
				}
				currentPartition = {
					count : 0,
					positionData : [],
					normalData : [],
					indexData : []
				};
				this.partitions.push(currentPartition);
			}
			var residue = chain[i];
			currentPartition.count++;
			for ( var j = 0; j < lineSegmentNum; j++) {
				var lineSegment = cartoon ? residue.lineSegmentsCartoon[j] : residue.lineSegments[j];
				var doSide1 = j === 0;
				var doSide2 = false;
				for ( var k = 0; k < lineSegmentLength; k++) {
					var a = lineSegment[k];
					// normals
					var abovei = i;
					var abovek = k + 1;
					if (i === chain.length - 2 && k === lineSegmentLength - 1) {
						abovek--;
					} else if (k === lineSegmentLength - 1) {
						abovei++;
						abovek = 0;
					}
					var above = cartoon ? chain[abovei].lineSegmentsCartoon[j][abovek] : chain[abovei].lineSegments[j][abovek];
					var negate = false;
					var nextj = j + 1;
					if (j === lineSegmentNum - 1) {
						nextj -= 2;
						negate = true;
					}
					var side = cartoon ? residue.lineSegmentsCartoon[nextj][k] : residue.lineSegments[nextj][k];
					var toAbove = [ above.x - a.x, above.y - a.y, above.z - a.z ];
					var toSide = [ side.x - a.x, side.y - a.y, side.z - a.z ];
					var normal = v3.cross(toAbove, toSide, []);
					// positions
					if (k === 0) {
						// tip
						v3.normalize(toAbove);
						v3.scale(toAbove, -1);
						currentPartition.normalData.push(toAbove[0], toAbove[1], toAbove[2]);
						currentPartition.positionData.push(a.x, a.y, a.z);
					}
					if (doSide1 || doSide2) {
						// sides
						v3.normalize(toSide);
						v3.scale(toSide, -1);
						currentPartition.normalData.push(toSide[0], toSide[1], toSide[2]);
						currentPartition.positionData.push(a.x, a.y, a.z);
						if (doSide1 && k === lineSegmentLength - 1) {
							doSide1 = false;
							k = -1;
						}
					} else {
						// center strips
						v3.normalize(normal);
						if (negate && !this.front || !negate && this.front) {
							v3.scale(normal, -1);
						}
						currentPartition.normalData.push(normal[0], normal[1], normal[2]);
						v3.scale(normal, m.abs(offset));
						currentPartition.positionData.push(a.x + normal[0], a.y + normal[1], a.z + normal[2]);
						if (j === lineSegmentNum - 1 && k === lineSegmentLength - 1) {
							doSide2 = true;
							k = -1;
						}
					}
					if (k === -1 || k === lineSegmentLength - 1) {
						// end
						v3.normalize(toAbove);
						currentPartition.normalData.push(toAbove[0], toAbove[1], toAbove[2]);
						currentPartition.positionData.push(a.x, a.y, a.z);
					}
				}
			}
		}

		// build mesh connectivity
		// add 2 to lineSegmentNum and lineSegmentLength to account for sides
		// and ends
		lineSegmentNum += 2;
		lineSegmentLength += 2;
		if (cartoon) {
			this.cartoonSegments = [];
		}
		this.segments = [];
		for ( var n = 0, nn = this.partitions.length; n < nn; n++) {
			var currentPartition = this.partitions[n];
			var cartoonSegmentIndexData;
			if (cartoon) {
				cartoonSegmentIndexData = [];
			}
			for ( var i = 0, ii = currentPartition.count - 1; i < ii; i++) {
				var chainIndex = i;
				for ( var j = 0; j < n; j++) {
					chainIndex += this.partitions[j].count - 1;
				}
				var c = chain[chainIndex];
				if (i > 0 && cartoon && c.split) {
					var sr = new SubRibbon(this, undefined, cartoonSegmentIndexData, n);
					if (c.helix) {
						sr.helix = true;
					}
					if (c.sheet) {
						sr.sheet = true;
					}
					this.cartoonSegments.push(sr);
					cartoonSegmentIndexData = [];
				}
				var residueIndexStart = i * lineSegmentNum * lineSegmentLength;
				var individualIndexData = [];
				for ( var j = 0, jj = lineSegmentNum - 1; j < jj; j++) {
					var segmentIndexStart = residueIndexStart + j * lineSegmentLength;
					for ( var k = 0; k < lineSegmentLength; k++) {
						var nextRes = 1;
						if (i === currentPartition.count - 1) {
							nextRes = 0;
						} else if (k === lineSegmentLength - 1) {
							nextRes = lineSegmentNum * lineSegmentLength - k;
						}
						var add = [ segmentIndexStart + k, segmentIndexStart + lineSegmentLength + k, segmentIndexStart + lineSegmentLength + k + nextRes, segmentIndexStart + k, segmentIndexStart + k + nextRes, segmentIndexStart + lineSegmentLength + k + nextRes ];
						if (k !== lineSegmentLength - 1) {
							if (this.front) {
								individualIndexData.push(add[0], add[1], add[2], add[3], add[5], add[4]);
							} else {
								individualIndexData.push(add[0], add[2], add[1], add[3], add[4], add[5]);
							}
						}
						if (k === lineSegmentLength - 2 && i < currentPartition.count - 1) {
							// jump the gap, the other mesh points will be
							// covered,
							// so no need to explicitly skip them
							var jump = lineSegmentNum * lineSegmentLength - k;
							add[2] += jump;
							add[4] += jump;
							add[5] += jump;
						}
						if (this.front) {
							currentPartition.indexData.push(add[0], add[1], add[2], add[3], add[5], add[4]);
						} else {
							currentPartition.indexData.push(add[0], add[2], add[1], add[3], add[4], add[5]);
						}

						if (cartoon) {
							if (this.front) {
								cartoonSegmentIndexData.push(add[0], add[1], add[2], add[3], add[5], add[4]);
							} else {
								cartoonSegmentIndexData.push(add[0], add[2], add[1], add[3], add[4], add[5]);
							}
						}
					}
				}
				var resName = chain[chainIndex + 1].name;
				this.segments.push(new SubRibbon(this, resName, individualIndexData, n));
			}
			if (cartoon) {
				var sr = new SubRibbon(this, undefined, cartoonSegmentIndexData, n);
				var chainIndex = currentPartition.count - 1;
				for ( var j = 0; j < n; j++) {
					chainIndex += this.partitions[j].count - 1;
				}
				var c = chain[chainIndex];
				if (c.helix) {
					sr.helix = true;
				}
				if (c.sheet) {
					sr.sheet = true;
				}
				this.cartoonSegments.push(sr);
			}
		}

		this.storeData(this.partitions[0].positionData, this.partitions[0].normalData, this.partitions[0].indexData);
		if (this.partitions.length === 1) {
			// clear partitions to reduce overhead
			this.partitions = undefined;
		}
	};
	var _ = d3.Ribbon.prototype = new d3._Mesh();
	_.render = function(gl, specs) {
		this.bindBuffers(gl);
		// colors
		var color = specs.macro_colorByChain ? this.chainColor : undefined;
		if (!color) {
			color = this.front ? specs.proteins_primaryColor : specs.proteins_secondaryColor;
		}
		gl.material.setDiffuseColor(color);
		// render
		gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		if (this.partitions) {
			for ( var i = 1, ii = this.partitions.length; i < ii; i++) {
				var p = this.partitions[i];
				loadPartition(gl, p);
				// render
				gl.drawElements(gl.TRIANGLES, p.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			}
		}
	};

})(ChemDoodle.RESIDUE, ChemDoodle.structures.d3, Math, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(math, d3, v3) {
	'use strict';
	d3.Light = function(diffuseColor, specularColor, direction) {
		this.diffuseRGB = math.getRGB(diffuseColor, 1);
		this.specularRGB = math.getRGB(specularColor, 1);
		this.direction = direction;
	};
	var _ = d3.Light.prototype;
	_.lightScene = function(gl) {
		var prefix = 'u_light.';
		gl.uniform3f(gl.getUniformLocation(gl.program, prefix + 'diffuse_color'), this.diffuseRGB[0], this.diffuseRGB[1], this.diffuseRGB[2]);
		gl.uniform3f(gl.getUniformLocation(gl.program, prefix + 'specular_color'), this.specularRGB[0], this.specularRGB[1], this.specularRGB[2]);

		var lightingDirection = v3.create(this.direction);
		v3.normalize(lightingDirection);
		v3.negate(lightingDirection);
		gl.uniform3f(gl.getUniformLocation(gl.program, prefix + 'direction'), lightingDirection[0], lightingDirection[1], lightingDirection[2]);

		// compute the half vector
		var eyeVector = [ 0, 0, 0 ];
		var halfVector = [ eyeVector[0] + lightingDirection[0], eyeVector[1] + lightingDirection[1], eyeVector[2] + lightingDirection[2] ];
		var length = v3.length(halfVector);
		if (length === 0)
			halfVector = [ 0, 0, 1 ];
		else {
			v3.scale(1 / length);
		}
		gl.uniform3f(gl.getUniformLocation(gl.program, prefix + 'half_vector'), halfVector[0], halfVector[1], halfVector[2]);
	};

})(ChemDoodle.math, ChemDoodle.structures.d3, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3100 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-17 07:35:56 -0500 (Thu, 17 Feb 2011) $
//

(function(d3) {
	'use strict';
	d3.Line = function() {
		this.storeData([ 0, 0, 0, 0, 1, 0 ], [ 0, 0, 0, 0, 0, 0 ]);
	};
	d3.Line.prototype = new d3._Mesh();

})(ChemDoodle.structures.d3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(math, d3) {
	'use strict';
	d3.Material = function(gl) {
		this.gl = gl;
		var prefix = 'u_material.';
		this.aUL = gl.getUniformLocation(gl.program, prefix + 'ambient_color');
		this.dUL = gl.getUniformLocation(gl.program, prefix + 'diffuse_color');
		this.sUL = gl.getUniformLocation(gl.program, prefix + 'specular_color');
		this.snUL = gl.getUniformLocation(gl.program, prefix + 'shininess');
		this.alUL = gl.getUniformLocation(gl.program, prefix + 'alpha');
	};
	var _ = d3.Material.prototype;
	_.setTempColors = function(ambientColor, diffuseColor, specularColor, shininess) {
		if (!this.aCache || this.aCache !== ambientColor) {
			this.aCache = ambientColor;
			var cs = math.getRGB(ambientColor, 1);
			this.gl.uniform3f(this.aUL, cs[0], cs[1], cs[2]);
		}
		if (diffuseColor && (!this.dCache || this.dCache !== diffuseColor)) {
			this.dCache = diffuseColor;
			var cs = math.getRGB(diffuseColor, 1);
			this.gl.uniform3f(this.dUL, cs[0], cs[1], cs[2]);
		}
		if (!this.sCache || this.sCache !== specularColor) {
			this.sCache = specularColor;
			var cs = math.getRGB(specularColor, 1);
			this.gl.uniform3f(this.sUL, cs[0], cs[1], cs[2]);
		}
		if (!this.snCache || this.snCache !== shininess) {
			this.snCache = shininess;
			this.gl.uniform1f(this.snUL, shininess);
		}
		this.alCache = 1;
		this.gl.uniform1f(this.alUL, 1);
	};
	_.setDiffuseColor = function(diffuseColor) {
		if (!this.dCache || this.dCache !== diffuseColor) {
			this.dCache = diffuseColor;
			var cs = math.getRGB(diffuseColor, 1);
			this.gl.uniform3f(this.dUL, cs[0], cs[1], cs[2]);
		}
	};
	_.setAlpha = function(alpha) {
		if (!this.alCache || this.alCache !== alpha) {
			this.alCache = alpha;
			this.gl.uniform1f(this.alUL, alpha);
		}
	};

})(ChemDoodle.math, ChemDoodle.structures.d3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3387 $
//  $Author: kevin $
//  $LastChangedDate: 2011-09-25 08:54:07 -0400 (Sun, 25 Sep 2011) $
//

(function(structures, d3, ELEMENT, m) {
	'use strict';
	d3.MolecularSurface = function(molecule, latitudeBands, longitudeBands, probeRadius, atomRadius) {
		var positionData = [];
		var normalData = [];
		var indexData = [];

		// determine a generic set of normals to define a single atom surface
		var genericSurface = [];
		for ( var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
			var theta = latNumber * m.PI / latitudeBands;
			var sinTheta = m.sin(theta);
			var cosTheta = m.cos(theta);
			for ( var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
				var phi = longNumber * 2 * m.PI / longitudeBands;
				genericSurface.push(m.cos(phi) * sinTheta, cosTheta, m.sin(phi) * sinTheta);
			}
		}

		// add surfaces for each atom, to be post processed
		var atomSurfaces = [];
		for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
			var atomSurface = [];
			var atom = molecule.atoms[i];

			// cache the atoms within distance, so that we don't need to waste
			// calculations later
			var radius = ELEMENT[atom.label][atomRadius] + probeRadius;
			var checks = [];
			for ( var j = 0, jj = molecule.atoms.length; j < jj; j++) {
				if (j !== i) {
					var check = molecule.atoms[j];
					check.index = j;
					if (atom.distance3D(check) < radius + ELEMENT[check.label][atomRadius] + probeRadius) {
						checks.push(check);
					}
				}
			}

			for ( var j = 0, jj = genericSurface.length; j < jj; j += 3) {
				var p = new structures.Atom('C', atom.x + radius * genericSurface[j], atom.y + radius * genericSurface[j + 1], atom.z + radius * genericSurface[j + 2]);
				for ( var k = 0, kk = checks.length; k < kk; k++) {
					var check = checks[k];
					if (p.distance3D(check) < ELEMENT[check.label][atomRadius] + probeRadius) {
						p.contained = true;
						break;
					}
				}
				atomSurface.push(p);
			}

			atomSurfaces.push(atomSurface);
		}

		// set up the mesh vectors
		var genericIndexes = [];
		longitudeBands++;
		for ( var latNumber = 0; latNumber < latitudeBands; latNumber++) {
			for ( var longNumber = 0; longNumber < longitudeBands; longNumber++) {
				var first = (latNumber * longitudeBands) + (longNumber % longitudeBands);
				var second = first + longitudeBands;
				genericIndexes.push(first);
				genericIndexes.push(second);
				genericIndexes.push(first + 1);
				if (longNumber < longitudeBands - 1) {
					genericIndexes.push(second);
					genericIndexes.push(second + 1);
					genericIndexes.push(first + 1);
				}
			}
		}

		var indexCounter = 0;
		// connect discrete sphere parts
		for ( var i = 0, ii = atomSurfaces.length; i < ii; i++) {
			var atomSurface = atomSurfaces[i];
			for ( var j = 0, jj = atomSurface.length; j < jj; j++) {
				var p = atomSurface[j];
				if (!p.contained) {
					p.index = indexCounter;
					indexCounter++;
					positionData.push(p.x, p.y, p.z);
					normalData.push(genericSurface[j * 3], genericSurface[j * 3 + 1], genericSurface[j * 3 + 2]);
				}
			}
			for ( var j = 0, jj = genericIndexes.length; j < jj; j += 3) {
				var first = atomSurface[genericIndexes[j]];
				var second = atomSurface[genericIndexes[j + 1]];
				var third = atomSurface[genericIndexes[j + 2]];
				if (!first.contained && !second.contained && !third.contained) {
					indexData.push(first.index, second.index, third.index);
				}
			}
		}
		// sow together spheres
		function findClosestPoint(pNotContained, checks, exclude1, exclude2) {
			var index = pNotContained.index;
			if (pNotContained.contained) {
				index = -1;
				var dist = Infinity;
				for ( var k = 0, kk = checks.length; k < kk; k++) {
					var check = checks[k];
					for ( var l = 0, ll = check.length; l < ll; l++) {
						var p = check[l];
						if (!p.contained && p.index !== exclude1 && p.index !== exclude2) {
							var distCheck = p.distance3D(pNotContained);
							if (distCheck < dist) {
								index = p.index;
								dist = distCheck;
							}
						}
					}
				}
			}
			return index;
		}
		var seams = [];
		for ( var i = 0, ii = atomSurfaces.length; i < ii; i++) {
			var atomSurface = atomSurfaces[i];
			for ( var j = 0, jj = genericIndexes.length; j < jj; j += 3) {
				var first = atomSurface[genericIndexes[j]];
				var second = atomSurface[genericIndexes[j + 1]];
				var third = atomSurface[genericIndexes[j + 2]];
				var checks = [];
				for ( var k = 0, kk = atomSurfaces.length; k < kk; k++) {
					if (k !== i) {
						checks.push(atomSurfaces[k]);
					}
				}
				if (!(first.contained && second.contained && third.contained) && (first.contained || second.contained || third.contained)) {
					var fi = findClosestPoint(first, checks, -1, -1);
					var si = findClosestPoint(second, checks, fi, -1);
					var ti = findClosestPoint(third, checks, fi, si);
					if (fi !== -1 && si !== -1 && ti !== -1) {
						var already = false;
						for ( var k = 0, kk = seams.length; k < kk; k += 3) {
							var already1 = seams[k];
							var already2 = seams[k + 1];
							var already3 = seams[k + 2];
							var f1 = fi === already1 || fi === already2 || fi === already3;
							var f2 = si === already1 || si === already2 || si === already3;
							var f3 = ti === already1 || ti === already2 || ti === already3;
							if (f1 && f2 && f3) {
								already = true;
								break;
							}
						}
						if (!already) {
							seams.push(fi, si, ti);
						}
					}
				}
			}
		}
		indexData = indexData.concat(seams);

		this.storeData(positionData, normalData, indexData);
	};
	d3.MolecularSurface.prototype = new d3._Mesh();

})(ChemDoodle.structures, ChemDoodle.structures.d3, ChemDoodle.ELEMENT, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(d3, document) {
	'use strict';
	d3.Picker = function() {
	};
	var _ = d3.Picker.prototype;

	_.init = function(gl) {
		// setup for picking system
		this.framebuffer = gl.createFramebuffer();

		// set pick texture
		var texture2D = gl.createTexture();
		var renderbuffer = gl.createRenderbuffer();

		gl.bindTexture(gl.TEXTURE_2D, texture2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

		// set framebuffer and bind the texture and renderbuffer
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture2D, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	};

	_.setDimension = function(gl, width, height) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

		// get binded depth attachment renderbuffer
		var renderbuffer = gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
		if (gl.isRenderbuffer(renderbuffer)) {
			// set renderbuffer dimension
			gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		}

		// get binded color attachment texture 2d
		var texture2D = gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME);
		if (gl.isTexture(texture2D)) {
			// set texture dimension
			gl.bindTexture(gl.TEXTURE_2D, texture2D);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	};

	_.pick = function(gl, molecules, specs, x, y) {
		var object = undefined;

		// current clear color
		var cs = gl.getParameter(gl.COLOR_CLEAR_VALUE);

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

		gl.clearColor(1.0, 1.0, 1.0, 0.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// disable foging effect
		gl.fogging.setMode(0);

		// not need the normal for diffuse light, we need flat color
		gl.disableVertexAttribArray(gl.shader.vertexNormalAttribute);

		var objects = [];

		gl.material.setAlpha(255);
		for ( var i = 0, ii = molecules.length; i < ii; i++) {
			molecules[i].renderPickFrame(gl, specs, objects);
		}

		// flush as this is seen in documentation
		gl.flush();

		var rgba = new Uint8Array(4);
		gl.readPixels(x - 2, y + 2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, rgba);

		var idxMolecule = rgba[3];
		if (idxMolecule > 0) {
			var idxAtom = rgba[2] | (rgba[1] << 8) | (rgba[0] << 16);
			object = objects[idxAtom];
		}

		// release a little bit memory
		objects = undefined;

		// reenable the normal attribute
		gl.enableVertexAttribArray(gl.shader.vertexNormalAttribute);

		// enable fogging
		gl.fogging.setMode(specs.fog_mode_3D);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		// set back the clear color
		gl.clearColor(cs[0], cs[1], cs[2], cs[3]);

		return object;
	};

})(ChemDoodle.structures.d3, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(d3, m) {
	'use strict';

	/**
	 * @constructor d3.Pill
	 * @inherit {d3._Mesh}
	 * @param {number}
	 *            height Height of pill including the rounded cap
	 * @param {number}
	 *            radius Radius of pill
	 * @param {number}
	 *            latitudeBands Total bands of latitute division on one pill's
	 *            cap
	 * @param {number}
	 *            longitudeBands Total bands of longitude division on one pill's
	 *            cap and cylinder part
	 */
	d3.Pill = function(radius, height, latitudeBands, longitudeBands) {

		var capHeightScale = 1;
		var capDiameter = 2 * radius;

		height -= capDiameter;

		if (height < 0) {
			capHeightScale = 0;
			height += capDiameter;
		} else if (height < capDiameter) {
			capHeightScale = height / capDiameter;
			height = capDiameter;
		}

		// update latitude and logintude band for two caps.
		// latitudeBands *= 2;
		// longitudeBands *= 2;

		var positionData = [];
		var normalData = [];
		for ( var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
			var theta = latNumber * m.PI / latitudeBands;
			var sinTheta = m.sin(theta);
			var cosTheta = m.cos(theta) * capHeightScale;

			// console.log(cosTheta);

			for ( var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
				var phi = longNumber * 2 * m.PI / longitudeBands;
				var sinPhi = m.sin(phi);
				var cosPhi = m.cos(phi);

				var x = cosPhi * sinTheta;
				var y = cosTheta;
				var z = sinPhi * sinTheta;

				normalData.push(x, y, z);
				positionData.push(radius * x, radius * y + (latNumber < latitudeBands / 2 ? height : 0), radius * z);
			}
		}

		var indexData = [];
		longitudeBands += 1;
		for ( var latNumber = 0; latNumber < latitudeBands; latNumber++) {
			for ( var longNumber = 0; longNumber < longitudeBands; longNumber++) {
				var first = (latNumber * longitudeBands) + (longNumber % longitudeBands);
				var second = first + longitudeBands;
				indexData.push(first, first + 1, second);
				if (longNumber < longitudeBands - 1) {
					indexData.push(second, first + 1, second + 1);
				}
			}
		}

		this.storeData(positionData, normalData, indexData);
	};
	d3.Pill.prototype = new d3._Mesh();

})(ChemDoodle.structures.d3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4500 $
//  $Author: kevin $
//  $LastChangedDate: 2013-09-06 14:28:15 -0400 (Fri, 06 Sep 2013) $
//

(function(d3, document) {
	'use strict';
	d3.Shader = function() {
	};
	var _ = d3.Shader.prototype;
	_.init = function(gl) {
		var vertexShader = this.getShader(gl, 'vertex-shader');
		if (!vertexShader) {
			vertexShader = this.loadDefaultVertexShader(gl);
		}
		var fragmentShader = this.getShader(gl, 'fragment-shader');
		if (!fragmentShader) {
			fragmentShader = this.loadDefaultFragmentShader(gl);
		}

		gl.attachShader(gl.program, vertexShader);
		gl.attachShader(gl.program, fragmentShader);
		
		// the vertex position location must be explicit set to '0',
		// to prefent vertex normal become location '0'.
		// It's needed because later normal must be disabled for
		// rendering on picking framebuffer
		this.vertexPositionAttribute = 0;
		gl.bindAttribLocation(gl.program, this.vertexPositionAttribute, 'a_vertex_position');

		gl.linkProgram(gl.program);

		if (!gl.getProgramParameter(gl.program, gl.LINK_STATUS)) {
			alert('Could not initialize shaders: ' + gl.getProgramInfoLog(gl.program));
		}

		gl.useProgram(gl.program);

		gl.enableVertexAttribArray(this.vertexPositionAttribute);

		this.vertexNormalAttribute = gl.getAttribLocation(gl.program, 'a_vertex_normal');
		gl.enableVertexAttribArray(this.vertexNormalAttribute);
	};
	_.getShader = function(gl, id) {
		var shaderScript = document.getElementById(id);
		if (!shaderScript) {
			return undefined;
		}
		var sb = [];
		var k = shaderScript.firstChild;
		while (k) {
			if (k.nodeType === 3) {
				sb.push(k.textContent);
			}
			k = k.nextSibling;
		}
		var shader;
		if (shaderScript.type === 'x-shader/x-fragment') {
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		} else if (shaderScript.type === 'x-shader/x-vertex') {
			shader = gl.createShader(gl.VERTEX_SHADER);
		} else {
			return undefined;
		}
		gl.shaderSource(shader, sb.join(''));
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert(shaderScript.type + ' ' + gl.getShaderInfoLog(shader));
			return undefined;
		}
		return shader;
	};
	_.loadDefaultVertexShader = function(gl) {
		var sb = [
		'precision mediump float;',
		// phong shader
		'struct Light',
			'{',
				'vec3 diffuse_color;',
				'vec3 specular_color;',
				'vec3 direction;',
				'vec3 half_vector;',
			'};',

		'struct Material',
			'{',
				'vec3 ambient_color;',
				'vec3 diffuse_color;',
				'vec3 specular_color;',
				'float shininess;',
				'float alpha;',
			'};',
		// attributes set when rendering objects
		'attribute vec3 a_vertex_position;',
		'attribute vec3 a_vertex_normal;',
		// scene structs
		'uniform Light u_light;',
		'uniform Material u_material;',
		// matrices set by gl.setMatrixUniforms
		'uniform mat4 u_model_view_matrix;',
		'uniform mat4 u_projection_matrix;',
		'uniform mat3 u_normal_matrix;',
		// sent to the fragment shader
		'varying vec3 v_diffuse;',
		'varying vec4 v_ambient;',
		'varying vec3 v_normal;',
		'void main(void)',
			'{',
				'v_normal = length(a_vertex_normal)==0.0 ? a_vertex_normal : normalize(u_normal_matrix * a_vertex_normal);',
				
				'v_ambient = vec4(u_material.ambient_color, 1.0);',
				'v_diffuse = u_material.diffuse_color * u_light.diffuse_color;',
				
				'gl_Position = u_projection_matrix * u_model_view_matrix * vec4(a_vertex_position, 1.0);',
				// just to make sure the w is 1
				'gl_Position /= gl_Position.w;',
				'gl_PointSize = 2.0;',
			'}'
		].join(''); // reduce memory to hold the array value
		
		var shader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(shader, sb);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert('Vertex shader failed to compile: ' + gl.getShaderInfoLog(shader));
			return undefined;
		}
		return shader;
	};
	_.loadDefaultFragmentShader = function(gl) {
		var sb = [
		// set float precision
		'precision mediump float;\n',
		'struct Light',
			'{',
				'vec3 diffuse_color;',
				'vec3 specular_color;',
				'vec3 direction;',
				'vec3 half_vector;',
			'};',
		'struct Material',
			'{',
				'vec3 ambient_color;',
				'vec3 diffuse_color;',
				'vec3 specular_color;',
				'float shininess;',
				'float alpha;',
			'};',
		'struct Fog',
			'{',
				'int mode;',
				'vec3 color;',
				'float density;',
				'float start;',
				'float end;',
			'};',
					
					
		// scene structs
		'uniform Light u_light;',
		'uniform Material u_material;',
		'uniform Fog u_fog;',
					
		// from the vertex shader
		'varying vec3 v_diffuse;',
		'varying vec4 v_ambient;',
		'varying vec3 v_normal;',
		'void main(void)',
			'{',
				'if(length(v_normal)==0.0){',
					'gl_FragColor = vec4(vec3(v_diffuse.rgb),u_material.alpha);',
				'}else{',
					'float nDotL = max(dot(v_normal, u_light.direction), 0.0);',
					'vec4 color = vec4(v_diffuse*nDotL, 1.0);',
					'float nDotHV = max(dot(v_normal, u_light.half_vector), 0.0);',
					'vec3 specular = u_material.specular_color * u_light.specular_color;',
					'color+=vec4(specular * pow(nDotHV, u_material.shininess), 1.0);',

					// set the color
					'gl_FragColor = color+v_ambient;',
					'gl_FragColor.a*=u_material.alpha;',
							

					// fogging
					'float fogCoord = gl_FragCoord.z/gl_FragCoord.w;',
					'float fogFactor = 1.;',

					// linear equation
					'if(u_fog.mode == 1){',
						// 'if(u_fog.start <= fogCoord && fogCoord <= u_fog.end){',
						'if(fogCoord < u_fog.start){',
							'fogFactor = 1.;',
						'}else if(fogCoord > u_fog.end){',
							'fogFactor = 0.;',
						'}else{',
							'fogFactor = clamp((u_fog.end - fogCoord) / (u_fog.end - u_fog.start), 0.0, 1.0);',
						'}',
					'}',
					// exp equation
					'else if(u_fog.mode == 2) {',
						'fogFactor = clamp(exp(-u_fog.density*fogCoord), 0.0, 1.0);',
					'}',
					// exp2 equation
					'else if(u_fog.mode == 3) {',
						'fogFactor = clamp(exp(-pow(u_fog.density*fogCoord, 2.0)), 0.0, 1.0);',
					'}',
					'gl_FragColor = mix(vec4(vec3(u_fog.color), 1.), gl_FragColor, fogFactor);',
					 // 'gl_FragColor = vec4(vec3(fogFactor), 1.0);',
				'}',
			'}'
		].join('');
		
		var shader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(shader, sb);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert('Fragment shader failed to compile: ' + gl.getShaderInfoLog(shader));
			return undefined;
		}
		return shader;
	};

})(ChemDoodle.structures.d3, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3100 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-17 07:35:56 -0500 (Thu, 17 Feb 2011) $
//

(function(structures, d3, v3) {
	'use strict';
	d3.Shape = function(points, thickness) {
		// points must be in the xy-plane, all z-coords must be 0, thickness
		// will be in the z-plane
		var numPoints = points.length;
		var positionData = [];
		var normalData = [];

		// calculate vertex and normal points
		var center = new structures.Point();
		for ( var i = 0, ii = numPoints; i < ii; i++) {
			var next = i + 1;
			if (i === ii - 1) {
				next = 0;
			}
			var z = [ 0, 0, 1 ];
			var currentPoint = points[i];
			var nextPoint = points[next];
			var v = [ nextPoint.x - currentPoint.x, nextPoint.y - currentPoint.y, 0 ];
			var normal = v3.cross(z, v);
			// first four are for the side normal
			// second four will do both the bottom and top triangle normals
			for ( var j = 0; j < 2; j++) {
				positionData.push(currentPoint.x, currentPoint.y, thickness / 2);
				positionData.push(currentPoint.x, currentPoint.y, -thickness / 2);
				positionData.push(nextPoint.x, nextPoint.y, thickness / 2);
				positionData.push(nextPoint.x, nextPoint.y, -thickness / 2);
			}
			// side normals
			for ( var j = 0; j < 4; j++) {
				normalData.push(normal[0], normal[1], normal[2]);
			}
			// top and bottom normals
			normalData.push(0, 0, 1);
			normalData.push(0, 0, -1);
			normalData.push(0, 0, 1);
			normalData.push(0, 0, -1);
			center.add(currentPoint);
		}
		// centers
		center.x /= numPoints;
		center.y /= numPoints;
		normalData.push(0, 0, 1);
		positionData.push(center.x, center.y, thickness / 2);
		normalData.push(0, 0, -1);
		positionData.push(center.x, center.y, -thickness / 2);

		// build mesh connectivity
		var indexData = [];
		var centerIndex = numPoints * 8;
		for ( var i = 0, ii = numPoints; i < ii; i++) {
			var start = i * 8;
			// sides
			indexData.push(start);
			indexData.push(start + 3);
			indexData.push(start + 1);
			indexData.push(start);
			indexData.push(start + 2);
			indexData.push(start + 3);
			// top and bottom
			indexData.push(start + 4);
			indexData.push(centerIndex);
			indexData.push(start + 6);
			indexData.push(start + 5);
			indexData.push(start + 7);
			indexData.push(centerIndex + 1);
		}

		this.storeData(positionData, normalData, indexData);
	};
	d3.Shape.prototype = new d3._Mesh();

})(ChemDoodle.structures, ChemDoodle.structures.d3, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3458 $
//  $Author: kevin $
//  $LastChangedDate: 2011-12-23 10:57:22 -0500 (Fri, 23 Dec 2011) $
//

(function(d3, m, v3) {
	'use strict';
	d3.Star = function() {
		var ps = [ .8944, .4472, 0, .2764, .4472, .8506, .2764, .4472, -.8506, -.7236, .4472, .5257, -.7236, .4472, -.5257, -.3416, .4472, 0, -.1056, .4472, .3249, -.1056, .4472, -.3249, .2764, .4472, .2008, .2764, .4472, -.2008, -.8944, -.4472, 0, -.2764, -.4472, .8506, -.2764, -.4472, -.8506, .7236, -.4472, .5257, .7236, -.4472, -.5257, .3416, -.4472, 0, .1056, -.4472, .3249, .1056, -.4472, -.3249, -.2764, -.4472, .2008, -.2764, -.4472, -.2008, -.5527, .1058, 0, -.1708, .1058, .5527, -.1708,
				.1058, -.5527, .4471, .1058, .3249, .4471, .1058, -.3249, .5527, -.1058, 0, .1708, -.1058, .5527, .1708, -.1058, -.5527, -.4471, -.1058, .3249, -.4471, -.1058, -.3249, 0, 1, 0, 0, -1, 0 ];
		var is = [ 0, 9, 8, 2, 7, 9, 4, 5, 7, 3, 6, 5, 1, 8, 6, 0, 8, 23, 30, 6, 8, 3, 21, 6, 11, 26, 21, 13, 23, 26, 2, 9, 24, 30, 8, 9, 1, 23, 8, 13, 25, 23, 14, 24, 25, 4, 7, 22, 30, 9, 7, 0, 24, 9, 14, 27, 24, 12, 22, 27, 3, 5, 20, 30, 7, 5, 2, 22, 7, 12, 29, 22, 10, 20, 29, 1, 6, 21, 30, 5, 6, 4, 20, 5, 10, 28, 20, 11, 21, 28, 10, 19, 18, 12, 17, 19, 14, 15, 17, 13, 16, 15, 11, 18, 16, 31, 19, 17, 14, 17, 27, 2, 27, 22, 4, 22, 29, 10, 29, 19, 31, 18, 19, 12, 19, 29, 4, 29, 20, 3, 20, 28,
				11, 28, 18, 31, 16, 18, 10, 18, 28, 3, 28, 21, 1, 21, 26, 13, 26, 16, 31, 15, 16, 11, 16, 26, 1, 26, 23, 0, 23, 25, 14, 25, 15, 31, 17, 15, 13, 15, 25, 0, 25, 24, 2, 24, 27, 12, 27, 17 ];

		var positionData = [];
		var normalData = [];
		var indexData = [];
		for ( var i = 0, ii = is.length; i < ii; i += 3) {
			var j1 = is[i] * 3;
			var j2 = is[i + 1] * 3;
			var j3 = is[i + 2] * 3;

			var p1 = [ ps[j1], ps[j1 + 1], ps[j1 + 2] ];
			var p2 = [ ps[j2], ps[j2 + 1], ps[j2 + 2] ];
			var p3 = [ ps[j3], ps[j3 + 1], ps[j3 + 2] ];

			var toAbove = [ p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2] ];
			var toSide = [ p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2] ];
			var normal = v3.cross(toSide, toAbove, []);
			v3.normalize(normal);

			positionData.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
			normalData.push(normal[0], normal[1], normal[2], normal[0], normal[1], normal[2], normal[0], normal[1], normal[2]);
			indexData.push(i, i + 1, i + 2);
		}

		this.storeData(positionData, normalData, indexData);
	};
	d3.Star.prototype = new d3._Mesh();

})(ChemDoodle.structures.d3, Math, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3994 $
//  $Author: kevin $
//  $LastChangedDate: 2012-12-13 18:52:20 -0500 (Thu, 13 Dec 2012) $
//

(function(d3, extensions, document) {
	'use strict';
	d3.TextImage = function() {
		this.ctx = document.createElement('canvas').getContext('2d');
		this.data = [];
		this.text = '';
		this.charHeight = 0;
	};

	var _ = d3.TextImage.prototype;

	_.init = function(gl) {
		// init texture
		this.textureImage = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.textureImage);

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);

		this.updateFont(gl, 12, [ 'Sans-serif' ], false, false, false);
	};

	_.charData = function(character) {
		var index = this.text.indexOf(character);
		return index >= 0 ? this.data[index] : null;
	};

	_.updateFont = function(gl, fontSize, fontFamilies, fontBold, fontItalic, fontStroke) {
		var ctx = this.ctx;
		var canvas = this.ctx.canvas;
		var data = [];
		var text = "";
		var contextFont = extensions.getFontString(fontSize, fontFamilies, fontBold, fontItalic);

		ctx.font = contextFont;

		ctx.save();

		var totalWidth = 0;
		var charHeight = fontSize * 1.5;

		for ( var i = 32, ii = 127; i < ii; i++) {

			// skip control characters
			// if(i <= 31 || i == 127) continue;

			var character = String.fromCharCode(i), width = ctx.measureText(character).width;

			data.push({
				text : character,
				width : width,
				height : charHeight
			});

			totalWidth += width * 2;
		}

		var areaImage = totalWidth * charHeight;
		var sqrtArea = Math.sqrt(areaImage);
		var totalRows = Math.ceil(sqrtArea / charHeight);
		var maxWidth = Math.ceil(totalWidth / (totalRows - 1));

		canvas.width = maxWidth;
		canvas.height = totalRows * charHeight;

		ctx.font = contextFont;
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";

		ctx.strokeStyle = "#000";
		ctx.lineWidth = 1.4;

		ctx.fillStyle = "#fff";

		var offsetRow = 0;
		var posX = 0;
		for ( var i = 0, ii = data.length; i < ii; i++) {
			var charData = data[i];
			var charWidth = charData.width * 2;
			var charHeight = charData.height;
			var charText = charData.text;
			var willWidth = posX + charWidth;

			if (willWidth > maxWidth) {
				offsetRow++;
				posX = 0;
			}

			var posY = offsetRow * charHeight;

			if (fontStroke) {
				// stroke must draw before fill
				ctx.strokeText(charText, posX, posY + (charHeight / 2));
			}

			ctx.fillText(charText, posX, posY + (charHeight / 2));

			charData.x = posX;
			charData.y = posY;

			text += charText;

			posX += charWidth;
		}

		this.text = text;
		this.data = data;
		this.charHeight = charHeight;

		// also update the texture
		gl.bindTexture(gl.TEXTURE_2D, this.textureImage);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
		gl.bindTexture(gl.TEXTURE_2D, null);
	};
	_.pushVertexData = function(text, position, zDepth, data) {
		// characters of string text
		var textPiece = text.toString().split("");

		// height of texture image
		var heightImage = this.getHeight();
		var widthImage = this.getWidth();

		var x1 = -this.textWidth(text) / 2;
		var y1 = -this.charHeight / 2;

		// iterate each character
		for ( var j = 0, jj = textPiece.length; j < jj; j++) {
			var charData = this.charData(textPiece[j]);

			var width = charData.width;
			var left = charData.x / widthImage;
			var right = left + charData.width * 1.8 / widthImage;
			var top = charData.y / heightImage;
			var bottom = top + charData.height / heightImage;

			var x2 = x1 + width * 1.8;
			var y2 = this.charHeight / 2;

			data.position.push(
			// left top
			position[0], position[1], position[2],
			// right top
			position[0], position[1], position[2],
			// right bottom
			position[0], position[1], position[2],

			// left top
			position[0], position[1], position[2],
			// left bottom
			position[0], position[1], position[2],
			// right bottom
			position[0], position[1], position[2]);

			data.texCoord.push(
			// left top
			left, top,
			// right bottom
			right, bottom,
			// right top
			right, top,

			// left top
			left, top,
			// left bottom
			left, bottom,
			// right bottom
			right, bottom);

			data.translation.push(
			// left top
			x1, y2,
			// right bottom
			x2, y1,
			// right top
			x2, y2,

			// left top
			x1, y2,
			// left bottom
			x1, y1,
			// right bottom
			x2, y1);

			data.zDepth.push(zDepth, zDepth, zDepth,

			zDepth, zDepth, zDepth);

			x1 = x2 + width - width * 1.8;
		}

	};
	_.getCanvas = function() {
		return this.ctx.canvas;
	};
	_.getHeight = function() {
		return this.getCanvas().height;
	};
	_.getWidth = function() {
		return this.getCanvas().width;
	};
	_.textWidth = function(text) {
		return this.ctx.measureText(text).width;
	};
	_.test = function() {
		document.body.appendChild(this.getCanvas());
	};
	_.useTexture = function(gl) {
		gl.bindTexture(gl.TEXTURE_2D, this.textureImage);
	};

})(ChemDoodle.structures.d3, ChemDoodle.extensions, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3994 $
//  $Author: kevin $
//  $LastChangedDate: 2012-12-13 18:52:20 -0500 (Thu, 13 Dec 2012) $
//

(function(d3, m) {
	'use strict';
	d3.TextMesh = function() {
	};
	var _ = d3.TextMesh.prototype;
	_.init = function(gl) {

		// set vertex buffer
		this.vertexPositionBuffer = gl.createBuffer();
		this.vertexTexCoordBuffer = gl.createBuffer();
		this.vertexTranslationBuffer = gl.createBuffer();
		this.vertexZDepthBuffer = gl.createBuffer();

	};
	_.setVertexData = function(gl, vertexBuffer, bufferData, itemSize) {
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
		vertexBuffer.itemSize = itemSize;
		vertexBuffer.numItems = bufferData.length / itemSize;
	};
	_.storeData = function(gl, vertexPositionData, vertexTexCoordData, vertexTranslationData, vertexZDepthData) {
		this.setVertexData(gl, this.vertexPositionBuffer, vertexPositionData, 3);
		this.setVertexData(gl, this.vertexTexCoordBuffer, vertexTexCoordData, 2);
		this.setVertexData(gl, this.vertexTranslationBuffer, vertexTranslationData, 2);
		this.setVertexData(gl, this.vertexZDepthBuffer, vertexZDepthData, 1);
	};
	_.bindBuffers = function(gl) {
		var shaderText = gl.shaderText;

		// positions
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		gl.vertexAttribPointer(shaderText.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// texCoord
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
		gl.vertexAttribPointer(shaderText.vertexTexCoordAttribute, this.vertexTexCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// translation
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTranslationBuffer);
		gl.vertexAttribPointer(shaderText.vertexTranslationAttribute, this.vertexTranslationBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// z depth
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexZDepthBuffer);
		gl.vertexAttribPointer(shaderText.vertexZDepthAttribute, this.vertexZDepthBuffer.itemSize, gl.FLOAT, false, 0, 0);

	};
	_.render = function(gl) {
		var numItems = this.vertexPositionBuffer.numItems;

		if (!numItems) {
			// nothing to do here
			return;
		}

		this.bindBuffers(gl);
		gl.drawArrays(gl.TRIANGLES, 0, numItems);
	};

})(ChemDoodle.structures.d3, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3994 $
//  $Author: kevin $
//  $LastChangedDate: 2012-12-13 18:52:20 -0500 (Thu, 13 Dec 2012) $
//

(function(d3) {
	'use strict';
	d3.TextShader = function() {
	};

	var _ = d3.TextShader.prototype = new d3.Shader();
	_.init = function(gl) {

		gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

		// init gl program
		var vertexShader = this.loadDefaultVertexShader(gl);
		var fragmentShader = this.loadDefaultFragmentShader(gl);

		gl.attachShader(gl.programLabel, vertexShader);
		gl.attachShader(gl.programLabel, fragmentShader);
		gl.linkProgram(gl.programLabel);

		if (!gl.getProgramParameter(gl.programLabel, gl.LINK_STATUS)) {
			alert('Could not initialize shaders: ' + gl.getProgramInfoLog(gl.programLabel));
		}

		// assign attribute properties
		this.vertexPositionAttribute = gl.getAttribLocation(gl.programLabel, 'a_vertex_position');
		this.vertexTexCoordAttribute = gl.getAttribLocation(gl.programLabel, 'a_vertex_texcoord');
		this.vertexTranslationAttribute = gl.getAttribLocation(gl.programLabel, 'a_translation');
		this.vertexZDepthAttribute = gl.getAttribLocation(gl.programLabel, 'a_z_depth');

		// assign uniform properties
		this.modelViewMatrixUniform = gl.getUniformLocation(gl.programLabel, 'u_model_view_matrix');
		this.projectionMatrixUniform = gl.getUniformLocation(gl.programLabel, 'u_projection_matrix');
		this.dimensionUniform = gl.getUniformLocation(gl.programLabel, 'u_dimension');

	};
	_.loadDefaultVertexShader = function(gl) {
		var sb = [
		'precision mediump float;',
		  		
		'attribute vec3 a_vertex_position;', 'attribute vec2 a_vertex_texcoord;', 'attribute vec2 a_translation;', 'attribute float a_z_depth;',

		'uniform mat4 u_model_view_matrix;', 'uniform mat4 u_projection_matrix;', 'uniform vec2 u_dimension;',

		'varying vec2 v_texcoord;',

		'void main() {',

		'gl_Position = u_model_view_matrix * vec4(a_vertex_position, 1.0);',

		'vec4 depth_pos = vec4(gl_Position);',

		'depth_pos.z += a_z_depth;',

		'gl_Position = u_projection_matrix * gl_Position;',

		'depth_pos = u_projection_matrix * depth_pos;',

		'gl_Position /= gl_Position.w;',

		'gl_Position.xy += a_translation / u_dimension * 2.0;',

		'gl_Position.z = depth_pos.z / depth_pos.w;',

		'v_texcoord = a_vertex_texcoord;', '}' ].join('');

		var shader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(shader, sb);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert('Vertex shader failed to compile: ' + gl.getShaderInfoLog(shader));
			return undefined;
		}
		return shader;
	};
	_.loadDefaultFragmentShader = function(gl) {
		var sb = [
		'precision mediump float;',

		// our texture
		'uniform sampler2D u_image;',

		// the texCoords passed in from the vertex shader.
		'varying vec2 v_texcoord;',

		'void main() {', 'gl_FragColor = texture2D(u_image, v_texcoord);',

		// 'if(gl_FragColor.a == 0.0) discard;',

		// 'gl_FragColor = vec4(1.0,1.0,1.0,1.0);',
		'}' ].join('');

		var shader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(shader, sb);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert('Fragment shader failed to compile: ' + gl.getShaderInfoLog(shader));
			return undefined;
		}
		return shader;
	};
	_.setUniforms = function(gl, modelViewMatrix, projectionMatrix) {
		gl.uniformMatrix4fv(this.modelViewMatrixUniform, false, modelViewMatrix);
		gl.uniformMatrix4fv(this.projectionMatrixUniform, false, projectionMatrix);
		gl.uniform2f(this.dimensionUniform, gl.canvas.clientWidth, gl.canvas.clientHeight);
	};
})(ChemDoodle.structures.d3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(extensions, RESIDUE, structures, d3, m, m4, v3) {
	'use strict';
	var loadPartition = function(gl, p) {
		// positions
		gl.bindBuffer(gl.ARRAY_BUFFER, p.vertexPositionBuffer);
		gl.vertexAttribPointer(gl.shader.vertexPositionAttribute, p.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		// normals
		gl.bindBuffer(gl.ARRAY_BUFFER, p.vertexNormalBuffer);
		gl.vertexAttribPointer(gl.shader.vertexNormalAttribute, p.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		// indexes
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p.vertexIndexBuffer);
	};

	var PointRotator = function(point, axis, angle) {
		var d = m.sqrt(axis[1] * axis[1] + axis[2] * axis[2]);
		var Rx = [ 1, 0, 0, 0, 0, axis[2] / d, -axis[1] / d, 0, 0, axis[1] / d, axis[2] / d, 0, 0, 0, 0, 1 ];
		var RxT = [ 1, 0, 0, 0, 0, axis[2] / d, axis[1] / d, 0, 0, -axis[1] / d, axis[2] / d, 0, 0, 0, 0, 1 ];
		var Ry = [ d, 0, -axis[0], 0, 0, 1, 0, 0, axis[0], 0, d, 0, 0, 0, 0, 1 ];
		var RyT = [ d, 0, axis[0], 0, 0, 1, 0, 0, -axis[0], 0, d, 0, 0, 0, 0, 1 ];
		var Rz = [ m.cos(angle), -m.sin(angle), 0, 0, m.sin(angle), m.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
		var matrix = m4.multiply(Rx, m4.multiply(Ry, m4.multiply(Rz, m4.multiply(RyT, RxT, []))));
		this.rotate = function() {
			return m4.multiplyVec3(matrix, point);
		};
	};

	d3.Tube = function(chain, thickness, cylinderResolution) {
		var lineSegmentNum = chain[0].lineSegments[0].length;
		this.partitions = [];
		var currentPartition;
		this.ends = [];
		this.ends.push(chain[0].lineSegments[0][0]);
		this.ends.push(chain[chain.length - 2].lineSegments[0][0]);
		// calculate vertex and normal points
		var last = [ 1, 0, 0 ];
		for ( var i = 0, ii = chain.length - 1; i < ii; i++) {
			if (!currentPartition || currentPartition.positionData.length > 65000) {
				if (this.partitions.length > 0) {
					i--;
				}
				currentPartition = {
					count : 0,
					positionData : [],
					normalData : [],
					indexData : []
				};
				this.partitions.push(currentPartition);
			}
			var residue = chain[i];
			currentPartition.count++;
			var min = Infinity;
			var p = new structures.Atom('', chain[i + 1].cp1.x, chain[i + 1].cp1.y, chain[i + 1].cp1.z);
			for ( var j = 0; j < lineSegmentNum; j++) {
				var currentPoint = residue.lineSegments[0][j];
				var nextPoint;
				if (j === lineSegmentNum - 1) {
					if (i === chain.length - 2) {
						nextPoint = residue.lineSegments[0][j - 1];
					} else {
						nextPoint = chain[i + 1].lineSegments[0][0];
					}
				} else {
					nextPoint = residue.lineSegments[0][j + 1];
				}
				var axis = [ nextPoint.x - currentPoint.x, nextPoint.y - currentPoint.y, nextPoint.z - currentPoint.z ];
				v3.normalize(axis);
				if (i === chain.length - 2 && j === lineSegmentNum - 1) {
					v3.scale(axis, -1);
				}
				var startVector = vec3.cross(axis, last, []);
				v3.normalize(startVector);
				v3.scale(startVector, thickness / 2);
				var rotator = new PointRotator(startVector, axis, 2 * Math.PI / cylinderResolution);
				for ( var k = 0, kk = cylinderResolution; k < kk; k++) {
					var use = rotator.rotate();
					if (k === m.floor(cylinderResolution / 4)) {
						last = [ use[0], use[1], use[2] ];
					}
					currentPartition.normalData.push(use[0], use[1], use[2]);
					currentPartition.positionData.push(currentPoint.x + use[0], currentPoint.y + use[1], currentPoint.z + use[2]);
				}
				// find closest point to attach stick to
				if (p) {
					var dist = currentPoint.distance3D(p);
					if (dist < min) {
						min = dist;
						chain[i + 1].pPoint = currentPoint;
					}
				}
			}
		}

		// build mesh connectivity
		for ( var n = 0, nn = this.partitions.length; n < nn; n++) {
			var currentPartition = this.partitions[n];
			for ( var i = 0, ii = currentPartition.count - 1; i < ii; i++) {
				var indexStart = i * lineSegmentNum * cylinderResolution;
				for ( var j = 0, jj = lineSegmentNum; j < jj; j++) {
					var segmentIndexStart = indexStart + j * cylinderResolution;
					for ( var k = 0; k < cylinderResolution; k++) {
						var next = 1;
						var sk = segmentIndexStart + k;
						currentPartition.indexData.push(sk);
						currentPartition.indexData.push(sk + cylinderResolution);
						currentPartition.indexData.push(sk + cylinderResolution + next);
						currentPartition.indexData.push(sk);
						currentPartition.indexData.push(sk + cylinderResolution + next);
						currentPartition.indexData.push(sk + next);
					}
				}
			}
		}

		this.storeData(this.partitions[0].positionData, this.partitions[0].normalData, this.partitions[0].indexData);

		var ps = [ new structures.Point(2, 0) ];
		for ( var i = 0; i < 60; i++) {
			var ang = i / 60 * m.PI;
			ps.push(new structures.Point(2 * m.cos(ang), -2 * m.sin(ang)));
		}
		ps.push(new structures.Point(-2, 0), new structures.Point(-2, 4), new structures.Point(2, 4));
		var platform = new structures.d3.Shape(ps, 1);

		this.render = function(gl, specs) {
			// draw tube
			this.bindBuffers(gl);
			// colors
			gl.material.setDiffuseColor(specs.macro_colorByChain ? this.chainColor : specs.nucleics_tubeColor);
			// render
			gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			if (this.partitions) {
				for ( var i = 1, ii = this.partitions.length; i < ii; i++) {
					var p = this.partitions[i];
					loadPartition(gl, p);
					// render
					gl.drawElements(gl.TRIANGLES, p.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				}
			}

			// draw ends
			gl.sphereBuffer.bindBuffers(gl);
			for ( var i = 0; i < 2; i++) {
				var p = this.ends[i];
				var transform = m4.translate(gl.modelViewMatrix, [ p.x, p.y, p.z ], []);
				var radius = thickness / 2;
				m4.scale(transform, [ radius, radius, radius ]);
				// render
				gl.setMatrixUniforms(transform);
				gl.drawElements(gl.TRIANGLES, gl.sphereBuffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			}

			// draw nucleotide handles
			gl.cylinderBuffer.bindBuffers(gl);
			for ( var i = 1, ii = chain.length - 1; i < ii; i++) {
				var residue = chain[i];
				var p1 = residue.pPoint;
				var p2 = new structures.Atom('', residue.cp2.x, residue.cp2.y, residue.cp2.z);
				var height = 1.001 * p1.distance3D(p2);
				var scaleVector = [ thickness / 4, height, thickness / 4 ];
				var transform = m4.translate(gl.modelViewMatrix, [ p1.x, p1.y, p1.z ], []);
				var y = [ 0, 1, 0 ];
				var ang = 0;
				var axis;
				var a2b = [ p2.x - p1.x, p2.y - p1.y, p2.z - p1.z ];
				if (p1.x === p2.x && p1.z === p2.z) {
					axis = [ 0, 0, 1 ];
					if (p1.y < p1.y) {
						ang = m.PI;
					}
				} else {
					ang = extensions.vec3AngleFrom(y, a2b);
					axis = v3.cross(y, a2b, []);
				}
				if (ang !== 0) {
					m4.rotate(transform, ang, axis);
				}
				m4.scale(transform, scaleVector);
				gl.setMatrixUniforms(transform);
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, gl.cylinderBuffer.vertexPositionBuffer.numItems);
			}

			// draw nucleotide platforms
			platform.bindBuffers(gl);
			// colors
			if (!specs.nucleics_useShapelyColors && !specs.macro_colorByChain) {
				gl.material.setDiffuseColor(specs.nucleics_baseColor);
			}
			for ( var i = 1, ii = chain.length - 1; i < ii; i++) {
				var residue = chain[i];
				var p2 = residue.cp2;
				var transform = m4.translate(gl.modelViewMatrix, [ p2.x, p2.y, p2.z ], []);
				// rotate to direction
				var y = [ 0, 1, 0 ];
				var ang = 0;
				var axis;
				var p3 = residue.cp3;
				var a2b = [ p3.x - p2.x, p3.y - p2.y, p3.z - p2.z ];
				if (p2.x === p3.x && p2.z === p3.z) {
					axis = [ 0, 0, 1 ];
					if (p2.y < p2.y) {
						ang = m.PI;
					}
				} else {
					ang = extensions.vec3AngleFrom(y, a2b);
					axis = v3.cross(y, a2b, []);
				}
				if (ang !== 0) {
					m4.rotate(transform, ang, axis);
				}
				// rotate to orientation
				var x = [ 1, 0, 0 ];
				var rM = m4.rotate(m4.identity([]), ang, axis);
				m4.multiplyVec3(rM, x);
				var p4 = residue.cp4;
				var p5 = residue.cp5;
				if (!(p4.y === p5.y && p4.z === p5.z)) {
					var pivot = [ p5.x - p4.x, p5.y - p4.y, p5.z - p4.z ];
					var ang2 = extensions.vec3AngleFrom(x, pivot);
					if (v3.dot(a2b, v3.cross(x, pivot)) < 0) {
						ang2 *= -1;
					}
					m4.rotateY(transform, ang2);
				}
				// color
				if (specs.nucleics_useShapelyColors && !specs.macro_colorByChain) {
					if (RESIDUE[residue.name]) {
						gl.material.setDiffuseColor(RESIDUE[residue.name].shapelyColor);
					} else {
						gl.material.setDiffuseColor(RESIDUE['*'].shapelyColor);
					}
				}
				// render
				gl.setMatrixUniforms(transform);
				gl.drawElements(gl.TRIANGLES, platform.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			}

		};
	};
	d3.Tube.prototype = new d3._Mesh();

})(ChemDoodle.extensions, ChemDoodle.RESIDUE, ChemDoodle.structures, ChemDoodle.structures.d3, Math, mat4, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3100 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-17 07:35:56 -0500 (Thu, 17 Feb 2011) $
//

(function(d3, v3) {
	'use strict';
	d3.UnitCell = function(unitCellVectors) {
		var positionData = [];
		var normalData = [];
		// calculate vertex and normal points

		var pushSide = function(p1, p2, p3, p4) {
			positionData.push(p1[0], p1[1], p1[2]);
			positionData.push(p2[0], p2[1], p2[2]);
			positionData.push(p3[0], p3[1], p3[2]);
			positionData.push(p4[0], p4[1], p4[2]);
			// push 0s for normals so shader gives them full color
			for ( var i = 0; i < 4; i++) {
				normalData.push(0, 0, 0);
			}
		};
		pushSide(unitCellVectors.o, unitCellVectors.x, unitCellVectors.xy, unitCellVectors.y);
		pushSide(unitCellVectors.o, unitCellVectors.y, unitCellVectors.yz, unitCellVectors.z);
		pushSide(unitCellVectors.o, unitCellVectors.z, unitCellVectors.xz, unitCellVectors.x);
		pushSide(unitCellVectors.yz, unitCellVectors.y, unitCellVectors.xy, unitCellVectors.xyz);
		pushSide(unitCellVectors.xyz, unitCellVectors.xz, unitCellVectors.z, unitCellVectors.yz);
		pushSide(unitCellVectors.xy, unitCellVectors.x, unitCellVectors.xz, unitCellVectors.xyz);

		// build mesh connectivity
		var indexData = [];
		for ( var i = 0; i < 6; i++) {
			var start = i * 4;
			// sides
			indexData.push(start, start + 1, start + 1, start + 2, start + 2, start + 3, start + 3, start);
		}

		this.storeData(positionData, normalData, indexData);
	};
	d3.UnitCell.prototype = new d3._Mesh();

})(ChemDoodle.structures.d3, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(structures, extensions, m) {
	'use strict';
	structures.Plate = function(lanes) {
		this.lanes = new Array(lanes);
		for (i = 0, ii = lanes; i < ii; i++) {
			this.lanes[i] = [];
		}
	};
	var _ = structures.Plate.prototype;
	_.sort = function() {
		for (i = 0, ii = this.lanes.length; i < ii; i++) {
			this.lanes[i].sort(function(a, b) {
				return a - b;
			});
		}
	};
	_.draw = function(ctx, specs) {
		// Front and origin
		var width = ctx.canvas.width;
		var height = ctx.canvas.height;
		this.origin = 9 * height / 10;
		this.front = height / 10;
		this.laneLength = this.origin - this.front;
		ctx.strokeStyle = '#000000';
		ctx.beginPath();
		ctx.moveTo(0, this.front);
		extensions.contextHashTo(ctx, 0, this.front, width, this.front, 3, 3);
		ctx.closePath();
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, this.origin);
		ctx.lineTo(width, this.origin);
		ctx.closePath();
		ctx.stroke();
		// Lanes
		for (i = 0, ii = this.lanes.length; i < ii; i++) {
			var laneX = (i + 1) * width / (ii + 1);
			ctx.beginPath();
			ctx.moveTo(laneX, this.origin);
			ctx.lineTo(laneX, this.origin + 3);
			ctx.closePath();
			ctx.stroke();
			// Spots
			for (s = 0, ss = this.lanes[i].length; s < ss; s++) {
				var spotY = this.origin - (this.laneLength * this.lanes[i][s].rf);
				switch (this.lanes[i][s].type) {
				case 'compact':
					ctx.beginPath();
					ctx.arc(laneX, spotY, 3, 0, 2 * m.PI, false);
					ctx.closePath();
					break;
				case 'expanded':
					ctx.beginPath();
					ctx.arc(laneX, spotY, 7, 0, 2 * m.PI, false);
					ctx.closePath();
					break;
				case 'trailing':
					// trailing
					break;
				case 'widened':
					extensions.contextOval(ctx, laneX - 18, spotY - 10, 36, 10);
					break;
				case 'cresent':
					ctx.beginPath();
					ctx.arc(laneX, spotY, 9, 0, m.PI, true);
					ctx.closePath();
					break;
				}
				switch (this.lanes[i][s].style) {
				case 'solid':
					ctx.fillStyle = '#000000';
					ctx.fill();
					break;
				case 'transparent':
					ctx.stroke();
					break;
				case 'gradient':
					// gradient
					break;
				}
			}
		}
	};

	structures.Plate.Spot = function(type, rf, style) {
		this.type = type;
		this.rf = rf;
		this.style = style ? style : 'solid';
	};

})(ChemDoodle.structures, ChemDoodle.extensions, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4459 $
//  $Author: kevin $
//  $LastChangedDate: 2013-08-06 14:09:43 -0400 (Tue, 06 Aug 2013) $
//

(function(c, structures, m) {
	'use strict';
	// default canvas properties
	c.default_backgroundColor = '#FFFFFF';
	c.default_scale = 1;
	c.default_rotateAngle = 0;
	c.default_bondLength_2D = 20;
	c.default_angstromsPerBondLength = 1.25;
	c.default_lightDirection_3D = [ -.1, -.1, -1 ];
	c.default_lightDiffuseColor_3D = '#FFFFFF';
	c.default_lightSpecularColor_3D = '#FFFFFF';
	c.default_projectionPerspective_3D = true;
	c.default_projectionPerspectiveVerticalFieldOfView_3D = 45;
	c.default_projectionOrthoWidth_3D = 40;
	c.default_projectionWidthHeightRatio_3D = undefined;
	c.default_projectionFrontCulling_3D = .1;
	c.default_projectionBackCulling_3D = 10000;
	c.default_cullBackFace_3D = true;
	c.default_fog_mode_3D = 0;
	c.default_fog_color_3D = '#000000';
	c.default_fog_start_3D = 0;
	c.default_fog_end_3D = 1;
	c.default_fog_density_3D = 1;

	// default atom properties
	c.default_atoms_display = true;
	c.default_atoms_color = '#000000';
	c.default_atoms_font_size_2D = 12;
	c.default_atoms_font_families_2D = [ 'Helvetica', 'Arial', 'Dialog' ];
	c.default_atoms_font_bold_2D = false;
	c.default_atoms_font_italic_2D = false;
	c.default_atoms_circles_2D = false;
	c.default_atoms_circleDiameter_2D = 10;
	c.default_atoms_circleBorderWidth_2D = 1;
	c.default_atoms_lonePairDistance_2D = 8;
	c.default_atoms_lonePairSpread_2D = 4;
	c.default_atoms_lonePairDiameter_2D = 1;
	c.default_atoms_useJMOLColors = false;
	c.default_atoms_usePYMOLColors = false;
	c.default_atoms_resolution_3D = 60;
	c.default_atoms_sphereDiameter_3D = .8;
	c.default_atoms_useVDWDiameters_3D = false;
	c.default_atoms_vdwMultiplier_3D = 1;
	c.default_atoms_materialAmbientColor_3D = '#000000';
	c.default_atoms_materialSpecularColor_3D = '#555555';
	c.default_atoms_materialShininess_3D = 32;
	c.default_atoms_implicitHydrogens_2D = true;
	c.default_atoms_displayTerminalCarbonLabels_2D = false;
	c.default_atoms_showHiddenCarbons_2D = true;
	c.default_atoms_showAttributedCarbons_2D = true;
	c.default_atoms_displayAllCarbonLabels_2D = false;
	c.default_atoms_nonBondedAsStars_3D = false;
	c.default_atoms_displayLabels_3D = false;

	// default bond properties
	c.default_bonds_display = true;
	c.default_bonds_color = '#000000';
	c.default_bonds_width_2D = 1;
	c.default_bonds_saturationWidth_2D = .2;
	c.default_bonds_ends_2D = 'round';
	c.default_bonds_useJMOLColors = false;
	c.default_bonds_usePYMOLColors = false;
	c.default_bonds_colorGradient = false;
	c.default_bonds_saturationAngle_2D = m.PI / 3;
	c.default_bonds_symmetrical_2D = false;
	c.default_bonds_clearOverlaps_2D = false;
	c.default_bonds_overlapClearWidth_2D = .5;
	c.default_bonds_atomLabelBuffer_2D = 1;
	c.default_bonds_wedgeThickness_2D = .22;
	c.default_bonds_hashWidth_2D = 1;
	c.default_bonds_hashSpacing_2D = 2.5;
	c.default_bonds_dotSize_2D = 2;
	c.default_bonds_showBondOrders_3D = false;
	c.default_bonds_resolution_3D = 60;
	c.default_bonds_renderAsLines_3D = false;
	c.default_bonds_cylinderDiameter_3D = .3;
	c.default_bonds_pillLatitudeResolution_3D = 10;
	c.default_bonds_pillLongitudeResolution_3D = 20;
	c.default_bonds_pillHeight_3D = .3;
	c.default_bonds_pillSpacing_3D = .1;
	c.default_bonds_pillDiameter_3D = .3;
	c.default_bonds_materialAmbientColor_3D = '#222222';
	c.default_bonds_materialSpecularColor_3D = '#555555';
	c.default_bonds_materialShininess_3D = 32;

	// default macromolecular properties
	c.default_proteins_displayRibbon = true;
	c.default_proteins_displayBackbone = false;
	c.default_proteins_backboneThickness = 1.5;
	c.default_proteins_backboneColor = '#CCCCCC';
	c.default_proteins_ribbonCartoonize = false;
	c.default_proteins_useShapelyColors = false;
	c.default_proteins_useAminoColors = false;
	c.default_proteins_usePolarityColors = false;
	c.default_proteins_primaryColor = '#FF0D0D';
	c.default_proteins_secondaryColor = '#FFFF30';
	c.default_proteins_ribbonCartoonHelixPrimaryColor = '#00E740';
	c.default_proteins_ribbonCartoonHelixSecondaryColor = '#9905FF';
	c.default_proteins_ribbonCartoonSheetColor = '#E8BB99';
	c.default_proteins_ribbonThickness = .2;
	c.default_proteins_verticalResolution = 10;
	c.default_proteins_horizontalResolution = 9;
	c.default_proteins_materialAmbientColor_3D = '#222222';
	c.default_proteins_materialSpecularColor_3D = '#555555';
	c.default_proteins_materialShininess_3D = 32;
	c.default_nucleics_display = true;
	c.default_nucleics_tubeColor = '#CCCCCC';
	c.default_nucleics_baseColor = '#C10000';
	c.default_nucleics_useShapelyColors = true;
	c.default_nucleics_tubeThickness = 1.5;
	c.default_nucleics_tubeResolution_3D = 60;
	c.default_nucleics_verticalResolution = 10;
	c.default_nucleics_materialAmbientColor_3D = '#222222';
	c.default_nucleics_materialSpecularColor_3D = '#555555';
	c.default_nucleics_materialShininess_3D = 32;
	c.default_macro_displayAtoms = false;
	c.default_macro_displayBonds = false;
	c.default_macro_atomToLigandDistance = -1;
	c.default_macro_showWater = false;
	c.default_macro_colorByChain = false;

	// default surface properties
	c.default_surfaces_display = true;
	c.default_surfaces_style = 'Dot';
	c.default_surfaces_color = '#E9B862';
	c.default_surfaces_materialAmbientColor_3D = '#000000';
	c.default_surfaces_materialSpecularColor_3D = '#000000';
	c.default_surfaces_materialShininess_3D = 32;

	// default crystallographic properties
	c.default_crystals_displayUnitCell = true;
	c.default_crystals_unitCellColor = 'green';
	c.default_crystals_unitCellLineWidth = 1;

	// default spectrum properties
	c.default_plots_color = '#000000';
	c.default_plots_width = 1;
	c.default_plots_showIntegration = false;
	c.default_plots_integrationColor = '#c10000';
	c.default_plots_integrationLineWidth = 1;
	c.default_plots_showGrid = false;
	c.default_plots_gridColor = 'gray';
	c.default_plots_gridLineWidth = .5;
	c.default_plots_showYAxis = true;
	c.default_plots_flipXAxis = false;

	// default shape properties
	c.default_text_font_size = 12;
	c.default_text_font_families = [ 'Helvetica', 'Arial', 'Dialog' ];
	c.default_text_font_bold = true;
	c.default_text_font_italic = false;
	c.default_text_font_stroke_3D = true;
	c.default_text_color = '#000000';
	c.default_shapes_color = '#000000';
	c.default_shapes_lineWidth_2D = 1;
	c.default_shapes_arrowLength_2D = 8;
	c.default_compass_display = false;
	c.default_compass_axisXColor_3D = '#FF0000';
	c.default_compass_axisYColor_3D = '#00FF00';
	c.default_compass_axisZColor_3D = '#0000FF';
	c.default_compass_size_3D = 50;
	c.default_compass_resolution_3D = 10;
	c.default_compass_displayText_3D = true;

	structures.VisualSpecifications = function() {
		// canvas properties
		this.backgroundColor = c.default_backgroundColor;
		this.scale = c.default_scale;
		this.rotateAngle = c.default_rotateAngle;
		this.bondLength = c.default_bondLength_2D;
		this.angstromsPerBondLength = c.default_angstromsPerBondLength;
		this.lightDirection_3D = c.default_lightDirection_3D;
		this.lightDiffuseColor_3D = c.default_lightDiffuseColor_3D;
		this.lightSpecularColor_3D = c.default_lightSpecularColor_3D;
		this.projectionPerspective_3D = c.default_projectionPerspective_3D;
		this.projectionPerspectiveVerticalFieldOfView_3D = c.default_projectionPerspectiveVerticalFieldOfView_3D;
		this.projectionOrthoWidth_3D = c.default_projectionOrthoWidth_3D;
		this.projectionWidthHeightRatio_3D = c.default_projectionWidthHeightRatio_3D;
		this.projectionFrontCulling_3D = c.default_projectionFrontCulling_3D;
		this.projectionBackCulling_3D = c.default_projectionBackCulling_3D;
		this.cullBackFace_3D = c.default_cullBackFace_3D;
		this.fog_mode_3D = c.default_fog_mode_3D;
		this.fog_color_3D = c.default_fog_color_3D;
		this.fog_start_3D = c.default_fog_start_3D;
		this.fog_end_3D = c.default_fog_end_3D;
		this.fog_density_3D = c.default_fog_density_3D;

		// atom properties
		this.atoms_display = c.default_atoms_display;
		this.atoms_color = c.default_atoms_color;
		this.atoms_font_size_2D = c.default_atoms_font_size_2D;
		this.atoms_font_families_2D = [];
		for ( var i = 0, ii = c.default_atoms_font_families_2D.length; i < ii; i++) {
			this.atoms_font_families_2D[i] = c.default_atoms_font_families_2D[i];
		}
		this.atoms_font_bold_2D = c.default_atoms_font_bold_2D;
		this.atoms_font_italic_2D = c.default_atoms_font_italic_2D;
		this.atoms_circles_2D = c.default_atoms_circles_2D;
		this.atoms_circleDiameter_2D = c.default_atoms_circleDiameter_2D;
		this.atoms_circleBorderWidth_2D = c.default_atoms_circleBorderWidth_2D;
		this.atoms_lonePairDistance_2D = c.default_atoms_lonePairDistance_2D;
		this.atoms_lonePairSpread_2D = c.default_atoms_lonePairSpread_2D;
		this.atoms_lonePairDiameter_2D = c.default_atoms_lonePairDiameter_2D;
		this.atoms_useJMOLColors = c.default_atoms_useJMOLColors;
		this.atoms_usePYMOLColors = c.default_atoms_usePYMOLColors;
		this.atoms_resolution_3D = c.default_atoms_resolution_3D;
		this.atoms_sphereDiameter_3D = c.default_atoms_sphereDiameter_3D;
		this.atoms_useVDWDiameters_3D = c.default_atoms_useVDWDiameters_3D;
		this.atoms_vdwMultiplier_3D = c.default_atoms_vdwMultiplier_3D;
		this.atoms_materialAmbientColor_3D = c.default_atoms_materialAmbientColor_3D;
		this.atoms_materialSpecularColor_3D = c.default_atoms_materialSpecularColor_3D;
		this.atoms_materialShininess_3D = c.default_atoms_materialShininess_3D;
		this.atoms_implicitHydrogens_2D = c.default_atoms_implicitHydrogens_2D;
		this.atoms_displayTerminalCarbonLabels_2D = c.default_atoms_displayTerminalCarbonLabels_2D;
		this.atoms_showHiddenCarbons_2D = c.default_atoms_showHiddenCarbons_2D;
		this.atoms_showAttributedCarbons_2D = c.default_atoms_showAttributedCarbons_2D;
		this.atoms_displayAllCarbonLabels_2D = c.default_atoms_displayAllCarbonLabels_2D;
		this.atoms_nonBondedAsStars_3D = c.default_atoms_nonBondedAsStars_3D;
		this.atoms_displayLabels_3D = c.default_atoms_displayLabels_3D;

		// bond properties
		this.bonds_display = c.default_bonds_display;
		this.bonds_color = c.default_bonds_color;
		this.bonds_width_2D = c.default_bonds_width_2D;
		this.bonds_saturationWidth_2D = c.default_bonds_saturationWidth_2D;
		this.bonds_ends_2D = c.default_bonds_ends_2D;
		this.bonds_useJMOLColors = c.default_bonds_useJMOLColors;
		this.bonds_usePYMOLColors = c.default_bonds_usePYMOLColors;
		this.bonds_colorGradient = c.default_bonds_colorGradient;
		this.bonds_saturationAngle_2D = c.default_bonds_saturationAngle_2D;
		this.bonds_symmetrical_2D = c.default_bonds_symmetrical_2D;
		this.bonds_clearOverlaps_2D = c.default_bonds_clearOverlaps_2D;
		this.bonds_overlapClearWidth_2D = c.default_bonds_overlapClearWidth_2D;
		this.bonds_atomLabelBuffer_2D = c.default_bonds_atomLabelBuffer_2D;
		this.bonds_wedgeThickness_2D = c.default_bonds_wedgeThickness_2D;
		this.bonds_hashWidth_2D = c.default_bonds_hashWidth_2D;
		this.bonds_hashSpacing_2D = c.default_bonds_hashSpacing_2D;
		this.bonds_dotSize_2D = c.default_bonds_dotSize_2D;
		this.bonds_showBondOrders_3D = c.default_bonds_showBondOrders_3D;
		this.bonds_resolution_3D = c.default_bonds_resolution_3D;
		this.bonds_renderAsLines_3D = c.default_bonds_renderAsLines_3D;
		this.bonds_cylinderDiameter_3D = c.default_bonds_cylinderDiameter_3D;
		this.bonds_pillHeight_3D = c.default_bonds_pillHeight_3D;
		this.bonds_pillLatitudeResolution_3D = c.default_bonds_pillLatitudeResolution_3D;
		this.bonds_pillLongitudeResolution_3D = c.default_bonds_pillLongitudeResolution_3D;
		this.bonds_pillSpacing_3D = c.default_bonds_pillSpacing_3D;
		this.bonds_pillDiameter_3D = c.default_bonds_pillDiameter_3D;
		this.bonds_materialAmbientColor_3D = c.default_bonds_materialAmbientColor_3D;
		this.bonds_materialSpecularColor_3D = c.default_bonds_materialSpecularColor_3D;
		this.bonds_materialShininess_3D = c.default_bonds_materialShininess_3D;

		// macromolecular properties
		this.proteins_displayRibbon = c.default_proteins_displayRibbon;
		this.proteins_displayBackbone = c.default_proteins_displayBackbone;
		this.proteins_backboneThickness = c.default_proteins_backboneThickness;
		this.proteins_backboneColor = c.default_proteins_backboneColor;
		this.proteins_ribbonCartoonize = c.default_proteins_ribbonCartoonize;
		this.proteins_useShapelyColors = c.default_proteins_useShapelyColors;
		this.proteins_useAminoColors = c.default_proteins_useAminoColors;
		this.proteins_usePolarityColors = c.default_proteins_usePolarityColors;
		this.proteins_primaryColor = c.default_proteins_primaryColor;
		this.proteins_secondaryColor = c.default_proteins_secondaryColor;
		this.proteins_ribbonCartoonHelixPrimaryColor = c.default_proteins_ribbonCartoonHelixPrimaryColor;
		this.proteins_ribbonCartoonHelixSecondaryColor = c.default_proteins_ribbonCartoonHelixSecondaryColor;
		this.proteins_ribbonCartoonSheetColor = c.default_proteins_ribbonCartoonSheetColor;
		this.proteins_ribbonThickness = c.default_proteins_ribbonThickness;
		this.proteins_verticalResolution = c.default_proteins_verticalResolution;
		this.proteins_horizontalResolution = c.default_proteins_horizontalResolution;
		this.proteins_materialAmbientColor_3D = c.default_proteins_materialAmbientColor_3D;
		this.proteins_materialSpecularColor_3D = c.default_proteins_materialSpecularColor_3D;
		this.proteins_materialShininess_3D = c.default_proteins_materialShininess_3D;
		this.macro_displayAtoms = c.default_macro_displayAtoms;
		this.macro_displayBonds = c.default_macro_displayBonds;
		this.macro_atomToLigandDistance = c.default_macro_atomToLigandDistance;
		this.nucleics_display = c.default_nucleics_display;
		this.nucleics_tubeColor = c.default_nucleics_tubeColor;
		this.nucleics_baseColor = c.default_nucleics_baseColor;
		this.nucleics_useShapelyColors = c.default_nucleics_useShapelyColors;
		this.nucleics_tubeThickness = c.default_nucleics_tubeThickness;
		this.nucleics_tubeResolution_3D = c.default_nucleics_tubeResolution_3D;
		this.nucleics_verticalResolution = c.default_nucleics_verticalResolution;
		this.nucleics_materialAmbientColor_3D = c.default_nucleics_materialAmbientColor_3D;
		this.nucleics_materialSpecularColor_3D = c.default_nucleics_materialSpecularColor_3D;
		this.nucleics_materialShininess_3D = c.default_nucleics_materialShininess_3D;
		this.macro_showWater = c.default_macro_showWater;
		this.macro_colorByChain = c.default_macro_colorByChain;

		// surface properties
		this.surfaces_display = c.default_surfaces_display;
		this.surfaces_style = c.default_surfaces_style;
		this.surfaces_color = c.default_surfaces_color;
		this.surfaces_materialAmbientColor_3D = c.default_surfaces_materialAmbientColor_3D;
		this.surfaces_materialSpecularColor_3D = c.default_surfaces_materialSpecularColor_3D;
		this.surfaces_materialShininess_3D = c.default_surfaces_materialShininess_3D;

		// crystallographic properties
		this.crystals_displayUnitCell = c.default_crystals_displayUnitCell;
		this.crystals_unitCellColor = c.default_crystals_unitCellColor;
		this.crystals_unitCellLineWidth = c.default_crystals_unitCellLineWidth;

		// spectrum properties
		this.plots_color = c.default_plots_color;
		this.plots_width = c.default_plots_width;
		this.plots_showIntegration = c.default_plots_showIntegration;
		this.plots_integrationColor = c.default_plots_integrationColor;
		this.plots_integrationLineWidth = c.default_plots_integrationLineWidth;
		this.plots_showGrid = c.default_plots_showGrid;
		this.plots_gridColor = c.default_plots_gridColor;
		this.plots_gridLineWidth = c.default_plots_gridLineWidth;
		this.plots_showYAxis = c.default_plots_showYAxis;
		this.plots_flipXAxis = c.default_plots_flipXAxis;

		// shape properties
		this.text_font_size = c.default_text_font_size;
		this.text_font_families = [];
		for ( var i = 0, ii = c.default_text_font_families.length; i < ii; i++) {
			this.text_font_families[i] = c.default_text_font_families[i];
		}
		this.text_font_bold = c.default_text_font_bold;
		this.text_font_italic = c.default_text_font_italic;
		this.text_font_stroke_3D = c.default_text_font_stroke_3D;
		this.text_color = c.default_text_color;
		this.shapes_color = c.default_shapes_color;
		this.shapes_lineWidth_2D = c.default_shapes_lineWidth_2D;
		this.shapes_arrowLength_2D = c.default_shapes_arrowLength_2D;
		this.compass_display = c.default_compass_display;
		this.compass_axisXColor_3D = c.default_compass_axisXColor_3D;
		this.compass_axisYColor_3D = c.default_compass_axisYColor_3D;
		this.compass_axisZColor_3D = c.default_compass_axisZColor_3D;
		this.compass_size_3D = c.default_compass_size_3D;
		this.compass_resolution_3D = c.default_compass_resolution_3D;
		this.compass_displayText_3D = c.default_compass_displayText_3D;
	};
	var _ = structures.VisualSpecifications.prototype;
	_.set3DRepresentation = function(representation) {
		this.atoms_display = true;
		this.bonds_display = true;
		this.bonds_color = '#777777';
		this.atoms_useVDWDiameters_3D = true;
		this.atoms_useJMOLColors = true;
		this.bonds_useJMOLColors = true;
		this.bonds_showBondOrders_3D = true;
		this.bonds_renderAsLines_3D = false;
		if (representation === 'Ball and Stick') {
			this.atoms_vdwMultiplier_3D = .3;
			this.bonds_useJMOLColors = false;
			this.bonds_cylinderDiameter_3D = .3;
			this.bonds_materialAmbientColor_3D = c.default_atoms_materialAmbientColor_3D;
			this.bonds_pillDiameter_3D = .15;
		} else if (representation === 'van der Waals Spheres') {
			this.bonds_display = false;
			this.atoms_vdwMultiplier_3D = 1;
		} else if (representation === 'Stick') {
			this.atoms_useVDWDiameters_3D = false;
			this.bonds_showBondOrders_3D = false;
			this.bonds_cylinderDiameter_3D = this.atoms_sphereDiameter_3D = .8;
			this.bonds_materialAmbientColor_3D = this.atoms_materialAmbientColor_3D;
		} else if (representation === 'Wireframe') {
			this.atoms_useVDWDiameters_3D = false;
			this.bonds_cylinderDiameter_3D = this.bonds_pillDiameter_3D = .05;
			this.atoms_sphereDiameter_3D = .15;
			this.bonds_materialAmbientColor_3D = c.default_atoms_materialAmbientColor_3D;
		} else if (representation === 'Line') {
			this.atoms_display = false;
			this.bonds_renderAsLines_3D = true;
			this.bonds_width_2D = 1;
			this.bonds_cylinderDiameter_3D = .05;
		} else {
			alert('"' + representation + '" is not recognized. Use one of the following strings:\n\n' + '1. Ball and Stick\n' + '2. van der Waals Spheres\n' + '3. Stick\n' + '4. Wireframe\n' + '5. Line\n');
		}
	};

})(ChemDoodle, ChemDoodle.structures, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(c, ELEMENT, informatics, structures) {
	'use strict';
	informatics.getPointsPerAngstrom = function() {
		return c.default_bondLength_2D / c.default_angstromsPerBondLength;
	};

	informatics.BondDeducer = function() {
	};
	var _ = informatics.BondDeducer.prototype;
	_.margin = 1.1;
	_.deduceCovalentBonds = function(molecule, customPointsPerAngstrom) {
		var pointsPerAngstrom = informatics.getPointsPerAngstrom();
		if (customPointsPerAngstrom) {
			pointsPerAngstrom = customPointsPerAngstrom;
		}
		for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
			for ( var j = i + 1; j < ii; j++) {
				var first = molecule.atoms[i];
				var second = molecule.atoms[j];
				if (first.distance3D(second) < (ELEMENT[first.label].covalentRadius + ELEMENT[second.label].covalentRadius) * pointsPerAngstrom * this.margin) {
					molecule.bonds.push(new structures.Bond(first, second, 1));
				}
			}
		}
	};

})(ChemDoodle, ChemDoodle.ELEMENT, ChemDoodle.informatics, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(informatics) {
	'use strict';
	informatics.HydrogenDeducer = function() {
	};
	var _ = informatics.HydrogenDeducer.prototype;
	_.removeHydrogens = function(molecule) {
		var atoms = [];
		var bonds = [];
		for ( var i = 0, ii = molecule.bonds.length; i < ii; i++) {
			if (molecule.bonds[i].a1.label !== 'H' && molecule.bonds[i].a2.label !== 'H') {
				bonds.push(molecule.bonds[i]);
			}
		}
		for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
			if (molecule.atoms[i].label !== 'H') {
				atoms.push(molecule.atoms[i]);
			}
		}
		molecule.atoms = atoms;
		molecule.bonds = bonds;
	};

})(ChemDoodle.informatics);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3103 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-20 12:58:08 -0500 (Sun, 20 Feb 2011) $
//
(function(c, informatics, d3) {
	'use strict';
	informatics.MolecularSurfaceGenerator = function() {
	};
	var _ = informatics.MolecularSurfaceGenerator.prototype;
	_.generateSurface = function(molecule, latitudeBands, longitudeBands, probeRadius, atomRadius) {
		return new d3.MolecularSurface(molecule, latitudeBands, longitudeBands, probeRadius, atomRadius);
	};

})(ChemDoodle, ChemDoodle.informatics, ChemDoodle.structures.d3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3103 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-20 12:58:08 -0500 (Sun, 20 Feb 2011) $
//
(function(informatics, structures) {
	'use strict';
	informatics.Splitter = function() {
	};
	var _ = informatics.Splitter.prototype;
	_.split = function(molecule) {
		var mols = [];
		for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
			molecule.atoms[i].visited = false;
		}
		for ( var i = 0, ii = molecule.bonds.length; i < ii; i++) {
			molecule.bonds[i].visited = false;
		}
		for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
			var a = molecule.atoms[i];
			if (!a.visited) {
				var newMol = new structures.Molecule();
				newMol.atoms.push(a);
				a.visited = true;
				var q = new structures.Queue();
				q.enqueue(a);
				while (!q.isEmpty()) {
					var atom = q.dequeue();
					for ( var j = 0, jj = molecule.bonds.length; j < jj; j++) {
						var b = molecule.bonds[j];
						if (b.contains(atom) && !b.visited) {
							b.visited = true;
							newMol.bonds.push(b);
							var neigh = b.getNeighbor(atom);
							if (!neigh.visited) {
								neigh.visited = true;
								newMol.atoms.push(neigh);
								q.enqueue(neigh);
							}
						}
					}
				}
				mols.push(newMol);
			}
		}
		return mols;
	};

})(ChemDoodle.informatics, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4208 $
//  $Author: kevin $
//  $LastChangedDate: 2013-03-24 10:31:41 -0400 (Sun, 24 Mar 2013) $
//
(function(informatics, io, structures) {
	'use strict';
	informatics.StructureBuilder = function() {
	};
	var _ = informatics.StructureBuilder.prototype;
	_.copy = function(molecule) {
		var json = new io.JSONInterpreter();
		return json.molFrom(json.molTo(molecule));
	};

})(ChemDoodle.informatics, ChemDoodle.io, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(informatics) {
	'use strict';
	informatics._Counter = function() {
	};
	var _ = informatics._Counter.prototype;
	_.value = 0;
	_.molecule = undefined;
	_.setMolecule = function(molecule) {
		this.value = 0;
		this.molecule = molecule;
		if (this.innerCalculate) {
			this.innerCalculate();
		}
	};
})(ChemDoodle.informatics);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(informatics) {
	'use strict';
	informatics.FrerejacqueNumberCounter = function(molecule) {
		this.setMolecule(molecule);
	};
	var _ = informatics.FrerejacqueNumberCounter.prototype = new informatics._Counter();
	_.innerCalculate = function() {
		this.value = this.molecule.bonds.length - this.molecule.atoms.length + new informatics.NumberOfMoleculesCounter(this.molecule).value;
	};
})(ChemDoodle.informatics);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(structures, informatics) {
	'use strict';
	informatics.NumberOfMoleculesCounter = function(molecule) {
		this.setMolecule(molecule);
	};
	var _ = informatics.NumberOfMoleculesCounter.prototype = new informatics._Counter();
	_.innerCalculate = function() {
		for ( var i = 0, ii = this.molecule.atoms.length; i < ii; i++) {
			this.molecule.atoms[i].visited = false;
		}
		for ( var i = 0, ii = this.molecule.atoms.length; i < ii; i++) {
			if (!this.molecule.atoms[i].visited) {
				this.value++;
				var q = new structures.Queue();
				this.molecule.atoms[i].visited = true;
				q.enqueue(this.molecule.atoms[i]);
				while (!q.isEmpty()) {
					var atom = q.dequeue();
					for ( var j = 0, jj = this.molecule.bonds.length; j < jj; j++) {
						var b = this.molecule.bonds[j];
						if (b.contains(atom)) {
							var neigh = b.getNeighbor(atom);
							if (!neigh.visited) {
								neigh.visited = true;
								q.enqueue(neigh);
							}
						}
					}
				}
			}
		}
	};
})(ChemDoodle.structures, ChemDoodle.informatics);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4137 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-22 12:46:00 -0500 (Fri, 22 Feb 2013) $
//

(function(informatics) {
	'use strict';
	informatics._RingFinder = function() {
	};
	var _ = informatics._RingFinder.prototype;
	_.atoms = undefined;
	_.bonds = undefined;
	_.rings = undefined;
	_.reduce = function(molecule) {
		for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
			molecule.atoms[i].visited = false;
		}
		for ( var i = 0, ii = molecule.bonds.length; i < ii; i++) {
			molecule.bonds[i].visited = false;
		}
		var cont = true;
		while (cont) {
			cont = false;
			for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
				var count = 0;
				var bond;
				for ( var j = 0, jj = molecule.bonds.length; j < jj; j++) {
					if (molecule.bonds[j].contains(molecule.atoms[i]) && !molecule.bonds[j].visited) {
						count++;
						if (count === 2) {
							break;
						}
						bond = molecule.bonds[j];
					}
				}
				if (count === 1) {
					cont = true;
					bond.visited = true;
					molecule.atoms[i].visited = true;
				}
			}
		}
		for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
			if (!molecule.atoms[i].visited) {
				this.atoms.push(molecule.atoms[i]);
			}
		}
		for ( var i = 0, ii = molecule.bonds.length; i < ii; i++) {
			if (!molecule.bonds[i].visited) {
				this.bonds.push(molecule.bonds[i]);
			}
		}
		if (this.bonds.length === 0 && this.atoms.length !== 0) {
			this.atoms = [];
		}
	};
	_.setMolecule = function(molecule) {
		this.atoms = [];
		this.bonds = [];
		this.rings = [];
		this.reduce(molecule);
		if (this.atoms.length > 2 && this.innerGetRings) {
			this.innerGetRings();
		}
	};
	_.fuse = function() {
		for ( var i = 0, ii = this.rings.length; i < ii; i++) {
			for ( var j = 0, jj = this.bonds.length; j < jj; j++) {
				if (this.rings[i].atoms.indexOf(this.bonds[j].a1) !== -1 && this.rings[i].atoms.indexOf(this.bonds[j].a2) !== -1) {
					this.rings[i].bonds.push(this.bonds[j]);
				}
			}
		}
	};

})(ChemDoodle.informatics);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4137 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-22 12:46:00 -0500 (Fri, 22 Feb 2013) $
//
(function(informatics, structures) {
	'use strict';
	function Finger(a, from) {
		this.atoms = [];
		if (from) {
			for ( var i = 0, ii = from.atoms.length; i < ii; i++) {
				this.atoms[i] = from.atoms[i];
			}
		}
		this.atoms.push(a);
	}
	var _2 = Finger.prototype;
	_2.grow = function(bonds, blockers) {
		var last = this.atoms[this.atoms.length - 1];
		var neighs = [];
		for ( var i = 0, ii = bonds.length; i < ii; i++) {
			if (bonds[i].contains(last)) {
				var neigh = bonds[i].getNeighbor(last);
				if (blockers.indexOf(neigh) === -1) {
					neighs.push(neigh);
				}
			}
		}
		var returning = [];
		for ( var i = 0, ii = neighs.length; i < ii; i++) {
			returning.push(new Finger(neighs[i], this));
		}
		return returning;
	};
	_2.check = function(bonds, finger, a) {
		// check that they dont contain similar parts
		for ( var i = 0, ii = finger.atoms.length - 1; i < ii; i++) {
			if (this.atoms.indexOf(finger.atoms[i]) !== -1) {
				return undefined;
			}
		}
		var ring;
		// check if fingers meet at tips
		if (finger.atoms[finger.atoms.length - 1] === this.atoms[this.atoms.length - 1]) {
			ring = new structures.Ring();
			ring.atoms[0] = a;
			for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
				ring.atoms.push(this.atoms[i]);
			}
			for ( var i = finger.atoms.length - 2; i >= 0; i--) {
				ring.atoms.push(finger.atoms[i]);
			}
		} else {
			// check if fingers meet at bond
			var endbonds = [];
			for ( var i = 0, ii = bonds.length; i < ii; i++) {
				if (bonds[i].contains(finger.atoms[finger.atoms.length - 1])) {
					endbonds.push(bonds[i]);
				}
			}
			for ( var i = 0, ii = endbonds.length; i < ii; i++) {
				if ((finger.atoms.length === 1 || !endbonds[i].contains(finger.atoms[finger.atoms.length - 2])) && endbonds[i].contains(this.atoms[this.atoms.length - 1])) {
					ring = new structures.Ring();
					ring.atoms[0] = a;
					for ( var j = 0, jj = this.atoms.length; j < jj; j++) {
						ring.atoms.push(this.atoms[j]);
					}
					for ( var j = finger.atoms.length - 1; j >= 0; j--) {
						ring.atoms.push(finger.atoms[j]);
					}
					break;
				}
			}
		}
		return ring;
	};

	informatics.EulerFacetRingFinder = function(molecule) {
		this.setMolecule(molecule);
	};
	var _ = informatics.EulerFacetRingFinder.prototype = new informatics._RingFinder();
	_.fingerBreak = 5;
	_.innerGetRings = function() {
		for ( var i = 0, ii = this.atoms.length; i < ii; i++) {
			var neigh = [];
			for ( var j = 0, jj = this.bonds.length; j < jj; j++) {
				if (this.bonds[j].contains(this.atoms[i])) {
					neigh.push(this.bonds[j].getNeighbor(this.atoms[i]));
				}
			}
			for ( var j = 0, jj = neigh.length; j < jj; j++) {
				// weird that i can't optimize this loop without breaking a test
				// case...
				for ( var k = j + 1; k < neigh.length; k++) {
					var fingers = [];
					fingers[0] = new Finger(neigh[j]);
					fingers[1] = new Finger(neigh[k]);
					var blockers = [];
					blockers[0] = this.atoms[i];
					for ( var l = 0, ll = neigh.length; l < ll; l++) {
						if (l !== j && l !== k) {
							blockers.push(neigh[l]);
						}
					}
					var found = [];
					// check for 3 membered ring
					var three = fingers[0].check(this.bonds, fingers[1], this.atoms[i]);
					if (three) {
						found[0] = three;
					}
					while (found.length === 0 && fingers.length > 0 && fingers[0].atoms.length < this.fingerBreak) {
						var newfingers = [];
						for ( var l = 0, ll = fingers.length; l < ll; l++) {
							var adding = fingers[l].grow(this.bonds, blockers);
							for ( var m = 0, mm = adding.length; m < mm; m++) {
								newfingers.push(adding[m]);
							}
						}
						fingers = newfingers;
						for ( var l = 0, ll = fingers.length; l < ll; l++) {
							for ( var m = l + 1; m < ll; m++) {
								var r = fingers[l].check(this.bonds, fingers[m], this.atoms[i]);
								if (r) {
									found.push(r);
								}
							}
						}
						if (found.length === 0) {
							var newBlockers = [];
							for ( var l = 0, ll = blockers.length; l < ll; l++) {
								for ( var m = 0, mm = this.bonds.length; m < mm; m++) {
									if (this.bonds[m].contains(blockers[l])) {
										var neigh = this.bonds[m].getNeighbor(blockers[l]);
										if (blockers.indexOf(neigh) === -1 && newBlockers.indexOf(neigh) === -1) {
											newBlockers.push(neigh);
										}
									}
								}
							}
							for ( var l = 0, ll = newBlockers.length; l < ll; l++) {
								blockers.push(newBlockers[l]);
							}
						}
					}
					if (found.length > 0) {
						// this undefined is required...weird, don't know why
						var use = undefined;
						for ( var l = 0, ll = found.length; l < ll; l++) {
							if (!use || use.atoms.length > found[l].atoms.length) {
								use = found[l];
							}
						}
						var already = false;
						for ( var l = 0, ll = this.rings.length; l < ll; l++) {
							var all = true;
							for ( var m = 0, mm = use.atoms.length; m < mm; m++) {
								if (this.rings[l].atoms.indexOf(use.atoms[m]) === -1) {
									all = false;
									break;
								}
							}
							if (all) {
								already = true;
								break;
							}
						}
						if (!already) {
							this.rings.push(use);
						}
					}
				}
			}
		}
		this.fuse();
	};

})(ChemDoodle.informatics, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(informatics) {
	'use strict';
	informatics.SSSRFinder = function(molecule) {
		this.rings = [];
		if (molecule.atoms.length > 0) {
			var frerejacqueNumber = new informatics.FrerejacqueNumberCounter(molecule).value;
			var all = new informatics.EulerFacetRingFinder(molecule).rings;
			all.sort(function(a, b) {
				return a.atoms.length - b.atoms.length;
			});
			for ( var i = 0, ii = molecule.bonds.length; i < ii; i++) {
				molecule.bonds[i].visited = false;
			}
			for ( var i = 0, ii = all.length; i < ii; i++) {
				var use = false;
				for ( var j = 0, jj = all[i].bonds.length; j < jj; j++) {
					if (!all[i].bonds[j].visited) {
						use = true;
						break;
					}
				}
				if (use) {
					for ( var j = 0, jj = all[i].bonds.length; j < jj; j++) {
						all[i].bonds[j].visited = true;
					}
					this.rings.push(all[i]);
				}
				if (this.rings.length === frerejacqueNumber) {
					break;
				}
			}
		}
	};

})(ChemDoodle.informatics);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3915 $
//  $Author: kevin $
//  $LastChangedDate: 2012-11-30 12:11:00 -0500 (Fri, 30 Nov 2012) $
//
(function(io) {
	'use strict';
	io._Interpreter = function() {
	};
	var _ = io._Interpreter.prototype;
	_.fit = function(data, length, leftAlign) {
		var size = data.length;
		var padding = [];
		for ( var i = 0; i < length - size; i++) {
			padding.push(' ');
		}
		return leftAlign ? data + padding.join('') : padding.join('') + data;
	};

})(ChemDoodle.io);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3385 $
//  $Author: kevin $
//  $LastChangedDate: 2011-09-18 11:40:07 -0400 (Sun, 18 Sep 2011) $
//

(function(c, extensions, io, structures, m, m4, v3) {
	'use strict';
	var whitespaceRegex = /\s+/g;
	var whitespaceAndParenthesisRegex = /\(|\)|\s+/g;
	var whitespaceAndQuoteRegex = /\'|\s+/g;
	var whitespaceAndQuoteAndCommaRegex = /,|\'|\s+/g;
	var leadingWhitespaceRegex = /^\s+/;
	var digitsRegex = /[0-9]/g;
	var digitsSymbolRegex = /[0-9]|\+|\-/g;

	var filter = function(s) {
		return s.length !== 0;
	};

	var hallTranslations = {
		'P' : [],
		'A' : [ [ 0, .5, .5 ] ],
		'B' : [ [ .5, 0, .5 ] ],
		'C' : [ [ .5, .5, 0 ] ],
		'I' : [ [ .5, .5, .5 ] ],
		'R' : [ [ 2 / 3, 1 / 3, 1 / 3 ], [ 1 / 3, 2 / 3, 2 / 3 ] ],
		'S' : [ [ 1 / 3, 1 / 3, 2 / 3 ], [ 2 / 3, 2 / 3, 1 / 3 ] ],
		'T' : [ [ 1 / 3, 2 / 3, 1 / 3 ], [ 2 / 3, 1 / 3, 2 / 3 ] ],
		'F' : [ [ 0, .5, .5 ], [ .5, 0, .5 ], [ .5, .5, 0 ] ]
	};

	var parseTransform = function(s) {
		var displacement = 0;
		var x = 0, y = 0, z = 0;
		var indexx = s.indexOf('x');
		var indexy = s.indexOf('y');
		var indexz = s.indexOf('z');
		if (indexx !== -1) {
			x++;
			if (indexx > 0 && s.charAt(indexx - 1) !== '+') {
				x *= -1;
			}
		}
		if (indexy !== -1) {
			y++;
			if (indexy > 0 && s.charAt(indexy - 1) !== '+') {
				y *= -1;
			}
		}
		if (indexz !== -1) {
			z++;
			if (indexz > 0 && s.charAt(indexz - 1) !== '+') {
				z *= -1;
			}
		}
		if (s.length > 2) {
			var op = '+';
			for ( var i = 0, ii = s.length; i < ii; i++) {
				var l = s.charAt(i);
				if ((l === '-' || l === '/') && (i === s.length - 1 || s.charAt(i + 1).match(digitsRegex))) {
					op = l;
				}
				if (l.match(digitsRegex)) {
					if (op === '+') {
						displacement += parseInt(l);
					} else if (op === '-') {
						displacement -= parseInt(l);
					} else if (op === '/') {
						displacement /= parseInt(l);
					}
				}
			}
		}
		return [ displacement, x, y, z ];
	};

	var generateABC2XYZ = function(a, b, c, alpha, beta, gamma) {
		var d = (m.cos(alpha) - m.cos(gamma) * m.cos(beta)) / m.sin(gamma);
		return [ a, 0, 0, 0, b * m.cos(gamma), b * m.sin(gamma), 0, 0, c * m.cos(beta), c * d, c * m.sqrt(1 - m.pow(m.cos(beta), 2) - d * d), 0, 0, 0, 0, 1 ];
	};

	io.CIFInterpreter = function() {
	};
	var _ = io.CIFInterpreter.prototype = new io._Interpreter();
	_.read = function(content, xSuper, ySuper, zSuper) {
		xSuper = xSuper ? xSuper : 1;
		ySuper = ySuper ? ySuper : 1;
		zSuper = zSuper ? zSuper : 1;
		var molecule = new structures.Molecule();
		if (!content) {
			return molecule;
		}
		var lines = content.split('\n');
		var aLength = 0, bLength = 0, cLength = 0, alphaAngle = 0, betaAngle = 0, gammaAngle = 0;
		var hallClass = 'P';
		var transformLoop;
		var atomLoop;
		var bondLoop;

		var line;
		var shift = true;
		while (lines.length > 0) {
			if (shift) {
				line = lines.shift();
			} else {
				shift = true;
			}
			if (line.length > 0) {
				if (extensions.stringStartsWith(line, '_cell_length_a')) {
					aLength = parseFloat(line.split(whitespaceAndParenthesisRegex)[1]);
				} else if (extensions.stringStartsWith(line, '_cell_length_b')) {
					bLength = parseFloat(line.split(whitespaceAndParenthesisRegex)[1]);
				} else if (extensions.stringStartsWith(line, '_cell_length_c')) {
					cLength = parseFloat(line.split(whitespaceAndParenthesisRegex)[1]);
				} else if (extensions.stringStartsWith(line, '_cell_angle_alpha')) {
					alphaAngle = m.PI * parseFloat(line.split(whitespaceAndParenthesisRegex)[1]) / 180;
				} else if (extensions.stringStartsWith(line, '_cell_angle_beta')) {
					betaAngle = m.PI * parseFloat(line.split(whitespaceAndParenthesisRegex)[1]) / 180;
				} else if (extensions.stringStartsWith(line, '_cell_angle_gamma')) {
					gammaAngle = m.PI * parseFloat(line.split(whitespaceAndParenthesisRegex)[1]) / 180;
				} else if (extensions.stringStartsWith(line, '_symmetry_space_group_name_H-M')) {
					hallClass = line.split(whitespaceAndQuoteRegex)[1];
				} else if (extensions.stringStartsWith(line, 'loop_')) {
					var loop = {
						fields : [],
						lines : []
					};
					var pushingLines = false;
					// keep undefined check here because the line may be an
					// empty string
					while ((line = lines.shift()) !== undefined && !extensions.stringStartsWith(line = line.replace(leadingWhitespaceRegex, ''), 'loop_') && line.length > 0) {
						// remove leading whitespace that may appear in
						// subloop lines ^
						if (extensions.stringStartsWith(line, '_')) {
							if (pushingLines) {
								break;
							}
							loop.fields = loop.fields.concat(line.split(whitespaceRegex).filter(filter));
						} else {
							pushingLines = true;
							loop.lines.push(line);
						}
					}
					if (lines.length !== 0 && (extensions.stringStartsWith(line, 'loop_') || extensions.stringStartsWith(line, '_'))) {
						shift = false;
					}
					if (loop.fields.indexOf('_symmetry_equiv_pos_as_xyz') !== -1 || loop.fields.indexOf('_space_group_symop_operation_xyz') !== -1) {
						transformLoop = loop;
					} else if (loop.fields.indexOf('_atom_site_label') !== -1) {
						atomLoop = loop;
					} else if (loop.fields.indexOf('_geom_bond_atom_site_label_1') !== -1) {
						bondLoop = loop;
					}
				}
			}
		}
		var abc2xyz = generateABC2XYZ(aLength, bLength, cLength, alphaAngle, betaAngle, gammaAngle);
		// internal atom coordinates
		if (atomLoop) {
			var labelIndex = -1, altLabelIndex = -1, xIndex = -1, yIndex = -1, zIndex = -1;
			for ( var i = 0, ii = atomLoop.fields.length; i < ii; i++) {
				var field = atomLoop.fields[i];
				if (field === '_atom_site_type_symbol') {
					labelIndex = i;
				} else if (field === '_atom_site_label') {
					altLabelIndex = i;
				} else if (field === '_atom_site_fract_x') {
					xIndex = i;
				} else if (field === '_atom_site_fract_y') {
					yIndex = i;
				} else if (field === '_atom_site_fract_z') {
					zIndex = i;
				}
			}
			for ( var i = 0, ii = atomLoop.lines.length; i < ii; i++) {
				line = atomLoop.lines[i];
				var tokens = line.split(whitespaceRegex).filter(filter);
				var a = new structures.Atom(tokens[labelIndex === -1 ? altLabelIndex : labelIndex].split(digitsSymbolRegex)[0], parseFloat(tokens[xIndex]), parseFloat(tokens[yIndex]), parseFloat(tokens[zIndex]));
				molecule.atoms.push(a);
				if (altLabelIndex !== -1) {
					a.cifId = tokens[altLabelIndex];
					a.cifPart = 0;
				}
			}
		}
		// transforms, unless bonds are specified
		if (transformLoop && !bondLoop) {
			// assume the index is 0, just incase a different identifier is
			// used
			var symIndex = 0;
			for ( var i = 0, ii = transformLoop.fields.length; i < ii; i++) {
				var field = transformLoop.fields[i];
				if (field === '_symmetry_equiv_pos_as_xyz' || field === '_space_group_symop_operation_xyz') {
					symIndex = i;
				}
			}
			var impliedTranslations = hallTranslations[hallClass];
			var add = [];
			for ( var i = 0, ii = transformLoop.lines.length; i < ii; i++) {
				var parts = transformLoop.lines[i].split(whitespaceAndQuoteAndCommaRegex).filter(filter);
				var multx = parseTransform(parts[symIndex]);
				var multy = parseTransform(parts[symIndex + 1]);
				var multz = parseTransform(parts[symIndex + 2]);
				for ( var j = 0, jj = molecule.atoms.length; j < jj; j++) {
					var a = molecule.atoms[j];
					var x = a.x * multx[1] + a.y * multx[2] + a.z * multx[3] + multx[0];
					var y = a.x * multy[1] + a.y * multy[2] + a.z * multy[3] + multy[0];
					var z = a.x * multz[1] + a.y * multz[2] + a.z * multz[3] + multz[0];
					var copy1 = new structures.Atom(a.label, x, y, z);
					add.push(copy1);
					// cifID could be 0, so check for undefined
					if (a.cifId !== undefined) {
						copy1.cifId = a.cifId;
						copy1.cifPart = i + 1;
					}
					if (impliedTranslations) {
						for ( var k = 0, kk = impliedTranslations.length; k < kk; k++) {
							var trans = impliedTranslations[k];
							var copy2 = new structures.Atom(a.label, x + trans[0], y + trans[1], z + trans[2]);
							add.push(copy2);
							// cifID could be 0, so check for undefined
							if (a.cifId !== undefined) {
								copy2.cifId = a.cifId;
								copy2.cifPart = i + 1;
							}
						}
					}
				}
			}
			// make sure all atoms are within the unit cell
			for ( var i = 0, ii = add.length; i < ii; i++) {
				var a = add[i];
				while (a.x >= 1) {
					a.x--;
				}
				while (a.x < 0) {
					a.x++;
				}
				while (a.y >= 1) {
					a.y--;
				}
				while (a.y < 0) {
					a.y++;
				}
				while (a.z >= 1) {
					a.z--;
				}
				while (a.z < 0) {
					a.z++;
				}
			}
			// remove overlaps
			var noOverlaps = [];
			for ( var i = 0, ii = add.length; i < ii; i++) {
				var overlap = false;
				var a = add[i];
				for ( var j = 0, jj = molecule.atoms.length; j < jj; j++) {
					if (molecule.atoms[j].distance3D(a) < .0001) {
						overlap = true;
						break;
					}
				}
				if (!overlap) {
					for ( var j = 0, jj = noOverlaps.length; j < jj; j++) {
						if (noOverlaps[j].distance3D(a) < .0001) {
							overlap = true;
							break;
						}
					}
					if (!overlap) {
						noOverlaps.push(a);
					}
				}
			}
			// concat arrays
			molecule.atoms = molecule.atoms.concat(noOverlaps);
		}
		// build super cell
		var extras = [];
		for ( var i = 0; i < xSuper; i++) {
			for ( var j = 0; j < ySuper; j++) {
				for ( var k = 0; k < zSuper; k++) {
					if (!(i === 0 && j === 0 && k === 0)) {
						for ( var l = 0, ll = molecule.atoms.length; l < ll; l++) {
							var a = molecule.atoms[l];
							var copy = new structures.Atom(a.label, a.x + i, a.y + j, a.z + k);
							extras.push(copy);
							// cifID could be 0, so check for undefined
							if (a.cifId !== undefined) {
								copy.cifId = a.cifId;
								copy.cifPart = a.cifPart + (transformLoop ? transformLoop.lines.length : 0) + i + j * 10 + k * 100;
							}
						}
					}
				}
			}
		}
		molecule.atoms = molecule.atoms.concat(extras);
		// convert to xyz
		for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
			var a = molecule.atoms[i];
			var xyz = m4.multiplyVec3(abc2xyz, [ a.x, a.y, a.z ]);
			a.x = xyz[0];
			a.y = xyz[1];
			a.z = xyz[2];
		}
		// handle bonds
		if (bondLoop) {
			var atom1 = -1, atom2 = -1;
			for ( var i = 0, ii = bondLoop.fields.length; i < ii; i++) {
				var field = bondLoop.fields[i];
				if (field === '_geom_bond_atom_site_label_1') {
					atom1 = i;
				} else if (field === '_geom_bond_atom_site_label_2') {
					atom2 = i;
				}
			}
			for ( var k = 0, kk = bondLoop.lines.length; k < kk; k++) {
				var tokens = bondLoop.lines[k].split(whitespaceRegex).filter(filter);
				var id1 = tokens[atom1];
				var id2 = tokens[atom2];
				for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
					for ( var j = i + 1; j < ii; j++) {
						var ai = molecule.atoms[i];
						var aj = molecule.atoms[j];
						if (ai.cifPart !== aj.cifPart) {
							break;
						}
						if (ai.cifId === id1 && aj.cifId === id2 || ai.cifId === id2 && aj.cifId === id1) {
							molecule.bonds.push(new structures.Bond(ai, aj));
						}
					}
				}
			}
		} else {
			new c.informatics.BondDeducer().deduceCovalentBonds(molecule, 1);
		}
		// generate unit cell
		var o = [ -xSuper / 2, -ySuper / 2, -zSuper / 2 ];
		molecule.unitCellVectors = {
			o : m4.multiplyVec3(abc2xyz, o, []),
			x : m4.multiplyVec3(abc2xyz, [ o[0] + 1, o[1], o[2] ]),
			y : m4.multiplyVec3(abc2xyz, [ o[0], o[1] + 1, o[2] ]),
			z : m4.multiplyVec3(abc2xyz, [ o[0], o[1], o[2] + 1 ]),
			xy : m4.multiplyVec3(abc2xyz, [ o[0] + 1, o[1] + 1, o[2] ]),
			xz : m4.multiplyVec3(abc2xyz, [ o[0] + 1, o[1], o[2] + 1 ]),
			yz : m4.multiplyVec3(abc2xyz, [ o[0], o[1] + 1, o[2] + 1 ]),
			xyz : m4.multiplyVec3(abc2xyz, [ o[0] + 1, o[1] + 1, o[2] + 1 ])
		};
		return molecule;
	};

	// shortcuts
	var interpreter = new io.CIFInterpreter();
	c.readCIF = function(content, xSuper, ySuper, zSuper) {
		return interpreter.read(content, xSuper, ySuper, zSuper);
	};

})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.io, ChemDoodle.structures, Math, mat4, vec3);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4500 $
//  $Author: kevin $
//  $LastChangedDate: 2013-09-06 14:28:15 -0400 (Fri, 06 Sep 2013) $
//

(function(c, ELEMENT, io, structures) {
	'use strict';
	io.MOLInterpreter = function() {
	};
	var _ = io.MOLInterpreter.prototype = new io._Interpreter();
	_.read = function(content, multiplier) {
		if (!multiplier) {
			multiplier = c.default_bondLength_2D;
		}
		var molecule = new structures.Molecule();
		if (!content) {
			return molecule;
		}
		var currentTagTokens = content.split('\n');

		var counts = currentTagTokens[3];
		var numAtoms = parseInt(counts.substring(0, 3));
		var numBonds = parseInt(counts.substring(3, 6));

		for ( var i = 0; i < numAtoms; i++) {
			var line = currentTagTokens[4 + i];
			molecule.atoms[i] = new structures.Atom(line.substring(31, 34), parseFloat(line.substring(0, 10)) * multiplier, (multiplier === 1 ? 1 : -1) * parseFloat(line.substring(10, 20)) * multiplier, parseFloat(line.substring(20, 30)) * multiplier);
			var massDif = parseInt(line.substring(34, 36));
			if (massDif !== 0 && ELEMENT[molecule.atoms[i].label]) {
				molecule.atoms[i].mass = ELEMENT[molecule.atoms[i].label].mass + massDif;
			}
			switch (parseInt(line.substring(36, 39))) {
			case 1:
				molecule.atoms[i].charge = 3;
				break;
			case 2:
				molecule.atoms[i].charge = 2;
				break;
			case 3:
				molecule.atoms[i].charge = 1;
				break;
			case 5:
				molecule.atoms[i].charge = -1;
				break;
			case 6:
				molecule.atoms[i].charge = -2;
				break;
			case 7:
				molecule.atoms[i].charge = -3;
				break;
			}
		}
		for ( var i = 0; i < numBonds; i++) {
			var line = currentTagTokens[4 + numAtoms + i];
			var bondOrder = parseInt(line.substring(6, 9));
			var stereo = parseInt(line.substring(9, 12));
			if (bondOrder > 3) {
				switch (bondOrder) {
				case 4:
					bondOrder = 1.5;
					break;
				default:
					bondOrder = 1;
					break;
				}
			}
			var b = new structures.Bond(molecule.atoms[parseInt(line.substring(0, 3)) - 1], molecule.atoms[parseInt(line.substring(3, 6)) - 1], bondOrder);
			switch (stereo) {
			case 3:
				b.stereo = structures.Bond.STEREO_AMBIGUOUS;
				break;
			case 1:
				b.stereo = structures.Bond.STEREO_PROTRUDING;
				break;
			case 6:
				b.stereo = structures.Bond.STEREO_RECESSED;
				break;
			}
			molecule.bonds[i] = b;
		}
		return molecule;
	};
	_.write = function(molecule) {
		var sb = [];
		sb.push('Molecule from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n');
		sb.push(this.fit(molecule.atoms.length.toString(), 3));
		sb.push(this.fit(molecule.bonds.length.toString(), 3));
		sb.push('  0  0  0  0            999 V2000\n');
		var p = molecule.getCenter();
		for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
			var a = molecule.atoms[i];
			var mass = ' 0';
			if (a.mass !== -1 && ELEMENT[a.label]) {
				var dif = a.mass - ELEMENT[a.label].mass;
				if (dif < 5 && dif > -4) {
					mass = (dif > -1 ? ' ' : '') + dif;
				}
			}
			var charge = '  0';
			if (a.charge !== 0) {
				switch (a.charge) {
				case 3:
					charge = '  1';
					break;
				case 2:
					charge = '  2';
					break;
				case 1:
					charge = '  3';
					break;
				case -1:
					charge = '  5';
					break;
				case -2:
					charge = '  6';
					break;
				case -3:
					charge = '  7';
					break;
				}
			}
			sb.push(this.fit(((a.x - p.x) / c.default_bondLength_2D).toFixed(4), 10));
			sb.push(this.fit((-(a.y - p.y) / c.default_bondLength_2D).toFixed(4), 10));
			sb.push(this.fit((a.z / c.default_bondLength_2D).toFixed(4), 10));
			sb.push(' ');
			sb.push(this.fit(a.label, 3, true));
			sb.push(mass);
			sb.push(charge);
			sb.push('  0  0  0  0\n');
		}
		for ( var i = 0, ii = molecule.bonds.length; i < ii; i++) {
			var b = molecule.bonds[i];
			var stereo = 0;
			if (b.stereo === structures.Bond.STEREO_AMBIGUOUS) {
				stereo = 3;
			} else if (b.stereo === structures.Bond.STEREO_PROTRUDING) {
				stereo = 1;
			} else if (b.stereo === structures.Bond.STEREO_RECESSED) {
				stereo = 6;
			}
			sb.push(this.fit((molecule.atoms.indexOf(b.a1) + 1).toString(), 3));
			sb.push(this.fit((molecule.atoms.indexOf(b.a2) + 1).toString(), 3));
			var btype = b.bondOrder;
			if(btype==1.5){
				btype = 4;
			}else if(btype>3 || btype%1!=0){
				btype = 1;
			}
			sb.push(this.fit(btype, 3));
			sb.push('  ');
			sb.push(stereo);
			sb.push('     0  0\n');
		}
		sb.push('M  END');
		return sb.join('');
	};

	// shortcuts
	var interpreter = new io.MOLInterpreter();
	c.readMOL = function(content, multiplier) {
		return interpreter.read(content, multiplier);
	};
	c.writeMOL = function(mol) {
		return interpreter.write(mol);
	};

})(ChemDoodle, ChemDoodle.ELEMENT, ChemDoodle.io, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, extensions, io, structures, ELEMENT, trim, m) {
	'use strict';
	function checkContained(residue, set, chainID, index, helix) {
		for ( var j = 0, jj = set.length; j < jj; j++) {
			var check = set[j];
			if (check.id === chainID && index >= check.start && index <= check.end) {
				if (helix) {
					residue.helix = true;
				} else {
					residue.sheet = true;
				}
				if (index + 1 === check.end) {
					residue.arrow = true;
				}
				return;
			}
		}
	}
	
	io.PDBInterpreter = function() {
	};
	var _ = io.PDBInterpreter.prototype = new io._Interpreter();
	_.calculateRibbonDistances = false;
	_.deduceResidueBonds = false;
	_.read = function(content, multiplier) {
		var molecule = new structures.Molecule();
		molecule.chains = [];
		if (!content) {
			return molecule;
		}
		var currentTagTokens = content.split('\n');
		if (!multiplier) {
			multiplier = 1;
		}
		var helices = [];
		var sheets = [];
		var lastC;
		var currentChain = [];
		var resatoms = [];
		var atomSerials = [];
		for ( var i = 0, ii = currentTagTokens.length; i < ii; i++) {
			var line = currentTagTokens[i];
			if (extensions.stringStartsWith(line, 'HELIX')) {
				helices.push({
					id : line.substring(19, 20),
					start : parseInt(line.substring(21, 25)),
					end : parseInt(line.substring(33, 37))
				});
			} else if (extensions.stringStartsWith(line, 'SHEET')) {
				sheets.push({
					id : line.substring(21, 22),
					start : parseInt(line.substring(22, 26)),
					end : parseInt(line.substring(33, 37))
				});
			} else if (extensions.stringStartsWith(line, 'ATOM')) {
				var altLoc = line.substring(16, 17);
				if (altLoc === ' ' || altLoc === 'A') {
					var label = trim(line.substring(76, 78));
					if (label.length === 0) {
						var s = trim(line.substring(12, 14));
						if (s === 'HD') {
							label = 'H';
						} else if (s.length > 0) {
							if (s.length > 1) {
								label = s.charAt(0) + s.substring(1).toLowerCase();
							} else {
								label = s;
							}
						}
					}
					var a = new structures.Atom(label, parseFloat(line.substring(30, 38)) * multiplier, parseFloat(line.substring(38, 46)) * multiplier, parseFloat(line.substring(46, 54)) * multiplier);
					a.hetatm = false;
					resatoms.push(a);
					// set up residue
					var resSeq = parseInt(line.substring(22, 26));
					if (currentChain.length === 0) {
						for ( var j = 0; j < 2; j++) {
							var dummyFront = new structures.Residue(-1);
							dummyFront.cp1 = a;
							dummyFront.cp2 = a;
							currentChain.push(dummyFront);
						}
					}
					if (resSeq !== Number.NaN && currentChain[currentChain.length - 1].resSeq !== resSeq) {
						var r = new structures.Residue(resSeq);
						r.name = trim(line.substring(17, 20));
						if (r.name.length === 3) {
							r.name = r.name.substring(0, 1) + r.name.substring(1).toLowerCase();
						} else {
							if (r.name.length === 2 && r.name.charAt(0) === 'D') {
								r.name = r.name.substring(1);
							}
						}
						currentChain.push(r);
						var chainID = line.substring(21, 22);
						checkContained(r, helices, chainID, resSeq, true);
						checkContained(r, sheets, chainID, resSeq, false);
					}
					// end residue setup
					var atomName = trim(line.substring(12, 16));
					var currentResidue = currentChain[currentChain.length - 1];
					if (atomName === 'CA' || atomName === 'P' || atomName === 'O5\'') {
						if (!currentResidue.cp1) {
							currentResidue.cp1 = a;
						}
					} else if (atomName === 'N3' && (currentResidue.name === 'C' || currentResidue.name === 'U' || currentResidue.name === 'T') || atomName === 'N1' && (currentResidue.name === 'A' || currentResidue.name === 'G')) {
						// control points for base platform direction
						currentResidue.cp3 = a;
					} else if (atomName === 'C2') {
						// control points for base platform orientation
						currentResidue.cp4 = a;
					} else if (atomName === 'C4' && (currentResidue.name === 'C' || currentResidue.name === 'U' || currentResidue.name === 'T') || atomName === 'C6' && (currentResidue.name === 'A' || currentResidue.name === 'G')) {
						// control points for base platform orientation
						currentResidue.cp5 = a;
					} else if (atomName === 'O' || atomName === 'C6' && (currentResidue.name === 'C' || currentResidue.name === 'U' || currentResidue.name === 'T') || atomName === 'N9') {
						if (!currentChain[currentChain.length - 1].cp2) {
							if (atomName === 'C6' || atomName === 'N9') {
								lastC = a;
							}
							currentResidue.cp2 = a;
						}
					} else if (atomName === 'C') {
						lastC = a;
					}
				}
			} else if (extensions.stringStartsWith(line, 'HETATM')) {
				var symbol = trim(line.substring(76, 78));
				if (symbol.length === 0) {
					// handle the case where an improperly formatted PDB
					// file states the element label in the atom name column
					symbol = trim(line.substring(12, 16));
				}
				if (symbol.length > 1) {
					symbol = symbol.substring(0, 1) + symbol.substring(1).toLowerCase();
				}
				var het = new structures.Atom(symbol, parseFloat(line.substring(30, 38)) * multiplier, parseFloat(line.substring(38, 46)) * multiplier, parseFloat(line.substring(46, 54)) * multiplier);
				het.hetatm = true;
				var residueName = trim(line.substring(17, 20));
				if (residueName === 'HOH') {
					het.isWater = true;
				}
				molecule.atoms.push(het);
				atomSerials[parseInt(trim(line.substring(6, 11)))] = het;
			} else if (extensions.stringStartsWith(line, 'CONECT')) {
				var oid = parseInt(trim(line.substring(6, 11)));
				if (atomSerials[oid]) {
					var origin = atomSerials[oid];
					for ( var k = 0; k < 4; k++) {
						var next = trim(line.substring(11 + k * 5, 16 + k * 5));
						if (next.length !== 0) {
							var nid = parseInt(next);
							if (atomSerials[nid]) {
								var a2 = atomSerials[nid];
								var found = false;
								for ( var j = 0, jj = molecule.bonds.length; j < jj; j++) {
									var b = molecule.bonds[j];
									if (b.a1 === origin && b.a2 === a2 || b.a1 === a2 && b.a2 === origin) {
										found = true;
										break;
									}
								}
								if (!found) {
									molecule.bonds.push(new structures.Bond(origin, a2));
								}
							}
						}
					}
				}
			} else if (extensions.stringStartsWith(line, 'TER')) {
				this.endChain(molecule, currentChain, lastC, resatoms);
				currentChain = [];
			} else if (extensions.stringStartsWith(line, 'ENDMDL')) {
				break;
			}
		}
		this.endChain(molecule, currentChain, lastC, resatoms);
		if (molecule.bonds.size === 0) {
			new c.informatics.BondDeducer().deduceCovalentBonds(molecule, multiplier);
		}
		if (this.deduceResidueBonds) {
			for ( var i = 0, ii = resatoms.length; i < ii; i++) {
				var max = m.min(ii, i + 20);
				for ( var j = i + 1; j < max; j++) {
					var first = resatoms[i];
					var second = resatoms[j];
					if (first.distance3D(second) < (ELEMENT[first.label].covalentRadius + ELEMENT[second.label].covalentRadius) * 1.1) {
						molecule.bonds.push(new structures.Bond(first, second, 1));
					}
				}
			}
		}
		molecule.atoms = molecule.atoms.concat(resatoms);
		if (this.calculateRibbonDistances) {
			this.calculateDistances(molecule, resatoms);
		}
		return molecule;
	};
	_.endChain = function(molecule, chain, lastC, resatoms) {
		if (chain.length > 0) {
			var last = chain[chain.length - 1];
			if (!last.cp1) {
				last.cp1 = resatoms[resatoms.length - 2];
			}
			if (!last.cp2) {
				last.cp2 = resatoms[resatoms.length - 1];
			}
			for ( var i = 0; i < 4; i++) {
				var dummyEnd = new structures.Residue(-1);
				dummyEnd.cp1 = lastC;
				dummyEnd.cp2 = chain[chain.length - 1].cp2;
				chain.push(dummyEnd);
			}
			molecule.chains.push(chain);
		}
	};
	_.calculateDistances = function(molecule, resatoms) {
		var hetatm = [];
		for ( var i = 0, ii = molecule.atoms.length; i < ii; i++) {
			var a = molecule.atoms[i];
			if (a.hetatm) {
				if (!a.isWater) {
					hetatm.push(a);
				}
			}
		}
		for ( var i = 0, ii = resatoms.length; i < ii; i++) {
			var a = resatoms[i];
			a.closestDistance = Number.POSITIVE_INFINITY;
			if (hetatm.length === 0) {
				a.closestDistance = 0;
			} else {
				for ( var j = 0, jj = hetatm.length; j < jj; j++) {
					a.closestDistance = Math.min(a.closestDistance, a.distance3D(hetatm[j]));
				}
			}
		}
	};

	// shortcuts
	var interpreter = new io.PDBInterpreter();
	c.readPDB = function(content, multiplier) {
		return interpreter.read(content, multiplier);
	};

})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.ELEMENT, jQuery.trim, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4137 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-22 12:46:00 -0500 (Fri, 22 Feb 2013) $
//

(function(c, extensions, io, structures, q, trim) {
	'use strict';
	var SQZ_HASH = {
		'@' : 0,
		'A' : 1,
		'B' : 2,
		'C' : 3,
		'D' : 4,
		'E' : 5,
		'F' : 6,
		'G' : 7,
		'H' : 8,
		'I' : 9,
		'a' : -1,
		'b' : -2,
		'c' : -3,
		'd' : -4,
		'e' : -5,
		'f' : -6,
		'g' : -7,
		'h' : -8,
		'i' : -9
	}, DIF_HASH = {
		'%' : 0,
		'J' : 1,
		'K' : 2,
		'L' : 3,
		'M' : 4,
		'N' : 5,
		'O' : 6,
		'P' : 7,
		'Q' : 8,
		'R' : 9,
		'j' : -1,
		'k' : -2,
		'l' : -3,
		'm' : -4,
		'n' : -5,
		'o' : -6,
		'p' : -7,
		'q' : -8,
		'r' : -9
	}, DUP_HASH = {
		'S' : 1,
		'T' : 2,
		'U' : 3,
		'V' : 4,
		'W' : 5,
		'X' : 6,
		'Y' : 7,
		'Z' : 8,
		's' : 9
	};

	io.JCAMPInterpreter = function() {
	};
	var _ = io.JCAMPInterpreter.prototype = new io._Interpreter();
	_.convertHZ2PPM = false;
	_.read = function(content) {
		this.isBreak = function(c) {
			// some of these arrays may return zero, so check if undefined
			return SQZ_HASH[c] !== undefined || DIF_HASH[c] !== undefined || DUP_HASH[c] !== undefined || c === ' ' || c === '-' || c === '+';
		};
		this.getValue = function(decipher, lastDif) {
			var first = decipher.charAt(0);
			var rest = decipher.substring(1);
			// some of these arrays may return zero, so check if undefined
			if (SQZ_HASH[first] !== undefined) {
				return parseFloat(SQZ_HASH[first] + rest);
			} else if (DIF_HASH[first] !== undefined) {
				return parseFloat(DIF_HASH[first] + rest) + lastDif;
			}
			return parseFloat(rest);
		};
		var spectrum = new structures.Spectrum();
		if (content === undefined || content.length === 0) {
			return spectrum;
		}
		var lines = content.split('\n');
		var sb = [];
		var xLast, xFirst, yFirst, nPoints, xFactor = 1, yFactor = 1, observeFrequency = 1, deltaX = -1, shiftOffsetNum = -1, shiftOffsetVal = -1;
		var recordMeta = true, divideByFrequency = false;
		for ( var i = 0, ii = lines.length; i < ii; i++) {
			var use = trim(lines[i]);
			var index = use.indexOf('$$');
			if (index !== -1) {
				use = use.substring(0, index);
			}
			if (sb.length === 0 || !extensions.stringStartsWith(lines[i], '##')) {
				if (sb.length !== 0) {
					sb.push('\n');
				}
				sb.push(trim(use));
			} else {
				var currentRecord = sb.join('');
				if (recordMeta && currentRecord.length < 100) {
					spectrum.metadata.push(currentRecord);
				}
				sb = [ use ];
				if (extensions.stringStartsWith(currentRecord, '##TITLE=')) {
					spectrum.title = trim(currentRecord.substring(8));
				} else if (extensions.stringStartsWith(currentRecord, '##XUNITS=')) {
					spectrum.xUnit = trim(currentRecord.substring(9));
					if (this.convertHZ2PPM && spectrum.xUnit.toUpperCase() === 'HZ') {
						spectrum.xUnit = 'PPM';
						divideByFrequency = true;
					}
				} else if (extensions.stringStartsWith(currentRecord, '##YUNITS=')) {
					spectrum.yUnit = trim(currentRecord.substring(9));
				} else if (extensions.stringStartsWith(currentRecord, '##XYPAIRS=')) {
					// spectrum.yUnit =
					// trim(currentRecord.substring(9));
				} else if (extensions.stringStartsWith(currentRecord, '##FIRSTX=')) {
					xFirst = parseFloat(trim(currentRecord.substring(9)));
				} else if (extensions.stringStartsWith(currentRecord, '##LASTX=')) {
					xLast = parseFloat(trim(currentRecord.substring(8)));
				} else if (extensions.stringStartsWith(currentRecord, '##FIRSTY=')) {
					yFirst = parseFloat(trim(currentRecord.substring(9)));
				} else if (extensions.stringStartsWith(currentRecord, '##NPOINTS=')) {
					nPoints = parseFloat(trim(currentRecord.substring(10)));
				} else if (extensions.stringStartsWith(currentRecord, '##XFACTOR=')) {
					xFactor = parseFloat(trim(currentRecord.substring(10)));
				} else if (extensions.stringStartsWith(currentRecord, '##YFACTOR=')) {
					yFactor = parseFloat(trim(currentRecord.substring(10)));
				} else if (extensions.stringStartsWith(currentRecord, '##DELTAX=')) {
					deltaX = parseFloat(trim(currentRecord.substring(9)));
				} else if (extensions.stringStartsWith(currentRecord, '##.OBSERVE FREQUENCY=')) {
					if (this.convertHZ2PPM) {
						observeFrequency = parseFloat(trim(currentRecord.substring(21)));
					}
				} else if (extensions.stringStartsWith(currentRecord, '##.SHIFT REFERENCE=')) {
					if (this.convertHZ2PPM) {
						var parts = currentRecord.substring(19).split(',');
						shiftOffsetNum = parseInt(trim(parts[2]));
						shiftOffsetVal = parseFloat(trim(parts[3]));
					}
				} else if (extensions.stringStartsWith(currentRecord, '##XYDATA=')) {
					if (!divideByFrequency) {
						observeFrequency = 1;
					}
					recordMeta = false;
					var lastWasDif = false;
					var innerLines = currentRecord.split('\n');
					var abscissaSpacing = (xLast - xFirst) / (nPoints - 1);
					// use provided deltaX if determined to be compressed
					// and discontinuous
					if (deltaX !== -1) {
						for ( var j = 1, jj = innerLines.length; j < jj; j++) {
							if (innerLines[j].charAt(0) === '|') {
								abscissaSpacing = deltaX;
								break;
							}
						}
					}
					var lastX = xFirst - abscissaSpacing;
					var lastY = yFirst;
					var lastDif = 0;
					var lastOrdinate;
					for ( var j = 1, jj = innerLines.length; j < jj; j++) {
						var data = [];
						var read = trim(innerLines[j]);
						var sb = [];
						var isCompressedDiscontinuous = false;
						for ( var k = 0, kk = read.length; k < kk; k++) {
							if (this.isBreak(read.charAt(k))) {
								if (sb.length > 0 && !(sb.length === 1 && sb[0] === ' ')) {
									data.push(sb.join(''));
								}
								sb = [ read.charAt(k) ];
							} else {
								if (read.charAt(k) === '|') {
									isCompressedDiscontinuous = true;
								} else {
									sb.push(read.charAt(k));
								}
							}
						}
						data.push(sb.join(''));
						lastX = parseFloat(data[0]) * xFactor - abscissaSpacing;
						for ( var k = 1, kk = data.length; k < kk; k++) {
							var decipher = data[k];
							// some of these arrays may return zero, so
							// check if undefined
							if (DUP_HASH[decipher.charAt(0)] !== undefined) {
								// be careful when reading this, to keep
								// spectra efficient, DUPS are actually
								// discarded, except the last y!
								var dup = parseInt(DUP_HASH[decipher.charAt(0)] + decipher.substring(1)) - 1;
								for ( var l = 0; l < dup; l++) {
									lastX += abscissaSpacing;
									lastDif = this.getValue(lastOrdinate, lastDif);
									lastY = lastDif * yFactor;
									count++;
									spectrum.data[spectrum.data.length - 1] = new structures.Point(lastX / observeFrequency, lastY);
								}
							} else {
								// some of these arrays may return zero, so
								// check if undefined
								if (!(SQZ_HASH[decipher.charAt(0)] !== undefined && lastWasDif)) {
									lastWasDif = DIF_HASH[decipher.charAt(0)] !== undefined;
									lastOrdinate = decipher;
									lastX += abscissaSpacing;
									lastDif = this.getValue(decipher, lastDif);
									lastY = lastDif * yFactor;
									count++;
									spectrum.data.push(new structures.Point(lastX / observeFrequency, lastY));
								} else {
									lastY = this.getValue(decipher, lastDif) * yFactor;
									if (isCompressedDiscontinuous) {
										lastX += abscissaSpacing;
										spectrum.data.push(new structures.Point(lastX / observeFrequency, lastY));
									}
								}
							}
						}
					}
					if (shiftOffsetNum !== -1) {
						var dif = shiftOffsetVal - spectrum.data[shiftOffsetNum - 1].x;
						for ( var i = 0, ii = spectrum.data.length; i < ii; i++) {
							spectrum.data[i].x += dif;
						}
					}
				} else if (extensions.stringStartsWith(currentRecord, '##PEAK TABLE=')) {
					recordMeta = false;
					spectrum.continuous = false;
					var innerLines = currentRecord.split('\n');
					var count = 0;
					for ( var j = 1, jj = innerLines.length; j < jj; j++) {
						var items = innerLines[j].split(/[\s,]+/);
						count += items.length / 2;
						for ( var k = 0, kk = items.length; k + 1 < kk; k += 2) {
							spectrum.data.push(new structures.Point(parseFloat(trim(items[k])), parseFloat(trim(items[k + 1]))));
						}
					}
				}
			}
		}
		spectrum.setup();
		return spectrum;
	};

	// shortcuts
	var interpreter = new io.JCAMPInterpreter();
	interpreter.convertHZ2PPM = true;
	c.readJCAMP = function(content) {
		return interpreter.read(content);
	};
})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.io, ChemDoodle.structures, jQuery, jQuery.trim);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2934 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-08 20:53:47 -0500 (Wed, 08 Dec 2010) $
//
(function(c, io, structures, d2, JSON) {
	'use strict';
	io.JSONInterpreter = function() {
	};
	var _ = io.JSONInterpreter.prototype;
	_.contentTo = function(mols, shapes) {
		var count1 = 0, count2 = 0;
		for ( var i = 0, ii = mols.length; i < ii; i++) {
			var mol = mols[i];
			for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
				mol.atoms[j].tmpid = 'a' + count1++;
			}
			for ( var j = 0, jj = mol.bonds.length; j < jj; j++) {
				mol.bonds[j].tmpid = 'b' + count2++;
			}
		}
		count1 = 0;
		for ( var i = 0, ii = shapes.length; i < ii; i++) {
			shapes[i].tmpid = 's' + count1++;
		}
		var dummy = {};
		if (mols && mols.length > 0) {
			dummy.m = [];
			for ( var i = 0, ii = mols.length; i < ii; i++) {
				dummy.m.push(this.molTo(mols[i]));
			}
		}
		if (shapes && shapes.length > 0) {
			dummy.s = [];
			for ( var i = 0, ii = shapes.length; i < ii; i++) {
				dummy.s.push(this.shapeTo(shapes[i]));
			}
		}
		for ( var i = 0, ii = mols.length; i < ii; i++) {
			var mol = mols[i];
			for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
				mol.atoms[j].tmpid = undefined;
			}
			for ( var j = 0, jj = mol.bonds.length; j < jj; j++) {
				mol.bonds[j].tmpid = undefined;
			}
		}
		for ( var i = 0, ii = shapes.length; i < ii; i++) {
			shapes[i].tmpid = undefined;
		}
		return dummy;
	};
	_.contentFrom = function(dummy) {
		var obj = {
			molecules : [],
			shapes : []
		};
		if (dummy.m) {
			for ( var i = 0, ii = dummy.m.length; i < ii; i++) {
				obj.molecules.push(this.molFrom(dummy.m[i]));
			}
		}
		if (dummy.s) {
			for ( var i = 0, ii = dummy.s.length; i < ii; i++) {
				obj.shapes.push(this.shapeFrom(dummy.s[i], obj.molecules));
			}
		}
		for ( var i = 0, ii = obj.molecules.length; i < ii; i++) {
			var mol = obj.molecules[i];
			for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
				mol.atoms[j].tmpid = undefined;
			}
			for ( var j = 0, jj = mol.bonds.length; j < jj; j++) {
				mol.bonds[j].tmpid = undefined;
			}
		}
		for ( var i = 0, ii = obj.shapes.length; i < ii; i++) {
			obj.shapes[i].tmpid = undefined;
		}
		return obj;
	};
	_.molTo = function(mol) {
		var dummy = {
			a : []
		};
		for ( var i = 0, ii = mol.atoms.length; i < ii; i++) {
			var a = mol.atoms[i];
			var da = {
				x : a.x,
				y : a.y
			};
			if (a.tmpid) {
				da.i = a.tmpid;
			}
			if (a.label !== 'C') {
				da.l = a.label;
			}
			if (a.z !== 0) {
				da.z = a.z;
			}
			if (a.charge !== 0) {
				da.c = a.charge;
			}
			if (a.mass !== -1) {
				da.m = a.mass;
			}
			if (a.numRadical !== 0) {
				da.r = a.numRadical;
			}
			if (a.numLonePair !== 0) {
				da.p = a.numLonePair;
			}
			if (a.any) {
				da.q = true;
			}
			if (a.rgroup !== -1) {
				da.rg = a.rgroup;
			}
			dummy.a.push(da);
		}
		if (mol.bonds.length > 0) {
			dummy.b = [];
			for ( var i = 0, ii = mol.bonds.length; i < ii; i++) {
				var b = mol.bonds[i];
				var db = {
					b : mol.atoms.indexOf(b.a1),
					e : mol.atoms.indexOf(b.a2)
				};
				if (b.tmpid) {
					db.i = b.tmpid;
				}
				if (b.bondOrder !== 1) {
					db.o = b.bondOrder;
				}
				if (b.stereo !== structures.Bond.STEREO_NONE) {
					db.s = b.stereo;
				}
				dummy.b.push(db);
			}
		}
		return dummy;
	};
	_.molFrom = function(json) {
		var molecule = new structures.Molecule();
		for ( var i = 0, ii = json.a.length; i < ii; i++) {
			var c = json.a[i];
			var a = new structures.Atom(c.l ? c.l : 'C', c.x, c.y);
			if (c.i) {
				a.tmpid = c.i;
			}
			if (c.z) {
				a.z = c.z;
			}
			if (c.c) {
				a.charge = c.c;
			}
			if (c.m) {
				a.mass = c.m;
			}
			if (c.r) {
				a.numRadical = c.r;
			}
			if (c.p) {
				a.numLonePair = c.p;
			}
			if (c.q) {
				a.any = true;
			}
			if (c.rg) {
				a.rgroup = c.rg;
			}
			// these are booleans or numbers, so check if undefined
			if (c.p_h !== undefined) {
				a.hetatm = c.p_h;
			}
			if (c.p_w !== undefined) {
				a.isWater = c.p_w;
			}
			if (c.p_d !== undefined) {
				a.closestDistance = c.p_d;
			}
			molecule.atoms.push(a);
		}
		if (json.b) {
			for ( var i = 0, ii = json.b.length; i < ii; i++) {
				var c = json.b[i];
				// order can be 0, so check against undefined
				var b = new structures.Bond(molecule.atoms[c.b], molecule.atoms[c.e], c.o === undefined ? 1 : c.o);
				if (c.i) {
					b.tmpid = c.i;
				}
				if (c.s) {
					b.stereo = c.s;
				}
				molecule.bonds.push(b);
			}
		}
		return molecule;
	};
	_.shapeTo = function(shape) {
		var dummy = {};
		if (shape.tmpid) {
			dummy.i = shape.tmpid;
		}
		if (shape instanceof d2.Line) {
			dummy.t = 'Line';
			dummy.x1 = shape.p1.x;
			dummy.y1 = shape.p1.y;
			dummy.x2 = shape.p2.x;
			dummy.y2 = shape.p2.y;
			dummy.a = shape.arrowType;
		} else if (shape instanceof d2.Pusher) {
			dummy.t = 'Pusher';
			dummy.o1 = shape.o1.tmpid;
			dummy.o2 = shape.o2.tmpid;
			if (shape.numElectron !== 1) {
				dummy.e = shape.numElectron;
			}
		} else if (shape instanceof d2.Bracket) {
			dummy.t = 'Bracket';
			dummy.x1 = shape.p1.x;
			dummy.y1 = shape.p1.y;
			dummy.x2 = shape.p2.x;
			dummy.y2 = shape.p2.y;
			if (shape.charge !== 0) {
				dummy.c = shape.charge;
			}
			if (shape.mult !== 0) {
				dummy.m = shape.mult;
			}
			if (shape.repeat !== 0) {
				dummy.r = shape.repeat;
			}
		}
		return dummy;
	};
	_.shapeFrom = function(dummy, mols) {
		var shape;
		if (dummy.t === 'Line') {
			shape = new d2.Line(new structures.Point(dummy.x1, dummy.y1), new structures.Point(dummy.x2, dummy.y2));
			shape.arrowType = dummy.a;
		} else if (dummy.t === 'Pusher') {
			var o1;
			var o2;
			for ( var i = 0, ii = mols.length; i < ii; i++) {
				var mol = mols[i];
				for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
					var a = mol.atoms[j];
					if (a.tmpid === dummy.o1) {
						o1 = a;
					} else if (a.tmpid === dummy.o2) {
						o2 = a;
					}
				}
				for ( var j = 0, jj = mol.bonds.length; j < jj; j++) {
					var b = mol.bonds[j];
					if (b.tmpid === dummy.o1) {
						o1 = b;
					} else if (b.tmpid === dummy.o2) {
						o2 = b;
					}
				}
			}
			shape = new d2.Pusher(o1, o2);
			if (dummy.e) {
				shape.numElectron = dummy.e;
			}
		} else if (dummy.t === 'Bracket') {
			shape = new d2.Bracket(new structures.Point(dummy.x1, dummy.y1), new structures.Point(dummy.x2, dummy.y2));
			if (dummy.c !== undefined) {
				// have to check against undefined as it is an integer that can
				// be 0
				shape.charge = dummy.c;
			}
			if (dummy.m !== undefined) {
				// have to check against undefined as it is an integer that can
				// be 0
				shape.mult = dummy.m;
			}
			if (dummy.r !== undefined) {
				// have to check against undefined as it is an integer that can
				// be 0
				shape.repeat = dummy.r;
			}
		}
		return shape;
	};
	_.pdbFrom = function(content) {
		var mol = this.molFrom(content.mol);
		mol.findRings = false;
		// mark from JSON to note to algorithms that atoms in chain are not
		// same
		// objects as in atom array
		mol.fromJSON = true;
		mol.chains = this.chainsFrom(content.ribbons);
		return mol;
	};
	_.chainsFrom = function(content) {
		var chains = [];
		for ( var i = 0, ii = content.cs.length; i < ii; i++) {
			var chain = content.cs[i];
			var c = [];
			for ( var j = 0, jj = chain.length; j < jj; j++) {
				var convert = chain[j];
				var r = new structures.Residue();
				r.name = convert.n;
				r.cp1 = new structures.Atom('', convert.x1, convert.y1, convert.z1);
				r.cp2 = new structures.Atom('', convert.x2, convert.y2, convert.z2);
				if (convert.x3) {
					r.cp3 = new structures.Atom('', convert.x3, convert.y3, convert.z3);
					r.cp4 = new structures.Atom('', convert.x4, convert.y4, convert.z4);
					r.cp5 = new structures.Atom('', convert.x5, convert.y5, convert.z5);
				}
				r.helix = convert.h;
				r.sheet = convert.s;
				r.arrow = convert.a;
				c.push(r);
			}
			chains.push(c);
		}
		return chains;
	};

	// shortcuts
	var interpreter = new io.JSONInterpreter();
	c.readJSON = function(string) {
		var obj;
		try {
			obj = JSON.parse(string);
		} catch (e) {
			// not json
			return undefined;
		}
		if (obj) {
			if (obj.m || obj.s) {
				return interpreter.contentFrom(obj);
			} else if (obj.a) {
				return obj = {
					molecules : [ interpreter.molFrom(obj) ],
					shapes : []
				};
			} else {
				return obj = {
					molecules : [],
					shapes : []
				};
			}
		}
		return undefined;
	};
	c.writeJSON = function(mols, shapes) {
		return JSON.stringify(interpreter.contentTo(mols, shapes));
	};

})(ChemDoodle, ChemDoodle.io, ChemDoodle.structures, ChemDoodle.structures.d2, JSON);
(function(c, io, structures) {
	'use strict';
	io.RXNInterpreter = function() {
	};
	var _ = io.RXNInterpreter.prototype = new io._Interpreter();
	_.read = function(content, multiplier) {
		if (!multiplier) {
			multiplier = c.default_bondLength_2D;
		}
		var molecules = [];
		var line;
		if (!content) {
			molecules.push(new structures.Molecule());
			line = new structures.d2.Line(new structures.Point(-20, 0), new structures.Point(20, 0));
		} else {
			var contentTokens = content.split('$MOL\n');
			var headerTokens = contentTokens[0].split('\n');
			var counts = headerTokens[4];
			var numReactants = parseInt(counts.substring(0, 3));
			var numProducts = parseInt(counts.substring(3, 6));
			var currentMolecule = 1;
			var start = 0;
			for ( var i = 0, ii = numReactants + numProducts; i < ii; i++) {
				molecules[i] = c.readMOL(contentTokens[currentMolecule], multiplier);
				var b = molecules[i].getBounds();
				var width = b.maxX - b.minX;
				start -= width + 40;
				currentMolecule++;
			}
			for ( var i = 0, ii = numReactants; i < ii; i++) {
				var b = molecules[i].getBounds();
				var width = b.maxX - b.minX;
				var center = molecules[i].getCenter();
				for ( var j = 0, jj = molecules[i].atoms.length; j < jj; j++) {
					var a = molecules[i].atoms[j];
					a.x += start + (width / 2) - center.x;
					a.y -= center.y;
				}
				start += width + 40;
			}
			line = new structures.d2.Line(new structures.Point(start, 0), new structures.Point(start + 40, 0));
			start += 80;
			for ( var i = numReactants, ii = numReactants + numProducts; i < ii; i++) {
				var b = molecules[i].getBounds();
				var width = b.maxX - b.minX;
				var center = molecules[i].getCenter();
				for ( var j = 0; j < molecules[i].atoms.length; j++) {
					var a = molecules[i].atoms[j];
					a.x += start + (width / 2) - center.x;
					a.y -= center.y;
				}
				start += width + 40;
			}
		}
		line.arrowType = structures.d2.Line.ARROW_SYNTHETIC;
		return {
			'molecules' : molecules,
			'shapes' : [ line ]
		};
	};
	_.write = function(mols, shapes) {
		var molecules = [ [], [] ];
		var ps = undefined;
		if (!mols || !shapes) {
			return;
		}
		for (i = 0, ii = shapes.length; i < ii; i++) {
			if (shapes[i] instanceof structures.d2.Line) {
				ps = shapes[i].getPoints();
				break;
			}
		}
		if (!ps) {
			return '';
		}
		for ( var i = 0, ii = mols.length; i < ii; i++) {
			var center = mols[i].getCenter();
			if (center.x < ps[1].x) {
				molecules[0].push(mols[i]);
			} else {
				molecules[1].push(mols[i]);
			}
		}
		var sb = [];
		sb.push('$RXN\nReaction from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n');
		sb.push(this.fit(molecules[0].length.toString(), 3));
		sb.push(this.fit(molecules[1].length.toString(), 3));
		sb.push('\n');
		for ( var i = 0; i < 2; i++) {
			for ( var j = 0, jj = molecules[i].length; j < jj; j++) {
				sb.push('$MOL\n');
				sb.push(c.writeMOL(molecules[i][j]));
				sb.push('\n');
			}
		}
		return sb.join('');
	};

	// shortcuts
	var interpreter = new io.RXNInterpreter();
	c.readRXN = function(content, multiplier) {
		return interpreter.read(content, multiplier);
	};
	c.writeRXN = function(mols, shapes) {
		return interpreter.write(mols, shapes);
	};

})(ChemDoodle, ChemDoodle.io, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3450 $
//  $Author: kevin $
//  $LastChangedDate: 2011-12-01 19:48:46 -0500 (Thu, 01 Dec 2011) $
//

(function(c, ELEMENT, SYMBOLS, io, structures, trim) {
	'use strict';
	io.XYZInterpreter = function() {
	};
	var _ = io.XYZInterpreter.prototype = new io._Interpreter();
	_.deduceCovalentBonds = true;
	_.read = function(content) {
		var molecule = new structures.Molecule();
		if (!content) {
			return molecule;
		}
		var lines = content.split('\n');

		var numAtoms = parseInt(trim(lines[0]));

		for ( var i = 0; i < numAtoms; i++) {
			var line = lines[i + 2];
			var tokens = line.split(/\s+/g);
			molecule.atoms[i] = new structures.Atom(isNaN(tokens[0]) ? tokens[0] : SYMBOLS[parseInt(tokens[0]) - 1], parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
		}
		if (this.deduceCovalentBonds) {
			new c.informatics.BondDeducer().deduceCovalentBonds(molecule, 1);
		}
		return molecule;
	};

	// shortcuts
	var interpreter = new io.XYZInterpreter();
	c.readXYZ = function(content) {
		return interpreter.read(content);
	};

})(ChemDoodle, ChemDoodle.ELEMENT, ChemDoodle.SYMBOLS, ChemDoodle.io, ChemDoodle.structures, jQuery.trim);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2974 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-29 11:07:06 -0500 (Wed, 29 Dec 2010) $
//

ChemDoodle.monitor = (function(featureDetection, q, document) {
	'use strict';
	var m = {};

	m.CANVAS_DRAGGING = undefined;
	m.CANVAS_OVER = undefined;
	m.ALT = false;
	m.SHIFT = false;
	m.META = false;

	if (!featureDetection.supports_touch()) {
		q(document).ready(function() {
			// handles dragging beyond the canvas bounds
			q(document).mousemove(function(e) {
				if (m.CANVAS_DRAGGING) {
					if (m.CANVAS_DRAGGING.drag) {
						m.CANVAS_DRAGGING.prehandleEvent(e);
						m.CANVAS_DRAGGING.drag(e);
					}
				}
			});
			q(document).mouseup(function(e) {
				if (m.CANVAS_DRAGGING && m.CANVAS_DRAGGING !== m.CANVAS_OVER) {
					if (m.CANVAS_DRAGGING.mouseup) {
						m.CANVAS_DRAGGING.prehandleEvent(e);
						m.CANVAS_DRAGGING.mouseup(e);
					}
				}
				m.CANVAS_DRAGGING = undefined;
			});
			// handles modifier keys from a single keyboard
			q(document).keydown(function(e) {
				m.SHIFT = e.shiftKey;
				m.ALT = e.altKey;
				m.META = e.metaKey || e.ctrlKey;
				var affecting = m.CANVAS_OVER;
				if (m.CANVAS_DRAGGING) {
					affecting = m.CANVAS_DRAGGING;
				}
				if (affecting) {
					if (affecting.keydown) {
						affecting.prehandleEvent(e);
						affecting.keydown(e);
					}
				}
			});
			q(document).keypress(function(e) {
				var affecting = m.CANVAS_OVER;
				if (m.CANVAS_DRAGGING) {
					affecting = m.CANVAS_DRAGGING;
				}
				if (affecting) {
					if (affecting.keypress) {
						affecting.prehandleEvent(e);
						affecting.keypress(e);
					}
				}
			});
			q(document).keyup(function(e) {
				m.SHIFT = e.shiftKey;
				m.ALT = e.altKey;
				m.META = e.metaKey || e.ctrlKey;
				var affecting = m.CANVAS_OVER;
				if (m.CANVAS_DRAGGING) {
					affecting = m.CANVAS_DRAGGING;
				}
				if (affecting) {
					if (affecting.keyup) {
						affecting.prehandleEvent(e);
						affecting.keyup(e);
					}
				}
			});
		});
	}

	return m;

})(ChemDoodle.featureDetection, jQuery, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4208 $
//  $Author: kevin $
//  $LastChangedDate: 2013-03-24 10:31:41 -0400 (Sun, 24 Mar 2013) $
//
(function(c, featureDetection, math, monitor, structures, q, browser, m, document, window) {
	'use strict';
	c._Canvas = function() {
	};
	var _ = c._Canvas.prototype;
	_.molecules = undefined;
	_.shapes = undefined;
	_.emptyMessage = undefined;
	_.image = undefined;
	_.repaint = function() {
		if (this.test) {
			return;
		}
		var canvas = document.getElementById(this.id);
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');
			if (this.pixelRatio !== 1 && canvas.width === this.width) {
				canvas.width = this.width * this.pixelRatio;
				canvas.height = this.height * this.pixelRatio;
				ctx.scale(this.pixelRatio, this.pixelRatio);
			}
			if (!this.image) {
				if (this.specs.backgroundColor && this.bgCache !== canvas.style.backgroundColor) {
					canvas.style.backgroundColor = this.specs.backgroundColor;
					this.bgCache = canvas.style.backgroundColor;
				}
				// clearRect is correct, but doesn't work as expected on Android
				// ctx.clearRect(0, 0, this.width, this.height);
				ctx.fillStyle = this.specs.backgroundColor;
				ctx.fillRect(0, 0, this.width, this.height);
			} else {
				ctx.drawImage(this.image, 0, 0);
			}
			if (this.innerRepaint) {
				this.innerRepaint(ctx);
			} else {
				if (this.molecules.length !== 0 || this.shapes.length !== 0) {
					ctx.save();
					ctx.translate(this.width / 2, this.height / 2);
					ctx.rotate(this.specs.rotateAngle);
					ctx.scale(this.specs.scale, this.specs.scale);
					ctx.translate(-this.width / 2, -this.height / 2);
					for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
						this.molecules[i].check(true);
						this.molecules[i].draw(ctx, this.specs);
					}
					for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
						this.shapes[i].draw(ctx, this.specs);
					}
					ctx.restore();
				} else if (this.emptyMessage) {
					ctx.fillStyle = '#737683';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.font = '18px Helvetica, Verdana, Arial, Sans-serif';
					ctx.fillText(this.emptyMessage, this.width / 2, this.height / 2);
				}
			}
			if (this.drawChildExtras) {
				this.drawChildExtras(ctx);
			}
		}
	};
	_.resize = function(w, h) {
		var cap = q('#' + this.id);
		cap.attr({
			width : w,
			height : h
		});
		cap.css('width', w);
		cap.css('height', h);
		this.width = w;
		this.height = h;
		if (c._Canvas3D && this instanceof c._Canvas3D) {
			this.gl.viewport(0, 0, w, h);
			this.setupScene();
		} else if (this.molecules.length > 0) {
			this.center();
			for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
				this.molecules[i].check();
			}
		}
		this.repaint();
	};
	_.setBackgroundImage = function(path) {
		this.image = new Image(); // Create new Image object
		var me = this;
		this.image.onload = function() {
			me.repaint();
		};
		this.image.src = path; // Set source path
	};
	_.loadMolecule = function(molecule) {
		this.clear();
		this.molecules.push(molecule);
		this.center();
		if (!(c._Canvas3D && this instanceof c._Canvas3D)) {
			molecule.check();
		}
		if (this.afterLoadContent) {
			this.afterLoadContent();
		}
		this.repaint();
	};
	_.loadContent = function(mols, shapes) {
		this.molecules = mols?mols:[];
		this.shapes = shapes?shapes:[];
		this.center();
		if (!(c._Canvas3D && this instanceof c._Canvas3D)) {
			for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
				this.molecules[i].check();
			}
		}
		if (this.afterLoadContent) {
			this.afterLoadContent();
		}
		this.repaint();
	};
	_.addMolecule = function(molecule) {
		this.molecules.push(molecule);
		if (!(c._Canvas3D && this instanceof c._Canvas3D)) {
			molecule.check();
		}
		this.repaint();
	};
	_.removeMolecule = function(mol) {
		this.molecules = q.grep(this.molecules, function(value) {
			return value !== mol;
		});
		this.repaint();
	};
	_.getMolecule = function() {
		return this.molecules.length > 0 ? this.molecules[0] : undefined;
	};
	_.getMolecules = function() {
		return this.molecules;
	};
	_.addShape = function(shape) {
		this.shapes.push(shape);
		this.repaint();
	};
	_.removeShape = function(shape) {
		this.shapes = q.grep(this.shapes, function(value) {
			return value !== shape;
		});
		this.repaint();
	};
	_.getShapes = function() {
		return this.shapes;
	};
	_.clear = function() {
		this.molecules = [];
		this.shapes = [];
		this.specs.scale = 1;
		this.repaint();
	};
	_.center = function() {
		var bounds = this.getContentBounds();
		var center = new structures.Point((this.width - bounds.minX - bounds.maxX) / 2, (this.height - bounds.minY - bounds.maxY) / 2);
		for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
			var mol = this.molecules[i];
			for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
				mol.atoms[j].add(center);
			}
		}
		for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
			var sps = this.shapes[i].getPoints();
			for ( var j = 0, jj = sps.length; j < jj; j++) {
				sps[j].add(center);
			}
		}
		this.specs.scale = 1;
		var difX = bounds.maxX - bounds.minX;
		var difY = bounds.maxY - bounds.minY;
		if (difX > this.width || difY > this.height) {
			this.specs.scale = m.min(this.width / difX, this.height / difY) * .85;
		}
	};
	_.bondExists = function(a1, a2) {
		for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
			var mol = this.molecules[i];
			for ( var j = 0, jj = mol.bonds.length; j < jj; j++) {
				var b = mol.bonds[j];
				if (b.contains(a1) && b.contains(a2)) {
					return true;
				}
			}
		}
		return false;
	};
	_.getBond = function(a1, a2) {
		for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
			var mol = this.molecules[i];
			for ( var j = 0, jj = mol.bonds.length; j < jj; j++) {
				var b = mol.bonds[j];
				if (b.contains(a1) && b.contains(a2)) {
					return b;
				}
			}
		}
		return undefined;
	};
	_.getMoleculeByAtom = function(a) {
		for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
			var mol = this.molecules[i];
			if (mol.atoms.indexOf(a) !== -1) {
				return mol;
			}
		}
		return undefined;
	};
	_.getAllAtoms = function() {
		var as = [];
		for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
			as = as.concat(this.molecules[i].atoms);
		}
		return as;
	};
	_.getAllPoints = function() {
		var ps = [];
		for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
			ps = ps.concat(this.molecules[i].atoms);
		}
		for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
			ps = ps.concat(this.shapes[i].getPoints());
		}
		return ps;
	};
	_.getContentBounds = function() {
		var bounds = new math.Bounds();
		for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
			bounds.expand(this.molecules[i].getBounds());
		}
		for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
			bounds.expand(this.shapes[i].getBounds());
		}
		return bounds;
	};
	_.create = function(id, width, height) {
		this.id = id;
		this.width = width;
		this.height = height;
		this.molecules = [];
		this.shapes = [];
		if (document.getElementById(id)) {
			var canvas = q('#' + id);
			if (!width) {
				this.width = canvas.attr('width');
			} else {
				canvas.attr('width', width);
			}
			if (!height) {
				this.height = canvas.attr('height');
			} else {
				canvas.attr('height', height);
			}
			// If the canvas is pre-created, make sure that the class attribute
			// is specified.
			canvas.attr('class', 'ChemDoodleWebComponent');
		} else if (!c.featureDetection.supports_canvas_text() && browser.msie && browser.version >= '6') {
			// Install Google Chrome Frame
			document.writeln('<div style="border: 1px solid black;" width="' + width + '" height="' + height + '">Please install <a href="http://code.google.com/chrome/chromeframe/">Google Chrome Frame</a>, then restart Internet Explorer.</div>');
			return;
		} else {
			document.writeln('<canvas class="ChemDoodleWebComponent" id="' + id + '" width="' + width + '" height="' + height + '" alt="ChemDoodle Web Component">This browser does not support HTML5/Canvas.</canvas>');
		}
		var jqCapsule = q('#' + id);
		jqCapsule.css('width', this.width);
		jqCapsule.css('height', this.height);
		this.pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
		this.specs = new structures.VisualSpecifications();
		// setup input events
		// make sure prehandle events are only in if statements if handled, so
		// as not to block browser events
		var me = this;
		if (featureDetection.supports_touch()) {
			// for iPhone OS and Android devices (and other mobile browsers that
			// support mobile events)
			jqCapsule.bind('touchstart', function(e) {
				var time = new Date().getTime();
				if (!featureDetection.supports_gesture() && e.originalEvent.touches.length === 2) {
					// on some platforms, like Android, there is no gesture
					// support, so we have to implement it
					var ts = e.originalEvent.touches;
					var p1 = new structures.Point(ts[0].pageX, ts[0].pageY);
					var p2 = new structures.Point(ts[1].pageX, ts[1].pageY);
					me.implementedGestureDist = p1.distance(p2);
					me.implementedGestureAngle = p1.angle(p2);
					if (me.gesturestart) {
						me.prehandleEvent(e);
						me.gesturestart(e);
					}
				}
				if (me.lastTouch && e.originalEvent.touches.length === 1 && (time - me.lastTouch) < 500) {
					if (me.dbltap) {
						me.prehandleEvent(e);
						me.dbltap(e);
					} else if (me.dblclick) {
						me.prehandleEvent(e);
						me.dblclick(e);
					} else if (me.touchstart) {
						me.prehandleEvent(e);
						me.touchstart(e);
					} else if (me.mousedown) {
						me.prehandleEvent(e);
						me.mousedown(e);
					}
				} else if (me.touchstart) {
					me.prehandleEvent(e);
					me.touchstart(e);
					if (this.hold) {
						clearTimeout(this.hold);
					}
					if (this.touchhold) {
						this.hold = setTimeout(function() {
							me.touchhold(e);
						}, 1000);
					}
				} else if (me.mousedown) {
					me.prehandleEvent(e);
					me.mousedown(e);
				}
				me.lastTouch = time;
			});
			jqCapsule.bind('touchmove', function(e) {
				if (this.hold) {
					clearTimeout(this.hold);
					this.hold = undefined;
				}
				if (!featureDetection.supports_gesture() && e.originalEvent.touches.length === 2) {
					// on some platforms, like Android, there is no gesture
					// support, so we have to implement it
					if (me.gesturechange) {
						var ts = e.originalEvent.touches;
						var p1 = new structures.Point(ts[0].pageX, ts[0].pageY);
						var p2 = new structures.Point(ts[1].pageX, ts[1].pageY);
						var newDist = p1.distance(p2);
						var newAngle = p1.angle(p2);
						e.originalEvent.scale = newDist / me.implementedGestureDist;
						e.originalEvent.rotation = 180 * (me.implementedGestureAngle - newAngle) / m.PI;
						me.prehandleEvent(e);
						me.gesturechange(e);
					}
				}
				if (e.originalEvent.touches.length > 1 && me.multitouchmove) {
					var numFingers = e.originalEvent.touches.length;
					me.prehandleEvent(e);
					var center = new structures.Point(-e.offset.left * numFingers, -e.offset.top * numFingers);
					for ( var i = 0; i < numFingers; i++) {
						center.x += e.originalEvent.changedTouches[i].pageX;
						center.y += e.originalEvent.changedTouches[i].pageY;
					}
					center.x /= numFingers;
					center.y /= numFingers;
					e.p = center;
					me.multitouchmove(e, numFingers);
				} else if (me.touchmove) {
					me.prehandleEvent(e);
					me.touchmove(e);
				} else if (me.drag) {
					me.prehandleEvent(e);
					me.drag(e);
				}
			});
			jqCapsule.bind('touchend', function(e) {
				if (this.hold) {
					clearTimeout(this.hold);
					this.hold = undefined;
				}
				if (!featureDetection.supports_gesture() && me.implementedGestureDist) {
					// on some platforms, like Android, there is no gesture
					// support, so we have to implement it
					me.implementedGestureDist = undefined;
					me.implementedGestureAngle = undefined;
					if (me.gestureend) {
						me.prehandleEvent(e);
						me.gestureend(e);
					}
				}
				if (me.touchend) {
					me.prehandleEvent(e);
					me.touchend(e);
				} else if (me.mouseup) {
					me.prehandleEvent(e);
					me.mouseup(e);
				}
				if ((new Date().getTime() - me.lastTouch) < 250) {
					if (me.tap) {
						me.prehandleEvent(e);
						me.tap(e);
					} else if (me.click) {
						me.prehandleEvent(e);
						me.click(e);
					}
				}
			});
			jqCapsule.bind('gesturestart', function(e) {
				if (me.gesturestart) {
					me.prehandleEvent(e);
					me.gesturestart(e);
				}
			});
			jqCapsule.bind('gesturechange', function(e) {
				if (me.gesturechange) {
					me.prehandleEvent(e);
					me.gesturechange(e);
				}
			});
			jqCapsule.bind('gestureend', function(e) {
				if (me.gestureend) {
					me.prehandleEvent(e);
					me.gestureend(e);
				}
			});
		} else {
			// normal events
			// some mobile browsers will simulate mouse events, so do not set
			// these
			// events if mobile, or it will interfere with the handling of touch
			// events
			jqCapsule.click(function(e) {
				switch (e.which) {
				case 1:
					// left mouse button pressed
					if (me.click) {
						me.prehandleEvent(e);
						me.click(e);
					}
					break;
				case 2:
					// middle mouse button pressed
					if (me.middleclick) {
						me.prehandleEvent(e);
						me.middleclick(e);
					}
					break;
				case 3:
					// right mouse button pressed
					if (me.rightclick) {
						me.prehandleEvent(e);
						me.rightclick(e);
					}
					break;
				}
			});
			jqCapsule.dblclick(function(e) {
				if (me.dblclick) {
					me.prehandleEvent(e);
					me.dblclick(e);
				}
			});
			jqCapsule.mousedown(function(e) {
				switch (e.which) {
				case 1:
					// left mouse button pressed
					monitor.CANVAS_DRAGGING = me;
					if (me.mousedown) {
						me.prehandleEvent(e);
						me.mousedown(e);
					}
					break;
				case 2:
					// middle mouse button pressed
					if (me.middlemousedown) {
						me.prehandleEvent(e);
						me.middlemousedown(e);
					}
					break;
				case 3:
					// right mouse button pressed
					if (me.rightmousedown) {
						me.prehandleEvent(e);
						me.rightmousedown(e);
					}
					break;
				}
			});
			jqCapsule.mousemove(function(e) {
				if (!monitor.CANVAS_DRAGGING && me.mousemove) {
					me.prehandleEvent(e);
					me.mousemove(e);
				}
			});
			jqCapsule.mouseout(function(e) {
				monitor.CANVAS_OVER = undefined;
				if (me.mouseout) {
					me.prehandleEvent(e);
					me.mouseout(e);
				}
			});
			jqCapsule.mouseover(function(e) {
				monitor.CANVAS_OVER = me;
				if (me.mouseover) {
					me.prehandleEvent(e);
					me.mouseover(e);
				}
			});
			jqCapsule.mouseup(function(e) {
				switch (e.which) {
				case 1:
					// left mouse button pressed
					if (me.mouseup) {
						me.prehandleEvent(e);
						me.mouseup(e);
					}
					break;
				case 2:
					// middle mouse button pressed
					if (me.middlemouseup) {
						me.prehandleEvent(e);
						me.middlemouseup(e);
					}
					break;
				case 3:
					// right mouse button pressed
					if (me.rightmouseup) {
						me.prehandleEvent(e);
						me.rightmouseup(e);
					}
					break;
				}
			});
			jqCapsule.mousewheel(function(e, delta) {
				if (me.mousewheel) {
					me.prehandleEvent(e);
					me.mousewheel(e, delta);
				}
			});
		}
		if (this.subCreate) {
			this.subCreate();
		}
	};
	_.prehandleEvent = function(e) {
		if (e.originalEvent.changedTouches) {
			e.pageX = e.originalEvent.changedTouches[0].pageX;
			e.pageY = e.originalEvent.changedTouches[0].pageY;
		}
		e.preventDefault();
		e.offset = q('#' + this.id).offset();
		e.p = new structures.Point(e.pageX - e.offset.left, e.pageY - e.offset.top);
	};
})(ChemDoodle, ChemDoodle.featureDetection, ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.structures, jQuery, jQuery.browser, Math, document, window);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c) {
	'use strict';
	c._AnimatorCanvas = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
	};
	var _ = c._AnimatorCanvas.prototype = new c._Canvas();
	_.timeout = 33;
	_.startAnimation = function() {
		this.stopAnimation();
		this.lastTime = new Date().getTime();
		var me = this;
		if (this.nextFrame) {
			this.handle = setInterval(function() {
				// advance clock
				var timeNow = new Date().getTime();
				// update and repaint
				me.nextFrame(timeNow - me.lastTime);
				me.repaint();
				me.lastTime = timeNow;
			}, this.timeout);
		}
	};
	_.stopAnimation = function() {
		if (this.handle) {
			clearInterval(this.handle);
			this.handle = undefined;
		}
	};
	_.isRunning = function() {
		// must compare to undefined here to return a boolean
		return this.handle !== undefined;
	};

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, document) {
	'use strict';
	c.FileCanvas = function(id, width, height, action) {
		if (id) {
			this.create(id, width, height);
		}
		var form = '<br><form name="FileForm" enctype="multipart/form-data" method="POST" action="' + action + '" target="HiddenFileFrame"><input type="file" name="f" /><input type="submit" name="submitbutton" value="Show File" /></form><iframe id="HFF-' + id + '" name="HiddenFileFrame" height="0" width="0" style="display:none;" onLoad="GetMolFromFrame(\'HFF-' + id + '\', ' + id + ')"></iframe>';
		document.writeln(form);
		this.emptyMessage = 'Click below to load file';
		this.repaint();
	};
	c.FileCanvas.prototype = new c._Canvas();

})(ChemDoodle, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c) {
	'use strict';
	c.HyperlinkCanvas = function(id, width, height, urlOrFunction, color, size) {
		if (id) {
			this.create(id, width, height);
		}
		this.urlOrFunction = urlOrFunction;
		this.color = color ? color : 'blue';
		this.size = size ? size : 2;
	};
	var _ = c.HyperlinkCanvas.prototype = new c._Canvas();
	_.openInNewWindow = true;
	_.hoverImage = undefined;
	_.drawChildExtras = function(ctx) {
		if (this.e) {
			if (this.hoverImage) {
				ctx.drawImage(this.hoverImage, 0, 0);
			} else {
				ctx.strokeStyle = this.color;
				ctx.lineWidth = this.size * 2;
				ctx.strokeRect(0, 0, this.width, this.height);
			}
		}
	};
	_.setHoverImage = function(url) {
		this.hoverImage = new Image();
		this.hoverImage.src = url;
	};
	_.click = function(p) {
		this.e = undefined;
		this.repaint();
		if (this.urlOrFunction instanceof Function) {
			this.urlOrFunction();
		} else {
			if (this.openInNewWindow) {
				window.open(this.urlOrFunction);
			} else {
				location.href = this.urlOrFunction;
			}
		}
	};
	_.mouseout = function(e) {
		this.e = undefined;
		this.repaint();
	};
	_.mouseover = function(e) {
		this.e = e;
		this.repaint();
	};

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, iChemLabs, q, document) {
	'use strict';
	c.MolGrabberCanvas = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
		var sb = [];
		sb.push('<br><input type="text" id="');
		sb.push(id);
		sb.push('_query" size="32" value="" />');
		sb.push('<br><nobr>');
		sb.push('<select id="');
		sb.push(id);
		sb.push('_select">');
		sb.push('<option value="chemexper">ChemExper');
		sb.push('<option value="chemspider">ChemSpider');
		sb.push('<option value="pubchem" selected>PubChem');
		sb.push('</select>');
		sb.push('<button id="');
		sb.push(id);
		sb.push('_submit">Show Molecule</button>');
		sb.push('</nobr>');

		// Don't use document.writeln here, it breaks the whole page after
		// document is closed.
		document.getElementById(id);
		var canvas = q('#' + id);
		canvas.after(sb.join(''));

		var self = this;
		q('#' + id + '_submit').click(function() {
			self.search();
		});
		q('#' + id + '_query').keypress(function(e) {
			if (e.which === 13) {
				self.search();
			}
		});
		this.emptyMessage = 'Enter search term below';
		this.repaint();
	};
	var _ = c.MolGrabberCanvas.prototype = new c._Canvas();
	_.setSearchTerm = function(term) {
		q('#' + this.id + '_query').val(term);
		this.search();
	};
	_.search = function() {
		this.emptyMessage = 'Searching...';
		this.clear();
		var self = this;
		iChemLabs.getMoleculeFromDatabase(q('#' + this.id + '_query').val(), {
			database : q('#' + this.id + '_select').val()
		}, function(mol) {
			self.loadMolecule(mol);
		});
	};

})(ChemDoodle, ChemDoodle.iChemLabs, jQuery, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, m, m4) {
	'use strict';
	// keep these declaration outside the loop to avoid overhead
	var matrix = [];
	var xAxis = [ 1, 0, 0 ];
	var yAxis = [ 0, 1, 0 ];
	var zAxis = [ 0, 0, 1 ];

	c.RotatorCanvas = function(id, width, height, rotate3D) {
		if (id) {
			this.create(id, width, height);
		}
		this.rotate3D = rotate3D;
	};
	var _ = c.RotatorCanvas.prototype = new c._AnimatorCanvas();
	var increment = m.PI / 15;
	_.xIncrement = increment;
	_.yIncrement = increment;
	_.zIncrement = increment;
	_.nextFrame = function(delta) {
		if (this.molecules.length === 0 && this.shapes.length === 0) {
			this.stopAnimation();
			return;
		}
		var change = delta / 1000;
		if (this.rotate3D) {
			m4.identity(matrix);
			m4.rotate(matrix, this.xIncrement * change, xAxis);
			m4.rotate(matrix, this.yIncrement * change, yAxis);
			m4.rotate(matrix, this.zIncrement * change, zAxis);
			for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
				var m = this.molecules[i];
				for ( var j = 0, jj = m.atoms.length; j < jj; j++) {
					var a = m.atoms[j];
					var p = [ a.x - this.width / 2, a.y - this.height / 2, a.z ];
					m4.multiplyVec3(matrix, p);
					a.x = p[0] + this.width / 2;
					a.y = p[1] + this.height / 2;
					a.z = p[2];
				}
				for ( var j = 0, jj = m.rings.length; j < jj; j++) {
					m.rings[j].center = m.rings[j].getCenter();
				}
				if (this.specs.atoms_display && this.specs.atoms_circles_2D) {
					m.sortAtomsByZ();
				}
				if (this.specs.bonds_display && this.specs.bonds_clearOverlaps_2D) {
					m.sortBondsByZ();
				}
			}
			for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
				var sps = this.shapes[i].getPoints();
				for ( var j = 0, jj = sps.length; j < jj; j++) {
					var a = sps[j];
					var p = [ a.x - this.width / 2, a.y - this.height / 2, 0 ];
					m4.multiplyVec3(matrix, p);
					a.x = p[0] + this.width / 2;
					a.y = p[1] + this.height / 2;
				}
			}
		} else {
			this.specs.rotateAngle += this.zIncrement * change;
		}
	};
	_.dblclick = function(e) {
		if (this.isRunning()) {
			this.stopAnimation();
		} else {
			this.startAnimation();
		}
	};

})(ChemDoodle, Math, mat4);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, math) {
	'use strict';
	c.SlideshowCanvas = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
	};
	var _ = c.SlideshowCanvas.prototype = new c._AnimatorCanvas();
	_.frames = [];
	_.curIndex = 0;
	_.timeout = 5000;
	_.alpha = 0;
	_.innerHandle = undefined;
	_.phase = 0;
	_.drawChildExtras = function(ctx) {
		var rgb = math.getRGB(this.specs.backgroundColor, 255);
		ctx.fillStyle = 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + this.alpha + ')';
		ctx.fillRect(0, 0, this.width, this.height);
	};
	_.nextFrame = function(delta) {
		if (this.frames.length === 0) {
			this.stopAnimation();
			return;
		}
		this.phase = 0;
		var me = this;
		var count = 1;
		this.innerHandle = setInterval(function() {
			me.alpha = count / 15;
			me.repaint();
			if (count === 15) {
				me.breakInnerHandle();
			}
			count++;
		}, 33);
	};
	_.breakInnerHandle = function() {
		if (this.innerHandle) {
			clearInterval(this.innerHandle);
			this.innerHandle = undefined;
		}
		if (this.phase === 0) {
			this.curIndex++;
			if (this.curIndex > this.frames.length - 1) {
				this.curIndex = 0;
			}
			this.alpha = 1;
			var f = this.frames[this.curIndex];
			this.loadContent(f.mols, f.shapes);
			this.phase = 1;
			var me = this;
			var count = 1;
			this.innerHandle = setInterval(function() {
				me.alpha = (15 - count) / 15;
				me.repaint();
				if (count === 15) {
					me.breakInnerHandle();
				}
				count++;
			}, 33);
		} else if (this.phase === 1) {
			this.alpha = 0;
			this.repaint();
		}
	};
	_.addFrame = function(molecules, shapes) {
		if (this.frames.length === 0) {
			this.loadContent(molecules, shapes);
		}
		this.frames.push({
			mols : molecules,
			shapes : shapes
		});
	};

})(ChemDoodle, ChemDoodle.math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4403 $
//  $Author: kevin $
//  $LastChangedDate: 2013-06-09 14:16:09 -0400 (Sun, 09 Jun 2013) $
//

(function(c, monitor, structures, m, m4) {
	'use strict';
	c.TransformCanvas = function(id, width, height, rotate3D) {
		if (id) {
			this.create(id, width, height);
		}
		this.rotate3D = rotate3D;
	};
	var _ = c.TransformCanvas.prototype = new c._Canvas();
	_.lastPoint = undefined;
	_.rotationMultMod = 1.3;
	_.lastPinchScale = 1;
	_.lastGestureRotate = 0;
	_.mousedown = function(e) {
		this.lastPoint = e.p;
	};
	_.dblclick = function(e) {
		// center structure
		this.center();
		this.repaint();
	};
	_.drag = function(e) {
		if (!this.lastPoint.multi) {
			if (monitor.ALT) {
				var t = new structures.Point(e.p.x, e.p.y);
				t.sub(this.lastPoint);
				for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
					var mol = this.molecules[i];
					for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
						mol.atoms[j].add(t);
					}
					mol.check();
				}
				for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
					var sps = this.shapes[i].getPoints();
					for ( var j = 0, jj = sps.length; j < jj; j++) {
						sps[j].add(t);
					}
				}
				this.lastPoint = e.p;
				this.repaint();
			} else {
				if (this.rotate3D === true) {
					var diameter = m.max(this.width / 4, this.height / 4);
					var difx = e.p.x - this.lastPoint.x;
					var dify = e.p.y - this.lastPoint.y;
					var yIncrement = difx / diameter * this.rotationMultMod;
					var xIncrement = -dify / diameter * this.rotationMultMod;
					var matrix = [];
					m4.identity(matrix);
					m4.rotate(matrix, xIncrement, [ 1, 0, 0 ]);
					m4.rotate(matrix, yIncrement, [ 0, 1, 0 ]);
					for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
						var mol = this.molecules[i];
						for ( var j = 0, jj = mol.atoms.length; j < jj; j++) {
							var a = mol.atoms[j];
							var p = [ a.x - this.width / 2, a.y - this.height / 2, a.z ];
							m4.multiplyVec3(matrix, p);
							a.x = p[0] + this.width / 2;
							a.y = p[1] + this.height / 2;
							a.z = p[2];
						}
						for ( var i = 0, ii = mol.rings.length; i < ii; i++) {
							mol.rings[i].center = mol.rings[i].getCenter();
						}
						this.lastPoint = e.p;
						if (this.specs.atoms_display && this.specs.atoms_circles_2D) {
							mol.sortAtomsByZ();
						}
						if (this.specs.bonds_display && this.specs.bonds_clearOverlaps_2D) {
							mol.sortBondsByZ();
						}
					}
					this.repaint();
				} else {
					var center = new structures.Point(this.width / 2, this.height / 2);
					var before = center.angle(this.lastPoint);
					var after = center.angle(e.p);
					this.specs.rotateAngle -= (after - before);
					this.lastPoint = e.p;
					this.repaint();
				}
			}
		}
	};
	_.mousewheel = function(e, delta) {
		this.specs.scale += delta / 50;
		if (this.specs.scale < .01) {
			this.specs.scale = .01;
		}
		this.repaint();
	};
	_.multitouchmove = function(e, numFingers) {
		if (numFingers === 2) {
			if (this.lastPoint.multi) {
				var t = new structures.Point(e.p.x, e.p.y);
				t.sub(this.lastPoint);
				for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
					var m = this.molecules[i];
					for ( var j = 0, jj = m.atoms.length; j < jj; j++) {
						m.atoms[j].add(t);
					}
					m.check();
				}
				for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
					var sps = this.shapes[i].getPoints();
					for ( var j = 0, jj = sps.length; j < jj; j++) {
						sps[j].add(t);
					}
				}
				this.lastPoint = e.p;
				this.lastPoint.multi = true;
				this.repaint();
			} else {
				this.lastPoint = e.p;
				this.lastPoint.multi = true;
			}
		}
	};
	_.gesturechange = function(e) {
		if (e.originalEvent.scale - this.lastPinchScale !== 0) {
			this.specs.scale *= e.originalEvent.scale / this.lastPinchScale;
			if (this.specs.scale < .01) {
				this.specs.scale = .01;
			}
			this.lastPinchScale = e.originalEvent.scale;
		}
		if (this.lastGestureRotate - e.originalEvent.rotation !== 0) {
			var rot = (this.lastGestureRotate - e.originalEvent.rotation) / 180 * m.PI;
			var center = new structures.Point(this.width / 2, this.height / 2);
			for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
				var m = this.molecules[i];
				for ( var j = 0, jj = m.atoms.length; j < jj; j++) {
					var a = m.atoms[j];
					var dist = center.distance(a);
					var angle = center.angle(a) + rot;
					a.x = center.x + dist * m.cos(angle);
					a.y = center.y - dist * m.sin(angle);
				}
				m.check();
			}
			this.lastGestureRotate = e.originalEvent.rotation;
		}
		this.repaint();
	};
	_.gestureend = function(e) {
		this.lastPinchScale = 1;
		this.lastGestureRotate = 0;
	};

})(ChemDoodle, ChemDoodle.monitor, ChemDoodle.structures, Math, mat4);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c) {
	'use strict';
	c.ViewerCanvas = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
	};
	c.ViewerCanvas.prototype = new c._Canvas();

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, document) {
	'use strict';
	c._SpectrumCanvas = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
	};
	var _ = c._SpectrumCanvas.prototype = new c._Canvas();
	_.spectrum = undefined;
	_.emptyMessage = 'No Spectrum Loaded or Recognized';
	_.loadMolecule = undefined;
	_.getMolecule = undefined;
	_.innerRepaint = function(ctx) {
		if (this.spectrum && this.spectrum.data.length > 0) {
			this.spectrum.draw(ctx, this.specs, this.width, this.height);
		} else if (this.emptyMessage) {
			ctx.fillStyle = '#737683';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font = '18px Helvetica, Verdana, Arial, Sans-serif';
			ctx.fillText(this.emptyMessage, this.width / 2, this.height / 2);
		}
	};
	_.loadSpectrum = function(spectrum) {
		this.spectrum = spectrum;
		this.repaint();
	};
	_.getSpectrum = function() {
		return this.spectrum;
	};
	_.getSpectrumCoordinates = function(x, y) {
		return spectrum.getInternalCoordinates(x, y, this.width, this.height);
	};

})(ChemDoodle, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c) {
	'use strict';
	c.ObserverCanvas = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
	};
	c.ObserverCanvas.prototype = new c._SpectrumCanvas();

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(c) {
	'use strict';
	c.OverlayCanvas = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
	};
	var _ = c.OverlayCanvas.prototype = new c._SpectrumCanvas();
	_.overlaySpectra = [];
	_.superRepaint = _.innerRepaint;
	_.innerRepaint = function(ctx) {
		this.superRepaint(ctx);
		if (this.spectrum && this.spectrum.data.length > 0) {
			for ( var i = 0, ii = this.overlaySpectra.length; i < ii; i++) {
				var s = this.overlaySpectra[i];
				if (s && s.data.length > 0) {
					s.minX = this.spectrum.minX;
					s.maxX = this.spectrum.maxX;
					s.drawPlot(ctx, this.specs, this.width, this.height, this.spectrum.memory.offsetTop, this.spectrum.memory.offsetLeft, this.spectrum.memory.offsetBottom);
				}
			}
		}
	};
	_.addSpectrum = function(spectrum) {
		if (!this.spectrum) {
			this.spectrum = spectrum;
		} else {
			this.overlaySpectra.push(spectrum);
		}
	};

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, monitor, m) {
	'use strict';
	c.PerspectiveCanvas = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
	};
	var _ = c.PerspectiveCanvas.prototype = new c._SpectrumCanvas();
	_.dragRange = undefined;
	_.rescaleYAxisOnZoom = true;
	_.lastPinchScale = 1;
	_.mousedown = function(e) {
		this.dragRange = new c.structures.Point(e.p.x, e.p.x);
	};
	_.mouseup = function(e) {
		if (this.dragRange && this.dragRange.x !== this.dragRange.y) {
			if (!this.dragRange.multi) {
				var newScale = this.spectrum.zoom(this.dragRange.x, e.p.x, this.width, this.rescaleYAxisOnZoom);
				if (this.rescaleYAxisOnZoom) {
					this.specs.scale = newScale;
				}
			}
			this.dragRange = undefined;
			this.repaint();
		}
	};
	_.drag = function(e) {
		if (this.dragRange) {
			if (this.dragRange.multi) {
				this.dragRange = undefined;
			} else if (monitor.SHIFT) {
				this.spectrum.translate(e.p.x - this.dragRange.x, this.width);
				this.dragRange.x = e.p.x;
				this.dragRange.y = e.p.x;
			} else {
				this.dragRange.y = e.p.x;
			}
			this.repaint();
		}
	};
	_.drawChildExtras = function(ctx) {
		if (this.dragRange) {
			var xs = m.min(this.dragRange.x, this.dragRange.y);
			var xe = m.max(this.dragRange.x, this.dragRange.y);
			ctx.strokeStyle = 'gray';
			ctx.lineStyle = 1;
			ctx.beginPath();
			ctx.moveTo(xs, this.height / 2);
			for ( var i = xs; i <= xe; i++) {
				if (i % 10 < 5) {
					ctx.lineTo(i, m.round(this.height / 2));
				} else {
					ctx.moveTo(i, m.round(this.height / 2));
				}
			}
			ctx.stroke();
		}
	};
	_.mousewheel = function(e, delta) {
		this.specs.scale += delta / 10;
		if (this.specs.scale < .01) {
			this.specs.scale = .01;
		}
		this.repaint();
	};
	_.dblclick = function(e) {
		this.spectrum.setup();
		this.specs.scale = 1;
		this.repaint();
	};
	_.multitouchmove = function(e, numFingers) {
		if (numFingers === 2) {
			if (!this.dragRange || !this.dragRange.multi) {
				this.dragRange = new c.structures.Point(e.p.x, e.p.x);
				this.dragRange.multi = true;
			} else {
				this.spectrum.translate(e.p.x - this.dragRange.x, this.width);
				this.dragRange.x = e.p.x;
				this.dragRange.y = e.p.x;
				this.repaint();
			}
		}
	};
	_.gesturechange = function(e) {
		this.specs.scale *= e.originalEvent.scale / this.lastPinchScale;
		if (this.specs.scale < .01) {
			this.specs.scale = .01;
		}
		this.lastPinchScale = e.originalEvent.scale;
		this.repaint();
	};
	_.gestureend = function(e) {
		this.lastPinchScale = 1;
	};

})(ChemDoodle, ChemDoodle.monitor, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(c, extensions, m) {
	'use strict';
	c.SeekerCanvas = function(id, width, height, seekType) {
		if (id) {
			this.create(id, width, height);
		}
		this.seekType = seekType;
	};
	var _ = c.SeekerCanvas.prototype = new c._SpectrumCanvas();
	_.superRepaint = _.innerRepaint;
	_.innerRepaint = function(ctx) {
		this.superRepaint(ctx);
		if (this.spectrum && this.spectrum.data.length > 0 && this.p) {
			// set up coords
			var renderP;
			var internalP;
			if (this.seekType === c.SeekerCanvas.SEEK_POINTER) {
				renderP = this.p;
				internalP = this.spectrum.getInternalCoordinates(renderP.x, renderP.y);
			} else if (this.seekType === c.SeekerCanvas.SEEK_PLOT || this.seekType === c.SeekerCanvas.SEEK_PEAK) {
				internalP = this.seekType === c.SeekerCanvas.SEEK_PLOT ? this.spectrum.getClosestPlotInternalCoordinates(this.p.x) : this.spectrum.getClosestPeakInternalCoordinates(this.p.x);
				if (!internalP) {
					return;
				}
				renderP = {
					x : this.spectrum.getTransformedX(internalP.x, this.specs, this.width, this.spectrum.memory.offsetLeft),
					y : this.spectrum.getTransformedY(internalP.y / 100, this.specs, this.height, this.spectrum.memory.offsetBottom, this.spectrum.memory.offsetTop)
				};
			}
			// draw point
			ctx.fillStyle = 'white';
			ctx.strokeStyle = this.specs.plots_color;
			ctx.lineWidth = this.specs.plots_width;
			ctx.beginPath();
			ctx.arc(renderP.x, renderP.y, 3, 0, m.PI * 2, false);
			ctx.fill();
			ctx.stroke();
			// draw internal coordinates
			ctx.font = extensions.getFontString(this.specs.text_font_size, this.specs.text_font_families);
			ctx.textAlign = 'left';
			ctx.textBaseline = 'bottom';
			var s = 'x:' + internalP.x.toFixed(3) + ', y:' + internalP.y.toFixed(3);
			var x = renderP.x + 3;
			var w = ctx.measureText(s).width;
			if (x + w > this.width - 2) {
				x -= 6 + w;
			}
			var y = renderP.y;
			if (y - this.specs.text_font_size - 2 < 0) {
				y += this.specs.text_font_size;
			}
			ctx.fillRect(x, y - this.specs.text_font_size, w, this.specs.text_font_size);
			ctx.fillStyle = 'black';
			ctx.fillText(s, x, y);
		}
	};
	_.mouseout = function(e) {
		this.p = undefined;
		this.repaint();
	};
	_.mousemove = function(e) {
		this.p = {
			x : e.p.x - 2,
			y : e.p.y - 3
		};
		this.repaint();
	};
	_.touchstart = function(e) {
		this.mousemove(e);
	};
	_.touchmove = function(e) {
		this.mousemove(e);
	};
	_.touchend = function(e) {
		this.mouseout(e);
	};
	c.SeekerCanvas.SEEK_POINTER = 'pointer';
	c.SeekerCanvas.SEEK_PLOT = 'plot';
	c.SeekerCanvas.SEEK_PEAK = 'peak';

})(ChemDoodle, ChemDoodle.extensions, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4500 $
//  $Author: kevin $
//  $LastChangedDate: 2013-09-06 14:28:15 -0400 (Fri, 06 Sep 2013) $

(function(c, extensions, math, structures, d3, RESIDUE, m, document, m4, m3, v3, window) {
	'use strict';
	c._Canvas3D = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
	};
	var _ = c._Canvas3D.prototype = new c._Canvas();
	_.rotationMatrix = undefined;
	_.translationMatrix = undefined;
	_.lastPoint = undefined;
	_.emptyMessage = 'WebGL is Unavailable!';
	_.afterLoadContent = function() {
		var bounds = new math.Bounds();
		for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
			bounds.expand(this.molecules[i].getBounds3D());
		}
		// build fog parameter
		var maxDimension3D = v3.dist([bounds.maxX, bounds.maxY, bounds.maxZ], [bounds.minX, bounds.minY, bounds.minZ]) / 2 + 1.5;

		var fov = 45;
		var theta = fov / 360 * Math.PI;
		var tanTheta = Math.tan(theta) / 0.8; 
		var top = maxDimension3D;
		this.depth = top / tanTheta;
		var near = m.max(this.depth - top, 0.1);
		var far = this.depth + top;
		var aspec = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

		if (aspec < 1) {
			fov /= aspec;
		}

		this.specs.projectionOrthoWidth_3D = Math.tan(fov / 360 * Math.PI) * this.depth * 2 * aspec;
		this.specs.projectionPerspectiveVerticalFieldOfView_3D = fov;
		this.specs.projectionFrontCulling_3D = near;
		this.specs.projectionBackCulling_3D = far;
		this.specs.projectionWidthHeightRatio_3D = aspec;

		this.translationMatrix = m4.translate(m4.identity([]), [ 0, 0, -this.depth ]);

		this.maxDimension = m.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
		// this.translationMatrix = m4.translate(m4.identity([]), [ 0, 0,
		// -this.maxDimension - 10 ]);
		this.setupScene();
	};
	_.setViewDistance = function(fov) {
		var minFov = 0.1;
		var maxFov = 179.9;
		this.specs.projectionPerspectiveVerticalFieldOfView_3D = math.clamp(this.specs.projectionPerspectiveVerticalFieldOfView_3D / fov, minFov, maxFov);
		this.specs.projectionOrthoWidth_3D = m.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * Math.PI) * this.depth * 2 * this.specs.projectionWidthHeightRatio_3D;
		this.updateScene();
	};
	_.repaint = function() {
		if (this.gl) {
			// ready the bits for rendering
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

			// set up the model view matrix to the specified transformations
			this.gl.modelViewMatrix = m4.multiply(this.translationMatrix, this.rotationMatrix, []);
			this.gl.rotationMatrix = this.rotationMatrix;

			// use default projection matrix to draw the molecule
			var pUniform = this.gl.getUniformLocation(this.gl.program, 'u_projection_matrix');
			this.gl.uniformMatrix4fv(pUniform, false, this.gl.projectionMatrix);
			this.gl.fogging.setMode(this.specs.fog_mode_3D);

			for ( var i = 0, ii = this.molecules.length; i < ii; i++) {
				this.molecules[i].render(this.gl, this.specs);
			}
			for ( var i = 0, ii = this.shapes.length; i < ii; i++) {
				this.shapes[i].render(this.gl, this.specs);
			}

			if (this.specs.compass_display) {
				// use projection matrix to draw the compass
				this.gl.uniformMatrix4fv(pUniform, false, this.compass.projectionMatrix);
				this.compass.render(this.gl, this.specs);
			}

			// set up GLProgram and shader for rendering text
			var shaderText = this.gl.shaderText;
			this.gl.useProgram(this.gl.programLabel);

			// enable blend and depth mask set to false
			this.gl.enable(this.gl.BLEND);
			this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
			this.gl.depthMask(false);

			// enable vertex for draw text
			this.gl.enableVertexAttribArray(shaderText.vertexPositionAttribute);
			this.gl.enableVertexAttribArray(shaderText.vertexTexCoordAttribute);
			this.gl.enableVertexAttribArray(shaderText.vertexTranslationAttribute);
			this.gl.enableVertexAttribArray(shaderText.vertexZDepthAttribute);

			// draw label molecule
			if (this.specs.atoms_displayLabels_3D) {
				this.label3D.render(this.gl, this.specs, this.getMolecules());
			}

			// draw compass X Y Z text
			if (this.specs.compass_display && this.specs.compass_displayText_3D) {
				this.compass.renderText(this.gl);
			}

			// disable vertex for draw text
			this.gl.disableVertexAttribArray(shaderText.vertexPositionAttribute);
			this.gl.disableVertexAttribArray(shaderText.vertexTexCoordAttribute);
			this.gl.disableVertexAttribArray(shaderText.vertexTranslationAttribute);
			this.gl.disableVertexAttribArray(shaderText.vertexZDepthAttribute);

			// disable blend and depth mask set to true
			this.gl.disable(this.gl.BLEND);
			this.gl.depthMask(true);

			// reset to prev setting
			this.gl.useProgram(this.gl.program);
			this.gl.enableVertexAttribArray(this.gl.shader.vertexPositionAttribute);
			this.gl.enableVertexAttribArray(this.gl.shader.vertexNormalAttribute);

			// flush as this is seen in documentation
			this.gl.flush();
		}
	};
	_.pick = function(x, y) {
		if (this.gl) {
			var gl = this.gl;

			// set up the model view matrix to the specified transformations
			m4.multiply(this.translationMatrix, this.rotationMatrix, this.gl.modelViewMatrix);
			this.gl.rotationMatrix = this.rotationMatrix;

			// use default projection matrix to draw the molecule
			var pUniform = this.gl.getUniformLocation(this.gl.program, 'u_projection_matrix');
			this.gl.uniformMatrix4fv(pUniform, false, this.gl.projectionMatrix);

			// draw with pick framebuffer
			return this.picker.pick(gl, this.molecules, this.specs, x, this.height - y);
		}
		return undefined;
	};
	_.center = function() {
		var canvas = document.getElementById(this.id);
		var p = new structures.Atom();
		for ( var k = 0, kk = this.molecules.length; k < kk; k++) {
			var m = this.molecules[k];
			p.add3D(m.getCenter3D());
		}
		p.x /= this.molecules.length;
		p.y /= this.molecules.length;
		for ( var k = 0, kk = this.molecules.length; k < kk; k++) {
			var m = this.molecules[k];
			for ( var i = 0, ii = m.atoms.length; i < ii; i++) {
				m.atoms[i].sub3D(p);
			}
			if (m.chains && m.fromJSON) {
				for ( var i = 0, ii = m.chains.length; i < ii; i++) {
					var chain = m.chains[i];
					for ( var j = 0, jj = chain.length; j < jj; j++) {
						var residue = chain[j];
						residue.cp1.sub3D(p);
						residue.cp2.sub3D(p);
						if (residue.cp3) {
							residue.cp3.sub3D(p);
							residue.cp4.sub3D(p);
							residue.cp5.sub3D(p);
						}
					}
				}
			}
		}
	};
	_.subCreate = function() {
		// setup gl object
		try {
			var canvas = document.getElementById(this.id);
			this.gl = canvas.getContext('webgl');
			if (!this.gl) {
				this.gl = canvas.getContext('experimental-webgl');
			}
		} catch (e) {
		}
		if (this.gl) {
			// setup matrices
			this.rotationMatrix = m4.identity([]);
			this.translationMatrix = m4.identity([]);
			// setup viewport
			this.gl.viewport(0, 0, this.width, this.height);
			this.gl.program = this.gl.createProgram();
			// this is the shader
			this.gl.shader = new d3.Shader();
			this.gl.shader.init(this.gl);
			// shader for text renderer
			this.gl.programLabel = this.gl.createProgram();
			this.gl.shaderText = new d3.TextShader();
			this.gl.shaderText.init(this.gl);
			this.setupScene();
		} else {
			this.displayMessage();
		}
	};
	c._Canvas.prototype.displayMessage = function() {
		var canvas = document.getElementById(this.id);
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');
			if (this.specs.backgroundColor) {
				ctx.fillStyle = this.specs.backgroundColor;
				ctx.fillRect(0, 0, this.width, this.height);
			}
			if (this.emptyMessage) {
				ctx.fillStyle = '#737683';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.font = '18px Helvetica, Verdana, Arial, Sans-serif';
				ctx.fillText(this.emptyMessage, this.width / 2, this.height / 2);
			}
		}
	};
	_.setupScene = function() {
		if (this.gl) {
			// clear the canvas
			var cs = math.getRGB(this.specs.backgroundColor, 1);
			this.gl.clearColor(cs[0], cs[1], cs[2], 1.0);
			this.gl.clearDepth(1.0);
			this.gl.enable(this.gl.DEPTH_TEST);
			this.gl.depthFunc(this.gl.LEQUAL);
			if (this.specs.cullBackFace_3D) {
				this.gl.enable(this.gl.CULL_FACE);
			}
			// here is the sphere buffer to be drawn, make it once, then scale
			// and translate to draw atoms
			this.gl.sphereBuffer = new d3.Sphere(1, this.specs.atoms_resolution_3D, this.specs.atoms_resolution_3D);
			this.gl.starBuffer = new d3.Star();
			this.gl.cylinderBuffer = new d3.Cylinder(1, 1, this.specs.bonds_resolution_3D);
			this.gl.pillBuffer = new d3.Pill(this.specs.bonds_pillDiameter_3D / 2, this.specs.bonds_pillHeight_3D, this.specs.bonds_pillLatitudeResolution_3D, this.specs.bonds_pillLongitudeResolution_3D);
			this.gl.lineBuffer = new d3.Line();
			this.gl.arrowBuffer = new d3.Arrow(0.3, this.specs.compass_resolution_3D);
			// add label
			this.label3D = new d3.Label();
			this.label3D.init(this.gl, this.specs);

			for ( var k = 0, kk = this.molecules.length; k < kk; k++) {
				var mol = this.molecules[k];
				if (!(mol.labelMesh instanceof d3.TextMesh)) {
					mol.labelMesh = new d3.TextMesh();
					mol.labelMesh.init(this.gl);
				}
				if (mol.unitCellVectors) {
					mol.unitCell = new d3.UnitCell(mol.unitCellVectors);
				}
				if (mol.chains) {
					mol.ribbons = [];
					mol.cartoons = [];
					mol.tubes = [];
					// set up ribbon diagram if available and not already setup
					for ( var j = 0, jj = mol.chains.length; j < jj; j++) {
						var rs = mol.chains[j];
						var isNucleotide = rs.length > 2 && RESIDUE[rs[2].name] && RESIDUE[rs[2].name].aminoColor === '#BEA06E';
						if (rs.length > 0 && !rs[0].lineSegments) {
							for ( var i = 0, ii = rs.length - 1; i < ii; i++) {
								rs[i].setup(rs[i + 1].cp1, isNucleotide ? 1 : this.specs.proteins_horizontalResolution);
							}
							if (!isNucleotide) {
								for ( var i = 1, ii = rs.length - 1; i < ii; i++) {
									// reverse guide points if carbonyl
									// orientation flips
									if (extensions.vec3AngleFrom(rs[i - 1].D, rs[i].D) > m.PI / 2) {
										rs[i].guidePointsSmall.reverse();
										rs[i].guidePointsLarge.reverse();
										v3.scale(rs[i].D, -1);
									}
								}
							}
							for ( var i = 1, ii = rs.length - 3; i < ii; i++) {
								// compute line segments
								rs[i].computeLineSegments(rs[i - 1], rs[i + 1], rs[i + 2], !isNucleotide, isNucleotide ? this.specs.nucleics_verticalResolution : this.specs.proteins_verticalResolution);
							}
							// remove unneeded dummies
							rs.pop();
							rs.pop();
							rs.pop();
							rs.shift();
						}
						// create the hsl color for the chain
						var rgb = math.hsl2rgb(jj === 1 ? .5 : j / jj, 1, .5);
						var chainColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
						rs.chainColor = chainColor;
						if (isNucleotide) {
							var t = new d3.Tube(rs, this.specs.nucleics_tubeThickness, this.specs.nucleics_tubeResolution_3D);
							t.chainColor = chainColor;
							mol.tubes.push(t);
						} else {
							var r = {
								front : new d3.Ribbon(rs, this.specs.proteins_ribbonThickness, false),
								back : new d3.Ribbon(rs, -this.specs.proteins_ribbonThickness, false)
							};
							r.front.chainColor = chainColor;
							r.back.chainColor = chainColor;
							for ( var i = 0, ii = r.front.segments.length; i < ii; i++) {
								r.front.segments[i].chainColor = chainColor;
							}
							for ( var i = 0, ii = r.back.segments.length; i < ii; i++) {
								r.back.segments[i].chainColor = chainColor;
							}
							mol.ribbons.push(r);
							var d = {
								front : new d3.Ribbon(rs, this.specs.proteins_ribbonThickness, true),
								back : new d3.Ribbon(rs, -this.specs.proteins_ribbonThickness, true)
							};
							d.front.chainColor = chainColor;
							d.back.chainColor = chainColor;
							for ( var i = 0, ii = d.front.segments.length; i < ii; i++) {
								d.front.segments[i].chainColor = chainColor;
							}
							for ( var i = 0, ii = d.back.segments.length; i < ii; i++) {
								d.back.segments[i].chainColor = chainColor;
							}
							for ( var i = 0, ii = d.front.cartoonSegments.length; i < ii; i++) {
								d.front.cartoonSegments[i].chainColor = chainColor;
							}
							for ( var i = 0, ii = d.back.cartoonSegments.length; i < ii; i++) {
								d.back.cartoonSegments[i].chainColor = chainColor;
							}
							mol.cartoons.push(d);
						}
					}
				}
			}
			this.label3D.updateVerticesBuffer(this.gl, this.getMolecules(), this.specs);

			// the molecules in frame of MovieCanvas3D must be handled
			if (this instanceof c.MovieCanvas3D && this.frames) {
				for ( var i = 0, ii = this.frames.length; i < ii; i++) {
					var f = this.frames[i];
					for ( var j = 0, jj = f.mols.length; j < jj; j++) {
						var mol = f.mols[j];
						if (!(mol.labelMesh instanceof structures.d3.TextMesh)) {
							mol.labelMesh = new structures.d3.TextMesh();
							mol.labelMesh.init(this.gl);
						}
					}
					this.label3D.updateVerticesBuffer(this.gl, f.mols, this.specs);
				}
			}
			// set up lighting
			this.gl.lighting = new d3.Light(this.specs.lightDiffuseColor_3D, this.specs.lightSpecularColor_3D, this.specs.lightDirection_3D);
			this.gl.lighting.lightScene(this.gl);
			// set up material
			this.gl.material = new d3.Material(this.gl);
			// set up fogging
			this.gl.fogging = new d3.Fog(this.gl);
			this.gl.fogging.setTempParameter(this.specs.fog_color_3D || this.specs.backgroundColor, this.specs.fog_start_3D, this.specs.fog_end_3D, this.specs.fog_density_3D);
			// set up compass
			this.compass = new d3.Compass(this.gl, this.specs);

			// projection matrix
			// arg1: vertical field of view (degrees)
			// arg2: width to height ratio
			// arg3: front culling
			// arg4: back culling
			var widthHeightRatio = this.width / this.height;
			if (this.specs.projectionWidthHeightRatio_3D) {
				widthHeightRatio = this.specs.projectionWidthHeightRatio_3D;
			}
			this.gl.projectionMatrix = this.specs.projectionPerspective_3D ? m4.perspective(this.specs.projectionPerspectiveVerticalFieldOfView_3D, widthHeightRatio, this.specs.projectionFrontCulling_3D, this.specs.projectionBackCulling_3D) : m4.ortho(-this.specs.projectionOrthoWidth_3D / 2, this.specs.projectionOrthoWidth_3D / 2, -this.specs.projectionOrthoWidth_3D / 2 / widthHeightRatio, this.specs.projectionOrthoWidth_3D / 2 / widthHeightRatio, this.specs.projectionFrontCulling_3D,
					this.specs.projectionBackCulling_3D);
			// push the projection matrix to the graphics card
			var pUniform = this.gl.getUniformLocation(this.gl.program, 'u_projection_matrix');
			this.gl.uniformMatrix4fv(pUniform, false, this.gl.projectionMatrix);
			// matrix setup functions
			var mvUL = this.gl.getUniformLocation(this.gl.program, 'u_model_view_matrix');
			var nUL = this.gl.getUniformLocation(this.gl.program, 'u_normal_matrix');
			this.gl.setMatrixUniforms = function(mvMatrix) {
				// push the model-view matrix to the graphics card
				this.uniformMatrix4fv(mvUL, false, mvMatrix);
				// create the normal matrix and push it to the graphics card
				var normalMatrix = m3.transpose(m4.toInverseMat3(mvMatrix, []));
				this.uniformMatrix3fv(nUL, false, normalMatrix);
			};

			// set framebuffer
			this.picker = new d3.Picker();
			this.picker.init(this.gl);
			this.picker.setDimension(this.gl, this.width, this.height);
		}
	};
	_.mousedown = function(e) {
		this.lastPoint = e.p;
	};
	_.rightmousedown = function(e) {
		this.lastPoint = e.p;
	};
	_.drag = function(e) {
		if (c.monitor.ALT) {
			var t = new structures.Point(e.p.x, e.p.y);
			t.sub(this.lastPoint);
			var theta = this.specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * m.PI;
			var tanTheta = m.tan(theta);
			var topScreen = this.height / 2;
			var nearScreen = topScreen / tanTheta;
			var nearRatio = this.depth / nearScreen;
			m4.translate(this.translationMatrix, [ t.x * nearRatio, -t.y * nearRatio, 0 ]);
			this.lastPoint = e.p;
			this.repaint();
		} else {
			var difx = e.p.x - this.lastPoint.x;
			var dify = e.p.y - this.lastPoint.y;
			var rotation = m4.rotate(m4.identity([]), difx * m.PI / 180.0, [ 0, 1, 0 ]);
			m4.rotate(rotation, dify * m.PI / 180.0, [ 1, 0, 0 ]);
			this.rotationMatrix = m4.multiply(rotation, this.rotationMatrix);
			this.lastPoint = e.p;
			this.repaint();
		}
	};
	_.mousewheel = function(e, delta) {
		var minFov = 0.1;
		var maxFov = 179.9;
		var dz = delta;
		var fov = this.specs.projectionPerspectiveVerticalFieldOfView_3D + dz;

		this.specs.projectionPerspectiveVerticalFieldOfView_3D = fov < minFov ? minFov : fov > maxFov ? maxFov : fov;
		this.specs.projectionOrthoWidth_3D = Math.tan(this.specs.projectionPerspectiveVerticalFieldOfView_3D / 360 * Math.PI) * this.depth * 2 * this.specs.projectionWidthHeightRatio_3D;

		this.updateScene();
	};
	_.updateScene = function() {
		this.gl.fogging.setTempParameter(this.specs.fog_color_3D || this.specs.backgroundColor, this.specs.fog_start_3D, this.specs.fog_end_3D, this.specs.fog_density_3D);
		var widthHeightRatio = this.width / this.height;
		if (this.specs.projectionWidthHeightRatio_3D) {
			widthHeightRatio = this.specs.projectionWidthHeightRatio_3D;
		}
		this.gl.projectionMatrix = this.specs.projectionPerspective_3D ? m4.perspective(this.specs.projectionPerspectiveVerticalFieldOfView_3D, widthHeightRatio, this.specs.projectionFrontCulling_3D, this.specs.projectionBackCulling_3D) : m4.ortho(-this.specs.projectionOrthoWidth_3D / 2, this.specs.projectionOrthoWidth_3D / 2, -this.specs.projectionOrthoWidth_3D / 2 / widthHeightRatio, this.specs.projectionOrthoWidth_3D / 2 / widthHeightRatio, this.specs.projectionFrontCulling_3D,
				this.specs.projectionBackCulling_3D);
		this.repaint();
	};

})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.math, ChemDoodle.structures, ChemDoodle.structures.d3, ChemDoodle.RESIDUE, Math, document, mat4, mat3, vec3, window);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, iChemLabs, q, document) {
	'use strict';
	c.MolGrabberCanvas3D = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
		var sb = [];
		sb.push('<br><input type="text" id="');
		sb.push(id);
		sb.push('_query" size="32" value="" />');
		sb.push('<br><nobr>');
		sb.push('<select id="');
		sb.push(id);
		sb.push('_select">');
		// sb.push('<option value="chemexper">ChemExper');
		// sb.push('<option value="chemspider">ChemSpider');
		sb.push('<option value="pubchem" selected>PubChem');
		sb.push('</select>');
		sb.push('<button id="');
		sb.push(id);
		sb.push('_submit">Show Molecule</button>');
		sb.push('</nobr>');
		document.writeln(sb.join(''));
		var self = this;
		q('#' + id + '_submit').click(function() {
			self.search();
		});
		q('#' + id + '_query').keypress(function(e) {
			if (e.which === 13) {
				self.search();
			}
		});
	};
	var _ = c.MolGrabberCanvas3D.prototype = new c._Canvas3D();
	_.setSearchTerm = function(term) {
		q('#' + this.id + '_query').val(term);
		this.search();
	};
	_.search = function() {
		var self = this;
		iChemLabs.getMoleculeFromDatabase(q('#' + this.id + '_query').val(), {
			database : q('#' + this.id + '_select').val(),
			dimension : 3
		}, function(mol) {
			self.loadMolecule(mol);
		});
	};

})(ChemDoodle, ChemDoodle.iChemLabs, jQuery, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(c, structures) {
	'use strict';
	c.MovieCanvas3D = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
		this.frames = [];
	};
	c.MovieCanvas3D.PLAY_ONCE = 0;
	c.MovieCanvas3D.PLAY_LOOP = 1;
	c.MovieCanvas3D.PLAY_SPRING = 2;
	var _ = c.MovieCanvas3D.prototype = new c._Canvas3D();
	_.timeout = 50;
	_.frameNumber = 0;
	_.playMode = 2;
	_.reverse = false;
	_.startAnimation = c._AnimatorCanvas.prototype.startAnimation;
	_.stopAnimation = c._AnimatorCanvas.prototype.stopAnimation;
	_.isRunning = c._AnimatorCanvas.prototype.isRunning;
	_.dblclick = c.RotatorCanvas.prototype.dblclick;
	_.nextFrame = function(delta) {
		var f = this.frames[this.frameNumber];
		this.molecules = f.mols;
		this.shapes = f.shapes;
		if (this.playMode === 2 && this.reverse) {
			this.frameNumber--;
			if (this.frameNumber < 0) {
				this.frameNumber = 1;
				this.reverse = false;
			}
		} else {
			this.frameNumber++;
			if (this.frameNumber >= this.frames.length) {
				if (this.playMode === 2) {
					this.frameNumber -= 2;
					this.reverse = true;
				} else {
					this.frameNumber = 0;
					if (this.playMode === 0) {
						this.stopAnimation();
					}
				}
			}
		}
	};
	_.center = function() {
		// override this function to center the entire movie
		var p = new structures.Atom();
		var first = this.frames[0];
		for ( var j = 0, jj = first.mols.length; j < jj; j++) {
			p.add3D(first.mols[j].getCenter3D());
		}
		p.x /= first.mols.length;
		p.y /= first.mols.length;
		var center = new structures.Atom();
		center.sub3D(p);
		for ( var i = 0, ii = this.frames.length; i < ii; i++) {
			var f = this.frames[i];
			for ( var j = 0, jj = f.mols.length; j < jj; j++) {
				var mol = f.mols[j];
				for ( var k = 0, kk = mol.atoms.length; k < kk; k++) {
					mol.atoms[k].add3D(center);
				}
			}
		}
	};
	_.addFrame = function(molecules, shapes) {
		this.frames.push({
			mols : molecules,
			shapes : shapes
		});
	};

})(ChemDoodle, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//

(function(c, m, m4) {
	'use strict';
	// keep these declaration outside the loop to avoid overhead
	var matrix = [];
	var xAxis = [ 1, 0, 0 ];
	var yAxis = [ 0, 1, 0 ];
	var zAxis = [ 0, 0, 1 ];

	c.RotatorCanvas3D = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
	};
	var _ = c.RotatorCanvas3D.prototype = new c._Canvas3D();
	_.timeout = 33;
	var increment = m.PI / 15;
	_.xIncrement = increment;
	_.yIncrement = increment;
	_.zIncrement = increment;
	_.startAnimation = c._AnimatorCanvas.prototype.startAnimation;
	_.stopAnimation = c._AnimatorCanvas.prototype.stopAnimation;
	_.isRunning = c._AnimatorCanvas.prototype.isRunning;
	_.dblclick = c.RotatorCanvas.prototype.dblclick;
	_.mousedown = undefined;
	_.rightmousedown = undefined;
	_.drag = undefined;
	_.mousewheel = undefined;
	_.nextFrame = function(delta) {
		if (this.molecules.length === 0 && this.shapes.length === 0) {
			this.stopAnimation();
			return;
		}
		m4.identity(matrix);
		var change = delta / 1000;
		m4.rotate(matrix, this.xIncrement * change, xAxis);
		m4.rotate(matrix, this.yIncrement * change, yAxis);
		m4.rotate(matrix, this.zIncrement * change, zAxis);
		m4.multiply(this.rotationMatrix, matrix);
	};

})(ChemDoodle, Math, mat4);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(c) {
	'use strict';
	c.TransformCanvas3D = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
	};
	c.TransformCanvas3D.prototype = new c._Canvas3D();

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 4131 $
//  $Author: kevin $
//  $LastChangedDate: 2013-02-18 21:02:56 -0500 (Mon, 18 Feb 2013) $
//
(function(c) {
	'use strict';
	c.ViewerCanvas3D = function(id, width, height) {
		if (id) {
			this.create(id, width, height);
		}
	};
	var _ = c.ViewerCanvas3D.prototype = new c._Canvas3D();
	_.mousedown = undefined;
	_.rightmousedown = undefined;
	_.drag = undefined;
	_.mousewheel = undefined;

})(ChemDoodle);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(c, extensions, math, document) {
	'use strict';
	function PeriodicCell(element, x, y, dimension) {
		this.element = element;
		this.x = x;
		this.y = y;
		this.dimension = dimension;
	}

	c.PeriodicTableCanvas = function(id, cellDimension) {
		this.padding = 5;
		if (id) {
			this.create(id, cellDimension * 18 + this.padding * 2, cellDimension * 10 + this.padding * 2);
		}
		this.cellDimension = cellDimension ? cellDimension : 20;
		this.setupTable();
		this.repaint();
	};
	var _ = c.PeriodicTableCanvas.prototype = new c._Canvas();
	_.loadMolecule = undefined;
	_.getMolecule = undefined;
	_.getHoveredElement = function() {
		if (this.hovered) {
			return this.hovered.element;
		}
		return undefined;
	};
	_.innerRepaint = function(ctx) {
		for ( var i = 0, ii = this.cells.length; i < ii; i++) {
			this.drawCell(ctx, this.specs, this.cells[i]);
		}
		if (this.hovered) {
			this.drawCell(ctx, this.specs, this.hovered);
		}
		if (this.selected) {
			this.drawCell(ctx, this.specs, this.selected);
		}
	};
	_.setupTable = function() {
		this.cells = [];
		var x = this.padding;
		var y = this.padding;
		var count = 0;
		for ( var i = 0, ii = c.SYMBOLS.length; i < ii; i++) {
			if (count === 18) {
				count = 0;
				y += this.cellDimension;
				x = this.padding;
			}
			var e = c.ELEMENT[c.SYMBOLS[i]];
			if (e.atomicNumber === 2) {
				x += 16 * this.cellDimension;
				count += 16;
			} else if (e.atomicNumber === 5 || e.atomicNumber === 13) {
				x += 10 * this.cellDimension;
				count += 10;
			}
			if ((e.atomicNumber < 58 || e.atomicNumber > 71 && e.atomicNumber < 90 || e.atomicNumber > 103) && e.atomicNumber < 113) {
				this.cells.push(new PeriodicCell(e, x, y, this.cellDimension));
				x += this.cellDimension;
				count++;
			}
		}
		y += 2 * this.cellDimension;
		x = 3 * this.cellDimension + this.padding;
		for ( var i = 57; i < 104; i++) {
			var e = c.ELEMENT[c.SYMBOLS[i]];
			if (e.atomicNumber === 90) {
				y += this.cellDimension;
				x = 3 * this.cellDimension + this.padding;
			}
			if (e.atomicNumber >= 58 && e.atomicNumber <= 71 || e.atomicNumber >= 90 && e.atomicNumber <= 103) {
				this.cells.push(new PeriodicCell(e, x, y, this.cellDimension));
				x += this.cellDimension;
			}
		}
	};
	_.drawCell = function(ctx, specs, cell) {
		var radgrad = ctx.createRadialGradient(cell.x + cell.dimension / 3, cell.y + cell.dimension / 3, cell.dimension * 1.5, cell.x + cell.dimension / 3, cell.y + cell.dimension / 3, cell.dimension / 10);
		radgrad.addColorStop(0, '#000000');
		radgrad.addColorStop(.7, cell.element.jmolColor);
		radgrad.addColorStop(1, '#FFFFFF');
		ctx.fillStyle = radgrad;
		extensions.contextRoundRect(ctx, cell.x, cell.y, cell.dimension, cell.dimension, cell.dimension / 8);
		if (cell === this.hovered || cell === this.selected) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#c10000';
			ctx.stroke();
			ctx.fillStyle = 'white';
		}
		ctx.fill();
		ctx.font = extensions.getFontString(specs.text_font_size, specs.text_font_families);
		ctx.fillStyle = specs.text_color;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(cell.element.symbol, cell.x + cell.dimension / 2, cell.y + cell.dimension / 2);
	};
	_.click = function(e) {
		if (this.hovered) {
			this.selected = this.hovered;
			this.repaint();
		}
	};
	_.mousemove = function(e) {
		var x = e.p.x;
		var y = e.p.y;
		this.hovered = undefined;
		for ( var i = 0, ii = this.cells.length; i < ii; i++) {
			var c = this.cells[i];
			if (math.isBetween(x, c.x, c.x + c.dimension) && math.isBetween(y, c.y, c.y + c.dimension)) {
				this.hovered = c;
				break;
			}
		}
		this.repaint();
	};
	_.mouseout = function(e) {
		this.hovered = undefined;
		this.repaint();
	};

})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.math, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3200 $
//  $Author: kevin $
//  $LastChangedDate: 2011-04-18 20:50:47 -0400 (Mon, 18 Apr 2011) $
//

(function(io, document, window) {
	'use strict';
	io.png = {};

	io.png.create = function(canvas) {
		// this will not work for WebGL canvases in some browsers
		// to fix that you need to set the "preserveDrawingBuffer" to true when
		// creating the WebGL context
		// note that this will cause performance issues on some platforms and is
		// therefore not done by default
		window.open(document.getElementById(canvas.id).toDataURL('image/png'));
	};

})(ChemDoodle.io, document, window);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3200 $
//  $Author: kevin $
//  $LastChangedDate: 2011-04-18 20:50:47 -0400 (Mon, 18 Apr 2011) $
//

(function(io, q) {
	'use strict';
	io.file = {};

	// this function will only work with files from the same origin it is being
	// called from, unless the receiving server supports XHR2
	io.file.content = function(url, callback) {
		q.get(url, '', callback);
	};

})(ChemDoodle.io, jQuery);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2976 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-29 18:16:10 -0500 (Wed, 29 Dec 2010) $
//

(function(c, iChemLabs, io, structures, q) {
	'use strict';
	iChemLabs.SERVER_URL = 'http://ichemlabs.cloud.chemdoodle.com/icl_cdc_v050000/WebHQ';

	iChemLabs.inRelay = false;
	iChemLabs.asynchronous = true;

	iChemLabs.INFO = {
		userAgent : navigator.userAgent,
		v_cwc : c.getVersion(),
		v_jQuery : q.version,
		v_jQuery_ui : (q.ui ? q.ui.version : 'N/A')
	};

	var JSON_INTERPRETER = new io.JSONInterpreter();

	iChemLabs._contactServer = function(call, content, options, callback, errorback) {
		if (this.inRelay) {
			alert('Already connecting to the server, please wait for the first request to finish.');
		} else {
			iChemLabs.inRelay = true;
			q.ajax({
				dataType : 'text',
				type : 'POST',
				data : JSON.stringify({
					'call' : call,
					'content' : content,
					'options' : options,
					'info' : iChemLabs.INFO
				}),
				url : this.SERVER_URL,
				success : function(data) {
					iChemLabs.inRelay = false;
					var o = JSON.parse(data);
					if (o.message) {
						alert(o.message);
					}
					if (callback && o.content && !o.stop) {
						callback(o.content);
					}
					if (o.stop && errorback) {
						errorback();
					}
				},
				error : function(xhr, status, error) {
					iChemLabs.inRelay = false;
					alert('Call failed. Please try again. If you continue to see this message, please contact iChemLabs customer support.');
					if (errorback) {
						errorback();
					}
				},
				xhrFields : {
					withCredentials : true
				},
				async : iChemLabs.asynchronous
			});
		}
	};

	// undocumented, this call is for clients that have licensed cloud for their
	// own servers
	iChemLabs.authenticate = function(credential, options, callback, errorback) {
		this._contactServer('authenticate', {
			'credential' : credential
		}, options, function(content) {
			callback(content);
		}, errorback);
	};

	iChemLabs.calculate = function(mol, options, callback, errorback) {
		this._contactServer('calculate', {
			'mol' : JSON_INTERPRETER.molTo(mol)
		}, options, function(content) {
			callback(content);
		}, errorback);
	};

	iChemLabs.generateImage = function(mol, options, callback, errorback) {
		this._contactServer('generateImage', {
			'mol' : JSON_INTERPRETER.molTo(mol)
		}, options, function(content) {
			callback(content.link);
		}, errorback);
	};

	iChemLabs.generateIUPACName = function(mol, options, callback, errorback) {
		this._contactServer('generateIUPACName', {
			'mol' : JSON_INTERPRETER.molTo(mol)
		}, options, function(content) {
			callback(content.iupac);
		}, errorback);
	};

	iChemLabs.getAd = function(callback, errorback) {
		this._contactServer('getAd', {}, {}, function(content) {
			callback(content.image_url, content.target_url);
		}, errorback);
	};

	iChemLabs.getMoleculeFromContent = function(input, options, callback, errorback) {
		this._contactServer('getMoleculeFromContent', {
			'content' : input
		}, options, function(content) {
			var z = false;
			for ( var i = 0, ii = content.mol.a.length; i < ii; i++) {
				if (content.mol.a[i].z !== 0) {
					z = true;
					break;
				}
			}
			if (z) {
				for ( var i = 0, ii = content.mol.a.length; i < ii; i++) {
					content.mol.a[i].x /= 20;
					content.mol.a[i].y /= 20;
					content.mol.a[i].z /= 20;
				}
			}
			callback(JSON_INTERPRETER.molFrom(content.mol));
		}, errorback);
	};

	iChemLabs.getMoleculeFromDatabase = function(query, options, callback, errorback) {
		this._contactServer('getMoleculeFromDatabase', {
			'query' : query
		}, options, function(content) {
			if (options.dimension === 3) {
				for ( var i = 0, ii = content.mol.a.length; i < ii; i++) {
					content.mol.a[i].x /= 20;
					content.mol.a[i].y /= -20;
					content.mol.a[i].z /= 20;
				}
			}
			callback(JSON_INTERPRETER.molFrom(content.mol));
		}, errorback);
	};

	iChemLabs.getOptimizedPDBStructure = function(id, options, callback, errorback) {
		this._contactServer('getOptimizedPDBStructure', {
			'id' : id
		}, options, function(content) {
			var mol;
			if (content.mol) {
				mol = JSON_INTERPRETER.molFrom(content.mol);
			} else {
				var mol = new structures.Molecule();
			}
			mol.chains = JSON_INTERPRETER.chainsFrom(content.ribbons);
			mol.fromJSON = true;
			callback(mol);
		}, errorback);
	};

	iChemLabs.getZeoliteFromIZA = function(query, options, callback, errorback) {
		this._contactServer('getZeoliteFromIZA', {
			'query' : query
		}, options, function(content) {
			callback(ChemDoodle.readCIF(content.cif, options.xSuper, options.ySuper, options.zSuper));
		}, errorback);
	};

	iChemLabs.isGraphIsomorphism = function(arrow, target, options, callback, errorback) {
		this._contactServer('isGraphIsomorphism', {
			'arrow' : JSON_INTERPRETER.molTo(arrow),
			'target' : JSON_INTERPRETER.molTo(target)
		}, options, function(content) {
			callback(content.value);
		}, errorback);
	};

	iChemLabs.isSubgraphIsomorphism = function(arrow, target, options, callback, errorback) {
		this._contactServer('isSubgraphIsomorphism', {
			'arrow' : JSON_INTERPRETER.molTo(arrow),
			'target' : JSON_INTERPRETER.molTo(target)
		}, options, function(content) {
			callback(content.value);
		}, errorback);
	};

	iChemLabs.kekulize = function(mol, options, callback, errorback) {
		this._contactServer('kekulize', {
			'mol' : JSON_INTERPRETER.molTo(mol)
		}, options, function(content) {
			callback(JSON_INTERPRETER.molFrom(content.mol));
		}, errorback);
	};

	iChemLabs.optimize = function(mol, options, callback, errorback) {
		this._contactServer('optimize', {
			'mol' : JSON_INTERPRETER.molTo(mol)
		}, options, function(content) {
			var optimized = JSON_INTERPRETER.molFrom(content.mol);
			if (options.dimension === 2) {
				for ( var i = 0, ii = optimized.atoms.length; i < ii; i++) {
					mol.atoms[i].x = optimized.atoms[i].x;
					mol.atoms[i].y = optimized.atoms[i].y;
				}
				callback();
			} else if (options.dimension === 3) {
				for ( var i = 0, ii = optimized.atoms.length; i < ii; i++) {
					optimized.atoms[i].x /= 20;
					optimized.atoms[i].y /= -20;
					optimized.atoms[i].z /= 20;
				}
				callback(optimized);
			}
		}, errorback);
	};

	iChemLabs.readIUPACName = function(iupac, options, callback, errorback) {
		this._contactServer('readIUPACName', {
			'iupac' : iupac
		}, options, function(content) {
			callback(JSON_INTERPRETER.molFrom(content.mol));
		}, errorback);
	};

	iChemLabs.readSMILES = function(smiles, options, callback, errorback) {
		this._contactServer('readSMILES', {
			'smiles' : smiles
		}, options, function(content) {
			callback(JSON_INTERPRETER.molFrom(content.mol));
		}, errorback);
	};

	iChemLabs.saveFile = function(mol, options, callback, errorback) {
		this._contactServer('saveFile', {
			'mol' : JSON_INTERPRETER.molTo(mol)
		}, options, function(content) {
			callback(content.link);
		}, errorback);
	};

	iChemLabs.simulate13CNMR = function(mol, options, callback, errorback) {
		options.nucleus = 'C';
		options.isotope = 13;
		this._contactServer('simulateNMR', {
			'mol' : JSON_INTERPRETER.molTo(mol)
		}, options, function(content) {
			callback(c.readJCAMP(content.jcamp));
		}, errorback);
	};

	iChemLabs.simulate1HNMR = function(mol, options, callback, errorback) {
		options.nucleus = 'H';
		options.isotope = 1;
		this._contactServer('simulateNMR', {
			'mol' : JSON_INTERPRETER.molTo(mol)
		}, options, function(content) {
			callback(c.readJCAMP(content.jcamp));
		}, errorback);
	};

	iChemLabs.simulateMassParentPeak = function(mol, options, callback, errorback) {
		this._contactServer('simulateMassParentPeak', {
			'mol' : JSON_INTERPRETER.molTo(mol)
		}, options, function(content) {
			callback(c.readJCAMP(content.jcamp));
		}, errorback);
	};

	iChemLabs.writeSMILES = function(mol, options, callback, errorback) {
		this._contactServer('writeSMILES', {
			'mol' : JSON_INTERPRETER.molTo(mol)
		}, options, function(content) {
			callback(content.smiles);
		}, errorback);
	};

	iChemLabs.version = function(options, callback, errorback) {
		this._contactServer('version', {}, options, function(content) {
			callback(content.value);
		}, errorback);
	};

})(ChemDoodle, ChemDoodle.iChemLabs, ChemDoodle.io, ChemDoodle.structures, jQuery);
