// models/author.model.ts - Versión final con organizaciones y versionado
export interface AuthorDTO {
  firstName: string;
  paternalSurname?: string;
  maternalSurname?: string;
  alias?: string;
  phone?: string;
  dni?: string;
  password?: string;
  organizationId?: string; // Cambio: usar ID de organización
  templateAuthorId?: string; // Cambio: usar ID de autor plantilla
  status: string;
  comments?: string;
  roleId?: string;
  version?: string; // AGREGADO: Campo version para el DTO
  
  // Permisos agrupados por categorías
  // Gestión de Personas
  canEditActors?: boolean;
  canEditExperts?: boolean;
  
  // Requerimientos
  canEditRequirements?: boolean;
  canEditSpecifications?: boolean;
  canEditIlaciones?: boolean;
  
  // Artefactos y Documentos
  canEditArtefacts?: boolean;
  canEditSources?: boolean;
  canEditMetrics?: boolean;
  
  // Procesos
  canEditInterviews?: boolean;
  canEditEducation?: boolean;
  canEditSoftwareTests?: boolean;
  canEditWorkplaceSafety?: boolean;
}

export interface AuthorResponse {
  id: string;
  code: string;
  version: string;
  creationDate: Date;
  modificationDate?: Date | null;
  firstName: string;
  paternalSurname?: string | null;
  maternalSurname?: string | null;
  alias?: string | null;
  phone?: string | null;
  dni?: string | null;
  organizationId?: string | null;
  organization?: {
    id: string;
    code: string;
    name: string;
  } | null;
  templateAuthorId?: string | null;
  templateAuthor?: {
    id: string;
    code: string;
    firstName: string;
    paternalSurname?: string | null; // CORREGIDO: permitir null
  } | null;
  status: string;
  comments?: string | null;
  roleId?: string | null;
  role?: {
    id: string;
    name: string;
    creationDate: Date;
  } | null;
  
  // Permisos agrupados
  permissions: {
    people: {
      canEditActors: boolean;
      canEditExperts: boolean;
    };
    requirements: {
      canEditRequirements: boolean;
      canEditSpecifications: boolean;
      canEditIlaciones: boolean;
    };
    artifacts: {
      canEditArtefacts: boolean;
      canEditSources: boolean;
      canEditMetrics: boolean;
    };
    processes: {
      canEditInterviews: boolean;
      canEditEducation: boolean;
      canEditSoftwareTests: boolean;
      canEditWorkplaceSafety: boolean;
    };
  };
}

export interface AuthorWithInterviewsResponse extends AuthorResponse {
  interviews: {
    id: string;
    interviewName: string;
    interviewDate: Date;
    projectId: string;
  }[];
}

export interface AuthorSearchParams {
  firstName?: string;
  paternalSurname?: string;
  dni?: string;
  phone?: string;
  organizationId?: string;
  status?: string;
  roleId?: string;
  hasPermissions?: string[]; // Para buscar por permisos específicos
}

export interface AuthorStatsResponse {
  total: number;
  byStatus: {
    active: number;
    inactive: number;
  };
  byRole: {
    [roleName: string]: number;
  };
  byOrganization: {
    [orgName: string]: number;
  };
  byPermissions: {
    canEditActors: number;
    canEditRequirements: number;
    canEditInterviews: number;
    // ... otros permisos
  };
  totalInterviews: number;
  averagePermissionsPerAuthor: number;
}

export interface OrganizationOption {
  id: string;
  code: string;
  name: string;
}

export interface AuthorTemplateOption {
  id: string;
  code: string;
  firstName: string;
  paternalSurname?: string | null; // CORREGIDO: permitir null
  fullName: string;
}

export interface VersionHistory {
  version: string;
  modificationDate: Date;
  changes: string[];
}