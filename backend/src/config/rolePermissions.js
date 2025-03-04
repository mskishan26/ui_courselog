const rolePermissions = {
  'V1': ['public'],
  'V2': ['public','get_profile','get_students_class','get_teachers','remap_teacher'],
  'V3': ['public','get_profile','get_classes','get_students_from_class','get_teachers','remap_teacher'],
  'M': ['public','get_profile'],
};

module.exports = rolePermissions;