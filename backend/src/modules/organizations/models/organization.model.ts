import { ProjectResponse } from '../../projects/models/project.model';

export interface OrganizationDTO {
  name: string;
  address?: string;
  phone?: string;
  legalRepresentative?: string;
  representativePhone?: string;
  taxId?: string;
  contact?: string;
  contactPhone?: string;
  status?: string;
  comments?: string;
}

export interface OrganizationResponse {
  id: string;
  code: string;
  version: string;
  name: string;
  creationDate: Date;
  modificationDate?: Date | null;
  address?: string | null;
  phone?: string | null;
  legalRepresentative?: string | null;
  representativePhone?: string | null;
  taxId?: string | null;
  contact?: string | null;
  contactPhone?: string | null;
  status?: string | null;
  comments?: string | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface OrganizationWithProjectsResponse extends OrganizationResponse {
  projects: ProjectResponse[]; // Importar ProjectResponse del módulo de proyectos
}