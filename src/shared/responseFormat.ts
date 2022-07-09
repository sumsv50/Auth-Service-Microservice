export default function responseFormat(ok: boolean, meta?: object, data?: object) {
  return {
    meta: {
      ok,
      ...meta
    },
    data
  }
}