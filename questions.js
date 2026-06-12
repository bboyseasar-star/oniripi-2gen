// questions.js ── 鬼リピ 式変形マスター
// 2元1次方程式 を y=mx+n に変形する。答えは m, n（2マス）

function gcd(a,b){ a=Math.abs(a);b=Math.abs(b); while(b){[a,b]=[b,a%b];} return a||1; }
function reduce(p,q){ if(q<0){p=-p;q=-q;} const g=gcd(p,q); return [p/g,q/g]; }
function ratLatex(p,q){ [p,q]=reduce(p,q); if(q===1) return String(p); return p<0?`-\\dfrac{${-p}}{${q}}`:`\\dfrac{${p}}{${q}}`; }
const RNG=(lo,hi)=>lo+Math.floor(Math.random()*(hi-lo+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];

// 係数つき項を「文字つき」で：coef=2,v='x' → "2x"、coef=-1 → "-x"、coef=1→"x"
function coefTerm(coef,v){
  if(coef===0) return '';
  if(coef===1) return v;
  if(coef===-1) return '-'+v;
  return coef+v;
}
// 複数項を符号付きで連結（先頭項はそのまま、以降は +/−）
function joinTerms(terms){ // terms: 文字列配列（各項は coefTerm 済み、空文字は無視）
  const t=terms.filter(s=>s!=='');
  if(!t.length) return '0';
  let s=t[0];
  for(let i=1;i<t.length;i++){
    s += t[i].startsWith('-') ? t[i] : '+'+t[i];
  }
  return s;
}
// y=mx+n の LaTeX（m,n は [p,q] か 整数）
function yEqLatex(m,n){
  const M=Array.isArray(m)?reduce(m[0],m[1]):reduce(m,1);
  const N=Array.isArray(n)?reduce(n[0],n[1]):reduce(n,1);
  let ms;
  if(M[0]===0) ms='';
  else if(M[0]===M[1]) ms='x';
  else if(M[0]===-M[1]) ms='-x';
  else ms=ratLatex(M[0],M[1])+'x';
  let ns='';
  if(N[0]>0) ns=(ms?'+':'')+ratLatex(N[0],N[1]);
  else if(N[0]<0) ns='-'+ratLatex(-N[0],N[1]);
  if(ms===''&&ns==='') ns='0';
  return `y=${ms}${ns}`;
}
const INPUTS=[ {before:'\\(y=\\)', after:'\\(x\\)'}, {before:'\\(+\\)', after:''} ];

/* ===== Lv1：by = (bm)x + (bn) → 両辺を b でわるだけ ===== */
function genLevel1(){
  const b=pick([2,3,-2]);
  const m=pick([-3,-2,2,3]);
  const n=RNG(-4,4);
  const left=coefTerm(b,'y');
  const right=joinTerms([coefTerm(b*m,'x'), (b*n)===0?'':String(b*n)]);
  return {
    level:1,
    label:'次の式を \\(y=\\) の形に変形しなさい',
    display:`\\(${left}=${right}\\)`,
    extra:'', inputs:INPUTS, answers:[m,n], answerLatex:yEqLatex(m,n),
    hints:[
      `両辺を \\(${b}\\) でわると \\(y\\) だけになるよ。`,
      `\\(y=\\dfrac{${b*m}}{${b}}x+\\dfrac{${b*n}}{${b}}\\) を計算（約分）しよう。`,
      `答えは \\(${yEqLatex(m,n)}\\)`
    ],
    solution:`両辺を \\(${b}\\) でわると \\(${yEqLatex(m,n)}\\)`
  };
}

/* ===== Lv2：Ax + By = C → 移項して b でわる（整数で割り切れる） ===== */
function genLevel2(){
  const b=pick([2,-2,3]);
  const m=pick([-3,-2,2,3]);
  const n=RNG(-4,4);
  const A=-b*m;       // 左辺 x の係数（Ax + by = C, y=mx+n より A=-bm, C=bn）
  const C=b*n;
  const display=`\\(${joinTerms([coefTerm(A,'x'),coefTerm(b,'y')])}=${C}\\)`;
  return {
    level:2,
    label:'次の式を \\(y=\\) の形に変形しなさい',
    display, extra:'', inputs:INPUTS, answers:[m,n], answerLatex:yEqLatex(m,n),
    hints:[
      `まず \\(${coefTerm(A,'x')}\\) を右辺に移項しよう（符号が変わる）。`,
      `\\(${coefTerm(b,'y')}=${joinTerms([coefTerm(-A,'x'),String(C)])}\\) になる。両辺を \\(${b}\\) でわる。`,
      `答えは \\(${yEqLatex(m,n)}\\)`
    ],
    solution:`移項して \\(${coefTerm(b,'y')}=${joinTerms([coefTerm(-A,'x'),String(C)])}\\)、両辺を \\(${b}\\) でわると \\(${yEqLatex(m,n)}\\)`
  };
}

/* ===== Lv3：分数になる / y=k（傾き0） ===== */
function genLevel3(){
  if(Math.random()<0.3){
    const b=pick([2,3]); const k=RNG(-4,4);
    return {
      level:3,
      label:'次の式を \\(y=\\) の形に変形しなさい',
      display:`\\(${coefTerm(b,'y')}=${b*k}\\)`,
      extra:'<p style="font-size:1.5vh;color:var(--muted)">※xがない＝傾き0。\\(a\\)のマスには 0 を入れよう</p>',
      inputs:INPUTS, answers:[0,k], answerLatex:yEqLatex(0,k),
      hints:[ `\\(x\\) がないね。両辺を \\(${b}\\) でわろう。`, `傾きは0、\\(y=${k}\\) だよ。`, `答えは \\(y=${k}\\)（\\(a\\)は0）` ],
      solution:`両辺を \\(${b}\\) でわって \\(y=${k}\\)（傾き0）`
    };
  }
  const B=pick([2,3,4]);
  let A; do{ A=pick([-3,-2,-1,1,2,3]); }while(A%B===0);
  const C=pick([-6,-4,-2,2,4,6]);
  const mF=reduce(-A,B), nF=reduce(C,B);
  return {
    level:3,
    label:'次の式を \\(y=\\) の形に変形しなさい',
    display:`\\(${joinTerms([coefTerm(A,'x'),coefTerm(B,'y')])}=${C}\\)`,
    extra:'<p style="font-size:1.5vh;color:var(--muted)">※分数は a/b ボタンで入力</p>',
    inputs:INPUTS, answers:[mF[0]/mF[1], nF[0]/nF[1]], answerLatex:yEqLatex(mF,nF),
    hints:[
      `\\(${coefTerm(A,'x')}\\) を右辺に移項：\\(${coefTerm(B,'y')}=${joinTerms([coefTerm(-A,'x'),String(C)])}\\)。`,
      `両辺を \\(${B}\\) でわると分数になるよ。約分も忘れずに。`,
      `答えは \\(${yEqLatex(mF,nF)}\\)`
    ],
    solution:`移項して \\(${coefTerm(B,'y')}=${joinTerms([coefTerm(-A,'x'),String(C)])}\\)、両辺を \\(${B}\\) でわって \\(${yEqLatex(mF,nF)}\\)`
  };
}

function generateSession(level,count=5){
  const gen=level===1?genLevel1:level===2?genLevel2:genLevel3;
  const out=[], seen=new Set(); let g=0;
  while(out.length<count && g<300){
    g++; const q=gen();
    const key=q.display+'|'+q.answerLatex;
    if(seen.has(key)) continue; seen.add(key); q.id=out.length; q.mode='equation'; out.push(q);
  }
  return out;
}
