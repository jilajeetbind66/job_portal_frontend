import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { publicHandlers } from './publicHandlers'
import { jobHandlers } from './jobHandlers'
import { partnerHandlers } from './partnerHandlers'

export const worker = setupWorker(...handlers, ...publicHandlers, ...jobHandlers, ...partnerHandlers)
