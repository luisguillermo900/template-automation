// services/interface.service.ts
import { interfaceRepository } from '../repositories/interface.repository';
import { InterfaceDTO, InterfaceSearchParams, isValidFileType } from '../models/interface.model';
import fs from 'fs';
import path from 'path';

export class InterfaceService {
  private readonly repository = interfaceRepository;
  private readonly uploadPath = process.env.UPLOAD_PATH ?? './uploads/interfaces';

  constructor() {
    // Ensure upload directory exists
    this.ensureUploadDirectory();
  }

  /**
   * Ensures the upload directory exists
   */
  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  /**
   * Creates a new interface
   */
  async createInterface(data: InterfaceDTO) {
    // Validate required fields
    if (!data.name || data.name.trim() === '') {
      throw new Error('Interface name is required');
    }

    if (!data.projectId) {
      throw new Error('Project ID is required');
    }

    if (!data.file) {
      throw new Error('File is required');
    }

    // Validate file type
    const fileExtension = path.extname(data.file.originalname).toLowerCase().substring(1);
    if (!isValidFileType(fileExtension)) {
      throw new Error('Invalid file type. Only JPG, JPEG, and PNG files are allowed');
    }

    // Validate name uniqueness within project
    const isUnique = await this.repository.isNameUniqueInProject(data.name, data.projectId);
    if (!isUnique) {
      throw new Error('Interface name already exists in this project');
    }

    // Generate code and version
    const code = await this.repository.getNextCode(data.projectId);
    const version = '01.00'; // Default version

    // Save file
    const fileName = `${code}_${Date.now()}.${fileExtension}`;
    const filePath = path.join(this.uploadPath, fileName);
    
    fs.writeFileSync(filePath, data.file.buffer);

    // Create interface record
    const interfaceData = {
      ...data,
      code,
      version,
      filePath: fileName, // Store relative path
      fileType: fileExtension,
    };

    return this.repository.create(interfaceData);
  }

  /**
   * Updates an existing interface
   */
  async updateInterface(id: string, data: Partial<InterfaceDTO>) {
    // Verify interface exists
    const existingInterface = await this.repository.findById(id);
    if (!existingInterface) {
      throw new Error('Interface not found');
    }

    // Validate required fields if being updated
    if (data.name !== undefined && (!data.name || data.name.trim() === '')) {
      throw new Error('Interface name is required');
    }

    // Validate name uniqueness if being updated
    if (data.name && data.name !== existingInterface.name) {
      const isUnique = await this.repository.isNameUniqueInProject(
        data.name, 
        existingInterface.projectId, 
        id
      );
      if (!isUnique) {
        throw new Error('Interface name already exists in this project');
      }
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;

    // Handle file update
    if (data.file) {
      const fileExtension = path.extname(data.file.originalname).toLowerCase().substring(1);
      if (!isValidFileType(fileExtension)) {
        throw new Error('Invalid file type. Only JPG, JPEG, and PNG files are allowed');
      }

      // Delete old file
      const oldFilePath = path.join(this.uploadPath, existingInterface.filePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Save new file
      const fileName = `${existingInterface.code}_${Date.now()}.${fileExtension}`;
      const filePath = path.join(this.uploadPath, fileName);
      
      fs.writeFileSync(filePath, data.file.buffer);

      updateData.filePath = fileName;
      updateData.fileType = fileExtension;
    }

    return this.repository.update(id, updateData);
  }

  /**
   * Gets all interfaces with pagination
   */
  async getInterfaces(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const interfaces = await this.repository.findAll(skip, limit);
    const total = await this.repository.count();

    return {
      data: interfaces,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Gets an interface by ID
   */
  async getInterfaceById(id: string) {
    const interfaceRecord = await this.repository.findById(id);
    if (!interfaceRecord) {
      throw new Error('Interface not found');
    }

    return interfaceRecord;
  }

  /**
   * Gets an interface by code
   */
  async getInterfaceByCode(code: string) {
    const interfaceRecord = await this.repository.findByCode(code);
    if (!interfaceRecord) {
      throw new Error('Interface not found');
    }

    return interfaceRecord;
  }

  /**
   * Searches interfaces with filters
   */
  async searchInterfaces(params: InterfaceSearchParams) {
    return this.repository.search(params);
  }

  /**
   * Gets interfaces by project ID
   */
  async getInterfacesByProject(projectId: string) {
    return this.repository.findByProjectId(projectId);
  }

  /**
   * Deletes an interface
   */
  async deleteInterface(id: string) {
    // Verify interface exists
    const existingInterface = await this.repository.findById(id);
    if (!existingInterface) {
      throw new Error('Interface not found');
    }

    // Delete file
    const filePath = path.join(this.uploadPath, existingInterface.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return this.repository.delete(id);
  }

  /**
   * Gets next code preview
   */
  async getNextCode(projectId: string) {
    return this.repository.getNextCodePreview(projectId);
  }

  /**
   * Gets interface statistics
   */
  async getInterfaceStats() {
    return this.repository.getStats();
  }

  /**
   * Gets interfaces for dropdown by project
   */
  async getInterfacesForDropdown(projectId: string) {
    return this.repository.getInterfacesForDropdown(projectId);
  }

  /**
   * Gets interface file
   */
  async getInterfaceFile(id: string) {
    const interfaceRecord = await this.repository.findById(id);
    if (!interfaceRecord) {
      throw new Error('Interface not found');
    }

    const filePath = path.join(this.uploadPath, interfaceRecord.filePath);
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    return {
      filePath,
      fileName: interfaceRecord.filePath,
      mimeType: this.getMimeType(interfaceRecord.fileType),
    };
  }

  /**
   * Gets MIME type for file extension
   */
  private getMimeType(fileType: string): string {
    switch (fileType.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        return 'application/octet-stream';
    }
  }
}

// Export singleton instance of the service
export const interfaceService = new InterfaceService();