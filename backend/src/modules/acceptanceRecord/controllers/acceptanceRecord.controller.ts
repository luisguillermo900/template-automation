// controllers/acceptanceRecord.controller.ts
import { Request, Response } from 'express';
import { acceptanceRecordService } from '../services/acceptanceRecord.service';
import { AcceptanceRecordDTO } from '../models/acceptanceRecord.model';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'acceptance-records');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: AR-{timestamp}-{original-name}
    const timestamp = Date.now();
    const originalName = file.originalname;
    const fileName = `AR-${timestamp}-${originalName}`;
    cb(null, fileName);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.docx'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export class AcceptanceRecordController {
  /**
   * Creates a new acceptance record with file upload
   */
  async createAcceptanceRecord(req: Request, res: Response) {
    try {
      const { projectId } = req.body;
      
      if (!projectId) {
        return res.status(400).json({ error: 'Project ID is required.' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'File is required.' });
      }

      const acceptanceRecordDto: AcceptanceRecordDTO = {
        projectId,
        filePath: req.file.path,
        fileType: path.extname(req.file.originalname).toLowerCase().substring(1), // Remove the dot
      };

      const newAcceptanceRecord = await acceptanceRecordService.createAcceptanceRecord(acceptanceRecordDto);

      res.status(201).json({
        message: 'Acceptance record created successfully.',
        acceptanceRecord: newAcceptanceRecord,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating acceptance record:', err.message);
      
      // Clean up uploaded file if there was an error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ error: err.message || 'Error creating acceptance record.' });
    }
  }

  /**
   * Gets all acceptance records
   */
  async getAcceptanceRecords(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await acceptanceRecordService.getAcceptanceRecords(page, limit);

      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching acceptance records:', err.message);
      res.status(500).json({ error: 'Error fetching acceptance records.' });
    }
  }

  /**
   * Gets an acceptance record by ID
   */
  async getAcceptanceRecordById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const acceptanceRecord = await acceptanceRecordService.getAcceptanceRecordById(id);

      res.status(200).json(acceptanceRecord);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching acceptance record:', err.message);
      
      if (err.message === 'Acceptance record not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching acceptance record.' });
    }
  }

  /**
   * Gets acceptance records by project
   */
  async getAcceptanceRecordsByProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const acceptanceRecords = await acceptanceRecordService.getAcceptanceRecordsByProject(projectId);

      res.status(200).json(acceptanceRecords);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching acceptance records by project:', err.message);
      res.status(500).json({ error: 'Error fetching acceptance records by project.' });
    }
  }

  /**
   * Updates an acceptance record
   */
  async updateAcceptanceRecord(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // If there's a new file, handle the file path update
      if (req.file) {
        updateData.filePath = req.file.path;
        updateData.fileType = path.extname(req.file.originalname).toLowerCase().substring(1);
      }

      const updatedAcceptanceRecord = await acceptanceRecordService.updateAcceptanceRecord(id, updateData);

      res.status(200).json({
        message: 'Acceptance record updated successfully.',
        acceptanceRecord: updatedAcceptanceRecord,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating acceptance record:', err.message);
      
      // Clean up uploaded file if there was an error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      if (err.message === 'Acceptance record not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: err.message || 'Error updating acceptance record.' });
    }
  }

  /**
   * Deletes an acceptance record
   */
  async deleteAcceptanceRecord(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await acceptanceRecordService.deleteAcceptanceRecord(id);

      res.status(200).json({
        message: 'Acceptance record deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting acceptance record:', err.message);
      
      if (err.message === 'Acceptance record not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error deleting acceptance record.' });
    }
  }

  /**
   * Searches acceptance records
   */
  async searchAcceptanceRecords(req: Request, res: Response) {
    try {
      const { projectId, fileType, startDate, endDate } = req.query;

      const searchParams: any = {};

      if (projectId) searchParams.projectId = projectId as string;
      if (fileType) searchParams.fileType = fileType as string;
      if (startDate) searchParams.startDate = new Date(startDate as string);
      if (endDate) searchParams.endDate = new Date(endDate as string);

      const acceptanceRecords = await acceptanceRecordService.searchAcceptanceRecords(searchParams);

      res.status(200).json(acceptanceRecords);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching acceptance records:', err.message);
      res.status(500).json({ error: 'Error searching acceptance records.' });
    }
  }

  /**
   * Gets acceptance records by file type
   */
  async getAcceptanceRecordsByFileType(req: Request, res: Response) {
    try {
      const { fileType } = req.params;
      const acceptanceRecords = await acceptanceRecordService.getAcceptanceRecordsByFileType(fileType);

      res.status(200).json(acceptanceRecords);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching acceptance records by file type:', err.message);
      res.status(500).json({ error: 'Error fetching acceptance records by file type.' });
    }
  }

  /**
   * Downloads an acceptance record file
   */
  async downloadAcceptanceRecordFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const acceptanceRecord = await acceptanceRecordService.getAcceptanceRecordById(id);

      if (!fs.existsSync(acceptanceRecord.filePath)) {
        return res.status(404).json({ error: 'File not found.' });
      }

      const fileName = path.basename(acceptanceRecord.filePath);
      res.download(acceptanceRecord.filePath, fileName);
    } catch (error) {
      const err = error as Error;
      console.error('Error downloading file:', err.message);
      
      if (err.message === 'Acceptance record not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error downloading file.' });
    }
  }

  /**
   * Gets acceptance record statistics
   */
  async getAcceptanceRecordStats(req: Request, res: Response) {
    try {
      const stats = await acceptanceRecordService.getAcceptanceRecordStats();

      res.status(200).json(stats);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching acceptance record stats:', err.message);
      res.status(500).json({ error: 'Error fetching acceptance record stats.' });
    }
  }
}

// Export singleton instance of the controller
export const acceptanceRecordController = new AcceptanceRecordController();