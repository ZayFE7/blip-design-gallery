import React from 'react';
import type {MascotStateId} from '../../types';
import {Mascot} from './Mascot';
/** Canonical stills use the same v2 renderer, not a separate look-alike engine. */
export function MascotStill({state='idle',size,className='',label}:{state?:MascotStateId;size:number;className?:string;label?:string}){return <Mascot state={state} size={size} paused reducedMotion className={className} label={label} decorative={!label}/>;}
