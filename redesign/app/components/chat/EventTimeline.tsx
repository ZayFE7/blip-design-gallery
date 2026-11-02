import React from 'react';
import {ChevronDown,Check,Clock,TriangleAlert,LoaderCircle,RotateCcw} from 'lucide-react';
import type {AgentEvent} from '../../types';
import {Button} from '../ui/Button';

/** Nothing opens itself: the answer is the conversation; this is its audit trail. */
export function EventTimeline({events,live,onRetry}:{events:AgentEvent[];live?:boolean;onRetry?:(id:string)=>void}){
  if(!events.length)return null;
  const running=events.find(e=>e.status==='running');
  const issues=events.filter(e=>e.status==='failed'||e.status==='attention').length;
  const waiting=events.some(e=>e.status==='waiting');
  const label=live&&running?running.title:issues?`${issues} step${issues===1?'':'s'} need attention`:waiting?'Waiting for a decision':`View activity · ${events.length} steps`;
  return <details className="group/activity mt-3" data-testid="activity-disclosure">
    <summary className="flex min-h-[44px] w-fit max-w-full cursor-pointer list-none items-center gap-2 rounded-lg px-1 text-[12.5px] text-ink-3 transition-colors hover:text-ink [&::-webkit-details-marker]:hidden" aria-label={live?'Current activity; expand for details':'View activity details'}>
      {live&&running?<LoaderCircle className="h-3.5 w-3.5 shrink-0 text-accent motion-safe:animate-spin"/>:issues?<TriangleAlert className="h-3.5 w-3.5 shrink-0 text-amber-ink"/>:waiting?<Clock className="h-3.5 w-3.5 shrink-0"/>:<Check className="h-3.5 w-3.5 shrink-0 text-sage-ink"/>}
      <span className="truncate" aria-live={live?'polite':undefined}>{label}</span>
      <ChevronDown className="h-3 w-3 shrink-0 transition-transform group-open/activity:rotate-180" aria-hidden/>
    </summary>
    <div className="mb-3 mt-1 rounded-2xl border border-line bg-surface p-4">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[.08em] text-ink-3">Behind the answer · simulated tool activity</p>
      <ol className="space-y-1">{events.map(e=><li key={e.id} className="border-b border-line py-3 first:pt-0 last:border-0 last:pb-0">
        <details className="group/step">
          <summary className="flex min-h-[40px] cursor-pointer list-none items-center gap-3 text-[13px] [&::-webkit-details-marker]:hidden">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${e.status==='failed'?'bg-rose':e.status==='running'?'bg-accent':e.status==='waiting'?'bg-amber':'bg-sage'}`} aria-hidden/>
            <span className="min-w-0 flex-1"><b className="block font-medium text-ink">{e.title}</b><span className="mt-1 block text-[12px] text-ink-3">{e.outcome}</span></span>
            {(e.detail||e.command||e.output)&&<ChevronDown className="h-3.5 w-3.5 shrink-0 text-ink-3 group-open/step:rotate-180" aria-hidden/>}
          </summary>
          <div className="space-y-3 pb-1 pl-[18px] pt-3">
            {e.detail&&<p className="text-[13px] leading-relaxed text-ink-2">{e.detail}</p>}
            {(e.command||e.output)&&<pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-sunken px-4 py-3 font-mono text-[11.5px] leading-relaxed text-ink-2">{e.command?`$ ${e.command}\n\n`:''}{e.output}</pre>}
            {e.status==='failed'&&e.retryable&&onRetry&&<Button size="sm" icon={<RotateCcw/>} onClick={()=>onRetry(e.id)}>Retry this demo step</Button>}
          </div>
        </details>
      </li>)}</ol>
    </div>
  </details>;
}
