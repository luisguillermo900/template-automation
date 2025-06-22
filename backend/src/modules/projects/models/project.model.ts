// Para datos de entrada - crear/actualizar
export interface ProjectDTO {
  name: string;
  description?: string;
  status?: string;
  comments?: string;
}

export interface ProjectResponse {
  id: string;
  code: string;
  version: string;
  name: string;
  description?: string | null;
  status?: string | null;
  comments?: string | null;
  creationDate: Date;
  modificationDate?: Date | null;
  organizationId: string;
  organizationCode: string;
}