if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    this.navigator.serviceWorker
      .register("/js/serviceWorker.js")
      .then(function() {
        console.log("service worker registered")
      })
      .catch(function(err) {
        console.log("service worker not registered", err)
      })
  })
}