// controllers/role.controller.ts
import { Request, Response } from 'express';
import { roleService } from '../services/role.service';
import { RoleDTO } from '../models/role.model';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class RoleController {
  /**
   * Creates a new role
   */
  async createRole(req: Request, res: Response) {
    try {
      const roleDto: RoleDTO = req.body;

      if (!roleDto.name || roleDto.name.trim() === '') {
        return res.status(400).json({ error: 'Role name is required.' });
      }

      const newRole = await roleService.createRole(roleDto);

      res.status(201).json({
        message: 'Role created successfully.',
        role: newRole,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating role:', err.message);
      
      if (err.message === 'Role name already exists') {
        return res.status(400).json({ error: 'Role name already exists.' });
      }
      
      if (err.message.includes('Invalid status')) {
        return res.status(400).json({ error: err.message });
      }
      
      res.status(500).json({ error: err.message || 'Error creating role.' });
    }
  }

  /**
   * Updates an existing role
   */
  async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const roleDto: Partial<RoleDTO> = req.body;

      const updatedRole = await roleService.updateRole(id, roleDto);

      res.status(200).json({
        message: 'Role updated successfully.',
        role: updatedRole,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating role:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      if (err.message === 'Role name already exists') {
        return res.status(400).json({ error: 'Role name already exists.' });
      }
      
      if (err.message.includes('Invalid status')) {
        return res.status(400).json({ error: err.message });
      }
      
      res.status(500).json({ error: err.message || 'Error updating role.' });
    }
  }

  /**
   * Gets all roles with pagination
   */
  async getRoles(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await roleService.getRoles(page, limit);

      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching roles:', err.message);
      res.status(500).json({ error: 'Error fetching roles.' });
    }
  }

  /**
   * Gets a role by ID
   */
  async getRoleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await roleService.getRoleById(id);

      res.status(200).json(role);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching role:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching role.' });
    }
  }

  /**
   * Gets a role by code
   */
  async getRoleByCode(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const role = await roleService.getRoleByCode(code);

      res.status(200).json(role);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching role by code:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching role by code.' });
    }
  }

  /**
   * Gets a role with full relations
   */
  async getRoleWithRelations(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await roleService.getRoleWithRelations(id);

      res.status(200).json(role);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching role with relations:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching role with relations.' });
    }
  }

  /**
   * Searches roles with filters
   */
  async searchRoles(req: Request, res: Response) {
    try {
      const { name, status } = req.query;

      const searchParams: any = {};
      if (name) searchParams.name = name as string;
      if (status) searchParams.status = status as string;

      const roles = await roleService.searchRoles(searchParams);

      res.status(200).json(roles);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching roles:', err.message);
      res.status(500).json({ error: 'Error searching roles.' });
    }
  }

  /**
   * Gets roles by status
   */
  async getRolesByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const roles = await roleService.getRolesByStatus(status);

      res.status(200).json(roles);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching roles by status:', err.message);
      res.status(500).json({ error: err.message || 'Error fetching roles by status.' });
    }
  }

  /**
   * Gets next role code
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const nextCode = await roleService.getNextCode();

      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  /**
   * Gets role statistics
   */
  async getRoleStats(req: Request, res: Response) {
    try {
      const stats = await roleService.getRoleStats();

      res.status(200).json({
        ...stats,
        message: 'Statistics retrieved successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching role stats:', err.message);
      res.status(500).json({ error: 'Error fetching role stats.' });
    }
  }

  /**
   * Activates a role
   */
  async activateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await roleService.activateRole(id);

      res.status(200).json({
        message: 'Role activated successfully.',
        role,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error activating role:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error activating role.' });
    }
  }

  /**
   * Deactivates a role
   */
  async deactivateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await roleService.deactivateRole(id);

      res.status(200).json({
        message: 'Role deactivated successfully.',
        role,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deactivating role:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error deactivating role.' });
    }
  }

  /**
   * Deletes a role
   */
  async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await roleService.deleteRole(id);

      res.status(200).json({
        message: 'Role deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting role:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      if (err.message.includes('Cannot delete role')) {
        return res.status(400).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error deleting role.' });
    }
  }

  /**
   * Bulk update roles status
   */
  async bulkUpdateRoleStatus(req: Request, res: Response) {
    try {
      const { roleIds, status } = req.body;

      if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
        return res.status(400).json({ error: 'Role IDs array is required.' });
      }

      if (!status || !['Active', 'Inactive'].includes(status)) {
        return res.status(400).json({ error: 'Valid status (Active/Inactive) is required.' });
      }

      const results = await roleService.bulkUpdateRoleStatus(roleIds, status);

      res.status(200).json({
        message: 'Bulk update completed.',
        results,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error in bulk update:', err.message);
      res.status(500).json({ error: 'Error in bulk update.' });
    }
  }

  /**
   * Gets active roles for dropdown
   */
  async getActiveRolesForDropdown(req: Request, res: Response) {
    try {
      const roles = await roleService.getActiveRolesForDropdown();

      res.status(200).json(roles);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching active roles:', err.message);
      res.status(500).json({ error: 'Error fetching active roles.' });
    }
  }

  /**
   * Exports roles to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    try {
      // Get all roles without pagination for complete export
      const allRoles = await roleService.searchRoles({}); // Empty search returns all roles
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Roles');

      // Add title and metadata
      worksheet.mergeCells('A1:H1');
      worksheet.getCell('A1').value = 'Role Report';
      worksheet.getCell('A1').font = { size: 16, bold: true };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };

      // Add export date
      worksheet.mergeCells('A2:H2');
      worksheet.getCell('A2').value = `Generated on: ${new Date().toLocaleString()}`;
      worksheet.getCell('A2').font = { size: 10, italic: true };
      worksheet.getCell('A2').alignment = { horizontal: 'center' };

      // Add headers starting from row 4
      const headerRow = 4;
      worksheet.getRow(headerRow).values = [
        'Code',
        'Name', 
        'Status',
        'Creation Date',
        'Comments',
        'Actor Count',
        'Author Count',
        'Total Assignments'
      ];

      // Style header row
      worksheet.getRow(headerRow).font = { bold: true };
      worksheet.getRow(headerRow).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6FA' }
      };

      // Add data rows
      allRoles.forEach((role, index) => {
        const rowIndex = headerRow + 1 + index;
        worksheet.getRow(rowIndex).values = [
          role.code,
          role.name,
          role.status,
          role.creationDate instanceof Date 
            ? role.creationDate.toLocaleDateString() 
            : new Date(role.creationDate).toLocaleDateString(),
          role.comments ?? 'N/A',
          role.actorCount || 0,
          role.authorCount || 0,
          (role.actorCount || 0) + (role.authorCount || 0)
        ];

        // Alternate row colors
        if (index % 2 === 1) {
          worksheet.getRow(rowIndex).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8F8FF' }
          };
        }
      });

      // Auto-fit columns
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 12 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Creation Date', key: 'creationDate', width: 15 },
        { header: 'Comments', key: 'comments', width: 30 },
        { header: 'Actor Count', key: 'actorCount', width: 12 },
        { header: 'Author Count', key: 'authorCount', width: 13 },
        { header: 'Total Assignments', key: 'totalAssignments', width: 16 }
      ];

      // Add borders to all cells with data
      const totalRows = headerRow + allRoles.length;
      for (let row = headerRow; row <= totalRows; row++) {
        for (let col = 1; col <= 8; col++) {
          worksheet.getCell(row, col).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }
      }

      // Add summary at the bottom
      const summaryRow = totalRows + 2;
      worksheet.getCell(summaryRow, 1).value = 'Summary:';
      worksheet.getCell(summaryRow, 1).font = { bold: true };
      
      const stats = await roleService.getRoleStats();
      worksheet.getCell(summaryRow + 1, 1).value = `Total Roles: ${stats.total}`;
      worksheet.getCell(summaryRow + 2, 1).value = `Active: ${stats.byStatus.active}`;
      worksheet.getCell(summaryRow + 3, 1).value = `Inactive: ${stats.byStatus.inactive}`;
      worksheet.getCell(summaryRow + 4, 1).value = `Total Actors: ${stats.totalActors}`;
      worksheet.getCell(summaryRow + 5, 1).value = `Total Authors: ${stats.totalAuthors}`;

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=roles-report-${new Date().toISOString().split('T')[0]}.xlsx`);

      // Write to response
      await workbook.xlsx.write(res);
    } catch (error) {
      console.error('Error exporting roles to Excel:', error);
      res.status(500).json({ error: 'Error exporting roles to Excel' });
    }
  }

  /**
   * Exports roles to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    try {
      // Get all roles without pagination for complete export
      const allRoles = await roleService.searchRoles({}); // Empty search returns all roles
      const stats = await roleService.getRoleStats();
      
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 40,
        layout: 'landscape' // Better for tables
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=roles-report-${new Date().toISOString().split('T')[0]}.pdf`);

      // Pipe PDF to response
      doc.pipe(res);

      let currentPage = 1;
      const rolesPerPage = 15; // Roles per page
      const totalPages = Math.max(1, Math.ceil(allRoles.length / rolesPerPage)); // At least 1 page

      // Function to add header with pagination
      const addHeader = (pageNumber: number) => {
        // Page number (right top) - Format: 1/10, 2/10, etc.
        doc.fontSize(10).fillColor('black').text(
          `${pageNumber}/${totalPages}`, 
          doc.page.width - 120, 
          40, 
          { align: 'right', width: 80 }
        );

        // Title (center)
        doc.fontSize(20).fillColor('black').text('Role Report', 200, 40, { align: 'center', width: 400 });
        doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, 200, 65, { align: 'center', width: 400 });
      };

      // Add first page header
      addHeader(currentPage);

      // Summary section
      doc.fontSize(14).text('Summary', 40, 100, { underline: true });
      doc.fontSize(10);
      doc.text(`Total Roles: ${stats.total}`, 40, 120);
      doc.text(`Active: ${stats.byStatus.active} | Inactive: ${stats.byStatus.inactive}`, 40, 135);
      doc.text(`Total Actors: ${stats.totalActors} | Total Authors: ${stats.totalAuthors}`, 40, 150);

      // Table setup
      let y = 200;
      const rowHeight = 25;
      const tableLeft = 40;
      
      // Column widths (adjusted for landscape)
      const colWidths = {
        code: 70,
        name: 120,
        status: 60,
        date: 80,
        comments: 150,
        actors: 50,
        authors: 50,
        total: 50
      };

      // Calculate x positions
      let x = tableLeft;
      const colX: {
        code: number;
        name: number;
        status: number;
        date: number;
        comments: number;
        actors: number;
        authors: number;
        total: number;
      } = {
        code: x,
        name: 0,
        status: 0,
        date: 0,
        comments: 0,
        actors: 0,
        authors: 0,
        total: 0,
      };
      x += colWidths.code;
      colX.name = x;
      x += colWidths.name;
      colX.status = x;
      x += colWidths.status;
      colX.date = x;
      x += colWidths.date;
      colX.comments = x;
      x += colWidths.comments;
      colX.actors = x;
      x += colWidths.actors;
      colX.authors = x;
      x += colWidths.authors;
      colX.total = x;

      // Table headers
      doc.fontSize(12).fillColor('black');
      doc.text('Code', colX.code, y);
      doc.text('Name', colX.name, y);
      doc.text('Status', colX.status, y);
      doc.text('Date', colX.date, y);
      doc.text('Comments', colX.comments, y);
      doc.text('Actors', colX.actors, y);
      doc.text('Authors', colX.authors, y);
      doc.text('Total', colX.total, y);

      // Header underline
      y += 15;
      doc.moveTo(tableLeft, y).lineTo(tableLeft + 630, y).stroke();
      y += 10;

      // Table rows
      doc.fontSize(9);
      allRoles.forEach((role, index) => {
        // Check for page break
        if (y > 500) {
          doc.addPage();
          currentPage++;
          addHeader(currentPage); // Add header to new page
          y = 120; // Start after header
          
          // Redraw table headers
          doc.fontSize(12).fillColor('black');
          doc.text('Code', colX.code, y);
          doc.text('Name', colX.name, y);
          doc.text('Status', colX.status, y);
          doc.text('Date', colX.date, y);
          doc.text('Comments', colX.comments, y);
          doc.text('Actors', colX.actors, y);
          doc.text('Authors', colX.authors, y);
          doc.text('Total', colX.total, y);
          
          y += 15;
          doc.moveTo(tableLeft, y).lineTo(tableLeft + 630, y).stroke();
          y += 10;
          doc.fontSize(9);
        }

        // Alternate row background
        if (index % 2 === 1) {
          doc.rect(tableLeft, y - 5, 630, rowHeight).fillColor('#f8f8ff').fill();
          doc.fillColor('black');
        }

        // Row data
        doc.text(role.code, colX.code, y, { width: colWidths.code - 5 });
        doc.text(role.name, colX.name, y, { width: colWidths.name - 5 });
        doc.text(role.status, colX.status, y, { width: colWidths.status - 5 });
        
        const dateStr = role.creationDate instanceof Date 
          ? role.creationDate.toLocaleDateString() 
          : new Date(role.creationDate).toLocaleDateString();
        doc.text(dateStr, colX.date, y, { width: colWidths.date - 5 });
        
        let comments: string;
        if (role.comments) {
          if (role.comments.length > 20) {
            comments = role.comments.substring(0, 20) + '...';
          } else {
            comments = role.comments;
          }
        } else {
          comments = 'N/A';
        }
        doc.text(comments, colX.comments, y, { width: colWidths.comments - 5 });
        
        doc.text((role.actorCount || 0).toString(), colX.actors, y, { width: colWidths.actors - 5 });
        doc.text((role.authorCount || 0).toString(), colX.authors, y, { width: colWidths.authors - 5 });
        doc.text(((role.actorCount || 0) + (role.authorCount || 0)).toString(), colX.total, y, { width: colWidths.total - 5 });

        y += rowHeight;
      });

      // Footer
      doc.fontSize(8).fillColor('gray');
      doc.text(
        `Report generated by Role Management System - ${new Date().toLocaleString()}`,
        tableLeft,
        y + 20,
        { align: 'center' }
      );

      // Finalize document
      doc.end();
    } catch (error) {
      console.error('Error exporting roles to PDF:', error);
      res.status(500).json({ error: 'Error exporting roles to PDF' });
    }
  }
}

// Export singleton instance of the controller
export const roleController = new RoleController();