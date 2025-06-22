// services/acceptanceRecord.service.ts
import { acceptanceRecordRepository } from '../repositories/acceptanceRecord.repository';
import { AcceptanceRecordDTO, AcceptanceRecordSearchParams } from '../models/acceptanceRecord.model';
import path from 'path';
import fs from 'fs';

export class AcceptanceRecordService {
  private readonly repository = acceptanceRecordRepository;

  /**
   * Creates a new acceptance record
   */
  async createAcceptanceRecord(data: AcceptanceRecordDTO) {
    // Validate that the project exists
    // This could be improved by adding a project service validation
    
    // Validate file type
    const allowedTypes = ['.jpg', '.png', '.jpeg', '.pdf', '.docx'];
    const fileExtension = path.extname(data.filePath).toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      throw new Error(`File type ${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    return this.repository.create(data);
  }

  /**
   * Gets all acceptance records with pagination
   */
  async getAcceptanceRecords(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const records = await this.repository.findAll(skip, limit);
    const total = await this.repository.count();

    return {
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Gets an acceptance record by ID
   */
  async getAcceptanceRecordById(id: string) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new Error('Acceptance record not found');
    }
    return record;
  }

  /**
   * Gets acceptance records by project ID
   */
  async getAcceptanceRecordsByProject(projectId: string) {
    return this.repository.findByProjectId(projectId);
  }

  /**
   * Updates an existing acceptance record
   */
  async updateAcceptanceRecord(id: string, data: Partial<AcceptanceRecordDTO>) {
    // Verify record exists
    const existingRecord = await this.repository.findById(id);
    if (!existingRecord) {
      throw new Error('Acceptance record not found');
    }

    // Validate file type if being updated
    if (data.filePath) {
      const allowedTypes = ['.jpg', '.png', '.jpeg', '.pdf', '.docx'];
      const fileExtension = path.extname(data.filePath).toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        throw new Error(`File type ${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      }
    }

    return this.repository.update(id, data);
  }

  /**
   * Deletes an acceptance record
   */
  async deleteAcceptanceRecord(id: string) {
    // Verify record exists
    const existingRecord = await this.repository.findById(id);
    if (!existingRecord) {
      throw new Error('Acceptance record not found');
    }

    // Optionally delete the actual file from filesystem
    try {
      if (fs.existsSync(existingRecord.filePath)) {
        fs.unlinkSync(existingRecord.filePath);
      }
    } catch (error) {
      console.warn(`Could not delete file: ${existingRecord.filePath}`, error);
    }

    return this.repository.delete(id);
  }

  /**
   * Searches acceptance records with filters
   */
  async searchAcceptanceRecords(params: AcceptanceRecordSearchParams) {
    return this.repository.search(params);
  }

  /**
   * Gets acceptance records by file type
   */
  async getAcceptanceRecordsByFileType(fileType: string) {
    return this.repository.findByFileType(fileType);
  }

  /**
   * Gets statistics for acceptance records
   */
  async getAcceptanceRecordStats() {
    const total = await this.repository.count();
    const byFileType = await this.getFileTypeStats();
    
    return {
      total,
      byFileType,
    };
  }

  /**
   * Gets file type statistics
   */
  private async getFileTypeStats() {
    // This would require a more complex query or processing
    // For now, we'll return a simple structure
    const pdfRecords = await this.repository.findByFileType('pdf');
    const imgRecords = await this.repository.findByFileType('jpg');
    const docxRecords = await this.repository.findByFileType('docx');

    return {
      pdf: pdfRecords.length,
      images: imgRecords.length,
      documents: docxRecords.length,
    };
  }

  /**
   * Validates file upload
   */
  validateFileUpload(filePath: string, fileType: string): boolean {
    const allowedTypes = ['.jpg', '.png', '.jpeg', '.pdf', '.docx'];
    const fileExtension = path.extname(filePath).toLowerCase();
    
    return allowedTypes.includes(fileExtension) && fileType === fileExtension.substring(1);
  }

  /**
   * Gets acceptance records uploaded in a date range
   */
  async getAcceptanceRecordsByDateRange(startDate: Date, endDate: Date) {
    return this.repository.search({
      startDate,
      endDate,
    });
  }
}

// Export singleton instance of the service
export const acceptanceRecordService = new AcceptanceRecordService();