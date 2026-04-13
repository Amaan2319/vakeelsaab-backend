const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

export type AuthUser = {
  id: number;
  email: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

export type UploadResponse = {
  document_id: number;
  file_url: string;
  summary: string;
};

export type QueryRecord = {
  id: number;
  user_id: number;
  question: string;
  answer: string;
};

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST";
  token?: string;
  body?: BodyInit | null;
  headers?: Record<string, string>;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    body: options.body ?? null,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.error?.message ||
      "Something went wrong while contacting the server.";
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export async function signupUser(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function generateLegalResponse(
  question: string,
  token: string,
): Promise<string> {
  const data = await request<{ query_id: number; question: string; answer: string }>("/ask", {
    method: "POST",
    token,
    body: JSON.stringify({ question }),
  });

  return data.answer;
}

export async function uploadLegalDocument(
  file: File,
  token: string,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return request<UploadResponse>("/upload", {
    method: "POST",
    token,
    body: formData,
  });
}

export async function fetchQueryHistory(token: string): Promise<QueryRecord[]> {
  return request<QueryRecord[]>("/queries", {
    method: "GET",
    token,
  });
}
