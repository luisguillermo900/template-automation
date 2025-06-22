// models/acceptanceRecord.model.ts
export interface AcceptanceRecordDTO {
  projectId: string;
  filePath: string;
  fileType: string;
}

export interface AcceptanceRecordResponse {
  id: string;
  projectId: string;
  filePath: string;
  fileType: string;
  uploadDate: Date;
  project?: {
    id: string;
    code: string;
    name: string;
    organization?: {
      code: string;
      name: string;
    };
  };
}

export interface AcceptanceRecordWithProjectResponse extends AcceptanceRecordResponse {
  project: {
    id: string;
    code: string;
    name: string;
    organization: {
      code: string;
      name: string;
    };
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface AcceptanceRecordSearchParams {
  projectId?: string;
  fileType?: string;
  startDate?: Date;
  endDate?: Date;
}