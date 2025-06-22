// risk/models/risk.model.ts

export interface RiskDTO {
  projectId: string;
  entityType: string;
  registryCode: string;
  description: string;
  impact: string;
  probability: string;
  status: string;
  comments?: string;
  sourceRiskCode?: string; // Referencia a un riesgo existente del que se deriva
}

export interface RiskResponse {
  id: string;
  projectId: string;
  entityType: string;
  registryCode: string;
  code: string;
  description: string;
  impact: string;
  probability: string;
  status: string;
  creationDate: Date;
  modificationDate?: Date | null;
  comments?: string | null;
  sourceRiskCode?: string | null; // Referencia a un riesgo existente del que se deriva
}

export interface RiskCustomizationDTO {
  description?: string;
  impact?: string;
  probability?: string;
  status?: string;
  comments?: string;
}

export interface RiskDuplicateCheckParams {
  projectId: string;
  entityType: string;
  registryCode: string;
  description: string;
}

export interface RiskGlobalSearchParams {
  page?: number;
  limit?: number;
  description?: string;
  impact?: string;
  probability?: string;
  status?: string;
  entityType?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FrequentRiskResponse {
  description: string;
  projectCount: number;
  sampleCode: string;
}