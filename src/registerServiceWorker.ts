if (process.env.NODE_ENV === "production") {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
}

// prevent PWA install prompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
});
