// controllers/interface.controller.ts
import { Request, Response } from 'express';
import { interfaceService } from '../services/interface.service';
import { InterfaceDTO } from '../models/interface.model';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import multer from 'multer';

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, and PNG files are allowed.'));
    }
  },
});

export class InterfaceController {
  // Multer middleware for single file upload
  public uploadMiddleware = upload.single('file');

  /**
   * Creates a new interface
   */
  async createInterface(req: Request, res: Response) {
    try {
      const interfaceDto: InterfaceDTO = {
        name: req.body.name,
        projectId: req.body.projectId,
        file: req.file,
      };

      if (!interfaceDto.name || interfaceDto.name.trim() === '') {
        return res.status(400).json({ error: 'Interface name is required.' });
      }

      if (!interfaceDto.projectId) {
        return res.status(400).json({ error: 'Project ID is required.' });
      }

      if (!interfaceDto.file) {
        return res.status(400).json({ error: 'File is required.' });
      }

      const newInterface = await interfaceService.createInterface(interfaceDto);

      res.status(201).json({
        message: 'Interface created successfully.',
        interface: newInterface,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating interface:', err.message);
      
      if (err.message === 'Interface name already exists in this project') {
        return res.status(400).json({ error: 'Interface name already exists in this project.' });
      }
      
      if (err.message.includes('Invalid file type')) {
        return res.status(400).json({ error: err.message });
      }
      
      res.status(500).json({ error: err.message || 'Error creating interface.' });
    }
  }

  /**
   * Updates an existing interface
   */
  async updateInterface(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const interfaceDto: Partial<InterfaceDTO> = {
        name: req.body.name,
        file: req.file,
      };

      const updatedInterface = await interfaceService.updateInterface(id, interfaceDto);

      res.status(200).json({
        message: 'Interface updated successfully.',
        interface: updatedInterface,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating interface:', err.message);
      
      if (err.message === 'Interface not found') {
        return res.status(404).json({ error: err.message });
      }
      
      if (err.message === 'Interface name already exists in this project') {
        return res.status(400).json({ error: 'Interface name already exists in this project.' });
      }
      
      if (err.message.includes('Invalid file type')) {
        return res.status(400).json({ error: err.message });
      }
      
      res.status(500).json({ error: err.message || 'Error updating interface.' });
    }
  }

  /**
   * Gets all interfaces with pagination
   */
  async getInterfaces(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await interfaceService.getInterfaces(page, limit);

      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching interfaces:', err.message);
      res.status(500).json({ error: 'Error fetching interfaces.' });
    }
  }

  /**
   * Gets an interface by ID
   */
  async getInterfaceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const interfaceRecord = await interfaceService.getInterfaceById(id);

      res.status(200).json(interfaceRecord);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching interface:', err.message);
      
      if (err.message === 'Interface not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching interface.' });
    }
  }

  /**
   * Gets an interface by code
   */
  async getInterfaceByCode(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const interfaceRecord = await interfaceService.getInterfaceByCode(code);

      res.status(200).json(interfaceRecord);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching interface by code:', err.message);
      
      if (err.message === 'Interface not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching interface by code.' });
    }
  }

  /**
   * Searches interfaces with filters
   */
  async searchInterfaces(req: Request, res: Response) {
    try {
      const { name, projectId, fileType } = req.query;

      const searchParams: any = {};
      if (name) searchParams.name = name as string;
      if (projectId) searchParams.projectId = projectId as string;
      if (fileType) searchParams.fileType = fileType as string;

      const interfaces = await interfaceService.searchInterfaces(searchParams);

      res.status(200).json(interfaces);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching interfaces:', err.message);
      res.status(500).json({ error: 'Error searching interfaces.' });
    }
  }

  /**
   * Gets interfaces by project ID
   */
  async getInterfacesByProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const interfaces = await interfaceService.getInterfacesByProject(projectId);

      res.status(200).json(interfaces);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching interfaces by project:', err.message);
      res.status(500).json({ error: 'Error fetching interfaces by project.' });
    }
  }

  /**
   * Gets next interface code for a project
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const nextCode = await interfaceService.getNextCode(projectId);

      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  /**
   * Gets interface statistics
   */
  async getInterfaceStats(req: Request, res: Response) {
    try {
      const stats = await interfaceService.getInterfaceStats();

      res.status(200).json({
        ...stats,
        message: 'Statistics retrieved successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching interface stats:', err.message);
      res.status(500).json({ error: 'Error fetching interface stats.' });
    }
  }

  /**
   * Gets interfaces for dropdown by project
   */
  async getInterfacesForDropdown(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const interfaces = await interfaceService.getInterfacesForDropdown(projectId);

      res.status(200).json(interfaces);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching interfaces for dropdown:', err.message);
      res.status(500).json({ error: 'Error fetching interfaces for dropdown.' });
    }
  }

  /**
   * Downloads interface file
   */
  async downloadInterfaceFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fileInfo = await interfaceService.getInterfaceFile(id);

      res.setHeader('Content-Type', fileInfo.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.fileName}"`);

      res.sendFile(fileInfo.filePath, { root: '.' });
    } catch (error) {
      const err = error as Error;
      console.error('Error downloading interface file:', err.message);
      
      if (err.message === 'Interface not found' || err.message === 'File not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error downloading interface file.' });
    }
  }

  /**
   * Views interface file (inline)
   */
  async viewInterfaceFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fileInfo = await interfaceService.getInterfaceFile(id);

      res.setHeader('Content-Type', fileInfo.mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${fileInfo.fileName}"`);

      res.sendFile(fileInfo.filePath, { root: '.' });
    } catch (error) {
      const err = error as Error;
      console.error('Error viewing interface file:', err.message);
      
      if (err.message === 'Interface not found' || err.message === 'File not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error viewing interface file.' });
    }
  }

  /**
   * Deletes an interface
   */
  async deleteInterface(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await interfaceService.deleteInterface(id);

      res.status(200).json({
        message: 'Interface deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting interface:', err.message);
      
      if (err.message === 'Interface not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error deleting interface.' });
    }
  }

  /**
   * Exports interfaces to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    try {
      // Get all interfaces without pagination for complete export
      const allInterfaces = await interfaceService.searchInterfaces({}); // Empty search returns all interfaces
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Interfaces');

      // Add title and metadata
      worksheet.mergeCells('A1:H1');
      worksheet.getCell('A1').value = 'Interface Report';
      worksheet.getCell('A1').font = { size: 16, bold: true };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };

      // Add export date
      worksheet.mergeCells('A2:H2');
      worksheet.getCell('A2').value = `Generated on: ${new Date().toLocaleString()}`;
      worksheet.getCell('A2').font = { size: 10, italic: true };
      worksheet.getCell('A2').alignment = { horizontal: 'center' };

      // Add headers starting from row 4
      const headerRow = 4;
      worksheet.getRow(headerRow).values = [
        'Code',
        'Name', 
        'Version',
        'Date',
        'File Type',
        'Project Code',
        'Project Name',
        'File Path'
      ];

      // Style header row
      worksheet.getRow(headerRow).font = { bold: true };
      worksheet.getRow(headerRow).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6FA' }
      };

      // Add data rows
      allInterfaces.forEach((interfaceRecord, index) => {
        const rowIndex = headerRow + 1 + index;
        worksheet.getRow(rowIndex).values = [
          interfaceRecord.code,
          interfaceRecord.name,
          interfaceRecord.version,
          interfaceRecord.date instanceof Date 
            ? interfaceRecord.date.toLocaleDateString() 
            : new Date(interfaceRecord.date).toLocaleDateString(),
          interfaceRecord.fileType.toUpperCase(),
          interfaceRecord.project?.code || 'N/A',
          interfaceRecord.project?.name || 'N/A',
          interfaceRecord.filePath
        ];

        // Alternate row colors
        if (index % 2 === 1) {
          worksheet.getRow(rowIndex).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8F8FF' }
          };
        }
      });

      // Auto-fit columns
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 12 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Version', key: 'version', width: 12 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'File Type', key: 'fileType', width: 12 },
        { header: 'Project Code', key: 'projectCode', width: 15 },
        { header: 'Project Name', key: 'projectName', width: 25 },
        { header: 'File Path', key: 'filePath', width: 30 }
      ];

      // Add borders to all cells with data
      const totalRows = headerRow + allInterfaces.length;
      for (let row = headerRow; row <= totalRows; row++) {
        for (let col = 1; col <= 8; col++) {
          worksheet.getCell(row, col).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }
      }

      // Add summary at the bottom
      const summaryRow = totalRows + 2;
      worksheet.getCell(summaryRow, 1).value = 'Summary:';
      worksheet.getCell(summaryRow, 1).font = { bold: true };
      
      const stats = await interfaceService.getInterfaceStats();
      worksheet.getCell(summaryRow + 1, 1).value = `Total Interfaces: ${stats.total}`;
      worksheet.getCell(summaryRow + 2, 1).value = `Total Projects: ${stats.totalProjects}`;
      
      // File type summary
      let fileTypeRow = summaryRow + 3;
      worksheet.getCell(fileTypeRow, 1).value = 'By File Type:';
      fileTypeRow++;
      Object.entries(stats.byFileType).forEach(([fileType, count]) => {
        worksheet.getCell(fileTypeRow, 1).value = `${fileType.toUpperCase()}: ${count}`;
        fileTypeRow++;
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=interfaces-report-${new Date().toISOString().split('T')[0]}.xlsx`);

      // Write to response
      await workbook.xlsx.write(res);
    } catch (error) {
      console.error('Error exporting interfaces to Excel:', error);
      res.status(500).json({ error: 'Error exporting interfaces to Excel' });
    }
  }

  /**
   * Exports interfaces to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    try {
      // Get all interfaces without pagination for complete export
      const allInterfaces = await interfaceService.searchInterfaces({}); // Empty search returns all interfaces
      const stats = await interfaceService.getInterfaceStats();
      
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 40,
        layout: 'landscape' // Better for tables
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=interfaces-report-${new Date().toISOString().split('T')[0]}.pdf`);

      // Pipe PDF to response
      doc.pipe(res);

      // PDF header
      doc.fontSize(20).text('Interface Report', { align: 'center' });
      doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown();

      // Summary section
      doc.fontSize(14).text('Summary', { underline: true });
      doc.fontSize(10);
      doc.text(`Total Interfaces: ${stats.total}`);
      doc.text(`Total Projects: ${stats.totalProjects}`);
      
      // File type summary
      if (Object.keys(stats.byFileType).length > 0) {
        doc.text('File Types:');
        Object.entries(stats.byFileType).forEach(([fileType, count]) => {
          doc.text(`  ${fileType.toUpperCase()}: ${count}`);
        });
      }
      doc.moveDown();

      // Table setup
      let y = 250;
      const rowHeight = 25;
      const tableLeft = 40;
      
      // Column widths (adjusted for landscape)
      const colWidths = {
        code: 80,
        name: 120,
        version: 60,
        date: 80,
        fileType: 70,
        projectCode: 80,
        projectName: 140
      };

      // Calculate x positions
      let x = tableLeft;
      const colX: { [key: string]: number } = {
        code: x,
        name: 0,
        version: 0,
        date: 0,
        fileType: 0,
        projectCode: 0,
        projectName: 0
      };
      x += colWidths.code;
      colX.name = x;
      x += colWidths.name;
      colX.version = x;
      x += colWidths.version;
      colX.date = x;
      x += colWidths.date;
      colX.fileType = x;
      x += colWidths.fileType;
      colX.projectCode = x;
      x += colWidths.projectCode;
      colX.projectName = x;

      // Table headers
      doc.fontSize(12).fillColor('black');
      doc.text('Code', colX.code, y);
      doc.text('Name', colX.name, y);
      doc.text('Version', colX.version, y);
      doc.text('Date', colX.date, y);
      doc.text('File Type', colX.fileType, y);
      doc.text('Project Code', colX.projectCode, y);
      doc.text('Project Name', colX.projectName, y);

      // Header underline
      y += 15;
      doc.moveTo(tableLeft, y).lineTo(tableLeft + 630, y).stroke();
      y += 10;

      // Table rows
      doc.fontSize(9);
      allInterfaces.forEach((interfaceRecord, index) => {
        // Check for page break
        if (y > 500) {
          doc.addPage();
          y = 50;
          
          // Redraw headers on new page
          doc.fontSize(12).fillColor('black');
          doc.text('Code', colX.code, y);
          doc.text('Name', colX.name, y);
          doc.text('Version', colX.version, y);
          doc.text('Date', colX.date, y);
          doc.text('File Type', colX.fileType, y);
          doc.text('Project Code', colX.projectCode, y);
          doc.text('Project Name', colX.projectName, y);
          
          y += 15;
          doc.moveTo(tableLeft, y).lineTo(tableLeft + 630, y).stroke();
          y += 10;
          doc.fontSize(9);
        }

        // Alternate row background
        if (index % 2 === 1) {
          doc.rect(tableLeft, y - 5, 630, rowHeight).fillColor('#f8f8ff').fill();
          doc.fillColor('black');
        }

        // Row data
        doc.text(interfaceRecord.code, colX.code, y, { width: colWidths.code - 5 });
        
        const name = interfaceRecord.name.length > 18 ? 
          interfaceRecord.name.substring(0, 18) + '...' : interfaceRecord.name;
        doc.text(name, colX.name, y, { width: colWidths.name - 5 });
        
        doc.text(interfaceRecord.version, colX.version, y, { width: colWidths.version - 5 });
        
        const dateStr = interfaceRecord.date instanceof Date 
          ? interfaceRecord.date.toLocaleDateString() 
          : new Date(interfaceRecord.date).toLocaleDateString();
        doc.text(dateStr, colX.date, y, { width: colWidths.date - 5 });
        
        doc.text(interfaceRecord.fileType.toUpperCase(), colX.fileType, y, { width: colWidths.fileType - 5 });
        doc.text(interfaceRecord.project?.code || 'N/A', colX.projectCode, y, { width: colWidths.projectCode - 5 });
        
        const projectName = interfaceRecord.project?.name || 'N/A';
        const truncatedProjectName = projectName.length > 20 ? 
          projectName.substring(0, 20) + '...' : projectName;
        doc.text(truncatedProjectName, colX.projectName, y, { width: colWidths.projectName - 5 });

        y += rowHeight;
      });

      // Footer
      doc.fontSize(8).fillColor('gray');
      doc.text(
        `Report generated by Interface Management System - ${new Date().toLocaleString()}`,
        tableLeft,
        y + 20,
        { align: 'center' }
      );

      // Finalize document
      doc.end();
    } catch (error) {
      console.error('Error exporting interfaces to PDF:', error);
      res.status(500).json({ error: 'Error exporting interfaces to PDF' });
    }
  }
}

// Export singleton instance of the controller
export const interfaceController = new InterfaceController();