export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  REGISTER: '/register',

  STIMULATION_PICKER: '/simulation-picker',

  PUBLIC_USER_GUIDE: 'policy/user-guide',
  PUBLIC_GUEST_PROFILE: '/profile/guest',
  PUBLIC_PLACE_PROFILE: (id: number) => `/profile/place/${id}`,
  PUBLIC_EVENT_DETAIL: {
    path: (slug: string) => `/events/${slug}`,
    pattern: /^\/events\/[^/]+$/
  },

  RECRUITMENT_DETAIL: (id: number) => `/recruitment/${id}`,
  BUSKER_RECRUITMENT_DETAIL: (id: number) => `/busker/recruitment/${id}`,

  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',

  ERROR_500: '/error-page/500',
  ERROR_419: '/error-page/419',
  ERROR_403: '/error-page/403',
  FORGOT_PASSWORD: '/forgot-password',
  CHANGE_PASSWORD: '/change-password',
  RECOVERY_CONFIRM: '/recovery-confirm',
  REGISTER_CONFIRM: '/register-confirm',

  NOTIFICATION_LIST: '/notifications'
};
