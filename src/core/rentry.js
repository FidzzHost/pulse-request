class Retry {
  static shouldRetry(err, res) {
    if (!res) return true
    if (res.status >= 500) return true
    return false
  }
}

module.exports = Retry