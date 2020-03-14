#!/usr/bin/env node
             
const path = require('path');
const fs = require('fs');
const util = require('util');
const os = require('os');
const stream = require('stream');
const url = require('url');
const _module = require('module');
const vm = require('vm');             
const aa = (a, b, c, d = !1, f = !1) => {
  const e = c ? new RegExp(`^-(${c}|-${b})$`) : new RegExp(`^--${b}$`);
  b = a.findIndex(g => e.test(g));
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
  f && (d = parseInt(d, 10));
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
}, fa = a => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  if ("string" == typeof d) {
    return b[`-${d}`] = "", b;
  }
  c = d.command ? c : `--${c}`;
  d.short && (c = `${c}, -${d.short}`);
  let f = d.description;
  d.default && (f = `${f}\nDefault: ${d.default}.`);
  b[c] = f;
  return b;
}, {});
const ha = {source:{description:"The location of the input file or directory to transpile.", command:!0}, output:{description:"The location of where to save the transpiled output.", short:"o"}, ignore:{description:"Comma-separated list of files inside of `source` dir to\nignore, for example, `bin,.eslintrc`.", short:"i"}, noSourceMaps:{description:"Disable source maps.", boolean:!0, short:"s"}, extensions:{description:"Files of what extensions to transpile.", default:"js,jsx", short:"e"}, debug:{description:"Will make \u00c0LaMode stop after replacing markers.", 
boolean:!0, short:"d"}, require:{description:"Renames `require` calls into imports, and `module.exports`\nassignments to exports.\nGreat for refactoring older code.", boolean:!0, short:"r"}, env:{description:"The environment. Analogue to setting `ALAMODE_ENV`\nenv variable."}, version:{description:"Show the version number.", boolean:!0, short:"v"}, help:{description:"Display the usage information.", boolean:!0, short:"h"}}, ia = {jsx:{description:"Enable JSX mode: only update JSX syntax to use hyperscript.\nDoes not transpile `import/export` statements.", 
boolean:!0, short:"j"}, module:{description:"Works together with `jsx` to also transpile modules while\ntranspiling JSX.", boolean:!0, short:"m"}, preact:{description:'When transpiling JSX, automatically insert at the top\n`import { h } from "preact"`.', boolean:!0, short:"p"}, "preact-externs":{description:'Same as `preact`, but imports from `\uff20externs/preact`\n`import { h } from "\uff20externs/preact"`.', boolean:!0, short:"E"}}, t = function(a = {}, b = process.argv) {
  let [, , ...c] = b;
  const d = ba(c);
  c = c.slice(d.length);
  a = Object.entries(a).reduce((g, [h, l]) => {
    g[h] = "string" == typeof l ? {short:l} : l;
    return g;
  }, {});
  const f = [];
  a = Object.entries(a).reduce((g, [h, l]) => {
    let k;
    try {
      const n = l.short, m = l.boolean, p = l.number, q = l.command, r = l.multiple;
      if (q && r && d.length) {
        k = d;
      } else {
        if (q && d.length) {
          k = d[0];
        } else {
          const u = aa(c, h, n, m, p);
          ({value:k} = u);
          const w = u.index, D = u.length;
          void 0 !== w && D && f.push({index:w, length:D});
        }
      }
    } catch (n) {
      return g;
    }
    return void 0 === k ? g : {...g, [h]:k};
  }, {});
  let e = c;
  f.forEach(({index:g, length:h}) => {
    Array.from({length:h}).forEach((l, k) => {
      e[g + k] = null;
    });
  });
  e = e.filter(g => null !== g);
  Object.assign(a, {ea:e});
  return a;
}({...ha, ...ia}), ja = t.source, ka = t.output, la = t.ignore, ma = t.noSourceMaps, na = t.extensions || "js,jsx", oa = t.debug, pa = t.require, qa = t.env, ra = t.version, sa = t.help, ta = t.jsx, ua = t.module, va = t.preact, wa = t["preact-externs"];
const xa = path.basename, v = path.dirname, x = path.join, ya = path.parse, y = path.relative, za = path.resolve;
const Aa = fs.appendFileSync, Ba = fs.chmodSync, z = fs.createReadStream, A = fs.createWriteStream, Ca = fs.existsSync, B = fs.lstat, C = fs.lstatSync, Da = fs.mkdir, Ea = fs.readFileSync, Fa = fs.readdir, Ga = fs.readlink, Ha = fs.symlink, E = fs.writeFileSync;
const Ia = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, Ja = (a, b = !1) => Ia(a, 2 + (b ? 1 : 0)), Ka = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const La = os.homedir;
const Ma = /\s+at.*(?:\(|\s)(.*)\)?/, Na = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, Oa = La(), F = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), f = new RegExp(Na.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(e => {
    e = e.match(Ma);
    if (null === e || !e[1]) {
      return !0;
    }
    e = e[1];
    return e.includes(".app/Contents/Resources/electron.asar") || e.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(e);
  }).filter(e => e.trim()).map(e => b ? e.replace(Ma, (g, h) => g.replace(h, h.replace(Oa, "~"))) : e).join("\n");
};
function Pa(a, b, c = !1) {
  return function(d) {
    var f = Ka(arguments), {stack:e} = Error();
    const g = Ia(e, 2, !0), h = (e = d instanceof Error) ? d.message : d;
    f = [`Error: ${h}`, ...null !== f && a === f || c ? [b] : [g, b]].join("\n");
    f = F(f);
    return Object.assign(e ? d : Error(), {message:h, stack:f});
  };
}
;function G(a) {
  var {stack:b} = Error();
  const c = Ka(arguments);
  b = Ja(b, a);
  return Pa(c, b, a);
}
;async function H(a, b, c) {
  const d = G(!0);
  if ("function" != typeof a) {
    throw Error("Function must be passed.");
  }
  if (!a.length) {
    throw Error(`Function${a.name ? ` ${a.name}` : ""} does not accept any arguments.`);
  }
  return await new Promise((f, e) => {
    const g = (l, k) => l ? (l = d(l), e(l)) : f(c || k);
    let h = [g];
    Array.isArray(b) ? h = [...b, g] : 1 < Array.from(arguments).length && (h = [b, g]);
    a(...h);
  });
}
;async function I(a) {
  const b = v(a);
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
    await H(Da, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = v(a);
      await J(c);
      await J(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;async function Qa(a, b) {
  b = b.map(async c => {
    const d = x(a, c);
    return {lstat:await H(B, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const Ra = a => a.lstat.isDirectory(), Sa = a => !a.lstat.isDirectory();
async function K(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  const {ignore:b = []} = {};
  if (!(await H(B, a)).isDirectory()) {
    var c = Error("Path is not a directory");
    c.code = "ENOTDIR";
    throw c;
  }
  c = await H(Fa, a);
  var d = await Qa(a, c);
  c = d.filter(Ra);
  d = d.filter(Sa).reduce((f, e) => {
    var g = e.lstat.isDirectory() ? "Directory" : e.lstat.isFile() ? "File" : e.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...f, [e.relativePath]:{type:g}};
  }, {});
  c = await c.reduce(async(f, {path:e, relativePath:g}) => {
    const h = y(a, e);
    if (b.includes(h)) {
      return f;
    }
    f = await f;
    e = await K(e);
    return {...f, [g]:e};
  }, {});
  return {content:{...d, ...c}, type:"Directory"};
}
const Ta = (a, b) => {
  let c = [], d = [];
  Object.keys(a).forEach(e => {
    const {type:g} = a[e];
    "File" == g ? c.push(x(b, e)) : "Directory" == g && d.push(e);
  });
  const f = d.reduce((e, g) => {
    const {content:h} = a[g];
    g = Ta(h, x(b, g));
    return [...e, ...g];
  }, []);
  return [...c, ...f];
};
const Ua = async(a, b) => {
  const c = z(a), d = A(b);
  c.pipe(d);
  await Promise.all([new Promise((f, e) => {
    c.on("close", f).on("error", e);
  }), new Promise((f, e) => {
    d.on("close", f).on("error", e);
  })]);
}, Va = async(a, b) => {
  a = await H(Ga, a);
  await H(Ha, [a, b]);
}, Wa = async(a, b) => {
  await I(x(b, "path.file"));
  const {content:c} = await K(a), d = Object.keys(c).map(async f => {
    const {type:e} = c[f], g = x(a, f);
    f = x(b, f);
    "Directory" == e ? await Wa(g, f) : "File" == e ? await Ua(g, f) : "SymbolicLink" == e && await Va(g, f);
  });
  await Promise.all(d);
}, Xa = async(a, b) => {
  const c = await H(B, a), d = xa(a);
  b = x(b, d);
  c.isDirectory() ? await Wa(a, b) : c.isSymbolicLink() ? await Va(a, b) : (await I(b), await Ua(a, b));
};
var Ya = stream;
const Za = stream.Transform, $a = stream.Writable;
const ab = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class bb extends $a {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {W:f = G(!0), proxyError:e} = a || {}, g = (h, l) => f(l);
    super(d);
    this.a = [];
    this.S = new Promise((h, l) => {
      this.on("finish", () => {
        let k;
        b ? k = Buffer.concat(this.a) : k = this.a.join("");
        h(k);
        this.a = [];
      });
      this.once("error", k => {
        if (-1 == k.stack.indexOf("\n")) {
          g`${k}`;
        } else {
          const n = F(k.stack);
          k.stack = n;
          e && g`${k}`;
        }
        l(k);
      });
      c && ab(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get b() {
    return this.S;
  }
}
const cb = async a => {
  ({b:a} = new bb({rs:a, W:G(!0)}));
  return await a;
};
async function L(a) {
  a = z(a);
  return await cb(a);
}
;async function db(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = G(!0), d = A(a);
  await new Promise((f, e) => {
    d.on("error", g => {
      g = c(g);
      e(g);
    }).on("close", f).end(b);
  });
}
;const M = async a => {
  try {
    return await H(B, a);
  } catch (b) {
    return null;
  }
};
async function eb(a) {
  const b = a.source, c = a.destination;
  let {readable:d, writable:f} = a;
  if (!b && !d) {
    throw Error("Please give either a source or readable.");
  }
  if (!c && !f) {
    throw Error("Please give either a destination or writable.");
  }
  b && !d && (d = z(b));
  "-" == c ? d.pipe(process.stdout) : c ? await fb(c, d, b) : f instanceof $a && (d.pipe(f), await new Promise((e, g) => {
    f.on("error", g);
    f.on("finish", e);
  }));
}
const fb = async(a, b, c) => {
  if (b.path == a || c == a) {
    ({b:c} = new bb({rs:b}));
    const d = await c;
    await new Promise((f, e) => {
      A(a).once("error", e).end(d, f);
    });
  } else {
    await new Promise((d, f) => {
      const e = A(a);
      b.pipe(e);
      e.once("error", f).on("close", d);
    });
  }
};
const gb = util.debuglog;
let N = null;
const hb = () => {
  if (N) {
    return N;
  }
  var a = {};
  try {
    var b = x(process.cwd(), ".alamoderc.json");
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
const ib = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function O(a) {
  var b = "";
  a = 0 > a ? (-a << 1) + 1 : a << 1;
  do {
    var c = a & 31;
    a >>>= 5;
    0 < a && (c |= 32);
    if (0 <= c && c < ib.length) {
      c = ib[c];
    } else {
      throw new TypeError("Must be between 0 and 63: " + c);
    }
    b += c;
  } while (0 < a);
  return b;
}
;const P = url.URL;
function jb(a, b) {
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
  c = jb(a.source, b.source);
  if (0 !== c) {
    return c;
  }
  c = a.originalLine - b.originalLine;
  if (0 !== c) {
    return c;
  }
  c = a.originalColumn - b.originalColumn;
  return 0 !== c ? c : jb(a.name, b.name);
}
function kb(a) {
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
const lb = /^[A-Za-z0-9+\-.]+:/;
function R(a) {
  return "/" == a[0] ? "/" == a[1] ? "scheme-relative" : "path-absolute" : lb.test(a) ? "absolute" : "path-relative";
}
function mb(a, b) {
  "string" == typeof a && (a = new P(a));
  "string" == typeof b && (b = new P(b));
  const c = b.pathname.split("/");
  a = a.pathname.split("/");
  for (0 < a.length && !a[a.length - 1] && a.pop(); 0 < c.length && 0 < a.length && c[0] === a[0];) {
    c.shift(), a.shift();
  }
  return a.map(() => "..").concat(c).join("/") + b.search + b.hash;
}
const nb = function(a) {
  return b => {
    const c = R(b), d = kb(b);
    b = new P(b, d);
    a(b);
    b = b.toString();
    return "absolute" === c ? b : "scheme-relative" === c ? b.slice(5) : "path-absolute" === c ? b.slice(11) : mb(d, b);
  };
}(() => {
});
function ob(a, b) {
  a: {
    if (R(a) !== R(b)) {
      var c = null;
    } else {
      c = kb(a + b);
      a = new P(a, c);
      c = new P(b, c);
      try {
        new P("", c.toString());
      } catch (d) {
        c = null;
        break a;
      }
      c = c.protocol !== a.protocol || c.user !== a.user || c.password !== a.password || c.hostname !== a.hostname || c.port !== a.port ? null : mb(a, c);
    }
  }
  return "string" == typeof c ? c : nb(b);
}
;class pb {
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
;class qb {
  constructor() {
    this.a = [];
    this.b = !0;
    this.f = {generatedLine:-1, generatedColumn:0, name:null, originalColumn:null, originalLine:null, source:null};
  }
  add(a) {
    {
      var b = this.f;
      const c = b.generatedLine, d = b.generatedColumn, f = a.generatedLine, e = a.generatedColumn;
      b = f > c || f == c && e >= d || 0 >= Q(b, a);
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
function rb(a, b, c) {
  null != a.b && (b = ob(a.b, b));
  c ? (a.a || (a.a = Object.create(null)), a.a[b] = c) : a.a && (delete a.a[b], 0 === Object.keys(a.a).length && (a.a = null));
}
function sb(a, b, c) {
  return b.map(function(d) {
    if (!this.a) {
      return null;
    }
    c && (d = ob(c, d));
    return Object.prototype.hasOwnProperty.call(this.a, d) ? this.a[d] : null;
  }, a);
}
class tb {
  constructor(a = {}) {
    const {file:b, sourceRoot:c, skipValidation:d = !1} = a;
    this.I = b;
    this.b = c;
    this.aa = d;
    this.o = new pb;
    this.f = new pb;
    this.K = new qb;
    this.a = null;
  }
  toJSON() {
    const a = this.o.a.slice();
    var b = this.f.a.slice();
    {
      var c = 0;
      let e = 1, g = 0, h = 0, l = 0, k = 0, n = "", m;
      let p;
      var d = this.K;
      d.b || (d.a.sort(Q), d.b = !0);
      d = d.a;
      for (let q = 0, r = d.length; q < r; q++) {
        var f = d[q];
        m = "";
        if (f.generatedLine !== e) {
          for (c = 0; f.generatedLine !== e;) {
            m += ";", e++;
          }
        } else {
          if (0 < q) {
            if (!Q(f, d[q - 1])) {
              continue;
            }
            m += ",";
          }
        }
        m += O(f.generatedColumn - c);
        c = f.generatedColumn;
        null != f.source && (p = this.o.indexOf(f.source), m += O(p - k), k = p, m += O(f.originalLine - 1 - h), h = f.originalLine - 1, m += O(f.originalColumn - g), g = f.originalColumn, null != f.name && (f = this.f.indexOf(f.name), m += O(f - l), l = f));
        n += m;
      }
      c = n;
    }
    b = {version:3, sources:a, names:b, mappings:c};
    this.I && (b.file = this.I);
    this.b && (b.sourceRoot = this.b);
    this.a && (b.sourcesContent = sb(this, a, this.b));
    return b;
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
}
;function ub(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const b = a.re instanceof RegExp;
  a = -1 != ["string", "function"].indexOf(typeof a.replacement);
  return b && a;
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
    return b.filter(ub).reduce((d, {re:f, replacement:e}) => {
      if (this.c) {
        return d;
      }
      if ("string" == typeof e) {
        return d = d.replace(f, e);
      }
      {
        let g;
        return d.replace(f, (h, ...l) => {
          g = Error();
          try {
            return this.c ? h : e.call(this, h, ...l);
          } catch (k) {
            S(g, k);
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
;const vb = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), wb = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`, xb = (a, b) => Object.keys(a).reduce((c, d) => {
  {
    var f = a[d];
    const {getReplacement:e = wb, getRegex:g = vb} = b || {}, h = g(d);
    f = {name:d, re:f, regExp:h, getReplacement:e, map:{}, lastIndex:0};
  }
  return {...c, [d]:f};
}, {}), U = a => {
  var b = [];
  const c = a.map;
  return {re:a.regExp, replacement(d, f) {
    d = c[f];
    delete c[f];
    f = Array.isArray(b) ? b : [b];
    return T(d, f);
  }};
}, V = a => {
  const b = a.map, c = a.getReplacement, d = a.name;
  return {re:a.re, replacement(f) {
    const e = a.lastIndex;
    b[e] = f;
    a.lastIndex += 1;
    return c(d, e);
  }};
};
async function yb(a, b) {
  return zb(a, b);
}
class Ab extends Za {
  constructor(a, b) {
    super(b);
    this.rules = (Array.isArray(a) ? a : [a]).filter(ub);
    this.c = !1;
    this.a = b;
  }
  async replace(a, b) {
    const c = new Ab(this.rules, this.a);
    b && Object.assign(c, b);
    a = await yb(c, a);
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
        const f = [];
        let e;
        const g = b.replace(c, (h, ...l) => {
          e = Error();
          try {
            if (this.c) {
              return f.length ? f.push(Promise.resolve(h)) : h;
            }
            const k = d.call(this, h, ...l);
            k instanceof Promise && f.push(k);
            return k;
          } catch (k) {
            S(e, k);
          }
        });
        if (f.length) {
          try {
            const h = await Promise.all(f);
            b = b.replace(c, () => h.shift());
          } catch (h) {
            S(e, h);
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
      a = F(d.stack), d.stack = a, c(d);
    }
  }
}
async function zb(a, b) {
  b instanceof Ya ? b.pipe(a) : a.end(b);
  return await cb(a);
}
;const Bb = /\/\*(?:[\s\S]+?)\*\//g, Cb = /\/\/(.+)/gm;
const Eb = (a = []) => {
  const {comments:b, inlineComments:c, strings:d, literals:f, escapes:e, regexes:g, regexGroups:h} = xb({comments:Bb, inlineComments:Cb, strings:/(["'])(.*?)\1/gm, literals:/`([\s\S]*?)`/gm, escapes:/\\[\\`'"/]/g, regexes:/\/(.+?)\//gm, regexGroups:/\[(.*?)\]/gm}), l = [b, c, d, f, e, g, h], [k, n, m, p, q, r, u] = l.map(V), [w, D, ca, da, ea, ec, fc] = l.map(gc => U(gc));
  return {rules:[q, k, n, m, u, r, p, Db, ...a, da, ec, fc, ca, D, w, ea], markers:{literals:f, strings:d, comments:b, inlineComments:c, escapes:e, regexes:g, regexGroups:h}};
}, Db = {re:/./, replacement(a) {
  this.stopProcessing && this.brake();
  return a;
}};
const Fb = ({file:a, u:b, O:c, sourceRoot:d}) => {
  const f = new tb({file:a, sourceRoot:d});
  b.replace(Bb, (e, g) => {
    if ("\n" == b[g + e.length]) {
      return "\n".repeat(e.split("\n").length - 1);
    }
    g = e.split("\n");
    e = g.length - 1;
    g = " ".repeat(g[e].length);
    return `${"\n".repeat(e)}${g}`;
  }).replace(Cb, e => " ".repeat(e.length)).split("\n").forEach((e, g) => {
    const h = g + 1;
    e.replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, (l, k) => {
      if (0 != k || !/^\s+$/.test(l)) {
        l = {line:h, column:k};
        {
          let {J:n, N:m = null, source:p = null, name:q = null} = {J:l, source:c, N:l};
          if (!n) {
            throw Error('"generated" is a required argument');
          }
          if (!f.aa) {
            if (m && "number" != typeof m.line && "number" != typeof m.column) {
              throw Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
            }
            if (!(n && "line" in n && "column" in n && 0 < n.line && 0 <= n.column && !m && !p && !q || n && "line" in n && "column" in n && m && "line" in m && "column" in m && 0 < n.line && 0 <= n.column && 0 < m.line && 0 <= m.column && p)) {
              throw Error("Invalid mapping: " + JSON.stringify({J:n, source:p, N:m, name:q}));
            }
          }
          p && (p = `${p}`, f.o.has(p) || f.o.add(p));
          q && (q = `${q}`, f.f.has(q) || f.f.add(q));
          f.K.add({generatedLine:n.line, generatedColumn:n.column, originalLine:m ? m.line : null, originalColumn:m ? m.column : null, source:p, name:q});
        }
      }
    });
  });
  rb(f, c, b);
  return f.toString();
};
function Gb({source:a, ba:b, name:c, destination:d, file:f, u:e}) {
  a = y(b, a);
  f = Fb({file:f, u:e, O:a});
  c = `${c}.map`;
  Aa(d, `\n//# sourceMappingURL=${c}`);
  b = x(b, c);
  E(b, f);
}
;const Hb = a => `if (${a} && ${a}.__esModule) ${a} = ${a}.default`, Ib = (a, b, c, d = null) => `${a.replace(/(\s+)from(\s+)([\s\S])*/, (f, e, g) => `${e}=${g}`)}${d ? d : "r" + `equire(${b}${c}${b})`}`, W = (a, b = {}) => {
  if (!b.import) {
    return a;
  }
  ({import:{replacement:b}} = b);
  if (!b) {
    return a;
  }
  const c = b.to;
  if (void 0 === b.from) {
    throw Error('No "from" option is given for the replacement.');
  }
  if (void 0 === c) {
    throw Error('No "to" option is given for the replacement.');
  }
  return a.replace(new RegExp(b.from), b.to);
}, Jb = /(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%)/, Kb = (a = {import:{}}) => {
  try {
    return "always" == a.import.esCheck;
  } catch (b) {
    return !1;
  }
}, Lb = (a, b = {import:{}}) => {
  try {
    return b.import.alamodeModules.includes(a);
  } catch (c) {
    return !1;
  }
};
const Nb = async a => {
  var b = await M(a);
  let c = a, d = !1;
  if (!b) {
    if (c = await Mb(a), !c) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (b.isDirectory()) {
      b = !1;
      let f;
      a.endsWith("/") || (f = c = await Mb(a), b = !0);
      if (!f) {
        c = await Mb(x(a, "index"));
        if (!c) {
          throw Error(`${b ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? y("", c) : c, fa:d};
}, Mb = async a => {
  a = `${a}.js`;
  let b = await M(a);
  b || (a = `${a}x`);
  if (b = await M(a)) {
    return a;
  }
};
let Ob;
const Qb = async(a, b, c = {}) => {
  Ob || ({root:Ob} = ya(process.cwd()));
  const {fields:d, soft:f = !1} = c;
  var e = x(a, "node_modules", b);
  e = x(e, "package.json");
  const g = await M(e);
  if (g) {
    a = await Pb(e, d);
    if (void 0 === a) {
      throw Error(`The package ${y("", e)} does export the module.`);
    }
    if (!a.entryExists && !f) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:h, version:l, packageName:k, main:n, entryExists:m, ...p} = a;
    return {entry:y("", h), packageJson:y("", e), ...l ? {version:l} : {}, packageName:k, ...n ? {hasMain:!0} : {}, ...m ? {} : {entryExists:!1}, ...p};
  }
  if (a == Ob && !g) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return Qb(x(za(a), ".."), b, c);
}, Pb = async(a, b = []) => {
  const c = await L(a);
  let d, f, e, g, h;
  try {
    ({module:d, version:f, name:e, main:g, ...h} = JSON.parse(c)), h = b.reduce((k, n) => {
      k[n] = h[n];
      return k;
    }, {});
  } catch (k) {
    throw Error(`Could not parse ${a}.`);
  }
  a = v(a);
  b = d || g;
  if (!b) {
    if (!await M(x(a, "index.js"))) {
      return;
    }
    b = g = "index.js";
  }
  a = x(a, b);
  let l;
  try {
    ({path:l} = await Nb(a)), a = l;
  } catch (k) {
  }
  return {entry:a, version:f, packageName:e, main:!d && g, entryExists:!!l, ...h};
};
const Rb = _module.builtinModules;
const Sb = a => a.replace(/(\s+)as(\s+)/g, (b, c, d) => `${1 == c.split("\n").length ? "" : c}:${d}`), Tb = (a, b, c = {}) => {
  if (!c.import) {
    return null;
  }
  ({import:{stdlib:c}} = c);
  if (c) {
    const d = c.path;
    return c.packages.includes(b) ? y(v(a), d).replace(/\\/g, "/").replace(/.js$/, "") : null;
  }
  return null;
}, Wb = (a, b, c, d, f, e, g) => {
  const {t:h, w:l} = Ub(c, d, f, e, g);
  a = Vb(a, b, f, e, d);
  return `${[h, a, ...g ? [] : [l]].filter(k => k).join("; ")};`;
}, Xb = (a, b) => {
  if (Kb(b)) {
    return !1;
  }
  if (/^[./]/.test(a) || Rb.includes(a) || Lb(a, b)) {
    return !0;
  }
}, Yb = async(a, b, c, d) => {
  if (Xb(a, b)) {
    return !0;
  }
  if (a in d) {
    return d[a];
  }
  if (c) {
    try {
      const {alamode:f} = await Qb(v(c), a, {fields:["alamode"]});
      d[a] = !!f;
      return f;
    } catch (f) {
      return !1;
    }
  }
}, Ub = (a, b, c, d, f) => {
  if (!a) {
    return {};
  }
  b = b ? {d:`${b} = ${"r" + `equire(${c}${d}${c})`}`, w:Hb(b)} : void 0;
  const {d:e, w:g} = b;
  a = a.replace(",", "").replace(/([^\s]+)/, e);
  return {t:`${f ? "const" : "let"}${a}`, w:g};
}, Vb = (a, b, c, d, f) => {
  if (!a) {
    return null;
  }
  b = Ib(b, c, d, f);
  return `const${Sb(a)}${b}`;
};
const Zb = [{re:new RegExp(`${/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?/.source}${Jb.source}`, "gm"), replacement:function(a, b, c, d, f, e) {
  const [, g, h] = /(["'`])(.+?)\1/.exec(this.markers.strings.map[e]);
  if (this.renameOnly) {
    return e = W(h, this.config), a.replace(/%%_RESTREAM_STRINGS_REPLACEMENT_\d+_%%/, `${g}${e}${g}`);
  }
  const l = (a = Tb(this.file, h, this.config)) || W(h, this.config);
  a && (d ? b && (d = d.replace(/{/, `{ ${c},`), d = b.replace(/\S/g, " ") + d, c = b = void 0) : (d = b.replace(/(\S+)/, "{ $1 }"), c = b = void 0));
  this.L || (this.L = {});
  if (this.async) {
    return Yb(l, this.config, this.file, this.L).then(k => Wb(d, f, b, c, g, l, k));
  }
  a = Xb(l, this.config);
  return Wb(d, f, b, c, g, l, a);
}}, {re:new RegExp(`${/(import\s+)/.source}${/(%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%)/.source}`, "gm"), replacement:function(a, b, c, d) {
  const [, f, e] = /(["'`])(.+?)\1/.exec(this.markers.strings.map[d]);
  c = W(e, this.config);
  return this.renameOnly ? (b = W(e, this.config), a.replace(/%%_RESTREAM_STRINGS_REPLACEMENT_\d+_%%/, `${f}${b}${f}`)) : b.replace(/ /g, "").replace("import", "require(") + `${f}${c}${f});`;
}}, {re:new RegExp(`${/( *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+(.+?))/.source}${Jb.source}`, "gm"), replacement:function(a, b, c, d, f, e) {
  const [, g, h] = /(["'`])(.+?)\1/.exec(this.markers.strings.map[e]);
  e = W(h, this.config);
  if (this.renameOnly) {
    return a.replace(/%%_RESTREAM_STRINGS_REPLACEMENT_\d+_%%/, `${g}${e}${g}`);
  }
  a = Ib(f, g, e);
  ({length:b} = b.split("\n"));
  b = "\n".repeat(b - 1);
  e = /^[./]/.test(e) && !Kb(this.config);
  return `${c ? [`${b}${e ? "const" : "let"} ${d} = ${c}${a}`, ...e ? [] : [Hb(c)]].join("; ") : `${b}const ${d}${a}`};`;
}}];
const $b = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|await|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/, ac = /(?:[$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D])(?:[$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*/;
const bc = a => a.split(/,\s*/).filter(b => b), cc = a => a.reduce((b, c) => {
  const [d, f = d] = c.split(/\s+as\s+/);
  return {...b, [f.trim()]:d.trim()};
}, {}), dc = a => {
  a.replace($b, () => {
    throw Error(`Detected reserved identifier "${a}".`);
  });
}, hc = a => {
  ({length:a} = a.split("\n"));
  return "\n".repeat(a - 1);
}, X = (a, b = !0) => b ? hc(a) : a.split("\n").map(({length:c}, d, {length:f}) => d == f - 1 ? " ".repeat(c) : "").join("\n");
const ic = (a, b, c) => `${a.replace(/(\s+)from(\s+)([\s\S])*/, (d, f, e) => `${f}=${e}`)}${"r" + `equire(${b}${c}${b});`}`;
function jc(a, b, c, d, f) {
  a = this.noSourceMaps ? "" : X(a);
  const e = `$${b.replace(/[-/]/g, "_").replace(/[^\w\d-]/g, "")}`;
  b = ic(c, d, b);
  b = `${a}const ${e}${b}`;
  f = bc(f).reduce((g, h) => {
    const [l, k] = h.split(/\s+as\s+/);
    h = l.trim();
    g[(k ? k.trim() : null) || h] = "default" == h ? e : `${e}.${h}`;
    return g;
  }, {});
  this.emit("export", f);
  return b;
}
;const kc = (a = {}) => {
  const {"default":b, ...c} = a, d = b ? `module.exports = ${b}` : "", f = Object.keys(c).map(e => `module.exports.${e} = ${a[e]}`);
  return [d, ...f].filter(e => e).join("\n");
};
const lc = [{re:/[\s\S]*/, replacement(a) {
  this.exports = {};
  this.on("export", b => {
    this.exports = {...this.exports, ...b};
  });
  return a;
}}, {re:new RegExp(`^( *export\\s+?)( *${/(?:let|const|var|class|function\s*\*?|async +function)/.source}\\s+((?:${ac.source}\\s*,?\\s*)+))`, "gm"), replacement:function(a, b, c, d) {
  d.split(/,\s*/).forEach(f => {
    f = f.trim().replace(/\s+extends\s+.+/, "");
    dc(f);
    this.emit("export", {[f]:f});
  });
  return this.noSourceMaps ? c : `${X(b, !1)}${c}`;
}}, {re:new RegExp(`${/^( *export\s+{([^}]+?)})/.source}${/(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%|%%_RESTREAM_LITERALS_REPLACEMENT_(\d+)_%%)/.source}`, "gm"), replacement:function(a, b, c, d, f, e) {
  const [, g, h] = /(["'`])(.+?)\1/.exec(e ? this.markers.literals.map[e] : this.markers.strings.map[f]);
  return jc.call(this, b, h, d, g, c);
}}, {re:/^( *export\s+{([^}]+?)} *)(\n?)/gm, replacement:function(a, b, c, d) {
  a = bc(c);
  a = cc(a);
  this.emit("export", a);
  return this.noSourceMaps ? "" : `${X(b)}${d ? d : ""}`;
}}, {re:new RegExp(`^( *export\\s+default\\s+?)( *${/(?:class|function\s*\*?|async +function)/.source}\\s+(${ac.source}))`, "m"), replacement:function(a, b, c, d) {
  a = d.trim();
  dc(a);
  this.emit("export", {"default":a});
  return this.noSourceMaps ? c : `${X(b, !1)}${c}`;
}}, {re:/^( *)(export\s+)(default\s+)/m, replacement:function(a, b, c, d) {
  a = c.replace(/export ?/, "module.");
  d = d.replace(/default ?/, "exports=");
  return `${b}${a}${d}`;
}}, {re:/[\s\S]*/, replacement(a) {
  const b = kc(this.exports);
  return `${a}${b ? `\n\n${b}` : ""}`;
}}];
class mc extends Ab {
  constructor(a, b = {}) {
    const c = hb();
    {
      var d = [...Zb, ...lc];
      const {rules:k, markers:n} = Eb(d);
      d = {rules:k, markers:n};
    }
    const {rules:f, markers:e} = d;
    super(f);
    const {noSourceMaps:g = !1, debug:h = !1, renameOnly:l = !1} = b;
    this.markers = e;
    this.config = c;
    this.file = a;
    this.noSourceMaps = g;
    this.async = !0;
    this.renameOnly = l;
    this.stopProcessing = h;
  }
}
const nc = async({source:a, destination:b, writable:c, debug:d, noSourceMaps:f, renameOnly:e}) => {
  const g = new mc(a, {noSourceMaps:f, debug:d, renameOnly:e});
  d = await L(a);
  g.end(d);
  await Promise.all([eb({source:a, ...c ? {writable:c} : {destination:b}, readable:g}), new Promise((h, l) => g.on("finish", h).on("error", l))]);
  return d;
};
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const oc = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90};
function Y(a, b) {
  return (b = oc[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const pc = vm.Script;
const qc = (a, b) => {
  const [c, , d] = a.split("\n");
  a = parseInt(c.replace(/.+?(\d+)$/, (e, g) => g)) - 1;
  const f = d.indexOf("^");
  ({length:b} = b.split("\n").slice(0, a).join("\n"));
  return b + f + (a ? 1 : 0);
};
const rc = a => {
  try {
    new pc(a);
  } catch (b) {
    const c = b.stack;
    if (!/Unexpected token '?</.test(b.message)) {
      throw b;
    }
    return qc(c, a);
  }
  return null;
};
const sc = a => {
  [, a] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || [];
  return a;
}, uc = (a, {D:b = !1, classNames:c = [], renameMap:d = {}} = {}) => {
  let f = 0;
  const e = [];
  let g;
  T(a, [{re:/[{}]/g, replacement(p, q) {
    p = "}" == p;
    const r = !p;
    if (!f && p) {
      throw Error("A closing } is found without opening one.");
    }
    f += r ? 1 : -1;
    1 == f && r ? g = {open:q} : 0 == f && p && (g.close = q, e.push(g), g = {});
  }}]);
  if (f) {
    throw Error(`Unbalanced props (level ${f}) ${a}`);
  }
  const h = {}, l = [], k = {};
  var n = e.reduce((p, {open:q, close:r}) => {
    p = a.slice(p, q);
    const [, u, w, D, ca] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(p) || [];
    q = a.slice(q + 1, r);
    if (!w && !/\s*\.\.\./.test(q)) {
      throw Error("Could not detect prop name");
    }
    w ? h[w] = q : l.push(q);
    k[w] = {before:u, G:D, F:ca};
    q = p || "";
    q = q.slice(0, q.length - (w || "").length - 1);
    const {C:da, m:ea} = tc(q);
    Object.assign(h, da);
    Object.assign(k, ea);
    return r + 1;
  }, 0);
  if (e.length) {
    n = a.slice(n);
    const {C:p, m:q} = tc(n);
    Object.assign(h, p);
    Object.assign(k, q);
  } else {
    const {C:p, m:q} = tc(a);
    Object.assign(h, p);
    Object.assign(k, q);
  }
  let m = h;
  if (b || Array.isArray(c) && c.length || Object.keys(c).length) {
    ({...m} = h);
    const p = [];
    Object.keys(m).forEach(q => {
      const r = () => {
        p.push(q);
        delete m[q];
      };
      if (Array.isArray(c) && c.includes(q)) {
        r();
      } else {
        if (c[q]) {
          r();
        } else {
          if (b) {
            const u = q[0];
            u.toUpperCase() == u && r();
          }
        }
      }
    });
    p.length && (n = p.map(q => q in d ? d[q] : q).join(" "), m.className ? /[`"']$/.test(m.className) ? m.className = m.className.replace(/([`"'])$/, ` ${n}$1`) : m.className += `+' ${n}'` : m.i ? /[`"']$/.test(m.i) ? m.i = m.i.replace(/([`"'])$/, ` ${n}$1`) : m.i += `+' ${n}'` : m.className = `'${n}'`);
  }
  return {A:m, v:l, m:k};
}, tc = a => {
  const b = [], c = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]*?)\5/g, (d, f, e, g, h, l, k, n) => {
    c[e] = {before:f, G:g, F:h};
    b.push({s:n, name:e, R:`${l}${k}${l}`});
    return "%".repeat(d.length);
  }).replace(/(\s*)([^\s%]+)/g, (d, f, e, g) => {
    c[e] = {before:f};
    b.push({s:g, name:e, R:"true"});
  });
  return {C:[...b.reduce((d, {s:f, name:e, R:g}) => {
    d[f] = [e, g];
    return d;
  }, [])].filter(Boolean).reduce((d, [f, e]) => {
    d[f] = e;
    return d;
  }, {}), m:c};
}, vc = (a, b = [], c = !1, d = {}, f = "") => {
  const e = Object.keys(a);
  return e.length || b.length ? `{${e.reduce((g, h) => {
    const l = a[h], k = c || -1 != h.indexOf("-") ? `'${h}'` : h, {before:n = "", G:m = "", F:p = ""} = d[h] || {};
    return [...g, `${n}${k}${m}:${p}${l}`];
  }, b).join(",")}${f}}` : "{}";
}, wc = (a = "") => {
  [a] = a;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}, xc = (a, b = {}, c = [], d = [], f = !1, e = null, g = {}, h = "") => {
  const l = wc(a), k = l ? a : `'${a}'`;
  if (!Object.keys(b).length && !c.length && !d.length) {
    return `h(${k})`;
  }
  const n = l && "dom" == f ? !1 : f;
  l || !d.length || f && "dom" != f || e && e(`JSX: destructuring ${d.join(" ")} is used without quoted props on HTML ${a}.`);
  a = vc(b, d, n, g, h);
  b = c.reduce((m, p, q) => {
    q = c[q - 1];
    let r = "";
    q && /^\/\*[\s\S]*\*\/$/.test(q) ? r = "" : q && /\S/.test(q) && (r = ",");
    return `${m}${r}${p}`;
  }, "");
  return `h(${k},${a}${b ? `,${b}` : ""})`;
};
const yc = (a, b = []) => {
  let c = 0, d;
  a = T(a, [...b, {re:/[<>]/g, replacement(f, e) {
    if (d) {
      return f;
    }
    const g = "<" == f;
    c += g ? 1 : -1;
    0 == c && !g && (d = e);
    return f;
  }}]);
  if (c) {
    throw Error(1);
  }
  return {da:a, H:d};
}, Ac = a => {
  const b = sc(a);
  let c;
  const {T:d} = xb({T:/=>/g});
  try {
    ({da:l, H:c} = yc(a, [V(d)]));
  } catch (k) {
    if (1 === k) {
      throw Error(`Could not find the matching closing > for ${b}.`);
    }
  }
  const f = l.slice(0, c + 1);
  var e = f.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(e)) {
    return a = e.replace(/\/\s*>$/, ""), e = "", new zc({h:f.replace(d.regExp, "=>"), g:a.replace(d.regExp, "=>"), content:"", tagName:b});
  }
  a = e.replace(/>$/, "");
  e = c + 1;
  c = !1;
  let g = 1, h;
  T(l, [{re:new RegExp(`[\\s\\S](?:<\\s*${b}(\\s+|>)|/\\s*${b}\\s*>)`, "g"), replacement(k, n, m, p) {
    if (c) {
      return k;
    }
    n = !n && k.endsWith(">");
    const q = !n;
    if (q) {
      p = p.slice(m);
      const {H:r} = yc(p.replace(/^[\s\S]/, " "));
      p = p.slice(0, r + 1);
      if (/\/\s*>$/.test(p)) {
        return k;
      }
    }
    g += q ? 1 : -1;
    0 == g && n && (c = m, h = c + k.length);
    return k;
  }}]);
  if (g) {
    throw Error(`Could not find the matching closing </${b}>.`);
  }
  e = l.slice(e, c);
  var l = l.slice(0, h).replace(d.regExp, "=>");
  return new zc({h:l, g:a.replace(d.regExp, "=>"), content:e.replace(d.regExp, "=>"), tagName:b});
};
class zc {
  constructor(a) {
    this.h = a.h;
    this.g = a.g;
    this.content = a.content;
    this.tagName = a.tagName;
  }
}
;const Bc = a => {
  let b = "", c = "";
  a = a.replace(/^(\r?\n\s*)([\s\S]+)?/, (d, f, e = "") => {
    b = f;
    return e;
  }).replace(/([\s\S]+?)?(\r?\n\s*)$/, (d, f = "", e = "") => {
    c = e;
    return f;
  });
  return `${b}${a ? `\`${a}\`` : ""}${c}`;
}, Dc = a => {
  const b = [];
  let c = {}, d = 0, f = 0;
  T(a, [{re:/[<{}]/g, replacement(e, g) {
    if (!(g < f)) {
      if (/[{}]/.test(e)) {
        d += "{" == e ? 1 : -1, 1 == d && void 0 == c.from ? c.from = g : 0 == d && (c.to = g + 1, c.X = a.slice(c.from + 1, g), b.push(c), c = {});
      } else {
        if (d) {
          return e;
        }
        e = Ac(a.slice(g));
        f = g + e.h.length;
        c.Y = e;
        c.to = f;
        c.from = g;
        b.push(c);
        c = {};
      }
    }
  }}, {}]);
  return b.length ? Cc(a, b) : [Bc(a)];
}, Cc = (a, b) => {
  let c = 0;
  b = b.reduce((d, {from:f, to:e, X:g, Y:h}) => {
    (f = a.slice(c, f)) && d.push(Bc(f));
    c = e;
    g ? d.push(g) : h && d.push(h);
    return d;
  }, []);
  if (c < a.length) {
    const d = a.slice(c, a.length);
    d && b.push(Bc(d));
  }
  return b;
};
const Fc = (a, b = {}) => {
  var c = b.quoteProps, d = b.warn;
  const f = b.prop2class, e = b.classNames, g = b.renameMap;
  var h = rc(a);
  if (null === h) {
    return a;
  }
  var l = a.slice(h);
  const {g:k = "", content:n, tagName:m, h:{length:p}} = Ac(l);
  l = Ec(n, c, d, b);
  const {A:q, v:r, m:u} = uc(k.replace(/^ */, ""), {D:f, classNames:e, renameMap:g});
  d = xc(m, q, l, r, c, d, u, /\s*$/.exec(k) || [""]);
  c = a.slice(0, h);
  a = a.slice(h + p);
  h = p - d.length;
  0 < h && (d = `${" ".repeat(h)}${d}`);
  a = `${c}${d}${a}`;
  return Fc(a, b);
}, Ec = (a, b = !1, c = null, d = {}) => a ? Dc(a).reduce((f, e) => {
  if (e instanceof zc) {
    const {g:l = "", content:k, tagName:n} = e, {A:m, v:p} = uc(l, {D:d.prop2class, classNames:d.classNames, renameMap:d.renameMap});
    e = Ec(k, b, c, d);
    e = xc(n, m, e, p, b, c);
    return [...f, e];
  }
  const g = rc(e);
  if (g) {
    var h = e.slice(g);
    const {h:{length:l}, g:k = "", content:n, tagName:m} = Ac(h), {A:p, v:q} = uc(k, {D:d.prop2class, classNames:d.classNames, renameMap:d.renameMap});
    h = Ec(n, b, c, d);
    h = xc(m, p, h, q, b, c);
    const r = e.slice(0, g);
    e = e.slice(g + l);
    return [...f, `${r}${h}${e}`];
  }
  return [...f, e];
}, []) : [];
const Gc = (a, b = {}) => {
  const {e:c, U:d, V:f, s:e, Z:g, $:h} = xb({U:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, V:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg, s:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, Z:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, $:/^ *import\s+['"].+['"]/gm}, {getReplacement(l, k) {
    return `/*%%_RESTREAM_${l.toUpperCase()}_REPLACEMENT_${k}_%%*/`;
  }, getRegex(l) {
    return new RegExp(`/\\*%%_RESTREAM_${l.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, "g");
  }});
  a = T(a, [V(f), V(d), V(c), V(e), V(g), V(h)]);
  b = Fc(a, b);
  return T(b, [U(f), U(d), U(c), U(e), U(g), U(h)]);
};
function Hc(a = "") {
  if (document) {
    var b = document.head, c = document.createElement("style");
    c.type = "text/css";
    c.styleSheet ? c.styleSheet.cssText = a : c.appendChild(document.createTextNode(a));
    b.appendChild(c);
  }
}
const Ic = async(a, b, c, d) => {
  var f = await L(a);
  f = await Gc(f, {quoteProps:"dom", warn(e) {
    console.warn(Y(e, "yellow"));
    console.warn(Y(" in %s", "grey"), a);
  }});
  f = f.replace(/^import (['"])(.+?\.css)\1/gm, (e, g, h) => {
    try {
      var l = x(c, "css-injector.js");
      Ca(l) || E(l, `export default ${Hc.toString()}`);
      const k = x(v(a), h);
      h = `${h}.js`;
      const n = x(c, h);
      let m = y(v(n), l);
      m.startsWith(".") || (m = `./${m}`);
      const p = Ea(k);
      l = `import __$styleInject from '${m}'\n\n`;
      l += `__$styleInject(\`${p}\`)`;
      E(n, l);
      console.error("Added %s in %s", Y(h, "yellow"), a);
      return `import ${g}${h}${g}`;
    } catch (k) {
      return console.error("Could not include CSS in %s:\n%s", a, Y(k.message, "red")), e;
    }
  });
  return b ? `${d ? "const { h } = requir" + `e('${b}');` : `import { h } from '${b}'`}
${f}` : f;
};
const Jc = gb("alamode"), Kc = (a, b) => a.includes(b) || a.some(c => b.startsWith(`${c}/`)), Z = async a => {
  const {input:b, l:c = ".", name:d, B:f = "-", noSourceMaps:e, extensions:g, debug:h, ca:l = d, renameOnly:k} = a;
  var n = x(c, d);
  a = "-" == f;
  const m = x(b, n), p = a ? null : x(f, c);
  a = a ? "-" : x(p, l);
  Jc(n);
  await I(a);
  if (!Lc(n, g)) {
    return await eb({source:m, destination:a}), a;
  }
  const q = await nc({source:m, destination:a, debug:h, noSourceMaps:e, renameOnly:k});
  if ("-" != f) {
    {
      const r = C(m).mode;
      Ba(a, r);
    }
    if (e) {
      return a;
    }
    Gb({destination:a, file:n, name:d, ba:p, source:m, u:q});
  } else {
    e || h || (n = Fb({file:n, u:q, O:y(p || "", m)}), n = "/" + `/# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(n).toString("base64")}`, console.log("\n\n%s", n));
  }
  return a;
}, Nc = async a => {
  const {input:b, B:c, l:d = ".", M:f, P:e, renameOnly:g} = a, h = x(b, d), l = x(c, d), {content:k} = await K(h);
  await Object.keys(k).reduce(async(n, m) => {
    await n;
    n = x(h, m);
    var {type:p} = k[m];
    "File" == p ? Kc(a.ignore, x(d, m)) || (f && /jsx$/.test(m) ? (a.j ? (p = m.replace(/jsx$/, "js"), n = await Z({...a, name:m, ca:p}), m = p) : g && (n = await Z({...a, name:m, renameOnly:g})), p = x(l, m), await Mc(n, e, c, p, {l:d, name:m, ignore:a.ignore, j:a.j})) : f && a.j ? await Z({...a, name:m}) : f ? await Xa(n, l) : await Z({...a, name:m})) : "Directory" == p && (m = x(d, m), await Nc({...a, l:m}));
  }, {});
}, Mc = async(a, b, c, d, {j:f, l:e, name:g, ignore:h} = {}) => {
  if (h && (e = x(e, g), Kc(h, e))) {
    return;
  }
  a = await Ic(a, b, c, f);
  b = d.replace(/jsx$/, "js");
  if ("-" == d) {
    return a;
  }
  await I(b);
  await db(b, a);
}, Lc = (a, b) => b.some(c => a.endsWith(c)), Oc = async a => {
  const {input:b, B:c = "-", M:d, P:f} = a;
  if (!b) {
    throw Error("Please specify the source file or directory.");
  }
  var e = C(b);
  if (e.isDirectory()) {
    if ("-" == c) {
      throw Error("Output to stdout is only for files.");
    }
    e = hb();
    await Nc({...a, renameOnly:e.import && e.import.replacement});
  } else {
    if (e.isFile()) {
      if (e = xa(b), d && /jsx$/.test(e)) {
        if (a = "-" == c ? "-" : x(c, e), e = await Mc(b, f, c, a), "-" == a) {
          return console.log(e);
        }
      } else {
        await Z({...a, input:v(b), l:"./", name:e});
      }
    }
  }
  "-" != c && process.stdout.write(`Transpiled code saved to ${c}\n`);
};
const Pc = async a => {
  var b = await L(a);
  const c = new Ab([{re:/^ *(?:var|let|const)\s+(\S+?)(\s*)=(\s*)require\((['"])(.+?)\4\)/gm, replacement(d, f, e, g, h, l) {
    return `import ${f}${e}from${g}${h}${l}${h}`;
  }}, {re:/^ *(?:var|let|const)(\s+{\s*)([\s\S]+?)(\s*})(\s*)=(\s*)require\((['"])(.+?)\6\)/gm, replacement(d, f, e, g, h, l, k, n) {
    d = e.replace(/(\s*):(\s*)/g, (m, p, q) => `${p || " "}as${q || " "}`);
    return `import${f}${d}${g}${h}from${l}${k}${n}${k}`;
  }}, {re:/^( *)(?:module\.)?exports\s*=/gm, replacement(d, f) {
    return `${f}export default`;
  }}, {re:/^( *)(?:module\.)?exports\.(\S+?)\s*=\s*([^\s;]+)/gm, replacement(d, f, e, g) {
    return e == g ? `${f}export { ${e} }` : `${f}export const ${e} = ${g}`;
  }}]);
  b = await zb(c, b);
  await db(a, b);
};
async function Qc(a) {
  a = a.input;
  if (!a) {
    throw Error("Please specify the source file or directory to refactor.");
  }
  var b = C(a);
  b.isDirectory() ? ({content:b} = await K(a), a = Ta(b, a), await Promise.all(a.map(async c => {
    await Pc(c);
  }))) : b.isFile() && await Pc(a);
}
;function Rc(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:f} = a;
  a = Object.keys(b);
  const e = Object.values(b), [g] = a.reduce(([k = 0, n = 0], m) => {
    const p = b[m].split("\n").reduce((q, r) => r.length > q ? r.length : q, 0);
    p > n && (n = p);
    m.length > k && (k = m.length);
    return [k, n];
  }, []), h = (k, n) => {
    n = " ".repeat(n - k.length);
    return `${k}${n}`;
  };
  a = a.reduce((k, n, m) => {
    m = e[m].split("\n");
    n = h(n, g);
    const [p, ...q] = m;
    n = `${n}\t${p}`;
    const r = h("", g);
    m = q.map(u => `${r}\t${u}`);
    return [...k, n, ...m];
  }, []).map(k => `\t${k}`);
  const l = [c, `  ${d || ""}`].filter(k => k ? k.trim() : k).join("\n\n");
  a = `${l ? `${l}\n` : ""}
${a.join("\n")}
`;
  return f ? `${a}
  Example:

    ${f}
` : a;
}
;/*
 ?LaMode: transpiler of import/export statements and JSX components.

 Copyright (C) 2020  Art Deco Code Limited

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
if (sa) {
  {
    const a = fa(ha), b = Rc({usage:a, description:Y("\u00c0LaMode", "red") + "\nA tool to transpile JavaScript packages using regular expressions.\nSupports import/export and JSX transpilation.\nhttps://artdecocode.com/alamode/", line:"alamode source [-o destination] [-i dir,file] [--env env] [-s]", example:"alamode src -o build -s"});
    console.log(b);
    const c = Rc({usage:fa(ia), description:Y("JSX transpilation", "magenta") + "\nAllows to transpile JSX using RegExes.", line:"alamode source [-o destination] -j [-mpE]", example:"alamode src -o build -j -m"});
    console.log(c);
  }
  process.exit();
} else {
  ra && (console.log("v%s", require("../../package.json").version), process.exit());
}
qa && (process.env.ALAMODE_ENV = qa);
(async() => {
  try {
    const a = la ? la.split(",") : [], b = na.split(",");
    if (pa) {
      return await Qc({input:ja, ignore:a, extensions:b});
    }
    let c = !1;
    va ? c = "preact" : wa && (c = "@externs/preact");
    await Oc({input:ja, B:ka, noSourceMaps:ma, ignore:a, extensions:b, P:c, M:ta, debug:oa, j:ua});
  } catch (a) {
    if (process.env.DEBUG) {
      return console.log(a.stack);
    }
    console.log(a.message);
  }
})();

