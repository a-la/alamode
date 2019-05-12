#!/usr/bin/env node
             
const path = require('path');
const fs = require('fs');
const util = require('util');
const os = require('os');
const stream = require('stream');
const vm = require('vm');
const url = require('url');             
const r = (a, b, c, d, e) => {
  d = void 0 === d ? !1 : d;
  e = void 0 === e ? !1 : e;
  const f = c ? new RegExp(`^-(${c}|-${b})`) : new RegExp(`^--${b}`);
  b = a.findIndex(g => f.test(g));
  if (-1 == b) {
    return {argv:a};
  }
  if (d) {
    return {value:!0, argv:[...a.slice(0, b), ...a.slice(b + 1)]};
  }
  d = b + 1;
  c = a[d];
  if (!c || "string" == typeof c && c.startsWith("--")) {
    return {argv:a};
  }
  e && (c = parseInt(c, 10));
  return {value:c, argv:[...a.slice(0, b), ...a.slice(d + 1)]};
}, aa = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const d = a[c];
    if (d.startsWith("-")) {
      break;
    }
    b.push(d);
  }
  return b;
}, ca = () => {
  var a = ba;
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
const ba = {source:{description:"The location of the input file or directory to transpile.", command:!0}, output:{description:"The location of where to save the transpiled output.", short:"o"}, version:{description:"Show the version number.", boolean:!0, short:"v"}, help:{description:"Display the usage information.", boolean:!0, short:"h"}, ignore:{description:"Comma-separated list of files inside of `source` dir to\nignore, for example, `bin,.eslintrc`.", short:"i"}, noSourceMaps:{description:"Disable source maps.", 
boolean:!0, short:"s"}, extensions:{description:"Files of what extensions to transpile.", default:"js,jsx", short:"e"}, jsx:{description:"Enable JSX mode: only update JSX syntax to use hyperscript.\nDoes not transpile `import/export` statements.", boolean:!0, short:"j"}, preact:{description:'When transpiling JSX, automatically insert at the top\n`import { h } from "preact"`.', boolean:!0, short:"p"}, debug:{description:"Will make \u00c0LaMode stop after replacing markers.", boolean:!0, short:"d"}}, 
u = function(a, b) {
  a = void 0 === a ? {} : a;
  b = void 0 === b ? process.argv : b;
  [, , ...b] = b;
  const c = aa(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce((e, f) => {
    var g = Object.assign({}, e);
    e = e.j;
    g = (delete g.j, g);
    if (0 == e.length && d) {
      return Object.assign({}, {j:e}, g);
    }
    const l = a[f];
    let h;
    if ("string" == typeof l) {
      ({value:h, argv:e} = r(e, f, l));
    } else {
      try {
        const {short:k, boolean:m, number:n, command:p, multiple:q} = l;
        p && q && c.length ? (h = c, d = !0) : p && c.length ? (h = c[0], d = !0) : {value:h, argv:e} = r(e, f, k, m, n);
      } catch (k) {
        return Object.assign({}, {j:e}, g);
      }
    }
    return void 0 === h ? Object.assign({}, {j:e}, g) : Object.assign({}, {j:e}, g, {[f]:h});
  }, {j:b});
}(ba), da = u.source, ea = u.output, fa = u.version, ha = u.help, ia = u.ignore, ja = u.noSourceMaps, ka = u.extensions || "js,jsx", la = u.jsx, ma = u.preact, na = u.debug;
const {basename:oa, dirname:v, join:x, relative:pa} = path;
const {appendFileSync:qa, chmodSync:ra, createReadStream:y, createWriteStream:z, lstat:A, lstatSync:sa, mkdir:ta, readdir:ua, readlink:va, symlink:wa, writeFileSync:xa} = fs;
const ya = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, za = (a, b = !1) => ya(a, 2 + (b ? 1 : 0)), Aa = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:Ba} = os;
const Ca = /\s+at.*(?:\(|\s)(.*)\)?/, Da = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, Ea = Ba(), B = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(Da.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(Ca);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(Ca, (g, l) => g.replace(l, l.replace(Ea, "~"))) : f).join("\n");
};
function Fa(a, b, c = !1) {
  return function(d) {
    var e = Aa(arguments), {stack:f} = Error();
    const g = ya(f, 2, !0), l = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${l}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = B(e);
    return Object.assign(f ? d : Error(), {message:l, stack:e});
  };
}
;function C(a) {
  var {stack:b} = Error();
  const c = Aa(arguments);
  b = za(b, a);
  return Fa(c, b, a);
}
;function Ga(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function D(a, b, c) {
  const d = C(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:e} = a;
  if (!e) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((f, g) => {
    const l = (k, m) => k ? (k = d(k), g(k)) : f(c || m);
    let h = [l];
    Array.isArray(b) ? (b.forEach((k, m) => {
      Ga(e, m);
    }), h = [...b, l]) : 1 < Array.from(arguments).length && (Ga(e, 0), h = [b, l]);
    a(...h);
  });
}
;async function E(a) {
  const b = v(a);
  try {
    return await F(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}
async function F(a) {
  try {
    await D(ta, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = v(a);
      await F(c);
      await F(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;async function Ha(a, b) {
  b = b.map(async c => {
    const d = x(a, c);
    return {lstat:await D(A, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const Ia = a => a.lstat.isDirectory(), Ja = a => !a.lstat.isDirectory();
async function G(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  if (!(await D(A, a)).isDirectory()) {
    throw a = Error("Path is not a directory"), a.code = "ENOTDIR", a;
  }
  var b = await D(ua, a);
  b = await Ha(a, b);
  a = b.filter(Ia);
  b = b.filter(Ja).reduce((c, d) => {
    var e = d.lstat.isDirectory() ? "Directory" : d.lstat.isFile() ? "File" : d.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return Object.assign({}, c, {[d.relativePath]:{type:e}});
  }, {});
  a = await a.reduce(async(c, d) => {
    var {path:e, relativePath:f} = d;
    c = await c;
    d = await G(e);
    return Object.assign({}, c, {[f]:d});
  }, {});
  return {content:Object.assign({}, b, a), type:"Directory"};
}
;const Ka = async(a, b) => {
  const c = y(a), d = z(b);
  c.pipe(d);
  await Promise.all([new Promise((e, f) => {
    c.on("close", e).on("error", f);
  }), new Promise((e, f) => {
    d.on("close", e).on("error", f);
  })]);
}, La = async(a, b) => {
  a = await D(va, a);
  await D(wa, [a, b]);
}, Ma = async(a, b) => {
  await E(x(b, "path.file"));
  const {content:c} = await G(a), d = Object.keys(c).map(async e => {
    const {type:f} = c[e], g = x(a, e);
    e = x(b, e);
    "Directory" == f ? await Ma(g, e) : "File" == f ? await Ka(g, e) : "SymbolicLink" == f && await La(g, e);
  });
  await Promise.all(d);
}, Na = async(a, b) => {
  const c = await D(A, a), d = oa(a);
  b = x(b, d);
  c.isDirectory() ? await Ma(a, b) : c.isSymbolicLink() ? await La(a, b) : (await E(b), await Ka(a, b));
};
var Oa = stream;
const {Transform:Pa, Writable:Qa} = stream;
const Ra = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class Sa extends Qa {
  constructor(a) {
    var b = a || {}, c = Object.assign({}, b);
    const d = void 0 === b.binary ? !1 : b.binary, e = void 0 === b.rs ? null : b.rs;
    b = (delete c.binary, delete c.rs, c);
    const {U:f = C(!0), proxyError:g} = a || {}, l = (h, k) => f(k);
    super(b);
    this.a = [];
    this.P = new Promise((h, k) => {
      this.on("finish", () => {
        let m;
        d ? m = Buffer.concat(this.a) : m = this.a.join("");
        h(m);
        this.a = [];
      });
      this.once("error", m => {
        if (-1 == m.stack.indexOf("\n")) {
          l`${m}`;
        } else {
          const n = B(m.stack);
          m.stack = n;
          g && l`${m}`;
        }
        k(m);
      });
      e && Ra(this, e).pipe(this);
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
const H = async a => {
  var b = void 0 === b ? {} : b;
  ({b:a} = new Sa(Object.assign({}, {rs:a}, b, {U:C(!0)})));
  return await a;
};
async function Ta(a) {
  a = y(a);
  return await H(a);
}
;async function Ua(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = C(!0), d = z(a);
  await new Promise((e, f) => {
    d.on("error", g => {
      g = c(g);
      f(g);
    }).on("close", e).end(b);
  });
}
;async function Va(a) {
  const {source:b, destination:c} = a;
  let {readable:d, writable:e} = a;
  if (!b && !d) {
    throw Error("Please give either a source or readable.");
  }
  if (!c && !e) {
    throw Error("Please give either a destination or writable.");
  }
  b && !d && (d = y(b));
  "-" == c ? d.pipe(process.stdout) : c ? await Wa(c, d, b) : e instanceof Qa && (d.pipe(e), await new Promise((f, g) => {
    e.on("error", g);
    e.on("finish", f);
  }));
}
const Wa = async(a, b, c) => {
  if (b.path == a || c == a) {
    ({b:c} = new Sa({rs:b}));
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
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const Xa = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90};
function Ya(a, b) {
  return (b = Xa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const {debuglog:Za} = util;
const {Script:$a} = vm;
const ab = (a, b) => {
  const [c, , d] = a.split("\n");
  a = parseInt(c.replace(/.+?(\d+)$/, (f, g) => g)) - 1;
  const e = d.indexOf("^");
  ({length:b} = b.split("\n").slice(0, a).join("\n"));
  return b + e + (a ? 1 : 0);
};
const bb = a => {
  try {
    new $a(a);
  } catch (b) {
    const {message:c, stack:d} = b;
    if ("Unexpected token <" != c) {
      throw b;
    }
    return ab(d, a);
  }
  return null;
};
function cb(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {re:b, replacement:c} = a;
  a = b instanceof RegExp;
  const d = -1 != ["string", "function"].indexOf(typeof c);
  return a && d;
}
const I = (a, b) => {
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
function J(a, b) {
  function c() {
    return b.filter(cb).reduce((d, {re:e, replacement:f}) => {
      if (this.c) {
        return d;
      }
      if ("string" == typeof f) {
        d = d.replace(e, f);
      } else {
        let g;
        return d.replace(e, (l, ...h) => {
          g = Error();
          try {
            return this.c ? l : f.call(this, l, ...h);
          } catch (k) {
            I(g, k);
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
;const db = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), eb = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`, K = (a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    const {getReplacement:f = eb, getRegex:g = db} = b || {}, l = g(d);
    e = {name:d, re:e, regExp:l, getReplacement:f, map:{}, lastIndex:0};
  }
  return Object.assign({}, c, {[d]:e});
}, {}), L = a => {
  var b = void 0 === b ? [] : b;
  const {regExp:c, map:d} = a;
  return {re:c, replacement(e, f) {
    e = d[f];
    delete d[f];
    f = Array.isArray(b) ? b : [b];
    return J(e, f);
  }};
}, M = a => {
  const {re:b, map:c, getReplacement:d, name:e} = a;
  return {re:b, replacement(f) {
    const {lastIndex:g} = a;
    c[g] = f;
    a.lastIndex += 1;
    return d(e, g);
  }};
};
async function fb(a, b) {
  b instanceof Oa ? b.pipe(a) : a.end(b);
  return await H(a);
}
class gb extends Pa {
  constructor(a, b) {
    super(b);
    this.rules = (Array.isArray(a) ? a : [a]).filter(cb);
    this.c = !1;
    this.a = b;
  }
  async replace(a, b) {
    const c = new gb(this.rules, this.a);
    b && Object.assign(c, b);
    a = await fb(c, a);
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
        const g = b.replace(c, (l, ...h) => {
          f = Error();
          try {
            if (this.c) {
              return e.length ? e.push(Promise.resolve(l)) : l;
            }
            const k = d.call(this, l, ...h);
            k instanceof Promise && e.push(k);
            return k;
          } catch (k) {
            I(f, k);
          }
        });
        if (e.length) {
          try {
            const l = await Promise.all(e);
            b = b.replace(c, () => l.shift());
          } catch (l) {
            I(f, l);
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
      a = B(d.stack), d.stack = a, c(d);
    }
  }
}
;const hb = a => {
  [, a] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || [];
  return a;
}, O = a => {
  let b = 0;
  const c = [];
  let d;
  J(a, [{re:/[{}]/g, replacement(h, k) {
    h = "}" == h;
    const m = !h;
    if (!b && h) {
      throw Error("A closing } is found without opening one.");
    }
    b += m ? 1 : -1;
    1 == b && m ? d = {open:k} : 0 == b && h && (d.close = k, c.push(d), d = {});
  }}]);
  if (b) {
    throw Error(`Unbalanced props (level ${b}) ${a}`);
  }
  const e = {}, f = [], g = {};
  var l = c.reduce((h, {open:k, close:m}) => {
    h = a.slice(h, k);
    const [, n, p, q, t] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(h) || [];
    k = a.slice(k + 1, m);
    if (!p && !/\s*\.\.\./.test(k)) {
      throw Error("Could not detect prop name");
    }
    p ? e[p] = k : f.push(k);
    g[p] = {before:n, I:q, H:t};
    k = h || "";
    k = k.slice(0, k.length - (p || "").length - 1);
    const {G:w, s:P} = N(k);
    Object.assign(e, w);
    Object.assign(g, P);
    return m + 1;
  }, 0);
  if (c.length) {
    l = a.slice(l);
    const {G:h, s:k} = N(l);
    Object.assign(e, h);
    Object.assign(g, k);
  } else {
    const {G:h, s:k} = N(a);
    Object.assign(e, h);
    Object.assign(g, k);
  }
  return {D:e, B:f, s:g};
}, N = a => {
  const b = [], c = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]+?)\5/g, (d, e, f, g, l, h, k, m) => {
    c[f] = {before:e, I:g, H:l};
    b.push({v:m, name:f, O:`${h}${k}${h}`});
    return "%".repeat(d.length);
  }).replace(/(\s*)([^\s%]+)/g, (d, e, f, g) => {
    c[f] = {before:e};
    b.push({v:g, name:f, O:"true"});
  });
  return {G:[...b.reduce((d, {v:e, name:f, O:g}) => {
    d[e] = [f, g];
    return d;
  }, [])].filter(Boolean).reduce((d, [e, f]) => {
    d[e] = f;
    return d;
  }, {}), s:c};
}, ib = (a, b = [], c = !1, d = {}, e = "") => {
  const f = Object.keys(a), {length:g} = f;
  return g || b.length ? `{${f.reduce((l, h) => {
    const k = a[h], m = c || -1 != h.indexOf("-") ? `'${h}'` : h, {before:n = "", I:p = "", H:q = ""} = d[h] || {};
    return [...l, `${n}${m}${p}:${q}${k}`];
  }, b).join(",")}${e}}` : "{}";
}, jb = (a = "") => {
  [a] = a;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}, Q = (a, b = {}, c = [], d = [], e = !1, f = null, g = {}, l = "") => {
  const h = jb(a), k = h ? a : `'${a}'`;
  if (!Object.keys(b).length && !c.length && !d.length) {
    return `h(${k})`;
  }
  const m = h && "dom" == e ? !1 : e;
  h || !d.length || e && "dom" != e || f && f(`JSX: destructuring ${d.join(" ")} is used without quoted props on HTML ${a}.`);
  a = ib(b, d, m, g, l);
  b = c.reduce((n, p, q) => {
    q = c[q - 1];
    return `${n}${q && /\S/.test(q) ? "," : ""}${p}`;
  }, "");
  return `h(${k},${a}${b ? `,${b}` : ""})`;
};
const kb = (a, b = []) => {
  let c = 0, d;
  a = J(a, [...b, {re:/[<>]/g, replacement(e, f) {
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
  return {ba:a, J:d};
}, S = a => {
  const b = hb(a);
  let c;
  const {R:d} = K({R:/=>/g});
  try {
    ({ba:h, J:c} = kb(a, [M(d)]));
  } catch (k) {
    if (1 === k) {
      throw Error(`Could not find the matching closing > for ${b}.`);
    }
  }
  const e = h.slice(0, c + 1);
  var f = e.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(f)) {
    return a = f.replace(/\/\s*>$/, ""), f = "", new R({m:e.replace(d.regExp, "=>"), l:a.replace(d.regExp, "=>"), content:"", tagName:b});
  }
  a = f.replace(/>$/, "");
  f = c + 1;
  c = !1;
  let g = 1, l;
  J(h, [{re:new RegExp(`[\\s\\S](?:<\\s*${b}(\\s+|>)|/\\s*${b}\\s*>)`, "g"), replacement(k, m, n, p) {
    if (c) {
      return k;
    }
    m = !m && k.endsWith(">");
    const q = !m;
    if (q) {
      p = p.slice(n);
      const {J:t} = kb(p.replace(/^[\s\S]/, " "));
      p = p.slice(0, t + 1);
      if (/\/\s*>$/.test(p)) {
        return k;
      }
    }
    g += q ? 1 : -1;
    0 == g && m && (c = n, l = c + k.length);
    return k;
  }}]);
  if (g) {
    throw Error(`Could not find the matching closing </${b}>.`);
  }
  f = h.slice(f, c);
  var h = h.slice(0, l).replace(d.regExp, "=>");
  return new R({m:h, l:a.replace(d.regExp, "=>"), content:f.replace(d.regExp, "=>"), tagName:b});
};
class R {
  constructor(a) {
    this.m = a.m;
    this.l = a.l;
    this.content = a.content;
    this.tagName = a.tagName;
  }
}
;const T = a => {
  let b = "", c = "";
  a = a.replace(/^(\n\s*)([\s\S]+)?/, (d, e, f = "") => {
    b = e;
    return f;
  }).replace(/([\s\S]+?)?(\n\s*)$/, (d, e = "", f = "") => {
    c = f;
    return e;
  });
  return `${b}${a ? `\`${a}\`` : ""}${c}`;
}, mb = a => {
  const b = [];
  let c = {}, d = 0, e = 0;
  J(a, [{re:/[<{}]/g, replacement(f, g) {
    if (!(g < e)) {
      if (/[{}]/.test(f)) {
        d += "{" == f ? 1 : -1, 1 == d && void 0 == c.from ? c.from = g : 0 == d && (c.to = g + 1, c.V = a.slice(c.from + 1, g), b.push(c), c = {});
      } else {
        if (d) {
          return f;
        }
        f = S(a.slice(g));
        e = g + f.m.length;
        c.W = f;
        c.to = e;
        c.from = g;
        b.push(c);
        c = {};
      }
    }
  }}, {}]);
  return b.length ? lb(a, b) : [T(a)];
}, lb = (a, b) => {
  let c = 0;
  b = b.reduce((d, {from:e, to:f, V:g, W:l}) => {
    (e = a.slice(c, e)) && d.push(T(e));
    c = f;
    g ? d.push(g) : l && d.push(l);
    return d;
  }, []);
  if (c < a.length) {
    const d = a.slice(c, a.length);
    d && b.push(T(d));
  }
  return b;
};
const nb = (a, b = {}) => {
  const {quoteProps:c, warn:d} = b;
  var e = bb(a);
  if (null === e) {
    return a;
  }
  var f = a.slice(e);
  const {l:g = "", content:l, tagName:h, m:{length:k}} = S(f);
  f = U(l, c, d);
  const {D:m, B:n, s:p} = O(g.replace(/^ */, ""));
  var q = Q(h, m, f, n, c, d, p, /\s*$/.exec(g) || [""]);
  f = a.slice(0, e);
  a = a.slice(e + k);
  e = k - q.length;
  0 < e && (q = `${" ".repeat(e)}${q}`);
  f = `${f}${q}${a}`;
  return nb(f, b);
}, U = (a, b = !1, c = null) => a ? mb(a).reduce((d, e) => {
  if (e instanceof R) {
    const {l = "", content:h, tagName:k} = e, {D:m, B:n} = O(l);
    e = U(h, b, c);
    e = Q(k, m, e, n, b, c);
    return [...d, e];
  }
  const f = bb(e);
  if (f) {
    var g = e.slice(f);
    const {m:{length:l}, l:h = "", content:k, tagName:m} = S(g), {D:n, B:p} = O(h);
    g = U(k, b, c);
    g = Q(m, n, g, p, b, c);
    const q = e.slice(0, f);
    e = e.slice(f + l);
    return [...d, `${q}${g}${e}`];
  }
  return [...d, e];
}, []) : [];
const ob = (a, b = {}) => {
  const {e:c, S:d, T:e, v:f, X:g, Y:l} = K({S:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, T:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg, v:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, X:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, Y:/^ *import\s+['"].+['"]/gm}, {getReplacement(h, k) {
    return `/*%%_RESTREAM_${h.toUpperCase()}_REPLACEMENT_${k}_%%*/`;
  }, getRegex(h) {
    return new RegExp(`/\\*%%_RESTREAM_${h.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, "g");
  }});
  a = J(a, [M(e), M(d), M(c), M(f), M(g), M(l)]);
  b = nb(a, b);
  return J(b, [L(e), L(d), L(c), L(f), L(g), L(l)]);
};
const pb = (a, b) => {
  a = sa(a);
  ({mode:a} = a);
  ra(b, a);
};
const qb = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function V(a) {
  var b = "";
  a = 0 > a ? (-a << 1) + 1 : a << 1;
  do {
    var c = a & 31;
    a >>>= 5;
    0 < a && (c |= 32);
    if (0 <= c && c < qb.length) {
      c = qb[c];
    } else {
      throw new TypeError("Must be between 0 and 63: " + c);
    }
    b += c;
  } while (0 < a);
  return b;
}
;const {URL:W} = url;
function rb(a, b) {
  return a === b ? 0 : null === a ? 1 : null === b ? -1 : a > b ? 1 : -1;
}
function X(a, b) {
  let c = a.generatedLine - b.generatedLine;
  if (0 !== c) {
    return c;
  }
  c = a.generatedColumn - b.generatedColumn;
  if (0 !== c) {
    return c;
  }
  c = rb(a.source, b.source);
  if (0 !== c) {
    return c;
  }
  c = a.originalLine - b.originalLine;
  if (0 !== c) {
    return c;
  }
  c = a.originalColumn - b.originalColumn;
  return 0 !== c ? c : rb(a.name, b.name);
}
function sb(a) {
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
const tb = /^[A-Za-z0-9+\-.]+:/;
function Y(a) {
  return "/" == a[0] ? "/" == a[1] ? "scheme-relative" : "path-absolute" : tb.test(a) ? "absolute" : "path-relative";
}
function ub(a, b) {
  "string" == typeof a && (a = new W(a));
  "string" == typeof b && (b = new W(b));
  const c = b.pathname.split("/");
  a = a.pathname.split("/");
  for (0 < a.length && !a[a.length - 1] && a.pop(); 0 < c.length && 0 < a.length && c[0] === a[0];) {
    c.shift(), a.shift();
  }
  return a.map(() => "..").concat(c).join("/") + b.search + b.hash;
}
const vb = function(a) {
  return b => {
    const c = Y(b), d = sb(b);
    b = new W(b, d);
    a(b);
    b = b.toString();
    return "absolute" === c ? b : "scheme-relative" === c ? b.slice(5) : "path-absolute" === c ? b.slice(11) : ub(d, b);
  };
}(() => {
});
function wb(a, b) {
  a: {
    if (Y(a) !== Y(b)) {
      var c = null;
    } else {
      c = sb(a + b);
      a = new W(a, c);
      c = new W(b, c);
      try {
        new W("", c.toString());
      } catch (d) {
        c = null;
        break a;
      }
      c = c.protocol !== a.protocol || c.user !== a.user || c.password !== a.password || c.hostname !== a.hostname || c.port !== a.port ? null : ub(a, c);
    }
  }
  return "string" == typeof c ? c : vb(b);
}
;class xb {
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
;class yb {
  constructor() {
    this.a = [];
    this.b = !0;
    this.f = {generatedLine:-1, generatedColumn:0, name:null, originalColumn:null, originalLine:null, source:null};
  }
  add(a) {
    {
      var b = this.f;
      const {generatedLine:c, generatedColumn:d} = b, {generatedLine:e, generatedColumn:f} = a;
      b = e > c || e == c && f >= d || 0 >= X(b, a);
    }
    b ? this.f = a : this.b = !1;
    this.a.push(a);
  }
}
;function zb(a, b, c) {
  null != a.b && (b = wb(a.b, b));
  c ? (a.a || (a.a = Object.create(null)), a.a[b] = c) : a.a && (delete a.a[b], 0 === Object.keys(a.a).length && (a.a = null));
}
function Ab(a, b, c) {
  return b.map(function(d) {
    if (!this.a) {
      return null;
    }
    c && (d = wb(c, d));
    return Object.prototype.hasOwnProperty.call(this.a, d) ? this.a[d] : null;
  }, a);
}
class Bb {
  constructor(a = {}) {
    const {file:b, sourceRoot:c, skipValidation:d = !1} = a;
    this.K = b;
    this.b = c;
    this.Z = d;
    this.u = new xb;
    this.f = new xb;
    this.M = new yb;
    this.a = null;
  }
  toJSON() {
    const a = this.u.a.slice();
    var b = this.f.a.slice();
    {
      var c = 0;
      let f = 1, g = 0, l = 0, h = 0, k = 0, m = "", n;
      let p;
      var d = this.M;
      d.b || (d.a.sort(X), d.b = !0);
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
            if (!X(e, d[q - 1])) {
              continue;
            }
            n += ",";
          }
        }
        n += V(e.generatedColumn - c);
        c = e.generatedColumn;
        null != e.source && (p = this.u.indexOf(e.source), n += V(p - k), k = p, n += V(e.originalLine - 1 - l), l = e.originalLine - 1, n += V(e.originalColumn - g), g = e.originalColumn, null != e.name && (e = this.f.indexOf(e.name), n += V(e - h), h = e));
        m += n;
      }
      c = m;
    }
    b = {version:3, sources:a, names:b, mappings:c};
    this.K && (b.file = this.K);
    this.b && (b.sourceRoot = this.b);
    this.a && (b.sourcesContent = Ab(this, a, this.b));
    return b;
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
}
;const Cb = /\/\*(?:[\s\S]+?)\*\//g, Db = /\/\/(.+)/gm;
const Fb = (a = []) => {
  const {comments:b, inlineComments:c, strings:d, literals:e, escapes:f, regexes:g, regexGroups:l} = K({comments:Cb, inlineComments:Db, strings:/(["'])(.*?)\1/gm, literals:/`([\s\S]*?)`/gm, escapes:/\\[\\`'"/]/g, regexes:/\/(.+?)\//gm, regexGroups:/\[(.*?)\]/gm}), h = [b, c, d, e, f, g, l], [k, m, n, p, q, t, w] = h.map(M), [P, Pb, Qb, Rb, Sb, Tb, Ub] = h.map(Vb => L(Vb));
  return {rules:[q, k, m, n, w, t, p, Eb, ...a, Rb, Tb, Ub, Qb, Pb, P, Sb], markers:{literals:e, strings:d, comments:b, inlineComments:c, escapes:f, regexes:g, regexGroups:l}};
}, Eb = {re:/./, replacement(a) {
  this.stopProcessing && this.brake();
  return a;
}};
const Gb = ({file:a, F:b, aa:c, sourceRoot:d}) => {
  const e = new Bb({file:a, sourceRoot:d});
  b.replace(Cb, (f, g) => {
    if ("\n" == b[g + f.length]) {
      return "\n".repeat(f.split("\n").length - 1);
    }
    g = f.split("\n");
    f = g.length - 1;
    g = " ".repeat(g[f].length);
    return `${"\n".repeat(f)}${g}`;
  }).replace(Db, f => " ".repeat(f.length)).split("\n").forEach((f, g) => {
    const l = g + 1;
    f.replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, (h, k) => {
      if (0 != k || !/^\s+$/.test(h)) {
        h = {line:l, column:k};
        {
          let {L:m, N:n = null, source:p = null, name:q = null} = {L:h, source:c, N:h};
          if (!m) {
            throw Error('"generated" is a required argument');
          }
          if (!e.Z) {
            if (n && "number" != typeof n.line && "number" != typeof n.column) {
              throw Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
            }
            if (!(m && "line" in m && "column" in m && 0 < m.line && 0 <= m.column && !n && !p && !q || m && "line" in m && "column" in m && n && "line" in n && "column" in n && 0 < m.line && 0 <= m.column && 0 < n.line && 0 <= n.column && p)) {
              throw Error("Invalid mapping: " + JSON.stringify({L:m, source:p, N:n, name:q}));
            }
          }
          p && (p = `${p}`, e.u.has(p) || e.u.add(p));
          q && (q = `${q}`, e.f.has(q) || e.f.add(q));
          e.M.add({generatedLine:m.line, generatedColumn:m.column, originalLine:n ? n.line : null, originalColumn:n ? n.column : null, source:p, name:q});
        }
      }
    });
  });
  zb(e, c, b);
  return e.toString();
};
function Hb({source:a, $:b, name:c, destination:d, file:e, F:f}) {
  a = pa(b, a);
  e = Gb({file:e, F:f, aa:a});
  c = `${c}.map`;
  qa(d, `\n//# sourceMappingURL=${c}`);
  b = x(b, c);
  xa(b, e);
}
;const Ib = a => `if (${a} && ${a}.__esModule) ${a} = ${a}.default`, Jb = (a, b, c, d = null) => `${a.replace(/(\s+)from(\s+)([\s\S])*/, (e, f, g) => `${f}=${g}`)}${d ? d : "r" + `equire(${b}${c}${b})`}`, Kb = (a, b = {}) => {
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
}, Lb = /(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%|%%_RESTREAM_LITERALS_REPLACEMENT_(\d+)_%%)/, Mb = (a = {import:{}}) => {
  try {
    return "always" == a.import.esCheck;
  } catch (b) {
    return !1;
  }
};
const Nb = a => a.replace(/(\s+)as(\s+)/g, (b, c, d) => `${1 == c.split("\n").length ? "" : c}:${d}`), Ob = (a, b, c, d, e) => {
  if (!a) {
    return {};
  }
  b = b ? {d:`${b} = ${"r" + `equire(${c}${d}${c})`}`, C:Ib(b)} : void 0;
  const {d:f, C:g} = b;
  a = a.replace(",", "").replace(/([^\s]+)/, f);
  return {t:`${e ? "const" : "let"}${a}`, C:g};
}, Wb = (a, b, c, d, e) => {
  if (!a) {
    return null;
  }
  b = Jb(b, c, d, e);
  return `const${Nb(a)}${b}`;
};
const Xb = [{re:new RegExp(`${/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?/.source}${Lb.source}`, "gm"), replacement:function(a, b, c, d, e, f, g) {
  const [, l, h] = /(["'`])(.+?)\1/.exec(g ? this.markers.literals.map[g] : this.markers.strings.map[f]);
  a = h.replace(this.markers.regexes.regExp, (n, p) => this.markers.regexes.map[p]);
  f = Kb(a, this.config);
  a = /^[./]/.test(f) && !Mb(this.config);
  const {t:k, C:m} = Ob(b, c, l, f, a);
  b = Wb(d, e, l, f, c);
  return `${[k, b, ...a ? [] : [m]].filter(n => n).join("; ")};`;
}}, {re:new RegExp(`${/( *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+(.+?))/.source}${Lb.source}`, "gm"), replacement:function(a, b, c, d, e, f, g) {
  const [, l, h] = /(["'`])(.+?)\1/.exec(g ? this.markers.literals.map[g] : this.markers.strings.map[f]);
  a = Jb(e, l, h);
  ({length:b} = b.split("\n"));
  b = "\n".repeat(b - 1);
  e = /^[./]/.test(h) && !Mb(this.config);
  return `${c ? [`${b}${e ? "const" : "let"} ${d} = ${c}${a}`, ...e ? [] : [Ib(c)]].join("; ") : `${b}const ${d}${a}`};`;
}}];
const Yb = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|await|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/, Zb = /(?:[$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D])(?:[$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*/;
const $b = a => a.split(/,\s*/).filter(b => b), ac = a => a.reduce((b, c) => {
  const [d, e = d] = c.split(/\s+as\s+/);
  return Object.assign({}, b, {[e.trim()]:d.trim()});
}, {}), bc = a => {
  a.replace(Yb, () => {
    throw Error(`Detected reserved identifier "${a}".`);
  });
}, cc = a => {
  ({length:a} = a.split("\n"));
  return "\n".repeat(a - 1);
}, Z = (a, b) => void 0 === b || b ? cc(a) : a.split("\n").map((c, d, e) => {
  ({length:c} = c);
  ({length:e} = e);
  return d == e - 1 ? " ".repeat(c) : "";
}).join("\n");
const dc = (a, b, c) => `${a.replace(/(\s+)from(\s+)([\s\S])*/, (d, e, f) => `${e}=${f}`)}${"r" + `equire(${b}${c}${b});`}`;
function ec(a, b, c, d, e) {
  a = Z(a);
  const f = `$${b.replace(/[-/]/g, "_").replace(/[^\w\d-]/g, "")}`;
  b = dc(c, d, b);
  b = `${a}const ${f}${b}`;
  e = $b(e).reduce((g, l) => {
    const [h, k] = l.split(/\s+as\s+/);
    l = h.trim();
    g[(k ? k.trim() : null) || l] = "default" == l ? f : `${f}.${l}`;
    return g;
  }, {});
  this.emit("export", e);
  return b;
}
;const fc = a => {
  var b = a = void 0 === a ? {} : a, c = Object.assign({}, b);
  b = b["default"];
  c = (delete c["default"], c);
  b = b ? `module.exports = ${b}` : "";
  c = Object.keys(c).map(d => `module.exports.${d} = ${a[d]}`);
  return [b, ...c].filter(d => d).join("\n");
};
const gc = [{re:/[\s\S]*/, replacement(a) {
  this.exports = {};
  this.on("export", b => {
    this.exports = Object.assign({}, this.exports, b);
  });
  return a;
}}, {re:new RegExp(`^( *export\\s+?)( *${/(?:let|const|var|class|function\s*\*?|async +function)/.source}\\s+((?:${Zb.source}\\s*,?\\s*)+))`, "gm"), replacement:function(a, b, c, d) {
  d.split(/,\s*/).forEach(e => {
    e = e.trim().replace(/\s+extends\s+.+/, "");
    bc(e);
    this.emit("export", {[e]:e});
  });
  return `${Z(b, !1)}${c}`;
}}, {re:new RegExp(`${/^( *export\s+{([^}]+?)})/.source}${/(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%|%%_RESTREAM_LITERALS_REPLACEMENT_(\d+)_%%)/.source}`, "gm"), replacement:function(a, b, c, d, e, f) {
  const [, g, l] = /(["'`])(.+?)\1/.exec(f ? this.markers.literals.map[f] : this.markers.strings.map[e]);
  return ec.call(this, b, l, d, g, c);
}}, {re:/^( *export\s+{([^}]+?)} *)(\n?)/gm, replacement:function(a, b, c, d) {
  a = $b(c);
  a = ac(a);
  this.emit("export", a);
  return `${Z(b)}${d ? d : ""}`;
}}, {re:new RegExp(`^( *export\\s+default\\s+?)( *${/(?:class|function\s*\*?|async +function)/.source}\\s+(${Zb.source}))`, "m"), replacement:function(a, b, c, d) {
  a = d.trim();
  bc(a);
  this.emit("export", {"default":a});
  return `${Z(b, !1)}${c}`;
}}, {re:/^( *)(export\s+)(default\s+)/m, replacement:function(a, b, c, d) {
  a = c.replace(/export ?/, "module.");
  d = d.replace(/default ?/, "exports=");
  return `${b}${a}${d}`;
}}, {re:/[\s\S]*/, replacement(a) {
  const b = fc(this.exports);
  return `${a}${b ? `\n\n${b}` : ""}`;
}}];
class hc extends gb {
  constructor() {
    a: {
      var a = {};
      try {
        var b = x(process.cwd(), ".alamoderc.json");
        a = require(b);
      } catch (f) {
        break a;
      }
      ({env:{ALAMODE_ENV:b}} = process);
      const {env:e} = a;
      a = e && b in e ? e[b] : a;
      delete a.env;
    }
    {
      b = [...Xb, ...gc];
      const {rules:e, markers:f} = Fb(b);
      b = {rules:e, markers:f};
    }
    const {rules:c, markers:d} = b;
    super(c);
    this.markers = d;
    this.config = a;
  }
}
const ic = async a => {
  var {source:b, destination:c, writable:d, debug:e} = a;
  const f = new hc;
  e && (f.stopProcessing = !0);
  a = y(b);
  a.pipe(f);
  a.on("error", g => f.emit("error", g));
  [, a] = await Promise.all([Va(Object.assign({}, {source:b}, d ? {writable:d} : {destination:c}, {readable:f})), H(a), new Promise((g, l) => f.on("finish", g).on("error", l))]);
  return a;
};
const jc = Za("alamode"), lc = async({input:a, A:b, name:c, i:d, g:e, h:f, extensions:g, debug:l}) => {
  const h = x(b, c);
  e.includes(h) || e.some(k => h.startsWith(`${k}/`)) || (e = "-" == d, a = x(a, h), b = e ? null : x(d, b), e = e ? "-" : x(b, c), jc(h), await E(e), kc(h, g) ? (g = await ic({source:a, destination:e, debug:l}), "-" != d && (pb(a, e), f || Hb({destination:e, file:h, name:c, $:b, source:a, F:g}))) : await Va({source:a, destination:e}));
}, nc = async({input:a, i:b, A:c = ".", g:d = [], h:e, extensions:f, o:g, w:l, debug:h}) => {
  if ("-" == b) {
    throw Error("Output to stdout is only for files.");
  }
  const k = x(a, c), m = x(b, c), {content:n} = await G(k);
  await Object.keys(n).reduce(async(p, q) => {
    await p;
    const t = x(k, q);
    p = x(m, q);
    const {type:w} = n[q];
    "File" == w ? g && /jsx$/.test(q) ? (q = await mc(t, l), p = p.replace(/jsx$/, "js"), await E(p), await Ua(p, q)) : g ? await Na(t, m) : await lc({input:a, A:c, name:q, i:b, g:d, h:e, extensions:f, o:g, debug:h}) : "Directory" == w && (q = x(c, q), await nc({input:a, i:b, g:d, A:q, h:e, extensions:f, o:g, debug:h}));
  }, {});
}, mc = async(a, b) => {
  var c = await Ta(a);
  c = await ob(c, {quoteProps:"dom", warn(d) {
    console.warn(Ya(d, "yellow"));
    console.warn(Ya(" in %s", "grey"), a);
  }});
  return b ? `import { h } from 'preact'
${c}` : c;
}, kc = (a, b) => b.some(c => a.endsWith(c)), oc = async() => {
  var {input:a, i:b = "-", g:c = [], h:d, extensions:e, o:f, w:g, debug:l} = {input:da, i:ea, h:ja, g:ia ? ia.split(",") : [], extensions:ka.split(","), o:la, w:ma, debug:na};
  if (!a) {
    throw Error("Please specify the source file or directory.");
  }
  var h = sa(a);
  if (h.isDirectory()) {
    if (!b) {
      throw Error("Please specify the output directory.");
    }
    await nc({input:a, i:b, g:c, h:d, extensions:e, o:f, w:g, debug:l});
  } else {
    if (h.isFile()) {
      if (h = oa(a), f && /jsx$/.test(h)) {
        var k = "-" == b ? "-" : x(b, h);
        h = await mc(a, g);
        "-" == k ? console.log(h) : (k = k.replace(/jsx$/, "js"), await E(k), await Ua(k, h));
      } else {
        await lc({input:v(a), A:".", name:h, i:b, g:c, h:d, extensions:e, w:g, debug:l});
      }
    }
  }
  "-" != b && process.stdout.write(`Transpiled code saved to ${b}\n`);
};
function pc() {
  const {usage:a = {}, description:b, line:c, example:d} = {usage:qc, description:"A tool to transpile JavaScript packages using regular expressions.\nSupports import/export and JSX transpilation.\nhttps://artdecocode.com/alamode/", line:"alamode source [-o destination] [-i dir,file] [-s] [-jp]", example:"alamode src -o build"};
  var e = Object.keys(a);
  const f = Object.values(a), [g] = e.reduce(([k = 0, m = 0], n) => {
    const p = a[n].split("\n").reduce((q, t) => t.length > q ? t.length : q, 0);
    p > m && (m = p);
    n.length > k && (k = n.length);
    return [k, m];
  }, []), l = (k, m) => {
    m = " ".repeat(m - k.length);
    return `${k}${m}`;
  };
  e = e.reduce((k, m, n) => {
    n = f[n].split("\n");
    m = l(m, g);
    const [p, ...q] = n;
    m = `${m}\t${p}`;
    const t = l("", g);
    n = q.map(w => `${t}\t${w}`);
    return [...k, m, ...n];
  }, []).map(k => `\t${k}`);
  const h = [b, `  ${c || ""}`].filter(k => k ? k.trim() : k).join("\n\n");
  e = `${h ? `${h}\n` : ""}
${e.join("\n")}
`;
  return d ? `${e}
  Example:

    ${d}
` : e;
}
;if (ha) {
  var rc, qc = ca();
  rc = pc();
  console.log(rc);
  process.exit();
} else {
  fa && (console.log("v%s", require("../../package.json").version), process.exit());
}
(async() => {
  try {
    await oc();
  } catch (a) {
    if (process.env.DEBUG) {
      return console.log(a.stack);
    }
    console.log(a.message);
  }
})();

