class Router {
  constructor(routes = []) {
    this.routes = routes;

    this.storeCurrentHash();

    window.addEventListener('hashchange', () => {
      this.storeCurrentHash();
      this.handleCurrentHash();
    });
  }

  on(hash, handler) {
    this.routes = [hash, handler];
  }

  handleRouteIfNeeded = ([regexp, handler]) => {
    const matched = this.currentHash.match(regexp);
    if (matched !== null) {
      handler(matched);
    }
  };

  storeCurrentHash() {
    this.currentHash = window.location.hash;
  }

  handleCurrentHash() {
    this.routes.forEach(this.handleRouteIfNeeded);
  }
}

export default Router;
