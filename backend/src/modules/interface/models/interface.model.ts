// models/interface.model.ts
export interface InterfaceDTO {
  name: string;
  projectId: string;
  file?: Express.Multer.File; // Para el archivo subido
  filePath?: string; // Ruta donde se guarda el archivo
  fileType?: string; // Tipo de archivo (jpg, png, jpeg)
}

export interface InterfaceResponse {
  id: string;
  code: string;
  name: string;
  version: string;
  date: Date;
  filePath: string;
  fileType: string;
  projectId: string;
  project?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface InterfaceWithProjectResponse extends InterfaceResponse {
  project: {
    id: string;
    name: string;
    code: string;
    organization?: {
      id: string;
      name: string;
      code: string;
    };
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface InterfaceSearchParams {
  name?: string;
  projectId?: string;
  fileType?: string;
}

export interface InterfaceStatsResponse {
  total: number;
  byProject: Record<string, number>;
  byFileType: Record<string, number>;
  totalProjects: number;
}

// Tipos de archivo permitidos
export const ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png'] as const;
export type AllowedFileType = typeof ALLOWED_FILE_TYPES[number];

// Validación de tipos de archivo
export const isValidFileType = (fileType: string): fileType is AllowedFileType => {
  return ALLOWED_FILE_TYPES.includes(fileType.toLowerCase() as AllowedFileType);
};