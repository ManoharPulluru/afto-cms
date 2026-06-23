export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpRequestOptions = {
  headers?: Record<string, string>
  /** Skip JSON.stringify — for FormData etc. */
  rawBody?: BodyInit
}

export class HttpServiceError extends Error {
  status: number
  body?: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'HttpServiceError'
    this.status = status
    this.body = body
  }
}

function getApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_API_URL ??
    process.env.NEXT_PUBLIC_OTP_API_BASE ??
    'https://qa3.getafto.com/backend/v1'
  ).replace(/\/$/, '')
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${getApiBase()}${normalized}`
}

async function request<TResponse>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options: HttpRequestOptions = {},
): Promise<TResponse> {
  const url = path.startsWith('http') ? path : apiUrl(path)

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: body !== undefined ? (options.rawBody ?? JSON.stringify(body)) : undefined,
  })

  let data: unknown
  try {
    data = await res.json()
  } catch {
    if (!res.ok) {
      throw new HttpServiceError(res.statusText || 'Request failed', res.status)
    }
    return undefined as TResponse
  }

  if (!res.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message: unknown }).message)
        : res.statusText || 'Request failed'
    throw new HttpServiceError(message, res.status, data)
  }

  return data as TResponse
}

export function get<TResponse>(path: string, options?: HttpRequestOptions): Promise<TResponse> {
  return request<TResponse>('GET', path, undefined, options)
}

export function post<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options?: HttpRequestOptions,
): Promise<TResponse> {
  return request<TResponse>('POST', path, body, options)
}

export function put<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options?: HttpRequestOptions,
): Promise<TResponse> {
  return request<TResponse>('PUT', path, body, options)
}

export function patch<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options?: HttpRequestOptions,
): Promise<TResponse> {
  return request<TResponse>('PATCH', path, body, options)
}

export function del<TResponse>(path: string, options?: HttpRequestOptions): Promise<TResponse> {
  return request<TResponse>('DELETE', path, undefined, options)
}
