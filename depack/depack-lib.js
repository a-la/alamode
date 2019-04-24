             
let DEPACK_EXPORT;
const _module = require('module');
const path = require('path');
const vm = require('vm');
const stream = require('stream');
const os = require('os');
const fs = require('fs');
const url = require('url');var m = m || {};
m.scope = {};
m.X = function(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
};
m.ka = function(a) {
  return {next:m.X(a)};
};
m.f = function(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : m.ka(a);
};
m.ja = function(a) {
  for (var b, c = []; !(b = a.next()).done;) {
    c.push(b.value);
  }
  return c;
};
m.h = function(a) {
  return a instanceof Array ? a : m.ja(m.f(a));
};
m.V = !1;
m.ea = !1;
m.Ga = !1;
m.Ha = !1;
m.ya = m.V || "function" == typeof Object.create ? Object.create : function(a) {
  function b() {
  }
  b.prototype = a;
  return new b;
};
m.Ea = function() {
  var a = {ia:!0}, b = {};
  try {
    return b.__proto__ = a, b.ia;
  } catch (c) {
  }
  return !1;
};
m.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : m.Ea() ? function(a, b) {
  a.__proto__ = b;
  if (a.__proto__ !== b) {
    throw new TypeError(a + " is not extensible");
  }
  return a;
} : null;
m.P = function(a, b) {
  a.prototype = m.ya(b.prototype);
  a.prototype.constructor = a;
  if (m.setPrototypeOf) {
    var c = m.setPrototypeOf;
    c(a, b);
  } else {
    for (c in b) {
      if ("prototype" != c) {
        if (Object.defineProperties) {
          var d = Object.getOwnPropertyDescriptor(b, c);
          d && Object.defineProperty(a, c, d);
        } else {
          a[c] = b[c];
        }
      }
    }
  }
  a.La = b.prototype;
};
m.sa = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
m.global = m.sa(this);
m.defineProperty = m.V || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  a != Array.prototype && a != Object.prototype && (a[b] = c.value);
};
m.o = function(a, b) {
  if (b) {
    var c = m.global;
    a = a.split(".");
    for (var d = 0; d < a.length - 1; d++) {
      var e = a[d];
      e in c || (c[e] = {});
      c = c[e];
    }
    a = a[a.length - 1];
    d = c[a];
    b = b(d);
    b != d && null != b && m.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
  }
};
m.fa = !1;
m.o("Promise", function(a) {
  function b(h) {
    this.b = 0;
    this.j = void 0;
    this.a = [];
    var l = this.c();
    try {
      h(l.resolve, l.reject);
    } catch (f) {
      l.reject(f);
    }
  }
  function c() {
    this.a = null;
  }
  function d(h) {
    return h instanceof b ? h : new b(function(l) {
      l(h);
    });
  }
  if (a && !m.fa) {
    return a;
  }
  c.prototype.b = function(h) {
    if (null == this.a) {
      this.a = [];
      var l = this;
      this.c(function() {
        l.j();
      });
    }
    this.a.push(h);
  };
  var e = m.global.setTimeout;
  c.prototype.c = function(h) {
    e(h, 0);
  };
  c.prototype.j = function() {
    for (; this.a && this.a.length;) {
      var h = this.a;
      this.a = [];
      for (var l = 0; l < h.length; ++l) {
        var f = h[l];
        h[l] = null;
        try {
          f();
        } catch (k) {
          this.g(k);
        }
      }
    }
    this.a = null;
  };
  c.prototype.g = function(h) {
    this.c(function() {
      throw h;
    });
  };
  b.prototype.c = function() {
    function h(k) {
      return function(n) {
        f || (f = !0, k.call(l, n));
      };
    }
    var l = this, f = !1;
    return {resolve:h(this.Ca), reject:h(this.g)};
  };
  b.prototype.Ca = function(h) {
    if (h === this) {
      this.g(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (h instanceof b) {
        this.Da(h);
      } else {
        a: {
          switch(typeof h) {
            case "object":
              var l = null != h;
              break a;
            case "function":
              l = !0;
              break a;
            default:
              l = !1;
          }
        }
        l ? this.xa(h) : this.l(h);
      }
    }
  };
  b.prototype.xa = function(h) {
    var l = void 0;
    try {
      l = h.then;
    } catch (f) {
      this.g(f);
      return;
    }
    "function" == typeof l ? this.Fa(l, h) : this.l(h);
  };
  b.prototype.g = function(h) {
    this.v(2, h);
  };
  b.prototype.l = function(h) {
    this.v(1, h);
  };
  b.prototype.v = function(h, l) {
    if (0 != this.b) {
      throw Error("Cannot settle(" + h + ", " + l + "): Promise already settled in state" + this.b);
    }
    this.b = h;
    this.j = l;
    this.H();
  };
  b.prototype.H = function() {
    if (null != this.a) {
      for (var h = 0; h < this.a.length; ++h) {
        g.b(this.a[h]);
      }
      this.a = null;
    }
  };
  var g = new c;
  b.prototype.Da = function(h) {
    var l = this.c();
    h.F(l.resolve, l.reject);
  };
  b.prototype.Fa = function(h, l) {
    var f = this.c();
    try {
      h.call(l, f.resolve, f.reject);
    } catch (k) {
      f.reject(k);
    }
  };
  b.prototype.then = function(h, l) {
    function f(r, q) {
      return "function" == typeof r ? function(t) {
        try {
          k(r(t));
        } catch (u) {
          n(u);
        }
      } : q;
    }
    var k, n, p = new b(function(r, q) {
      k = r;
      n = q;
    });
    this.F(f(h, k), f(l, n));
    return p;
  };
  b.prototype.catch = function(h) {
    return this.then(void 0, h);
  };
  b.prototype.F = function(h, l) {
    function f() {
      switch(k.b) {
        case 1:
          h(k.j);
          break;
        case 2:
          l(k.j);
          break;
        default:
          throw Error("Unexpected state: " + k.b);
      }
    }
    var k = this;
    null == this.a ? g.b(f) : this.a.push(f);
  };
  b.resolve = d;
  b.reject = function(h) {
    return new b(function(l, f) {
      f(h);
    });
  };
  b.race = function(h) {
    return new b(function(l, f) {
      for (var k = m.f(h), n = k.next(); !n.done; n = k.next()) {
        d(n.value).F(l, f);
      }
    });
  };
  b.all = function(h) {
    var l = m.f(h), f = l.next();
    return f.done ? d([]) : new b(function(k, n) {
      function p(t) {
        return function(u) {
          r[t] = u;
          q--;
          0 == q && k(r);
        };
      }
      var r = [], q = 0;
      do {
        r.push(void 0), q++, d(f.value).F(p(r.length - 1), n), f = l.next();
      } while (!f.done);
    });
  };
  return b;
});
m.ga = "jscomp_symbol_";
m.R = function() {
  m.R = function() {
  };
  m.global.Symbol || (m.global.Symbol = m.Symbol);
};
function aa(a, b) {
  this.a = a;
  m.defineProperty(this, "description", {configurable:!0, writable:!0, value:b});
}
aa.prototype.toString = function() {
  return this.a;
};
m.Symbol = function() {
  function a(c) {
    if (this instanceof a) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new aa(m.ga + (c || "") + "_" + b++, c);
  }
  var b = 0;
  return a;
}();
m.C = function() {
  m.R();
  var a = m.global.Symbol.iterator;
  a || (a = m.global.Symbol.iterator = m.global.Symbol("Symbol.iterator"));
  "function" != typeof Array.prototype[a] && m.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return m.ca(m.X(this));
  }});
  m.C = function() {
  };
};
m.va = function() {
  m.R();
  var a = m.global.Symbol.asyncIterator;
  a || (a = m.global.Symbol.asyncIterator = m.global.Symbol("Symbol.asyncIterator"));
  m.va = function() {
  };
};
m.ca = function(a) {
  m.C();
  a = {next:a};
  a[m.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
m.N = {};
m.N.pa = function(a) {
  if (!(a instanceof Object)) {
    throw new TypeError("Iterator result " + a + " is not an object");
  }
};
function w() {
  this.l = !1;
  this.c = null;
  this.b = void 0;
  this.a = 1;
  this.H = this.j = 0;
  this.g = null;
}
function x(a) {
  if (a.l) {
    throw new TypeError("Generator is already running");
  }
  a.l = !0;
}
w.prototype.v = function(a) {
  this.b = a;
};
function y(a, b) {
  a.g = {aa:b, wa:!0};
  a.a = a.j || a.H;
}
w.prototype.return = function(a) {
  this.g = {return:a};
  this.a = this.H;
};
function z(a, b, c) {
  a.a = c;
  return {value:b};
}
function ba(a, b) {
  a.a = b;
  a.j = 0;
}
function ca(a) {
  a.j = 0;
  var b = a.g.aa;
  a.g = null;
  return b;
}
function da(a) {
  this.a = new w;
  this.b = a;
}
function ea(a, b) {
  x(a.a);
  var c = a.a.c;
  if (c) {
    return A(a, "return" in c ? c["return"] : function(d) {
      return {value:d, done:!0};
    }, b, a.a.return);
  }
  a.a.return(b);
  return C(a);
}
function A(a, b, c, d) {
  try {
    var e = b.call(a.a.c, c);
    m.N.pa(e);
    if (!e.done) {
      return a.a.l = !1, e;
    }
    var g = e.value;
  } catch (h) {
    return a.a.c = null, y(a.a, h), C(a);
  }
  a.a.c = null;
  d.call(a.a, g);
  return C(a);
}
function C(a) {
  for (; a.a.a;) {
    try {
      var b = a.b(a.a);
      if (b) {
        return a.a.l = !1, {value:b.value, done:!1};
      }
    } catch (c) {
      a.a.b = void 0, y(a.a, c);
    }
  }
  a.a.l = !1;
  if (a.a.g) {
    b = a.a.g;
    a.a.g = null;
    if (b.wa) {
      throw b.aa;
    }
    return {value:b.return, done:!0};
  }
  return {value:void 0, done:!0};
}
function fa(a) {
  this.next = function(b) {
    x(a.a);
    a.a.c ? b = A(a, a.a.c.next, b, a.a.v) : (a.a.v(b), b = C(a));
    return b;
  };
  this.throw = function(b) {
    x(a.a);
    a.a.c ? b = A(a, a.a.c["throw"], b, a.a.v) : (y(a.a, b), b = C(a));
    return b;
  };
  this.return = function(b) {
    return ea(a, b);
  };
  m.C();
  this[Symbol.iterator] = function() {
    return this;
  };
}
m.N.Ja = function(a, b) {
  b = new fa(new da(b));
  m.setPrototypeOf && m.setPrototypeOf(b, a.prototype);
  return b;
};
m.Y = function(a) {
  function b(d) {
    return a.next(d);
  }
  function c(d) {
    return a.throw(d);
  }
  return new Promise(function(d, e) {
    function g(h) {
      h.done ? d(h.value) : Promise.resolve(h.value).then(b, c).then(g, e);
    }
    g(a.next());
  });
};
m.Ia = function(a) {
  return m.Y(a());
};
m.A = function(a) {
  return m.Y(new fa(new da(a)));
};
m.o("Object.is", function(a) {
  return a ? a : function(b, c) {
    return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c;
  };
});
m.o("Array.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    var d = this;
    d instanceof String && (d = String(d));
    var e = d.length;
    c = c || 0;
    for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
      var g = d[c];
      if (g === b || Object.is(g, b)) {
        return !0;
      }
    }
    return !1;
  };
});
m.L = function(a, b, c) {
  if (null == a) {
    throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
  }
  if (b instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
  }
  return a + "";
};
m.o("String.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    return -1 !== m.L(this, b, "includes").indexOf(b, c || 0);
  };
});
m.Ka = function(a, b) {
  m.C();
  a instanceof String && (a += "");
  var c = 0, d = {next:function() {
    if (c < a.length) {
      var e = c++;
      return {value:b(e, a[e]), done:!1};
    }
    d.next = function() {
      return {done:!0, value:void 0};
    };
    return d.next();
  }};
  d[Symbol.iterator] = function() {
    return d;
  };
  return d;
};
m.m = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
m.assign = "function" == typeof Object.assign ? Object.assign : function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var d = arguments[c];
    if (d) {
      for (var e in d) {
        m.m(d, e) && (a[e] = d[e]);
      }
    }
  }
  return a;
};
m.o("Object.assign", function(a) {
  return a || m.assign;
});
m.o("String.prototype.repeat", function(a) {
  return a ? a : function(b) {
    var c = m.L(this, null, "repeat");
    if (0 > b || 1342177279 < b) {
      throw new RangeError("Invalid count value");
    }
    b |= 0;
    for (var d = ""; b;) {
      if (b & 1 && (d += c), b >>>= 1) {
        c += c;
      }
    }
    return d;
  };
});
m.o("String.prototype.endsWith", function(a) {
  return a ? a : function(b, c) {
    var d = m.L(this, b, "endsWith");
    void 0 === c && (c = d.length);
    c = Math.max(0, Math.min(c | 0, d.length));
    for (var e = b.length; 0 < e && 0 < c;) {
      if (d[--c] != b[--e]) {
        return !1;
      }
    }
    return 0 >= e;
  };
});
m.ma = function() {
  try {
    var a = {}, b = Object.create(new m.global.Proxy(a, {get:function(c, d, e) {
      return c == a && "q" == d && e == b;
    }}));
    return !0 === b.q;
  } catch (c) {
    return !1;
  }
};
m.I = !1;
m.W = m.I && m.ma();
m.o("WeakMap", function(a) {
  function b(f) {
    this.a = (l += Math.random() + 1).toString();
    if (f) {
      f = m.f(f);
      for (var k; !(k = f.next()).done;) {
        k = k.value, this.set(k[0], k[1]);
      }
    }
  }
  function c() {
    if (!a || !Object.seal) {
      return !1;
    }
    try {
      var f = Object.seal({}), k = Object.seal({}), n = new a([[f, 2], [k, 3]]);
      if (2 != n.get(f) || 3 != n.get(k)) {
        return !1;
      }
      n.delete(f);
      n.set(k, 4);
      return !n.has(f) && 4 == n.get(k);
    } catch (p) {
      return !1;
    }
  }
  function d() {
  }
  function e(f) {
    if (!m.m(f, h)) {
      var k = new d;
      m.defineProperty(f, h, {value:k});
    }
  }
  function g(f) {
    var k = Object[f];
    k && (Object[f] = function(n) {
      if (n instanceof d) {
        return n;
      }
      e(n);
      return k(n);
    });
  }
  if (m.I) {
    if (a && m.W) {
      return a;
    }
  } else {
    if (c()) {
      return a;
    }
  }
  var h = "$jscomp_hidden_" + Math.random();
  g("freeze");
  g("preventExtensions");
  g("seal");
  var l = 0;
  b.prototype.set = function(f, k) {
    e(f);
    if (!m.m(f, h)) {
      throw Error("WeakMap key fail: " + f);
    }
    f[h][this.a] = k;
    return this;
  };
  b.prototype.get = function(f) {
    return m.m(f, h) ? f[h][this.a] : void 0;
  };
  b.prototype.has = function(f) {
    return m.m(f, h) && m.m(f[h], this.a);
  };
  b.prototype.delete = function(f) {
    return m.m(f, h) && m.m(f[h], this.a) ? delete f[h][this.a] : !1;
  };
  return b;
});
m.o("Map", function(a) {
  function b() {
    var f = {};
    return f.s = f.next = f.head = f;
  }
  function c(f, k) {
    var n = f.a;
    return m.ca(function() {
      if (n) {
        for (; n.head != f.a;) {
          n = n.s;
        }
        for (; n.next != n.head;) {
          return n = n.next, {done:!1, value:k(n)};
        }
        n = null;
      }
      return {done:!0, value:void 0};
    });
  }
  function d(f, k) {
    var n = k && typeof k;
    "object" == n || "function" == n ? h.has(k) ? n = h.get(k) : (n = "" + ++l, h.set(k, n)) : n = "p_" + k;
    var p = f.b[n];
    if (p && m.m(f.b, n)) {
      for (f = 0; f < p.length; f++) {
        var r = p[f];
        if (k !== k && r.key !== r.key || k === r.key) {
          return {id:n, list:p, index:f, i:r};
        }
      }
    }
    return {id:n, list:p, index:-1, i:void 0};
  }
  function e(f) {
    this.b = {};
    this.a = b();
    this.size = 0;
    if (f) {
      f = m.f(f);
      for (var k; !(k = f.next()).done;) {
        k = k.value, this.set(k[0], k[1]);
      }
    }
  }
  function g() {
    if (m.ea || !a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) {
      return !1;
    }
    try {
      var f = Object.seal({x:4}), k = new a(m.f([[f, "s"]]));
      if ("s" != k.get(f) || 1 != k.size || k.get({x:4}) || k.set({x:4}, "t") != k || 2 != k.size) {
        return !1;
      }
      var n = k.entries(), p = n.next();
      if (p.done || p.value[0] != f || "s" != p.value[1]) {
        return !1;
      }
      p = n.next();
      return p.done || 4 != p.value[0].x || "t" != p.value[1] || !n.next().done ? !1 : !0;
    } catch (r) {
      return !1;
    }
  }
  if (m.I) {
    if (a && m.W) {
      return a;
    }
  } else {
    if (g()) {
      return a;
    }
  }
  m.C();
  var h = new WeakMap;
  e.prototype.set = function(f, k) {
    f = 0 === f ? 0 : f;
    var n = d(this, f);
    n.list || (n.list = this.b[n.id] = []);
    n.i ? n.i.value = k : (n.i = {next:this.a, s:this.a.s, head:this.a, key:f, value:k}, n.list.push(n.i), this.a.s.next = n.i, this.a.s = n.i, this.size++);
    return this;
  };
  e.prototype.delete = function(f) {
    f = d(this, f);
    return f.i && f.list ? (f.list.splice(f.index, 1), f.list.length || delete this.b[f.id], f.i.s.next = f.i.next, f.i.next.s = f.i.s, f.i.head = null, this.size--, !0) : !1;
  };
  e.prototype.clear = function() {
    this.b = {};
    this.a = this.a.s = b();
    this.size = 0;
  };
  e.prototype.has = function(f) {
    return !!d(this, f).i;
  };
  e.prototype.get = function(f) {
    return (f = d(this, f).i) && f.value;
  };
  e.prototype.entries = function() {
    return c(this, function(f) {
      return [f.key, f.value];
    });
  };
  e.prototype.keys = function() {
    return c(this, function(f) {
      return f.key;
    });
  };
  e.prototype.values = function() {
    return c(this, function(f) {
      return f.value;
    });
  };
  e.prototype.forEach = function(f, k) {
    for (var n = this.entries(), p; !(p = n.next()).done;) {
      p = p.value, f.call(k, p[1], p[0], this);
    }
  };
  e.prototype[Symbol.iterator] = e.prototype.entries;
  var l = 0;
  return e;
});
var ha = _module;
var D = path, ia = D.basename, ja = D.dirname, ka = D.extname, la = D.join, ma = D.resolve;
/*

 James Talmage <james@talmage.io> (github.com/jamestalmage)
*/
var na = /^(?:.*[\\/])?node_modules(?:[\\/].*)?$/;
/*

 (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org
*/
var E = 1 < module.constructor.length ? module.constructor : ha;
function oa(a, b, c, d) {
  if ("string" != typeof a || !b.includes(ka(a))) {
    return !1;
  }
  a = ma(a);
  return d && na.test(a) ? !1 : c && "function" == typeof c ? !!c(a) : !0;
}
function pa(a, b) {
  b = void 0 === b ? {} : b;
  var c = void 0 === b.exts ? [".js"] : b.exts, d = void 0 === b.ignoreNodeModules ? !0 : b.ignoreNodeModules, e = void 0 === b.matcher ? null : b.matcher, g = Array.isArray(c) ? c : [c], h = !1, l = {}, f = {}, k = E._extensions[".js"];
  g.forEach(function(n) {
    if ("string" != typeof n) {
      throw new TypeError("Invalid Extension: " + n);
    }
    var p = E._extensions[n] || k;
    f[n] = p;
    l[n] = E._extensions[n] = function(r, q) {
      if (!h && oa(q, g, e, d)) {
        var t = r._compile;
        r._compile = function(u) {
          r._compile = t;
          u = a(u, q);
          if ("string" != typeof u) {
            throw Error("[Pirates] A hook returned a non-string, or nothing at all! This is a violation of intergalactic law!\n--------------------\nIf you have no idea what this means or what Pirates is, let me explain: Pirates is a module that makes is easy to implement require hooks. One of the require hooks you're using uses it. One of these require hooks didn't return anything from it's handler, so we don't know what to do. You might want to debug this.");
          }
          return r._compile(u, q);
        };
      }
      p(r, q);
    };
  });
  return function() {
    h || (h = !0, g.forEach(function(n) {
      E._extensions[n] === l[n] && (E._extensions[n] = f[n]);
    }));
  };
}
;var qa = vm.Script;
function ra(a, b) {
  var c = m.f(a.split("\n"));
  a = c.next().value;
  c.next();
  c = c.next().value;
  a = parseInt(a.replace(/.+?(\d+)$/, function(d, e) {
    return e;
  })) - 1;
  c = c.indexOf("^");
  return b.split("\n").slice(0, a).join("\n").length + c + (a ? 1 : 0);
}
;function sa(a) {
  try {
    new qa(a);
  } catch (d) {
    var b = d, c = b.stack;
    if ("Unexpected token <" != b.message) {
      throw d;
    }
    return ra(c, a);
  }
  return null;
}
;var ta = stream, ua = stream, va = ua.Transform, wa = ua.Writable;
function xa(a) {
  if ("object" != typeof a) {
    return !1;
  }
  var b = a.re instanceof RegExp;
  a = -1 != ["string", "function"].indexOf(typeof a.replacement);
  return b && a;
}
function F(a, b) {
  if (!(b instanceof Error)) {
    throw b;
  }
  a = m.f(a.stack.split("\n", 3));
  a.next();
  a.next();
  a = a.next().value;
  a = b.stack.indexOf(a);
  if (-1 == a) {
    throw b;
  }
  a = b.stack.substr(0, a - 1);
  var c = a.lastIndexOf("\n");
  b.stack = a.substr(0, c);
  throw b;
}
;function H(a, b) {
  function c() {
    var d = this;
    return b.filter(xa).reduce(function(e, g) {
      var h = g.re, l = g.replacement;
      if (d.w) {
        return e;
      }
      if ("string" == typeof l) {
        e = e.replace(h, l);
      } else {
        var f;
        return e.replace(h, function(k, n) {
          for (var p = [], r = 1; r < arguments.length; ++r) {
            p[r - 1] = arguments[r];
          }
          f = Error();
          try {
            return d.w ? k : l.call.apply(l, [d, k].concat(m.h(p)));
          } catch (q) {
            F(f, q);
          }
        });
      }
    }, "" + a);
  }
  c.a = function() {
    c.w = !0;
  };
  return c.call(c);
}
;function ya(a) {
  return new RegExp("%%_RESTREAM_" + a.toUpperCase() + "_REPLACEMENT_(\\d+)_%%", "g");
}
function za(a, b) {
  return "%%_RESTREAM_" + a.toUpperCase() + "_REPLACEMENT_" + b + "_%%";
}
function I(a, b) {
  return Object.keys(a).reduce(function(c, d) {
    var e = {}, g = b || {};
    return Object.assign({}, c, (e[d] = {name:d, re:a[d], regExp:(void 0 === g.getRegex ? ya : g.getRegex)(d), getReplacement:void 0 === g.getReplacement ? za : g.getReplacement, map:{}, lastIndex:0}, e));
  }, {});
}
function J(a) {
  var b = void 0 === b ? [] : b;
  var c = a.map;
  return {re:a.regExp, replacement:function(d, e) {
    d = c[e];
    delete c[e];
    return H(d, Array.isArray(b) ? b : [b]);
  }};
}
function L(a) {
  var b = a.map, c = a.getReplacement, d = a.name;
  return {re:a.re, replacement:function(e) {
    var g = a.lastIndex;
    b[g] = e;
    a.lastIndex += 1;
    return c(d, g);
  }};
}
;var Aa = os.homedir;
var Ba = /\s+at.*(?:\(|\s)(.*)\)?/, Ca = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, Da = Aa();
function M(a) {
  var b = {}, c = void 0 === b.pretty ? !1 : b.pretty;
  b = (void 0 === b.ignoredModules ? ["pirates"] : b.ignoredModules).join("|");
  var d = new RegExp(Ca.source.replace("IGNORED_MODULES", b));
  return a.replace(/\\/g, "/").split("\n").filter(function(e) {
    e = e.match(Ba);
    if (null === e || !e[1]) {
      return !0;
    }
    e = e[1];
    return e.includes(".app/Contents/Resources/electron.asar") || e.includes(".app/Contents/Resources/default_app.asar") ? !1 : !d.test(e);
  }).filter(function(e) {
    return e.trim();
  }).map(function(e) {
    return c ? e.replace(Ba, function(g, h) {
      return g.replace(h, h.replace(Da, "~"));
    }) : e;
  }).join("\n");
}
;function Ea(a, b) {
  var c = Error().stack;
  a = void 0 === a ? 0 : a;
  b = void 0 === b ? !1 : b;
  if (0 === a && !b) {
    return c;
  }
  c = c.split("\n", b ? a + 1 : void 0);
  return b ? c[c.length - 1] : c.slice(a).join("\n");
}
;function Fa(a, b, c) {
  c = void 0 === c ? !1 : c;
  return function(d) {
    var e = arguments.callee.caller;
    var g = Ea(2, !0);
    var h = d instanceof Error, l = h ? d.message : d;
    e = ["Error: " + l].concat(m.h(null !== e && a === e || c ? [b] : [g, b])).join("\n");
    e = M(e);
    return Object.assign(h ? d : Error(), {message:l, stack:e});
  };
}
;function Ga(a) {
  var b = arguments.callee.caller;
  var c = Ea(2 + ((void 0 === a ? 0 : a) ? 1 : 0));
  return Fa(b, c, a);
}
;function Ha(a, b) {
  b.once("error", function(c) {
    a.emit("error", c);
  });
  return b;
}
;var Ia = ["", ""];
Ia.raw = Ia.slice();
var Ja = ["", ""];
Ja.raw = Ja.slice();
function N(a) {
  var b = a || {}, c = Object.assign({}, b), d = void 0 === b.binary ? !1 : b.binary, e = void 0 === b.rs ? null : b.rs;
  b = (delete c.binary, delete c.rs, c);
  a = a || {};
  var g = void 0 === a.$ ? Ga(!0) : a.$, h = a.proxyError;
  var l = wa.call(this, b) || this;
  l.a = [];
  l.ha = new Promise(function(f, k) {
    l.on("finish", function() {
      var n;
      d ? n = Buffer.concat(l.a) : n = l.a.join("");
      f(n);
      l.a = [];
    });
    l.once("error", function(n) {
      if (-1 == n.stack.indexOf("\n")) {
        g(n);
      } else {
        var p = M(n.stack);
        n.stack = p;
        h && g(n);
      }
      k(n);
    });
    e && Ha(l, e).pipe(l);
  });
  return l;
}
m.P(N, wa);
N.prototype._write = function(a, b, c) {
  this.a.push(a);
  c();
};
m.global.Object.defineProperties(N.prototype, {b:{configurable:!0, enumerable:!0, get:function() {
  return this.ha;
}}});
function Ka(a) {
  var b = void 0 === b ? {} : b;
  var c, d, e;
  return m.A(function(g) {
    if (1 == g.a) {
      return c = new N(Object.assign({}, {rs:a}, b, {$:Ga(!0)})), d = c.b, z(g, d, 2);
    }
    e = g.b;
    return g.return(e);
  });
}
;function O(a, b) {
  var c = va.call(this, b) || this;
  a = (Array.isArray(a) ? a : [a]).filter(xa);
  c.rules = a;
  c.w = !1;
  c.a = b;
  return c;
}
m.P(O, va);
O.prototype.replace = function(a, b) {
  var c = this, d, e;
  return m.A(function(g) {
    if (1 == g.a) {
      return d = new O(c.rules, c.a), b && Object.assign(d, b), z(g, La(d, a), 2);
    }
    e = g.b;
    d.w && (c.w = !0);
    b && Object.keys(b).forEach(function(h) {
      b[h] = d[h];
    });
    return g.return(e);
  });
};
function La(a, b) {
  var c;
  return m.A(function(d) {
    if (1 == d.a) {
      return b instanceof ta ? b.pipe(a) : a.end(b), z(d, Ka(a), 2);
    }
    c = d.b;
    return d.return(c);
  });
}
O.prototype.reduce = function(a) {
  var b = this, c;
  return m.A(function(d) {
    if (1 == d.a) {
      return z(d, b.rules.reduce(function(e, g) {
        var h = g.re, l = g.replacement, f, k, n, p, r, q;
        return m.A(function(t) {
          switch(t.a) {
            case 1:
              return z(t, e, 2);
            case 2:
              f = t.b;
              if (b.w) {
                return t.return(f);
              }
              if ("string" == typeof l) {
                f = f.replace(h, l);
                t.a = 3;
                break;
              }
              k = [];
              p = f.replace(h, function(u, v) {
                for (var K = [], B = 1; B < arguments.length; ++B) {
                  K[B - 1] = arguments[B];
                }
                n = Error();
                try {
                  if (b.w) {
                    return k.length ? k.push(Promise.resolve(u)) : u;
                  }
                  var G = l.call.apply(l, [b, u].concat(m.h(K)));
                  G instanceof Promise && k.push(G);
                  return G;
                } catch (T) {
                  F(n, T);
                }
              });
              if (!k.length) {
                f = p;
                t.a = 3;
                break;
              }
              t.j = 5;
              return z(t, Promise.all(k), 7);
            case 7:
              r = t.b;
              f = f.replace(h, function() {
                return r.shift();
              });
              ba(t, 3);
              break;
            case 5:
              q = ca(t), F(n, q);
            case 3:
              return t.return(f);
          }
        });
      }, "" + a), 2);
    }
    c = d.b;
    return d.return(c);
  });
};
O.prototype._transform = function(a, b, c) {
  var d = this, e, g, h;
  return m.A(function(l) {
    if (1 == l.a) {
      return l.j = 2, z(l, d.reduce(a), 4);
    }
    if (2 != l.a) {
      return e = l.b, d.push(e), c(), ba(l, 0);
    }
    g = ca(l);
    h = M(g.stack);
    g.stack = h;
    c(g);
    l.a = 0;
  });
};
function Ma(a) {
  a = m.f(/<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || []);
  a.next();
  return a.next().value;
}
function P(a) {
  var b = 0, c = [], d;
  H(a, [{re:/[{}]/g, replacement:function(k, n) {
    k = "}" == k;
    var p = !k;
    if (!b && k) {
      throw Error("A closing } is found without opening one.");
    }
    b += p ? 1 : -1;
    1 == b && p ? d = {open:n} : 0 == b && k && (d.close = n, c.push(d), d = {});
  }}]);
  if (b) {
    throw Error("Unbalanced props (level " + b + ") " + a);
  }
  var e = {}, g = [], h = {}, l = c.reduce(function(k, n) {
    var p = n.open;
    n = n.close;
    var r = a.slice(k, p), q = m.f(/(\s*)(\S+)(\s*)=(\s*)$/.exec(r) || []);
    q.next();
    var t = q.next().value;
    k = q.next().value;
    var u = q.next().value;
    q = q.next().value;
    p = a.slice(p + 1, n);
    if (!k && !/\s*\.\.\./.test(p)) {
      throw Error("Could not detect prop name");
    }
    k ? e[k] = p : g.push(p);
    h[k] = {before:t, K:u, J:q};
    p = r || "";
    p = p.slice(0, p.length - (k || "").length - 1);
    p = Q(p);
    k = p.D;
    Object.assign(e, p.U);
    Object.assign(h, k);
    return n + 1;
  }, 0);
  if (c.length) {
    l = a.slice(l);
    l = Q(l);
    var f = l.D;
    Object.assign(e, l.U);
    Object.assign(h, f);
  } else {
    l = Q(a), f = l.D, Object.assign(e, l.U), Object.assign(h, f);
  }
  return {S:e, M:g, D:h};
}
function Q(a) {
  var b = [], c = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]+?)\5/g, function(d, e, g, h, l, f, k, n) {
    c[g] = {before:e, K:h, J:l};
    b.push({G:n, name:g, da:"" + f + k + f});
    return "%".repeat(d.length);
  }).replace(/(\s*)([^\s%]+)/g, function(d, e, g, h) {
    c[g] = {before:e};
    b.push({G:h, name:g, da:"true"});
  });
  return {U:[].concat(m.h(b.reduce(function(d, e) {
    d[e.G] = [e.name, e.da];
    return d;
  }, []))).filter(Boolean).reduce(function(d, e) {
    var g = m.f(e);
    e = g.next().value;
    g = g.next().value;
    d[e] = g;
    return d;
  }, {}), D:c};
}
function Na(a, b, c, d, e) {
  b = void 0 === b ? [] : b;
  c = void 0 === c ? !1 : c;
  d = void 0 === d ? {} : d;
  e = void 0 === e ? "" : e;
  var g = Object.keys(a);
  return g.length || b.length ? "{" + g.reduce(function(h, l) {
    var f = a[l], k = c || -1 != l.indexOf("-") ? "'" + l + "'" : l, n = d[l] || {};
    l = void 0 === n.before ? "" : n.before;
    var p = void 0 === n.K ? "" : n.K;
    n = void 0 === n.J ? "" : n.J;
    return [].concat(m.h(h), ["" + l + k + p + ":" + n + f]);
  }, b).join(",") + e + "}" : "{}";
}
function Oa(a) {
  a = m.f(void 0 === a ? "" : a).next().value;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}
