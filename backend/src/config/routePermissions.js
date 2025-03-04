const routePermissions = {
    '/api/userAuth/login': {
    POST: ['public']
  },
    '/api/userAuth/profile': {
    GET: ['get_profile']
  },
  '/api/volRoute/classes': {
    GET: ['get_classes']
  },
  '/api/volRoute/students': {
    GET: ['get_students_from_class']
  },
  '/api/volRoute/replaceable-teachers/': {
    GET: ['get_teachers']
  },
  '/api/volRoute/remapTeacher/': {
    POST: ['remap_teacher']
  },
}

module.exports = routePermissions