export interface IlacionDTO {
  name: string;
  status: string;
  importance: string;
  precondition: string;
  procedure: string;
  postcondition: string;
  comment?: string;
}

export interface IlacionResponse {
  id: string;
  code: string;
  version: string;
  name: string;
  creationDate: Date;
  modificationDate?: Date | null;
  status: string;
  importance: string;
  educcionId: string;
  precondition: string;
  procedure: string;
  postcondition: string;
  comment?: string | null;
}