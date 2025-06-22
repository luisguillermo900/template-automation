// models/actor.model.ts

export interface ActorDTO {
  name: string;
  roleId: string;
  status: string;
  type: string;
  authorId?: string;
  comments?: string;
  organizationId?: string;
}

export interface ActorResponse {
  id: string;
  code: string;
  name: string;
  projectId: string;
  roleId: string;
  status: string;
  type: string;
  authorId?: string | null;
  comments?: string | null;
  creationDate: Date;
  modificationDate?: Date | null;
  organizationId?: string | null;
  version: string;
  // Relaciones opcionales para cuando se incluyan
  role?: {
    id: string;
    name: string;
    code: string;
  };
  organization?: {
    id: string;
    name: string;
    code: string;
  };
  author?: {
    id: string;
    firstName: string;
    code: string;
  };
}

export interface ActorSearchParams {
  name?: string;
  roleId?: string;
  type?: string;
  status?: string;
  year?: string;
  month?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}