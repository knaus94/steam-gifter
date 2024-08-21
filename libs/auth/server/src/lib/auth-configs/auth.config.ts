export const AUTH_CONFIG = 'AUTH_CONFIG';

export interface AuthConfig {
	jwtSecret: string;
	jwtExpireMs: number;
}
