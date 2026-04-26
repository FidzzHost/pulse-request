class Limiter {
  constructor(interval = 200) {
    this.interval = interval
    this.last = 0
  }

  async wait() {
    const now = Date.now()
    const diff = now - this.last

    if (diff < this.interval) {
      await new Promise(r => setTimeout(r, this.interval - diff))
    }

    this.last = Date.now()
  }
}

module.exports = Limiter