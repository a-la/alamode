#!/usr/bin/env node
             
const path = require('path');
const fs = require('fs');
const util = require('util');
const os = require('os');
const stream = require('stream');
const url = require('url');
const _module = require('module');
const vm = require('vm');             
const aa = (a, b, c, d = !1, e = !1) => {
  const f = c ? new RegExp(`^-(${c}|-${b})$`) : new RegExp(`^--${b}$`);
  b = a.findIndex(g => f.test(g));
  if (-1 == b) {
    return {argv:a};
  }
  if (d) {
    return {value:!0, index:b, length:1};
  }
  d = a[b + 1];
  if (!d || "string" == typeof d && d.startsWith("--")) {
    return {argv:a};
  }
  e && (d = parseInt(d, 10));
  return {value:d, index:b, length:2};
}, ba = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const d = a[c];
    if (d.startsWith("-")) {
      break;
    }
    b.push(d);
  }
  return b;
}, da = () => {
  var a = ca;
  return Object.keys(a).reduce((b, c) => {
    const d = a[c];
    if ("string" == typeof d) {
      return b[`-${d}`] = "", b;
    }
    c = d.command ? c : `--${c}`;
    d.short && (c = `${c}, -${d.short}`);
    let e = d.description;
    d.default && (e = `${e}\nDefault: ${d.default}.`);
    b[c] = e;
    return b;
  }, {});
};
const ca = {source:{description:"The location of the input file or directory to transpile.", command:!0}, output:{description:"The location of where to save the transpiled output.", short:"o"}, version:{description:"Show the version number.", boolean:!0, short:"v"}, help:{description:"Display the usage information.", boolean:!0, short:"h"}, ignore:{description:"Comma-separated list of files inside of `source` dir to\nignore, for example, `bin,.eslintrc`.", short:"i"}, noSourceMaps:{description:"Disable source maps.", 
boolean:!0, short:"s"}, extensions:{description:"Files of what extensions to transpile.", default:"js,jsx", short:"e"}, jsx:{description:"Enable JSX mode: only update JSX syntax to use hyperscript.\nDoes not transpile `import/export` statements.", boolean:!0, short:"j"}, module:{description:"Works together with `jsx` to also transpile modules while\ntranspiling JSX.", boolean:!0, short:"m"}, preact:{description:'When transpiling JSX, automatically insert at the top\n`import { h } from "preact"`.', 
boolean:!0, short:"p"}, "preact-externs":{description:'Same as `preact`, but imports from `\uff20externs/preact`\n`import { h } from "\uff20externs/preact"`.', boolean:!0, short:"E"}, debug:{description:"Will make \u00c0LaMode stop after replacing markers.", boolean:!0, short:"d"}, require:{description:"Renames `require` calls into imports, and `module.exports` assignments to exports.\nGreat for refactoring older code.", boolean:!0, short:"r"}}, r = function(a = {}, b = process.argv) {
  let [, , ...c] = b;
  const d = ba(c);
  c = c.slice(d.length);
  a = Object.entries(a).reduce((g, [k, l]) => {
    g[k] = "string" == typeof l ? {short:l} : l;
    return g;
  }, {});
  const e = [];
  a = Object.entries(a).reduce((g, [k, l]) => {
    let h;
    try {
      const {short:m, boolean:n, number:p, command:q, multiple:t} = l;
      if (q && t && d.length) {
        h = d;
      } else {
        if (q && d.length) {
          h = d[0];
        } else {
          const w = aa(c, k, m, n, p);
          ({value:h} = w);
          const {index:C, length:G} = w;
          void 0 !== C && G && e.push({index:C, length:G});
        }
      }
    } catch (m) {
      return g;
    }
    return void 0 === h ? g : {...g, [k]:h};
  }, {});
  let f = c;
  e.forEach(({index:g, length:k}) => {
    Array.from({length:k}).forEach((l, h) => {
      f[g + h] = null;
    });
  });
  f = f.filter(g => null !== g);
  Object.assign(a, {ca:f});
  return a;
}(ca), ea = r.source, fa = r.output, ha = r.version, ia = r.help, ja = r.ignore, ka = r.noSourceMaps, la = r.extensions || "js,jsx", ma = r.jsx, na = r.module, oa = r.preact, pa = r["preact-externs"], qa = r.debug, ra = r.require;
const {basename:sa, dirname:u, join:v, relative:x, resolve:ta} = path;
const {appendFileSync:ua, chmodSync:va, createReadStream:y, createWriteStream:z, existsSync:wa, lstat:A, lstatSync:B, mkdir:xa, readFileSync:ya, readdir:za, readlink:Aa, symlink:Ba, writeFileSync:D} = fs;
const Ca = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, Da = (a, b = !1) => Ca(a, 2 + (b ? 1 : 0)), Ea = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:Fa} = os;
const Ga = /\s+at.*(?:\(|\s)(.*)\)?/, Ha = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, Ia = Fa(), E = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(Ha.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(Ga);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(Ga, (g, k) => g.replace(k, k.replace(Ia, "~"))) : f).join("\n");
};
function Ja(a, b, c = !1) {
  return function(d) {
    var e = Ea(arguments), {stack:f} = Error();
    const g = Ca(f, 2, !0), k = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${k}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = E(e);
    return Object.assign(f ? d : Error(), {message:k, stack:e});
  };
}
;function F(a) {
  var {stack:b} = Error();
  const c = Ea(arguments);
  b = Da(b, a);
  return Ja(c, b, a);
}
;function Ka(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function H(a, b, c) {
  const d = F(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:e} = a;
  if (!e) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((f, g) => {
    const k = (h, m) => h ? (h = d(h), g(h)) : f(c || m);
    let l = [k];
    Array.isArray(b) ? (b.forEach((h, m) => {
      Ka(e, m);
    }), l = [...b, k]) : 1 < Array.from(arguments).length && (Ka(e, 0), l = [b, k]);
    a(...l);
  });
}
;async function I(a) {
  const b = u(a);
  try {
    return await J(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}
async function J(a) {
  try {
    await H(xa, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = u(a);
      await J(c);
      await J(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;async function La(a, b) {
  b = b.map(async c => {
    const d = v(a, c);
    return {lstat:await H(A, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const Ma = a => a.lstat.isDirectory(), Na = a => !a.lstat.isDirectory();
async function K(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  const {ignore:b = []} = {};
  if (!(await H(A, a)).isDirectory()) {
    var c = Error("Path is not a directory");
    c.code = "ENOTDIR";
    throw c;
  }
  c = await H(za, a);
  var d = await La(a, c);
  c = d.filter(Ma);
  d = d.filter(Na).reduce((e, f) => {
    var g = f.lstat.isDirectory() ? "Directory" : f.lstat.isFile() ? "File" : f.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...e, [f.relativePath]:{type:g}};
  }, {});
  c = await c.reduce(async(e, {path:f, relativePath:g}) => {
    const k = x(a, f);
    if (b.includes(k)) {
      return e;
    }
    e = await e;
    f = await K(f);
    return {...e, [g]:f};
  }, {});
  return {content:{...d, ...c}, type:"Directory"};
}
const Oa = (a, b) => {
  let c = [], d = [];
  Object.keys(a).forEach(f => {
    const {type:g} = a[f];
    "File" == g ? c.push(v(b, f)) : "Directory" == g && d.push(f);
  });
  const e = d.reduce((f, g) => {
    const {content:k} = a[g];
    g = Oa(k, v(b, g));
    return [...f, ...g];
  }, []);
  return [...c, ...e];
};
const Pa = async(a, b) => {
  const c = y(a), d = z(b);
  c.pipe(d);
  await Promise.all([new Promise((e, f) => {
    c.on("close", e).on("error", f);
  }), new Promise((e, f) => {
    d.on("close", e).on("error", f);
  })]);
}, Qa = async(a, b) => {
  a = await H(Aa, a);
  await H(Ba, [a, b]);
}, Ra = async(a, b) => {
  await I(v(b, "path.file"));
  const {content:c} = await K(a), d = Object.keys(c).map(async e => {
    const {type:f} = c[e], g = v(a, e);
    e = v(b, e);
    "Directory" == f ? await Ra(g, e) : "File" == f ? await Pa(g, e) : "SymbolicLink" == f && await Qa(g, e);
  });
  await Promise.all(d);
}, Sa = async(a, b) => {
  const c = await H(A, a), d = sa(a);
  b = v(b, d);
  c.isDirectory() ? await Ra(a, b) : c.isSymbolicLink() ? await Qa(a, b) : (await I(b), await Pa(a, b));
};
var Ta = stream;
const {Transform:Ua, Writable:Va} = stream;
const Wa = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class Xa extends Va {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {U:e = F(!0), proxyError:f} = a || {}, g = (k, l) => e(l);
    super(d);
    this.a = [];
    this.P = new Promise((k, l) => {
      this.on("finish", () => {
        let h;
        b ? h = Buffer.concat(this.a) : h = this.a.join("");
        k(h);
        this.a = [];
      });
      this.once("error", h => {
        if (-1 == h.stack.indexOf("\n")) {
          g`${h}`;
        } else {
          const m = E(h.stack);
          h.stack = m;
          f && g`${h}`;
        }
        l(h);
      });
      c && Wa(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get b() {
    return this.P;
  }
}
const Ya = async a => {
  ({b:a} = new Xa({rs:a, U:F(!0)}));
  return await a;
};
async function L(a) {
  a = y(a);
  return await Ya(a);
}
;async function Za(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = F(!0), d = z(a);
  await new Promise((e, f) => {
    d.on("error", g => {
      g = c(g);
      f(g);
    }).on("close", e).end(b);
  });
}
;const M = async a => {
  try {
    return await H(A, a);
  } catch (b) {
    return null;
  }
};
async function $a(a) {
  const {source:b, destination:c} = a;
  let {readable:d, writable:e} = a;
  if (!b && !d) {
    throw Error("Please give either a source or readable.");
  }
  if (!c && !e) {
    throw Error("Please give either a destination or writable.");
  }
  b && !d && (d = y(b));
  "-" == c ? d.pipe(process.stdout) : c ? await ab(c, d, b) : e instanceof Va && (d.pipe(e), await new Promise((f, g) => {
    e.on("error", g);
    e.on("finish", f);
  }));
}
const ab = async(a, b, c) => {
  if (b.path == a || c == a) {
    ({b:c} = new Xa({rs:b}));
    const d = await c;
    await new Promise((e, f) => {
      z(a).once("error", f).end(d, e);
    });
  } else {
    await new Promise((d, e) => {
      const f = z(a);
      b.pipe(f);
      f.once("error", e).on("close", d);
    });
  }
};
const {debuglog:bb} = util;
let N = null;
const cb = () => {
  if (N) {
    return N;
  }
  var a = {};
  try {
    var b = v(process.cwd(), ".alamoderc.json");
    a = require(b);
  } catch (d) {
    return a;
  }
  ({env:{ALAMODE_ENV:b}} = process);
  const {env:c} = a;
  a = c && b in c ? c[b] : a;
  delete a.env;
  return N = a;
};
const db = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function O(a) {
  var b = "";
  a = 0 > a ? (-a << 1) + 1 : a << 1;
  do {
    var c = a & 31;
    a >>>= 5;
    0 < a && (c |= 32);
    if (0 <= c && c < db.length) {
      c = db[c];
    } else {
      throw new TypeError("Must be between 0 and 63: " + c);
    }
    b += c;
  } while (0 < a);
  return b;
}
;const {URL:P} = url;
function eb(a, b) {
  return a === b ? 0 : null === a ? 1 : null === b ? -1 : a > b ? 1 : -1;
}
function Q(a, b) {
  let c = a.generatedLine - b.generatedLine;
  if (0 !== c) {
    return c;
  }
  c = a.generatedColumn - b.generatedColumn;
  if (0 !== c) {
    return c;
  }
  c = eb(a.source, b.source);
  if (0 !== c) {
    return c;
  }
  c = a.originalLine - b.originalLine;
  if (0 !== c) {
    return c;
  }
  c = a.originalColumn - b.originalColumn;
  return 0 !== c ? c : eb(a.name, b.name);
}
function fb(a) {
  const b = a.split("..").length - 1;
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
    c += `${a}/`;
  }
  return c;
}
const gb = /^[A-Za-z0-9+\-.]+:/;
function R(a) {
  return "/" == a[0] ? "/" == a[1] ? "scheme-relative" : "path-absolute" : gb.test(a) ? "absolute" : "path-relative";
}
function hb(a, b) {
  "string" == typeof a && (a = new P(a));
  "string" == typeof b && (b = new P(b));
  const c = b.pathname.split("/");
  a = a.pathname.split("/");
  for (0 < a.length && !a[a.length - 1] && a.pop(); 0 < c.length && 0 < a.length && c[0] === a[0];) {
    c.shift(), a.shift();
  }
  return a.map(() => "..").concat(c).join("/") + b.search + b.hash;
}
const ib = function(a) {
  return b => {
    const c = R(b), d = fb(b);
    b = new P(b, d);
    a(b);
    b = b.toString();
    return "absolute" === c ? b : "scheme-relative" === c ? b.slice(5) : "path-absolute" === c ? b.slice(11) : hb(d, b);
  };
}(() => {
});
function jb(a, b) {
  a: {
    if (R(a) !== R(b)) {
      var c = null;
    } else {
      c = fb(a + b);
      a = new P(a, c);
      c = new P(b, c);
      try {
        new P("", c.toString());
      } catch (d) {
        c = null;
        break a;
      }
      c = c.protocol !== a.protocol || c.user !== a.user || c.password !== a.password || c.hostname !== a.hostname || c.port !== a.port ? null : hb(a, c);
    }
  }
  return "string" == typeof c ? c : ib(b);
}
;class kb {
  constructor() {
    this.a = [];
    this.b = new Map;
  }
  add(a, b = !1) {
    const c = this.has(a), d = this.a.length;
    c && !b || this.a.push(a);
    c || this.b.set(a, d);
  }
  has(a) {
    return this.b.has(a);
  }
  indexOf(a) {
    const b = this.b.get(a);
    if (0 <= b) {
      return b;
    }
    throw Error('"' + a + '" is not in the set.');
  }
}
;class lb {
  constructor() {
    this.a = [];
    this.b = !0;
    this.f = {generatedLine:-1, generatedColumn:0, name:null, originalColumn:null, originalLine:null, source:null};
  }
  add(a) {
    {
      var b = this.f;
      const {generatedLine:c, generatedColumn:d} = b, {generatedLine:e, generatedColumn:f} = a;
      b = e > c || e == c && f >= d || 0 >= Q(b, a);
    }
    b ? this.f = a : this.b = !1;
    this.a.push(a);
  }
}
;/*
 Copyright 2011 Mozilla Foundation and contributors
 Licensed under the New BSD license. See LICENSE or:
 http://opensource.org/licenses/BSD-3-Clause
*/
function mb(a, b, c) {
  null != a.b && (b = jb(a.b, b));
  c ? (a.a || (a.a = Object.create(null)), a.a[b] = c) : a.a && (delete a.a[b], 0 === Object.keys(a.a).length && (a.a = null));
}
function nb(a, b, c) {
  return b.map(function(d) {
    if (!this.a) {
      return null;
    }
    c && (d = jb(c, d));
    return Object.prototype.hasOwnProperty.call(this.a, d) ? this.a[d] : null;
  }, a);
}
class ob {
  constructor(a = {}) {
    const {file:b, sourceRoot:c, skipValidation:d = !1} = a;
    this.G = b;
    this.b = c;
    this.Z = d;
    this.m = new kb;
    this.f = new kb;
    this.I = new lb;
    this.a = null;
  }
  toJSON() {
    const a = this.m.a.slice();
    var b = this.f.a.slice();
    {
      var c = 0;
      let f = 1, g = 0, k = 0, l = 0, h = 0, m = "", n;
      let p;
      var d = this.I;
      d.b || (d.a.sort(Q), d.b = !0);
      d = d.a;
      for (let q = 0, t = d.length; q < t; q++) {
        var e = d[q];
        n = "";
        if (e.generatedLine !== f) {
          for (c = 0; e.generatedLine !== f;) {
            n += ";", f++;
          }
        } else {
          if (0 < q) {
            if (!Q(e, d[q - 1])) {
              continue;
            }
            n += ",";
          }
        }
        n += O(e.generatedColumn - c);
        c = e.generatedColumn;
        null != e.source && (p = this.m.indexOf(e.source), n += O(p - h), h = p, n += O(e.originalLine - 1 - k), k = e.originalLine - 1, n += O(e.originalColumn - g), g = e.originalColumn, null != e.name && (e = this.f.indexOf(e.name), n += O(e - l), l = e));
        m += n;
      }
      c = m;
    }
    b = {version:3, sources:a, names:b, mappings:c};
    this.G && (b.file = this.G);
    this.b && (b.sourceRoot = this.b);
    this.a && (b.sourcesContent = nb(this, a, this.b));
    return b;
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
}
;function pb(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {re:b, replacement:c} = a;
  a = b instanceof RegExp;
  const d = -1 != ["string", "function"].indexOf(typeof c);
  return a && d;
}
const S = (a, b) => {
  if (!(b instanceof Error)) {
    throw b;
  }
  [, , a] = a.stack.split("\n", 3);
  a = b.stack.indexOf(a);
  if (-1 == a) {
    throw b;
  }
  a = b.stack.substr(0, a - 1);
  const c = a.lastIndexOf("\n");
  b.stack = a.substr(0, c);
  throw b;
};
function T(a, b) {
  function c() {
    return b.filter(pb).reduce((d, {re:e, replacement:f}) => {
      if (this.c) {
        return d;
      }
      if ("string" == typeof f) {
        return d = d.replace(e, f);
      }
      {
        let g;
        return d.replace(e, (k, ...l) => {
          g = Error();
          try {
            return this.c ? k : f.call(this, k, ...l);
          } catch (h) {
            S(g, h);
          }
        });
      }
    }, `${a}`);
  }
  c.brake = () => {
    c.c = !0;
  };
  return c.call(c);
}
;const qb = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), rb = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`, U = (a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    const {getReplacement:f = rb, getRegex:g = qb} = b || {}, k = g(d);
    e = {name:d, re:e, regExp:k, getReplacement:f, map:{}, lastIndex:0};
  }
  return {...c, [d]:e};
}, {}), V = a => {
  var b = [];
  const {regExp:c, map:d} = a;
  return {re:c, replacement(e, f) {
    e = d[f];
    delete d[f];
    f = Array.isArray(b) ? b : [b];
    return T(e, f);
  }};
}, W = a => {
  const {re:b, map:c, getReplacement:d, name:e} = a;
  return {re:b, replacement(f) {
    const {lastIndex:g} = a;
    c[g] = f;
    a.lastIndex += 1;
    return d(e, g);
  }};
};
async function sb(a, b) {
  return tb(a, b);
}
class ub extends Ua {
  constructor(a, b) {
    super(b);
    this.rules = (Array.isArray(a) ? a : [a]).filter(pb);
    this.c = !1;
    this.a = b;
  }
  async replace(a, b) {
    const c = new ub(this.rules, this.a);
    b && Object.assign(c, b);
    a = await sb(c, a);
    c.c && this.brake();
    b && Object.keys(b).forEach(d => {
      b[d] = c[d];
    });
    return a;
  }
  brake() {
    this.c = !0;
  }
  async reduce(a) {
    return await this.rules.reduce(async(b, {re:c, replacement:d}) => {
      b = await b;
      if (this.c) {
        return b;
      }
      if ("string" == typeof d) {
        b = b.replace(c, d);
      } else {
        const e = [];
        let f;
        const g = b.replace(c, (k, ...l) => {
          f = Error();
          try {
            if (this.c) {
              return e.length ? e.push(Promise.resolve(k)) : k;
            }
            const h = d.call(this, k, ...l);
            h instanceof Promise && e.push(h);
            return h;
          } catch (h) {
            S(f, h);
          }
        });
        if (e.length) {
          try {
            const k = await Promise.all(e);
            b = b.replace(c, () => k.shift());
          } catch (k) {
            S(f, k);
          }
        } else {
          b = g;
        }
      }
      return b;
    }, `${a}`);
  }
  async _transform(a, b, c) {
    try {
      const d = await this.reduce(a);
      this.push(d);
      c();
    } catch (d) {
      a = E(d.stack), d.stack = a, c(d);
    }
  }
}
async function tb(a, b) {
  b instanceof Ta ? b.pipe(a) : a.end(b);
  return await Ya(a);
}
;const vb = /\/\*(?:[\s\S]+?)\*\//g, wb = /\/\/(.+)/gm;
const yb = (a = []) => {
  const {comments:b, inlineComments:c, strings:d, literals:e, escapes:f, regexes:g, regexGroups:k} = U({comments:vb, inlineComments:wb, strings:/(["'])(.*?)\1/gm, literals:/`([\s\S]*?)`/gm, escapes:/\\[\\`'"/]/g, regexes:/\/(.+?)\//gm, regexGroups:/\[(.*?)\]/gm}), l = [b, c, d, e, f, g, k], [h, m, n, p, q, t, w] = l.map(W), [C, G, Yb, Zb, $b, ac, bc] = l.map(cc => V(cc));
  return {rules:[q, h, m, n, w, t, p, xb, ...a, Zb, ac, bc, Yb, G, C, $b], markers:{literals:e, strings:d, comments:b, inlineComments:c, escapes:f, regexes:g, regexGroups:k}};
}, xb = {re:/./, replacement(a) {
  this.stopProcessing && this.brake();
  return a;
}};
const zb = ({file:a, s:b, M:c, sourceRoot:d}) => {
  const e = new ob({file:a, sourceRoot:d});
  b.replace(vb, (f, g) => {
    if ("\n" == b[g + f.length]) {
      return "\n".repeat(f.split("\n").length - 1);
    }
    g = f.split("\n");
    f = g.length - 1;
    g = " ".repeat(g[f].length);
    return `${"\n".repeat(f)}${g}`;
  }).replace(wb, f => " ".repeat(f.length)).split("\n").forEach((f, g) => {
    const k = g + 1;
    f.replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, (l, h) => {
      if (0 != h || !/^\s+$/.test(l)) {
        l = {line:k, column:h};
        {
          let {H:m, L:n = null, source:p = null, name:q = null} = {H:l, source:c, L:l};
          if (!m) {
            throw Error('"generated" is a required argument');
          }
          if (!e.Z) {
            if (n && "number" != typeof n.line && "number" != typeof n.column) {
              throw Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
            }
            if (!(m && "line" in m && "column" in m && 0 < m.line && 0 <= m.column && !n && !p && !q || m && "line" in m && "column" in m && n && "line" in n && "column" in n && 0 < m.line && 0 <= m.column && 0 < n.line && 0 <= n.column && p)) {
              throw Error("Invalid mapping: " + JSON.stringify({H:m, source:p, L:n, name:q}));
            }
          }
          p && (p = `${p}`, e.m.has(p) || e.m.add(p));
          q && (q = `${q}`, e.f.has(q) || e.f.add(q));
          e.I.add({generatedLine:m.line, generatedColumn:m.column, originalLine:n ? n.line : null, originalColumn:n ? n.column : null, source:p, name:q});
        }
      }
    });
  });
  mb(e, c, b);
  return e.toString();
};
function Ab({source:a, $:b, name:c, destination:d, file:e, s:f}) {
  a = x(b, a);
  e = zb({file:e, s:f, M:a});
  c = `${c}.map`;
  ua(d, `\n//# sourceMappingURL=${c}`);
  b = v(b, c);
  D(b, e);
}
;const Bb = a => `if (${a} && ${a}.__esModule) ${a} = ${a}.default`, Cb = (a, b, c, d = null) => `${a.replace(/(\s+)from(\s+)([\s\S])*/, (e, f, g) => `${f}=${g}`)}${d ? d : "r" + `equire(${b}${c}${b})`}`, Db = (a, b = {}) => {
  if (!b.import) {
    return a;
  }
  ({import:{replacement:b}} = b);
  if (!b) {
    return a;
  }
  const {from:c, to:d} = b;
  if (void 0 === c) {
    throw Error('No "from" option is given for the replacement.');
  }
  if (void 0 === d) {
    throw Error('No "to" option is given for the replacement.');
  }
  return a.replace(new RegExp(b.from), b.to);
}, Eb = /(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%|%%_RESTREAM_LITERALS_REPLACEMENT_(\d+)_%%)/, Fb = (a = {import:{}}) => {
  try {
    return "always" == a.import.esCheck;
  } catch (b) {
    return !1;
  }
}, Gb = (a, b = {import:{}}) => {
  try {
    return b.import.alamodeModules.includes(a);
  } catch (c) {
    return !1;
  }
};
const Ib = async a => {
  var b = await M(a);
  let c = a, d = !1;
  if (!b) {
    if (c = await Hb(a), !c) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (b.isDirectory()) {
      b = !1;
      let e;
      a.endsWith("/") || (e = c = await Hb(a), b = !0);
      if (!e) {
        c = await Hb(v(a, "index"));
        if (!c) {
          throw Error(`${b ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? x("", c) : c, da:d};
}, Hb = async a => {
  a = `${a}.js`;
  let b = await M(a);
  b || (a = `${a}x`);
  if (b = await M(a)) {
    return a;
  }
};
const Kb = async(a, b, c = {}) => {
  const {fields:d, soft:e = !1} = c;
  var f = v(a, "node_modules", b);
  f = v(f, "package.json");
  const g = await M(f);
  if (g) {
    a = await Jb(f, d);
    if (void 0 === a) {
      throw Error(`The package ${x("", f)} does export the module.`);
    }
    if (!a.entryExists && !e) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:k, version:l, packageName:h, main:m, entryExists:n, ...p} = a;
    return {entry:x("", k), packageJson:x("", f), ...l ? {version:l} : {}, packageName:h, ...m ? {hasMain:!0} : {}, ...n ? {} : {entryExists:!1}, ...p};
  }
  if ("/" == a && !g) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return Kb(v(ta(a), ".."), b, c);
}, Jb = async(a, b = []) => {
  const c = await L(a);
  let d, e, f, g, k;
  try {
    ({module:d, version:e, name:f, main:g, ...k} = JSON.parse(c)), k = b.reduce((h, m) => {
      h[m] = k[m];
      return h;
    }, {});
  } catch (h) {
    throw Error(`Could not parse ${a}.`);
  }
  a = u(a);
  b = d || g;
  if (!b) {
    if (!await M(v(a, "index.js"))) {
      return;
    }
    b = g = "index.js";
  }
  a = v(a, b);
  let l;
  try {
    ({path:l} = await Ib(a)), a = l;
  } catch (h) {
  }
  return {entry:a, version:e, packageName:f, main:!d && g, entryExists:!!l, ...k};
};
const {builtinModules:Lb} = _module;
const Mb = a => a.replace(/(\s+)as(\s+)/g, (b, c, d) => `${1 == c.split("\n").length ? "" : c}:${d}`), Nb = (a, b, c = {}) => {
  if (!c.import) {
    return null;
  }
  ({import:{stdlib:c}} = c);
  if (c) {
    const {packages:d, path:e} = c;
    return d.includes(b) ? x(u(a), e).replace(/.js$/, "") : null;
  }
  return null;
}, Qb = (a, b, c, d, e, f, g) => {
  const {t:k, v:l} = Ob(c, d, e, f, g);
  a = Pb(a, b, e, f, d);
  return `${[k, a, ...g ? [] : [l]].filter(h => h).join("; ")};`;
}, Rb = (a, b) => {
  if (Fb(b)) {
    return !1;
  }
  if (/^[./]/.test(a) || Lb.includes(a) || Gb(a, b)) {
    return !0;
  }
}, Sb = async(a, b, c, d) => {
  if (Rb(a, b)) {
    return !0;
  }
  if (a in d) {
    return d[a];
  }
  if (c) {
    try {
      const {alamode:e} = await Kb(u(c), a, {fields:["alamode"]});
      d[a] = !!e;
      return e;
    } catch (e) {
      return !1;
    }
  }
}, Ob = (a, b, c, d, e) => {
  if (!a) {
    return {};
  }
  b = b ? {d:`${b} = ${"r" + `equire(${c}${d}${c})`}`, v:Bb(b)} : void 0;
  const {d:f, v:g} = b;
  a = a.replace(",", "").replace(/([^\s]+)/, f);
  return {t:`${e ? "const" : "let"}${a}`, v:g};
}, Pb = (a, b, c, d, e) => {
  if (!a) {
    return null;
  }
  b = Cb(b, c, d, e);
  return `const${Mb(a)}${b}`;
};
const Tb = [{re:new RegExp(`${/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?/.source}${Eb.source}`, "gm"), replacement:function(a, b, c, d, e, f, g) {
  const [, k, l] = /(["'`])(.+?)\1/.exec(g ? this.markers.literals.map[g] : this.markers.strings.map[f]);
  a = l.replace(this.markers.regexes.regExp, (m, n) => this.markers.regexes.map[n]);
  const h = (f = Nb(this.file, l, this.config)) || Db(a, this.config);
  f && (d ? b && (d = d.replace(/{/, `{ ${c},`), d = b.replace(/\S/g, " ") + d, c = b = void 0) : (d = b.replace(/(\S+)/, "{ $1 }"), c = b = void 0));
  this.J || (this.J = {});
  if (this.async) {
    return Sb(h, this.config, this.file, this.J).then(m => Qb(d, e, b, c, k, h, m));
  }
  a = Rb(h, this.config);
  return Qb(d, e, b, c, k, h, a);
}}, {re:new RegExp(`${/( *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+(.+?))/.source}${Eb.source}`, "gm"), replacement:function(a, b, c, d, e, f, g) {
  const [, k, l] = /(["'`])(.+?)\1/.exec(g ? this.markers.literals.map[g] : this.markers.strings.map[f]);
  a = Cb(e, k, l);
  ({length:b} = b.split("\n"));
  b = "\n".repeat(b - 1);
  e = /^[./]/.test(l) && !Fb(this.config);
  return `${c ? [`${b}${e ? "const" : "let"} ${d} = ${c}${a}`, ...e ? [] : [Bb(c)]].join("; ") : `${b}const ${d}${a}`};`;
}}];
const Ub = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|await|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/, Vb = /(?:[$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D])(?:[$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*/;
const Wb = a => a.split(/,\s*/).filter(b => b), Xb = a => a.reduce((b, c) => {
  const [d, e = d] = c.split(/\s+as\s+/);
  return {...b, [e.trim()]:d.trim()};
}, {}), dc = a => {
  a.replace(Ub, () => {
    throw Error(`Detected reserved identifier "${a}".`);
  });
}, ec = a => {
  ({length:a} = a.split("\n"));
  return "\n".repeat(a - 1);
}, X = (a, b = !0) => b ? ec(a) : a.split("\n").map(({length:c}, d, {length:e}) => d == e - 1 ? " ".repeat(c) : "").join("\n");
const fc = (a, b, c) => `${a.replace(/(\s+)from(\s+)([\s\S])*/, (d, e, f) => `${e}=${f}`)}${"r" + `equire(${b}${c}${b});`}`;
function gc(a, b, c, d, e) {
  a = this.noSourceMaps ? "" : X(a);
  const f = `$${b.replace(/[-/]/g, "_").replace(/[^\w\d-]/g, "")}`;
  b = fc(c, d, b);
  b = `${a}const ${f}${b}`;
  e = Wb(e).reduce((g, k) => {
    const [l, h] = k.split(/\s+as\s+/);
    k = l.trim();
    g[(h ? h.trim() : null) || k] = "default" == k ? f : `${f}.${k}`;
    return g;
  }, {});
  this.emit("export", e);
  return b;
}
;const hc = (a = {}) => {
  const {"default":b, ...c} = a, d = b ? `module.exports = ${b}` : "", e = Object.keys(c).map(f => `module.exports.${f} = ${a[f]}`);
  return [d, ...e].filter(f => f).join("\n");
};
const ic = [{re:/[\s\S]*/, replacement(a) {
  this.exports = {};
  this.on("export", b => {
    this.exports = {...this.exports, ...b};
  });
  return a;
}}, {re:new RegExp(`^( *export\\s+?)( *${/(?:let|const|var|class|function\s*\*?|async +function)/.source}\\s+((?:${Vb.source}\\s*,?\\s*)+))`, "gm"), replacement:function(a, b, c, d) {
  d.split(/,\s*/).forEach(e => {
    e = e.trim().replace(/\s+extends\s+.+/, "");
    dc(e);
    this.emit("export", {[e]:e});
  });
  return this.noSourceMaps ? c : `${X(b, !1)}${c}`;
}}, {re:new RegExp(`${/^( *export\s+{([^}]+?)})/.source}${/(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%|%%_RESTREAM_LITERALS_REPLACEMENT_(\d+)_%%)/.source}`, "gm"), replacement:function(a, b, c, d, e, f) {
  const [, g, k] = /(["'`])(.+?)\1/.exec(f ? this.markers.literals.map[f] : this.markers.strings.map[e]);
  return gc.call(this, b, k, d, g, c);
}}, {re:/^( *export\s+{([^}]+?)} *)(\n?)/gm, replacement:function(a, b, c, d) {
  a = Wb(c);
  a = Xb(a);
  this.emit("export", a);
  return this.noSourceMaps ? "" : `${X(b)}${d ? d : ""}`;
}}, {re:new RegExp(`^( *export\\s+default\\s+?)( *${/(?:class|function\s*\*?|async +function)/.source}\\s+(${Vb.source}))`, "m"), replacement:function(a, b, c, d) {
  a = d.trim();
  dc(a);
  this.emit("export", {"default":a});
  return this.noSourceMaps ? c : `${X(b, !1)}${c}`;
}}, {re:/^( *)(export\s+)(default\s+)/m, replacement:function(a, b, c, d) {
  a = c.replace(/export ?/, "module.");
  d = d.replace(/default ?/, "exports=");
  return `${b}${a}${d}`;
}}, {re:/[\s\S]*/, replacement(a) {
  const b = hc(this.exports);
  return `${a}${b ? `\n\n${b}` : ""}`;
}}];
class jc extends ub {
  constructor(a) {
    const b = cb();
    {
      var c = [...Tb, ...ic];
      const {rules:f, markers:g} = yb(c);
      c = {rules:f, markers:g};
    }
    const {rules:d, markers:e} = c;
    super(d);
    this.markers = e;
    this.config = b;
    this.file = a;
    this.noSourceMaps = !1;
    this.async = !0;
  }
}
const kc = async({source:a, destination:b, writable:c, debug:d, noSourceMaps:e}) => {
  const f = new jc(a);
  e && (f.noSourceMaps = e);
  d && (f.stopProcessing = !0);
  d = await L(a);
  f.end(d);
  await Promise.all([$a({source:a, ...c ? {writable:c} : {destination:b}, readable:f}), new Promise((g, k) => f.on("finish", g).on("error", k))]);
  return d;
};
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const lc = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90};
function Y(a, b) {
  return (b = lc[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const {Script:mc} = vm;
const nc = (a, b) => {
  const [c, , d] = a.split("\n");
  a = parseInt(c.replace(/.+?(\d+)$/, (f, g) => g)) - 1;
  const e = d.indexOf("^");
  ({length:b} = b.split("\n").slice(0, a).join("\n"));
  return b + e + (a ? 1 : 0);
};
const oc = a => {
  try {
    new mc(a);
  } catch (b) {
    const {message:c, stack:d} = b;
    if ("Unexpected token <" != c) {
      throw b;
    }
    return nc(d, a);
  }
  return null;
};
const pc = a => {
  [, a] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || [];
  return a;
}, rc = a => {
  let b = 0;
  const c = [];
  let d;
  T(a, [{re:/[{}]/g, replacement(l, h) {
    l = "}" == l;
    const m = !l;
    if (!b && l) {
      throw Error("A closing } is found without opening one.");
    }
    b += m ? 1 : -1;
    1 == b && m ? d = {open:h} : 0 == b && l && (d.close = h, c.push(d), d = {});
  }}]);
  if (b) {
    throw Error(`Unbalanced props (level ${b}) ${a}`);
  }
  const e = {}, f = [], g = {};
  var k = c.reduce((l, {open:h, close:m}) => {
    l = a.slice(l, h);
    const [, n, p, q, t] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(l) || [];
    h = a.slice(h + 1, m);
    if (!p && !/\s*\.\.\./.test(h)) {
      throw Error("Could not detect prop name");
    }
    p ? e[p] = h : f.push(h);
    g[p] = {before:n, D:q, C:t};
    h = l || "";
    h = h.slice(0, h.length - (p || "").length - 1);
    const {B:w, l:C} = qc(h);
    Object.assign(e, w);
    Object.assign(g, C);
    return m + 1;
  }, 0);
  if (c.length) {
    k = a.slice(k);
    const {B:l, l:h} = qc(k);
    Object.assign(e, l);
    Object.assign(g, h);
  } else {
    const {B:l, l:h} = qc(a);
    Object.assign(e, l);
    Object.assign(g, h);
  }
  return {w:e, u:f, l:g};
}, qc = a => {
  const b = [], c = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]+?)\5/g, (d, e, f, g, k, l, h, m) => {
    c[f] = {before:e, D:g, C:k};
    b.push({o:m, name:f, O:`${l}${h}${l}`});
    return "%".repeat(d.length);
  }).replace(/(\s*)([^\s%]+)/g, (d, e, f, g) => {
    c[f] = {before:e};
    b.push({o:g, name:f, O:"true"});
  });
  return {B:[...b.reduce((d, {o:e, name:f, O:g}) => {
    d[e] = [f, g];
    return d;
  }, [])].filter(Boolean).reduce((d, [e, f]) => {
    d[e] = f;
    return d;
  }, {}), l:c};
}, sc = (a, b = [], c = !1, d = {}, e = "") => {
  const f = Object.keys(a), {length:g} = f;
  return g || b.length ? `{${f.reduce((k, l) => {
    const h = a[l], m = c || -1 != l.indexOf("-") ? `'${l}'` : l, {before:n = "", D:p = "", C:q = ""} = d[l] || {};
    return [...k, `${n}${m}${p}:${q}${h}`];
  }, b).join(",")}${e}}` : "{}";
}, tc = (a = "") => {
  [a] = a;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}, uc = (a, b = {}, c = [], d = [], e = !1, f = null, g = {}, k = "") => {
  const l = tc(a), h = l ? a : `'${a}'`;
  if (!Object.keys(b).length && !c.length && !d.length) {
    return `h(${h})`;
  }
  const m = l && "dom" == e ? !1 : e;
  l || !d.length || e && "dom" != e || f && f(`JSX: destructuring ${d.join(" ")} is used without quoted props on HTML ${a}.`);
  a = sc(b, d, m, g, k);
  b = c.reduce((n, p, q) => {
    q = c[q - 1];
    return `${n}${q && /\S/.test(q) ? "," : ""}${p}`;
  }, "");
  return `h(${h},${a}${b ? `,${b}` : ""})`;
};
const vc = (a, b = []) => {
  let c = 0, d;
  a = T(a, [...b, {re:/[<>]/g, replacement(e, f) {
    if (d) {
      return e;
    }
    const g = "<" == e;
    c += g ? 1 : -1;
    0 == c && !g && (d = f);
    return e;
  }}]);
  if (c) {
    throw Error(1);
  }
  return {ba:a, F:d};
}, xc = a => {
  const b = pc(a);
  let c;
  const {R:d} = U({R:/=>/g});
  try {
    ({ba:l, F:c} = vc(a, [W(d)]));
  } catch (h) {
    if (1 === h) {
      throw Error(`Could not find the matching closing > for ${b}.`);
    }
  }
  const e = l.slice(0, c + 1);
  var f = e.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(f)) {
    return a = f.replace(/\/\s*>$/, ""), f = "", new wc({h:e.replace(d.regExp, "=>"), g:a.replace(d.regExp, "=>"), content:"", tagName:b});
  }
  a = f.replace(/>$/, "");
  f = c + 1;
  c = !1;
  let g = 1, k;
  T(l, [{re:new RegExp(`[\\s\\S](?:<\\s*${b}(\\s+|>)|/\\s*${b}\\s*>)`, "g"), replacement(h, m, n, p) {
    if (c) {
      return h;
    }
    m = !m && h.endsWith(">");
    const q = !m;
    if (q) {
      p = p.slice(n);
      const {F:t} = vc(p.replace(/^[\s\S]/, " "));
      p = p.slice(0, t + 1);
      if (/\/\s*>$/.test(p)) {
        return h;
      }
    }
    g += q ? 1 : -1;
    0 == g && m && (c = n, k = c + h.length);
    return h;
  }}]);
  if (g) {
    throw Error(`Could not find the matching closing </${b}>.`);
  }
  f = l.slice(f, c);
  var l = l.slice(0, k).replace(d.regExp, "=>");
  return new wc({h:l, g:a.replace(d.regExp, "=>"), content:f.replace(d.regExp, "=>"), tagName:b});
};
class wc {
  constructor(a) {
    this.h = a.h;
    this.g = a.g;
    this.content = a.content;
    this.tagName = a.tagName;
  }
}
;const yc = a => {
  let b = "", c = "";
  a = a.replace(/^(\n\s*)([\s\S]+)?/, (d, e, f = "") => {
    b = e;
    return f;
  }).replace(/([\s\S]+?)?(\n\s*)$/, (d, e = "", f = "") => {
    c = f;
    return e;
  });
  return `${b}${a ? `\`${a}\`` : ""}${c}`;
}, Ac = a => {
  const b = [];
  let c = {}, d = 0, e = 0;
  T(a, [{re:/[<{}]/g, replacement(f, g) {
    if (!(g < e)) {
      if (/[{}]/.test(f)) {
        d += "{" == f ? 1 : -1, 1 == d && void 0 == c.from ? c.from = g : 0 == d && (c.to = g + 1, c.V = a.slice(c.from + 1, g), b.push(c), c = {});
      } else {
        if (d) {
          return f;
        }
        f = xc(a.slice(g));
        e = g + f.h.length;
        c.W = f;
        c.to = e;
        c.from = g;
        b.push(c);
        c = {};
      }
    }
  }}, {}]);
  return b.length ? zc(a, b) : [yc(a)];
}, zc = (a, b) => {
  let c = 0;
  b = b.reduce((d, {from:e, to:f, V:g, W:k}) => {
    (e = a.slice(c, e)) && d.push(yc(e));
    c = f;
    g ? d.push(g) : k && d.push(k);
    return d;
  }, []);
  if (c < a.length) {
    const d = a.slice(c, a.length);
    d && b.push(yc(d));
  }
  return b;
};
const Cc = (a, b = {}) => {
  const {quoteProps:c, warn:d} = b;
  var e = oc(a);
  if (null === e) {
    return a;
  }
  var f = a.slice(e);
  const {g = "", content:k, tagName:l, h:{length:h}} = xc(f);
  f = Bc(k, c, d);
  const {w:m, u:n, l:p} = rc(g.replace(/^ */, ""));
  var q = uc(l, m, f, n, c, d, p, /\s*$/.exec(g) || [""]);
  f = a.slice(0, e);
  a = a.slice(e + h);
  e = h - q.length;
  0 < e && (q = `${" ".repeat(e)}${q}`);
  f = `${f}${q}${a}`;
  return Cc(f, b);
}, Bc = (a, b = !1, c = null) => a ? Ac(a).reduce((d, e) => {
  if (e instanceof wc) {
    const {g:k = "", content:l, tagName:h} = e, {w:m, u:n} = rc(k);
    e = Bc(l, b, c);
    e = uc(h, m, e, n, b, c);
    return [...d, e];
  }
  const f = oc(e);
  if (f) {
    var g = e.slice(f);
    const {h:{length:k}, g:l = "", content:h, tagName:m} = xc(g), {w:n, u:p} = rc(l);
    g = Bc(h, b, c);
    g = uc(m, n, g, p, b, c);
    const q = e.slice(0, f);
    e = e.slice(f + k);
    return [...d, `${q}${g}${e}`];
  }
  return [...d, e];
}, []) : [];
const Dc = (a, b = {}) => {
  const {e:c, S:d, T:e, o:f, X:g, Y:k} = U({S:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, T:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg, o:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, X:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, Y:/^ *import\s+['"].+['"]/gm}, {getReplacement(l, h) {
    return `/*%%_RESTREAM_${l.toUpperCase()}_REPLACEMENT_${h}_%%*/`;
  }, getRegex(l) {
    return new RegExp(`/\\*%%_RESTREAM_${l.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, "g");
  }});
  a = T(a, [W(e), W(d), W(c), W(f), W(g), W(k)]);
  b = Cc(a, b);
  return T(b, [V(e), V(d), V(c), V(f), V(g), V(k)]);
};
function Ec(a = "") {
  if (document) {
    var b = document.head, c = document.createElement("style");
    c.type = "text/css";
    c.styleSheet ? c.styleSheet.cssText = a : c.appendChild(document.createTextNode(a));
    b.appendChild(c);
  }
}
const Fc = async(a, b, c, d) => {
  var e = await L(a);
  e = await Dc(e, {quoteProps:"dom", warn(f) {
    console.warn(Y(f, "yellow"));
    console.warn(Y(" in %s", "grey"), a);
  }});
  e = e.replace(/^import (['"])(.+?\.css)\1/gm, (f, g, k) => {
    try {
      var l = v(c, "css-injector.js");
      wa(l) || D(l, `export default ${Ec.toString()}`);
      const h = v(u(a), k);
      k = `${k}.js`;
      const m = v(c, k);
      let n = x(u(m), l);
      n.startsWith(".") || (n = `./${n}`);
      const p = ya(h);
      l = `import __$styleInject from '${n}'\n\n`;
      l += `__$styleInject(\`${p}\`)`;
      D(m, l);
      console.error("Added %s in %s", Y(k, "yellow"), a);
      return `import ${g}${k}${g}`;
    } catch (h) {
      return console.error("Could not include CSS in %s:\n%s", a, Y(h.message, "red")), f;
    }
  });
  return b ? `${d ? "const { h } = requir" + `e('${b}');` : `import { h } from '${b}'`}
${e}` : e;
};
const Gc = bb("alamode"), Hc = (a, b) => a.includes(b) || a.some(c => b.startsWith(`${c}/`)), Z = async a => {
  const {input:b, j:c = ".", name:d, A:e = "-", noSourceMaps:f, extensions:g, debug:k, aa:l = d} = a;
  var h = v(c, d);
  a = "-" == e;
  const m = v(b, h), n = a ? null : v(e, c);
  a = a ? "-" : v(n, l);
  Gc(h);
  await I(a);
  if (!Ic(h, g)) {
    return await $a({source:m, destination:a}), a;
  }
  const p = await kc({source:m, destination:a, debug:k, noSourceMaps:f});
  if ("-" != e) {
    var q = B(m);
    ({mode:q} = q);
    va(a, q);
    if (f) {
      return a;
    }
    Ab({destination:a, file:h, name:d, $:n, source:m, s:p});
  } else {
    f || k || (h = zb({file:h, s:p, M:x(n || "", m)}), h = "/" + `/# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(h).toString("base64")}`, console.log("\n\n%s", h));
  }
  return a;
}, Kc = async a => {
  const {input:b, A:c, j:d = ".", K:e, N:f} = a, g = v(b, d), k = v(c, d), {content:l} = await K(g);
  await Object.keys(l).reduce(async(h, m) => {
    await h;
    h = v(g, m);
    var {type:n} = l[m];
    "File" == n ? Hc(a.ignore, v(d, m)) || (e && /jsx$/.test(m) ? (a.i && (n = m.replace(/jsx$/, "js"), h = await Z({...a, name:m, aa:n}), m = n), n = v(k, m), await Jc(h, f, c, n, {j:d, name:m, ignore:a.ignore, i:a.i})) : e && a.i ? await Z({...a, name:m}) : e ? await Sa(h, k) : await Z({...a, name:m})) : "Directory" == n && (m = v(d, m), await Kc({...a, j:m}));
  }, {});
}, Jc = async(a, b, c, d, {i:e, j:f, name:g, ignore:k} = {}) => {
  if (k && (f = v(f, g), Hc(k, f))) {
    return;
  }
  a = await Fc(a, b, c, e);
  b = d.replace(/jsx$/, "js");
  if ("-" == d) {
    return a;
  }
  await I(b);
  await Za(b, a);
}, Ic = (a, b) => b.some(c => a.endsWith(c)), Lc = async a => {
  const {input:b, A:c = "-", K:d, N:e} = a;
  if (!b) {
    throw Error("Please specify the source file or directory.");
  }
  var f = B(b);
  if (f.isDirectory()) {
    if ("-" == c) {
      throw Error("Output to stdout is only for files.");
    }
    await Kc(a);
  } else {
    if (f.isFile()) {
      if (f = sa(b), d && /jsx$/.test(f)) {
        if (a = "-" == c ? "-" : v(c, f), f = await Jc(b, e, c, a), "-" == a) {
          return console.log(f);
        }
      } else {
        await Z({...a, input:u(b), j:"./", name:f});
      }
    }
  }
  "-" != c && process.stdout.write(`Transpiled code saved to ${c}\n`);
};
const Mc = async a => {
  var b = await L(a);
  const c = new ub([{re:/^ *(?:var|let|const)\s+(\S+?)(\s*)=(\s*)require\((['"])(.+?)\4\)/gm, replacement(d, e, f, g, k, l) {
    return `import ${e}${f}from${g}${k}${l}${k}`;
  }}, {re:/^ *(?:var|let|const)(\s+{\s*)([\s\S]+?)(\s*})(\s*)=(\s*)require\((['"])(.+?)\6\)/gm, replacement(d, e, f, g, k, l, h, m) {
    d = f.replace(/(\s*):(\s*)/g, (n, p, q) => `${p || " "}as${q || " "}`);
    return `import${e}${d}${g}${k}from${l}${h}${m}${h}`;
  }}, {re:/^( *)(?:module\.)?exports\s*=/gm, replacement(d, e) {
    return `${e}export default`;
  }}, {re:/^( *)(?:module\.)?exports\.(\S+?)\s*=\s*([^\s;]+)/gm, replacement(d, e, f, g) {
    return f == g ? `${e}export { ${f} }` : `${e}export const ${f} = ${g}`;
  }}]);
  b = await tb(c, b);
  await Za(a, b);
};
async function Nc(a) {
  ({input:a} = a);
  if (!a) {
    throw Error("Please specify the source file or directory to refactor.");
  }
  var b = B(a);
  b.isDirectory() ? ({content:b} = await K(a), a = Oa(b, a), await Promise.all(a.map(async c => {
    await Mc(c);
  }))) : b.isFile() && await Mc(a);
}
;function Oc() {
  const {usage:a = {}, description:b, line:c, example:d} = {usage:Pc, description:"A tool to transpile JavaScript packages using regular expressions.\nSupports import/export and JSX transpilation.\nhttps://artdecocode.com/alamode/", line:"alamode source [-o destination] [-i dir,file] [-s] [-jp]", example:"alamode src -o build"};
  var e = Object.keys(a);
  const f = Object.values(a), [g] = e.reduce(([h = 0, m = 0], n) => {
    const p = a[n].split("\n").reduce((q, t) => t.length > q ? t.length : q, 0);
    p > m && (m = p);
    n.length > h && (h = n.length);
    return [h, m];
  }, []), k = (h, m) => {
    m = " ".repeat(m - h.length);
    return `${h}${m}`;
  };
  e = e.reduce((h, m, n) => {
    n = f[n].split("\n");
    m = k(m, g);
    const [p, ...q] = n;
    m = `${m}\t${p}`;
    const t = k("", g);
    n = q.map(w => `${t}\t${w}`);
    return [...h, m, ...n];
  }, []).map(h => `\t${h}`);
  const l = [b, `  ${c || ""}`].filter(h => h ? h.trim() : h).join("\n\n");
  e = `${l ? `${l}\n` : ""}
${e.join("\n")}
`;
  return d ? `${e}
  Example:

    ${d}
` : e;
}
;/*

 ALaMode: transpiler of import/export statements and JSX components.

 Copyright (C) 2019  Art Deco

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
if (ia) {
  var Qc, Pc = da();
  Qc = Oc();
  console.log(Qc);
  process.exit();
} else {
  ha && (console.log("v%s", require("../../package.json").version), process.exit());
}
(async() => {
  try {
    const a = ja ? ja.split(",") : [], b = la.split(",");
    if (ra) {
      return await Nc({input:ea, ignore:a, extensions:b});
    }
    let c = !1;
    oa ? c = "preact" : pa && (c = "@externs/preact");
    await Lc({input:ea, A:fa, noSourceMaps:ka, ignore:a, extensions:b, N:c, K:ma, debug:qa, i:na});
  } catch (a) {
    if (process.env.DEBUG) {
      return console.log(a.stack);
    }
    console.log(a.message);
  }
})();

