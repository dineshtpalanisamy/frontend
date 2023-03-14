// import { pushNotification } from "../src/helper/helper";
// const pushNotification = require("../src/helper/helper");
const publicVapidKey =
  "BG27DoFFT_Z1Fp3d_SFTRwvbQ8188RxoY-dn57mtjw_1cu-Rckc3pbIa6k0dIq9VrtImtxNhmb7vnxKqITLvBbM";

async function registerServiceWorker() {
  const register = await navigator.serviceWorker.register("./worker.js", {
    scope: "../",
  });

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicVapidKey,
  });
  console.log(" inside register worker");
  //   pushNotification(subscription);
  await fetch("subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

if ("serviceWorker" in navigator) {
  registerServiceWorker().catch(console.log);
}