function R(a, b, c, d, e, g, h, l) {
  b = void 0 === b ? {} : b;
  c = void 0 === c ? [] : c;
  d = void 0 === d ? [] : d;
  e = void 0 === e ? !1 : e;
  g = void 0 === g ? null : g;
  h = void 0 === h ? {} : h;
  l = void 0 === l ? "" : l;
  var f = Oa(a), k = f ? a : "'" + a + "'";
  if (!Object.keys(b).length && !c.length && !d.length) {
    return "h(" + k + ")";
  }
  var n = f && "dom" == e ? !1 : e;
  f || !d.length || e && "dom" != e || g && g("JSX: destructuring " + d.join(" ") + " is used without quoted props on HTML " + a + ".");
  a = Na(b, d, n, h, l);
  b = c.reduce(function(p, r, q) {
    q = (q = c[q - 1]) && /\S/.test(q) ? "," : "";
    return "" + p + q + r;
  }, "");
  return "h(" + k + "," + a + (b ? "," + b : "") + ")";
}
;function Pa(a, b) {
  b = void 0 === b ? [] : b;
  var c = 0, d;
  a = H(a, [].concat(m.h(b), [{re:/[<>]/g, replacement:function(e, g) {
    if (d) {
      return e;
    }
    var h = "<" == e;
    c += h ? 1 : -1;
    0 == c && !h && (d = g);
    return e;
  }}]));
  if (c) {
    throw Error(1);
  }
  return {Ba:a, Z:d};
}
function S(a) {
  var b = Ma(a), c = I({la:/=>/g}).la;
  try {
    var d = Pa(a, [L(c)]);
    var e = d.Ba;
    var g = d.Z;
  } catch (k) {
    if (1 === k) {
      throw Error("Could not find the matching closing > for " + b + ".");
    }
  }
  var h = e.slice(0, g + 1);
  d = h.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(d)) {
    return a = d.replace(/\/\s*>$/, ""), d = "", new U({B:h.replace(c.regExp, "=>"), u:a.replace(c.regExp, "=>"), content:"", tagName:b});
  }
  a = d.replace(/>$/, "");
  d = g + 1;
  g = !1;
  var l = 1, f;
  H(e, [{re:new RegExp("[\\s\\S](?:<\\s*" + b + "(\\s+|>)|/\\s*" + b + "\\s*>)", "g"), replacement:function(k, n, p, r) {
    if (g) {
      return k;
    }
    n = !n && k.endsWith(">");
    var q = !n;
    if (q) {
      r = r.slice(p);
      var t = Pa(r.replace(/^[\s\S]/, " ")).Z;
      r = r.slice(0, t + 1);
      if (/\/\s*>$/.test(r)) {
        return k;
      }
    }
    l += q ? 1 : -1;
    0 == l && n && (g = p, f = g + k.length);
    return k;
  }}]);
  if (l) {
    throw Error("Could not find the matching closing </" + b + ">.");
  }
  d = e.slice(d, g);
  e = e.slice(0, f).replace(c.regExp, "=>");
  return new U({B:e, u:a.replace(c.regExp, "=>"), content:d.replace(c.regExp, "=>"), tagName:b});
}
function U(a) {
  this.B = a.B;
  this.u = a.u;
  this.content = a.content;
  this.tagName = a.tagName;
}
;function V(a) {
  var b = "", c = "";
  a = a.replace(/^(\n\s*)([\s\S]+)?/, function(d, e, g) {
    b = e;
    return void 0 === g ? "" : g;
  }).replace(/([\s\S]+?)?(\n\s*)$/, function(d, e, g) {
    c = void 0 === g ? "" : g;
    return void 0 === e ? "" : e;
  });
  return "" + b + (a ? "`" + a + "`" : "") + c;
}
function Qa(a) {
  var b = [], c = {}, d = 0, e = 0;
  H(a, [{re:/[<{}]/g, replacement:function(g, h) {
    if (!(h < e)) {
      if (/[{}]/.test(g)) {
        d += "{" == g ? 1 : -1, 1 == d && void 0 == c.from ? c.from = h : 0 == d && (c.to = h + 1, c.qa = a.slice(c.from + 1, h), b.push(c), c = {});
      } else {
        if (d) {
          return g;
        }
        g = S(a.slice(h));
        e = h + g.B.length;
        c.ra = g;
        c.to = e;
        c.from = h;
        b.push(c);
        c = {};
      }
    }
  }}, {}]);
  return b.length ? Ra(a, b) : [V(a)];
}
function Ra(a, b) {
  var c = 0;
  b = b.reduce(function(e, g) {
    var h = g.to, l = g.qa, f = g.ra;
    (g = a.slice(c, g.from)) && e.push(V(g));
    c = h;
    l ? e.push(l) : f && e.push(f);
    return e;
  }, []);
  if (c < a.length) {
    var d = a.slice(c, a.length);
    d && b.push(V(d));
  }
  return b;
}
;function Sa(a, b) {
  var c = b = void 0 === b ? {} : b, d = c.quoteProps, e = c.warn;
  c = sa(a);
  if (null === c) {
    return a;
  }
  var g = a.slice(c), h = S(g), l = void 0 === h.u ? "" : h.u, f = h.tagName;
  g = h.B.length;
  h = Ta(h.content, d, e);
  var k = P(l.replace(/^ */, "")), n = k.S, p = k.M;
  k = k.D;
  l = /\s*$/.exec(l) || [""];
  e = R(f, n, h, p, d, e, k, l);
  d = a.slice(0, c);
  a = a.slice(c + g);
  c = g - e.length;
  g = e;
  0 < c && (g = " ".repeat(c) + g);
  return Sa(d + g + a, b);
}
function Ta(a, b, c) {
  b = void 0 === b ? !1 : b;
  c = void 0 === c ? null : c;
  return a ? Qa(a).reduce(function(d, e) {
    if (e instanceof U) {
      var g = e.content, h = e.tagName, l = P(void 0 === e.u ? "" : e.u);
      e = l.S;
      l = l.M;
      g = Ta(g, b, c);
      e = R(h, e, g, l, b, c);
      return [].concat(m.h(d), [e]);
    }
    if (h = sa(e)) {
      g = e.slice(h);
      var f = S(g);
      g = f.B.length;
      var k = f.content;
      l = f.tagName;
      var n = P(void 0 === f.u ? "" : f.u);
      f = n.S;
      n = n.M;
      k = Ta(k, b, c);
      l = R(l, f, k, n, b, c);
      k = e.slice(0, h);
      e = e.slice(h + g);
      return [].concat(m.h(d), ["" + k + l + e]);
    }
    return [].concat(m.h(d), [e]);
  }, []) : [];
}
;function Ua(a) {
  var b = void 0 === b ? {} : b;
  var c = I({na:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, oa:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg, G:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, ta:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, ua:/^ *import\s+['"].+['"]/gm}, {getReplacement:function(f, k) {
    return "/*%%_RESTREAM_" + f.toUpperCase() + "_REPLACEMENT_" + k + "_%%*/";
  }, getRegex:function(f) {
    return new RegExp("/\\*%%_RESTREAM_" + f.toUpperCase() + "_REPLACEMENT_(\\d+)_%%\\*/", "g");
  }}), d = c.e, e = c.na, g = c.oa, h = c.G, l = c.ta;
  c = c.ua;
  a = H(a, [L(g), L(e), L(d), L(h), L(l), L(c)]);
  b = Sa(a, b);
  return H(b, [J(g), J(e), J(d), J(h), J(l), J(c)]);
}
;var Va = /\/\*(?:[\s\S]+?)\*\//g, Wa = /\/\/(.+)/gm;
function Xa(a) {
  a = void 0 === a ? [] : a;
  var b = I({comments:Va, inlineComments:Wa, strings:/(["'])(.*?)\1/gm, literals:/`([\s\S]*?)`/gm, escapes:/\\[\\`'"/]/g, regexes:/\/(.+?)\//gm, regexGroups:/\[(.*?)\]/gm}), c = b.comments, d = b.inlineComments, e = b.strings, g = b.literals, h = b.escapes, l = b.regexes;
  b = b.regexGroups;
  var f = [c, d, e, g, h, l, b], k = m.f(f.map(L)), n = k.next().value, p = k.next().value, r = k.next().value, q = k.next().value, t = k.next().value, u = k.next().value;
  k = k.next().value;
  var v = m.f(f.map(function(rb) {
    return J(rb);
  }));
  f = v.next().value;
  var K = v.next().value, B = v.next().value, G = v.next().value, T = v.next().value, sb = v.next().value;
  v = v.next().value;
  return {rules:[t, n, p, r, k, u, q].concat(m.h(a), [G, sb, v, B, K, f, T]), markers:{literals:g, strings:e, comments:c, inlineComments:d, escapes:h, regexes:l, regexGroups:b}};
}
;function Ya(a) {
  return "if (" + a + " && " + a + ".__esModule) " + a + " = " + a + ".default";
}
function Za(a, b, c, d) {
  d = void 0 === d ? null : d;
  return "" + a.replace(/(\s+)from(\s+)([\s\S])*/, function(e, g, h) {
    return g + "=" + h;
  }) + (d ? d : "r" + ("equire(" + b + c + b + ")"));
}
function $a(a, b) {
  b = void 0 === b ? {} : b;
  if (!b.import) {
    return a;
  }
  b = b.import.replacement;
  if (!b) {
    return a;
  }
  var c = b.to;
  if (void 0 === b.from) {
    throw Error('No "from" option is given for the replacement.');
  }
  if (void 0 === c) {
    throw Error('No "to" option is given for the replacement.');
  }
  return a.replace(new RegExp(b.from), b.to);
}
var ab = /(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%|%%_RESTREAM_LITERALS_REPLACEMENT_(\d+)_%%)/;
function bb(a) {
  a = void 0 === a ? {import:{}} : a;
  try {
    return "always" == a.import.esCheck;
  } catch (b) {
    return !1;
  }
}
;function cb(a) {
  return a.replace(/(\s+)as(\s+)/g, function(b, c, d) {
    return (1 == c.split("\n").length ? "" : c) + ":" + d;
  });
}
function db(a, b, c, d, e) {
  if (!a) {
    return {};
  }
  c = b ? {d:b + " = " + ("r" + ("equire(" + c + d + c + ")")), O:Ya(b)} : void 0;
  b = c.O;
  c = c.d;
  a = a.replace(",", "").replace(/([^\s]+)/, c);
  return {t:(e ? "const" : "let") + a, O:b};
}
function eb(a, b, c, d, e) {
  if (!a) {
    return null;
  }
  b = Za(b, c, d, e);
  return "const" + cb(a) + b;
}
;var fb = [{re:new RegExp(/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?/.source + ab.source, "gm"), replacement:function(a, b, c, d, e, g, h) {
  var l = this;
  g = m.f(/(["'`])(.+?)\1/.exec(h ? this.markers.literals.map[h] : this.markers.strings.map[g]));
  g.next();
  a = g.next().value;
  g = g.next().value.replace(this.markers.regexes.regExp, function(k, n) {
    return l.markers.regexes.map[n];
  });
  h = $a(g, this.config);
  g = /^[./]/.test(h) && !bb(this.config);
  var f = db(b, c, a, h, g);
  b = f.t;
  f = f.O;
  c = eb(d, e, a, h, c);
  return [b, c].concat(m.h(g ? [] : [f])).filter(function(k) {
    return k;
  }).join("; ") + ";";
}}, {re:new RegExp(/( *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+(.+?))/.source + ab.source, "gm"), replacement:function(a, b, c, d, e, g, h) {
  a = m.f(/(["'`])(.+?)\1/.exec(h ? this.markers.literals.map[h] : this.markers.strings.map[g]));
  a.next();
  g = a.next().value;
  a = a.next().value;
  e = Za(e, g, a);
  b = "\n".repeat(b.split("\n").length - 1);
  a = /^[./]/.test(a) && !bb(this.config);
  return (c ? [b + (a ? "const" : "let") + " " + d + " = " + c + e].concat(m.h(a ? [] : [Ya(c)])).join("; ") : b + "const " + d + e) + ";";
}}];
var gb = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|await|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/, hb = /(?:[$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D])(?:[$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*/;
function ib(a) {
  return a.split(/,\s*/).filter(function(b) {
    return b;
  });
}
function jb(a) {
  return a.reduce(function(b, c) {
    var d = m.f(c.split(/\s+as\s+/));
    c = d.next().value;
    d = d.next().value;
    var e = {};
    return Object.assign({}, b, (e[(void 0 === d ? c : d).trim()] = c.trim(), e));
  }, {});
}
function kb(a) {
  a.replace(gb, function() {
    throw Error('Detected reserved identifier "' + a + '".');
  });
}
function W(a, b) {
  return void 0 === b || b ? "\n".repeat(a.split("\n").length - 1) : a.split("\n").map(function(c, d, e) {
    c = c.length;
    return d == e.length - 1 ? " ".repeat(c) : "";
  }).join("\n");
}
;function lb(a, b, c) {
  return "" + a.replace(/(\s+)from(\s+)([\s\S])*/, function(d, e, g) {
    return e + "=" + g;
  }) + ("r" + ("equire(" + b + c + b + ");"));
}
function mb(a, b, c, d, e) {
  a = W(a);
  var g = "$" + b.replace(/[-/]/g, "_").replace(/[^\w\d-]/g, "");
  b = lb(c, d, b);
  b = a + "const " + g + b;
  e = ib(e).reduce(function(h, l) {
    var f = m.f(l.split(/\s+as\s+/));
    l = f.next().value;
    f = f.next().value;
    l = l.trim();
    h[(f ? f.trim() : null) || l] = "default" == l ? g : g + "." + l;
    return h;
  }, {});
  this.emit("export", e);
  return b;
}
;function nb(a) {
  var b = a = void 0 === a ? {} : a, c = Object.assign({}, b);
  b = b["default"];
  c = (delete c["default"], c);
  b = b ? "module.exports = " + b : "";
  c = Object.keys(c).map(function(d) {
    return "module.exports." + d + " = " + a[d];
  });
  return [b].concat(m.h(c)).filter(function(d) {
    return d;
  }).join("\n");
}
;var ob = [{re:/[\s\S]*/, replacement:function(a) {
  var b = this;
  this.exports = {};
  this.on("export", function(c) {
    b.exports = Object.assign({}, b.exports, c);
  });
  return a;
}}, {re:new RegExp("^( *export\\s+?)( *" + /(?:let|const|var|class|function\s*\*?|async +function)/.source + "\\s+((?:" + hb.source + "\\s*,?\\s*)+))", "gm"), replacement:function(a, b, c, d) {
  var e = this;
  d.split(/,\s*/).forEach(function(g) {
    g = g.trim().replace(/\s+extends\s+.+/, "");
    kb(g);
    var h = {};
    e.emit("export", (h[g] = g, h));
  });
  return "" + W(b, !1) + c;
}}, {re:new RegExp(/^( *export\s+{([^}]+?)})/.source + /(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%|%%_RESTREAM_LITERALS_REPLACEMENT_(\d+)_%%)/.source, "gm"), replacement:function(a, b, c, d, e, g) {
  e = m.f(/(["'`])(.+?)\1/.exec(g ? this.markers.literals.map[g] : this.markers.strings.map[e]));
  e.next();
  a = e.next().value;
  e = e.next().value;
  return mb.call(this, b, e, d, a, c);
}}, {re:/^( *export\s+{([^}]+?)} *)(\n?)/gm, replacement:function(a, b, c, d) {
  a = ib(c);
  a = jb(a);
  this.emit("export", a);
  return "" + W(b) + (d ? d : "");
}}, {re:new RegExp("^( *export\\s+default\\s+?)( *" + /(?:class|function\s*\*?|async +function)/.source + "\\s+(" + hb.source + "))", "m"), replacement:function(a, b, c, d) {
  a = d.trim();
  kb(a);
  this.emit("export", {"default":a});
  return "" + W(b, !1) + c;
}}, {re:/^( *)(export\s+)(default\s+)/m, replacement:function(a, b, c, d) {
  a = c.replace(/export ?/, "module.");
  d = d.replace(/default ?/, "exports=");
  return "" + b + a + d;
}}, {re:/[\s\S]*/, replacement:function(a) {
  var b = nb(this.exports);
  return "" + a + (b ? "\n\n" + b : "");
}}];
var pb = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function X(a) {
  var b = "";
  a = 0 > a ? (-a << 1) + 1 : a << 1;
  do {
    var c = a & 31;
    a >>>= 5;
    0 < a && (c |= 32);
    if (0 <= c && c < pb.length) {
      c = pb[c];
    } else {
      throw new TypeError("Must be between 0 and 63: " + c);
    }
    b += c;
  } while (0 < a);
  return b;
}
;var Y = url.URL;
function qb(a, b) {
  return a === b ? 0 : null === a ? 1 : null === b ? -1 : a > b ? 1 : -1;
}
function tb(a, b) {
  var c = a.generatedLine - b.generatedLine;
  if (0 !== c) {
    return c;
  }
  c = a.generatedColumn - b.generatedColumn;
  if (0 !== c) {
    return c;
  }
  c = qb(a.source, b.source);
  if (0 !== c) {
    return c;
  }
  c = a.originalLine - b.originalLine;
  if (0 !== c) {
    return c;
  }
  c = a.originalColumn - b.originalColumn;
  return 0 !== c ? c : qb(a.name, b.name);
}
function ub(a) {
  var b = a.split("..").length - 1;
  a: {
    var c = 0;
    do {
      var d = "p" + c++;
      if (-1 === a.indexOf(d)) {
        a = d;
        break a;
      }
    } while (1);
    a = void 0;
  }
  c = "http://host/";
  for (d = 0; d < b; d++) {
    c += a + "/";
  }
  return c;
}
var vb = /^[A-Za-z0-9+\-.]+:/;
function wb(a) {
  return "/" == a[0] ? "/" == a[1] ? "scheme-relative" : "path-absolute" : vb.test(a) ? "absolute" : "path-relative";
}
function xb(a, b) {
  "string" == typeof a && (a = new Y(a));
  "string" == typeof b && (b = new Y(b));
  var c = b.pathname.split("/");
  a = a.pathname.split("/");
  for (0 < a.length && !a[a.length - 1] && a.pop(); 0 < c.length && 0 < a.length && c[0] === a[0];) {
    c.shift(), a.shift();
  }
  return a.map(function() {
    return "..";
  }).concat(c).join("/") + b.search + b.hash;
}
var yb = function(a) {
  return function(b) {
    var c = wb(b), d = ub(b);
    b = new Y(b, d);
    a(b);
    b = b.toString();
    return "absolute" === c ? b : "scheme-relative" === c ? b.slice(5) : "path-absolute" === c ? b.slice(11) : xb(d, b);
  };
}(function() {
});
function zb(a, b) {
  a: {
    if (wb(a) !== wb(b)) {
      var c = null;
    } else {
      c = ub(a + b);
      a = new Y(a, c);
      c = new Y(b, c);
      try {
        new Y("", c.toString());
      } catch (d) {
        c = null;
        break a;
      }
      c = c.protocol !== a.protocol || c.user !== a.user || c.password !== a.password || c.hostname !== a.hostname || c.port !== a.port ? null : xb(a, c);
    }
  }
  return "string" == typeof c ? c : yb(b);
}
;function Z() {
  this.a = [];
  this.b = new Map;
}
Z.prototype.add = function(a, b) {
  b = void 0 === b ? !1 : b;
  var c = this.has(a), d = this.a.length;
  c && !b || this.a.push(a);
  c || this.b.set(a, d);
};
Z.prototype.has = function(a) {
  return this.b.has(a);
};
Z.prototype.indexOf = function(a) {
  var b = this.b.get(a);
  if (0 <= b) {
    return b;
  }
  throw Error('"' + a + '" is not in the set.');
};
function Ab() {
  this.a = [];
  this.b = !0;
  this.c = {generatedLine:-1, generatedColumn:0, name:null, originalColumn:null, originalLine:null, source:null};
}
Ab.prototype.add = function(a) {
  var b = this.c, c = b.generatedLine, d = b.generatedColumn, e = a.generatedLine, g = a.generatedColumn;
  e > c || e == c && g >= d || 0 >= tb(b, a) ? this.c = a : this.b = !1;
  this.a.push(a);
};
function Bb(a) {
  a = void 0 === a ? {} : a;
  var b = a.sourceRoot, c = void 0 === a.skipValidation ? !1 : a.skipValidation;
  this.j = a.file;
  this.b = b;
  this.v = c;
  this.g = new Z;
  this.c = new Z;
  this.l = new Ab;
  this.a = null;
}
function Cb(a, b, c) {
  null != a.b && (b = zb(a.b, b));
  c ? (a.a || (a.a = Object.create(null)), a.a[b] = c) : a.a && (delete a.a[b], 0 === Object.keys(a.a).length && (a.a = null));
}
function Db(a, b, c) {
  return b.map(function(d) {
    if (!this.a) {
      return null;
    }
    c && (d = zb(c, d));
    return Object.prototype.hasOwnProperty.call(this.a, d) ? this.a[d] : null;
  }, a);
}
Bb.prototype.toJSON = function() {
  var a = this.g.a.slice(), b = this.c.a.slice(), c = 0, d = 1, e = 0, g = 0, h = 0, l = 0, f = "";
  var k = this.l;
  k.b || (k.a.sort(tb), k.b = !0);
  var n = k.a;
  for (var p = 0, r = n.length; p < r; p++) {
    var q = n[p];
    k = "";
    if (q.generatedLine !== d) {
      for (c = 0; q.generatedLine !== d;) {
        k += ";", d++;
      }
    } else {
      if (0 < p) {
        if (!tb(q, n[p - 1])) {
          continue;
        }
        k += ",";
      }
    }
    k += X(q.generatedColumn - c);
    c = q.generatedColumn;
    if (null != q.source) {
      var t = this.g.indexOf(q.source);
      k += X(t - l);
      l = t;
      k += X(q.originalLine - 1 - g);
      g = q.originalLine - 1;
      k += X(q.originalColumn - e);
      e = q.originalColumn;
      null != q.name && (q = this.c.indexOf(q.name), k += X(q - h), h = q);
    }
    f += k;
  }
  b = {version:3, sources:a, names:b, mappings:f};
  this.j && (b.file = this.j);
  this.b && (b.sourceRoot = this.b);
  this.a && (b.sourcesContent = Db(this, a, this.b));
  return b;
};
Bb.prototype.toString = function() {
  return JSON.stringify(this.toJSON());
};
function Eb(a) {
  var b = a.za, c = a.Aa, d = new Bb({file:a.file, sourceRoot:a.sourceRoot});
  b.replace(Va, function(e, g) {
    if ("\n" == b[g + e.length]) {
      return "\n".repeat(e.split("\n").length - 1);
    }
    g = e.split("\n");
    e = g.length - 1;
    g = " ".repeat(g[e].length);
    return "\n".repeat(e) + g;
  }).replace(Wa, function(e) {
    return " ".repeat(e.length);
  }).split("\n").forEach(function(e, g) {
    var h = g + 1;
    e.replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, function(l, f) {
      if (0 != f || !/^\s+$/.test(l)) {
        l = {line:h, column:f};
        var k = {ba:l, source:c, T:l};
        l = k.ba;
        f = void 0 === k.T ? null : k.T;
        var n = void 0 === k.source ? null : k.source;
        k = void 0 === k.name ? null : k.name;
        if (!l) {
          throw Error('"generated" is a required argument');
        }
        if (!d.v) {
          if (f && "number" != typeof f.line && "number" != typeof f.column) {
            throw Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
          }
          if (!(l && "line" in l && "column" in l && 0 < l.line && 0 <= l.column && !f && !n && !k || l && "line" in l && "column" in l && f && "line" in f && "column" in f && 0 < l.line && 0 <= l.column && 0 < f.line && 0 <= f.column && n)) {
            throw Error("Invalid mapping: " + JSON.stringify({ba:l, source:n, T:f, name:k}));
          }
        }
        n && (d.g.has(n) || d.g.add(n));
        k && (d.c.has(k) || d.c.add(k));
        d.l.add({generatedLine:l.line, generatedColumn:l.column, originalLine:f ? f.line : null, originalColumn:f ? f.column : null, source:n, name:k});
      }
    });
  });
  Cb(d, c, b);
  return d.toString();
}
;function Fb() {
  var a = {};
  try {
    var b = la(process.cwd(), ".alamoderc.json");
    a = require(b);
  } catch (d) {
    return a;
  }
  b = process.env.ALAMODE_ENV;
  var c = a.env;
  a = c && b in c ? c[b] : a;
  delete a.env;
  return a;
}
function Gb() {
  var a = [].concat(m.h(fb), m.h(ob));
  a = Xa(a);
  return {rules:a.rules, markers:a.markers};
}
function Hb() {
  var a = Fb();
  var b = Gb();
  var c = b.markers;
  b = O.call(this, b.rules) || this;
  b.markers = c;
  b.config = a;
  return b;
}
m.P(Hb, O);
function Ib(a, b) {
  this.listeners = {};
  this.markers = b;
  this.config = a;
}
Ib.prototype.on = function(a, b) {
  this.listeners[a] = b;
};
Ib.prototype.emit = function(a, b) {
  this.listeners[a](b);
};
function Jb(a) {
  var b = Fb(), c = Gb(), d = new Ib(b, c.markers);
  return c.rules.reduce(function(e, g) {
    return e.replace(g.re, g.replacement.bind(d));
  }, a);
}
function Kb(a, b, c) {
  c = void 0 === c ? !1 : c;
  var d = Jb(a);
  if (c) {
    return d;
  }
  c = ia(b);
  b = ja(b);
  a = Eb({za:a, Aa:c, sourceRoot:b});
  a = "//# sourceMappingURL=data:application/json;charset=utf-8;base64," + Buffer.from(a).toString("base64");
  return d + "\n" + a;
}
;DEPACK_EXPORT = function(a) {
  a = void 0 === a ? {} : a;
  var b = void 0 === a.pragma ? 'const { h } = require("preact");' : a.pragma;
  a = void 0 === a.noWarning ? !1 : a.noWarning;
  global.ALAMODE_JS && (a || console.warn("Reverting JS hook to add new one."), global.ALAMODE_JS());
  global.ALAMODE_JSX && (a || (console.warn("Reverting JSX hook to add new one, pragma:"), console.warn(b)), global.ALAMODE_JSX());
  global.ALAMODE_JS = pa(function(c, d) {
    return Kb(c, d);
  }, {exts:[".js"]});
  global.ALAMODE_JSX = pa(function(c, d) {
    c = Kb(c, d, !0);
    c = Ua(c);
    return b + c;
  }, {exts:[".jsx"]});
};


module.exports = DEPACK_EXPORT
//# sourceMappingURL=depack-lib.js.map