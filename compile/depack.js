#!/usr/bin/env node
             
const _module = require('module');
const path = require('path');
const vm = require('vm');
const stream = require('stream');
const os = require('os');
const fs = require('fs');
const url = require('url');             
var aa = _module;
const {builtinModules:ba} = _module;
const {basename:ca, dirname:u, extname:da, join:v, relative:w, resolve:x} = path;
/*

 James Talmage <james@talmage.io> (github.com/jamestalmage)
*/
var ea = /^(?:.*[\\/])?node_modules(?:[\\/].*)?$/;
/*

 (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org
*/
const y = 1 < module.constructor.length ? module.constructor : aa;
function fa(a, b, c, d) {
  if ("string" != typeof a || !b.includes(da(a))) {
    return !1;
  }
  a = x(a);
  return d && ea.test(a) ? !1 : c && "function" == typeof c ? !!c(a) : !0;
}
function z(a, b = {}) {
  let {exts:c = [".js"], ignoreNodeModules:d = !0, matcher:e = null} = b;
  const f = Array.isArray(c) ? c : [c];
  let g = !1;
  const k = {}, h = {}, l = y._extensions[".js"];
  f.forEach(m => {
    if ("string" != typeof m) {
      throw new TypeError(`Invalid Extension: ${m}`);
    }
    const n = y._extensions[m] || l;
    h[m] = n;
    k[m] = y._extensions[m] = function(p, q) {
      let r;
      !g && fa(q, f, e, d) && (r = p._compile, p._compile = function(t) {
        p._compile = r;
        t = a(t, q);
        if ("string" != typeof t) {
          throw Error("[Pirates] A hook returned a non-string, or nothing at all! This is a violation of intergalactic law!\n--------------------\nIf you have no idea what this means or what Pirates is, let me explain: Pirates is a module that makes is easy to implement require hooks. One of the require hooks you're using uses it. One of these require hooks didn't return anything from it's handler, so we don't know what to do. You might want to debug this.");
        }
        return p._compile(t, q);
      });
      n(p, q);
    };
  });
  return function() {
    g || (g = !0, f.forEach(m => {
      y._extensions[m] === k[m] && (y._extensions[m] = h[m]);
    }));
  };
}
;const {Script:ha} = vm;
const ia = (a, b) => {
  const [c, , d] = a.split("\n");
  a = parseInt(c.replace(/.+?(\d+)$/, (f, g) => g)) - 1;
  const e = d.indexOf("^");
  ({length:b} = b.split("\n").slice(0, a).join("\n"));
  return b + e + (a ? 1 : 0);
};
const A = a => {
  try {
    new ha(a);
  } catch (b) {
    const {message:c, stack:d} = b;
    if ("Unexpected token <" != c) {
      throw b;
    }
    return ia(d, a);
  }
  return null;
};
const {Writable:ja} = stream;
function ka(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const {re:b, replacement:c} = a;
  a = b instanceof RegExp;
  const d = -1 != ["string", "function"].indexOf(typeof c);
  return a && d;
}
;function B(a, b) {
  function c() {
    return b.filter(ka).reduce((d, {re:e, replacement:f}) => {
      if (this.u) {
        return d;
      }
      if ("string" == typeof f) {
        return d = d.replace(e, f);
      }
      {
        let g;
        return d.replace(e, (k, ...h) => {
          g = Error();
          try {
            return this.u ? k : f.call(this, k, ...h);
          } catch (l) {
            {
              k = l;
              if (!(k instanceof Error)) {
                throw k;
              }
              [, , h] = g.stack.split("\n", 3);
              h = k.stack.indexOf(h);
              if (-1 == h) {
                throw k;
              }
              h = k.stack.substr(0, h - 1);
              const m = h.lastIndexOf("\n");
              k.stack = h.substr(0, m);
              throw k;
            }
          }
        });
      }
    }, `${a}`);
  }
  c.brake = () => {
    c.u = !0;
  };
  return c.call(c);
}
;const la = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), ma = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`, C = (a, b) => Object.keys(a).reduce((c, d) => {
  {
    var e = a[d];
    const {getReplacement:f = ma, getRegex:g = la} = b || {}, k = g(d);
    e = {name:d, re:e, regExp:k, getReplacement:f, map:{}, lastIndex:0};
  }
  return Object.assign({}, c, {[d]:e});
}, {}), D = a => {
  var b = void 0 === b ? [] : b;
  const {regExp:c, map:d} = a;
  return {re:c, replacement(e, f) {
    e = d[f];
    delete d[f];
    return B(e, Array.isArray(b) ? b : [b]);
  }};
}, E = a => {
  const {re:b, map:c, getReplacement:d, name:e} = a;
  return {re:b, replacement(f) {
    const {lastIndex:g} = a;
    c[g] = f;
    a.lastIndex += 1;
    return d(e, g);
  }};
};
const {homedir:na} = os;
const F = /\s+at.*(?:\(|\s)(.*)\)?/, oa = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, pa = na(), G = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(oa.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(f => {
    f = f.match(F);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(f);
  }).filter(f => f.trim()).map(f => b ? f.replace(F, (g, k) => g.replace(k, k.replace(pa, "~"))) : f).join("\n");
};
const I = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, qa = (a, b = !1) => I(a, 2 + (b ? 1 : 0)), J = a => {
  ({callee:{caller:a}} = a);
  return a;
};
function ra(a, b, c = !1) {
  return function(d) {
    var e = J(arguments), {stack:f} = Error();
    const g = I(f, 2, !0), k = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${k}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = G(e);
    return Object.assign(f ? d : Error(), {message:k, stack:e});
  };
}
;function K(a) {
  var {stack:b} = Error();
  const c = J(arguments);
  b = qa(b, a);
  return ra(c, b, a);
}
;const sa = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class ta extends ja {
  constructor(a) {
    var b = a || {}, c = Object.assign({}, b);
    const d = void 0 === b.binary ? !1 : b.binary, e = void 0 === b.rs ? null : b.rs;
    b = (delete c.binary, delete c.rs, c);
    const {M:f = K(!0), proxyError:g} = a || {}, k = (h, l) => f(l);
    super(b);
    this.a = [];
    this.I = new Promise((h, l) => {
      this.on("finish", () => {
        let m;
        d ? m = Buffer.concat(this.a) : m = this.a.join("");
        h(m);
        this.a = [];
      });
      this.once("error", m => {
        if (-1 == m.stack.indexOf("\n")) {
          k`${m}`;
        } else {
          const n = G(m.stack);
          m.stack = n;
          g && k`${m}`;
        }
        l(m);
      });
      e && sa(this, e).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get b() {
    return this.I;
  }
}
const ua = async a => {
  var b = void 0 === b ? {} : b;
  ({b:a} = new ta(Object.assign({}, {rs:a}, b, {M:K(!0)})));
  return await a;
};
const va = a => {
  [, a] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || [];
  return a;
}, M = a => {
  let b = 0;
  const c = [];
  let d;
  B(a, [{re:/[{}]/g, replacement(h, l) {
    h = "}" == h;
    const m = !h;
    if (!b && h) {
      throw Error("A closing } is found without opening one.");
    }
    b += m ? 1 : -1;
    1 == b && m ? d = {open:l} : 0 == b && h && (d.close = l, c.push(d), d = {});
  }}]);
  if (b) {
    throw Error(`Unbalanced props (level ${b}) ${a}`);
  }
  const e = {}, f = [], g = {};
  var k = c.reduce((h, {open:l, close:m}) => {
    h = a.slice(h, l);
    const [, n, p, q, r] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(h) || [];
    l = a.slice(l + 1, m);
    if (!p && !/\s*\.\.\./.test(l)) {
      throw Error("Could not detect prop name");
    }
    p ? e[p] = l : f.push(l);
    g[p] = {before:n, w:q, v:r};
    l = h || "";
    l = l.slice(0, l.length - (p || "").length - 1);
    const {s:t, h:H} = L(l);
    Object.assign(e, t);
    Object.assign(g, H);
    return m + 1;
  }, 0);
  if (c.length) {
    k = a.slice(k);
    const {s:h, h:l} = L(k);
    Object.assign(e, h);
    Object.assign(g, l);
  } else {
    const {s:h, h:l} = L(a);
    Object.assign(e, h);
    Object.assign(g, l);
  }
  return {o:e, l:f, h:g};
}, L = a => {
  const b = [], c = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]+?)\5/g, (d, e, f, g, k, h, l, m) => {
    c[f] = {before:e, w:g, v:k};
    b.push({j:m, name:f, H:`${h}${l}${h}`});
    return "%".repeat(d.length);
  }).replace(/(\s*)([^\s%]+)/g, (d, e, f, g) => {
    c[f] = {before:e};
    b.push({j:g, name:f, H:"true"});
  });
  return {s:[...b.reduce((d, {j:e, name:f, H:g}) => {
    d[e] = [f, g];
    return d;
  }, [])].filter(Boolean).reduce((d, [e, f]) => {
    d[e] = f;
    return d;
  }, {}), h:c};
}, wa = (a, b = [], c = !1, d = {}, e = "") => {
  const f = Object.keys(a), {length:g} = f;
  return g || b.length ? `{${f.reduce((k, h) => {
    const l = a[h], m = c || -1 != h.indexOf("-") ? `'${h}'` : h, {before:n = "", w:p = "", v:q = ""} = d[h] || {};
    return [...k, `${n}${m}${p}:${q}${l}`];
  }, b).join(",")}${e}}` : "{}";
}, xa = (a = "") => {
  [a] = a;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}, N = (a, b = {}, c = [], d = [], e = !1, f = null, g = {}, k = "") => {
  const h = xa(a), l = h ? a : `'${a}'`;
  if (!Object.keys(b).length && !c.length && !d.length) {
    return `h(${l})`;
  }
  const m = h && "dom" == e ? !1 : e;
  h || !d.length || e && "dom" != e || f && f(`JSX: destructuring ${d.join(" ")} is used without quoted props on HTML ${a}.`);
  a = wa(b, d, m, g, k);
  b = c.reduce((n, p, q) => {
    q = c[q - 1];
    return `${n}${q && /\S/.test(q) ? "," : ""}${p}`;
  }, "");
  return `h(${l},${a}${b ? `,${b}` : ""})`;
};
const ya = (a, b = []) => {
  let c = 0, d;
  a = B(a, [...b, {re:/[<>]/g, replacement(e, f) {
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
  return {V:a, A:d};
}, P = a => {
  const b = va(a);
  let c;
  const {J:d} = C({J:/=>/g});
  try {
    ({V:h, A:c} = ya(a, [E(d)]));
  } catch (l) {
    if (1 === l) {
      throw Error(`Could not find the matching closing > for ${b}.`);
    }
  }
  const e = h.slice(0, c + 1);
  var f = e.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(f)) {
    return a = f.replace(/\/\s*>$/, ""), f = "", new O({g:e.replace(d.regExp, "=>"), f:a.replace(d.regExp, "=>"), content:"", tagName:b});
  }
  a = f.replace(/>$/, "");
  f = c + 1;
  c = !1;
  let g = 1, k;
  B(h, [{re:new RegExp(`[\\s\\S](?:<\\s*${b}(\\s+|>)|/\\s*${b}\\s*>)`, "g"), replacement(l, m, n, p) {
    if (c) {
      return l;
    }
    m = !m && l.endsWith(">");
    const q = !m;
    if (q) {
      p = p.slice(n);
      const {A:r} = ya(p.replace(/^[\s\S]/, " "));
      p = p.slice(0, r + 1);
      if (/\/\s*>$/.test(p)) {
        return l;
      }
    }
    g += q ? 1 : -1;
    0 == g && m && (c = n, k = c + l.length);
    return l;
  }}]);
  if (g) {
    throw Error(`Could not find the matching closing </${b}>.`);
  }
  f = h.slice(f, c);
  var h = h.slice(0, k).replace(d.regExp, "=>");
  return new O({g:h, f:a.replace(d.regExp, "=>"), content:f.replace(d.regExp, "=>"), tagName:b});
};
class O {
  constructor(a) {
    this.g = a.g;
    this.f = a.f;
    this.content = a.content;
    this.tagName = a.tagName;
  }
}
;const Q = a => {
  let b = "", c = "";
  a = a.replace(/^(\n\s*)([\s\S]+)?/, (d, e, f = "") => {
    b = e;
    return f;
  }).replace(/([\s\S]+?)?(\n\s*)$/, (d, e = "", f = "") => {
    c = f;
    return e;
  });
  return `${b}${a ? `\`${a}\`` : ""}${c}`;
}, Aa = a => {
  const b = [];
  let c = {}, d = 0, e = 0;
  B(a, [{re:/[<{}]/g, replacement(f, g) {
    if (!(g < e)) {
      if (/[{}]/.test(f)) {
        d += "{" == f ? 1 : -1, 1 == d && void 0 == c.from ? c.from = g : 0 == d && (c.to = g + 1, c.N = a.slice(c.from + 1, g), b.push(c), c = {});
      } else {
        if (d) {
          return f;
        }
        f = P(a.slice(g));
        e = g + f.g.length;
        c.O = f;
        c.to = e;
        c.from = g;
        b.push(c);
        c = {};
      }
    }
  }}, {}]);
  return b.length ? za(a, b) : [Q(a)];
}, za = (a, b) => {
  let c = 0;
  b = b.reduce((d, {from:e, to:f, N:g, O:k}) => {
    (e = a.slice(c, e)) && d.push(Q(e));
    c = f;
    g ? d.push(g) : k && d.push(k);
    return d;
  }, []);
  if (c < a.length) {
    const d = a.slice(c, a.length);
    d && b.push(Q(d));
  }
  return b;
};
const Ba = (a, b = {}) => {
  const {quoteProps:c, warn:d} = b;
  var e = A(a);
  if (null === e) {
    return a;
  }
  var f = a.slice(e);
  const {f:g = "", content:k, tagName:h, g:{length:l}} = P(f);
  f = R(k, c, d);
  const {o:m, l:n, h:p} = M(g.replace(/^ */, ""));
  var q = N(h, m, f, n, c, d, p, /\s*$/.exec(g) || [""]);
  f = a.slice(0, e);
  a = a.slice(e + l);
  e = l - q.length;
  0 < e && (q = `${" ".repeat(e)}${q}`);
  f = `${f}${q}${a}`;
  return Ba(f, b);
}, R = (a, b = !1, c = null) => a ? Aa(a).reduce((d, e) => {
  if (e instanceof O) {
    const {f:k = "", content:h, tagName:l} = e, {o:m, l:n} = M(k);
    e = R(h, b, c);
    e = N(l, m, e, n, b, c);
    return [...d, e];
  }
  const f = A(e);
  if (f) {
    var g = e.slice(f);
    const {g:{length:k}, f:h = "", content:l, tagName:m} = P(g), {o:n, l:p} = M(h);
    g = R(l, b, c);
    g = N(m, n, g, p, b, c);
    const q = e.slice(0, f);
    e = e.slice(f + k);
    return [...d, `${q}${g}${e}`];
  }
  return [...d, e];
}, []) : [];
const Ca = a => {
  const {e:b, K:c, L:d, j:e, P:f, R:g} = C({K:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, L:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg, j:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, P:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, R:/^ *import\s+['"].+['"]/gm}, {getReplacement(k, h) {
    return `/*%%_RESTREAM_${k.toUpperCase()}_REPLACEMENT_${h}_%%*/`;
  }, getRegex(k) {
    return new RegExp(`/\\*%%_RESTREAM_${k.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, "g");
  }});
  a = B(a, [E(d), E(c), E(b), E(e), E(f), E(g)]);
  a = Ba(a, {});
  return B(a, [D(d), D(c), D(b), D(e), D(f), D(g)]);
};
const Da = /\/\*(?:[\s\S]+?)\*\//g, Ea = /\/\/(.+)/gm;
const Ga = (a = []) => {
  const {comments:b, inlineComments:c, strings:d, literals:e, escapes:f, regexes:g, regexGroups:k} = C({comments:Da, inlineComments:Ea, strings:/(["'])(.*?)\1/gm, literals:/`([\s\S]*?)`/gm, escapes:/\\[\\`'"/]/g, regexes:/\/(.+?)\//gm, regexGroups:/\[(.*?)\]/gm}), h = [b, c, d, e, f, g, k], [l, m, n, p, q, r, t] = h.map(E), [H, Ya, Za, $a, ab, bb, cb] = h.map(db => D(db));
  return {rules:[q, l, m, n, t, r, p, Fa, ...a, $a, bb, cb, Za, Ya, H, ab], markers:{literals:e, strings:d, comments:b, inlineComments:c, escapes:f, regexes:g, regexGroups:k}};
}, Fa = {re:/./, replacement(a) {
  this.stopProcessing && this.brake();
  return a;
}};
const Ha = a => `if (${a} && ${a}.__esModule) ${a} = ${a}.default`, Ia = (a, b, c, d = null) => `${a.replace(/(\s+)from(\s+)([\s\S])*/, (e, f, g) => `${f}=${g}`)}${d ? d : "r" + `equire(${b}${c}${b})`}`, Ja = (a, b = {}) => {
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
}, Ka = /(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%|%%_RESTREAM_LITERALS_REPLACEMENT_(\d+)_%%)/, La = (a = {import:{}}) => {
  try {
    return "always" == a.import.esCheck;
  } catch (b) {
    return !1;
  }
}, Ma = (a, b = {import:{}}) => {
  try {
    return b.import.alamodeModules.includes(a);
  } catch (c) {
    return !1;
  }
};
function Na(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function Oa(a, b, c) {
  const d = K(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:e} = a;
  if (!e) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((f, g) => {
    const k = (l, m) => l ? (l = d(l), g(l)) : f(c || m);
    let h = [k];
    Array.isArray(b) ? (b.forEach((l, m) => {
      Na(e, m);
    }), h = [...b, k]) : 1 < Array.from(arguments).length && (Na(e, 0), h = [b, k]);
    a(...h);
  });
}
;const {createReadStream:Pa, lstat:Qa} = fs;
const S = async a => {
  try {
    return await Oa(Qa, a);
  } catch (b) {
    return null;
  }
};
async function Ra(a) {
  a = Pa(a);
  return await ua(a);
}
;const Sa = async a => {
  var b = await S(a);
  let c = a, d = !1;
  if (!b) {
    if (c = await T(a), !c) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (b.isDirectory()) {
      b = !1;
      let e;
      a.endsWith("/") || (e = c = await T(a), b = !0);
      if (!e) {
        c = await T(v(a, "index"));
        if (!c) {
          throw Error(`${b ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? w("", c) : c, W:d};
}, T = async a => {
  a = `${a}.js`;
  let b = await S(a);
  b || (a = `${a}x`);
  if (b = await S(a)) {
    return a;
  }
};
const Ua = async(a, b, c) => {
  c = void 0 === c ? {} : c;
  const {fields:d, soft:e = !1} = c;
  var f = v(a, "node_modules", b);
  f = v(f, "package.json");
  var g = await S(f);
  if (g) {
    a = await Ta(f, d);
    if (void 0 === a) {
      throw Error(`The package ${w("", f)} does export the module.`);
    }
    if (!a.entryExists && !e) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    var k = a, h = Object.assign({}, k);
    b = k.entry;
    a = k.version;
    c = k.packageName;
    g = k.main;
    k = k.entryExists;
    h = (delete h.entry, delete h.version, delete h.packageName, delete h.main, delete h.entryExists, h);
    return Object.assign({}, {entry:w("", b), packageJson:w("", f)}, a ? {version:a} : {}, {packageName:c}, g ? {hasMain:!0} : {}, k ? {} : {entryExists:!1}, h);
  }
  if ("/" == a && !g) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return Ua(v(x(a), ".."), b, c);
}, Ta = async(a, b) => {
  b = void 0 === b ? [] : b;
  const c = await Ra(a);
  let d, e, f, g, k;
  try {
    var h = JSON.parse(c), l = Object.assign({}, h);
    d = h.module;
    e = h.version;
    f = h.name;
    g = h.main;
    k = (delete l.module, delete l.version, delete l.name, delete l.main, l);
    k = b.reduce((n, p) => {
      n[p] = k[p];
      return n;
    }, {});
  } catch (n) {
    throw Error(`Could not parse ${a}.`);
  }
  a = u(a);
  b = d || g;
  if (!b) {
    if (!await S(v(a, "index.js"))) {
      return;
    }
    b = g = "index.js";
  }
  a = v(a, b);
  let m;
  try {
    ({path:m} = await Sa(a)), a = m;
  } catch (n) {
  }
  return Object.assign({}, {entry:a, version:e, packageName:f, main:!d && g, entryExists:!!m}, k);
};
const Va = a => a.replace(/(\s+)as(\s+)/g, (b, c, d) => `${1 == c.split("\n").length ? "" : c}:${d}`), Wa = (a, b, c = {}) => {
  if (!c.import) {
    return null;
  }
  ({import:{stdlib:c}} = c);
  if (c) {
    const {packages:d, path:e} = c;
    return d.includes(b) ? w(u(a), e).replace(/.js$/, "") : null;
  }
  return null;
}, fb = (a, b, c, d, e, f, g) => {
  const {t:k, m:h} = Xa(c, d, e, f, g);
  a = eb(a, b, e, f, d);
  return `${[k, a, ...g ? [] : [h]].filter(l => l).join("; ")};`;
}, gb = (a, b) => {
  if (La(b)) {
    return !1;
  }
  if (/^[./]/.test(a) || ba.includes(a) || Ma(a, b)) {
    return !0;
  }
}, hb = async(a, b, c, d) => {
  if (gb(a, b)) {
    return !0;
  }
  if (a in d) {
    return d[a];
  }
  if (c) {
    try {
      const {alamode:e} = await Ua(u(c), a, {fields:["alamode"]});
      d[a] = !!e;
      return e;
    } catch (e) {
      return !1;
    }
  }
}, Xa = (a, b, c, d, e) => {
  if (!a) {
    return {};
  }
  b = b ? {d:`${b} = ${"r" + `equire(${c}${d}${c})`}`, m:Ha(b)} : void 0;
  const {d:f, m:g} = b;
  a = a.replace(",", "").replace(/([^\s]+)/, f);
  return {t:`${e ? "const" : "let"}${a}`, m:g};
}, eb = (a, b, c, d, e) => {
  if (!a) {
    return null;
  }
  b = Ia(b, c, d, e);
  return `const${Va(a)}${b}`;
};
const ib = [{re:new RegExp(`${/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?/.source}${Ka.source}`, "gm"), replacement:function(a, b, c, d, e, f, g) {
  const [, k, h] = /(["'`])(.+?)\1/.exec(g ? this.markers.literals.map[g] : this.markers.strings.map[f]);
  a = h.replace(this.markers.regexes.regExp, (m, n) => this.markers.regexes.map[n]);
  const l = (f = Wa(this.file, h, this.config)) || Ja(a, this.config);
  f && (d ? b && (d = d.replace(/{/, `{ ${c},`), d = b.replace(/\S/g, " ") + d, c = b = void 0) : (d = b.replace(/(\S+)/, "{ $1 }"), c = b = void 0));
  this.F || (this.F = {});
  if (this.async) {
    return hb(l, this.config, this.file, this.F).then(m => fb(d, e, b, c, k, l, m));
  }
  a = gb(l, this.config);
  return fb(d, e, b, c, k, l, a);
}}, {re:new RegExp(`${/( *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+(.+?))/.source}${Ka.source}`, "gm"), replacement:function(a, b, c, d, e, f, g) {
  const [, k, h] = /(["'`])(.+?)\1/.exec(g ? this.markers.literals.map[g] : this.markers.strings.map[f]);
  a = Ia(e, k, h);
  ({length:b} = b.split("\n"));
  b = "\n".repeat(b - 1);
  e = /^[./]/.test(h) && !La(this.config);
  return `${c ? [`${b}${e ? "const" : "let"} ${d} = ${c}${a}`, ...e ? [] : [Ha(c)]].join("; ") : `${b}const ${d}${a}`};`;
}}];
const jb = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|await|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/, kb = /(?:[$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D])(?:[$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*/;
const lb = a => a.split(/,\s*/).filter(b => b), mb = a => a.reduce((b, c) => {
  const [d, e = d] = c.split(/\s+as\s+/);
  return Object.assign({}, b, {[e.trim()]:d.trim()});
}, {}), nb = a => {
  a.replace(jb, () => {
    throw Error(`Detected reserved identifier "${a}".`);
  });
}, ob = a => {
  ({length:a} = a.split("\n"));
  return "\n".repeat(a - 1);
}, U = (a, b) => void 0 === b || b ? ob(a) : a.split("\n").map((c, d, e) => {
  ({length:c} = c);
  ({length:e} = e);
  return d == e - 1 ? " ".repeat(c) : "";
}).join("\n");
const pb = (a, b, c) => `${a.replace(/(\s+)from(\s+)([\s\S])*/, (d, e, f) => `${e}=${f}`)}${"r" + `equire(${b}${c}${b});`}`;
function qb(a, b, c, d, e) {
  a = this.noSourceMaps ? "" : U(a);
  const f = `$${b.replace(/[-/]/g, "_").replace(/[^\w\d-]/g, "")}`;
  b = pb(c, d, b);
  b = `${a}const ${f}${b}`;
  e = lb(e).reduce((g, k) => {
    const [h, l] = k.split(/\s+as\s+/);
    k = h.trim();
    g[(l ? l.trim() : null) || k] = "default" == k ? f : `${f}.${k}`;
    return g;
  }, {});
  this.emit("export", e);
  return b;
}
;const rb = a => {
  var b = a = void 0 === a ? {} : a, c = Object.assign({}, b);
  b = b["default"];
  c = (delete c["default"], c);
  b = b ? `module.exports = ${b}` : "";
  c = Object.keys(c).map(d => `module.exports.${d} = ${a[d]}`);
  return [b, ...c].filter(d => d).join("\n");
};
const sb = [{re:/[\s\S]*/, replacement(a) {
  this.exports = {};
  this.on("export", b => {
    this.exports = Object.assign({}, this.exports, b);
  });
  return a;
}}, {re:new RegExp(`^( *export\\s+?)( *${/(?:let|const|var|class|function\s*\*?|async +function)/.source}\\s+((?:${kb.source}\\s*,?\\s*)+))`, "gm"), replacement:function(a, b, c, d) {
  d.split(/,\s*/).forEach(e => {
    e = e.trim().replace(/\s+extends\s+.+/, "");
    nb(e);
    this.emit("export", {[e]:e});
  });
  return this.noSourceMaps ? c : `${U(b, !1)}${c}`;
}}, {re:new RegExp(`${/^( *export\s+{([^}]+?)})/.source}${/(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%|%%_RESTREAM_LITERALS_REPLACEMENT_(\d+)_%%)/.source}`, "gm"), replacement:function(a, b, c, d, e, f) {
  const [, g, k] = /(["'`])(.+?)\1/.exec(f ? this.markers.literals.map[f] : this.markers.strings.map[e]);
  return qb.call(this, b, k, d, g, c);
}}, {re:/^( *export\s+{([^}]+?)} *)(\n?)/gm, replacement:function(a, b, c, d) {
  a = lb(c);
  a = mb(a);
  this.emit("export", a);
  return this.noSourceMaps ? "" : `${U(b)}${d ? d : ""}`;
}}, {re:new RegExp(`^( *export\\s+default\\s+?)( *${/(?:class|function\s*\*?|async +function)/.source}\\s+(${kb.source}))`, "m"), replacement:function(a, b, c, d) {
  a = d.trim();
  nb(a);
  this.emit("export", {"default":a});
  return this.noSourceMaps ? c : `${U(b, !1)}${c}`;
}}, {re:/^( *)(export\s+)(default\s+)/m, replacement:function(a, b, c, d) {
  a = c.replace(/export ?/, "module.");
  d = d.replace(/default ?/, "exports=");
  return `${b}${a}${d}`;
}}, {re:/[\s\S]*/, replacement(a) {
  const b = rb(this.exports);
  return `${a}${b ? `\n\n${b}` : ""}`;
}}];
const tb = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function V(a) {
  var b = "";
  a = 0 > a ? (-a << 1) + 1 : a << 1;
  do {
    var c = a & 31;
    a >>>= 5;
    0 < a && (c |= 32);
    if (0 <= c && c < tb.length) {
      c = tb[c];
    } else {
      throw new TypeError("Must be between 0 and 63: " + c);
    }
    b += c;
  } while (0 < a);
  return b;
}
;const {URL:W} = url;
function ub(a, b) {
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
  c = ub(a.source, b.source);
  if (0 !== c) {
    return c;
  }
  c = a.originalLine - b.originalLine;
  if (0 !== c) {
    return c;
  }
  c = a.originalColumn - b.originalColumn;
  return 0 !== c ? c : ub(a.name, b.name);
}
function vb(a) {
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
const wb = /^[A-Za-z0-9+\-.]+:/;
function Y(a) {
  return "/" == a[0] ? "/" == a[1] ? "scheme-relative" : "path-absolute" : wb.test(a) ? "absolute" : "path-relative";
}
function xb(a, b) {
  "string" == typeof a && (a = new W(a));
  "string" == typeof b && (b = new W(b));
  const c = b.pathname.split("/");
  a = a.pathname.split("/");
  for (0 < a.length && !a[a.length - 1] && a.pop(); 0 < c.length && 0 < a.length && c[0] === a[0];) {
    c.shift(), a.shift();
  }
  return a.map(() => "..").concat(c).join("/") + b.search + b.hash;
}
const yb = function(a) {
  return b => {
    const c = Y(b), d = vb(b);
    b = new W(b, d);
    a(b);
    b = b.toString();
    return "absolute" === c ? b : "scheme-relative" === c ? b.slice(5) : "path-absolute" === c ? b.slice(11) : xb(d, b);
  };
}(() => {
});
function zb(a, b) {
  a: {
    if (Y(a) !== Y(b)) {
      var c = null;
    } else {
      c = vb(a + b);
      a = new W(a, c);
      c = new W(b, c);
      try {
        new W("", c.toString());
      } catch (d) {
        c = null;
        break a;
      }
      c = c.protocol !== a.protocol || c.user !== a.user || c.password !== a.password || c.hostname !== a.hostname || c.port !== a.port ? null : xb(a, c);
    }
  }
  return "string" == typeof c ? c : yb(b);
}
;class Ab {
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
;class Bb {
  constructor() {
    this.a = [];
    this.b = !0;
    this.c = {generatedLine:-1, generatedColumn:0, name:null, originalColumn:null, originalLine:null, source:null};
  }
  add(a) {
    {
      var b = this.c;
      const {generatedLine:c, generatedColumn:d} = b, {generatedLine:e, generatedColumn:f} = a;
      b = e > c || e == c && f >= d || 0 >= X(b, a);
    }
    b ? this.c = a : this.b = !1;
    this.a.push(a);
  }
}
;function Cb(a, b, c) {
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
class Eb {
  constructor(a = {}) {
    const {file:b, sourceRoot:c, skipValidation:d = !1} = a;
    this.B = b;
    this.b = c;
    this.S = d;
    this.i = new Ab;
    this.c = new Ab;
    this.D = new Bb;
    this.a = null;
  }
  toJSON() {
    const a = this.i.a.slice();
    var b = this.c.a.slice();
    {
      var c = 0;
      let f = 1, g = 0, k = 0, h = 0, l = 0, m = "", n;
      let p;
      var d = this.D;
      d.b || (d.a.sort(X), d.b = !0);
      d = d.a;
      for (let q = 0, r = d.length; q < r; q++) {
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
        null != e.source && (p = this.i.indexOf(e.source), n += V(p - l), l = p, n += V(e.originalLine - 1 - k), k = e.originalLine - 1, n += V(e.originalColumn - g), g = e.originalColumn, null != e.name && (e = this.c.indexOf(e.name), n += V(e - h), h = e));
        m += n;
      }
      c = m;
    }
    b = {version:3, sources:a, names:b, mappings:c};
    this.B && (b.file = this.B);
    this.b && (b.sourceRoot = this.b);
    this.a && (b.sourcesContent = Db(this, a, this.b));
    return b;
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
}
;const Fb = ({file:a, T:b, U:c, sourceRoot:d}) => {
  const e = new Eb({file:a, sourceRoot:d});
  b.replace(Da, (f, g) => {
    if ("\n" == b[g + f.length]) {
      return "\n".repeat(f.split("\n").length - 1);
    }
    g = f.split("\n");
    f = g.length - 1;
    g = " ".repeat(g[f].length);
    return `${"\n".repeat(f)}${g}`;
  }).replace(Ea, f => " ".repeat(f.length)).split("\n").forEach((f, g) => {
    const k = g + 1;
    f.replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, (h, l) => {
      if (0 != l || !/^\s+$/.test(h)) {
        h = {line:k, column:l};
        {
          let {C:m, G:n = null, source:p = null, name:q = null} = {C:h, source:c, G:h};
          if (!m) {
            throw Error('"generated" is a required argument');
          }
          if (!e.S) {
            if (n && "number" != typeof n.line && "number" != typeof n.column) {
              throw Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
            }
            if (!(m && "line" in m && "column" in m && 0 < m.line && 0 <= m.column && !n && !p && !q || m && "line" in m && "column" in m && n && "line" in n && "column" in n && 0 < m.line && 0 <= m.column && 0 < n.line && 0 <= n.column && p)) {
              throw Error("Invalid mapping: " + JSON.stringify({C:m, source:p, G:n, name:q}));
            }
          }
          p && (p = `${p}`, e.i.has(p) || e.i.add(p));
          q && (q = `${q}`, e.c.has(q) || e.c.add(q));
          e.D.add({generatedLine:m.line, generatedColumn:m.column, originalLine:n ? n.line : null, originalColumn:n ? n.column : null, source:p, name:q});
        }
      }
    });
  });
  Cb(e, c, b);
  return e.toString();
};
let Z = null;
const Gb = () => {
  if (Z) {
    return Z;
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
  return Z = a;
};
const Hb = () => {
  const a = [...ib, ...sb], {rules:b, markers:c} = Ga(a);
  return {rules:b, markers:c};
};
class Ib {
  constructor(a, b) {
    this.listeners = {};
    this.markers = b;
    this.config = a;
  }
  on(a, b) {
    this.listeners[a] = b;
  }
  emit(a, b) {
    this.listeners[a](b);
  }
}
const Jb = a => {
  const b = Gb(), {rules:c, markers:d} = Hb(), e = new Ib(b, d);
  return c.reduce((f, g) => {
    var {re:k, replacement:h} = g;
    return f.replace(k, h.bind(e));
  }, a);
}, Kb = (a, b, c) => {
  c = void 0 === c ? !1 : c;
  const d = Jb(a);
  if (c) {
    return d;
  }
  c = ca(b);
  b = u(b);
  a = Fb({T:a, U:c, sourceRoot:b});
  a = `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(a).toString("base64")}`;
  return `${d}\n${a}`;
};
const Lb = (a, b) => Kb(a, b, /\/\/ *# *sourceMappingURL=.+\s*$/.test(a));
module.exports = a => {
  a = void 0 === a ? {} : a;
  const b = Gb(), {pragma:c = 'const { h } = require("preact");', noWarning:d = !1, matcher:e, ignoreNodeModules:f} = Object.assign({}, a, b);
  global.ALAMODE_JS && (d || console.warn("Reverting JS hook to add new one."), global.ALAMODE_JS());
  global.ALAMODE_JSX && (d || (console.warn("Reverting JSX hook to add new one, pragma:"), console.warn(c)), global.ALAMODE_JSX());
  global.ALAMODE_JS = z(Lb, {exts:[".js"], matcher:e, ignoreNodeModules:f});
  global.ALAMODE_JSX = z((g, k) => {
    g = Kb(g, k, !0);
    g = Ca(g);
    return g = `${c}${g}`;
  }, {exts:[".jsx"], matcher:e, ignoreNodeModules:f});
};

