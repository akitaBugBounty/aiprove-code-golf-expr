// Test harness for code-golf-expr entry (evalExpr.js).
// Runs the 9 public cases from cases.json + 14 extra edge cases
// (unary minus, whitespace, decimals, nesting, left-associativity).
// Exact === comparison (same IEEE doubles the grader would compare).
const { evalExpr } = require('./evalExpr.js');

const pub = JSON.parse(require('fs').readFileSync('./cases.json', 'utf8'));
const extra = [
  ['-5+3', -2], ['2*-3', -6], [' 1 + 2 ', 3], ['0.1+0.2', 0.30000000000000004],
  ['((2+3)*4)', 20], ['5--3', 8], ['5++3', 8], ['--5', 5], ['5----3', 8],
  ['2.5*4', 10], ['1/3', 0.3333333333333333],
  ['10-2*3', 4], ['(1+2)*(3+4)', 21], ['100/10/2', 5], ['3.14159*2', 6.28318],
  ['(-3)', -3], ['0', 0], ['1e3', 1000], ['10/-2', -5],
];
let pass = 0, fail = 0;
for (const c of pub) {
  const got = evalExpr(c.in);
  const ok = got === c.out;
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  public  ${JSON.stringify(c.in)} => ${got} (want ${c.out})`);
}
for (const [inp, want] of extra) {
  const got = evalExpr(inp);
  const ok = got === want;
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  extra   ${JSON.stringify(inp)} => ${got} (want ${want})`);
}
console.log(`\n${pass}/${pass + fail} passed, ${fail} failed`);
// Known limitation (documented, not a failure): scientific notation with a
// signed exponent, e.g. "1e-3", throws because the space-insert splits "e-".
// The spec only promises integer/decimal literals, so this is out of scope.
try { evalExpr('1e-3'); console.log('NOTE: "1e-3" unexpectedly passed'); }
catch (e) { console.log('NOTE (known limitation): "1e-3" throws: ' + e.message); }
process.exit(fail ? 1 : 0);
