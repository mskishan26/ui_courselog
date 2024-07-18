const routePermissions = {
    '/api/userAuth/login': {
    POST: ['public']
  },
    '/api/userAuth/profile': {
    GET: ['get_profile']
  },
}

module.exports = routePermissions