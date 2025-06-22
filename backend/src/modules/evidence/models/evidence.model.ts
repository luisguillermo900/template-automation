import { Evidence } from '@prisma/client';

export type EvidenceCreateInput = {
  code: string;
  name: string;
  type: string;
  interviewId: string;
  evidenceDate?: Date;
  file: string;
};

export interface EvidenceDTO {
  code: string;
  name: string;
  type: string;
  file: string;
}

export interface EvidenceResponse {
  id: string;
  code: string;
  name: string;
  type: string;
  interviewId: string;
  evidenceDate: Date;
  file: string;
}

export { Evidence };
