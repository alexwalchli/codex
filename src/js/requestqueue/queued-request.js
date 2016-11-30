import { enqueue } from './request-queue'

export const queuedRequest = (func) => {
  return (...args) => {
    return enqueue(func, args)
  }
}
