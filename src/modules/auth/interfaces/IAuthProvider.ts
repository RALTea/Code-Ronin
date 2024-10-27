export interface TokenResponseBody {
	access_token: string;
	token_type?: string;
	expires_in?: number;
	refresh_token?: string;
	scope?: string;
}

export type IAuthProvider = {
	validateAuthorizationCode: (
		authorizationCode: string,
		options?: {
			codeVerifier?: string;
			credentials?: string;
			authenticateWith?: 'http_basic_auth' | 'request_body';
		}
	) => Promise<TokenResponseBody>;

	createAuthorizationURL: (options?: {
		state?: string;
		codeVerifier?: string;
		codeChallengeMethod?: 'S256' | 'plain';
		scopes?: string[];
	}) => Promise<URL>;
};
