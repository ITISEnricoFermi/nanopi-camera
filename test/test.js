const Camera = require("../Camera")

let c = new Camera({
  streamUrl: "http://192.168.43.63:8080/?action=stream",
  rootdir: "./videos/"
})

c.start()
c.stop()

setTimeout(() => {
  c.start()
}, 10 * 1000)
