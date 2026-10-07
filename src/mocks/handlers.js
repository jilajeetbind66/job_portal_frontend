import { partnerHandlers } from './partnerHandlers';
import { jobHandlers } from './jobHandlers';

// MSW handlers. Backend endpoint ready na ho to yahan mock response likho.
export const handlers = [...partnerHandlers, ...jobHandlers];
