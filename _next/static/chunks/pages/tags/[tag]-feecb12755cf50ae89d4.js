(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[327],{1386:function(n,e,t){"use strict";t.d(e,{Z:function(){return c}});var s=t(5988),i=t(9008),r=t(7294),a=t(5893);function c(n){var e=n.children,t=(0,r.useState)("hello");t[0],t[1];return(0,a.jsxs)("div",{className:"jsx-2077776070 container",children:[(0,a.jsxs)(i.default,{children:[(0,a.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0",className:"jsx-2077776070"}),(0,a.jsx)("meta",{name:"format-detection",content:"telephone=no,address=no,email=no",className:"jsx-2077776070"}),(0,a.jsx)("meta",{"http-equiv":"X-UA-Compatible",content:"IE=edge",className:"jsx-2077776070"}),(0,a.jsx)("title",{className:"jsx-2077776070",children:"wass\u306e\u30e1\u30e2\u66f8\u304d"}),(0,a.jsx)("meta",{name:"description",content:"wass\u306e\u30e1\u30e2\u66f8\u304d",className:"jsx-2077776070"}),(0,a.jsx)("link",{rel:"icon",href:"data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>\ud83e\udd23</text></svg>",className:"jsx-2077776070"})]}),(0,a.jsx)("div",{className:"jsx-2077776070 inner",children:(0,a.jsx)("main",{className:"jsx-2077776070",children:e})}),(0,a.jsx)(s.default,{id:"1965618502",children:[".inner.jsx-2077776070{max-width:640px;margin:0 auto;}"]}),(0,a.jsx)(s.default,{id:"1307584393",children:['html,body{padding:0;margin:0;font-family:"Helvetica Neue",Arial,"Hiragino Kaku Gothic Pro", "Yu Gothic Medium",YuGothic,"\u30e1\u30a4\u30ea\u30aa",sans-serif;font-size:16px;line-height:2;}',"h1{font-size:200%;}","h2{font-size:150;}","*{box-sizing:border-box;}"]})]})}},5359:function(n,e,t){"use strict";t.d(e,{Z:function(){return j}});var s=t(8216),i=t(5997),r=t(2809),a=new(function(){function n(){(0,s.Z)(this,n),(0,r.Z)(this,"memos",void 0),this.memos=[]}return(0,i.Z)(n,[{key:"add",value:function(n){this.memos.push(n)}},{key:"get",value:function(n){return this.memos.find((function(e){return e.id===n}))}},{key:"getByTag",value:function(n){return this.memos.filter((function(e){return e.tags.indexOf(n)>=0}))}},{key:"tags",value:function(){return Array.from(new Set(this.memos.flatMap((function(n){return n.tags})))).sort()}}]),n}()),c=t(7294),d=t(8800),l=t(4283),o=t(5893),u=function(n){var e=n.children,t=n.lang;return(0,o.jsx)(d.Z,{language:t,style:l.RY,children:e.trim()})},x=t(1008),h=(t(4240),function(n){var e=n.children,t=n.block,s=x.Z.renderToString(e);return t?(0,o.jsx)("div",{dangerouslySetInnerHTML:{__html:s}}):(0,o.jsx)("span",{dangerouslySetInnerHTML:{__html:s}})}),f={id:"2021-10-29-next-js",title:"\u30e1\u30e2\u69cb\u7bc9\u306bnextjs\u3092\u4f7f\u3046",summary:"nextjs\u306eSSG\u3067\u9759\u7684\u30d6\u30ed\u30b0\u3092\u66f8\u304f\u3002Markdown\u3067\u306f\u306a\u304f\u3001\u751f\u306eReact\u3067",tags:["js","nextjs"],body:function(){var n=(0,c.useReducer)((function(n){return n+1}),0),e=n[0],t=n[1];return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{children:"md\u66f8\u304b\u306a\u304f\u3068\u3082\u3044\u3044\u3093\u3058\u3083\u306a\u3044\u304b\u3068\u3044\u3046\u3053\u3068\u3067\u3001\u30e1\u30e2\u66f8\u304d\u306btsx\u3092\u76f4\u306b\u66f8\u3053\u3046\u3068\u601d\u3046\u3002"}),(0,o.jsx)("p",{children:"\u30b3\u30fc\u30c9\u30cf\u30a4\u30e9\u30a4\u30c8\u3082\u3042\u308b\u3057\u3001"}),(0,o.jsx)(u,{lang:"js",children:"\nconst x = [1, 2, 3];\nx.map(a =>  a * a);\n      "}),(0,o.jsxs)("p",{children:["\u30a4\u30f3\u30bf\u30e9\u30af\u30c6\u30a3\u30d6\u306a\u3082\u306e\u3092\u304b\u3051\u308b\u3057\u3001x = ",e,"\u3002",(0,o.jsx)("button",{onClick:t,children:"x++"})]}),(0,o.jsxs)("p",{children:["KaTeX\u306e\u6570\u5f0f\u3082\u304b\u3051\u308b\u3002",(0,o.jsx)(h,{children:"x ^ 2 + y ^ 2 = z ^ 2"})]}),(0,o.jsx)(h,{block:!0,children:"\n        f(\\relax{x}) = \\int_{-\\infty}^\\infty\n        f(\\hat\\xi)\\,e^{2 \\pi i \\xi x}\n        \\,d\\xi\n      "})]})}};a.add(f);var j=a},7205:function(n,e,t){"use strict";t.r(e),t.d(e,{__N_SSG:function(){return d}});var s=t(9008),i=t(1664),r=t(1386),a=t(5359),c=t(5893);var d=!0;e.default=function(n){var e=n.tag,t=a.Z.getByTag(e);return(0,c.jsxs)(r.Z,{children:[(0,c.jsxs)(s.default,{children:[(0,c.jsx)("meta",{name:"description",content:"\u30bf\u30b0 {tag} \u30e1\u30e2\u66f8\u304d\u305f\u3061"}),(0,c.jsxs)("title",{children:["\u30bf\u30b0: ",e," - wass\u306e\u30e1\u30e2\u66f8\u304d"]})]}),(0,c.jsxs)("nav",{children:[(0,c.jsx)(i.default,{href:"/",children:(0,c.jsx)("span",{children:"\u30e1\u30e2\u66f8\u304d"})})," > \u30bf\u30b0 "," ",e]}),(0,c.jsxs)("h1",{children:["\u30bf\u30b0\u300c",e,"\u300d\u306e\u30e1\u30e2\u66f8\u304d"]}),(0,c.jsx)("div",{children:t.map((function(n){return(0,c.jsx)(i.default,{href:"/".concat(n.id),children:(0,c.jsx)("div",{children:(0,c.jsx)("h2",{children:n.title})},n.id)},n.id)}))}),(0,c.jsxs)("aside",{children:[(0,c.jsx)("h2",{children:"\u4ed6\u306e\u30bf\u30b0"}),a.Z.tags().map((function(n){return(0,c.jsx)(i.default,{href:"/tags/".concat(n),children:(0,c.jsxs)("span",{children:[n," "]})},n)}))]})]})}},4414:function(n,e,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/tags/[tag]",function(){return t(7205)}])}},function(n){n.O(0,[774,265,394,888,179],(function(){return e=4414,n(n.s=e);var e}));var e=n.O();_N_E=e}]);