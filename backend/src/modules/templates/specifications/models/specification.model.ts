export interface SpecificationDTO {
  name: string;
  status?: string;
  importance?: string;
  precondition?: string;
  procedure?: string;
  postcondition?: string;
  comment?: string;
}

export interface SpecificationResponse {
  id: string;
  code: string;
  version: string;
  name: string;
  creationDate: Date;
  modificationDate?: Date | null;
  status: string;
  importance: string;
  ilacionId: string;
  precondition: string;
  procedure: string;
  postcondition: string;
  comment?: string | null;
}