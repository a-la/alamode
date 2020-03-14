#!/usr/bin/env node
             
const _module = require('module');
const path = require('path');
const vm = require('vm');
const stream = require('stream');
const os = require('os');
const fs = require('fs');
const url = require('url');             
var aa = _module;
const ba = _module.builtinModules;
const ca = path.basename, u = path.dirname, da = path.extname, v = path.join, ea = path.parse, w = path.relative, x = path.resolve;
/*

 James Talmage <james@talmage.io> (github.com/jamestalmage)
*/
var fa = /^(?:.*[\\/])?node_modules(?:[\\/].*)?$/;
/*

 (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org
*/
const z = 1 < module.constructor.length ? module.constructor : aa;
function ha(a, b, c, d) {
  if ("string" != typeof a || !b.includes(da(a))) {
    return !1;
  }
  a = x(a);
  return d && fa.test(a) ? !1 : c && "function" == typeof c ? !!c(a) : !0;
}
function ia(a, b = {}) {
  let {exts:c = [".js"], ignoreNodeModules:d = !0, matcher:f = null} = b;
  const e = Array.isArray(c) ? c : [c];
  let g = !1;
  const h = {}, k = {}, m = z._extensions[".js"];
  e.forEach(l => {
    if ("string" != typeof l) {
      throw new TypeError(`Invalid Extension: ${l}`);
    }
    const p = z._extensions[l] || m;
    k[l] = p;
    h[l] = z._extensions[l] = function(q, n) {
      let r;
      !g && ha(n, e, f, d) && (r = q._compile, q._compile = function(t) {
        q._compile = r;
        t = a(t, n);
        if ("string" != typeof t) {
          throw Error("[Pirates] A hook returned a non-string, or nothing at all! This is a violation of intergalactic law!\n--------------------\nIf you have no idea what this means or what Pirates is, let me explain: Pirates is a module that makes is easy to implement require hooks. One of the require hooks you're using uses it. One of these require hooks didn't return anything from it's handler, so we don't know what to do. You might want to debug this.");
        }
        return q._compile(t, n);
      });
      p(q, n);
    };
  });
  return function() {
    g || (g = !0, e.forEach(l => {
      z._extensions[l] === h[l] && (z._extensions[l] = k[l]);
    }));
  };
}
;const ja = vm.Script;
const ka = (a, b) => {
  const [c, , d] = a.split("\n");
  a = parseInt(c.replace(/.+?(\d+)$/, (e, g) => g)) - 1;
  const f = d.indexOf("^");
  ({length:b} = b.split("\n").slice(0, a).join("\n"));
  return b + f + (a ? 1 : 0);
};
const la = a => {
  try {
    new ja(a);
  } catch (b) {
    const c = b.stack;
    if (!/Unexpected token '?</.test(b.message)) {
      throw b;
    }
    return ka(c, a);
  }
  return null;
};
const ma = stream.Writable;
function na(a) {
  if ("object" != typeof a) {
    return !1;
  }
  const b = a.re instanceof RegExp;
  a = -1 != ["string", "function"].indexOf(typeof a.replacement);
  return b && a;
}
;function A(a, b) {
  function c() {
    return b.filter(na).reduce((d, {re:f, replacement:e}) => {
      if (this.w) {
        return d;
      }
      if ("string" == typeof e) {
        return d = d.replace(f, e);
      }
      {
        let g;
        return d.replace(f, (h, ...k) => {
          g = Error();
          try {
            return this.w ? h : e.call(this, h, ...k);
          } catch (m) {
            {
              h = m;
              if (!(h instanceof Error)) {
                throw h;
              }
              [, , k] = g.stack.split("\n", 3);
              k = h.stack.indexOf(k);
              if (-1 == k) {
                throw h;
              }
              k = h.stack.substr(0, k - 1);
              const l = k.lastIndexOf("\n");
              h.stack = k.substr(0, l);
              throw h;
            }
          }
        });
      }
    }, `${a}`);
  }
  c.brake = () => {
    c.w = !0;
  };
  return c.call(c);
}
;const oa = a => new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`, "g"), pa = (a, b) => `%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`, B = (a, b) => Object.keys(a).reduce((c, d) => {
  {
    var f = a[d];
    const {getReplacement:e = pa, getRegex:g = oa} = b || {}, h = g(d);
    f = {name:d, re:f, regExp:h, getReplacement:e, map:{}, lastIndex:0};
  }
  return {...c, [d]:f};
}, {}), C = a => {
  var b = [];
  const c = a.map;
  return {re:a.regExp, replacement(d, f) {
    d = c[f];
    delete c[f];
    return A(d, Array.isArray(b) ? b : [b]);
  }};
}, D = a => {
  const b = a.map, c = a.getReplacement, d = a.name;
  return {re:a.re, replacement(f) {
    const e = a.lastIndex;
    b[e] = f;
    a.lastIndex += 1;
    return c(d, e);
  }};
};
const qa = os.homedir;
const ra = /\s+at.*(?:\(|\s)(.*)\)?/, sa = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ta = qa(), ua = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), f = new RegExp(sa.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(e => {
    e = e.match(ra);
    if (null === e || !e[1]) {
      return !0;
    }
    e = e[1];
    return e.includes(".app/Contents/Resources/electron.asar") || e.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(e);
  }).filter(e => e.trim()).map(e => b ? e.replace(ra, (g, h) => g.replace(h, h.replace(ta, "~"))) : e).join("\n");
};
const va = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, wa = (a, b = !1) => va(a, 2 + (b ? 1 : 0)), xa = a => {
  ({callee:{caller:a}} = a);
  return a;
};
function ya(a, b, c = !1) {
  return function(d) {
    var f = xa(arguments), {stack:e} = Error();
    const g = va(e, 2, !0), h = (e = d instanceof Error) ? d.message : d;
    f = [`Error: ${h}`, ...null !== f && a === f || c ? [b] : [g, b]].join("\n");
    f = ua(f);
    return Object.assign(e ? d : Error(), {message:h, stack:f});
  };
}
;function E(a) {
  var {stack:b} = Error();
  const c = xa(arguments);
  b = wa(b, a);
  return ya(c, b, a);
}
;const za = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class Aa extends ma {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {O:f = E(!0), proxyError:e} = a || {}, g = (h, k) => f(k);
    super(d);
    this.a = [];
    this.K = new Promise((h, k) => {
      this.on("finish", () => {
        let m;
        b ? m = Buffer.concat(this.a) : m = this.a.join("");
        h(m);
        this.a = [];
      });
      this.once("error", m => {
        if (-1 == m.stack.indexOf("\n")) {
          g`${m}`;
        } else {
          const l = ua(m.stack);
          m.stack = l;
          e && g`${m}`;
        }
        k(m);
      });
      c && za(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get b() {
    return this.K;
  }
}
const Ba = async a => {
  ({b:a} = new Aa({rs:a, O:E(!0)}));
  return await a;
};
const Ca = a => {
  [, a] = /<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a) || [];
  return a;
}, G = (a, {v:b = !1, classNames:c = [], renameMap:d = {}} = {}) => {
  let f = 0;
  const e = [];
  let g;
  A(a, [{re:/[{}]/g, replacement(q, n) {
    q = "}" == q;
    const r = !q;
    if (!f && q) {
      throw Error("A closing } is found without opening one.");
    }
    f += r ? 1 : -1;
    1 == f && r ? g = {open:n} : 0 == f && q && (g.close = n, e.push(g), g = {});
  }}]);
  if (f) {
    throw Error(`Unbalanced props (level ${f}) ${a}`);
  }
  const h = {}, k = [], m = {};
  var l = e.reduce((q, {open:n, close:r}) => {
    q = a.slice(q, n);
    const [, t, y, J, K] = /(\s*)(\S+)(\s*)=(\s*)$/.exec(q) || [];
    n = a.slice(n + 1, r);
    if (!y && !/\s*\.\.\./.test(n)) {
      throw Error("Could not detect prop name");
    }
    y ? h[y] = n : k.push(n);
    m[y] = {before:t, B:J, A:K};
    n = q || "";
    n = n.slice(0, n.length - (y || "").length - 1);
    const {u:L, i:M} = F(n);
    Object.assign(h, L);
    Object.assign(m, M);
    return r + 1;
  }, 0);
  if (e.length) {
    l = a.slice(l);
    const {u:q, i:n} = F(l);
    Object.assign(h, q);
    Object.assign(m, n);
  } else {
    const {u:q, i:n} = F(a);
    Object.assign(h, q);
    Object.assign(m, n);
  }
  let p = h;
  if (b || Array.isArray(c) && c.length || Object.keys(c).length) {
    ({...p} = h);
    const q = [];
    Object.keys(p).forEach(n => {
      const r = () => {
        q.push(n);
        delete p[n];
      };
      if (Array.isArray(c) && c.includes(n)) {
        r();
      } else {
        if (c[n]) {
          r();
        } else {
          if (b) {
            const t = n[0];
            t.toUpperCase() == t && r();
          }
        }
      }
    });
    q.length && (l = q.map(n => n in d ? d[n] : n).join(" "), p.className ? /[`"']$/.test(p.className) ? p.className = p.className.replace(/([`"'])$/, ` ${l}$1`) : p.className += `+' ${l}'` : p.h ? /[`"']$/.test(p.h) ? p.h = p.h.replace(/([`"'])$/, ` ${l}$1`) : p.h += `+' ${l}'` : p.className = `'${l}'`);
  }
  return {s:p, m:k, i:m};
}, F = a => {
  const b = [], c = {};
  a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]*?)\5/g, (d, f, e, g, h, k, m, l) => {
    c[e] = {before:f, B:g, A:h};
    b.push({l, name:e, J:`${k}${m}${k}`});
    return "%".repeat(d.length);
  }).replace(/(\s*)([^\s%]+)/g, (d, f, e, g) => {
    c[e] = {before:f};
    b.push({l:g, name:e, J:"true"});
  });
  return {u:[...b.reduce((d, {l:f, name:e, J:g}) => {
    d[f] = [e, g];
    return d;
  }, [])].filter(Boolean).reduce((d, [f, e]) => {
    d[f] = e;
    return d;
  }, {}), i:c};
}, Da = (a, b = [], c = !1, d = {}, f = "") => {
  const e = Object.keys(a);
  return e.length || b.length ? `{${e.reduce((g, h) => {
    const k = a[h], m = c || -1 != h.indexOf("-") ? `'${h}'` : h, {before:l = "", B:p = "", A:q = ""} = d[h] || {};
    return [...g, `${l}${m}${p}:${q}${k}`];
  }, b).join(",")}${f}}` : "{}";
}, Ea = (a = "") => {
  [a] = a;
  if (!a) {
    throw Error("No tag name is given");
  }
  return a.toUpperCase() == a;
}, H = (a, b = {}, c = [], d = [], f = !1, e = null, g = {}, h = "") => {
  const k = Ea(a), m = k ? a : `'${a}'`;
  if (!Object.keys(b).length && !c.length && !d.length) {
    return `h(${m})`;
  }
  const l = k && "dom" == f ? !1 : f;
  k || !d.length || f && "dom" != f || e && e(`JSX: destructuring ${d.join(" ")} is used without quoted props on HTML ${a}.`);
  a = Da(b, d, l, g, h);
  b = c.reduce((p, q, n) => {
    n = c[n - 1];
    let r = "";
    n && /^\/\*[\s\S]*\*\/$/.test(n) ? r = "" : n && /\S/.test(n) && (r = ",");
    return `${p}${r}${q}`;
  }, "");
  return `h(${m},${a}${b ? `,${b}` : ""})`;
};
const Fa = (a, b = []) => {
  let c = 0, d;
  a = A(a, [...b, {re:/[<>]/g, replacement(f, e) {
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
  return {X:a, C:d};
}, N = a => {
  const b = Ca(a);
  let c;
  const {L:d} = B({L:/=>/g});
  try {
    ({X:k, C:c} = Fa(a, [D(d)]));
  } catch (m) {
    if (1 === m) {
      throw Error(`Could not find the matching closing > for ${b}.`);
    }
  }
  const f = k.slice(0, c + 1);
  var e = f.replace(/<\s*[^\s/>]+/, "");
  if (/\/\s*>$/.test(e)) {
    return a = e.replace(/\/\s*>$/, ""), e = "", new I({g:f.replace(d.regExp, "=>"), f:a.replace(d.regExp, "=>"), content:"", tagName:b});
  }
  a = e.replace(/>$/, "");
  e = c + 1;
  c = !1;
  let g = 1, h;
  A(k, [{re:new RegExp(`[\\s\\S](?:<\\s*${b}(\\s+|>)|/\\s*${b}\\s*>)`, "g"), replacement(m, l, p, q) {
    if (c) {
      return m;
    }
    l = !l && m.endsWith(">");
    const n = !l;
    if (n) {
      q = q.slice(p);
      const {C:r} = Fa(q.replace(/^[\s\S]/, " "));
      q = q.slice(0, r + 1);
      if (/\/\s*>$/.test(q)) {
        return m;
      }
    }
    g += n ? 1 : -1;
    0 == g && l && (c = p, h = c + m.length);
    return m;
  }}]);
  if (g) {
    throw Error(`Could not find the matching closing </${b}>.`);
  }
  e = k.slice(e, c);
  var k = k.slice(0, h).replace(d.regExp, "=>");
  return new I({g:k, f:a.replace(d.regExp, "=>"), content:e.replace(d.regExp, "=>"), tagName:b});
};
class I {
  constructor(a) {
    this.g = a.g;
    this.f = a.f;
    this.content = a.content;
    this.tagName = a.tagName;
  }
}
;const O = a => {
  let b = "", c = "";
  a = a.replace(/^(\r?\n\s*)([\s\S]+)?/, (d, f, e = "") => {
    b = f;
    return e;
  }).replace(/([\s\S]+?)?(\r?\n\s*)$/, (d, f = "", e = "") => {
    c = e;
    return f;
  });
  return `${b}${a ? `\`${a}\`` : ""}${c}`;
}, Ha = a => {
  const b = [];
  let c = {}, d = 0, f = 0;
  A(a, [{re:/[<{}]/g, replacement(e, g) {
    if (!(g < f)) {
      if (/[{}]/.test(e)) {
        d += "{" == e ? 1 : -1, 1 == d && void 0 == c.from ? c.from = g : 0 == d && (c.to = g + 1, c.P = a.slice(c.from + 1, g), b.push(c), c = {});
      } else {
        if (d) {
          return e;
        }
        e = N(a.slice(g));
        f = g + e.g.length;
        c.R = e;
        c.to = f;
        c.from = g;
        b.push(c);
        c = {};
      }
    }
  }}, {}]);
  return b.length ? Ga(a, b) : [O(a)];
}, Ga = (a, b) => {
  let c = 0;
  b = b.reduce((d, {from:f, to:e, P:g, R:h}) => {
    (f = a.slice(c, f)) && d.push(O(f));
    c = e;
    g ? d.push(g) : h && d.push(h);
    return d;
  }, []);
  if (c < a.length) {
    const d = a.slice(c, a.length);
    d && b.push(O(d));
  }
  return b;
};
const Ia = (a, b = {}) => {
  var c = b.quoteProps, d = b.warn;
  const f = b.prop2class, e = b.classNames, g = b.renameMap;
  var h = la(a);
  if (null === h) {
    return a;
  }
  var k = a.slice(h);
  const {f:m = "", content:l, tagName:p, g:{length:q}} = N(k);
  k = P(l, c, d, b);
  const {s:n, m:r, i:t} = G(m.replace(/^ */, ""), {v:f, classNames:e, renameMap:g});
  d = H(p, n, k, r, c, d, t, /\s*$/.exec(m) || [""]);
  c = a.slice(0, h);
  a = a.slice(h + q);
  h = q - d.length;
  0 < h && (d = `${" ".repeat(h)}${d}`);
  a = `${c}${d}${a}`;
  return Ia(a, b);
}, P = (a, b = !1, c = null, d = {}) => a ? Ha(a).reduce((f, e) => {
  if (e instanceof I) {
    const {f:k = "", content:m, tagName:l} = e, {s:p, m:q} = G(k, {v:d.prop2class, classNames:d.classNames, renameMap:d.renameMap});
    e = P(m, b, c, d);
    e = H(l, p, e, q, b, c);
    return [...f, e];
  }
  const g = la(e);
  if (g) {
    var h = e.slice(g);
    const {g:{length:k}, f:m = "", content:l, tagName:p} = N(h), {s:q, m:n} = G(m, {v:d.prop2class, classNames:d.classNames, renameMap:d.renameMap});
    h = P(l, b, c, d);
    h = H(p, q, h, n, b, c);
    const r = e.slice(0, g);
    e = e.slice(g + k);
    return [...f, `${r}${h}${e}`];
  }
  return [...f, e];
}, []) : [];
const Ja = a => {
  const {e:b, M:c, N:d, l:f, S:e, T:g} = B({M:/^ *export\s+default\s+{[\s\S]+?}/mg, e:/^ *export\s+(?:default\s+)?/mg, N:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg, l:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm, S:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm, T:/^ *import\s+['"].+['"]/gm}, {getReplacement(h, k) {
    return `/*%%_RESTREAM_${h.toUpperCase()}_REPLACEMENT_${k}_%%*/`;
  }, getRegex(h) {
    return new RegExp(`/\\*%%_RESTREAM_${h.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`, "g");
  }});
  a = A(a, [D(d), D(c), D(b), D(f), D(e), D(g)]);
  a = Ia(a, {});
  return A(a, [C(d), C(c), C(b), C(f), C(e), C(g)]);
};
const Ka = /\/\*(?:[\s\S]+?)\*\//g, La = /\/\/(.+)/gm;
const Na = (a = []) => {
  const {comments:b, inlineComments:c, strings:d, literals:f, escapes:e, regexes:g, regexGroups:h} = B({comments:Ka, inlineComments:La, strings:/(["'])(.*?)\1/gm, literals:/`([\s\S]*?)`/gm, escapes:/\\[\\`'"/]/g, regexes:/\/(.+?)\//gm, regexGroups:/\[(.*?)\]/gm}), k = [b, c, d, f, e, g, h], [m, l, p, q, n, r, t] = k.map(D), [y, J, K, L, M, db, eb] = k.map(fb => C(fb));
  return {rules:[n, m, l, p, t, r, q, Ma, ...a, L, db, eb, K, J, y, M], markers:{literals:f, strings:d, comments:b, inlineComments:c, escapes:e, regexes:g, regexGroups:h}};
}, Ma = {re:/./, replacement(a) {
  this.stopProcessing && this.brake();
  return a;
}};
const Oa = a => `if (${a} && ${a}.__esModule) ${a} = ${a}.default`, Pa = (a, b, c, d = null) => `${a.replace(/(\s+)from(\s+)([\s\S])*/, (f, e, g) => `${e}=${g}`)}${d ? d : "r" + `equire(${b}${c}${b})`}`, Q = (a, b = {}) => {
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
}, Qa = /(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%)/, Ra = (a = {import:{}}) => {
  try {
    return "always" == a.import.esCheck;
  } catch (b) {
    return !1;
  }
}, Sa = (a, b = {import:{}}) => {
  try {
    return b.import.alamodeModules.includes(a);
  } catch (c) {
    return !1;
  }
};
async function Ta(a, b, c) {
  const d = E(!0);
  if ("function" != typeof a) {
    throw Error("Function must be passed.");
  }
  if (!a.length) {
    throw Error(`Function${a.name ? ` ${a.name}` : ""} does not accept any arguments.`);
  }
  return await new Promise((f, e) => {
    const g = (k, m) => k ? (k = d(k), e(k)) : f(c || m);
    let h = [g];
    Array.isArray(b) ? h = [...b, g] : 1 < Array.from(arguments).length && (h = [b, g]);
    a(...h);
  });
}
;const Ua = fs.createReadStream, Va = fs.lstat;
const R = async a => {
  try {
    return await Ta(Va, a);
  } catch (b) {
    return null;
  }
};
async function Wa(a) {
  a = Ua(a);
  return await Ba(a);
}
;const Xa = async a => {
  var b = await R(a);
  let c = a, d = !1;
  if (!b) {
    if (c = await S(a), !c) {
      throw Error(`${a}.js or ${a}.jsx is not found.`);
    }
  } else {
    if (b.isDirectory()) {
      b = !1;
      let f;
      a.endsWith("/") || (f = c = await S(a), b = !0);
      if (!f) {
        c = await S(v(a, "index"));
        if (!c) {
          throw Error(`${b ? `${a}.jsx? does not exist, and ` : ""}index.jsx? file is not found in ${a}`);
        }
        d = !0;
      }
    }
  }
  return {path:a.startsWith(".") ? w("", c) : c, Y:d};
}, S = async a => {
  a = `${a}.js`;
  let b = await R(a);
  b || (a = `${a}x`);
  if (b = await R(a)) {
    return a;
  }
};
let T;
const Za = async(a, b, c = {}) => {
  T || ({root:T} = ea(process.cwd()));
  const {fields:d, soft:f = !1} = c;
  var e = v(a, "node_modules", b);
  e = v(e, "package.json");
  const g = await R(e);
  if (g) {
    a = await Ya(e, d);
    if (void 0 === a) {
      throw Error(`The package ${w("", e)} does export the module.`);
    }
    if (!a.entryExists && !f) {
      throw Error(`The exported module ${a.main} in package ${b} does not exist.`);
    }
    const {entry:h, version:k, packageName:m, main:l, entryExists:p, ...q} = a;
    return {entry:w("", h), packageJson:w("", e), ...k ? {version:k} : {}, packageName:m, ...l ? {hasMain:!0} : {}, ...p ? {} : {entryExists:!1}, ...q};
  }
  if (a == T && !g) {
    throw Error(`Package.json for module ${b} not found.`);
  }
  return Za(v(x(a), ".."), b, c);
}, Ya = async(a, b = []) => {
  const c = await Wa(a);
  let d, f, e, g, h;
  try {
    ({module:d, version:f, name:e, main:g, ...h} = JSON.parse(c)), h = b.reduce((m, l) => {
      m[l] = h[l];
      return m;
    }, {});
  } catch (m) {
    throw Error(`Could not parse ${a}.`);
  }
  a = u(a);
  b = d || g;
  if (!b) {
    if (!await R(v(a, "index.js"))) {
      return;
    }
    b = g = "index.js";
  }
  a = v(a, b);
  let k;
  try {
    ({path:k} = await Xa(a)), a = k;
  } catch (m) {
  }
  return {entry:a, version:f, packageName:e, main:!d && g, entryExists:!!k, ...h};
};
const $a = a => a.replace(/(\s+)as(\s+)/g, (b, c, d) => `${1 == c.split("\n").length ? "" : c}:${d}`), ab = (a, b, c = {}) => {
  if (!c.import) {
    return null;
  }
  ({import:{stdlib:c}} = c);
  if (c) {
    const d = c.path;
    return c.packages.includes(b) ? w(u(a), d).replace(/\\/g, "/").replace(/.js$/, "") : null;
  }
  return null;
}, gb = (a, b, c, d, f, e, g) => {
  const {t:h, o:k} = bb(c, d, f, e, g);
  a = cb(a, b, f, e, d);
  return `${[h, a, ...g ? [] : [k]].filter(m => m).join("; ")};`;
}, hb = (a, b) => {
  if (Ra(b)) {
    return !1;
  }
  if (/^[./]/.test(a) || ba.includes(a) || Sa(a, b)) {
    return !0;
  }
}, ib = async(a, b, c, d) => {
  if (hb(a, b)) {
    return !0;
  }
  if (a in d) {
    return d[a];
  }
  if (c) {
    try {
      const {alamode:f} = await Za(u(c), a, {fields:["alamode"]});
      d[a] = !!f;
      return f;
    } catch (f) {
      return !1;
    }
  }
}, bb = (a, b, c, d, f) => {
  if (!a) {
    return {};
  }
  b = b ? {d:`${b} = ${"r" + `equire(${c}${d}${c})`}`, o:Oa(b)} : void 0;
  const {d:e, o:g} = b;
  a = a.replace(",", "").replace(/([^\s]+)/, e);
  return {t:`${f ? "const" : "let"}${a}`, o:g};
}, cb = (a, b, c, d, f) => {
  if (!a) {
    return null;
  }
  b = Pa(b, c, d, f);
  return `const${$a(a)}${b}`;
};
const jb = [{re:new RegExp(`${/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?/.source}${Qa.source}`, "gm"), replacement:function(a, b, c, d, f, e) {
  const [, g, h] = /(["'`])(.+?)\1/.exec(this.markers.strings.map[e]);
  if (this.renameOnly) {
    return e = Q(h, this.config), a.replace(/%%_RESTREAM_STRINGS_REPLACEMENT_\d+_%%/, `${g}${e}${g}`);
  }
  const k = (a = ab(this.file, h, this.config)) || Q(h, this.config);
  a && (d ? b && (d = d.replace(/{/, `{ ${c},`), d = b.replace(/\S/g, " ") + d, c = b = void 0) : (d = b.replace(/(\S+)/, "{ $1 }"), c = b = void 0));
  this.H || (this.H = {});
  if (this.async) {
    return ib(k, this.config, this.file, this.H).then(m => gb(d, f, b, c, g, k, m));
  }
  a = hb(k, this.config);
  return gb(d, f, b, c, g, k, a);
}}, {re:new RegExp(`${/(import\s+)/.source}${/(%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%)/.source}`, "gm"), replacement:function(a, b, c, d) {
  const [, f, e] = /(["'`])(.+?)\1/.exec(this.markers.strings.map[d]);
  c = Q(e, this.config);
  return this.renameOnly ? (b = Q(e, this.config), a.replace(/%%_RESTREAM_STRINGS_REPLACEMENT_\d+_%%/, `${f}${b}${f}`)) : b.replace(/ /g, "").replace("import", "require(") + `${f}${c}${f});`;
}}, {re:new RegExp(`${/( *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+(.+?))/.source}${Qa.source}`, "gm"), replacement:function(a, b, c, d, f, e) {
  const [, g, h] = /(["'`])(.+?)\1/.exec(this.markers.strings.map[e]);
  e = Q(h, this.config);
  if (this.renameOnly) {
    return a.replace(/%%_RESTREAM_STRINGS_REPLACEMENT_\d+_%%/, `${g}${e}${g}`);
  }
  a = Pa(f, g, e);
  ({length:b} = b.split("\n"));
  b = "\n".repeat(b - 1);
  e = /^[./]/.test(e) && !Ra(this.config);
  return `${c ? [`${b}${e ? "const" : "let"} ${d} = ${c}${a}`, ...e ? [] : [Oa(c)]].join("; ") : `${b}const ${d}${a}`};`;
}}];
const kb = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|await|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/, lb = /(?:[$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D])(?:[$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*/;
const mb = a => a.split(/,\s*/).filter(b => b), nb = a => a.reduce((b, c) => {
  const [d, f = d] = c.split(/\s+as\s+/);
  return {...b, [f.trim()]:d.trim()};
}, {}), ob = a => {
  a.replace(kb, () => {
    throw Error(`Detected reserved identifier "${a}".`);
  });
}, pb = a => {
  ({length:a} = a.split("\n"));
  return "\n".repeat(a - 1);
}, U = (a, b = !0) => b ? pb(a) : a.split("\n").map(({length:c}, d, {length:f}) => d == f - 1 ? " ".repeat(c) : "").join("\n");
const qb = (a, b, c) => `${a.replace(/(\s+)from(\s+)([\s\S])*/, (d, f, e) => `${f}=${e}`)}${"r" + `equire(${b}${c}${b});`}`;
function rb(a, b, c, d, f) {
  a = this.noSourceMaps ? "" : U(a);
  const e = `$${b.replace(/[-/]/g, "_").replace(/[^\w\d-]/g, "")}`;
  b = qb(c, d, b);
  b = `${a}const ${e}${b}`;
  f = mb(f).reduce((g, h) => {
    const [k, m] = h.split(/\s+as\s+/);
    h = k.trim();
    g[(m ? m.trim() : null) || h] = "default" == h ? e : `${e}.${h}`;
    return g;
  }, {});
  this.emit("export", f);
  return b;
}
;const sb = (a = {}) => {
  const {"default":b, ...c} = a, d = b ? `module.exports = ${b}` : "", f = Object.keys(c).map(e => `module.exports.${e} = ${a[e]}`);
  return [d, ...f].filter(e => e).join("\n");
};
const tb = [{re:/[\s\S]*/, replacement(a) {
  this.exports = {};
  this.on("export", b => {
    this.exports = {...this.exports, ...b};
  });
  return a;
}}, {re:new RegExp(`^( *export\\s+?)( *${/(?:let|const|var|class|function\s*\*?|async +function)/.source}\\s+((?:${lb.source}\\s*,?\\s*)+))`, "gm"), replacement:function(a, b, c, d) {
  d.split(/,\s*/).forEach(f => {
    f = f.trim().replace(/\s+extends\s+.+/, "");
    ob(f);
    this.emit("export", {[f]:f});
  });
  return this.noSourceMaps ? c : `${U(b, !1)}${c}`;
}}, {re:new RegExp(`${/^( *export\s+{([^}]+?)})/.source}${/(\s+from\s+)(?:%%_RESTREAM_STRINGS_REPLACEMENT_(\d+)_%%|%%_RESTREAM_LITERALS_REPLACEMENT_(\d+)_%%)/.source}`, "gm"), replacement:function(a, b, c, d, f, e) {
  const [, g, h] = /(["'`])(.+?)\1/.exec(e ? this.markers.literals.map[e] : this.markers.strings.map[f]);
  return rb.call(this, b, h, d, g, c);
}}, {re:/^( *export\s+{([^}]+?)} *)(\n?)/gm, replacement:function(a, b, c, d) {
  a = mb(c);
  a = nb(a);
  this.emit("export", a);
  return this.noSourceMaps ? "" : `${U(b)}${d ? d : ""}`;
}}, {re:new RegExp(`^( *export\\s+default\\s+?)( *${/(?:class|function\s*\*?|async +function)/.source}\\s+(${lb.source}))`, "m"), replacement:function(a, b, c, d) {
  a = d.trim();
  ob(a);
  this.emit("export", {"default":a});
  return this.noSourceMaps ? c : `${U(b, !1)}${c}`;
}}, {re:/^( *)(export\s+)(default\s+)/m, replacement:function(a, b, c, d) {
  a = c.replace(/export ?/, "module.");
  d = d.replace(/default ?/, "exports=");
  return `${b}${a}${d}`;
}}, {re:/[\s\S]*/, replacement(a) {
  const b = sb(this.exports);
  return `${a}${b ? `\n\n${b}` : ""}`;
}}];
const ub = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function V(a) {
  var b = "";
  a = 0 > a ? (-a << 1) + 1 : a << 1;
  do {
    var c = a & 31;
    a >>>= 5;
    0 < a && (c |= 32);
    if (0 <= c && c < ub.length) {
      c = ub[c];
    } else {
      throw new TypeError("Must be between 0 and 63: " + c);
    }
    b += c;
  } while (0 < a);
  return b;
}
;const W = url.URL;
function vb(a, b) {
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
  c = vb(a.source, b.source);
  if (0 !== c) {
    return c;
  }
  c = a.originalLine - b.originalLine;
  if (0 !== c) {
    return c;
  }
  c = a.originalColumn - b.originalColumn;
  return 0 !== c ? c : vb(a.name, b.name);
}
function wb(a) {
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
const xb = /^[A-Za-z0-9+\-.]+:/;
function Y(a) {
  return "/" == a[0] ? "/" == a[1] ? "scheme-relative" : "path-absolute" : xb.test(a) ? "absolute" : "path-relative";
}
function yb(a, b) {
  "string" == typeof a && (a = new W(a));
  "string" == typeof b && (b = new W(b));
  const c = b.pathname.split("/");
  a = a.pathname.split("/");
  for (0 < a.length && !a[a.length - 1] && a.pop(); 0 < c.length && 0 < a.length && c[0] === a[0];) {
    c.shift(), a.shift();
  }
  return a.map(() => "..").concat(c).join("/") + b.search + b.hash;
}
const zb = function(a) {
  return b => {
    const c = Y(b), d = wb(b);
    b = new W(b, d);
    a(b);
    b = b.toString();
    return "absolute" === c ? b : "scheme-relative" === c ? b.slice(5) : "path-absolute" === c ? b.slice(11) : yb(d, b);
  };
}(() => {
});
function Ab(a, b) {
  a: {
    if (Y(a) !== Y(b)) {
      var c = null;
    } else {
      c = wb(a + b);
      a = new W(a, c);
      c = new W(b, c);
      try {
        new W("", c.toString());
      } catch (d) {
        c = null;
        break a;
      }
      c = c.protocol !== a.protocol || c.user !== a.user || c.password !== a.password || c.hostname !== a.hostname || c.port !== a.port ? null : yb(a, c);
    }
  }
  return "string" == typeof c ? c : zb(b);
}
;class Bb {
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
;class Cb {
  constructor() {
    this.a = [];
    this.b = !0;
    this.c = {generatedLine:-1, generatedColumn:0, name:null, originalColumn:null, originalLine:null, source:null};
  }
  add(a) {
    {
      var b = this.c;
      const c = b.generatedLine, d = b.generatedColumn, f = a.generatedLine, e = a.generatedColumn;
      b = f > c || f == c && e >= d || 0 >= X(b, a);
    }
    b ? this.c = a : this.b = !1;
    this.a.push(a);
  }
}
;/*
 Copyright 2011 Mozilla Foundation and contributors
 Licensed under the New BSD license. See LICENSE or:
 http://opensource.org/licenses/BSD-3-Clause
*/
function Db(a, b, c) {
  null != a.b && (b = Ab(a.b, b));
  c ? (a.a || (a.a = Object.create(null)), a.a[b] = c) : a.a && (delete a.a[b], 0 === Object.keys(a.a).length && (a.a = null));
}
function Eb(a, b, c) {
  return b.map(function(d) {
    if (!this.a) {
      return null;
    }
    c && (d = Ab(c, d));
    return Object.prototype.hasOwnProperty.call(this.a, d) ? this.a[d] : null;
  }, a);
}
class Fb {
  constructor(a = {}) {
    const {file:b, sourceRoot:c, skipValidation:d = !1} = a;
    this.D = b;
    this.b = c;
    this.U = d;
    this.j = new Bb;
    this.c = new Bb;
    this.G = new Cb;
    this.a = null;
  }
  toJSON() {
    const a = this.j.a.slice();
    var b = this.c.a.slice();
    {
      var c = 0;
      let e = 1, g = 0, h = 0, k = 0, m = 0, l = "", p;
      let q;
      var d = this.G;
      d.b || (d.a.sort(X), d.b = !0);
      d = d.a;
      for (let n = 0, r = d.length; n < r; n++) {
        var f = d[n];
        p = "";
        if (f.generatedLine !== e) {
          for (c = 0; f.generatedLine !== e;) {
            p += ";", e++;
          }
        } else {
          if (0 < n) {
            if (!X(f, d[n - 1])) {
              continue;
            }
            p += ",";
          }
        }
        p += V(f.generatedColumn - c);
        c = f.generatedColumn;
        null != f.source && (q = this.j.indexOf(f.source), p += V(q - m), m = q, p += V(f.originalLine - 1 - h), h = f.originalLine - 1, p += V(f.originalColumn - g), g = f.originalColumn, null != f.name && (f = this.c.indexOf(f.name), p += V(f - k), k = f));
        l += p;
      }
      c = l;
    }
    b = {version:3, sources:a, names:b, mappings:c};
    this.D && (b.file = this.D);
    this.b && (b.sourceRoot = this.b);
    this.a && (b.sourcesContent = Eb(this, a, this.b));
    return b;
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
}
;const Gb = ({file:a, V:b, W:c, sourceRoot:d}) => {
  const f = new Fb({file:a, sourceRoot:d});
  b.replace(Ka, (e, g) => {
    if ("\n" == b[g + e.length]) {
      return "\n".repeat(e.split("\n").length - 1);
    }
    g = e.split("\n");
    e = g.length - 1;
    g = " ".repeat(g[e].length);
    return `${"\n".repeat(e)}${g}`;
  }).replace(La, e => " ".repeat(e.length)).split("\n").forEach((e, g) => {
    const h = g + 1;
    e.replace(/(?:(?:\s+)|(?:[$_\w\d]+)|.)/g, (k, m) => {
      if (0 != m || !/^\s+$/.test(k)) {
        k = {line:h, column:m};
        {
          let {F:l, I:p = null, source:q = null, name:n = null} = {F:k, source:c, I:k};
          if (!l) {
            throw Error('"generated" is a required argument');
          }
          if (!f.U) {
            if (p && "number" != typeof p.line && "number" != typeof p.column) {
              throw Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
            }
            if (!(l && "line" in l && "column" in l && 0 < l.line && 0 <= l.column && !p && !q && !n || l && "line" in l && "column" in l && p && "line" in p && "column" in p && 0 < l.line && 0 <= l.column && 0 < p.line && 0 <= p.column && q)) {
              throw Error("Invalid mapping: " + JSON.stringify({F:l, source:q, I:p, name:n}));
            }
          }
          q && (q = `${q}`, f.j.has(q) || f.j.add(q));
          n && (n = `${n}`, f.c.has(n) || f.c.add(n));
          f.G.add({generatedLine:l.line, generatedColumn:l.column, originalLine:p ? p.line : null, originalColumn:p ? p.column : null, source:q, name:n});
        }
      }
    });
  });
  Db(f, c, b);
  return f.toString();
};
let Z = null;
const Hb = () => {
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
const Ib = () => {
  const a = [...jb, ...tb], {rules:b, markers:c} = Na(a);
  return {rules:b, markers:c};
};
class Jb {
  constructor(a, b, c) {
    this.listeners = {};
    this.markers = b;
    this.config = a;
    this.file = c;
  }
  on(a, b) {
    this.listeners[a] = b;
  }
  emit(a, b) {
    this.listeners[a](b);
  }
}
const Kb = (a, b) => {
  const c = Hb(), {rules:d, markers:f} = Ib(), e = new Jb(c, f, b);
  return d.reduce((g, {re:h, replacement:k}) => g.replace(h, k.bind(e)), a);
}, Lb = (a, b, c = !1) => {
  const d = Kb(a, b);
  if (c) {
    return d;
  }
  c = ca(b);
  b = u(b);
  a = Gb({V:a, W:c, sourceRoot:b});
  a = `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(a).toString("base64")}`;
  return `${d}\n${a}`;
};
const Mb = (a, b) => Lb(a, b, /\/\/ *# *sourceMappingURL=.+\s*$/.test(a));
/*
 ?LaMode: transpiler of import/export statements and JSX components.

 Copyright (C) 2020  Art Deco

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
module.exports = (a = {}) => {
  const b = Hb(), {pragma:c = 'const { h } = require("preact");', noWarning:d = !1, matcher:f, ignoreNodeModules:e} = {...a, ...b};
  global.ALAMODE_JS && (d || console.warn("Reverting JS hook to add new one."), global.ALAMODE_JS());
  global.ALAMODE_JSX && (d || (console.warn("Reverting JSX hook to add new one, pragma:"), console.warn(c)), global.ALAMODE_JSX());
  global.ALAMODE_JS = ia(Mb, {exts:[".js"], matcher:f, ignoreNodeModules:e});
  global.ALAMODE_JSX = ia((g, h) => {
    g = Lb(g, h, !0);
    g = Ja(g);
    return g = `${c}${g}`;
  }, {exts:[".jsx"], matcher:f, ignoreNodeModules:e});
};


//# sourceMappingURL=alamode.js.map