import { Request, Response } from 'express';
import { projectService } from '../services/project.service';
import { ProjectDTO } from '../models/project.model';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class ProjectController {
  /**
   * Creates a new project
   */
  async createProject(req: Request, res: Response) {
    try {
      const { orgcod } = req.params;
      const { name, description, status, comments } = req.body;

      const projectData: ProjectDTO = {
        name,
        description,
        status,
        comments
      };

      const newProject = await projectService.createProject(orgcod, projectData);

      res.status(201).json(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Error creating project' });
    }
  }

  /**
   * Updates a project
   */
  async updateProject(req: Request, res: Response) {
    const { orgcod, projcod } = req.params;
    const data = req.body;

    try {
      const updatedProject = await projectService.updateProject(orgcod, projcod, data);
      res.status(200).json({
        message: 'Project updated successfully',
        project: updatedProject,
      });
    } catch (err) {
      console.error('Error updating project:', err);
      res.status(500).json({ error: 'Error updating project' });
    }
  }

  /**
   * Deletes a project
   */
  async deleteProject(req: Request, res: Response) {
    const { orgcod, projcod } = req.params;

    try {
      await projectService.deleteProject(orgcod, projcod);
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Error deleting project' });
    }
  }

  /**
   * Gets a project by organization code and project code
   */
  async getProjectByOrgAndCode(req: Request, res: Response) {
    const { orgcod, projcod } = req.params;

    try {
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) return res.status(404).json({ error: 'Project not found' });
      res.status(200).json(project);
    } catch (error) {
      console.error('Error getting project:', error);
      res.status(500).json({ error: 'Error getting project' });
    }
  }

  /**
   * Gets all projects for an organization
   */
  async getProjectsByOrganization(req: Request, res: Response) {
    const { orgcod } = req.params;

    try {
      const projects = await projectService.getProjectsByOrganization(orgcod);
      res.status(200).json(projects);
    } catch (err) {
      console.error('Error getting projects:', err);
      res.status(500).json({ error: 'Error getting projects' });
    }
  }

  /**
   * Gets the next unique code for a project without incrementing the counter
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const { orgcod } = req.params;
      // Cambiamos a usar getNextCodePreview
      const nextCode = await projectService.getNextCodePreview(orgcod);
      res.status(200).json({ nextCode });
    } catch (error) {
      console.error('Error getting next code:', error);
      res.status(500).json({ error: 'Error getting next code' });
    }
  }

  /**
   * Searches projects by name
   */
  async searchProjects(req: Request, res: Response) {
    try {
      const { orgcod } = req.params;
      const { name } = req.query;

      if (typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid parameters' });
      }

      const projects = await projectService.searchProjectsByName(orgcod, name);
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error searching projects:', error);
      res.status(500).json({ error: 'Error searching projects' });
    }
  }

  /**
   * Searches projects by date
   */
  async searchProjectsByDate(req: Request, res: Response) {
    try {
      const { orgcod } = req.params;
      const { year, month } = req.query;

      // Validate that at least one parameter is present
      if (!year && !month) {
        return res.status(400).json({ error: 'You must provide at least year or month' });
      }

      // Validate year and month format if present
      if (year && !/^\d{4}$/.test(year as string)) {
        return res.status(400).json({ error: 'Invalid year format' });
      }

      if (month && (parseInt(month as string) < 1 || parseInt(month as string) > 12)) {
        return res.status(400).json({ error: 'Month must be between 1 and 12' });
      }

      const projects = await projectService.searchProjectsByDate(
        orgcod,
        year as string,
        month as string
      );

      res.status(200).json(projects);
    } catch (error) {
      console.error('Error searching projects by date:', error);
      res.status(500).json({ error: 'Error searching projects' });
    }
  }

  /**
 * Exporta proyectos a Excel
 */
  async exportToExcel(req: Request, res: Response) {
    const { orgcod } = req.params;
    try {
      // Obtener todos los proyectos de la organización
      const allProjects = await projectService.getProjectsByOrganization(orgcod);

      // Ordenar los proyectos por fecha de creación (más antiguos primero)
      const projects = allProjects.sort((a, b) => {
        const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
        const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
        return dateA - dateB;
      });

      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Proyectos'); // Cambiado a español

      // Añadir encabezados en español
      worksheet.columns = [
        { header: 'Código', key: 'code', width: 15 },
        { header: 'Nombre', key: 'name', width: 30 },
        { header: 'Fecha Creación', key: 'creationDate', width: 20 },
        { header: 'Fecha Modificación', key: 'modificationDate', width: 20 },
        { header: 'Estado', key: 'status', width: 15 },
      ];

      // Estilizar los encabezados
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // Añadir bordes a los encabezados
      worksheet.getRow(1).eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFCCCCCC' }
        };
      });

      // Añadir datos
      projects.forEach((project, index) => {
        const row = worksheet.addRow({
          code: project.code,
          name: project.name,
          creationDate: project.creationDate
            ? new Date(project.creationDate).toLocaleDateString('es-ES')
            : 'N/A',
          modificationDate: project.modificationDate
            ? new Date(project.modificationDate).toLocaleDateString('es-ES')
            : 'N/A',
          status: project.status || 'N/A'
        });

        // Agregar bordes a las celdas
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });

        // Alternar colores de fondo para mejor legibilidad
        if (index % 2 === 1) {
          row.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFEEEEEE' }
            };
          });
        }
      });

      // Configurar cabeceras de respuesta
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=proyectos-${orgcod}.xlsx`);

      // Enviar el libro de trabajo
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error al exportar a Excel:', err.message);
      res.status(500).json({ error: 'Error al exportar a Excel' });
    }
  }

  /**
   * Export projects to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    const { orgcod } = req.params;
    try {
      // Obtener todos los proyectos de la organización
      const allProjects = await projectService.getProjectsByOrganization(orgcod);

      // Ordenar los proyectos por fecha de creación (más antiguos primero)
      const projects = allProjects.sort((a, b) => {
        const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
        const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
        return dateA - dateB;
      });

      // Crear un nuevo documento PDF con la opción bufferPages para permitir modificaciones posteriores
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
        // layout: 'landscape',
        autoFirstPage: true,
        bufferPages: true
      });

      // Configurar cabeceras de respuesta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=proyectos-${orgcod}.pdf`);

      // Enviar el PDF a la respuesta
      doc.pipe(res);

      // Traducir encabezados de tabla
      const headers = ['Código', 'Nombre', 'Fecha Creación', 'Fecha Modificación', 'Estado'];

      // Mapear datos de proyectos
      const rows = projects.map(project => [
        project.code || 'N/A',
        project.name || 'N/A',
        project.creationDate instanceof Date
          ? new Date(project.creationDate).toLocaleDateString('es-ES')
          : 'N/A',
        project.modificationDate instanceof Date
          ? new Date(project.modificationDate).toLocaleDateString('es-ES')
          : 'N/A',
        project.status || 'N/A'
      ]);

      // Añadir título y fecha
      doc.fontSize(18).text(`Reporte de Proyectos - ${orgcod}`, { align: 'center' });
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
      console.error('Error al exportar a PDF:', error);
      res.status(500).json({ error: 'Error al exportar a PDF' });
    }
  }

  /**
   * Improved table drawing function with text wrapping, dynamic row heights and complete grid
   */
  private drawTableImproved(doc: PDFKit.PDFDocument, headers: string[], rows: any[][]) {
    const pageWidth = doc.page.width - 60; // Considerando márgenes
    const columnWidths = this.calculateColumnWidths(headers, rows, pageWidth);
    const margin = 30;
    let y = doc.y;

    // Dibujar borde superior de la tabla
    doc.moveTo(margin, y).lineTo(margin + pageWidth, y).stroke();

    // Dibujar encabezados
    doc.font('Helvetica-Bold').fontSize(10);
    let x = margin;

    headers.forEach((header, i) => {
      doc.text(header, x, y + 5, {
        width: columnWidths[i],
        align: 'center'
      });
      x += columnWidths[i];
    });

    // Dibujar línea de encabezado
    y += 20;
    doc.moveTo(margin, y).lineTo(margin + pageWidth, y).stroke();

    // Guardar la posición Y inicial para líneas verticales
    const tableStartY = y - 20;
    let tableEndY = y;

    y += 5;

    // Dibujar filas con alturas dinámicas
    doc.font('Helvetica').fontSize(9);

    // Registrar las posiciones de las columnas para líneas verticales
    const columnPositions = [margin];
    let accumulatedWidth = margin;
    for (const width of columnWidths) {
      accumulatedWidth += width;
      columnPositions.push(accumulatedWidth);
    }

    rows.forEach((row) => {
      // Calcular la altura de la fila basada en el contenido
      const rowHeight = this.calculateRowHeight(doc, row, columnWidths);

      // Verificar si necesitamos una nueva página
      if (y + rowHeight > doc.page.height - 50) {
        // Dibujar líneas verticales para la página actual antes de añadir una nueva
        for (let i = 0; i < columnPositions.length; i++) {
          doc.moveTo(columnPositions[i], tableStartY)
            .lineTo(columnPositions[i], tableEndY)
            .stroke();
        }

        doc.addPage();
        y = 50;

        // Dibujar borde superior para la continuación de la tabla
        doc.moveTo(margin, y).lineTo(margin + pageWidth, y).stroke();

        // Restablecer las medidas de la tabla para la nueva página
        tableEndY = y;
      }

      // Dibujar celdas con texto ajustado
      x = margin;

      row.forEach((cell, i) => {
        const cellText = cell ? String(cell) : 'N/A';
        const cellOptions = {
          width: columnWidths[i],
          align: 'left' as const,
          lineBreak: true
        };

        // Dibujar texto de la celda
        doc.text(cellText, x + 3, y + 3, cellOptions); // Añadir pequeño padding

        // Mover a la siguiente columna
        x += columnWidths[i];
      });

      // Mover a la siguiente fila y dibujar divisor
      y += rowHeight + 5;
      doc.moveTo(margin, y).lineTo(margin + pageWidth, y).stroke();

      // Actualizar la posición final de la tabla
      tableEndY = y;
    });

    // Dibujar todas las líneas verticales después de dibujar todas las filas
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
    let maxHeight = 20; // Altura mínima de fila

    row.forEach((cell, i) => {
      if (!cell) return;

      const cellText = String(cell);
      // Usar heightOfString en lugar de estimación manual
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
    // Definir proporciones de ancho optimizadas para A4 vertical
    const widthRatios = [0.15, 0.30, 0.18, 0.18, 0.19];

    return widthRatios.map(ratio => totalWidth * ratio);
  }

  /**
   * Exports project requirements catalog to PDF
   */
  async exportRequirementsCatalogToPDF(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;

      // Get the project with all its requirements using the service layer
      const { project, educciones } = await projectService.getProjectRequirementsCatalog(orgcod, projcod);

      // Create PDF document
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        bufferPages: true // Añadir esta opción para permitir numeración de páginas
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=catalogo-requisitos-${project.code}.pdf`);

      // Pipe PDF to response
      doc.pipe(res);

      // Configuración de tabla
      const pageWidth = doc.page.width - 100; // Ancho de página menos márgenes
      const colWidth1 = 150; // Ancho de la primera columna (atributos)
      const colWidth2 = pageWidth - colWidth1; // Ancho de la segunda columna (descripciones)

      // Función para agregar una fila a la tabla
      const addTableRow = (attribute: string, value: string, x: number, y: number, fontSize: number = 10): number => {
        // Establecer el tamaño de fuente para calcular correctamente la altura
        doc.fontSize(fontSize);

        // Calcular la altura requerida para el contenido de cada celda
        const textOptions = { width: colWidth2 - 10 };
        const valueHeight = doc.heightOfString(value, textOptions);
        const attributeHeight = doc.heightOfString(attribute, { width: colWidth1 - 10 });

        // Usar la altura mayor entre las dos celdas (mínimo 25px)
        const rowHeight = Math.max(25, valueHeight + 14, attributeHeight + 14);

        // Dibujar bordes de celda con la altura calculada
        doc.rect(x, y, colWidth1, rowHeight).stroke();
        doc.rect(x + colWidth1, y, colWidth2, rowHeight).stroke();

        // Agregar texto con posicionamiento vertical apropiado
        doc.fontSize(fontSize);
        doc.text(attribute, x + 5, y + 7, { width: colWidth1 - 10 });
        doc.text(value, x + colWidth1 + 5, y + 7, textOptions);

        // Devolver la nueva posición Y
        return y + rowHeight;
      };

      // Función para crear un encabezado de sección
      const addSectionHeader = (title: string, x: number, y: number, fontSize: number = 14): number => {
        doc.fontSize(fontSize).text(title, x, y, { underline: true });
        return y + 30; // Espacio después del encabezado
      };

      // Cabecera del documento
      doc.fontSize(24).text(`Catálogo de Requisitos - ${project.name}`, { align: 'center' });
      doc.fontSize(10).text(`Generado: ${new Date().toLocaleString('es-ES')}`, { align: 'center' });
      doc.moveDown(2);

      let y = 150;

      // Información del proyecto
      y = addSectionHeader('Información del Proyecto', 50, y);
      y = addTableRow('Código', project.code, 50, y);
      y = addTableRow('Nombre', project.name, 50, y);
      y = addTableRow('Organización', project.organization?.name || orgcod, 50, y);
      y += 30;

      // Sección de Educciones
      if (educciones.length === 0) {
        y = addSectionHeader('1. Educciones', 50, y);
        doc.text('No hay educciones registradas para este proyecto.', 50, y);
      } else {
        educciones.forEach((educcion, eIndex) => {
          // Nueva página para cada educción excepto la primera
          if (eIndex > 0) {
            doc.addPage();
            y = 50;
          }

          // Encabezado de educción
          y = addSectionHeader(`1.${eIndex + 1}. Educción: ${educcion.code}`, 50, y);

          // Tabla con detalles de la educción
          y = addTableRow('Nombre', educcion.name, 50, y);
          y = addTableRow('Descripción', educcion.description, 50, y);
          y = addTableRow('Estado', educcion.status, 50, y);
          y = addTableRow('Importancia', educcion.importance, 50, y);
          if (educcion.comment) {
            y = addTableRow('Comentarios', educcion.comment, 50, y);
          }

          y += 20;

          // Sección de Ilaciones
          if (educcion.ilaciones.length > 0) {
            educcion.ilaciones.forEach((ilacion, iIndex) => {
              // Verificar si es necesario agregar una nueva página
              if (y > doc.page.height - 150) {
                doc.addPage();
                y = 50;
              }

              // Encabezado de ilación
              y = addSectionHeader(`1.${eIndex + 1}.${iIndex + 1}. Ilación: ${ilacion.code}`, 50, y, 12);

              // Tabla con detalles de la ilación
              y = addTableRow('Nombre', ilacion.name, 50, y);
              y = addTableRow('Precondición', ilacion.precondition, 50, y);
              y = addTableRow('Procedimiento', ilacion.procedure, 50, y);
              y = addTableRow('Postcondición', ilacion.postcondition, 50, y);
              y = addTableRow('Estado', ilacion.status, 50, y);
              y = addTableRow('Importancia', ilacion.importance, 50, y);
              if (ilacion.comment) {
                y = addTableRow('Comentarios', ilacion.comment, 50, y);
              }

              y += 15;

              // Sección de Especificaciones
              if (ilacion.specifications.length > 0) {
                ilacion.specifications.forEach((spec, sIndex) => {
                  // Verificar si es necesario agregar una nueva página
                  if (y > doc.page.height - 150) {
                    doc.addPage();
                    y = 50;
                  }

                  // Encabezado de especificación
                  y = addSectionHeader(`1.${eIndex + 1}.${iIndex + 1}.${sIndex + 1}. Especificación: ${spec.code}`, 50, y, 11);

                  // Tabla con detalles de la especificación
                  y = addTableRow('Nombre', spec.name, 50, y, 9);
                  y = addTableRow('Precondición', spec.precondition, 50, y, 9);
                  y = addTableRow('Procedimiento', spec.procedure, 50, y, 9);
                  y = addTableRow('Postcondición', spec.postcondition, 50, y, 9);
                  y = addTableRow('Estado', spec.status, 50, y, 9);
                  y = addTableRow('Importancia', spec.importance, 50, y, 9);
                  if (spec.comment) {
                    y = addTableRow('Comentarios', spec.comment, 50, y, 9);
                  }

                  y += 15;
                });
              }
            });
          } else {
            y = addSectionHeader(`Ilaciones de ${educcion.code}`, 50, y, 12);
            doc.text('No hay ilaciones registradas para esta educción.', 50, y);
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

      // Finish PDF
      doc.end();

    } catch (error) {
      console.error('Error exporting requirements catalog:', error);
      res.status(500).json({ error: 'Error exporting requirements catalog to PDF' });
    }
  }
}

// Export singleton instance of the controller
export const projectController = new ProjectController();