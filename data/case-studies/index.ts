import type { CaseStudy } from './types';

import realfi from './realfi';
import pmuProfitSystem from './pmu-profit-system';
import aiTools from './ai-tools';
import ukVehicles from './uk-vehicles';
import kingfisher from './kingfisher-mortgages';
import instantAccess from './instant-access-locksmiths';
import laHacienda from './la-hacienda';
import laHaciendaRebrand from './la-hacienda-rebrand';
import allsop from './allsop-francis';
import saxseat from './saxseat';
import shackle from './shackle';
import sidechains from './sidechains';
import akti from './akti';
import estiaKitchens from './estia-kitchens';
import aiVisualProduction from './ai-visual-production';

import { externalCases } from './external';

export const cases: CaseStudy[] = [
    aiVisualProduction,
    laHaciendaRebrand,
    realfi,
    pmuProfitSystem,
    estiaKitchens,
    aiTools,
    instantAccess,
    ukVehicles,
    kingfisher,
    laHacienda,
    allsop,
    sidechains,
    saxseat,
    shackle,
    akti,
];

export { externalCases };
export type { CaseStudy, ExternalCase, CategoryId } from './types';
