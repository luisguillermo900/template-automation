import { Request, Response } from 'express';
import { organizationService } from '../services/organization.service';
import { OrganizationDTO, OrganizationResponse } from '../models/organization.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class OrganizationController {
  /**
   * Creates a new organization
   */
  async createOrganization(req: Request, res: Response) {
    try {
      const organizationDto: OrganizationDTO = req.body;

      if (!organizationDto.name || organizationDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      const newOrganization = await organizationService.createOrganization(organizationDto);

      res.status(201).json({
        message: 'Organization created successfully.',
        organization: newOrganization,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating organization:', err.message);
      res.status(500).json({ error: 'Error creating organization.' });
    }
  }

  /**
   * Gets all organizations
   */
  async getOrganizations(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const organizations = await organizationService.getOrganizations(page, limit);

      res.status(200).json(organizations);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching organizations:', err.message);
      res.status(500).json({ error: 'Error fetching organizations.' });
    }
  }

  /**
   * Gets an organization by code
   */
  async getOrganizationByCode(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const organization = await organizationService.getOrganizationByCode(code);

      if (!organization) {
        return res.status(404).json({ error: 'Organization not found.' });
      }

      res.status(200).json(organization);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching organization:', err.message);
      res.status(500).json({ error: 'Error fetching organization.' });
    }
  }

  /**
   * Gets projects for an organization
   */
  async getProjectsByOrganization(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const organizationWithProjects = await organizationService.getOrganizationWithProjects(code);

      if (!organizationWithProjects) {
        return res.status(404).json({ error: 'Organization not found.' });
      }

      res.status(200).json(organizationWithProjects.projects);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching projects:', err.message);
      res.status(500).json({ error: 'Error fetching projects.' });
    }
  }

  /**
   * Updates an organization
   */
  async updateOrganization(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const organizationDto: OrganizationDTO = req.body;

      const updatedOrganization = await organizationService.updateOrganization(code, organizationDto);

      res.status(200).json({
        message: 'Organization updated successfully.',
        organization: updatedOrganization,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating organization:', err.message);
      res.status(500).json({ error: 'Error updating organization.' });
    }
  }

  /**
   * Deletes an organization
   */
  async deleteOrganization(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await organizationService.deleteOrganization(id);

      res.status(200).json({
        message: 'Organization deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting organization:', err.message);
      res.status(500).json({ error: 'Error deleting organization.' });
    }
  }

  /**
   * Searches organizations by name
   */
  async searchOrganizations(req: Request, res: Response) {
    try {
      const { name } = req.query;

      if (!name) {
        return res.status(400).json({ error: 'Name parameter is required.' });
      }

      const organizations = await organizationService.searchOrganizations(name as string);

      res.status(200).json(organizations);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching organizations:', err.message);
      res.status(500).json({ error: 'Error searching organizations.' });
    }
  }

  /**
   * Searches organizations by date
   */
  async searchOrganizationsByDate(req: Request, res: Response) {
    try {
      const { month, year } = req.query;

      if (!month || !year) {
        return res.status(400).json({ error: 'Month and year parameters are required.' });
      }

      const organizations = await organizationService.searchOrganizationsByDate(
        parseInt(month as string),
        parseInt(year as string)
      );

      res.status(200).json(organizations);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching organizations by date:', err.message);
      res.status(500).json({ error: 'Error searching organizations by date.' });
    }
  }

  /**
   * Gets the next unique code without incrementing the counter
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const nextCode = await organizationService.getNextCodePreview();

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
  /**
 * Exports to Excel (Exporta a Excel)
 */
  async exportToExcel(req: Request, res: Response) {
    try {
      // Obtener todas las organizaciones (excluyendo ORG-MAIN para consistencia con PDF)
      const allOrganizations = await organizationService.getOrganizations(1, 1000);

      // Filtrar para excluir la organización ORG-MAIN y ordenar por fecha de creación
      const organizations = allOrganizations
        .filter((org: OrganizationResponse) => org.code !== 'ORG-MAIN')
        .sort((a: OrganizationResponse, b: OrganizationResponse) => {
          // Ordenar por fecha igual que en el PDF
          const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
          const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
          return dateA - dateB;
        });

      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Organizaciones');

      // Añadir encabezados en español
      worksheet.columns = [
        { header: 'Código', key: 'code', width: 15 },
        { header: 'Nombre', key: 'name', width: 30 },
        { header: 'Versión', key: 'version', width: 10 },
        { header: 'Estado', key: 'status', width: 15 },
        { header: 'Teléfono', key: 'phone', width: 15 },
        { header: 'Dirección', key: 'address', width: 30 },
        { header: 'Fecha Creación', key: 'creationDate', width: 20 },
        { header: 'Fecha Modificación', key: 'modificationDate', width: 20 }
      ];

      // Estilizar los encabezados
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // Añadir filas
      organizations.forEach((org: OrganizationResponse) => {
        worksheet.addRow({
          code: org.code,
          name: org.name,
          version: org.version,
          status: org.status || 'N/A',
          phone: org.phone || 'N/A',
          address: org.address || 'N/A',
          creationDate: org.creationDate
            ? new Date(org.creationDate).toLocaleDateString('es-ES')
            : 'N/A',
          modificationDate: org.modificationDate
            ? new Date(org.modificationDate).toLocaleDateString('es-ES')
            : 'N/A'
        });
      });

      // Establecer el tipo de contenido y disposición
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=organizaciones.xlsx');

      // Enviar el libro de trabajo
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error al exportar a Excel:', err.message);
      res.status(500).json({ error: 'Error al exportar a Excel.' });
    }
  }

  /**
   * Exporta a PDF
   */
  async exportToPDF(req: Request, res: Response) {
    try {
      // Obtener todas las organizaciones
      const allOrganizations = await organizationService.getOrganizations(1, 1000);

      // Filtrar para excluir la organización ORG-MAIN y ordenar por fecha de creación (más antiguas primero)
      const organizations = allOrganizations
        .filter((org: OrganizationResponse) => org.code !== 'ORG-MAIN')
        .sort((a: OrganizationResponse, b: OrganizationResponse) => {
          // Convertir fechas a objetos Date para comparación
          const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
          const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
          // Ordenar ascendente (de más antiguo a más reciente)
          return dateA - dateB;
        });

      // Crear un nuevo documento PDF con la opción bufferPages para permitir modificaciones posteriores
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
        layout: 'landscape',
        autoFirstPage: true,
        bufferPages: true  // Importante: permite modificar páginas después de crearlas
      });

      // Configurar cabeceras de respuesta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=organizaciones.pdf');

      // Enviar el PDF a la respuesta
      doc.pipe(res);

      // Traducir encabezados de tabla
      const headers = ['Código', 'Nombre', 'Versión', 'Estado', 'Teléfono', 'Dirección', 'Fecha Creación'];

      // Mapear datos de organizaciones (excluyendo ORG-MAIN)
      const rows = organizations.map((org: OrganizationResponse) => [
        org.code || 'N/A',
        org.name || 'N/A',
        org.version || 'N/A',
        org.status || 'N/A',
        org.phone || 'N/A',
        org.address || 'N/A',
        org.creationDate ? new Date(org.creationDate).toLocaleDateString('es-ES') : 'N/A'
      ]);

      // Añadir título y fecha
      doc.fontSize(18).text('Reporte de Organizaciones', { align: 'center' });
      doc.fontSize(10).text(`Generado: ${new Date().toLocaleString('es-ES')}`, { align: 'center' });
      doc.moveDown(2);

      // Dibujar la tabla con manejo mejorado de desbordamiento de texto
      this.drawTableImproved(doc, headers, rows);

      // Obtener todas las páginas del documento
      const pages = doc.bufferedPageRange();
      const totalPages = pages.count;

      // Añadir número de página en la esquina superior derecha de cada página
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fontSize(10);
        doc.text(
          `${i + 1}/${totalPages}`,
          doc.page.width - 50, // X: cerca del borde derecho
          30, // Y: cerca del borde superior
          { align: 'right' }
        );
      }

      // Finalizar el PDF y terminar la respuesta
      doc.end();

    } catch (error) {
      const err = error as Error;
      console.error('Error al exportar a PDF:', err.message);
      res.status(500).json({ error: 'Error al exportar a PDF.' });
    }
  }

  /**
   * Improved table drawing function with text wrapping, dynamic row heights and complete grid
   */
  private drawTableImproved(doc: PDFKit.PDFDocument, headers: string[], rows: any[][]) {
    const pageWidth = doc.page.width - 60; // Account for margins
    const columnWidths = this.calculateColumnWidths(headers, rows, pageWidth);
    const margin = 30;
    let y = doc.y;

    // Draw top border of the table
    doc.moveTo(margin, y).lineTo(margin + pageWidth, y).stroke();

    // Draw headers
    doc.font('Helvetica-Bold').fontSize(10);
    let x = margin;

    headers.forEach((header, i) => {
      doc.text(header, x, y + 5, {
        width: columnWidths[i],
        align: 'center'
      });
      x += columnWidths[i];
    });

    // Draw header line
    y += 20;
    doc.moveTo(margin, y).lineTo(margin + pageWidth, y).stroke();

    // Save the starting y position for vertical lines
    const tableStartY = y - 20;
    let tableEndY = y;

    y += 5;

    // Draw rows with dynamic heights
    doc.font('Helvetica').fontSize(9);

    // Keep track of column positions for vertical lines
    const columnPositions = [margin];
    let accumulatedWidth = margin;
    for (const width of columnWidths) {
      accumulatedWidth += width;
      columnPositions.push(accumulatedWidth);
    }

    rows.forEach((row) => {
      // Calculate row height based on content
      const rowHeight = this.calculateRowHeight(doc, row, columnWidths);

      // Check if we need a new page
      if (y + rowHeight > doc.page.height - 50) {
        // Draw vertical lines for the current page before adding a new page
        for (let i = 0; i < columnPositions.length; i++) {
          doc.moveTo(columnPositions[i], tableStartY)
            .lineTo(columnPositions[i], tableEndY)
            .stroke();
        }

        doc.addPage();
        y = 50;

        // Draw top border for the continuing table
        doc.moveTo(margin, y).lineTo(margin + pageWidth, y).stroke();

        // Reset table measurements for the new page
        tableEndY = y;
      }

      // Draw cells with wrapped text
      x = margin;

      row.forEach((cell, i) => {
        const cellText = cell ? String(cell) : 'N/A';
        const cellOptions = {
          width: columnWidths[i],
          align: 'left' as const,
          lineBreak: true
        };

        // Draw cell text
        doc.text(cellText, x + 3, y + 3, cellOptions); // Add small padding

        // Move to next column
        x += columnWidths[i];
      });

      // Move to next row and draw divider
      y += rowHeight + 5;
      doc.moveTo(margin, y).lineTo(margin + pageWidth, y).stroke();

      // Update the end position of the table
      tableEndY = y;
    });

    // Draw all vertical lines after all rows are drawn
    for (let i = 0; i < columnPositions.length; i++) {
      doc.moveTo(columnPositions[i], tableStartY)
        .lineTo(columnPositions[i], tableEndY)
        .stroke();
    }
  }

  /**
   * Calculate dynamic row height based on content
   */
  private calculateRowHeight(doc: PDFKit.PDFDocument, row: any[], columnWidths: number[]): number {
    let maxHeight = 20; // Aumentar altura mínima

    row.forEach((cell, i) => {
      if (!cell) return;

      const cellText = String(cell);
      // Usar heightOfString en lugar de la estimación manual
      const cellHeight = doc.heightOfString(cellText, {
        width: columnWidths[i] - 6, // Restar padding horizontal
        lineBreak: true
      });

      // Añadir padding vertical explícito (6 puntos arriba y abajo)
      const totalHeight = cellHeight + 12;

      maxHeight = Math.max(maxHeight, totalHeight);
    });

    return maxHeight;
  }

  /**
   * Calculate optimal column widths based on content
   */
  private calculateColumnWidths(headers: string[], rows: any[][], totalWidth: number): number[] {
    // Define column width ratios based on typical content
    const widthRatios = [0.1, 0.25, 0.1, 0.1, 0.15, 0.2, 0.1];

    return widthRatios.map(ratio => totalWidth * ratio);
  }

  /**
   * Gets the main organization of the system
   */
  async getMainOrganization(req: Request, res: Response) {
    try {
      const mainOrgCode = 'ORG-MAIN';
      const mainOrg = await organizationService.getOrganizationByCode(mainOrgCode);

      if (!mainOrg) {
        return res.status(404).json({ error: 'Main organization not found.' });
      }

      res.status(200).json(mainOrg);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching main organization:', err.message);
      res.status(500).json({ error: 'Error fetching main organization.' });
    }
  }
}

// Export singleton instance of the controller
export const organizationController = new OrganizationController();