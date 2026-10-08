import '@testing-library/jest-dom/vitest'
import { setupServer } from 'msw/node'
import { handlers, setMockRole } from './mocks/handlers'

// Tests me network ki jagah MSW ki fake API chalti hai
export const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  setMockRole(null)
})
afterAll(() => server.close())
