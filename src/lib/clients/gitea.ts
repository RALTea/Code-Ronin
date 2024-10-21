import { OAuth2Client } from 'oslo/oauth2';
import {
	env
} from '$env/dynamic/private';

export const giteaOauthClient = new OAuth2Client(
	env.GITEA_CLIENT_ID ?? '',
	env.GITEA_AUTHORIZE_ENDPOINT ?? '',
	env.GITEA_TOKEN_ENDPOINT ?? '',
);
