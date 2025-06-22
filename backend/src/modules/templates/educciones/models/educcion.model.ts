// import { IlacionResponse } from "../../ilacion/models/ilacion.model";

export interface EduccionDTO {
  name: string;
  description?: string;
  status?: string;
  importance?: string;
  comment?: string;
}

export interface EduccionResponse {
  id: string;
  code: string;
  version: string;
  creationDate: Date;
  modificationDate?: Date | null;
  name: string;
  description: string;
  status: string;
  importance: string;
  comment?: string | null;
  projectId: string;
}

// export interface EduccionWithIlacionesResponse extends EduccionResponse {
//   ilaciones: IlacionResponse[];
// }

export interface PaginationParams {
  page: number;
  limit: number;
}