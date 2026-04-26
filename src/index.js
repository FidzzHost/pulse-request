const Request = require("./http/request")

module.exports = function PulseReq(config) {
  return new Request(config)
}