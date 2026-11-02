import React,{useEffect,useMemo,useRef,useState} from 'react';
import {ArrowLeft,ArrowDown,Ellipsis,FolderOpen,Target,Trash2} from 'lucide-react';
import type {ChatScenario,Conversation,MascotStateId,Message} from '../../types';
import {useApp} from '../../contexts/AppContext';
import {PHASE_MASCOT,useRun} from '../../contexts/RunContext';
import {Mascot} from '../mascot/Mascot';
import {Button} from '../ui/Button';
import {Dialog} from '../ui/Dialog';
import {Select} from '../ui/Select';
import {MessageItem} from './MessageItem';
import {Composer} from './Composer';
import {ContextRail} from './ContextRail';
import {ChatEmptyState} from './ChatEmptyState';
import {ScenarioBanner} from './ScenarioBanner';

const DEMO_RUNNING:Message={id:'calm-running-preview',role:'agent',text:'',time:new Date().toISOString(),simulated:true,streaming:true,events:[{id:'preview-search',kind:'search',title:'Reading a few useful sources',outcome:'Simulated running state',status:'running'}]};
export function ThreadView({conversation,onBack,onDelete}:{conversation:Conversation;onBack:()=>void;onDelete:()=>void}){
 const {approvals,library,goals,navigate,chatScenario,setChatScenario,announce,reducedMotion}=useApp();
 const {run,queue,sendMessage,stopRun,removeQueued,runQueuedNow,retryEvent}=useRun();
 const [workspace,setWorkspace]=useState(false),[menu,setMenu]=useState(false),[focused,setFocused]=useState(false),[unread,setUnread]=useState(false),[prefill,setPrefill]=useState<{text:string;key:number}>();
 const inputRef=useRef<HTMLTextAreaElement>(null),scrollRef=useRef<HTMLDivElement>(null),stick=useRef(true),lastCount=useRef(conversation.messages.length);
 const live=run?.conversationId===conversation.id,preview=chatScenario==='running'&&!live;
 const pending=approvals.some(a=>a.status==='pending'&&a.conversationId===conversation.id);
 const goal=goals.find(g=>g.id===conversation.goalId);
 const messages=useMemo(()=>preview?[...conversation.messages,DEMO_RUNNING]:conversation.messages,[conversation.messages,preview]);
 const empty=chatScenario==='empty'||!conversation.messages.length;
 const state:MascotStateId=chatScenario==='offline'?'offline':chatScenario==='error'?'oops':live&&run?PHASE_MASCOT[run.phase]:preview?'running':pending||chatScenario==='approval'?'approval':focused?'listening':'idle';
 useEffect(()=>{const el=scrollRef.current;if(!el)return;if(stick.current){requestAnimationFrame(()=>{el.scrollTop=el.scrollHeight;});}else if(messages.length>lastCount.current)setUnread(true);lastCount.current=messages.length;},[messages]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{const el=e.target as HTMLElement;if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(el.tagName)&&!el.isContentEditable){e.preventDefault();inputRef.current?.focus();}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[]);
 const send=(text:string,files:Parameters<typeof sendMessage>[2])=>{if(chatScenario==='empty')setChatScenario('ready');stick.current=true;setUnread(false);sendMessage(conversation.id,text,files);};
 return <div className="flex h-full min-h-0 flex-col">
   <header className="flex shrink-0 items-center gap-2 border-b border-line/70 px-3 py-3 md:px-8">
     <Button variant="ghost" size="icon" aria-label="All conversations" title="All conversations" onClick={onBack}><ArrowLeft/></Button>
     <Mascot state={state} size={38} label={`Blip: ${state}`}/>
     <div className="min-w-0 flex-1"><h1 className="truncate text-[14px] font-medium tracking-[-.01em] md:text-[15px]">{conversation.title}</h1><p className="mt-0.5 text-[11px] text-ink-3">Your conversation with Blip</p></div>
     <Button variant="ghost" size="sm" icon={<FolderOpen/>} aria-label="Open files and run plan" onClick={()=>setWorkspace(true)}><span className="hidden sm:inline">Workspace</span></Button>
     <Button variant="ghost" size="icon" aria-label="Conversation options" title="Conversation options" onClick={()=>setMenu(true)}><Ellipsis/></Button>
   </header>
   <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto scroll-thin" onScroll={()=>{const el=scrollRef.current;if(el){stick.current=el.scrollHeight-el.scrollTop-el.clientHeight<100;if(stick.current)setUnread(false);}}}>
     {empty?<ChatEmptyState mascotState={focused?'listening':'curious'} onPick={text=>setPrefill({text,key:Date.now()})}/>:<div className="mx-auto w-full max-w-[760px] space-y-10 px-5 pb-12 pt-9 md:px-8 md:pt-12">{messages.map(m=><MessageItem key={m.id} message={m} live={(live&&run?.messageId===m.id)||m.id===DEMO_RUNNING.id} approval={approvals.find(a=>a.id===m.approvalId)} artifact={library.find(f=>f.id===m.artifactId)} onRetryEvent={id=>retryEvent(conversation.id,m.id,id)} onOpenArtifact={id=>navigate('library',id)} onOpenApproval={id=>navigate('approvals',id)}/>)}</div>}
   </div>
   <div className="shrink-0 bg-canvas px-4 pb-3 pt-1 md:px-8 md:pb-5"><div className="mx-auto w-full max-w-[710px]">
     {unread&&<div className="mb-2 flex justify-center"><Button size="sm" icon={<ArrowDown/>} onClick={()=>{stick.current=true;setUnread(false);scrollRef.current?.scrollTo({top:scrollRef.current.scrollHeight,behavior:reducedMotion?'auto':'smooth'});}}>New reply</Button></div>}
     {(chatScenario==='offline'||chatScenario==='error')&&<div className="mb-3"><ScenarioBanner scenario={chatScenario}/></div>}
     <Composer inputRef={inputRef} prefill={prefill} running={live||preview} offline={chatScenario==='offline'} queued={queue.filter(q=>q.conversationId===conversation.id)} onRemoveQueued={removeQueued} onRunQueued={runQueuedNow} onFocusChange={setFocused} onSend={send} onStop={()=>{if(live)stopRun();else setChatScenario('ready');}}/>
     {chatScenario==='error'&&<button type="button" className="mt-2 min-h-[32px] text-[12px] text-ink-3 underline underline-offset-4" onClick={()=>setPrefill({text:conversation.messages.filter(m=>m.role==='user').slice(-1)[0]?.text??'',key:Date.now()})}>Restore my last message</button>}
   </div></div>
   <Dialog open={workspace} onClose={()=>setWorkspace(false)} variant="side" title="Your workspace" description="The files and plan behind this conversation."><ContextRail conversation={conversation}/></Dialog>
   <Dialog open={menu} onClose={()=>setMenu(false)} title="Conversation options" size="sm"><div className="space-y-6">
     {goal&&<Button variant="ghost" icon={<Target/>} onClick={()=>{setMenu(false);navigate('goals',goal.id);}}>Open linked goal</Button>}
     <div><label htmlFor="chat-preview-state" className="mb-2 block text-[13px] font-medium">Preview an interaction state</label><Select id="chat-preview-state" value={chatScenario} onChange={v=>{setChatScenario(v as ChatScenario);announce(`Demo state: ${v}`);setMenu(false);}}>{['ready','running','approval','error','offline','empty'].map(s=><option key={s} value={s}>{s[0].toUpperCase()+s.slice(1)}</option>)}</Select><p className="mt-2 text-[12px] leading-relaxed text-ink-3">Studio controls, kept out of the conversation. No real service runs.</p></div>
     <div className="border-t border-line pt-3"><Button variant="ghost" className="!text-rose-ink" icon={<Trash2/>} onClick={()=>{setMenu(false);window.setTimeout(onDelete,220);}}>Delete this local conversation</Button></div>
   </div></Dialog>
 </div>;
}
