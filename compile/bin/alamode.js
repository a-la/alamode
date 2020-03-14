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
}, ca = a => Object.keys(a).reduce((b, c) => {
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
const da = {source:{description:"The location of the input file or directory to transpile.", command:!0}, output:{description:"The location of where to save the transpiled output.", short:"o"}, ignore:{description:"Comma-separated list of files inside of `source` dir to\nignore, for example, `bin,.eslintrc`.", short:"i"}, noSourceMaps:{description:"Disable source maps.", boolean:!0, short:"s"}, extensions:{description:"Files of what extensions to transpile.", default:"js,jsx", short:"e"}, debug:{description:"Will make \u00c0LaMode stop after replacing markers.", 
boolean:!0, short:"d"}, require:{description:"Renames `require` calls into imports, and `module.exports`\nassignments to exports.\nGreat for refactoring older code.", boolean:!0, short:"r"}, env:{description:"The environment. Analogue to setting `ALAMODE_ENV`\nenv variable."}, version:{description:"Show the version number.", boolean:!0, short:"v"}, help:{description:"Display the usage information.", boolean:!0, short:"h"}}, ea = {jsx:{description:"Enable JSX mode: only update JSX syntax to use hyperscript.\nDoes not transpile `import/export` statements.", 
boolean:!0, short:"j"}, module:{description:"Works together with `jsx` to also transpile modules while\ntranspiling JSX.", boolean:!0, short:"m"}, preact:{description:'When transpiling JSX, automatically insert at the top\n`import { h } from "preact"`.', boolean:!0, short:"p"}, "preact-externs":{description:'Same as `preact`, but imports from `\uff20externs/preact`\n`import { h } from "\uff20externs/preact"`.', boolean:!0, short:"E"}}, t = function(a = {}, b = process.argv) {
  let [, , ...c] = b;
  const d = ba(c);
  c = c.slice(d.length);
  a = Object.entries(a).reduce((g, [h, k]) => {
    g[h] = "string" == typeof k ? {short:k} : k;
    return g;
  }, {});
  const e = [];
  a = Object.entries(a).reduce((g, [h, k]) => {
    let l;
    try {
      const n = k.short, m = k.boolean, p = k.number, q = k.command, r = k.multiple;
      if (q && r && d.length) {
        l = d;
      } else {
        if (q && d.length) {
          l = d[0];
        } else {
          const u = aa(c, h, n, m, p);
          ({value:l} = u);
          const w = u.index, x = u.length;
          void 0 !== w && x && e.push({index:w, length:x});
        }
      }
    } catch (n) {
      return g;
    }
    return void 0 === l ? g : {...g, [h]:l};
  }, {});
  let f = c;
  e.forEach(({index:g, length:h}) => {
    Array.from({length:h}).forEach((k, l) => {
      f[g + l] = null;
    });
  });
  f = f.filter(g => null !== g);
  Object.assign(a, {fa:f});
  return a;
}({...da, ...ea}), fa = t.source, ja = t.output, ka = t.ignore, la = t.noSourceMaps, ma = t.extensions || "js,jsx", na = t.debug, oa = t.require, pa = t.env, qa = t.version, ra = t.help, sa = t.jsx, ta = t.module, ua = t.preact, va = t["preact-externs"];
const wa = path.basename, v = path.dirname, y = path.join, xa = path.parse, A = path.relative, B = path.resolve;
const ya = fs.appendFileSync, za = fs.chmodSync, C = fs.createReadStream, D = fs.createWriteStream, Aa = fs.existsSync, E = fs.lstat, F = fs.lstatSync, Ba = fs.mkdir, Ca = fs.mkdirSync, Da = fs.readFileSync, Ea = fs.readdir, Fa = fs.readlink, Ga = fs.symlink, G = fs.writeFileSync;
const Ha = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, Ia = (a, b = !1) => Ha(a, 2 + (b ? 1 : 0)), Ja = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const H = os.EOL, Ka = os.homedir;
const La = /\s+at.*(?:\(|\s)(.*)\)?/, Ma = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, Na = Ka(), I = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(Ma.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(La);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(La, (g, h) => g.replace(h, h.replace(Na, "~"))) : f).join("\n");
};
function Oa(a, b, c = !1) {
  return function(d) {
    var e = Ja(arguments), {stack:f} = Error();
    const g = Ha(f, 2, !0), h = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${h}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = I(e);
    return Object.assign(f ? d : Error(), {message:h, stack:e});
  };
}
;function J(a) {
  var {stack:b} = Error();
  const c = Ja(arguments);
  b = Ia(b, a);
  return Oa(c, b, a);
}
;async function K(a, b, c) {
  const d = J(!0);
  if ("function" != typeof a) {
    throw Error("Function must be passed.");
  }
  if (!a.length) {
    throw Error(`Function${a.name ? ` ${a.name}` : ""} does not accept any arguments.`);
  }
  return await new Promise((e, f) => {
    const g = (k, l) => k ? (k = d(k), f(k)) : e(c || l);
    let h = [g];
    Array.isArray(b) ? h = [...b, g] : 1 < Array.from(arguments).length && (h = [b, g]);
    a(...h);
  });
}
;async function L(a) {
  const b = v(a);
  try {
    return await M(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}
async function M(a) {
  try {
    await K(Ba, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = v(a);
      await M(c);
      await M(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
function Pa(a) {
  a = v(a);
  try {
    N(a);
  } catch (b) {
    if (!/EEXIST/.test(b.message) || -1 == b.message.indexOf(a)) {
      throw b;
    }
  }
}
function N(a) {
  try {
    Ca(a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = v(a);
      N(c);
      N(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;async function Qa(a, b) {
  b = b.map(async c => {
    const d = y(a, c);
    return {lstat:await K(E, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const Ra = a => a.lstat.isDirectory(), Sa = a => !a.lstat.isDirectory();
async function O(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  const {ignore:b = []} = {};
  if (!(await K(E, a)).isDirectory()) {
    var c = Error("Path is not a directory");
    c.code = "ENOTDIR";
    throw c;
  }
  c = await K(Ea, a);
  var d = await Qa(a, c);
  c = d.filter(Ra);
  d = d.filter(Sa).reduce((e, f) => {
    var g = f.lstat.isDirectory() ? "Directory" : f.lstat.isFile() ? "File" : f.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...e, [f.relativePath]:{type:g}};
  }, {});
  c = await c.reduce(async(e, {path:f, relativePath:g}) => {
    const h = A(a, f);
    if (b.includes(h)) {
      return e;
    }
    e = await e;
    f = await O(f);
    return {...e, [g]:f};
  }, {});
  return {content:{...d, ...c}, type:"Directory"};
}
const Ta = (a, b) => {
  let c = [], d = [];
  Object.keys(a).forEach(f => {
    const {type:g} = a[f];
    "File" == g ? c.push(y(b, f)) : "Directory" == g && d.push(f);
  });
  const e = d.reduce((f, g) => {
    const {content:h} = a[g];
    g = Ta(h, y(b, g));
    return [...f, ...g];
  }, []);
  return [...c, ...e];
};
const Ua = async(a, b) => {
  const c = C(a), d = D(b);
  c.pipe(d);
  await Promise.all([new Promise((e, f) => {
    c.on("close", e).on("error", f);
  }), new Promise((e, f) => {
    d.on("close", e).on("error", f);
  })]);
}, Va = async(a, b) => {
  a = await K(Fa, a);
  await K(Ga, [a, b]);
}, Wa = async(a, b) => {
  await L(y(b, "path.file"));
  const {content:c} = await O(a), d = Object.keys(c).map(async e => {
    const {type:f} = c[e], g = y(a, e);
    e = y(b, e);
    "Directory" == f ? await Wa(g, e) : "File" == f ? await Ua(g, e) : "SymbolicLink" == f && await Va(g, e);
  });
  await Promise.all(d);
}, Xa = async(a, b) => {
  const c = await K(E, a), d = wa(a);
  b = y(b, d);
  c.isDirectory() ? await Wa(a, b) : c.isSymbolicLink() ? await Va(a, b) : (await L(b), await Ua(a, b));
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
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {Y:e = J(!0), proxyError:f} = a || {}, g = (h, k) => e(k);
    super(d);
    this.a = [];
    this.T = new Promise((h, k) => {
      this.on("finish", () => {
        let l;
        b ? l = Buffer.concat(this.a) : l = this.a.join("");
        h(l);
        this.a = [];
      });
      this.once("error", l => {
        if (-1 == l.stack.indexOf("\n")) {
          g`${l}`;
        } else {
          const n = I(l.stack);
          l.stack = n;
          f && g`${l}`;
        }
        k(l);
      });
      c && ab(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get b() {
    return this.T;
  }
}
const cb = async a => {
  ({b:a} = new bb({rs:a, Y:J(!0)}));
  return await a;
};
async function P(a) {
  a = C(a);
  return await cb(a);
}
;async function db(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = J(!0), d = D(a);
  await new Promise((e, f) => {
    d.on("error", g => {
      g = c(g);
      f(g);
    }).on("close", e).end(b);
  });
}
;const Q = async a => {
  try {
    return await K(E, a);
  } catch (b) {
    return null;
  }
};
async function eb(a) {
  const b = a.source, c = a.destination;
  let {readable:d, writable:e} = a;
  if (!b && !d) {
    throw Error("Please give either a source or readable.");
  }
  if (!c && !e) {
    throw Error("Please give either a destination or writable.");
  }
  b && !d && (d = C(b));
  "-" == c ? d.pipe(process.stdout) : c ? await fb(c, d, b) : e instanceof $a && (d.pipe(e), await new Promise((f, g) => {
    e.on("error", g);
    e.on("finish", f);
  }));
}
const fb = async(a, b, c) => {
  if (b.path == a || c == a) {
    ({b:c} = new bb({rs:b}));
    const d = await c;
    await new Promise((e, f) => {
      D(a).once("error", f).end(d, e);
    });
  } else {
    await new Promise((d, e) => {
      const f = D(a);
      b.pipe(f);
      f.once("error", e).on("close", d);
    });
  }
};
const gb = util.debuglog;
let hb = null;
const ib = () => {
  if (hb) {
    return hb;
  }
  var a = {};
  try {
    var b = y(process.cwd(), ".alamoderc.json");
    a = require(b);
  } catch (d) {
    return a;
  }
  ({env:{ALAMODE_ENV:b}} = process);
  const {env:c} = a;
  a = c && b in c ? c[b] : a;
  delete a.env;
  return hb = a;
};
const jb = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function R(a) {
  var b = "";
  a = 0 > a ? (-a << 1) + 1 : a << 1;
  do {
    var c = a & 31;
    a >>>= 5;
    0 < a && (c |= 32);
    if (0 <= c && c < jb.length) {
      c = jb[c];
    } else {
      throw new TypeError("Must be between 0 and 63: " + c);
    }
    b += c;
  } while (0 < a);
  return b;
}
;const S = url.URL;
function kb(a, b) {
  return a === b ? 0 : null === a ? 1 : null === b ? -1 : a > b ? 1 : -1;
}
function lb(a, b) {
  let c = a.generatedLine - b.generatedLine;
  if (0 !== c) {
    return c;
  }
  c = a.generatedColumn - b.generatedColumn;
  if (0 !== c) {
    return c;
  }
  c = kb(a.source, b.source);
  if (0 !== c) {
    return c;
  }
  c = a.originalLine - b.originalLine;
  if (0 !== c) {
    return c;
  }
  c = a.originalColumn - b.originalColumn;
  return 0 !== c ? c : kb(a.name, b.name);
}
function mb(a) {
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
const nb = /^[A-Za-z0-9+\-.]+:/;
function ob(a) {
  return "/" == a[0] ? "/" == a[1] ? "scheme-relative" : "path-absolute" : nb.test(a) ? "absolute" : "path-relative";
}
function pb(a, b) {
  "string" == typeof a && (a = new S(a));
  "string" == typeof b && (b = new S(b));
  const c = b.pathname.split("/");
  a = a.pathname.split("/");
  for (0 < a.length && !a[a.length - 1] && a.pop(); 0 < c.length && 0 < a.length && c[0] === a[0];) {
    c.shift(), a.shift();
  }
  return a.map(() => "..").concat(c).join("/") + b.search + b.hash;
}
const qb = function(a) {
  return b => {
    const c = ob(b), d = mb(b);
    b = new S(b, d);
    a(b);
    b = b.toString();
    return "absolute" === c ? b : "scheme-relative" === c ? b.slice(5) : "path-absolute" === c ? b.slice(11) : pb(d, b);
  };
}(() => {
});
function rb(a, b) {
  a: {
    if (ob(a) !== ob(b)) {
      var c = null;
    } else {
      c = mb(a + b);
      a = new S(a, c);
      c = new S(b, c);
      try {
        new S("", c.toString());
      } catch (d) {
        c = null;
        break a;
      }
      c = c.protocol !== a.protocol || c.user !== a.user || c.password !== a.password || c.hostname !== a.hostname || c.port !== a.port ? null : pb(a, c);
    }
  }
  return "string" == typeof c ? c : qb(b);
}
;class sb {
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
;class tb {
  constructor() {
    this.a = [];
    this.b = !0;
    this.f = {generatedLine:-1, generatedColumn:0, name:null, originalColumn:null, originalLine:null, source:null};
  }
  add(a) {
    {
      var b = this.f;
      const c = b.generatedLine, d = b.generatedColumn, e = a.generatedLine, f = a.generatedColumn;
      b = e > c || e == c && f >= d || 0 >= lb(b, a);
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
function ub(a, b, c) {
  null != a.b && (b = rb(a.b, b));
  c ? (a.a || (a.a = Object.create(null)), a.a[b] = c) : a.a && (delete a.a[b], 0 === Object.keys(a.a).length && (a.a = null));
}
function vb(a, b, c) {
  return b.map(function(d) {
    if (!this.a) {
      return null;
    }
    c && (d = rb(c, d));
    return Object.prototype.hasOwnProperty.call(this.a, d) ? this.a[d] : null;
  }, a);
}
class wb {
  constructor(a = {}) {
    const {file:b, sourceRoot:c, skipValidation:d = !1} = a;
    this.J = b;
    this.b = c;
    this.ca = d;
    this.s = new sb;
    this.f = new sb;
    this.L = new tb;
    this.a = null;
  }
  toJSON() {
    const a = this.s.a.slice();
    var b = this.f.a.slice();
    {
      var c = 0;
      let f = 1, g = 0, h = 0, k = 0, l = 0, n = "", m;
      let p;
      var d = this.L;
      d.b || (d.a.sort(lb), d.b = !0);
      d = d.a;
      for (let q = 0, r = d.length; q < r; q++) {
        var e = d[q];
        m = "";
        if (e.generatedLine !== f) {
          for (c = 0; e.generatedLine !== f;) {
            m += ";", f++;
          }
        } else {
          if (0 < q) {
            if (!lb(e, d[q - 1])) {
              continue;
            }
            m += ",";
          }
        }
        m += R(e.generatedColumn - c);
        c = e.generatedColumn;
        null != e.source && (p = this.s.indexOf(e.source), m += R(p - l), l = p, m += R(e.originalLine - 1 - h), h = e.originalLine - 1, m += R(e.originalColumn - g), g = e.originalColumn, null != e.name && (e = this.f.indexOf(e.name), m += R(e - k), k = e));
        n += m;
      }
      c = n;
    }
    b = {version:3, sources:a, names:b, mappings:c};
    this.J && (b.file = this.J);
    this.b && (b.sourceRoot = this.b);
    this.a && (b.sourcesContent = vb(this, a, this.b));
    return b;
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
}
;function xb(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const b = a.re instanceof RegExp;
  a = -1 != ["string", "function"].indexOf(typeof a.replacement);
  return b && a;
}
const yb = (a, b) => {
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
    return b.filter(xb).reduce((d, {re:e, replacement:f}) => {
      if (this.c) {
        return d;
      }
      if ("string" == typeof f) {
        return d = d.replace(e, f);
      }
      {
        let g;
        return d.replace(e, (h, ...k) => {
          g = Error();
          try {
            return this.c ? h : f.call(this, h, ...k);
          } catch (l) {
            yb(g, l);
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
;const zb = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), Ab = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`, Bb = (a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    const {getReplacement:f = Ab, getRegex:g = zb} = b || {}, h = g(d);
    e = {name:d, re:e, regExp:h, getReplacement:f, map:{}, lastIndex:0};
  }
  return {...c, [d]:e};
}, {}), U = a => {
  var b = [];
  const c = a.map;
  return {re:a.regExp, replacement(d, e) {
    d = c[e];
    delete c[e];
    e = Array.isArray(b) ? b : [b];
    return T(d, e);
  }};
}, V = a => {
  const b = a.map, c = a.getReplacement, d = a.name;
  return {re:a.re, replacement(e) {
    const f = a.lastIndex;
    b[f] = e;
    a.lastIndex += 1;
    return c(d, f);
  }};
};
async function Cb(a, b) {
  return Db(a, b);
}
class Eb extends Za {
  constructor(a, b) {
    super(b);
    this.rules = (Array.isArray(a) ? a : [a]).filter(xb);
    this.c = !1;
    this.a = b;
  }
  async replace(a, b) {
    const c = new Eb(this.rules, this.a);
    b && Object.assign(c, b);
    a = await Cb(c, a);
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
        const g = b.replace(c, (h, ...k) => {
          f = Error();
          try {
            if (this.c) {
              return e.length ? e.push(Promise.resolve(h)) : h;
            }
            const l = d.call(this, h, ...k);
            l instanceof Promise && e.push(l);
            return l;
          } catch (l) {
            yb(f, l);
          }
        });
        if (e.length) {
          try {
            const h = await Promise.all(e);
            b = b.replace(c, () => h.shift());
          } catch (h) {
            yb(f, h);
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
      a = I(d.stack), d.stack = a, c(d);
    }
  }
}
async function Db(a, b) {
  b instanceof Ya ? b.pipe(a) : a.end(b);
  return await cb(a);
}
;const Fb = /\/\*(?:[\s\S]+?)\*\//g, Gb = /\/\/(.+)/gm;
const Ib = (a = []) => {
  const {comments:b, inlineComments:c, strings:d, literals:e, escapes:f, regexes:g, regexGroups:h} = Bb({comments:Fb, inlineComments:Gb, strings:/(["'])(.*?)\1/gm, literals:/`([\s\S]*?)`/gm, escapes:/\\[\\`'"/]/g, regexes:/\/(.+?)\//gm, regexGroups:/\[(.*?)\]/gm}), k = [b, c, d, e, f, g, h], [l, n, m, p, q, r, u] = k.map(V), [w, x, z, ha, ia, lc, mc] = k.map(nc => U(nc));
  return {rules:[q, l, n, m, u, r, p, Hb, ...a, ha, lc, mc, z, x, w, ia], markers:{literals:e, strings:d, comments:b, inlineComments:c, escapes:f, regexes:g, regexGroups:h}};
}, Hb = {re:/./, replacement(a) {
  this.stopProcessing && this.brake();
  return a;
}};
const Jb = ({file:a, v:b, P:c, sourceRoot:d}) => {
  const e = new wb({file:a, sourceRoot:d});
  b.replace(Fb, (f, g) => {
    if ("\n" == b[g + f.length]) {
      return "\n".repeat(f.split("\n").length - 1);
    }
    g = f.split("\n");
    f = g.length - 1;
    g = " ".repeat(g[f].length);
    return `${"\n".repeat(f)}${g}`;
  }).replace(Gb, f => " ".repeat(f.length)).split("\n").forEach((f, g) => {
    const h = g + 1;
    f.replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, (k, l) => {
      if (0 != l || !/^\s+$/.test(k)) {
        k = {line:h, column:l};
        {
          let {K:n, N:m = null, source:p = null, name:q = null} = {K:k, source:c, N:k};
          if (!n) {
            throw Error('"generated" is a required argument');
          }
          if (!e.ca) {
            if (m && "number" != typeof m.line && "number" != typeof m.column) {
              throw Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
            }
            if (!(n && "line" in n && "column" in n && 0 < n.line && 0 <= n.column && !m && !p && !q || n && "line" in n && "column" in n && m && "line" in m && "column" in m && 0 < n.line && 0 <= n.column && 0 < m.line && 0 <= m.column && p)) {
              throw Error("Invalid mapping: " + JSON.stringify({K:n, source:p, N:m, name:q}));
            }
          }
          p && (p = `${p}`, e.s.has(p) || e.s.add(p));
          q && (q = `${q}`, e.f.has(q) || e.f.add(q));
          e.L.add({generatedLine:n.line, generatedColumn:n.column, originalLine:m ? m.line : null, originalColumn:m ? m.column : null, source:p, name:q});
        }
      }
    });
  });
  ub(e, c, b);
  return e.toString();
};
function Kb({source:a, da:b, name:c, destination:d, file:e, v:f}) {
  a = A(b, a);
  e = Jb({file:e, v:f, P:a});
  c = `${c}.map`;
  ya(d, `\n//# sourceMappingURL=${c}`);
  b = y(b, c);
  G(b, e);
}
;const Lb = a => `if (${a} && ${a}.__esModule) ${a} = ${a}.default`, Mb = (a, b, c, d = null) => `${a.replace(/(\s+)from(\s+)([\s\S])*/, (e, f, g) => `${f}=${g}`)}${d ? d : "r" + `equire(${b}${c}${b})`}`, W = (a, b = {}) => {
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
}, Nb = /(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%)/, Ob = (a = {import:{}}) => {
  try {
    return "always" == a.import.esCheck;
  } catch (b) {
    return !1;
  }
}, Pb = (a, b = {import:{}}) => {
  try {
    return b.import.alamodeModules.includes(a);
  } catch (c) {
    return !1;
  }
};
const Rb = async a => {
  var b = await Q(a);
  let c = a, d = !1;
  if (!b) {
    if (c = await Qb(a), !c) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (b.isDirectory()) {
      b = !1;
      let e;
      a.endsWith("/") || (e = c = await Qb(a), b = !0);
      if (!e) {
        c = await Qb(y(a, "index"));
        if (!c) {
          throw Error(`${b ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? A("", c) : c, ga:d};
}, Qb = async a => {
  a = `${a}.js`;
  let b = await Q(a);
  b || (a = `${a}x`);
  if (b = await Q(a)) {
    return a;
  }
};
let Sb;
const Ub = async(a, b, c = {}) => {
  Sb || ({root:Sb} = xa(process.cwd()));
  const {fields:d, soft:e = !1} = c;
  var f = y(a, "node_modules", b);
  f = y(f, "package.json");
  const g = await Q(f);
  if (g) {
    a = await Tb(f, d);
    if (void 0 === a) {
      throw Error(`The package ${A("", f)} does export the module.`);
    }
    if (!a.entryExists && !e) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:h, version:k, packageName:l, main:n, entryExists:m, ...p} = a;
    return {entry:A("", h), packageJson:A("", f), ...k ? {version:k} : {}, packageName:l, ...n ? {hasMain:!0} : {}, ...m ? {} : {entryExists:!1}, ...p};
  }
  if (a == Sb && !g) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return Ub(y(B(a), ".."), b, c);
}, Tb = async(a, b = []) => {
  const c = await P(a);
  let d, e, f, g, h;
  try {
    ({module:d, version:e, name:f, main:g, ...h} = JSON.parse(c)), h = b.reduce((l, n) => {
      l[n] = h[n];
      return l;
    }, {});
  } catch (l) {
    throw Error(`Could not parse ${a}.`);
  }
  a = v(a);
  b = d || g;
  if (!b) {
    if (!await Q(y(a, "index.js"))) {
      return;
    }
    b = g = "index.js";
  }
  a = y(a, b);
  let k;
  try {
    ({path:k} = await Rb(a)), a = k;
  } catch (l) {
  }
  return {entry:a, version:e, packageName:f, main:!d && g, entryExists:!!k, ...h};
};
const Vb = _module.builtinModules;
const Wb = a => a.replace(/(\s+)as(\s+)/g, (b, c, d) => `${1 == c.split("\n").length ? "" : c}:${d}`), Xb = (a, b, c = {}) => {
  if (!c.import) {
    return null;
  }
  ({import:{stdlib:c}} = c);
  if (c) {
    const d = c.path;
    return c.packages.includes(b) ? A(v(a), d).replace(/\\/g, "/").replace(/.js$/, "") : null;
  }
  return null;
}, $b = (a, b, c, d, e, f, g) => {
  const {t:h, A:k} = Yb(c, d, e, f, g);
  a = Zb(a, b, e, f, d);
  return `${[h, a, ...g ? [] : [k]].filter(l => l).join("; ")};`;
}, ac = (a, b) => {
  if (Ob(b)) {
    return !1;
  }
  if (/^[./]/.test(a) || Vb.includes(a) || Pb(a, b)) {
    return !0;
  }
}, bc = async(a, b, c, d) => {
  if (ac(a, b)) {
    return !0;
  }
  if (a in d) {
    return d[a];
  }
  if (c) {
    try {
      const {alamode:e} = await Ub(v(c), a, {fields:["alamode"]});
      d[a] = !!e;
      return e;
    } catch (e) {
      return !1;
    }
  }
}, Yb = (a, b, c, d, e) => {
  if (!a) {
    return {};
  }
  b = b ? {d:`${b} = ${"r" + `equire(${c}${d}${c})`}`, A:Lb(b)} : void 0;
  const {d:f, A:g} = b;
  a = a.replace(",", "").replace(/([^\s]+)/, f);
  return {t:`${e ? "const" : "let"}${a}`, A:g};
}, Zb = (a, b, c, d, e) => {
  if (!a) {
    return null;
  }
  b = Mb(b, c, d, e);
  return `const${Wb(a)}${b}`;
};
const cc = [{re:new RegExp(`${/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?/.source}${Nb.source}`, "gm"), replacement:function(a, b, c, d, e, f) {
  const [, g, h] = /(["'`])(.+?)\1/.exec(this.markers.strings.map[f]);
  if (this.renameOnly) {
    return f = W(h, this.config), a.replace(/%%_RESTREAM_STRINGS_REPLACEMENT_\d+_%%/, `${g}${f}${g}`);
  }
  const k = (a = Xb(this.file, h, this.config)) || W(h, this.config);
  a && (d ? b && (d = d.replace(/{/, `{ ${c},`), d = b.replace(/\S/g, " ") + d, c = b = void 0) : (d = b.replace(/(\S+)/, "{ $1 }"), c = b = void 0));
  this.M || (this.M = {});
  if (this.async) {
    return bc(k, this.config, this.file, this.M).then(l => $b(d, e, b, c, g, k, l));
  }
  a = ac(k, this.config);
  return $b(d, e, b, c, g, k, a);
}}, {re:new RegExp(`${/(import\s+)/.source}${/(%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%)/.source}`, "gm"), replacement:function(a, b, c, d) {
  const [, e, f] = /(["'`])(.+?)\1/.exec(this.markers.strings.map[d]);
  c = W(f, this.config);
  return this.renameOnly ? (b = W(f, this.config), a.replace(/%%_RESTREAM_STRINGS_REPLACEMENT_\d+_%%/, `${e}${b}${e}`)) : b.replace(/ /g, "").replace("import", "require(") + `${e}${c}${e});`;
}}, {re:new RegExp(`${/( *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+(.+?))/.source}${Nb.source}`, "gm"), replacement:function(a, b, c, d, e, f) {
  const [, g, h] = /(["'`])(.+?)\1/.exec(this.markers.strings.map[f]);
  f = W(h, this.config);
  if (this.renameOnly) {
    return a.replace(/%%_RESTREAM_STRINGS_REPLACEMENT_\d+_%%/, `${g}${f}${g}`);
  }
  a = Mb(e, g, f);
  ({length:b} = b.split("\n"));
  b = "\n".repeat(b - 1);
  f = /^[./]/.test(f) && !Ob(this.config);
  return `${c ? [`${b}${f ? "const" : "let"} ${d} = ${c}${a}`, ...f ? [] : [Lb(c)]].join("; ") : `${b}const ${d}${a}`};`;
}}];
const dc = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|await|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/, ec = /(?:[$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D])(?:[$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*/;
const fc = a => a.split(/,\s*/).filter(b => b), gc = a => a.reduce((b, c) => {
  const [d, e = d] = c.split(/\s+as\s+/);
  return {...b, [e.trim()]:d.trim()};
}, {}), hc = a => {
  a.replace(dc, () => {
    throw Error(`Detected reserved identifier "${a}".`);
  });
}, ic = a => {
  ({length:a} = a.split("\n"));
  return "\n".repeat(a - 1);
}, X = (a, b = !0) => b ? ic(a) : a.split("\n").map(({length:c}, d, {length:e}) => d == e - 1 ? " ".repeat(c) : "").join("\n");
const jc = (a, b, c) => `${a.replace(/(\s+)from(\s+)([\s\S])*/, (d, e, f) => `${e}=${f}`)}${"r" + `equire(${b}${c}${b});`}`;
function kc(a, b, c, d, e) {
  a = this.noSourceMaps ? "" : X(a);
  const f = `$${b.replace(/[-/]/g, "_").replace(/[^\w\d-]/g, "")}`;
  b = jc(c, d, b);
  b = `${a}const ${f}${b}`;
  e = fc(e).reduce((g, h) => {
    const [k, l] = h.split(/\s+as\s+/);
    h = k.trim();
    g[(l ? l.trim() : null) || h] = "default" == h ? f : `${f}.${h}`;
    return g;
  }, {});
  this.emit("export", e);
  return b;
}
;const oc = (a = {}) => {
  const {"default":b, ...c} = a, d = b ? `module.exports = ${b}` : "", e = Object.keys(c).map(f => `module.exports.${f} = ${a[f]}`);
  return [d, ...e].filter(f => f).join("\n");
};
const pc = [{re:/[\s\S]*/, replacement(a) {
  this.exports = {};
  this.on("export", b => {
    this.exports = {...this.exports, ...b};
  });
  return a;
}}, {re:new RegExp(`^( *export\\s+?)( *${/(?:let|const|var|class|function\s*\*?|async +function)/.source}\\s+((?:${ec.source}\\s*,?\\s*)+))`, "gm"), replacement:function(a, b, c, d) {
  d.split(/,\s*/).forEach(e => {
    e = e.trim().replace(/\s+extends\s+.+/, "");
    hc(e);
    this.emit("export", {[e]:e});
  });
  return this.noSourceMaps ? c : `${X(b, !1)}${c}`;
}}, {re:new RegExp(`${/^( *export\s+{([^}]+?)})/.source}${/(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%|%%_RESTREAM_LITERALS_REPLACEMENT_(\d+)_%%)/.source}`, "gm"), replacement:function(a, b, c, d, e, f) {
  const [, g, h] = /(["'`])(.+?)\1/.exec(f ? this.markers.literals.map[f] : this.markers.strings.map[e]);
  return kc.call(this, b, h, d, g, c);
}}, {re:/^( *export\s+{([^}]+?)} *)(\n?)/gm, replacement:function(a, b, c, d) {
  a = fc(c);
  a = gc(a);
  this.emit("export", a);
  return this.noSourceMaps ? "" : `${X(b)}${d ? d : ""}`;
}}, {re:new RegExp(`^( *export\\s+default\\s+?)( *${/(?:class|function\s*\*?|async +function)/.source}\\s+(${ec.source}))`, "m"), replacement:function(a, b, c, d) {
  a = d.trim();
  hc(a);
  this.emit("export", {"default":a});
  return this.noSourceMaps ? c : `${X(b, !1)}${c}`;
}}, {re:/^( *)(export\s+)(default\s+)/m, replacement:function(a, b, c, d) {
  a = c.replace(/export ?/, "module.");
  d = d.replace(/default ?/, "exports=");
  return `${b}${a}${d}`;
}}, {re:/[\s\S]*/, replacement(a) {
  const b = oc(this.exports);
  return `${a}${b ? `\n\n${b}` : ""}`;
}}];
class qc extends Eb {
  constructor(a, b = {}) {
    const {noSourceMaps:c = !1, debug:d = !1, renameOnly:e = !1} = b;
    b = ib();
    {
      var f = e ? cc : [...cc, ...pc];
      const {rules:k, markers:l} = Ib(f);
      f = {rules:k, markers:l};
    }
    const {rules:g, markers:h} = f;
    super(g);
    this.markers = h;
    this.config = b;
    this.file = a;
    this.noSourceMaps = c;
    this.async = !0;
    this.renameOnly = e;
    this.stopProcessing = d;
  }
}
const rc = async({source:a, destination:b, writable:c, debug:d, noSourceMaps:e, renameOnly:f}) => {
  const g = new qc(a, {noSourceMaps:e, debug:d, renameOnly:f});
  d = await P(a);
  g.end(d);
  await Promise.all([eb({source:a, ...c ? {writable:c} : {destination:b}, readable:g}), new Promise((h, k) => g.on("finish", h).on("error", k))]);
  return d;
};
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const sc = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90};
function Y(a, b) {
  return (b = sc[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const tc = vm.Script;
const uc = (a, b) => {
  const [c, , d] = a.split("\n");
  a = parseInt(c.replace(/.+?(\d+)$/, (f, g) => g)) - 1;
  const e = d.indexOf("^");
  ({length:b} = b.split("\n").slice(0, a).join("\n"));
  return b + e + (a ? 1 : 0);
};
const vc = a => {
  try {
    new tc(a);
  } catch (b) {
    const c = b.stack;
    if (!/Unexpected token '?</.test(b.message)) {
      throw b;
    }
    return uc(c, a);
  }
  return null;
};
const wc = a => {
  [, a] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || [];
  return a;
}, yc = (a, {F:b = !1, classNames:c = [], renameMap:d = {}} = {}) => {
  let e = 0;
  const f = [];
  let g;
  T(a, [{re:/[{}]/g, replacement(p, q) {
    p = "}" == p;
    const r = !p;
    if (!e && p) {
      throw Error("A closing } is found without opening one.");
    }
    e += r ? 1 : -1;
    1 == e && r ? g = {open:q} : 0 == e && p && (g.close = q, f.push(g), g = {});
  }}]);
  if (e) {
    throw Error(`Unbalanced props (level ${e}) ${a}`);
  }
  const h = {}, k = [], l = {};
  var n = f.reduce((p, {open:q, close:r}) => {
    p = a.slice(p, q);
    const [, u, w, x, z] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(p) || [];
    q = a.slice(q + 1, r);
    if (!w && !/\s*\.\.\./.test(q)) {
      throw Error("Could not detect prop name");
    }
    w ? h[w] = q : k.push(q);
    l[w] = {before:u, H:x, G:z};
    q = p || "";
    q = q.slice(0, q.length - (w || "").length - 1);
    const {D:ha, m:ia} = xc(q);
    Object.assign(h, ha);
    Object.assign(l, ia);
    return r + 1;
  }, 0);
  if (f.length) {
    n = a.slice(n);
    const {D:p, m:q} = xc(n);
    Object.assign(h, p);
    Object.assign(l, q);
  } else {
    const {D:p, m:q} = xc(a);
    Object.assign(h, p);
    Object.assign(l, q);
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
  return {B:m, w:k, m:l};
}, xc = a => {
  const b = [], c = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]*?)\5/g, (d, e, f, g, h, k, l, n) => {
    c[f] = {before:e, H:g, G:h};
    b.push({u:n, name:f, S:`${k}${l}${k}`});
    return "%".repeat(d.length);
  }).replace(/(\s*)([^\s%]+)/g, (d, e, f, g) => {
    c[f] = {before:e};
    b.push({u:g, name:f, S:"true"});
  });
  return {D:[...b.reduce((d, {u:e, name:f, S:g}) => {
    d[e] = [f, g];
    return d;
  }, [])].filter(Boolean).reduce((d, [e, f]) => {
    d[e] = f;
    return d;
  }, {}), m:c};
}, zc = (a, b = [], c = !1, d = {}, e = "") => {
  const f = Object.keys(a);
  return f.length || b.length ? `{${f.reduce((g, h) => {
    const k = a[h], l = c || -1 != h.indexOf("-") ? `'${h}'` : h, {before:n = "", H:m = "", G:p = ""} = d[h] || {};
    return [...g, `${n}${l}${m}:${p}${k}`];
  }, b).join(",")}${e}}` : "{}";
}, Ac = (a = "") => {
  [a] = a;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}, Bc = (a, b = {}, c = [], d = [], e = !1, f = null, g = {}, h = "") => {
  const k = Ac(a), l = k ? a : `'${a}'`;
  if (!Object.keys(b).length && !c.length && !d.length) {
    return `h(${l})`;
  }
  const n = k && "dom" == e ? !1 : e;
  k || !d.length || e && "dom" != e || f && f(`JSX: destructuring ${d.join(" ")} is used without quoted props on HTML ${a}.`);
  a = zc(b, d, n, g, h);
  b = c.reduce((m, p, q) => {
    q = c[q - 1];
    let r = "";
    q && /^\/\*[\s\S]*\*\/$/.test(q) ? r = "" : q && /\S/.test(q) && (r = ",");
    return `${m}${r}${p}`;
  }, "");
  return `h(${l},${a}${b ? `,${b}` : ""})`;
};
const Cc = (a, b = []) => {
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
  return {ea:a, I:d};
}, Ec = a => {
  const b = wc(a);
  let c;
  const {U:d} = Bb({U:/=>/g});
  try {
    ({ea:k, I:c} = Cc(a, [V(d)]));
  } catch (l) {
    if (1 === l) {
      throw Error(`Could not find the matching closing > for ${b}.`);
    }
  }
  const e = k.slice(0, c + 1);
  var f = e.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(f)) {
    return a = f.replace(/\/\s*>$/, ""), f = "", new Dc({h:e.replace(d.regExp, "=>"), g:a.replace(d.regExp, "=>"), content:"", tagName:b});
  }
  a = f.replace(/>$/, "");
  f = c + 1;
  c = !1;
  let g = 1, h;
  T(k, [{re:new RegExp(`[\\s\\S](?:<\\s*${b}(\\s+|>)|/\\s*${b}\\s*>)`, "g"), replacement(l, n, m, p) {
    if (c) {
      return l;
    }
    n = !n && l.endsWith(">");
    const q = !n;
    if (q) {
      p = p.slice(m);
      const {I:r} = Cc(p.replace(/^[\s\S]/, " "));
      p = p.slice(0, r + 1);
      if (/\/\s*>$/.test(p)) {
        return l;
      }
    }
    g += q ? 1 : -1;
    0 == g && n && (c = m, h = c + l.length);
    return l;
  }}]);
  if (g) {
    throw Error(`Could not find the matching closing </${b}>.`);
  }
  f = k.slice(f, c);
  var k = k.slice(0, h).replace(d.regExp, "=>");
  return new Dc({h:k, g:a.replace(d.regExp, "=>"), content:f.replace(d.regExp, "=>"), tagName:b});
};
class Dc {
  constructor(a) {
    this.h = a.h;
    this.g = a.g;
    this.content = a.content;
    this.tagName = a.tagName;
  }
}
;const Fc = a => {
  let b = "", c = "";
  a = a.replace(/^(\r?\n\s*)([\s\S]+)?/, (d, e, f = "") => {
    b = e;
    return f;
  }).replace(/([\s\S]+?)?(\r?\n\s*)$/, (d, e = "", f = "") => {
    c = f;
    return e;
  });
  return `${b}${a ? `\`${a}\`` : ""}${c}`;
}, Hc = a => {
  const b = [];
  let c = {}, d = 0, e = 0;
  T(a, [{re:/[<{}]/g, replacement(f, g) {
    if (!(g < e)) {
      if (/[{}]/.test(f)) {
        d += "{" == f ? 1 : -1, 1 == d && void 0 == c.from ? c.from = g : 0 == d && (c.to = g + 1, c.Z = a.slice(c.from + 1, g), b.push(c), c = {});
      } else {
        if (d) {
          return f;
        }
        f = Ec(a.slice(g));
        e = g + f.h.length;
        c.$ = f;
        c.to = e;
        c.from = g;
        b.push(c);
        c = {};
      }
    }
  }}, {}]);
  return b.length ? Gc(a, b) : [Fc(a)];
}, Gc = (a, b) => {
  let c = 0;
  b = b.reduce((d, {from:e, to:f, Z:g, $:h}) => {
    (e = a.slice(c, e)) && d.push(Fc(e));
    c = f;
    g ? d.push(g) : h && d.push(h);
    return d;
  }, []);
  if (c < a.length) {
    const d = a.slice(c, a.length);
    d && b.push(Fc(d));
  }
  return b;
};
const Jc = (a, b = {}) => {
  var c = b.quoteProps, d = b.warn;
  const e = b.prop2class, f = b.classNames, g = b.renameMap;
  var h = vc(a);
  if (null === h) {
    return a;
  }
  var k = a.slice(h);
  const {g:l = "", content:n, tagName:m, h:{length:p}} = Ec(k);
  k = Ic(n, c, d, b);
  const {B:q, w:r, m:u} = yc(l.replace(/^ */, ""), {F:e, classNames:f, renameMap:g});
  d = Bc(m, q, k, r, c, d, u, /\s*$/.exec(l) || [""]);
  c = a.slice(0, h);
  a = a.slice(h + p);
  h = p - d.length;
  0 < h && (d = `${" ".repeat(h)}${d}`);
  a = `${c}${d}${a}`;
  return Jc(a, b);
}, Ic = (a, b = !1, c = null, d = {}) => a ? Hc(a).reduce((e, f) => {
  if (f instanceof Dc) {
    const {g:k = "", content:l, tagName:n} = f, {B:m, w:p} = yc(k, {F:d.prop2class, classNames:d.classNames, renameMap:d.renameMap});
    f = Ic(l, b, c, d);
    f = Bc(n, m, f, p, b, c);
    return [...e, f];
  }
  const g = vc(f);
  if (g) {
    var h = f.slice(g);
    const {h:{length:k}, g:l = "", content:n, tagName:m} = Ec(h), {B:p, w:q} = yc(l, {F:d.prop2class, classNames:d.classNames, renameMap:d.renameMap});
    h = Ic(n, b, c, d);
    h = Bc(m, p, h, q, b, c);
    const r = f.slice(0, g);
    f = f.slice(g + k);
    return [...e, `${r}${h}${f}`];
  }
  return [...e, f];
}, []) : [];
const Kc = (a, b = {}) => {
  const {e:c, W:d, X:e, u:f, aa:g, ba:h} = Bb({W:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, X:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg, u:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, aa:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, ba:/^ *import\s+['"].+['"]/gm}, {getReplacement(k, l) {
    return `/*%%_RESTREAM_${k.toUpperCase()}_REPLACEMENT_${l}_%%*/`;
  }, getRegex(k) {
    return new RegExp(`/\\*%%_RESTREAM_${k.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, "g");
  }});
  a = T(a, [V(e), V(d), V(c), V(f), V(g), V(h)]);
  b = Jc(a, b);
  return T(b, [U(e), U(d), U(c), U(f), U(g), U(h)]);
};
function Lc(a = "") {
  if (document) {
    var b = document.head, c = document.createElement("style");
    c.type = "text/css";
    c.styleSheet ? c.styleSheet.cssText = a : c.appendChild(document.createTextNode(a));
    b.appendChild(c);
  }
}
let Mc = null;
const Nc = {}, Pc = async(a, b, c, d, e) => {
  const f = await P(a), g = e.V;
  e = await Kc(f, {quoteProps:"dom", prop2class:e.prop2class, classNames:e.classNames, renameMap:e.renameMap, warn(h) {
    console.warn(Y(h, "yellow"));
    console.warn(Y(" in %s", "grey"), a);
  }});
  e = Oc(e, c, a, g);
  return b ? `${d ? "const { h } = requir" + `e('${b}');` : `import { h } from '${b}'`}
${e}` : e;
}, Oc = (a, b, c, d) => a.replace(/^import(\s+{[^}]+?}\s+from)?\s+(['"])(.+?\.css)\2/gm, (e, f, g, h) => {
  try {
    if (!Mc) {
      var k = y(b, "css-injector.js");
      Aa(k) || G(k, `export default ${Lc.toString()}`);
      Mc = k;
    }
    var l = y(v(c), h);
    k = `${h}.js`;
    const n = y(b, k);
    if (!(n in Nc)) {
      let m = A(v(n), Mc);
      m.startsWith(".") || (m = `./${m}`);
      const p = Da(l);
      l = `import __$styleInject from '${m}'${H}${H}`;
      l += `__$styleInject(\`${p}\`)`;
      const q = y(h, ""), r = d[q];
      if (r) {
        const u = require(B(r)), w = Object.entries(u).map(([x, z]) => `export const $${x} = '${z}'`);
        l += `${H}${H}${w.join(H)}`;
        if (f) {
          let [, x] = /{\s*([\s\S]+?)\s*}/.exec(f);
          x = x.split(/,/).map(z => z.trim().replace(/^\$/, "")).filter(Boolean);
          x.forEach(z => {
            z in u || (console.error("%s You're importing class %s from %s, which is not present in its map.", Y(">", "red"), Y(`.${z}`, "red"), q), console.error("%s %s", Y(">", "red"), c));
          });
        }
      }
      Pa(n);
      G(n, l);
      Nc[n] = !0;
      console.error("Added %s in %s", Y(k, "yellow"), c);
    }
    return `import${f || ""} ${g}${h}${g}`;
  } catch (n) {
    return console.error("Could not include CSS in %s:\n%s", c, Y(n.message, "red")), e;
  }
});
const Qc = gb("alamode"), Rc = (a, b) => a.includes(b) || a.some(c => b.startsWith(`${c}/`)), Z = async a => {
  const {input:b, l:c = ".", name:d, C:e = "-", noSourceMaps:f, extensions:g, debug:h, O:k = d, renameOnly:l} = a;
  var n = y(c, d);
  a = "-" == e;
  const m = y(b, n), p = a ? null : y(e, c);
  a = a ? "-" : y(p, k);
  Qc(n);
  await L(a);
  if (!Sc(n, g)) {
    return await eb({source:m, destination:a}), a;
  }
  const q = await rc({source:m, destination:a, debug:h, noSourceMaps:f, renameOnly:l});
  if ("-" != e) {
    {
      const r = F(m).mode;
      za(a, r);
    }
    if (f) {
      return a;
    }
    Kb({destination:a, file:n, name:d, da:p, source:m, v:q});
  } else {
    f || h || (n = Jb({file:n, v:q, P:A(p || "", m)}), n = "/" + `/# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(n).toString("base64")}`, console.log("\n\n%s", n));
  }
  return a;
}, Uc = async a => {
  const {input:b, C:c, l:d = ".", jsx:e, R:f, o:g} = a, h = y(b, d), k = y(c, d), {content:l} = await O(h);
  await Object.keys(l).reduce(async(n, m) => {
    await n;
    n = y(h, m);
    var {type:p} = l[m];
    "File" == p ? Rc(a.ignore, y(d, m)) || (e && /jsx$/.test(m) ? (a.j ? (p = m.replace(/jsx$/, "js"), n = await Z({...a, name:m, O:p}), m = p) : g.renameOnly && (p = m.replace(/jsx$/, "js"), n = await Z({...a, name:m, renameOnly:!0, O:p, noSourceMaps:!0}), m = p), p = y(k, m), await Tc(n, f, c, p, {l:d, name:m, ignore:a.ignore, j:a.j, o:g})) : e && a.j ? await Z({...a, name:m}) : e ? await Xa(n, k) : await Z({...a, name:m})) : "Directory" == p && (m = y(d, m), await Uc({...a, l:m}));
  }, {});
}, Tc = async(a, b, c, d, {j:e, l:f, name:g, ignore:h, o:k} = {}) => {
  if (h && (f = y(f, g), Rc(h, f))) {
    return;
  }
  a = await Pc(a, b, c, e, k);
  b = d.replace(/jsx$/, "js");
  if ("-" == d) {
    return a;
  }
  await L(b);
  await db(b, a);
}, Sc = (a, b) => b.some(c => a.endsWith(c)), Vc = a => {
  const {css:{classNames:b = {}} = {}, jsx:{classNames:c = [], prop2class:d = !1, renameMaps:e = []} = {}, import:{replacement:f} = {}} = a;
  a = (Array.isArray(c) ? c : [c]).reduce((h, k) => {
    k = require(B(k));
    return h = {...h, ...k};
  }, {});
  const g = (Array.isArray(e) ? e : [e]).reduce((h, k) => {
    k = require(B(k));
    return h = {...h, ...k};
  }, {});
  return {V:b, prop2class:d, renameOnly:!!f, ...Object.keys(a).length ? {classNames:a} : {}, ...Object.keys(g).length ? {renameMap:g} : {}};
}, Wc = async a => {
  const {input:b, C:c = "-", jsx:d, R:e} = a;
  if (!b) {
    throw Error("Please specify the source file or directory.");
  }
  var f = F(b), g = ib();
  g = Vc(g);
  if (f.isDirectory()) {
    if ("-" == c) {
      throw Error("Output to stdout is only for files.");
    }
    await Uc({...a, o:g});
  } else {
    if (f.isFile()) {
      if (f = wa(b), d && /jsx$/.test(f)) {
        if (a = "-" == c ? "-" : y(c, f), g = await Tc(b, e, c, a, {o:g}), "-" == a) {
          return console.log(g);
        }
      } else {
        await Z({...a, input:v(b), l:"./", name:f});
      }
    }
  }
  "-" != c && process.stdout.write(`Transpiled code saved to ${c}${H}`);
};
const Xc = async a => {
  var b = await P(a);
  const c = new Eb([{re:/^ *(?:var|let|const)\s+(\S+?)(\s*)=(\s*)require\((['"])(.+?)\4\)/gm, replacement(d, e, f, g, h, k) {
    return `import ${e}${f}from${g}${h}${k}${h}`;
  }}, {re:/^ *(?:var|let|const)(\s+{\s*)([\s\S]+?)(\s*})(\s*)=(\s*)require\((['"])(.+?)\6\)/gm, replacement(d, e, f, g, h, k, l, n) {
    d = f.replace(/(\s*):(\s*)/g, (m, p, q) => `${p || " "}as${q || " "}`);
    return `import${e}${d}${g}${h}from${k}${l}${n}${l}`;
  }}, {re:/^( *)(?:module\.)?exports\s*=/gm, replacement(d, e) {
    return `${e}export default`;
  }}, {re:/^( *)(?:module\.)?exports\.(\S+?)\s*=\s*([^\s;]+)/gm, replacement(d, e, f, g) {
    return f == g ? `${e}export { ${f} }` : `${e}export const ${f} = ${g}`;
  }}]);
  b = await Db(c, b);
  await db(a, b);
};
async function Yc(a) {
  a = a.input;
  if (!a) {
    throw Error("Please specify the source file or directory to refactor.");
  }
  var b = F(a);
  b.isDirectory() ? ({content:b} = await O(a), a = Ta(b, a), await Promise.all(a.map(async c => {
    await Xc(c);
  }))) : b.isFile() && await Xc(a);
}
;function Zc(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:e} = a;
  a = Object.keys(b);
  const f = Object.values(b), [g] = a.reduce(([l = 0, n = 0], m) => {
    const p = b[m].split("\n").reduce((q, r) => r.length > q ? r.length : q, 0);
    p > n && (n = p);
    m.length > l && (l = m.length);
    return [l, n];
  }, []), h = (l, n) => {
    n = " ".repeat(n - l.length);
    return `${l}${n}`;
  };
  a = a.reduce((l, n, m) => {
    m = f[m].split("\n");
    n = h(n, g);
    const [p, ...q] = m;
    n = `${n}\t${p}`;
    const r = h("", g);
    m = q.map(u => `${r}\t${u}`);
    return [...l, n, ...m];
  }, []).map(l => `\t${l}`);
  const k = [c, `  ${d || ""}`].filter(l => l ? l.trim() : l).join("\n\n");
  a = `${k ? `${k}\n` : ""}
${a.join("\n")}
`;
  return e ? `${a}
  Example:

    ${e}
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
if (ra) {
  {
    const a = ca(da), b = Zc({usage:a, description:Y("\u00c0LaMode", "red") + "\nA tool to transpile JavaScript packages using regular expressions.\nSupports import/export and JSX transpilation.\nhttps://artdecocode.com/alamode/", line:"alamode source [-o destination] [-i dir,file] [--env env] [-s]", example:"alamode src -o build -s"});
    console.log(b);
    const c = Zc({usage:ca(ea), description:Y("JSX transpilation", "magenta") + "\nAllows to transpile JSX using RegExes.", line:"alamode source [-o destination] -j [-mpE]", example:"alamode src -o build -j -m"});
    console.log(c);
  }
  process.exit();
} else {
  qa && (console.log("v%s", require("../../package.json").version), process.exit());
}
pa && (process.env.ALAMODE_ENV = pa);
(async() => {
  try {
    const a = ka ? ka.split(",") : [], b = ma.split(",");
    if (oa) {
      return await Yc({input:fa, ignore:a, extensions:b});
    }
    let c = !1;
    ua ? c = "preact" : va && (c = "@externs/preact");
    await Wc({input:fa, C:ja, noSourceMaps:la, ignore:a, extensions:b, R:c, jsx:sa, debug:na, j:ta});
  } catch (a) {
    if (process.env.DEBUG) {
      return console.log(a.stack);
    }
    console.log(a.message);
  }
})();

