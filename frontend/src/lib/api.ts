import { getToken, User } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}, isJson = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (isJson && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.error ?? body.message ?? message;
    } catch {
      /* body not JSON */
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiFetch = <T,>(path: string, init?: RequestInit) => request<T>(path, init, true);

export type AuthResponse = { token: string; user: User };

export const authApi = {
  register: (body: { email: string; password: string; name: string }) =>
    apiFetch<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => apiFetch<User>("/auth/me"),
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
};

export type CategoryRequest = {
  name: string;
  description?: string;
  imageUrl?: string;
};

export const categoriesApi = {
  list: () => apiFetch<Category[]>("/categories"),
  get: (slug: string) => apiFetch<Category>(`/categories/${encodeURIComponent(slug)}`),
  create: (body: CategoryRequest) =>
    apiFetch<Category>("/admin/categories", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: CategoryRequest) =>
    apiFetch<Category>(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) => apiFetch<void>(`/admin/categories/${id}`, { method: "DELETE" }),
};

export type AccessType = "FREE" | "PREMIUM";

export type RecipeSummary = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  imageUrl: string | null;
  accessType: AccessType;
  published: boolean;
  featured: boolean;
  category: Category;
};

export type RecipeDetail = RecipeSummary & {
  description: string | null;
  ingredientsText: string | null;
  stepsText: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  difficulty: string | null;
};

export type RecipeRequest = {
  title: string;
  shortDescription?: string;
  description?: string;
  ingredientsText?: string;
  stepsText?: string;
  prepTime?: number | null;
  cookTime?: number | null;
  servings?: number | null;
  difficulty?: string;
  categoryId: string;
  accessType: AccessType;
  featured: boolean;
  imageUrl?: string;
};

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type RecipeListParams = {
  q?: string;
  category?: string;
  featured?: boolean;
  page?: number;
  size?: number;
};

function qs(params: Record<string, string | number | boolean | undefined | null>) {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    s.append(k, String(v));
  }
  const str = s.toString();
  return str ? `?${str}` : "";
}

export const recipesApi = {
  listPublic: (params: RecipeListParams = {}) =>
    apiFetch<Page<RecipeSummary>>(`/recipes${qs(params)}`),
  get: (slug: string) => apiFetch<RecipeDetail>(`/recipes/${encodeURIComponent(slug)}`),
  listAdmin: (params: Omit<RecipeListParams, "featured"> = {}) =>
    apiFetch<Page<RecipeSummary>>(`/admin/recipes${qs(params)}`),
  getAdmin: (id: string) => apiFetch<RecipeDetail>(`/admin/recipes/${id}`),
  create: (body: RecipeRequest) =>
    apiFetch<RecipeDetail>("/admin/recipes", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: RecipeRequest) =>
    apiFetch<RecipeDetail>(`/admin/recipes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  publish: (id: string) =>
    apiFetch<RecipeDetail>(`/admin/recipes/${id}/publish`, { method: "POST" }),
  unpublish: (id: string) =>
    apiFetch<RecipeDetail>(`/admin/recipes/${id}/unpublish`, { method: "POST" }),
  delete: (id: string) => apiFetch<void>(`/admin/recipes/${id}`, { method: "DELETE" }),
};

export const uploadsApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append("file", file);
    return request<{ url: string }>("/admin/uploads", { method: "POST", body: form }, false);
  },
};

export type AdminStats = {
  categoriesCount: number;
  recipesCount: number;
  publishedCount: number;
  usersCount: number;
};

export const adminApi = {
  stats: () => apiFetch<AdminStats>("/admin/stats"),
};

export function imageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path}`;
}
