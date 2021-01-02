export const API_BASE_URL = 'http://localhost:8050';
export const AUTH_BASE_URL = API_BASE_URL + "/auth-service";
export const USER_API_BASE_URL = API_BASE_URL + "/user-service";
export const ACCESS_TOKEN = 'accessToken';
export const ACCESS_TOKEN_GOOGLE = 'accessTokenGoogle';

export const OAUTH2_REDIRECT_URI = 'http://localhost:3000/oauth2/redirect';

export const GOOGLE_AUTH_URL = AUTH_BASE_URL + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
