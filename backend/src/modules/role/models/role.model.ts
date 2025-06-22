// models/role.model.ts
export interface RoleDTO {
  name: string;
  comments?: string;
  status?: string;
}

export interface RoleResponse {
  id: string;
  code: string;
  name: string;
  creationDate: Date;
  comments?: string | null;
  status: string;
  actorCount?: number;
  authorCount?: number;
}

export interface RoleWithRelationsResponse extends RoleResponse {
  actors: {
    id: string;
    code: string;
    firstName: string;
    paternalSurname?: string;
  }[];
  authors: {
    id: string;
    code: string;
    firstName: string;
    paternalSurname?: string;
  }[];
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface RoleSearchParams {
  name?: string;
  status?: string;
}

export interface RoleStatsResponse {
  total: number;
  byStatus: {
    active: number;
    inactive: number;
  };
  totalActors: number;
  totalAuthors: number;
  averageActorsPerRole: number;
  averageAuthorsPerRole: number;
}