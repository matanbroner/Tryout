// All URL constants are defined here.

const USER_SUBROUTER = '/user';

// API URL's
export const LOGIN_API_URL = `${USER_SUBROUTER}/login`
export const LOGOUT_API_URL = `${USER_SUBROUTER}/logout`
export const REGISTER_API_URL = `${USER_SUBROUTER}/register`

// Page URL's
export const LOGIN_PAGE_URL = 'auth?type=login'
export const REGISTER_PAGE_URL = 'auth?type=register'