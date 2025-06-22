// filepath: d:\PIS2_2025A\template-automation-system\backend\src\modules\interviews\controllers\interview.controller.ts
import { Request, Response } from 'express';
import { interviewService } from '../services/interview.service';
import { projectService } from '../../projects/services/project.service';
import { InterviewDTO } from '../models/interview.model';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class InterviewController {
  /**
   * Creates a new interview
   */
  async createInterview(req: Request, res: Response) {
    try {

        const { orgcod, projcod } = req.params;
            
        const interviewDto: InterviewDTO = req.body;
      
        // Verificar que el proyecto pertenece a esta organización
        const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      
        if (!project) {
          return res.status(404).json({ error: 'Project not found in this organization.' });
        }
      
        if (!interviewDto.interviewName || interviewDto.interviewName.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
        }
      
      const newInterview = await interviewService.createInterview(project.id,interviewDto);
      res.status(201).json({
        message: 'Interview created successfully.',
        interview: newInterview,
      });
    } catch (error) {
      console.error('Error creating interview:', error);
      res.status(500).json({ error: 'Error creating interview.' });
    }
  }

  /**
   * Gets all interviews for a project
   */
  async getInterviewByProject(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // CAMBIO AQUÍ: Usar project.id (UUID) en lugar de projcod
      const interviews = await interviewService.getInterviewByProject(project.id);
      res.status(200).json(interviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      res.status(500).json({ error: 'Error fetching interviews.' });
    }
  }

  /**
   * Gets an interview by its ID
   */
  async getInterviewById(req: Request, res: Response) {
    try {
      const { orgcod, projcod, interviewId } = req.params;
      const id = interviewId;


      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const interview = await interviewService.getInterviewById(id,project.id);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found.' });
      }

      // Verificar que la entrevista pertenece al proyecto correcto
      if (interview.projectId !== project.id) {
        return res.status(404).json({ error: 'Interview not found in this project.' });
      }

      res.status(200).json(interview);
    } catch (error) {
      console.error('Error fetching interview:', error);
      res.status(500).json({ error: 'Error fetching interview.' });
    }
  }

  /**
   * Updates an existing interview
   */
  async updateInterview(req: Request, res: Response) {
    try {
      const { orgcod, projcod,interviewId} = req.params;
      const id = interviewId;
      const interviewDto: InterviewDTO = req.body;
      
      // Verificar que el proyecto pertenece a esta organización
            const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      
            if (!project) {
              return res.status(404).json({ error: 'Project not found in this organization.' });
            }
      
            // Verificar que la entrevista existe y pertenece a este proyecto
            const existingInterview = await interviewService.getInterviewById(id, project.id);
      
            if (!existingInterview) {
              return res.status(404).json({ error: 'Interview not found.' });
            }
      
            if (existingInterview.projectId !== project.id) {
              return res.status(404).json({ error: 'Interview not found in this project.' });
            }
      
      const updatedInterview = await interviewService.updateInterview(id, interviewDto);
      res.status(200).json({
        message: 'Interview updated successfully.',
        interview: updatedInterview,
      });
    } catch (error) {
      console.error('Error updating interview:', error);
      res.status(500).json({ error: 'Error updating interview.' });
    }
  }

  /**
   * Deletes an interview
   */
  async deleteInterview(req: Request, res: Response) {
    try {
      const { orgcod, projcod, id } = req.params;
      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verificar que la educción existe y pertenece a este proyecto
      const existingInterview = await interviewService.getInterviewById(id, project.id);

      if (!existingInterview) {
        return res.status(404).json({ error: 'Interview not found.' });
      }

      if (existingInterview.projectId !== project.id) {
        return res.status(404).json({ error: 'Interview not found in this project.' });
      }

      // CAMBIO AQUÍ: Pasar también el project.id para identificar la educción correcta
      await interviewService.deleteInterview(id, project.id);

      res.status(200).json({
        message: 'Interview deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting interview:', error);
      res.status(500).json({ error: 'Error deleting interview.' });
    }
  }

  /**
   * Searches for interviews by name
   */
  async searchByName(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const { interviewName } = req.query;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const interviews = await interviewService.searchByName(project.id,interviewName as string);
      res.status(200).json(interviews);
    } catch (error) {
      console.error('Error searching interviews:', error);
      res.status(500).json({ error: 'Error searching interviews.' });
    }
  }

  async addAgendaItem(req: Request, res: Response) {
    const { id } = req.params;
    const { description } = req.body;
    const result = await interviewService.addAgendaItem(id, description);
    res.status(201).json(result);
  }

  async removeAgendaItem(req: Request, res: Response) {
    const { id } = req.params;
    await interviewService.removeAgendaItem(id);
    res.status(204).send();
  }

  async addConclusion(req: Request, res: Response) {
    const { id } = req.params;
    const { description } = req.body;
    const result = await interviewService.addConclusion(id, description);
    res.status(201).json(result);
  }

  async removeConclusion(req: Request, res: Response) {
    const { id } = req.params;
    await interviewService.removeConclusion(id);
    res.status(204).send();
  }

  /**
   * Exports to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const entrevistas = await interviewService.getInterviewByProjectExport(project.id, 1, 1000);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Entrevistas');

      worksheet.columns = [
        { header: 'Nombre de entrevista', key: 'interviewName', width: 25 },
        { header: 'Fecha de la entrevista', key: 'interviewDate', width: 20 },
        { header: 'Entrevistado', key: 'intervieweeName', width: 25 },
        { header: 'Rol del entrevistado', key: 'intervieweeRole', width: 20 },
        { header: 'Hora de inicio', key: 'startTime', width: 10 },
        { header: 'Hora final', key: 'endTime', width: 10 },
        { header: 'Agendas', key: 'agendaItems', width: 30 },
        { header: 'Concluciones', key: 'conclusions', width: 15 },
        { header: 'Observaciones', key: 'observations', width: 10 },
      ];

      entrevistas.forEach(ent => {
        worksheet.addRow({
          interviewName: ent.interviewName,
          interviewDate: ent.interviewDate ? ent.interviewDate.toISOString().split('T')[0] : 'N/A',
          intervieweeName: ent.intervieweeName || 'N/A',
          intervieweeRole: ent.intervieweeRole || 'N/A',
          startTime: ent.startTime ? ent.startTime.toISOString().split('T')[1].slice(0, 5) : 'N/A',
          endTime: ent.endTime ? ent.endTime.toISOString().split('T')[1].slice(0, 5) : 'N/A',
          agendaItems: ent.agendaItems && ent.agendaItems.length > 0 ? ent.agendaItems.map(item => item.description).join(', ') : 'N/A',
          conclusions: ent.conclusions && ent.conclusions.length > 0 ? ent.conclusions.map(item => item.description).join(', ') : 'N/A',
          observations: ent.observations || 'N/A',
        });
      });

      worksheet.getRow(1).font = { bold: true };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=entrevistas.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting interviews to Excel:', err.message);
      res.status(500).json({ error: 'Error exporting interviews to Excel.' });
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

      const entrevistas = await interviewService.getInterviewByProjectExport(project.id, 1, 1000);

      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        bufferPages: true
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=entrevistas-${projcod}.pdf`);
      doc.pipe(res);

      doc.fontSize(18).text('Reporte de Entrevistas', { align: 'center' });
      doc.fontSize(16).text(`${project.name}`, { align: 'center' });
      doc.fontSize(10).text(`Generado: ${new Date().toLocaleString('es-ES')}`, { align: 'center' });
      doc.moveDown(2);

      if (entrevistas.length === 0) {
        doc.fontSize(12).text('No hay entrevistas registradas para este proyecto.', { align: 'center' });
      } else {
        entrevistas.forEach((ent, index) => {
          if (index > 0) doc.addPage();

          doc.fontSize(14).font('Helvetica-Bold').text(`Entrevista: ${ent.interviewName}`, { underline: true });
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
          y = addTableRow('Nombre', ent.interviewName);
          y = addTableRow('Fecha de la entrevista', ent.interviewDate ? new Date(ent.interviewDate).toLocaleDateString('es-ES') : 'N/A');
          y = addTableRow('Entrevistado', ent.intervieweeName || 'N/A');
          y = addTableRow('Rol del entrevistado', ent.intervieweeRole || 'N/A');
          y = addTableRow('Hora de inicio', ent.startTime ? ent.startTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'N/A');
          y = addTableRow('Hora final', ent.endTime ? ent.endTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'N/A');
          y = addTableRow('Agendas', ent.agendaItems && ent.agendaItems.length > 0 ? ent.agendaItems.map(item => item.description).join(', ') : 'N/A');
          y = addTableRow('Concluciones', ent.conclusions && ent.conclusions.length > 0 ? ent.conclusions.map(item => item.description).join(', ') : 'N/A');
          y = addTableRow('Observaciones', ent.observations || 'N/A');
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
      console.error('Error exporting interviews to PDF:', err.message);
      res.status(500).json({ error: 'Error exporting interviews to PDF.' });
    }
  }

}


// Export singleton instance of the controller
export const interviewController = new InterviewController();