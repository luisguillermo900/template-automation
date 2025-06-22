import { Request, Response } from 'express';
import { specificationService } from '../services/specification.service';
import { ilacionService } from '../../ilaciones/services/ilacion.service';
import { educcionService } from '../../educciones/services/educcion.service';
import { projectService } from '../../../projects/services/project.service';
import { SpecificationDTO, SpecificationResponse } from '../models/specification.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class SpecificationController {
  /**
   * Creates a new specification
   */
  async createSpecification(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;
      const specificationDto: SpecificationDTO = req.body;

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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Validate required fields
      if (!specificationDto.name || specificationDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      // También deberías validar los campos obligatorios según tus requisitos
      if (!specificationDto.precondition || specificationDto.precondition.trim() === '') {
        return res.status(400).json({ error: 'Precondition is required.' });
      }

      if (!specificationDto.procedure || specificationDto.procedure.trim() === '') {
        return res.status(400).json({ error: 'Procedure is required.' });
      }

      if (!specificationDto.postcondition || specificationDto.postcondition.trim() === '') {
        return res.status(400).json({ error: 'Postcondition is required.' });
      }

      const newSpecification = await specificationService.createSpecification(ilacion.id, specificationDto);

      res.status(201).json({
        message: 'Specification created successfully.',
        specification: newSpecification,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating specification:', err.message);
      res.status(500).json({ error: 'Error creating specification.' });
    }
  }

  /**
   * Gets all specifications from an ilacion
   */
  async getSpecificationsByIlacion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;
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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      const specifications = await specificationService.getSpecificationsByIlacion(ilacion.id, page, limit);
      res.status(200).json(specifications);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching specifications:', err.message);
      res.status(500).json({ error: 'Error fetching specifications.' });
    }
  }

  /**
   * Gets a specification by its code
   */
  async getSpecificationByCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod, speccod } = req.params;

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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      const specification = await specificationService.getSpecificationByCode(speccod, ilacion.id);
      if (!specification) {
        return res.status(404).json({ error: 'Specification not found.' });
      }

      res.status(200).json(specification);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching specification:', err.message);
      res.status(500).json({ error: 'Error fetching specification.' });
    }
  }

  /**
   * Updates a specification
   */
  async updateSpecification(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod, speccod } = req.params;
      const specificationDto: Partial<SpecificationDTO> = req.body;

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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Verify the specification exists and belongs to this ilacion
      const existingSpecification = await specificationService.getSpecificationByCode(speccod, ilacion.id);
      if (!existingSpecification) {
        return res.status(404).json({ error: 'Specification not found.' });
      }

      if (existingSpecification.ilacionId !== ilacion.id) {
        return res.status(404).json({ error: 'Specification not found in this ilacion.' });
      }

      // Validate non-empty fields if provided
      if (specificationDto.name !== undefined && specificationDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name cannot be empty.' });
      }

      if (specificationDto.precondition !== undefined && specificationDto.precondition.trim() === '') {
        return res.status(400).json({ error: 'Precondition cannot be empty.' });
      }

      if (specificationDto.procedure !== undefined && specificationDto.procedure.trim() === '') {
        return res.status(400).json({ error: 'Procedure cannot be empty.' });
      }

      if (specificationDto.postcondition !== undefined && specificationDto.postcondition.trim() === '') {
        return res.status(400).json({ error: 'Postcondition cannot be empty.' });
      }

      const updatedSpecification = await specificationService.updateSpecification(
        existingSpecification.id,
        specificationDto
      );

      res.status(200).json({
        message: 'Specification updated successfully.',
        specification: updatedSpecification,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating specification:', err.message);
      res.status(500).json({ error: 'Error updating specification.' });
    }
  }

  /**
   * Deletes a specification
   */
  async deleteSpecification(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod, speccod } = req.params;

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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Verify the specification exists and belongs to this ilacion
      const existingSpecification = await specificationService.getSpecificationByCode(speccod, ilacion.id);
      if (!existingSpecification) {
        return res.status(404).json({ error: 'Specification not found.' });
      }

      await specificationService.deleteSpecification(existingSpecification.id);

      res.status(200).json({
        message: 'Specification deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting specification:', err.message);
      res.status(500).json({ error: 'Error deleting specification.' });
    }
  }

  /**
   * Searches specifications by name
   */
  async searchSpecificationsByName(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;
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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      if (!name || (name as string).trim() === '') {
        return res.status(400).json({ error: 'Name parameter is required for search.' });
      }

      const specifications = await specificationService.searchSpecificationsByName(ilacion.id, name as string);
      res.status(200).json(specifications);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching specifications:', err.message);
      res.status(500).json({ error: 'Error searching specifications.' });
    }
  }

  /**
   * Gets the next unique code without incrementing counter
   */
  async getNextCode(req: Request, res: Response) {
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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      const nextCode = await specificationService.getNextCodePreview(ilacion.id);
      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  /**
   * Exports specifications to Excel
   */
  async exportToExcel(req: Request, res: Response) {
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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Get all specifications for this ilacion
      const specifications = await specificationService.getSpecificationsByIlacion(ilacion.id, 1, 1000);

      // Create a new workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Specifications');

      // Add headers
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Version', key: 'version', width: 10 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Importance', key: 'importance', width: 15 },
        { header: 'Precondition', key: 'precondition', width: 50 },
        { header: 'Procedure', key: 'procedure', width: 50 },
        { header: 'Postcondition', key: 'postcondition', width: 50 },
        { header: 'Created', key: 'creationDate', width: 20 },
        { header: 'Modified', key: 'modificationDate', width: 20 }
      ];

      // Style the headers
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // Add data
      specifications.forEach((spec: SpecificationResponse) => {
        worksheet.addRow({
          code: spec.code,
          name: spec.name,
          version: spec.version,
          status: spec.status || 'N/A',
          importance: spec.importance || 'N/A',
          precondition: spec.precondition || 'N/A',
          procedure: spec.procedure || 'N/A',
          postcondition: spec.postcondition || 'N/A',
          creationDate: spec.creationDate
            ? new Date(spec.creationDate).toLocaleDateString()
            : 'N/A',
          modificationDate: spec.modificationDate
            ? new Date(spec.modificationDate).toLocaleDateString()
            : 'N/A'
        });
      });

      // Auto fit rows for better readability
      worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
        if (rowNumber > 1) { // Skip header row
          row.eachCell({ includeEmpty: false }, function (cell) {
            cell.alignment = {
              wrapText: true,
              vertical: 'top'
            };
          });
          // Set a reasonable height for content rows
          row.height = 80;
        }
      });

      // Set content type and disposition
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=specifications.xlsx');

      // Send the workbook
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting specifications to Excel:', err.message);
      res.status(500).json({ error: 'Error exporting specifications to Excel.' });
    }
  }

  /**
 * Exporta especificaciones a PDF
 */
  async exportToPDF(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;

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

      // Verificar que la ilación pertenece a esta educción
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilación no encontrada en esta educción.' });
      }

      // Obtener todas las especificaciones y ordenarlas por fecha de creación (más antiguas primero)
      const allSpecifications = await specificationService.getSpecificationsByIlacion(ilacion.id, 1, 1000);
      const specifications = allSpecifications.sort((a, b) => {
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
      res.setHeader('Content-Disposition', `attachment; filename=especificaciones-${ilacod}.pdf`);

      // Enviar el PDF a la respuesta
      doc.pipe(res);

      // Título y fecha de generación
      doc.fontSize(18).text(`Reporte de Especificaciones`, { align: 'center' });
      doc.fontSize(16).text(`${ilacion.name}`, { align: 'center' });
      doc.fontSize(10).text(`Generado: ${new Date().toLocaleString('es-ES')}`, { align: 'center' });
      doc.moveDown(2);

      // Si no hay especificaciones, mostrar mensaje
      if (specifications.length === 0) {
        doc.fontSize(12).text('No hay especificaciones registradas para esta ilación.', { align: 'center' });
      } else {
        // Procesar cada especificación en páginas separadas
        specifications.forEach((spec, index) => {
          // Nueva página para cada especificación excepto la primera
          if (index > 0) {
            doc.addPage();
          }

          // Título de la especificación
          doc.fontSize(14).font('Helvetica-Bold').text(`Especificación: ${spec.code}`, { underline: true });
          doc.moveDown(1);
          doc.font('Helvetica');

          // Configuración de tabla de dos columnas
          const pageWidth = doc.page.width - 100; // Ancho de página menos márgenes
          const colWidth1 = 150; // Ancho de la primera columna (atributos)
          const colWidth2 = pageWidth - colWidth1; // Ancho de la segunda columna (descripciones)

          // Dibujar tabla con los datos de la especificación
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

          // Datos de la especificación
          doc.font('Helvetica');
          y = addTableRow('Código', spec.code);
          y = addTableRow('Nombre', spec.name);
          y = addTableRow('Versión', spec.version.toString());
          y = addTableRow('Estado', spec.status);
          y = addTableRow('Importancia', spec.importance);
          y = addTableRow('Fecha Creación', spec.creationDate
            ? new Date(spec.creationDate).toLocaleDateString('es-ES')
            : 'N/A');
          y = addTableRow('Fecha Modificación', spec.modificationDate
            ? new Date(spec.modificationDate).toLocaleDateString('es-ES')
            : 'N/A');
          y = addTableRow('Precondición', spec.precondition || 'N/A');
          y = addTableRow('Procedimiento', spec.procedure || 'N/A');
          y = addTableRow('Postcondición', spec.postcondition || 'N/A');

          if (spec.comment) {
            y = addTableRow('Comentarios', spec.comment);
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

export const specificationController = new SpecificationController();