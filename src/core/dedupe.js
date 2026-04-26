class Dedupe {
  constructor() {
    this.pending = new Map()
  }

  run(key, fn) {
    if (this.pending.has(key)) {
      return this.pending.get(key)
    }

    const p = fn().finally(() => {
      this.pending.delete(key)
    })

    this.pending.set(key, p)
    return p
  }
}

module.exports = Dedupe