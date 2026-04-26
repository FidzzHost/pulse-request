const https = require("https")
const http = require("http")

function adapter(url, options, data, timeout) {
  const lib = url.protocol === "https:" ? https : http

  return new Promise((resolve, reject) => {
    const req = lib.request(url, options, (res) => {
      let body = ""

      res.on("data", chunk => body += chunk)

      res.on("end", () => {
        let parsed = body
        try { parsed = JSON.parse(body) } catch {}

        resolve({
          status: res.statusCode,
          data: parsed,
          headers: res.headers
        })
      })
    })

    req.on("error", reject)

    req.setTimeout(timeout, () => {
      req.destroy(new Error("timeout"))
    })

    if (data) req.write(JSON.stringify(data))
    req.end()
  })
}

module.exports = adapter