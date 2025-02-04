'use strict'
const _tracer = require('../../../../dd-trace')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const sampleResponse = {
  statusCode: 200,
  body: JSON.stringify(
    {
      message: 'hello!'
    },
    null,
    2
  )
}

const handler = async (_event, _context) => {
  const response = sampleResponse

  return response
}

const timeoutHandler = async (...args) => {
  await _tracer.trace('self.sleepy', () => {
    return sleep(50)
  })
  const response = sampleResponse

  return response
}

const finishSpansEarlyTimeoutHandler = async (...args) => {
  const response = sampleResponse

  // mimick closing spans early
  const currentSpan = _tracer.scope().active()
  currentSpan.finish()

  // timeout
  await sleep(50)

  return response
}

const swappedArgsHandler = async (event, _, context) => {
  const response = sampleResponse

  return response
}

module.exports = {
  finishSpansEarlyTimeoutHandler,
  handler,
  swappedArgsHandler,
  timeoutHandler
}
