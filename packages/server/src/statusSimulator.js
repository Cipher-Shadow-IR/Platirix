const Order = require("./models/Order");

let intervalId = null;

function startStatusSimulator(intervalMs = 30000) {
  if (intervalId) return;
  console.log(`Status simulator started — advancing orders every ${intervalMs}ms`);
  intervalId = setInterval(async () => {
    try {
      const advanced = await Order.advanceNextStatus();
      if (advanced) {
        console.log(`Order ${advanced.id.slice(0, 8)} advanced to "${advanced.status}"`);
      }
    } catch (err) {
      console.error("Status simulator error:", err.message);
    }
  }, intervalMs);
}

function stopStatusSimulator() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("Status simulator stopped");
  }
}

function isSimulatorRunning() {
  return intervalId !== null;
}

module.exports = { startStatusSimulator, stopStatusSimulator, isSimulatorRunning };
