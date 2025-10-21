export const SITE_LOGO = 'https://i.ibb.co.com/q3650ZMK/Logo.png';

export const BASE_URL =
  process.env.NEXTAUTH_URL ||
  (typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000');

export const apiEndpoint = 'https://uat-api3.azurewebsites.net';
