import { Request, Response } from 'express';
import { expertService } from '../services/expert.service';
import { projectService } from '../../projects/services/project.service';
import { ExpertDTO } from '../models/expert.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class ExpertController {

  async createExpert(req: Request, res: Response) {

    try {
          const { orgcod, projcod } = req.params;
          const expertDto: ExpertDTO = req.body;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          if (!expertDto.firstName || expertDto.firstName.trim() === '') {
            return res.status(400).json({ error: 'firstName is required.' });
          }
    
          const newExpert = await expertService.createExpert(project.id, expertDto);
    
          res.status(201).json({
            message: 'Expert created successfully.',
            Experto: newExpert,
          });
        } catch (error) {
          const err = error as Error;
          console.error('Error completo:', err);
          return res.status(500).json({ error: `Error creating expert: ${err.message}` });
        }
      
  }

  async getExpertsByProject(req: Request, res: Response) {

    try {
          const { orgcod, projcod } = req.params;
          const page = req.query.page ? parseInt(req.query.page as string) : 1;
          const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          // CAMBIO AQUÍ: Usar project.id (UUID) en lugar de projcod
          let expertos = await expertService.getExpertsByProject(project.id, page, limit);
          
          // Ordenar por fecha de creación (más antiguos primero)
          expertos = expertos.sort((a, b) => {
          const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
          const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
          return dateA - dateB;
      });

          res.status(200).json(expertos);
        } catch (error) {
          const err = error as Error;
          console.error('Error fetching expertos:', err.message);
          res.status(500).json({ error: 'Error fetching expertos.' });
        }
  }

  async getExpertByCode(req: Request, res: Response) {

    try {
          const { orgcod, projcod, expcod } = req.params;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          const experto = await expertService.getExpertByCode(expcod, project.id);
    
          if (!experto) {
            return res.status(404).json({ error: 'Experto not found.' });
          }
    
          // Verificar que el experto pertenece al proyecto correcto
          if (experto.projectId !== project.id) {
            return res.status(404).json({ error: 'Experto not found in this project.' });
          }
    
          res.status(200).json(experto);
        } catch (error) {
          const err = error as Error;
          console.error('Error fetching experto:', err.message);
          res.status(500).json({ error: 'Error fetching experto.' });
        }
  }

  async updateExpert(req: Request, res: Response) {

    try {
          const { orgcod, projcod, expcod } = req.params;
          const expertDto: ExpertDTO = req.body;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          // Verificar que el experto existe y pertenece a este proyecto
          const existingExperto = await expertService.getExpertByCode(expcod, project.id);
    
          if (!existingExperto) {
            return res.status(404).json({ error: 'Experto not found.' });
          }
    
          if (existingExperto.projectId !== project.id) {
            return res.status(404).json({ error: 'Experto not found in this project.' });
          }
    
          const updatedExpert = await expertService.updateExpert(expcod, project.id,expertDto);
    
          res.status(200).json({
            message: 'Experto updated successfully.',
            educcion: updatedExpert,
          });
        } catch (error) {
          const err = error as Error;
          console.error('Error updating experto:', err.message);
          res.status(500).json({ error: 'Error updating experto.' });
        }

  }

  async deleteExpert(req: Request, res: Response) {
    try {
          const { orgcod, projcod, expcod } = req.params;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          // Verificar que el experto existe y pertenece a este proyecto
          const existingExpert = await expertService.getExpertByCode(expcod, project.id);
    
          if (!existingExpert) {
            return res.status(404).json({ error: 'Experto not found.' });
          }
    
          if (existingExpert.projectId !== project.id) {
            return res.status(404).json({ error: 'Experto not found in this project.' });
          }
    
          // CAMBIO AQUÍ: Pasar también el project.id para identificar al experto correcta
          await expertService.deleteExpert(expcod, project.id);
    
          res.status(200).json({
            message: 'Experto deleted successfully.',
          });
        } catch (error) {
          const err = error as Error;
          console.error('Error deleting experto:', err.message);
          res.status(500).json({ error: 'Error deleting experto.' });
        }
  }

  async searchExpertsByName(req: Request, res: Response) {
    try {
          const { orgcod, projcod } = req.params;
          const { firstName } = req.query;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          if (!firstName || (firstName as string).trim() === '') {
            return res.status(400).json({ error: 'firstName parameter is required for search.' });
          }
    
          const expertos = await expertService.searchExpertsByName(project.id, firstName as string);
    
          res.status(200).json(expertos);
        } catch (error) {
          const err = error as Error;
          console.error('Error searching experto:', err.message);
          res.status(500).json({ error: 'Error searching experto.' });
        }
  }

  async getNextCode(req: Request, res: Response) {
    try {
          const { orgcod, projcod } = req.params;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          const nextCode = await expertService.getNextCodePreview(project.id);
    
          res.status(200).json({ nextCode });
        } catch (error) {
          const err = error as Error;
          console.error('Error generating next code:', err.message);
          res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  /**
   * Searches experts by date
   */
  async searchExpertsByDate(req: Request, res: Response) {
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
      const experts = await expertService.searchExpertsByDate(project.id, year as string, month as string);
      res.status(200).json(experts);
    } catch (error) {
      console.error('Error searching experts by date:', error);
      res.status(500).json({ error: 'Error searching experts' });
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

      let expertos = await expertService.getExpertsByProject(project.id, 1, 1000);

      // Ordenar por fecha de creación (más antiguos primero)
      expertos = expertos.sort((a, b) => {
        const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
        const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
        return dateA - dateB;
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Expertos');

      // Define headers similar to educcion
      worksheet.columns = [
        { header: 'Código', key: 'code', width: 15 },
        { header: 'Nombre', key: 'firstName', width: 20 },
        { header: 'Apellido', key: 'apellidos', width: 20 },
        { header: 'Organización', key: 'externalOrganization', width: 20 },
        { header: 'Experiencia', key: 'experience', width: 15 },
        { header: 'Versión', key: 'version', width: 10 },
        { header: 'Fecha Creación', key: 'creationDate', width: 20 },
        { header: 'Comentario', key: 'comentario', width: 30 },
        { header: 'Estado', key: 'status', width: 15 },
      ];

      // Add data
      expertos.forEach(exp => {
        worksheet.addRow({
          code: exp.code,
          firstName: exp.firstName,
          apellidos: exp.paternalSurname + ' ' + exp.maternalSurname,
          externalOrganization: exp.externalOrganization || 'N/A',
          experience: exp.experience,
          version: exp.version,
          creationDate: exp.creationDate ? exp.creationDate.toISOString().split('T')[0] : 'N/A',
          comentario: exp.comment || 'N/A',
          status: exp.status,
        });
      });

      worksheet.getRow(1).font = { bold: true };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=expertos.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting experts to Excel:', err.message);
      res.status(500).json({ error: 'Error exporting experts to Excel.' });
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

      let expertos = await expertService.getExpertsByProject(project.id, 1, 1000);

      // Ordenar por fecha de creación (más antiguos primero)
      expertos = expertos.sort((a, b) => {
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
      res.setHeader('Content-Disposition', `attachment; filename=expertos-${projcod}.pdf`);
      doc.pipe(res);

      doc.fontSize(18).text('Reporte de Expertos', { align: 'center' });
      doc.fontSize(16).text(`${project.name}`, { align: 'center' });
      doc.fontSize(10).text(`Generado: ${new Date().toLocaleString('es-ES')}`, { align: 'center' });
      doc.moveDown(2);

      if (expertos.length === 0) {
        doc.fontSize(12).text('No hay expertos registrados para este proyecto.', { align: 'center' });
      } else {
        expertos.forEach((exp, index) => {
          if (index > 0) doc.addPage();

          doc.fontSize(14).font('Helvetica-Bold').text(`Experto: ${exp.code}`, { underline: true });
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

          doc.font('Helvetica');
          y = addTableRow('Código', exp.code);
          y = addTableRow('Nombre', exp.firstName);
          y = addTableRow('Apellidos', exp.paternalSurname + ' ' + exp.maternalSurname);
          y = addTableRow('Organización', exp.externalOrganization || 'N/A');
          y = addTableRow('Experiencia', exp.experience ? exp.experience.toString() : 'N/A');
          y = addTableRow('Versión', exp.version ? exp.version.toString() : 'N/A');
          y = addTableRow('Fecha Creación', exp.creationDate ? new Date(exp.creationDate).toLocaleDateString('es-ES') : 'N/A');
          y = addTableRow('Comentario', exp.comment || 'N/A');
          y = addTableRow('Estado', exp.status || 'N/A');
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
      console.error('Error exporting experts to PDF:', err.message);
      res.status(500).json({ error: 'Error exporting experts to PDF.' });
    }
  }

  
}

export const expertController = new ExpertController();
