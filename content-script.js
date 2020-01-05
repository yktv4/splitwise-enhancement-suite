(async () => {
  const app = await import(chrome.extension.getURL('src/app.js'));
  app.run();
})();
