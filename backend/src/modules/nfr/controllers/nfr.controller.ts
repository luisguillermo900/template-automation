// nfr/controllers/nfr.controller.ts

import { Request, Response } from 'express';
import { nfrService } from '../services/nfr.service';
import { riskService } from '../../risk/services/risk.service'; // Importación del servicio de Risk
import { NfrDTO, NfrDuplicateCheckParams, NfrGlobalSearchParams } from '../models/nfr.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class NfrController {
  /**
   * Creates a new non-functional requirement
   */
  async createNfr(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const nfrDto: NfrDTO = req.body;

      if (!nfrDto.name || nfrDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      if (!nfrDto.qualityAttribute || nfrDto.qualityAttribute.trim() === '') {
        return res.status(400).json({ error: 'Quality attribute is required.' });
      }

      if (!nfrDto.description || nfrDto.description.trim() === '') {
        return res.status(400).json({ error: 'Description is required.' });
      }

      if (!nfrDto.status || nfrDto.status.trim() === '') {
        return res.status(400).json({ error: 'Status is required.' });
      }

      if (!nfrDto.importance || nfrDto.importance.trim() === '') {
        return res.status(400).json({ error: 'Importance is required.' });
      }

      // The project ID comes from the route parameter
      const newNfr = await nfrService.createNfr({
        ...nfrDto,
        projectId: projcod
      });

      res.status(201).json({
        message: 'Non-functional requirement created successfully.',
        nfr: newNfr,
      });
    } catch (error) {
      const err = error as Error;
      
      // Check for duplicate error
      if (err.message.includes("already exists")) {
        return res.status(409).json({ error: err.message });
      }
      
      console.error('Error creating non-functional requirement:', err.message);
      res.status(500).json({ error: 'Error creating non-functional requirement.' });
    }
  }

  /**
   * Creates a new NFR based on an existing one
   */
  async createNfrFromExisting(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const { sourceNfrCode, customizations } = req.body;

      if (!sourceNfrCode) {
        return res.status(400).json({ error: 'Source NFR code is required.' });
      }

      const newNfr = await nfrService.createNfrFromExisting(
        sourceNfrCode,
        projcod,
        customizations
      );

      res.status(201).json({
        message: 'Non-functional requirement created from existing NFR successfully.',
        nfr: newNfr,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating NFR from existing:', err.message);
      res.status(500).json({ error: 'Error creating NFR from existing: ' + err.message });
    }
  }

  /**
   * Checks if a similar NFR already exists
   */
  async checkDuplicateNfr(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const { name, qualityAttribute } = req.query;

      if (!name) {
        return res.status(400).json({ error: 'Name parameter is required.' });
      }

      const params: NfrDuplicateCheckParams = {
        projectId: projcod,
        name: name as string,
        qualityAttribute: qualityAttribute as string | undefined
      };

      const isDuplicate = await nfrService.checkDuplicateNfr(params);

      res.status(200).json({ isDuplicate });
    } catch (error) {
      const err = error as Error;
      console.error('Error checking for duplicate NFR:', err.message);
      res.status(500).json({ error: 'Error checking for duplicate NFR.' });
    }
  }

  /**
   * Gets all non-functional requirements (global across all projects)
   */
  async getAllNfrs(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const name = req.query.name as string | undefined;
      const qualityAttribute = req.query.qualityAttribute as string | undefined;
      const status = req.query.status as string | undefined;
      
      // Parse dates if provided
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (req.query.startDate) {
        startDate = new Date(req.query.startDate as string);
      }
      
      if (req.query.endDate) {
        endDate = new Date(req.query.endDate as string);
      }

      const params: NfrGlobalSearchParams = {
        page,
        limit,
        name,
        qualityAttribute,
        status,
        startDate,
        endDate
      };

      const result = await nfrService.searchNfrsGlobal(params);

      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching all NFRs:', err.message);
      res.status(500).json({ error: 'Error fetching all NFRs.' });
    }
  }

  /**
   * Gets frequently used NFRs across projects (potential templates)
   */
  async getFrequentNfrs(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      
      const frequentNfrs = await nfrService.getFrequentNfrs(limit);
      
      res.status(200).json(frequentNfrs);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching frequent NFRs:', err.message);
      res.status(500).json({ error: 'Error fetching frequent NFRs.' });
    }
  }

  /**
   * Gets all non-functional requirements for a project
   */
  async getNfrsByProject(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const nfrs = await nfrService.getNfrs(page, limit, projcod);

      res.status(200).json(nfrs);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching non-functional requirements:', err.message);
      res.status(500).json({ error: 'Error fetching non-functional requirements.' });
    }
  }

  /**
   * Gets a non-functional requirement by code
   */
  async getNfrByCode(req: Request, res: Response) {
    try {
      const { projcod, nfrcod } = req.params;
      const nfr = await nfrService.getNfrByCode(nfrcod);

      if (!nfr) {
        return res.status(404).json({ error: 'Non-functional requirement not found.' });
      }

      // Verify that the NFR belongs to the specified project (only if projcod is provided)
      if (projcod && nfr.projectId !== projcod) {
        return res.status(404).json({ error: 'Non-functional requirement not found in this project.' });
      }

      res.status(200).json(nfr);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching non-functional requirement:', err.message);
      res.status(500).json({ error: 'Error fetching non-functional requirement.' });
    }
  }

  /**
   * Gets NFRs that are derived from a specific source NFR
   */
  async getNfrInstances(req: Request, res: Response) {
    try {
      const { nfrcod } = req.params;
      
      const instances = await nfrService.getNfrInstances(nfrcod);
      
      res.status(200).json(instances);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching NFR instances:', err.message);
      res.status(500).json({ error: 'Error fetching NFR instances.' });
    }
  }

  /**
   * Updates a non-functional requirement
   */
  async updateNfr(req: Request, res: Response) {
    try {
      const { projcod, nfrcod } = req.params;
      const nfrDto: NfrDTO = req.body;

      // Ensure the NFR exists and belongs to this project
      const existingNfr = await nfrService.getNfrByCode(nfrcod);
      if (!existingNfr) {
        return res.status(404).json({ error: 'Non-functional requirement not found.' });
      }

      if (existingNfr.projectId !== projcod) {
        return res.status(404).json({ error: 'Non-functional requirement not found in this project.' });
      }

      // Update with the project ID from the route parameter
      const updatedNfr = await nfrService.updateNfr(nfrcod, {
        ...nfrDto,
        projectId: projcod
      });

      res.status(200).json({
        message: 'Non-functional requirement updated successfully.',
        nfr: updatedNfr,
      });
    } catch (error) {
      const err = error as Error;
      
      // Check for duplicate error
      if (err.message.includes("already exists")) {
        return res.status(409).json({ error: err.message });
      }
      
      console.error('Error updating non-functional requirement:', err.message);
      res.status(500).json({ error: 'Error updating non-functional requirement.' });
    }
  }

  /**
   * Deletes a non-functional requirement
   */
  async deleteNfr(req: Request, res: Response) {
    try {
      const { projcod, nfrcod } = req.params;

      // Ensure the NFR exists and belongs to this project
      const existingNfr = await nfrService.getNfrByCode(nfrcod);
      if (!existingNfr) {
        return res.status(404).json({ error: 'Non-functional requirement not found.' });
      }

      if (existingNfr.projectId !== projcod) {
        return res.status(404).json({ error: 'Non-functional requirement not found in this project.' });
      }

      // Primero eliminar los riesgos asociados al NFR (nuevo)
      try {
        const risks = await riskService.getRisksByEntityAndRegistry('NFR', nfrcod);
        if (risks && risks.length > 0) {
          console.log(`Eliminating ${risks.length} risks associated with NFR ${nfrcod}`);
          for (const risk of risks) {
            await riskService.deleteRisk(risk.id);
          }
        }
      } catch (riskError) {
        console.warn('Non-critical error removing associated risks:', riskError);
        // Continuar con la eliminación del NFR incluso si hay un error con los riesgos
      }

      await nfrService.deleteNfr(existingNfr.id);

      res.status(200).json({
        message: 'Non-functional requirement deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting non-functional requirement:', err.message);
      res.status(500).json({ error: 'Error deleting non-functional requirement.' });
    }
  }

  /**
   * Searches non-functional requirements by name
   */
  async searchNfrs(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const { name } = req.query;

      if (!name) {
        return res.status(400).json({ error: 'Name parameter is required.' });
      }

      const nfrs = await nfrService.searchNfrs(name as string, projcod);

      res.status(200).json(nfrs);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching non-functional requirements:', err.message);
      res.status(500).json({ error: 'Error searching non-functional requirements.' });
    }
  }

  /**
   * Searches non-functional requirements by date
   */
  async searchNfrsByDate(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const { month, year } = req.query;

      if (!month || !year) {
        return res.status(400).json({ error: 'Month and year parameters are required.' });
      }

      const nfrs = await nfrService.searchNfrsByDate(
        parseInt(month as string),
        parseInt(year as string),
        projcod
      );

      res.status(200).json(nfrs);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching non-functional requirements by date:', err.message);
      res.status(500).json({ error: 'Error searching non-functional requirements by date.' });
    }
  }

  /**
   * Searches non-functional requirements by status
   */
  async searchNfrsByStatus(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const { status } = req.query;

      if (!status) {
        return res.status(400).json({ error: 'Status parameter is required.' });
      }

      const nfrs = await nfrService.searchNfrsByStatus(status as string, projcod);

      res.status(200).json(nfrs);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching non-functional requirements by status:', err.message);
      res.status(500).json({ error: 'Error searching non-functional requirements by status.' });
    }
  }

  /**
   * Searches non-functional requirements by quality attribute
   */
  async searchNfrsByQualityAttribute(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const { qualityAttribute } = req.query;

      if (!qualityAttribute) {
        return res.status(400).json({ error: 'Quality attribute parameter is required.' });
      }

      const nfrs = await nfrService.searchNfrsByQualityAttribute(
        qualityAttribute as string, 
        projcod
      );

      res.status(200).json(nfrs);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching non-functional requirements by quality attribute:', err.message);
      res.status(500).json({ error: 'Error searching non-functional requirements by quality attribute.' });
    }
  }

  /**
   * Gets the next unique code
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const { projcod } = req.params;

      const nextCode = await nfrService.getNextCode(projcod);

      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  /**
   * Exports to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      
      // Get NFRs data for the specific project
      const nfrs = await nfrService.getNfrsByProject(projcod);

      // Create a new Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Non-Functional Requirements');

      // Define columns
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Quality Attribute', key: 'qualityAttribute', width: 20 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Modification Date', key: 'modificationDate', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Importance', key: 'importance', width: 15 },
        { header: 'Version', key: 'version', width: 10 },
        { header: 'Comment', key: 'comment', width: 40 },
        { header: 'Source NFR', key: 'sourceNfrCode', width: 15 },
      ];

      // Add rows
      nfrs.forEach(nfr => {
        worksheet.addRow({
          code: nfr.code,
          name: nfr.name,
          qualityAttribute: nfr.qualityAttribute,
          creationDate: nfr.creationDate.toLocaleDateString(),
          modificationDate: nfr.modificationDate ? nfr.modificationDate.toLocaleDateString() : '',
          status: nfr.status,
          importance: nfr.importance,
          version: nfr.version,
          comment: nfr.comment ?? '',
          sourceNfrCode: nfr.sourceNfrCode ?? '',
        });
      });

      // Style the header row
      worksheet.getRow(1).font = { bold: true };

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=non-functional-requirements-${projcod}.xlsx`);

      // Write to response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting to Excel:', err.message);
      res.status(500).json({ error: 'Error exporting to Excel.' });
    }
  }

  /**
   * Exports all NFRs to Excel (global)
   */
  async exportAllToExcel(req: Request, res: Response) {
    try {
      // Get all NFRs
      const nfrs = await nfrService.getNfrs(1, 1000); // Adjust limit as needed
      
      // Create a new Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('All Non-Functional Requirements');

      // Define columns
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Project ID', key: 'projectId', width: 20 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Quality Attribute', key: 'qualityAttribute', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Importance', key: 'importance', width: 15 },
        { header: 'Version', key: 'version', width: 10 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Source NFR', key: 'sourceNfrCode', width: 15 },
      ];

      // Add rows
      nfrs.forEach(nfr => {
        worksheet.addRow({
          code: nfr.code,
          projectId: nfr.projectId,
          name: nfr.name,
          qualityAttribute: nfr.qualityAttribute,
          status: nfr.status,
          importance: nfr.importance,
          version: nfr.version,
          creationDate: nfr.creationDate.toLocaleDateString(),
          sourceNfrCode: nfr.sourceNfrCode ?? '',
        });
      });

      // Style the header row
      worksheet.getRow(1).font = { bold: true };

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=all-non-functional-requirements.xlsx');

      // Write to response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting to Excel:', err.message);
      res.status(500).json({ error: 'Error exporting to Excel.' });
    }
  }

  /**
   * Exports to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      
      // Get NFRs data for the specific project
      const nfrs = await nfrService.getNfrsByProject(projcod);

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=non-functional-requirements-${projcod}.pdf`);

      // Create PDF document
      const doc = new PDFDocument({ margin: 30 });
      doc.pipe(res);

      // Add title
      doc.fontSize(16).text(`Non-Functional Requirements for Project ${projcod}`, { align: 'center' });
      doc.moveDown();

      // Define table headers
      const headers = ['Code', 'Name', 'Quality Attribute', 'Status', 'Importance'];
      // Prepare rows data
      const rows = nfrs.map(nfr => [
        nfr.code,
        nfr.name,
        nfr.qualityAttribute,
        nfr.status,
        nfr.importance
      ]);

      // Draw table
      this.drawTable(doc, headers, rows);

      // Finalize PDF file
      doc.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting to PDF:', err.message);
      res.status(500).json({ error: 'Error exporting to PDF.' });
    }
  }

  /**
   * Helper function to draw tables in PDF
   */
  private drawTable(doc: typeof PDFDocument, headers: string[], rows: any[][]) {
    const rowHeight = 20;
    const colWidth = 100;
    const tableTop = 150;
    const tableLeft = 30;

    // Draw headers
    doc.font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header, tableLeft + (i * colWidth), tableTop);
    });
    
    // Draw rows
    doc.font('Helvetica');
    rows.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        doc.text(cell.toString(), 
          tableLeft + (cellIndex * colWidth), 
          tableTop + ((rowIndex + 1) * rowHeight),
          { width: colWidth - 10 }
        );
      });
    });

    // Draw lines
    doc.moveTo(tableLeft, tableTop - 5)
      .lineTo(tableLeft + (headers.length * colWidth), tableTop - 5)
      .stroke();

    doc.moveTo(tableLeft, tableTop + rowHeight - 5)
      .lineTo(tableLeft + (headers.length * colWidth), tableTop + rowHeight - 5)
      .stroke();
  }
}

// Export singleton instance of the controller
export const nfrController = new NfrController();