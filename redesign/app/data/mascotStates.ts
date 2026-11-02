import type {MascotStateId} from '../types';
export interface MascotStateInfo{id:MascotStateId;label:string;group:'Rest'|'Attention'|'Work'|'Waiting'|'Outcome'|'Recovery';note:string;kind:'loop'|'once'|'hold';duration:number;still:number}
const s=(id:MascotStateId,label:string,group:MascotStateInfo['group'],note:string,kind:MascotStateInfo['kind']='loop',duration=5.6,still=.8):MascotStateInfo=>({id,label,group,note,kind,duration,still});
export const MASCOT_STATES:MascotStateInfo[]=[
 s('idle','Ready','Rest','Available without asking for attention: a barely-there breath and a soft blink.'),
 s('sleeping','Resting','Rest','Closed eye curves and a slow breath. Rest is not an error.','loop',6.4,1.4),
 s('waking','Waking','Rest','Eyes peek, open together, and settle. No snap back to sleep.','once',1.9,1.2),
 s('listening','Listening','Attention','Taller eyes and a small forward lean give your input room. No fake microphone activity.'),
 s('curious','Curious','Attention','One taller eye and a small questioning tilt, then a quiet hold.','hold',2,.9),
 s('thinking','Thinking','Work','A considered upward glance, not orbiting pupils.'),
 s('planning','Planning','Work','A pause upward, then a centered look as an approach takes shape.','loop',4.8,1.3),
 s('searching','Searching','Work','Three deliberate gaze destinations with long holds, not frantic darts.','loop',4.2,1),
 s('reading','Reading','Work','Two bounded line scans; the reset is softened by a blink.','loop',2.6,.7),
 s('writing','Writing','Work','A downward, settled gaze. No bouncing as though the face were a keyboard.'),
 s('editing','Editing','Work','A short scan narrows into careful focus, then relaxes.','loop',4.4,1.6),
 s('running','Using tools','Work','Grounded concentration while a tool is in progress; no fake heartbeat.'),
 s('verifying','Verifying','Work','Measured inspection glances followed by a centered hold.','loop',4.8,1.6),
 s('deep-focus','Deep focus','Work','Narrower eyes and almost no body movement.','loop',7,1.4),
 s('delegating','Delegating','Work','A controlled hand-off glance and a return to center. The character never splits.','loop',4.8,1.2),
 s('syncing','Syncing','Work','A calm face and a faint progress arc indicate state being synchronized.','loop',4.6,1),
 s('connecting','Connecting','Recovery','The face stays visible during a connection attempt; no false success.','loop',4.8,1),
 s('reconnecting','Reconnecting','Recovery','A measured glance returns to center while a restrained arc advances.','loop',4.8,1.2),
 s('loading','Loading','Work','A quiet progress arc, never an abrupt replacement of the face.','loop',4.8,1),
 s('replying','Replying','Work','Open and engaged, without invented speech pulses.'),
 s('speaking','Reading aloud','Work','A settled gaze. Optional real audio energy may affect the eyes; no fabricated waveform.'),
 s('queued','Queued','Waiting','A small upward glance settles. Queued does not mean executing.','hold',1.7,.9),
 s('approval','Needs approval','Waiting','An attentive look toward you, then a patient hold. No repeated hops.','hold',1.8,1),
 s('permission-required','Needs access','Waiting','A direct, open-eyed look waits for an access decision.','hold',1.7,.9),
 s('needs-input','Needs your input','Waiting','A slight asymmetry asks a useful question without alarm.','hold',1.9,1),
 s('unsure','Not sure yet','Attention','A small questioning tilt makes uncertainty visible.','hold',1.9,1),
 s('paused','Paused','Waiting','Relaxed horizontal eyes and a level body. Intentional pause, not failure.','hold',1.7,1),
 s('blocked','Blocked','Waiting','A thoughtful lowered gaze; the app explains the concrete dependency.','hold',1.8,1),
 s('alert','Something changed','Attention','Eyes widen once, gently, then settle.','once',2,.55),
 s('warning','Needs attention','Attention','A restrained widening, then a steady expression. No panic loop.','hold',1.9,.6),
 s('done','Complete','Outcome','Happy eye arcs and one tiny relief nod, then a natural settle.','once',2.4,.85),
 s('partial-success','Partly complete','Outcome','A small acknowledgement with thoughtful asymmetry, not an all-clear celebration.','hold',2,1),
 s('oops','A step failed','Recovery','A small concerned lean, then a stable look. No repeated shaking.','hold',2,.9),
 s('error','Run needs help','Recovery','Attentive and slightly lowered. The UI carries the explanation.','hold',2,.9),
 s('retrying','Retrying','Recovery','The eyes recenter and the quiet progress arc returns.','loop',4.8,1),
 s('cancelled','Cancelled','Outcome','Tension releases to neutral. Cancellation is neither failure nor celebration.','once',1.9,1),
 s('offline','Offline','Recovery','Softened eyes and stillness. This does not imply the backend stopped.','hold',1.8,1)
];
export const MOTION_SEQUENCE:MascotStateId[]=['idle','listening','planning','searching','reading','writing','verifying','approval','done','idle'];
export const RECOVERY_SEQUENCE:MascotStateId[]=['running','error','retrying','reconnecting','verifying','done','idle'];
export function mascotLabel(id:MascotStateId){return MASCOT_STATES.find(s=>s.id===id)?.label??id;}
