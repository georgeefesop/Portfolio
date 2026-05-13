import type { CaseStudy } from './types';

import realfi from './realfi';
import aiTools from './ai-tools';
import ukVehicles from './uk-vehicles';
import kingfisher from './kingfisher-mortgages';
import instantAccess from './instant-access-locksmiths';
import laHacienda from './la-hacienda';
import allsop from './allsop-francis';
import saxseat from './saxseat';
import shackle from './shackle';
import sidechains from './sidechains';
import akti from './akti';
import estiaKitchens from './estia-kitchens';

import { externalCases } from './external';

export const cases: CaseStudy[] = [
    estiaKitchens,
    realfi,
    aiTools,
    instantAccess,
    ukVehicles,
    kingfisher,
    laHacienda,
    allsop,
    saxseat,
    shackle,
    sidechains,
    akti,
];

export { externalCases };
export type { CaseStudy, ExternalCase, CategoryId } from './types';
