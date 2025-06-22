import { Request, Response } from 'express';
import { actorService } from '../services/actor.service';
import { ActorDTO } from '../models/actor.model';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class ActorController {
  /**
   * Creates a new actor
   */
  async createActor(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const { name, roleId, status, type, authorId, comments, organizationId } = req.body;

      const actorData: ActorDTO = {
        name,
        roleId,
        status,
        type,
        authorId,
        comments,
        organizationId
      };

      const newActor = await actorService.createActor(orgcod, projcod, actorData);

      res.status(201).json({
        message: 'Actor created successfully',
        actor: newActor,
      });
    } catch (error) {
      console.error('Error creating actor:', error);
      res.status(500).json({ error: 'Error creating actor' });
    }
  }

  /**
   * Updates an actor
   */
  async updateActor(req: Request, res: Response) {
    const { orgcod, projcod, actorcod } = req.params;
    const data = req.body;

    try {
      const updatedActor = await actorService.updateActor(orgcod, projcod, actorcod, data);
      res.status(200).json({
        message: 'Actor updated successfully',
        actor: updatedActor,
      });
    } catch (err) {
      console.error('Error updating actor:', err);
      res.status(500).json({ error: 'Error updating actor' });
    }
  }

  /**
   * Deletes an actor
   */
  async deleteActor(req: Request, res: Response) {
    const { orgcod, projcod, actorcod } = req.params;

    try {
      await actorService.deleteActor(orgcod, projcod, actorcod);
      res.status(200).json({ message: 'Actor deleted successfully' });
    } catch (error) {
      console.error('Error deleting actor:', error);
      res.status(500).json({ error: 'Error deleting actor' });
    }
  }

  /**
   * Gets an actor by organization, project and actor codes
   */
  async getActorByOrgProjectAndCode(req: Request, res: Response) {
    const { orgcod, projcod, actorcod } = req.params;

    try {
      const actor = await actorService.getActorByOrgProjectAndCode(orgcod, projcod, actorcod);
      if (!actor) return res.status(404).json({ error: 'Actor not found' });
      res.status(200).json(actor);
    } catch (error) {
      console.error('Error getting actor:', error);
      res.status(500).json({ error: 'Error getting actor' });
    }
  }

  /**
   * Gets all actors for a project
   */
  async getActorsByProject(req: Request, res: Response) {
    const { orgcod, projcod } = req.params;

    try {
      const page = parseInt(req.query.page as string) || undefined;
      const limit = parseInt(req.query.limit as string) || undefined;

      const actors = await actorService.getActorsByProject(orgcod, projcod, page, limit);
      res.status(200).json(actors);
    } catch (err) {
      console.error('Error getting actors:', err);
      res.status(500).json({ error: 'Error getting actors' });
    }
  }

  /**
   * Gets the next unique code for an actor without incrementing the counter
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const nextCode = await actorService.getNextCodePreview(orgcod, projcod);
      res.status(200).json({ nextCode });
    } catch (error) {
      console.error('Error getting next code:', error);
      res.status(500).json({ error: 'Error getting next code' });
    }
  }

  /**
   * Searches actors by name
   */
  async searchActors(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const { name } = req.query;

      if (typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid parameters' });
      }

      const actors = await actorService.searchActorsByName(orgcod, projcod, name);
      res.status(200).json(actors);
    } catch (error) {
      console.error('Error searching actors:', error);
      res.status(500).json({ error: 'Error searching actors' });
    }
  }

  /**
   * Searches actors by date
   */
  async searchActorsByDate(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
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

      const actors = await actorService.searchActorsByDate(
        orgcod,
        projcod,
        year as string,
        month as string
      );

      res.status(200).json(actors);
    } catch (error) {
      console.error('Error searching actors by date:', error);
      res.status(500).json({ error: 'Error searching actors' });
    }
  }

  /**
   * Gets actor statistics for a project
   */
  async getActorStats(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const stats = await actorService.getActorStats(orgcod, projcod);
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error getting actor statistics:', error);
      res.status(500).json({ error: 'Error getting actor statistics' });
    }
  }

  /**
   * Exports actors to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    const { orgcod, projcod } = req.params;
    try {
      const actors = await actorService.getActorsByProject(orgcod, projcod);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Actors');

      // Add headers
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Role', key: 'role', width: 20 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Modification Date', key: 'modificationDate', width: 20 },
        { header: 'Version', key: 'version', width: 10 },
        { header: 'Comments', key: 'comments', width: 40 },
      ];

      // Add data
      actors.forEach(actor => {
        worksheet.addRow({
          code: actor.code,
          name: actor.name,
          role: actor.roleId || 'N/A',
          type: actor.type,
          status: actor.status,
          creationDate: (actor as any).creationDate ?? 'N/A',
          modificationDate: (actor as any).modificationDate ?? 'N/A',
          version: (actor as any).version ?? 'N/A',
          comments: (actor as any).comments ?? '',
        });
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=actors-${orgcod}-${projcod}.xlsx`);

      // Write to response
      await workbook.xlsx.write(res);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      res.status(500).json({ error: 'Error exporting to Excel' });
    }
  }

  /**
   * Exports actors to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    const { orgcod, projcod } = req.params;
    try {
      const actors = await actorService.getActorsByProject(orgcod, projcod);
      const doc = new PDFDocument({ size: 'A4', margin: 30 });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=actors-${orgcod}-${projcod}.pdf`);

      // Pipe PDF to response
      doc.pipe(res);

      // PDF header
      doc.fontSize(18).text(`Actor List for Project ${projcod} - Organization ${orgcod}`, { align: 'center' });
      doc.moveDown();

      // Create table with actor data
      let y = 150;
      const rowHeight = 20;

      // Table headers
      doc.fontSize(12).text('Code', 30, y);
      doc.text('Name', 100, y);
      doc.text('Role', 200, y);
      doc.text('Type', 260, y);
      doc.text('Status', 320, y);
      doc.text('Date', 380, y);
      doc.text('Version', 450, y);

      y += rowHeight;

      // Table rows
      actors.forEach(actor => {
        if (y > 700) { // Create new page if needed
          doc.addPage();
          y = 50;
        }

        doc.fontSize(10).text(actor.code, 30, y);
        doc.text(actor.name, 100, y, { width: 90 });
        doc.text(actor.roleId || 'N/A', 200, y, { width: 50 });
        doc.text(actor.type, 260, y, { width: 50 });
        doc.text(actor.status, 320, y, { width: 50 });
        let creationDateStr: string;
        if (actor?.creationDate instanceof Date) {
          creationDateStr = actor.creationDate.toISOString().split('T')[0];
        } else if (typeof actor?.creationDate === 'string') {
          creationDateStr = actor.creationDate;
        } else {
          creationDateStr = 'N/A';
        }
        doc.text(
          creationDateStr,
          380,
          y,
          { width: 60 }
        );
        doc.text(actor.version, 450, y);

        y += rowHeight;
      });

      // Finalize document
      doc.end();
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      res.status(500).json({ error: 'Error exporting to PDF' });
    }
  }
}

// Export singleton instance of the controller
export const actorController = new ActorController();