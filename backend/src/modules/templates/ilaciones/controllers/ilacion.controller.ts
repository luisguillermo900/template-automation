import { Request, Response } from 'express';
import { ilacionService } from '../services/ilacion.service';
import { educcionService } from '../../educciones/services/educcion.service';
import { projectService } from '../../../projects/services/project.service';
import { IlacionDTO } from '../models/ilacion.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class IlacionController {
  /**
   * Creates a new ilacion
   */
  async createIlacion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;
      const ilacionDto: IlacionDTO = req.body;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Validar campos obligatorios
      if (!ilacionDto.name || ilacionDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      if (!ilacionDto.precondition || ilacionDto.precondition.trim() === '') {
        return res.status(400).json({ error: 'Precondition is required.' });
      }

      if (!ilacionDto.procedure || ilacionDto.procedure.trim() === '') {
        return res.status(400).json({ error: 'Procedure is required.' });
      }

      if (!ilacionDto.postcondition || ilacionDto.postcondition.trim() === '') {
        return res.status(400).json({ error: 'Postcondition is required.' });
      }

      const newIlacion = await ilacionService.createIlacion(educcion.id, ilacionDto);

      res.status(201).json({
        message: 'Ilacion created successfully.',
        ilacion: newIlacion,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating ilacion:', err);
      return res.status(500).json({ error: `Error creating ilacion: ${err.message}` });
    }
  }

  /**
   * Gets all ilaciones from an educcion
   */
  async getIlacionesByEduccion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      const ilaciones = await ilacionService.getIlacionesByEduccion(educcion.id, page, limit);
      res.status(200).json(ilaciones);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching ilaciones:', err.message);
      res.status(500).json({ error: 'Error fetching ilaciones.' });
    }
  }

  /**
   * Gets an ilacion by its code
   */
  async getIlacionByCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found.' });
      }

      // Verify the ilacion belongs to the correct educcion
      if (ilacion.educcionId !== educcion.id) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      res.status(200).json(ilacion);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching ilacion:', err.message);
      res.status(500).json({ error: 'Error fetching ilacion.' });
    }
  }

  /**
   * Updates an ilacion
   */
  async updateIlacion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;
      const ilacionDto: IlacionDTO = req.body;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion exists and belongs to this educcion
      const existingIlacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!existingIlacion) {
        return res.status(404).json({ error: 'Ilacion not found.' });
      }

      if (existingIlacion.educcionId !== educcion.id) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Validar campos obligatorios
      if (ilacionDto.name !== undefined && ilacionDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name cannot be empty.' });
      }

      if (ilacionDto.precondition !== undefined && ilacionDto.precondition.trim() === '') {
        return res.status(400).json({ error: 'Precondition cannot be empty.' });
      }

      if (ilacionDto.procedure !== undefined && ilacionDto.procedure.trim() === '') {
        return res.status(400).json({ error: 'Procedure cannot be empty.' });
      }

      if (ilacionDto.postcondition !== undefined && ilacionDto.postcondition.trim() === '') {
        return res.status(400).json({ error: 'Postcondition cannot be empty.' });
      }

      const updatedIlacion = await ilacionService.updateIlacion(ilacod, educcion.id, ilacionDto);

      res.status(200).json({
        message: 'Ilacion updated successfully.',
        ilacion: updatedIlacion,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating ilacion:', err.message);
      res.status(500).json({ error: 'Error updating ilacion.' });
    }
  }

  /**
   * Deletes an ilacion
   */
  async deleteIlacion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion exists and belongs to this educcion
      const existingIlacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!existingIlacion) {
        return res.status(404).json({ error: 'Ilacion not found.' });
      }

      if (existingIlacion.educcionId !== educcion.id) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      await ilacionService.deleteIlacion(ilacod, educcion.id);

      res.status(200).json({
        message: 'Ilacion deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting ilacion:', err.message);
      res.status(500).json({ error: 'Error deleting ilacion.' });
    }
  }

  /**
   * Searches ilaciones by name
   */
  async searchIlacionesByName(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;
      const { name } = req.query;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      if (!name || (name as string).trim() === '') {
        return res.status(400).json({ error: 'Name parameter is required for search.' });
      }

      const ilaciones = await ilacionService.searchIlacionesByName(educcion.id, name as string);
      res.status(200).json(ilaciones);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching ilaciones:', err.message);
      res.status(500).json({ error: 'Error searching ilaciones.' });
    }
  }

  /**
   * Gets the next unique code without incrementing counter
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Cambiamos para usar getNextCodePreview en lugar de getNextCode
      const nextCode = await ilacionService.getNextCodePreview(educcion.id);
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
      const { orgcod, projcod, educod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      const ilaciones = await ilacionService.getIlacionesByEduccion(educcion.id, 1, 1000);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Ilaciones');

      // Define headers
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Importance', key: 'importance', width: 15 }, // Cambiado de priority a importance
        { header: 'Precondition', key: 'precondition', width: 25 }, // Nuevo campo
        { header: 'Procedure', key: 'procedure', width: 30 }, // Nuevo campo
        { header: 'Postcondition', key: 'postcondition', width: 25 }, // Nuevo campo
        { header: 'Version', key: 'version', width: 10 },
      ];


      // Add data
      ilaciones.forEach(ila => {
        worksheet.addRow({
          code: ila.code,
          name: ila.name,
          creationDate: ila.creationDate.toISOString().split('T')[0],
          status: ila.status,
          importance: ila.importance, // Cambiado de priority a importance
          precondition: ila.precondition,
          procedure: ila.procedure,
          postcondition: ila.postcondition,
          version: ila.version,
        });
      });

      // Style headers
      worksheet.getRow(1).font = { bold: true };

      // Configure HTTP response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=ilaciones.xlsx');

      // Send file
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting to Excel:', err.message);
      res.status(500).json({ error: 'Error exporting to Excel.' });
    }
  }

  /**
 * Exporta a PDF
 */
  async exportToPDF(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Proyecto no encontrado en esta organización.' });
      }

      // Verificar que la educción pertenece a este proyecto
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educción no encontrada en este proyecto.' });
      }

      // Obtener todas las ilaciones y ordenarlas por fecha de creación (más antiguas primero)
      const allIlaciones = await ilacionService.getIlacionesByEduccion(educcion.id, 1, 1000);
      const ilaciones = allIlaciones.sort((a, b) => {
        const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
        const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
        return dateA - dateB;
      });

      // Crear documento PDF con la opción bufferPages para permitir numeración de páginas
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        bufferPages: true
      });

      // Configurar cabeceras de respuesta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=ilaciones-${educod}.pdf`);

      // Enviar el PDF a la respuesta
      doc.pipe(res);

      // Título y fecha de generación
      doc.fontSize(18).text(`Reporte de Ilaciones`, { align: 'center' });
      doc.fontSize(16).text(`${educcion.name}`, { align: 'center' });
      doc.fontSize(10).text(`Generado: ${new Date().toLocaleString('es-ES')}`, { align: 'center' });
      doc.moveDown(2);

      // Si no hay ilaciones, mostrar mensaje
      if (ilaciones.length === 0) {
        doc.fontSize(12).text('No hay ilaciones registradas para esta educción.', { align: 'center' });
      } else {
        // Procesar cada ilación en páginas separadas
        ilaciones.forEach((ilacion, index) => {
          // Nueva página para cada ilación excepto la primera
          if (index > 0) {
            doc.addPage();
          }

          // Título de la ilación
          doc.fontSize(14).font('Helvetica-Bold').text(`Ilación: ${ilacion.code}`, { underline: true });
          doc.moveDown(1);
          doc.font('Helvetica');

          // Configuración de tabla de dos columnas
          const pageWidth = doc.page.width - 100; // Ancho de página menos márgenes
          const colWidth1 = 150; // Ancho de la primera columna (atributos)
          const colWidth2 = pageWidth - colWidth1; // Ancho de la segunda columna (descripciones)

          // Dibujar tabla con los datos de la ilación
          let y = doc.y;

          // Función para agregar una fila a la tabla
          const addTableRow = (attribute: string, value: string): number => {
            // Calcular la altura requerida para el contenido de cada celda
            const textOptions = { width: colWidth2 - 10 };
            const valueHeight = doc.heightOfString(value || 'N/A', textOptions);
            const attributeHeight = doc.heightOfString(attribute, { width: colWidth1 - 10 });

            // Usar la altura mayor entre las dos celdas (mínimo 25px)
            const rowHeight = Math.max(25, valueHeight + 14, attributeHeight + 14);

            // Dibujar bordes de celda con la altura calculada
            doc.rect(50, y, colWidth1, rowHeight).stroke();
            doc.rect(50 + colWidth1, y, colWidth2, rowHeight).stroke();

            // Agregar texto con posicionamiento vertical apropiado
            doc.fontSize(10);
            doc.text(attribute, 55, y + 7, { width: colWidth1 - 10 });
            doc.text(value || 'N/A', 55 + colWidth1, y + 7, textOptions);

            // Devolver la nueva posición Y
            return y + rowHeight;
          };

          // Dibujar encabezados
          doc.fontSize(12).font('Helvetica-Bold');
          doc.rect(50, y, colWidth1, 25).stroke();
          doc.rect(50 + colWidth1, y, colWidth2, 25).stroke();
          doc.text('Atributo', 55, y + 7, { width: colWidth1 - 10 });
          doc.text('Descripción', 55 + colWidth1, y + 7, { width: colWidth2 - 10 });
          y += 25;

          // Datos de la ilación
          doc.font('Helvetica');
          y = addTableRow('Código', ilacion.code);
          y = addTableRow('Nombre', ilacion.name);
          y = addTableRow('Precondición', ilacion.precondition || 'N/A');
          y = addTableRow('Procedimiento', ilacion.procedure || 'N/A');
          y = addTableRow('Postcondición', ilacion.postcondition || 'N/A');
          y = addTableRow('Estado', ilacion.status);
          y = addTableRow('Importancia', ilacion.importance);
          y = addTableRow('Versión', ilacion.version.toString());
          y = addTableRow('Fecha Creación', new Date(ilacion.creationDate).toLocaleDateString('es-ES'));
          if (ilacion.comment) {
            y = addTableRow('Comentarios', ilacion.comment);
          }
        });
      }

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
}

export const ilacionController = new IlacionController();