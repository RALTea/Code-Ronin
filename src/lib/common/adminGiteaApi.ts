import axios from 'axios';
import { PUBLIC_GITEA_URL } from '$env/static/public';
import { ADMIN_GITEA_TOKEN } from '$env/static/private';

export const adminGiteaApi = axios.create({
	baseURL: `${PUBLIC_GITEA_URL}/api/v1/admin`,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `token ${ADMIN_GITEA_TOKEN}`
	}
});
