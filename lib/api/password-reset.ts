import { API } from './endpoints';
import { loginUser, registerUser } from './public';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

const PROXY_BASE_URL = '/api/proxy';

function toProxyPath(apiPath: string) {
  return `${PROXY_BASE_URL}${apiPath.replace(/^\/api/, '')}`;
}

async function publicFetch<T>(apiPath: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const headers = new Headers(init.headers);

  if (!(init.body instanceof FormData) && init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(toProxyPath(apiPath), {
    ...init,
    headers,
    cache: 'no-store',
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Request failed');
  }

  return result;
}

export async function requestPasswordReset(email: string) {
  return publicFetch<{ token: string }>(API.PASSWORD_RESET.REQUEST, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string, confirmPassword: string) {
  return publicFetch<null>(API.PASSWORD_RESET.RESET, {
    method: 'POST',
    body: JSON.stringify({ token, newPassword, confirmPassword }),
  });
}
