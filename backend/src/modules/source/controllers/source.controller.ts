import { Request, Response } from 'express';
import { sourceService } from '../services/source.service';
import { projectService } from '../../projects/services/project.service';
import { SourceDTO } from '../models/source.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class SourceController {

  async createSource(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const sourceDto: SourceDTO = req.body;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      if (!sourceDto.name || sourceDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      const newSource = await sourceService.createSource(project.id, sourceDto);
      res.status(201).json({
        message: 'Source created successfully.',
        source: newSource,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating source:', err.message);
      res.status(500).json({ error: 'Error creating source.' });
    }
  }

  async getSourcesByProject(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      let sources = await sourceService.getSourcesByProject(project.id, page, limit);
                
      // Ordenar por fecha de creación (más antiguos primero)
      sources  = sources .sort((a, b) => {
        const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
        const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
        return dateA - dateB;
      });
      
      res.status(200).json(sources);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching sources:', err.message);
      res.status(500).json({ error: 'Error fetching sources.' });
    }
  }

  async getSourceByCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, srccod } = req.params;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }
      
      const source = await sourceService.getSourceByCode(srccod, project.id);
      
      if (!source) {
        return res.status(404).json({ error: 'Source  not found.' });
      }

      // Verificar que la educción pertenece al proyecto correcto
      if (source.projectId !== project.id) {
        return res.status(404).json({ error: 'Source  not found in this project.' });
      }

      res.status(200).json(source);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching source:', err.message);
      res.status(500).json({ error: 'Error fetching source.' });
    }
  }

  async updateSource(req: Request, res: Response) {
    try {
      const { orgcod, projcod, srccod } = req.params;
      const sourceDto: SourceDTO = req.body;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const existingSource = await sourceService.getSourceByCode(srccod, project.id);
      if (!existingSource ) {
        return res.status(404).json({ error: 'Source not found ' });
      }

     if(existingSource.projectId !== project.id){
        return res.status(404).json({ error: 'Source not found in this project.' });
      }
     

      const updatedSource = await sourceService.updateSource(srccod,project.id, sourceDto);
      res.status(200).json({
        message: 'Source updated successfully.',
        source: updatedSource,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating source:', err.message);
      res.status(500).json({ error: 'Error updating source.' });
    }
  }

  async deleteSource(req: Request, res: Response) {
    try {
      const { orgcod, projcod, srccod } = req.params;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const existingSource = await sourceService.getSourceByCode(srccod, project.id);
      if (!existingSource) {
        return res.status(404).json({ error: 'Source not found.' });
      }
      if (existingSource.projectId !== project.id) {
        return res.status(404).json({ error: 'Source not found in this project.' });
      }

      await sourceService.deleteSource(srccod, project.id);
      res.status(200).json({ 
        message: 'Source deleted successfully.' });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting source:', err.message);
      res.status(500).json({ error: 'Error deleting source.' });
    }
  }

  async searchSourcesByName(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const { name } = req.query;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      if (!name || (name as string).trim() === '') {
        return res.status(400).json({ error: 'Name parameter is required for search.' });
      }

      const sources = await sourceService.searchSourcesByName(project.id, name as string);
      res.status(200).json(sources);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching source:', err.message);
      res.status(500).json({ error: 'Error searching source.' });
    }
  }

  async getNextCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const nextCode = await sourceService.getNextCodePreview(project.id);
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
      const { orgcod, projcod } = req.params;
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      let sources = await sourceService.getSourcesByProject(project.id, 1, 1000);

      // Ordenar por fecha de creación (más antiguos primero)
      sources = sources.sort((a, b) => {
        const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
        const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
        return dateA - dateB;
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Fuentes');

      worksheet.columns = [
        { header: 'Código de la fuente', key: 'code', width: 15 },
        { header: 'Versión', key: 'version', width: 10 },
        { header: 'Nombre', key: 'name', width: 25 },
        { header: 'Autores de la fuente', key: 'sourceAuthors', width: 25 },
        { header: 'Fecha fuente', key: 'sourceDate', width: 15 },
        { header: 'Fecha plantilla', key: 'creationDate', width: 20 },
        { header: 'Estado', key: 'status', width: 15 },
        { header: 'Comentario', key: 'comment', width: 30 },
      ];

      function formatDateOnly(date: Date | string | null | undefined): string {
        if (!date) return 'N/A';
        const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
        const day = String(d.getUTCDate()).padStart(2, '0');
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const year = d.getUTCFullYear();
        return `${day}/${month}/${year}`;
      }
      sources.forEach(src => {
        worksheet.addRow({
          code: src.code,
          name: src.name,
          sourceAuthors: src.sourceAuthors || 'N/A',
          sourceDate: formatDateOnly(src.sourceDate),
          version: src.version,
          creationDate: formatDateOnly(src.creationDate),
          comment: src.comment || 'N/A',
          status: src.status,
        });
      });

      worksheet.getRow(1).font = { bold: true };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=fuentes.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting sources to Excel:', err.message);
      res.status(500).json({ error: 'Error exporting sources to Excel.' });
    }
  }

   /**
     * Searches experts by date
     */
    async searchSourcesByDate(req: Request, res: Response) {
      try {
        const { orgcod, projcod } = req.params;
        const { year, month } = req.query;
  
        // Verificar que el proyecto pertenece a esta organización
        const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
        if (!project) {
          return res.status(404).json({ error: 'Project not found in this organization.' });
        }
  
        // Validar que al menos uno esté presente
        if (!year && !month) {
          return res.status(400).json({ error: 'You must provide at least year or month' });
        }
        if (year && !/^[0-9]{4}$/.test(year as string)) {
          return res.status(400).json({ error: 'Invalid year format' });
        }
        if (month && (parseInt(month as string) < 1 || parseInt(month as string) > 12)) {
          return res.status(400).json({ error: 'Month must be between 1 and 12' });
        }
  
        // Buscar expertos por fecha
        const sources = await sourceService.searchSourcesByDate(project.id, year as string, month as string);
        res.status(200).json(sources);
      } catch (error) {
        console.error('Error searching sources by date:', error);
        res.status(500).json({ error: 'Error searching sources' });
      }
    }

  /**
   * Exports to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      let sources = await sourceService.getSourcesByProject(project.id, 1, 1000);

      // Ordenar por fecha de creación (más antiguos primero)
      sources = sources.sort((a, b) => {
        const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
        const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
        return dateA - dateB;
      });

      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        bufferPages: true
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=fuentes-${projcod}.pdf`);
      doc.pipe(res);

      doc.fontSize(18).text('Reporte de Fuentes', { align: 'center' });
      doc.fontSize(16).text(`${project.name}`, { align: 'center' });
      doc.fontSize(10).text(`Generado: ${new Date().toLocaleString('es-ES')}`, { align: 'center' });
      doc.moveDown(2);

      if (sources.length === 0) {
        doc.fontSize(12).text('No hay fuentes registradas para este proyecto.', { align: 'center' });
      } else {
        sources.forEach((src, index) => {
          if (index > 0) doc.addPage();

          doc.fontSize(14).font('Helvetica-Bold').text(`Fuente: ${src.code}`, { underline: true });
          doc.moveDown(1);
          doc.font('Helvetica');

          const pageWidth = doc.page.width - 100;
          const colWidth1 = 150;
          const colWidth2 = pageWidth - colWidth1;
          let y = doc.y;

          const addTableRow = (attribute: string, value: string): number => {
            const textOptions = { width: colWidth2 - 10 };
            const valueHeight = doc.heightOfString(value || 'N/A', textOptions);
            const attributeHeight = doc.heightOfString(attribute, { width: colWidth1 - 10 });
            const rowHeight = Math.max(25, valueHeight + 14, attributeHeight + 14);

            doc.rect(50, y, colWidth1, rowHeight).stroke();
            doc.rect(50 + colWidth1, y, colWidth2, rowHeight).stroke();

            doc.fontSize(10);
            doc.text(attribute, 55, y + 7, { width: colWidth1 - 10 });
            doc.text(value || 'N/A', 55 + colWidth1, y + 7, textOptions);

            return y + rowHeight;
          };

          doc.fontSize(12).font('Helvetica-Bold');
          doc.rect(50, y, colWidth1, 25).stroke();
          doc.rect(50 + colWidth1, y, colWidth2, 25).stroke();
          doc.text('Atributo', 55, y + 7, { width: colWidth1 - 10 });
          doc.text('Descripción', 55 + colWidth1, y + 7, { width: colWidth2 - 10 });
          y += 25;


          function formatDateOnly(date: Date | string | null | undefined): string {
            if (!date) return 'N/A';
            const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
            const day = String(d.getUTCDate()).padStart(2, '0');
            const month = String(d.getUTCMonth() + 1).padStart(2, '0');
            const year = d.getUTCFullYear();
            return `${day}/${month}/${year}`;
          }
          doc.font('Helvetica');
          y = addTableRow('Código de la fuente', src.code);
          y = addTableRow('Versión', src.version);
          y = addTableRow('Nombre', src.name);
          y = addTableRow('Autores de la fuente', src.sourceAuthors || 'N/A');
          y = addTableRow('Fecha fuente', formatDateOnly(src.sourceDate));
          y = addTableRow('Fecha plantilla', formatDateOnly(src.creationDate)),
          y = addTableRow('Estado', src.status);
          y = addTableRow('Comentario', src.comment || 'N/A');
        });
      }

      const pages = doc.bufferedPageRange();
      const totalPages = pages.count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fontSize(10);
        doc.text(
          `${i + 1}/${totalPages}`,
          doc.page.width - 50,
          30,
          { align: 'right' }
        );
      }

      doc.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting sources to PDF:', err.message);
      res.status(500).json({ error: 'Error exporting sources to PDF.' });
    }
  }


}

export const sourceController = new SourceController();
