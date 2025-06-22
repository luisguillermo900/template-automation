// nfr/models/nfr.model.ts

import { RiskResponse } from '../../risk/models/risk.model';

export interface NfrDTO {
  name: string;
  qualityAttribute: string;
  description: string;
  status: string;
  importance: string;
  comment?: string;
  projectId: string;
  sourceNfrCode?: string; // Referencia a un NFR existente del que se deriva
}

export interface NfrResponse {
  id: string;
  code: string;
  version: string;
  name: string;
  qualityAttribute: string;
  description: string;
  creationDate: Date;
  modificationDate?: Date | null;
  status: string;
  importance: string;
  comment?: string | null;
  projectId: string;
  sourceNfrCode?: string | null; // Referencia a un NFR existente del que se deriva
}

export interface NfrTemplateDTO {
  name: string;
  qualityAttribute: string;
  description: string;
  importance?: string;
  status?: string;
  comment?: string;
}

export interface NfrCustomizationDTO {
  name?: string;
  qualityAttribute?: string;
  description?: string;
  status?: string;
  importance?: string;
  comment?: string;
}

export interface NfrDuplicateCheckParams {
  projectId: string;
  name: string;
  qualityAttribute?: string;
}

export interface NfrGlobalSearchParams {
  page?: number;
  limit?: number;
  name?: string;
  qualityAttribute?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface NfrWithRisksResponse extends NfrResponse {
  risks: RiskResponse[]; // Ahora importa el tipo desde el módulo risk
}

export interface FrequentNfrResponse {
  name: string;
  qualityAttribute: string;
  projectCount: number;
  sampleCode: string;
}