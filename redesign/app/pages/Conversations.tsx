import React,{useMemo,useState} from 'react';
import {MessageSquareX} from 'lucide-react';
import {toast} from 'sonner';
import {useApp} from '../contexts/AppContext';
import {useRun} from '../contexts/RunContext';
import {ThreadList} from '../components/chat/ThreadList';
import {ThreadView} from '../components/chat/ThreadView';
import {ConfirmDialog} from '../components/ui/ConfirmDialog';
import {EmptyState} from '../components/ui/EmptyState';
import {Button} from '../components/ui/Button';
import {plural} from '../utils/format';

/** History is a destination, not a permanently competing second sidebar. */
export function Conversations(){
 const app=useApp(),{createConversation,run,stopRun}=useRun();const[pendingDelete,setPendingDelete]=useState<string[]|null>(null);
 const active=app.conversations.find(c=>c.id===app.route.id);
 const fresh=()=>{const empty=app.conversations.find(c=>!c.messages.length);app.setChatScenario('ready');app.navigate('chat',empty?.id??createConversation());};
 const impact=useMemo(()=>{if(!pendingDelete)return[];const targets=app.conversations.filter(c=>pendingDelete.includes(c.id));return[`${plural(targets.length,'conversation')} and ${plural(targets.reduce((n,c)=>n+c.messages.length,0),'message')} removed from this browser.`,...app.goals.filter(g=>g.conversationId&&pendingDelete.includes(g.conversationId)).map(g=>`Goal “${g.title}” is retained and marked as needing a replacement conversation.`),...app.automations.filter(a=>a.targetChatId&&pendingDelete.includes(a.targetChatId)).map(a=>`Routine “${a.name}” is retained and paused until its conversation is repaired.`),'Library files and existing decision receipts are retained. No real account or service is touched.'];},[pendingDelete,app.conversations,app.goals,app.automations]);
 const remove=()=>{if(!pendingDelete)return;const ids=pendingDelete;if(run&&ids.includes(run.conversationId))stopRun();app.setConversations(cs=>cs.filter(c=>!ids.includes(c.id)));app.setGoals(gs=>gs.map(g=>g.conversationId&&ids.includes(g.conversationId)?{...g,status:'needs-you',conversationId:null,blocker:'The linked conversation was removed. Create a replacement to continue.'}:g));app.setAutomations(as=>as.map(a=>a.targetChatId&&ids.includes(a.targetChatId)?{...a,enabled:false,targetChatId:null,autoPausedReason:'Its target conversation was removed.',lastError:{message:'Choose a replacement conversation before resuming.',remedy:'choose-chat'}}:a));app.navigate('chat');toast.success('Local conversation removed.');};
 return <div className="h-[calc(100dvh-56px-64px)] min-h-0 md:h-[calc(100dvh-64px)]">
   {!app.route.id?<section className="mx-auto h-full w-full max-w-[820px] px-2 py-3 md:px-6 md:py-6"><ThreadList conversations={app.conversations} onSelect={id=>{app.setChatScenario('ready');app.navigate('chat',id);}} onNew={fresh} onDelete={setPendingDelete} onTogglePin={id=>app.setConversations(cs=>cs.map(c=>c.id===id?{...c,pinned:!c.pinned}:c))}/></section>:active?<ThreadView key={active.id} conversation={active} onBack={()=>app.navigate('chat')} onDelete={()=>setPendingDelete([active.id])}/>:<div className="grid h-full place-items-center"><EmptyState icon={<MessageSquareX/>} title="This conversation is no longer here." body="Its Library files are still available. Start a new conversation or return to your history." action={<Button variant="primary" onClick={fresh}>New conversation</Button>}/></div>}
   <ConfirmDialog open={pendingDelete!==null} onClose={()=>setPendingDelete(null)} onConfirm={remove} title={pendingDelete&&pendingDelete.length>1?'Remove these local conversations?':'Remove this local conversation?'} description="This cannot be undone in the demo." impact={impact} confirmWord="DELETE" confirmLabel="Delete local conversations"/>
 </div>;
}
