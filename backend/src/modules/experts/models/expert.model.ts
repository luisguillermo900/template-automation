

export interface ExpertDTO {
    paternalSurname: string;
    maternalSurname: string;
    firstName: string;
    experience: string;
    comment: string;
    status: string;
    externalOrganization?: string;
  }
  
  export interface ExpertResponse {
    id: string;
    code: string;
    version: string;
    creationDate: Date;
    modificationDate?: Date | null;
    paternalSurname: string;
    maternalSurname: string | null;
    firstName: string;
    experience: string;
    comment?: string | null;
    status: string;
    externalOrganization?: string | null;
    projectId: string;
  }
  
  export interface PaginationParams {
    page: number;
    limit: number;
  }
  