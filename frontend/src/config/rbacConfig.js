export const roles = {
  TEACHER: 'teacher',
  STUDENT: 'student'
}

export const permissions = {
  VIEW_TEACHER_DASHBOARD: 'view_teacher_dashboard',
  VIEW_STUDENT_DASHBOARD: 'view_student_dashboard',
  VIEW_CREATE_QUIZ: 'view_create_quiz',
  VIEW_EDIT_QUIZ: 'view_edit_quiz',
  VIEW_PREVIEW_QUIZ: 'view_preview_quiz',
  VIEW_SETTINGS: 'view_settings'
}

export const rolePermissions = {
  [roles.TEACHER]: [permissions.VIEW_TEACHER_DASHBOARD, permissions.VIEW_CREATE_QUIZ, permissions.VIEW_EDIT_QUIZ, permissions.VIEW_PREVIEW_QUIZ, permissions.VIEW_SETTINGS],
  [roles.STUDENT]: [permissions.VIEW_STUDENT_DASHBOARD, permissions.VIEW_SETTINGS]
}