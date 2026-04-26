class Cache {
  constructor() {
    this.store = new Map()
  }

  set(key, value, ttl = 5000) {
    this.store.set(key, {
      value,
      expire: Date.now() + ttl
    })
  }

  get(key) {
    const data = this.store.get(key)
    if (!data) return null

    if (Date.now() > data.expire) {
      this.store.delete(key)
      return null
    }

    return data.value
  }

  has(key) {
    return this.get(key) !== null
  }
}

module.exports = Cache