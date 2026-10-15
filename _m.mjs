import { chromium } from 'playwright-core';
const b = await chromium.launch();
for (const [w,h] of [[1440,900],[1920,1080],[390,844]]) {
  const p = await b.newPage({viewport:{width:w,height:h}});
  await p.goto('http://localhost:3000/doehealthdesk',{waitUntil:'networkidle'});
  await p.evaluate(()=>document.querySelector('#genome').scrollIntoView());
  await p.waitForTimeout(3500);
  console.log(w,JSON.stringify(await p.evaluate(()=>{const s=document.querySelector('#genome');const st=s.querySelector('.doehealth-desk-genome__stack').getBoundingClientRect();const r=s.getBoundingClientRect();const nav=document.querySelector('nav').getBoundingClientRect();return {secTop:r.top,secBottom:r.bottom,stackCenter:st.top+st.height/2,vh:innerHeight,mid:(r.top+innerHeight)/2}})));
}
await b.close();
