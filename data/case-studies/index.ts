import type { CaseStudy } from './types';

import realfi from './realfi';
import aiTools from './ai-tools';
import stellar from './stellar';
import ukVehicles from './uk-vehicles';
import kingfisher from './kingfisher-mortgages';
import olympus from './olympus-sports';
import instantAccess from './instant-access-locksmiths';
import forecast from './forecast';
import laHacienda from './la-hacienda';
import allsop from './allsop-francis';
import saxseat from './saxseat';
import sidechains from './sidechains';

import { externalCases } from './external';

export const cases: CaseStudy[] = [
    realfi,
    aiTools,
    stellar,
    ukVehicles,
    kingfisher,
    olympus,
    instantAccess,
    forecast,
    laHacienda,
    allsop,
    saxseat,
    sidechains,
];

export { externalCases };
export type { CaseStudy, ExternalCase, CategoryId } from './types';
