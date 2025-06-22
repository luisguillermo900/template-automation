// risk/controllers/risk.controller.ts

import { Request, Response } from 'express';
import { riskService } from '../services/risk.service';
import { nfrService } from '../../nfr/services/nfr.service'; // Mantener referencia para compatibilidad
import { 
  RiskDTO, 
  RiskDuplicateCheckParams, 
  RiskGlobalSearchParams
} from '../models/risk.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class RiskController {
  /**
   * Creates a new risk
   */
  async createRisk(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const riskDto: RiskDTO = req.body;

      if (!riskDto.entityType || riskDto.entityType.trim() === '') {
        return res.status(400).json({ error: 'Entity type is required.' });
      }

      if (!riskDto.registryCode || riskDto.registryCode.trim() === '') {
        return res.status(400).json({ error: 'Registry code is required.' });
      }

      if (!riskDto.description || riskDto.description.trim() === '') {
        return res.status(400).json({ error: 'Description is required.' });
      }

      if (!riskDto.impact || riskDto.impact.trim() === '') {
        return res.status(400).json({ error: 'Impact is required.' });
      }

      if (!riskDto.probability || riskDto.probability.trim() === '') {
        return res.status(400).json({ error: 'Probability is required.' });
      }

      if (!riskDto.status || riskDto.status.trim() === '') {
        return res.status(400).json({ error: 'Status is required.' });
      }

      // The project ID comes from the route parameter
      const newRisk = await riskService.createRisk({
        ...riskDto,
        projectId: projcod
      });

      res.status(201).json({
        message: 'Risk created successfully.',
        risk: newRisk,
      });
    } catch (error) {
      const err = error as Error;
      
      // Check for duplicate error
      if (err.message.includes("already exists")) {
        return res.status(409).json({ error: err.message });
      }
      
      console.error('Error creating risk:', err.message);
      res.status(500).json({ error: 'Error creating risk.' });
    }
  }

  /**
   * Creates a new risk specifically for an NFR
   */
  async createRiskForNfr(req: Request, res: Response) {
    try {
      const { projcod, nfrcod } = req.params;
      const riskDto: RiskDTO = req.body;

      // Verify the NFR exists and belongs to this project
      const nfr = await nfrService.getNfrByCode(nfrcod);
      if (!nfr) {
        return res.status(404).json({ error: 'Non-functional requirement not found.' });
      }

      if (nfr.projectId !== projcod) {
        return res.status(404).json({ error: 'Non-functional requirement not found in this project.' });
      }

      if (!riskDto.description || riskDto.description.trim() === '') {
        return res.status(400).json({ error: 'Description is required.' });
      }

      if (!riskDto.impact || riskDto.impact.trim() === '') {
        return res.status(400).json({ error: 'Impact is required.' });
      }

      if (!riskDto.probability || riskDto.probability.trim() === '') {
        return res.status(400).json({ error: 'Probability is required.' });
      }

      if (!riskDto.status || riskDto.status.trim() === '') {
        return res.status(400).json({ error: 'Status is required.' });
      }

      // Create the risk with entityType and registryCode pre-filled
      const newRisk = await riskService.createRisk({
        ...riskDto,
        projectId: projcod,
        entityType: 'NFR',
        registryCode: nfrcod
      });

      res.status(201).json({
        message: 'Risk created successfully.',
        risk: newRisk,
      });
    } catch (error) {
      const err = error as Error;
      
      // Check for duplicate error
      if (err.message.includes("already exists")) {
        return res.status(409).json({ error: err.message });
      }
      
      console.error('Error creating risk:', err.message);
      res.status(500).json({ error: 'Error creating risk.' });
    }
  }

  /**
   * Creates a new risk based on an existing one
   */
  async createRiskFromExisting(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const { 
        sourceRiskCode, 
        targetEntityType, 
        targetRegistryCode, 
        customizations 
      } = req.body;

      if (!sourceRiskCode) {
        return res.status(400).json({ error: 'Source risk code is required.' });
      }

      // If we're creating for a specific entity
      if (targetEntityType && !targetRegistryCode) {
        return res.status(400).json({ error: 'Target registry code is required when target entity type is provided.' });
      }

      const newRisk = await riskService.createRiskFromExisting(
        sourceRiskCode,
        projcod,
        targetEntityType,
        targetRegistryCode,
        customizations
      );

      res.status(201).json({
        message: 'Risk created from existing risk successfully.',
        risk: newRisk,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating risk from existing:', err.message);
      res.status(500).json({ error: 'Error creating risk from existing: ' + err.message });
    }
  }

  /**
   * Checks if a similar risk already exists
   */
  async checkDuplicateRisk(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const { entityType, registryCode, description } = req.query;

      if (!entityType || !registryCode || !description) {
        return res.status(400).json({ error: 'Entity type, registry code, and description parameters are required.' });
      }

      const params: RiskDuplicateCheckParams = {
        projectId: projcod,
        entityType: entityType as string,
        registryCode: registryCode as string,
        description: description as string
      };

      const isDuplicate = await riskService.checkDuplicateRisk(params);

      res.status(200).json({ isDuplicate });
    } catch (error) {
      const err = error as Error;
      console.error('Error checking for duplicate risk:', err.message);
      res.status(500).json({ error: 'Error checking for duplicate risk.' });
    }
  }

  /**
   * Gets all risks (global across all projects)
   */
  async getAllRisks(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const description = req.query.description as string | undefined;
      const impact = req.query.impact as string | undefined;
      const probability = req.query.probability as string | undefined;
      const status = req.query.status as string | undefined;
      const entityType = req.query.entityType as string | undefined;
      
      // Parse dates if provided
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (req.query.startDate) {
        startDate = new Date(req.query.startDate as string);
      }
      
      if (req.query.endDate) {
        endDate = new Date(req.query.endDate as string);
      }

      const params: RiskGlobalSearchParams = {
        page,
        limit,
        description,
        impact,
        probability,
        status,
        entityType,
        startDate,
        endDate
      };

      const result = await riskService.searchRisksGlobal(params);

      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching all risks:', err.message);
      res.status(500).json({ error: 'Error fetching all risks.' });
    }
  }

  /**
   * Gets similar risks based on description
   */
  async getSimilarRisks(req: Request, res: Response) {
    try {
      const { description } = req.query;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!description) {
        return res.status(400).json({ error: 'Description parameter is required.' });
      }

      const similarRisks = await riskService.getSimilarRisks(description as string, limit);

      res.status(200).json(similarRisks);
    } catch (error) {
      const err = error as Error;
      console.error('Error finding similar risks:', err.message);
      res.status(500).json({ error: 'Error finding similar risks.' });
    }
  }

  /**
   * Gets frequently used risks across projects
   */
  async getFrequentRisks(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      
      const frequentRisks = await riskService.getFrequentRisks(limit);
      
      res.status(200).json(frequentRisks);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching frequent risks:', err.message);
      res.status(500).json({ error: 'Error fetching frequent risks.' });
    }
  }

  /**
   * Gets all risks for a project
   */
  async getRisksByProject(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const risks = await riskService.getRisks(page, limit, projcod);

      res.status(200).json(risks);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching risks by project:', err.message);
      res.status(500).json({ error: 'Error fetching risks by project.' });
    }
  }

  /**
   * Gets risks for a specific NFR
   */
  async getRisksByNfr(req: Request, res: Response) {
    try {
      const { projcod, nfrcod } = req.params;

      // Verify the NFR exists and belongs to this project
      const nfr = await nfrService.getNfrByCode(nfrcod);
      if (!nfr) {
        return res.status(404).json({ error: 'Non-functional requirement not found.' });
      }

      if (nfr.projectId !== projcod) {
        return res.status(404).json({ error: 'Non-functional requirement not found in this project.' });
      }

      const risks = await riskService.getRisksByEntityAndRegistry('NFR', nfrcod);

      res.status(200).json(risks);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching risks:', err.message);
      res.status(500).json({ error: 'Error fetching risks.' });
    }
  }

  /**
   * Gets risks for any entity and registry
   */
  async getRisksByEntityAndRegistry(req: Request, res: Response) {
    try {
      const { entityType, registryCode } = req.params;

      const risks = await riskService.getRisksByEntityAndRegistry(entityType, registryCode);

      res.status(200).json(risks);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching risks by entity and registry:', err.message);
      res.status(500).json({ error: 'Error fetching risks by entity and registry.' });
    }
  }

  /**
   * Gets a risk by code
   */
  async getRiskByCode(req: Request, res: Response) {
    try {
      const { projcod, riskcod } = req.params;
      const risk = await riskService.getRiskByCode(riskcod);

      if (!risk) {
        return res.status(404).json({ error: 'Risk not found.' });
      }

      // Verify that the risk belongs to the specified project (only if projcod is provided)
      if (projcod && risk.projectId !== projcod) {
        return res.status(404).json({ error: 'Risk not found in this project.' });
      }

      res.status(200).json(risk);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching risk:', err.message);
      res.status(500).json({ error: 'Error fetching risk.' });
    }
  }

  /**
   * Updates a risk
   */
  async updateRisk(req: Request, res: Response) {
    try {
      const { projcod, riskcod } = req.params;
      const riskDto: RiskDTO = req.body;

      // Ensure the risk exists and belongs to this project
      const existingRisk = await riskService.getRiskByCode(riskcod);
      if (!existingRisk) {
        return res.status(404).json({ error: 'Risk not found.' });
      }

      if (existingRisk.projectId !== projcod) {
        return res.status(404).json({ error: 'Risk not found in this project.' });
      }

      // Update with the project ID from the route parameter
      const updatedRisk = await riskService.updateRisk(riskcod, {
        ...riskDto,
        projectId: projcod
      });

      res.status(200).json({
        message: 'Risk updated successfully.',
        risk: updatedRisk,
      });
    } catch (error) {
      const err = error as Error;
      
      // Check for duplicate error
      if (err.message.includes("already exists")) {
        return res.status(409).json({ error: err.message });
      }
      
      console.error('Error updating risk:', err.message);
      res.status(500).json({ error: 'Error updating risk.' });
    }
  }

  /**
   * Deletes a risk
   */
  async deleteRisk(req: Request, res: Response) {
    try {
      const { projcod, riskcod } = req.params;

      // Ensure the risk exists and belongs to this project
      const existingRisk = await riskService.getRiskByCode(riskcod);
      if (!existingRisk) {
        return res.status(404).json({ error: 'Risk not found.' });
      }

      if (existingRisk.projectId !== projcod) {
        return res.status(404).json({ error: 'Risk not found in this project.' });
      }

      await riskService.deleteRisk(existingRisk.id);

      res.status(200).json({
        message: 'Risk deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting risk:', err.message);
      res.status(500).json({ error: 'Error deleting risk.' });
    }
  }

  /**
   * Searches risks by status
   */
  async searchRisksByStatus(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const { status } = req.query;

      if (!status) {
        return res.status(400).json({ error: 'Status parameter is required.' });
      }

      const risks = await riskService.searchRisksByStatus(
        status as string,
        projcod
      );

      res.status(200).json(risks);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching risks by status:', err.message);
      res.status(500).json({ error: 'Error searching risks by status.' });
    }
  }

  /**
   * Searches risks by date
   */
  async searchRisksByDate(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const { month, year } = req.query;

      if (!month || !year) {
        return res.status(400).json({ error: 'Month and year parameters are required.' });
      }

      const risks = await riskService.searchRisksByDate(
        parseInt(month as string),
        parseInt(year as string),
        projcod
      );

      res.status(200).json(risks);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching risks by date:', err.message);
      res.status(500).json({ error: 'Error searching risks by date.' });
    }
  }

  /**
   * Gets the next risk code
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const { projcod } = req.params;

      const nextCode = await riskService.getNextCode(projcod);

      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  /**
   * Exports risks to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const { entityType, registryCode } = req.query;
      
      // Get risks data based on filters
      let risks;
      if (entityType && registryCode) {
        risks = await riskService.getRisksByEntityAndRegistry(
          entityType as string, 
          registryCode as string
        );
        // Filter by project as well
        risks = risks.filter(risk => risk.projectId === projcod);
      } else {
        risks = await riskService.getRisksByProject(projcod);
      }

      // Create a new Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Risks');

      // Define columns
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Entity Type', key: 'entityType', width: 15 },
        { header: 'Registry Code', key: 'registryCode', width: 15 },
        { header: 'Impact', key: 'impact', width: 15 },
        { header: 'Probability', key: 'probability', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Comments', key: 'comments', width: 40 },
        { header: 'Source Risk', key: 'sourceRiskCode', width: 15 },
      ];

      // Add rows
      risks.forEach(risk => {
        worksheet.addRow({
          code: risk.code,
          description: risk.description,
          entityType: risk.entityType,
          registryCode: risk.registryCode,
          impact: risk.impact,
          probability: risk.probability,
          status: risk.status,
          creationDate: risk.creationDate.toLocaleDateString(),
          comments: risk.comments ?? '',
          sourceRiskCode: risk.sourceRiskCode ?? '',
        });
      });

      // Style the header row
      worksheet.getRow(1).font = { bold: true };

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=risks-${projcod}.xlsx`);

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
   * Exports all risks to Excel (global)
   */
  async exportAllToExcel(req: Request, res: Response) {
    try {
      // Get all risks
      const risks = await riskService.getRisks(1, 1000); // Adjust limit as needed
      
      // Create a new Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('All Risks');

      // Define columns
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Project ID', key: 'projectId', width: 20 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Entity Type', key: 'entityType', width: 15 },
        { header: 'Registry Code', key: 'registryCode', width: 15 },
        { header: 'Impact', key: 'impact', width: 15 },
        { header: 'Probability', key: 'probability', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Source Risk', key: 'sourceRiskCode', width: 15 },
      ];

      // Add rows
      risks.forEach(risk => {
        worksheet.addRow({
          code: risk.code,
          projectId: risk.projectId,
          description: risk.description,
          entityType: risk.entityType,
          registryCode: risk.registryCode,
          impact: risk.impact,
          probability: risk.probability,
          status: risk.status,
          creationDate: risk.creationDate.toLocaleDateString(),
          sourceRiskCode: risk.sourceRiskCode ?? '',
        });
      });

      // Style the header row
      worksheet.getRow(1).font = { bold: true };

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=all-risks.xlsx');

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
   * Exports risks to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    try {
      const { projcod } = req.params;
      const { entityType, registryCode } = req.query;
      
      // Get risks data based on filters
      let risks;
      let title = `Risks for Project ${projcod}`;
      
      if (entityType && registryCode) {
        risks = await riskService.getRisksByEntityAndRegistry(
          entityType as string, 
          registryCode as string
        );
        // Filter by project as well
        risks = risks.filter(risk => risk.projectId === projcod);
        const entityTypeStr = typeof entityType === 'string' ? entityType : JSON.stringify(entityType);
        const registryCodeStr = typeof registryCode === 'string' ? registryCode : JSON.stringify(registryCode);
        title = `Risks for ${entityTypeStr}:${registryCodeStr} in Project ${projcod}`;
      } else {
        risks = await riskService.getRisksByProject(projcod);
      }

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=risks-${projcod}.pdf`);

      // Create PDF document
      const doc = new PDFDocument({ margin: 30 });
      doc.pipe(res);

      // Add title
      doc.fontSize(16).text(title, { align: 'center' });
      doc.moveDown();

      // Define table headers
      const headers = ['Code', 'Description', 'Impact', 'Probability', 'Status'];
      
      // Prepare rows data
      const rows = risks.map(risk => [
        risk.code,
        risk.description,
        risk.impact,
        risk.probability,
        risk.status
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
export const riskController = new RiskController();