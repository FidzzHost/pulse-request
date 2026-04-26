const { URL } = require("url")
const Cache = require("../core/cache")
const Dedupe = require("../core/dedupe")
const Limiter = require("../core/limiter")
const Retry = require("../core/retry")
const adapter = require("./adapter")

class Request {
  constructor(config = {}) {
    this.baseURL = config.baseURL || ""
    this.headers = config.headers || { "Content-Type": "application/json" }
    this.timeout = config.timeout || 10000

    this.cache = new Cache()
    this.dedupe = new Dedupe()
    this.limiter = new Limiter(config.rateLimit || 200)
  }

  async _request(method, url, data = null) {
    await this.limiter.wait()

    const full = new URL(url, this.baseURL)
    const cacheKey = method + full.toString()

    // cache GET
    if (method === "GET") {
      const cached = this.cache.get(cacheKey)
      if (cached) return cached
    }

    const options = {
      method,
      headers: this.headers
    }

    const run = async () => {
      let attempt = 2

      while (attempt > 0) {
        try {
          const res = await adapter(full, options, data, this.timeout)

          if (method === "GET") {
            this.cache.set(cacheKey, res)
          }

          return res
        } catch (err) {
          attempt--

          if (!Retry.shouldRetry(err) || attempt === 0) {
            throw err
          }
        }
      }
    }

    return this.dedupe.run(cacheKey, run)
  }

  get(url) {
    return this._request("GET", url)
  }

  post(url, data) {
    return this._request("POST", url, data)
  }

  put(url, data) {
    return this._request("PUT", url, data)
  }

  delete(url) {
    return this._request("DELETE", url)
  }
}

module.exports = Request