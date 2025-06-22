import { Request, Response } from 'express';
import { educcionService } from '../services/educcion.service';
import { projectService } from '../../../projects/services/project.service';
import { EduccionDTO } from '../models/educcion.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class EduccionController {
  /**
   * Creates a new educcion
   */
  async createEduccion(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const educcionDto: EduccionDTO = req.body;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      if (!educcionDto.name || educcionDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      const newEduccion = await educcionService.createEduccion(project.id, educcionDto);

      res.status(201).json({
        message: 'Educcion created successfully.',
        educcion: newEduccion,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error completo:', err);
      return res.status(500).json({ error: `Error creating educcion: ${err.message}` });
    }
  }

  /**
   * Gets all educciones from a project
   */
  async getEduccionesByProject(req: Request, res: Response) {
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
      const educciones = await educcionService.getEduccionesByProject(project.id, page, limit);

      res.status(200).json(educciones);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching educciones:', err.message);
      res.status(500).json({ error: 'Error fetching educciones.' });
    }
  }

  /**
   * Gets an educcion by its code
   */
  async getEduccionByCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const educcion = await educcionService.getEduccionByCode(educod, project.id);

      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found.' });
      }

      // Verificar que la educción pertenece al proyecto correcto
      if (educcion.projectId !== project.id) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      res.status(200).json(educcion);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching educcion:', err.message);
      res.status(500).json({ error: 'Error fetching educcion.' });
    }
  }

  /**
   * Updates an educcion
   */
  async updateEduccion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;
      const educcionDto: EduccionDTO = req.body;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verificar que la educción existe y pertenece a este proyecto
      const existingEduccion = await educcionService.getEduccionByCode(educod, project.id);

      if (!existingEduccion) {
        return res.status(404).json({ error: 'Educcion not found.' });
      }

      if (existingEduccion.projectId !== project.id) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      const updatedEduccion = await educcionService.updateEduccion(educod, educcionDto);

      res.status(200).json({
        message: 'Educcion updated successfully.',
        educcion: updatedEduccion,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating educcion:', err.message);
      res.status(500).json({ error: 'Error updating educcion.' });
    }
  }

  /**
   * Deletes an educcion
   */
  async deleteEduccion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verificar que la educción existe y pertenece a este proyecto
      const existingEduccion = await educcionService.getEduccionByCode(educod, project.id);

      if (!existingEduccion) {
        return res.status(404).json({ error: 'Educcion not found.' });
      }

      if (existingEduccion.projectId !== project.id) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // CAMBIO AQUÍ: Pasar también el project.id para identificar la educción correcta
      await educcionService.deleteEduccion(educod, project.id);

      res.status(200).json({
        message: 'Educcion deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting educcion:', err.message);
      res.status(500).json({ error: 'Error deleting educcion.' });
    }
  }

  /**
   * Searches educciones by name
   */
  async searchEduccionesByName(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const { name } = req.query;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      if (!name || (name as string).trim() === '') {
        return res.status(400).json({ error: 'Name parameter is required for search.' });
      }

      const educciones = await educcionService.searchEduccionesByName(project.id, name as string);

      res.status(200).json(educciones);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching educciones:', err.message);
      res.status(500).json({ error: 'Error searching educciones.' });
    }
  }

  /**
   * Gets the next unique code without incrementing counter
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Cambiamos a usar getNextCodePreview en lugar de getNextCode
      const nextCode = await educcionService.getNextCodePreview(project.id);

      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code preview:', err.message);
      res.status(500).json({ error: 'Error generating next code preview.' });
    }
  }

  /**
   * Gets an educcion with its ilaciones
   */
  async getEduccionWithIlaciones(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const educcionWithIlaciones = await educcionService.getEduccionWithIlaciones(educod, project.id);

      if (!educcionWithIlaciones) {
        return res.status(404).json({ error: 'Educcion not found.' });
      }

      // Verificar que la educción pertenece al proyecto correcto
      if (educcionWithIlaciones.projectId !== project.id) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      res.status(200).json(educcionWithIlaciones);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching educcion with ilaciones:', err.message);
      res.status(500).json({ error: 'Error fetching educcion with ilaciones.' });
    }
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

      const educciones = await educcionService.getEduccionesByProject(project.id, 1, 1000);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Educciones');

      // Define headers
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Importance', key: 'importance', width: 15 },
        { header: 'Version', key: 'version', width: 10 },
      ];

      // Add data
      educciones.forEach(edu => {
        worksheet.addRow({
          code: edu.code,
          name: edu.name,
          description: edu.description,
          creationDate: edu.creationDate.toISOString().split('T')[0],
          status: edu.status,
          importance: edu.importance,
          version: edu.version,
        });
      });

      // Style headers
      worksheet.getRow(1).font = { bold: true };

      // Configure HTTP response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=educciones.xlsx');

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
      const { orgcod, projcod } = req.params;
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Proyecto no encontrado en esta organización.' });
      }

      // Obtener todas las educciones y ordenarlas por fecha de creación (más antiguas primero)
      const allEducciones = await educcionService.getEduccionesByProject(project.id, 1, 1000);
      const educciones = allEducciones.sort((a, b) => {
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
      res.setHeader('Content-Disposition', `attachment; filename=educciones-${projcod}.pdf`);

      // Enviar el PDF a la respuesta
      doc.pipe(res);

      // Título y fecha de generación
      doc.fontSize(18).text(`Reporte de Educciones`, { align: 'center' });
      doc.fontSize(16).text(`${project.name}`, { align: 'center' });
      doc.fontSize(10).text(`Generado: ${new Date().toLocaleString('es-ES')}`, { align: 'center' });
      doc.moveDown(2);

      // Si no hay educciones, mostrar mensaje
      if (educciones.length === 0) {
        doc.fontSize(12).text('No hay educciones registradas para este proyecto.', { align: 'center' });
      } else {
        // Procesar cada educción en páginas separadas
        educciones.forEach((educcion, index) => {
          // Nueva página para cada educción excepto la primera
          if (index > 0) {
            doc.addPage();
          }

          // Título de la educción
          doc.fontSize(14).font('Helvetica-Bold').text(`Educción: ${educcion.code}`, { underline: true });
          doc.moveDown(1);
          doc.font('Helvetica');

          // Configuración de tabla de dos columnas
          const pageWidth = doc.page.width - 100; // Ancho de página menos márgenes
          const colWidth1 = 150; // Ancho de la primera columna (atributos)
          const colWidth2 = pageWidth - colWidth1; // Ancho de la segunda columna (descripciones)

          // Dibujar tabla con los datos de la educción
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

          // Datos de la educción
          doc.font('Helvetica');
          y = addTableRow('Código', educcion.code);
          y = addTableRow('Nombre', educcion.name);
          y = addTableRow('Descripción', educcion.description || 'N/A');
          y = addTableRow('Estado', educcion.status);
          y = addTableRow('Importancia', educcion.importance);
          y = addTableRow('Versión', educcion.version.toString());
          y = addTableRow('Fecha Creación', new Date(educcion.creationDate).toLocaleDateString('es-ES'));
          if (educcion.comment) {
            y = addTableRow('Comentarios', educcion.comment);
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

// Export singleton instance of the controller
export const educcionController = new EduccionController();