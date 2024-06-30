import {Algorithm} from "jsonwebtoken";

export const JWT_EXPIRY_SECONDS = 5 * 60; // 5 minutes
export const REFRESH_TOKEN_EXPIRY_SECONDS = 24 * 60 * 60; // 24 hours
export const JWT_ALGORITHM: Algorithm = 'RS256';
export const SESSION_EXPIRY_SECONDS = 30 * 24 * 60 * 60;

// Password Configurations

export const HASH_ALGORITHM = 'pbkdf2_sha256';
export const ITERATIONS = 260000;
export const KEY_LENGTH = 32; // 256 bits
export const DIGEST = 'sha256';
