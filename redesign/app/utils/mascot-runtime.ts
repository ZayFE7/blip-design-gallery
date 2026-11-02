import type {MascotStateId} from '../types';
import {MASCOT_STATES,type MascotStateInfo} from '../data/mascotStates';
export const STATES=MASCOT_STATES;
export interface MascotOptions{state?:string;paused?:boolean;speed?:number;reducedMotion?:boolean;energy?:number;onComplete?:()=>void}
export interface MascotController{setState(state:string):void;configure(options:Partial<MascotOptions>):void;replay():void;destroy():void}
interface Pose{x:number;y:number;sx:number;sy:number;roll:number;gx:number;gy:number;gap:number;left:number;right:number;width:number;tilt:number;curve:number;aperture:number;ring:number}
const KEYS:(keyof Pose)[]=['x','y','sx','sy','roll','gx','gy','gap','left','right','width','tilt','curve','aperture','ring'];
const TAU=Math.PI*2;
const clamp=(v:number,a=0,b=1)=>Math.min(b,Math.max(a,Number.isFinite(v)?v:a));
const ease=(v:number)=>{const x=clamp(v);return x*x*(3-2*x)};
const seg=(t:number,a:number,b:number)=>ease((t-a)/(b-a));
const base=():Pose=>({x:0,y:0,sx:1,sy:1,roll:0,gx:0,gy:0,gap:.32,left:.33,right:.33,width:.18,tilt:0,curve:0,aperture:1,ring:0});
const zero=():Pose=>{const p=base();for(const k of KEYS)p[k]=0;return p};
const resolve=(id?:string)=>MASCOT_STATES.find(s=>s.id===id)??MASCOT_STATES[0];
export function sampleMascotPose(id:MascotStateId,t:number,energy=0,out:Pose=base()):Pose{
 Object.assign(out,base());const p=out,b=Math.sin(TAU*t/6.2);p.sy=1+.004*b;
 switch(id){
 case 'idle':p.gx=.018*Math.sin(TAU*t/8);break;
 case 'listening':p.sx=1.008;p.sy=1.008+.003*b;p.left=p.right=.38;p.gy=-.025;p.roll=.012;break;
 case 'curious':p.left=.4;p.right=.3;p.roll=-.075*seg(t,0,.55);p.gx=.025;p.sx=p.sy=1.012;break;
 case 'thinking':p.left=.31;p.right=.26;p.gx=-.09;p.gy=-.08;p.roll=-.025;break;
 case 'planning':{const g=seg(t,.2,.65)*(1-seg(t,2.2,2.7));p.gx=-.09*g;p.gy=-.1*g;p.left=.32;p.right=.27+.05*(1-g);break;}
 case 'searching':{const pts=[[-.14,-.04],[.13,-.03],[.01,.055]],i=Math.floor(t/1.4)%3,u=seg(t%1.4,0,.22),a=pts[i],c=pts[(i+1)%3];p.gx=a[0]+(c[0]-a[0])*u;p.gy=a[1]+(c[1]-a[1])*u;p.left=p.right=.36;break;}
 case 'reading':{const line=Math.floor(t/1.3)%2,u=(t%1.3)/1.3;p.gx=-.13+.26*ease(Math.min(1,u/.78));p.gy=.07+.055*line;p.left=p.right=.29;if(u>.82)p.aperture=1-.78*Math.sin(Math.PI*(u-.82)/.18);break;}
 case 'writing':p.gx=-.015;p.gy=.13;p.left=p.right=.29;p.width=.175;break;
 case 'editing':p.gx=.08*Math.sin(TAU*t/4.4);p.gy=.1;p.left=p.right=.27;p.sy=1;break;
 case 'running':p.gy=.06;p.left=p.right=.27;p.sy=1+.002*b;break;
 case 'deep-focus':p.left=p.right=.23;p.gy=.045;p.width=.17;p.sy=1+.0015*b;break;
 case 'verifying':p.gx=.065*Math.sin(TAU*t/4.8);p.gy=.04;p.left=.32;p.right=.29;break;
 case 'delegating':p.gx=.12*Math.sin(TAU*t/4.8)*seg(t,0,.4);p.gy=.01;p.left=p.right=.34;break;
 case 'syncing':p.ring=.4;p.gy=.02;break;
 case 'connecting':p.ring=.6;p.aperture=.94;break;
 case 'reconnecting':p.ring=.55;p.gx=.07*Math.sin(TAU*t/4.8);p.aperture=.9;break;
 case 'loading':p.ring=.6;p.left=p.right=.3;p.aperture=.94;break;
 case 'retrying':p.ring=.45;p.gx=-.05*(1-seg(t,.2,.9));p.left=p.right=.31;break;
 case 'replying':p.left=p.right=.35;p.gy=-.015;p.sx=1.004;break;
 case 'speaking':p.left=.35+.025*clamp(energy);p.right=.35+.018*clamp(energy);p.gy=-.02;p.sy=1+.003*b;break;
 case 'queued':p.gy=-.05*(1-seg(t,.5,1.4));p.left=p.right=.3;p.aperture=.92;break;
 case 'approval':p.gx=.055*seg(t,.1,.5);p.left=p.right=.36;p.sy=1;p.roll=.01;break;
 case 'permission-required':p.left=p.right=.35;p.gy=0;p.sy=1;break;
 case 'needs-input':case 'unsure':p.left=.37;p.right=.26;p.roll=-.06*seg(t,0,.5);p.gy=-.015;p.sy=1;break;
 case 'paused':p.tilt=Math.PI/2;p.left=p.right=.27;p.width=.11;p.curve=.015;p.sy=1;break;
 case 'blocked':p.gy=.055;p.left=.27;p.right=.31;p.roll=-.025;p.sy=1;break;
 case 'alert':case 'warning':{const u=seg(t,.05,.26)*(1-seg(t,.8,1.7));p.left=p.right=.34+.055*u;p.sx=p.sy=1+.012*u;p.gy=-.025*u;break;}
 case 'done':{const u=seg(t,.03,.28)*(1-seg(t,1.35,2.2));p.tilt=Math.PI/2*u;p.curve=-.17*u;p.gap=.32+.025*u;p.left=p.right=.3;p.y=-.025*Math.sin(Math.PI*clamp(t/.75));p.sx=1+.008*u;p.sy=1-.005*u;break;}
 case 'partial-success':p.left=.33;p.right=.27;p.roll=.018;p.gy=.015;p.sy=1;break;
 case 'oops':case 'error':p.y=.025*seg(t,0,.35);p.roll=-.035*seg(t,0,.4);p.gy=.075;p.left=.28;p.right=.3;p.sy=.995;break;
 case 'cancelled':{const u=1-seg(t,.2,1.5);p.aperture=1-.14*u;p.gy=.035*u;p.sy=1;break;}
 case 'offline':p.aperture=.75;p.left=p.right=.29;p.gy=.025;p.sy=.995;break;
 case 'sleeping':p.tilt=Math.PI/2;p.curve=.075;p.left=p.right=.27;p.width=.105;p.sy=1+.007*Math.sin(TAU*t/6.4);p.gy=.04;break;
 case 'waking':{const u=seg(t,.2,.95);p.tilt=Math.PI/2*(1-u);p.curve=.075*(1-u);p.width=.105+.075*u;p.left=p.right=.27+.06*u;p.sy=.99+.01*u;p.gy=.04*(1-u);break;}
 }
 if(resolve(id).kind==='loop'&&!['sleeping','paused','reading'].includes(id)){const bt=(t+id.length*.13)%5.7;if(bt>3.65&&bt<3.91){const q=(bt-3.65)/.26;p.aperture*=q<.3?1-.88*ease(q/.3):q<.45?.12:.12+.88*ease((q-.45)/.55);}}
 return p;
}
interface Instance{canvas:HTMLCanvasElement;ctx:CanvasRenderingContext2D;state:MascotStateInfo;options:MascotOptions;time:number;pose:Pose;target:Pose;velocity:Pose;visible:boolean;dirty:boolean;done:boolean;notified:boolean;width:number;height:number;dpr:number;io?:IntersectionObserver;ro?:ResizeObserver}
const instances=new Set<Instance>();let raf=0,last=0,hooked=false,frames=0;let media:MediaQueryList;
const reduced=(i:Instance)=>i.options.reducedMotion??media?.matches??false;
const moving=(i:Instance)=>i.visible&&!i.options.paused&&!reduced(i)&&(!i.done||KEYS.some(k=>Math.abs(i.velocity[k])>.001||Math.abs(i.target[k]-i.pose[k])>.0003));
function wake(){if(!raf&&!document.hidden){last=0;raf=requestAnimationFrame(tick)}}
function hook(){if(hooked)return;hooked=true;media=window.matchMedia('(prefers-reduced-motion: reduce)');media.addEventListener('change',()=>{for(const i of instances){i.dirty=true;if(reduced(i))still(i);}wake()});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0;}else{for(const i of instances)i.dirty=true;wake()}})}
function still(i:Instance){sampleMascotPose(i.state.id,i.state.still,i.options.energy??0,i.pose);Object.assign(i.target,i.pose);Object.assign(i.velocity,zero());i.dirty=true;paint(i)}
function paint(i:Instance){
 if(!i.width||!i.height)return;const{ctx:c,pose:p}=i,w=i.width,h=i.height,R=Math.min(w,h)*.285,cx=w/2,cy=h/2;c.setTransform(i.dpr,0,0,i.dpr,0,0);c.clearRect(0,0,w,h);
 if(Math.min(w,h)>65){c.save();c.fillStyle='rgba(22,25,33,.12)';c.beginPath();c.ellipse(cx,cy+R*1.17,R*.72,R*.075,0,0,TAU);c.fill();c.restore();}
 if(p.ring>.005&&Math.min(w,h)>65){c.save();c.translate(cx,cy);c.rotate(i.time*.75);c.strokeStyle=`rgba(114,120,220,${clamp(p.ring)*.23})`;c.lineWidth=Math.max(1,R*.015);c.lineCap='round';c.beginPath();c.arc(0,0,R*1.23,-1.8,.1);c.stroke();c.restore();}
 c.save();c.translate(cx+p.x*R,cy+p.y*R);c.rotate(clamp(p.roll,-.14,.14));c.scale(clamp(p.sx,.96,1.04),clamp(p.sy,.96,1.04));const ink=c.createRadialGradient(-R*.34,-R*.45,R*.04,0,0,R*1.13);ink.addColorStop(0,'#343a43');ink.addColorStop(.34,'#1d222a');ink.addColorStop(1,'#080b10');c.fillStyle=ink;c.beginPath();c.arc(0,0,R,0,TAU);c.fill();
 if(Math.min(w,h)>65){const rim=c.createLinearGradient(0,-R,0,R*.15);rim.addColorStop(0,'rgba(255,255,255,.17)');rim.addColorStop(1,'rgba(255,255,255,0)');c.strokeStyle=rim;c.lineWidth=R*.012;c.beginPath();c.arc(0,0,R*.985,Math.PI*1.1,Math.PI*1.9);c.stroke();}
 c.strokeStyle='#f8faff';c.lineCap='round';c.lineJoin='round';for(const sign of[-1,1]){const len=(sign<0?p.left:p.right)*R;c.save();c.translate((sign*p.gap+p.gx)*R,p.gy*R);c.scale(1,clamp(p.aperture,.08,1.12));c.rotate(p.tilt);c.lineWidth=p.width*R;c.beginPath();c.moveTo(0,-len/2);c.quadraticCurveTo(p.curve*R,0,0,len/2);c.stroke();c.restore();}c.restore();i.dirty=false;
}
function tick(now:number){raf=0;if(document.hidden){last=0;return;}const dt=last?Math.min(.045,(now-last)/1000):1/60;last=now;let active=false;frames++;
 for(const i of instances){if(!i.visible)continue;if(reduced(i)){if(i.dirty)still(i);continue;}if(!i.options.paused&&moving(i)){i.time+=dt*clamp(i.options.speed??1,.25,2);if(i.time>=i.state.duration){if(i.state.kind==='loop')i.time%=i.state.duration;else{i.time=i.state.duration;i.done=true;if(!i.notified&&i.state.kind==='once'){i.notified=true;i.options.onComplete?.();}}}sampleMascotPose(i.state.id,i.time,i.options.energy??0,i.target);for(const k of KEYS){const omega=k==='aperture'?55:['gx','gy','left','right','tilt','curve'].includes(k)?24:18;const delta=i.pose[k]-i.target[k],a=i.velocity[k]+omega*delta,e=Math.exp(-omega*dt);i.pose[k]=i.target[k]+(delta+a*dt)*e;i.velocity[k]=(i.velocity[k]-omega*a*dt)*e;}i.dirty=true;}if(i.dirty)paint(i);active=active||moving(i);}if(active)raf=requestAnimationFrame(tick);else last=0;
}
function resize(i:Instance){const r=i.canvas.getBoundingClientRect();i.width=r.width;i.height=r.height;i.dpr=Math.min(2,window.devicePixelRatio||1);const w=Math.max(1,Math.round(i.width*i.dpr)),h=Math.max(1,Math.round(i.height*i.dpr));if(i.canvas.width!==w||i.canvas.height!==h){i.canvas.width=w;i.canvas.height=h;}i.dirty=true;paint(i);wake()}
export function mountMascot(canvas:HTMLCanvasElement,options:MascotOptions={}):MascotController{
 hook();const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return{setState(){},configure(){},replay(){},destroy(){}};const state=resolve(options.state);const i:Instance={canvas,ctx,state,options:{...options},time:options.paused?state.still:0,pose:base(),target:base(),velocity:zero(),visible:!('IntersectionObserver'in window),dirty:true,done:false,notified:false,width:0,height:0,dpr:1};sampleMascotPose(state.id,options.paused||reduced(i)?state.still:0,options.energy??0,i.pose);Object.assign(i.target,i.pose);instances.add(i);
 const change=(id:string,force=false)=>{const next=resolve(id);if(!force&&next.id===i.state.id)return;i.state=next;i.time=i.options.paused?next.still:0;i.done=false;i.notified=false;i.dirty=true;if(reduced(i)||i.options.paused)still(i);wake();};
 if('IntersectionObserver'in window){i.io=new IntersectionObserver(es=>{i.visible=es[0].isIntersecting;i.dirty=true;if(i.visible)wake();},{rootMargin:'24px'});i.io.observe(canvas);}if('ResizeObserver'in window){i.ro=new ResizeObserver(()=>resize(i));i.ro.observe(canvas);}resize(i);wake();return{setState:id=>change(id),configure:next=>{i.options={...i.options,...next};if(next.state)change(next.state);i.dirty=true;if(reduced(i))still(i);else paint(i);wake();},replay:()=>change(i.state.id,true),destroy:()=>{i.io?.disconnect();i.ro?.disconnect();instances.delete(i);if(!instances.size){cancelAnimationFrame(raf);raf=0;last=0;}}};
}
export function getMascotRenderStats(){return{instances:instances.size,running:!!raf,frames};}
