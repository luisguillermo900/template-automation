// controllers/author.controller.ts - Versión final con exportaciones Excel y PDF
import { Request, Response } from 'express';
import { authorService } from '../services/author.service';
import { AuthorDTO } from '../models/author.model';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class AuthorController {
  /**
   * Creates a new author with all validations
   */
  async createAuthor(req: Request, res: Response) {
    try {
      const authorDto: AuthorDTO = req.body;

      if (!authorDto.firstName || authorDto.firstName.trim() === '') {
        return res.status(400).json({ error: 'First name is required.' });
      }

      const newAuthor = await authorService.createAuthor(authorDto);

      res.status(201).json({
        message: 'Author created successfully.',
        author: newAuthor,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating author:', err.message);
      
      if (err.message === 'DNI already exists') {
        return res.status(400).json({ error: 'DNI already exists.' });
      }
      
      if (err.message === 'Organization not found') {
        return res.status(400).json({ error: 'Organization not found.' });
      }
      
      if (err.message === 'Template author not found') {
        return res.status(400).json({ error: 'Template author not found.' });
      }
      
      res.status(500).json({ error: err.message || 'Error creating author.' });
    }
  }

  /**
   * Updates an author with version increment
   */
  async updateAuthor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authorDto: Partial<AuthorDTO> = req.body;

      const updatedAuthor = await authorService.updateAuthor(id, authorDto);

      res.status(200).json({
        message: `Author updated successfully. New version: ${updatedAuthor.version}`,
        author: updatedAuthor,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating author:', err.message);
      
      if (err.message === 'Author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      if (err.message === 'DNI already exists') {
        return res.status(400).json({ error: 'DNI already exists.' });
      }
      
      if (err.message === 'Organization not found') {
        return res.status(400).json({ error: 'Organization not found.' });
      }
      
      res.status(500).json({ error: err.message || 'Error updating author.' });
    }
  }

  /**
   * Gets organization options for dropdown
   */
  async getOrganizationOptions(req: Request, res: Response) {
    try {
      const organizations = await authorService.getOrganizationOptions();

      res.status(200).json(organizations);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching organizations:', err.message);
      res.status(500).json({ error: 'Error fetching organizations.' });
    }
  }

  /**
   * Gets template author options for dropdown
   */
  async getTemplateAuthorOptions(req: Request, res: Response) {
    try {
      const templateAuthors = await authorService.getTemplateAuthorOptions();

      res.status(200).json(templateAuthors);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching template authors:', err.message);
      res.status(500).json({ error: 'Error fetching template authors.' });
    }
  }

  /**
   * Copies permissions from template author
   */
  async copyPermissionsFromTemplate(req: Request, res: Response) {
    try {
      const { templateAuthorId } = req.params;

      const permissions = await authorService.copyPermissionsFromTemplate(templateAuthorId);

      res.status(200).json({
        message: 'Permissions copied successfully.',
        permissions,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error copying permissions:', err.message);
      
      if (err.message === 'Template author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error copying permissions.' });
    }
  }

  /**
   * Gets version history for an author
   */
  async getVersionHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const history = await authorService.getVersionHistory(id);

      res.status(200).json(history);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching version history:', err.message);
      res.status(500).json({ error: 'Error fetching version history.' });
    }
  }

  /**
   * Gets authors by specific permission
   */
  async getAuthorsByPermission(req: Request, res: Response) {
    try {
      const { permission } = req.params;

      const authors = await authorService.getAuthorsByPermission(permission);

      res.status(200).json(authors);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching authors by permission:', err.message);
      res.status(500).json({ error: 'Error fetching authors by permission.' });
    }
  }

  /**
   * Bulk update permissions for multiple authors
   */
  async bulkUpdatePermissions(req: Request, res: Response) {
    try {
      const { authorIds, permissions } = req.body;

      if (!authorIds || !Array.isArray(authorIds) || authorIds.length === 0) {
        return res.status(400).json({ error: 'Author IDs array is required.' });
      }

      if (!permissions) {
        return res.status(400).json({ error: 'Permissions object is required.' });
      }

      const results = await authorService.bulkUpdatePermissions(authorIds, permissions);

      res.status(200).json({
        message: 'Bulk permissions update completed.',
        results,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error in bulk permissions update:', err.message);
      res.status(500).json({ error: 'Error in bulk permissions update.' });
    }
  }

  /**
   * Gets enhanced statistics with permissions
   */
  async getAuthorStats(req: Request, res: Response) {
    try {
      const stats = await authorService.getAuthorStats();

      res.status(200).json({
        ...stats,
        message: 'Statistics retrieved successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching author stats:', err.message);
      res.status(500).json({ error: 'Error fetching author stats.' });
    }
  }

  /**
   * Deletes an author safely (removes from interviews first)
   */
  async deleteAuthor(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await authorService.deleteAuthor(id);

      res.status(200).json({
        message: 'Author deleted successfully. Associated interviews were updated.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting author:', err.message);
      
      if (err.message === 'Author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error deleting author.' });
    }
  }

  async getAuthors(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await authorService.getAuthors(page, limit);

      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching authors:', err.message);
      res.status(500).json({ error: 'Error fetching authors.' });
    }
  }

  async getAuthorById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const author = await authorService.getAuthorById(id);

      res.status(200).json(author);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching author:', err.message);
      
      if (err.message === 'Author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching author.' });
    }
  }

  async searchAuthors(req: Request, res: Response) {
    try {
      const { 
        firstName, 
        paternalSurname, 
        dni, 
        phone, 
        organizationId, 
        status, 
        roleId,
        hasPermissions 
      } = req.query;

      const searchParams: any = {};
      if (firstName) searchParams.firstName = firstName as string;
      if (paternalSurname) searchParams.paternalSurname = paternalSurname as string;
      if (dni) searchParams.dni = dni as string;
      if (phone) searchParams.phone = phone as string;
      if (organizationId) searchParams.organizationId = organizationId as string;
      if (status) searchParams.status = status as string;
      if (roleId) searchParams.roleId = roleId as string;
      if (hasPermissions) {
        searchParams.hasPermissions = Array.isArray(hasPermissions) 
          ? hasPermissions 
          : [hasPermissions];
      }

      const authors = await authorService.searchAuthors(searchParams);

      res.status(200).json(authors);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching authors:', err.message);
      res.status(500).json({ error: 'Error searching authors.' });
    }
  }

  async getAuthorsByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const authors = await authorService.getAuthorsByStatus(status);

      res.status(200).json(authors);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching authors by status:', err.message);
      res.status(500).json({ error: err.message || 'Error fetching authors by status.' });
    }
  }

  async getNextCode(req: Request, res: Response) {
    try {
      const nextCode = await authorService.getNextCodePreview();

      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  async activateAuthor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const author = await authorService.activateAuthor(id);

      res.status(200).json({
        message: `Author activated successfully. New version: ${author.version}`,
        author,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error activating author:', err.message);
      
      if (err.message === 'Author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error activating author.' });
    }
  }

  async deactivateAuthor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const author = await authorService.deactivateAuthor(id);

      res.status(200).json({
        message: `Author deactivated successfully. New version: ${author.version}`,
        author,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deactivating author:', err.message);
      
      if (err.message === 'Author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error deactivating author.' });
    }
  }

  async getAuthorByCode(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const author = await authorService.getAuthorByCode(code);

      res.status(200).json(author);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching author by code:', err.message);
      
      if (err.message === 'Author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching author by code.' });
    }
  }

  async getAuthorsByRole(req: Request, res: Response) {
    try {
      const { roleId } = req.params;
      const authors = await authorService.getAuthorsByRole(roleId);

      res.status(200).json(authors);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching authors by role:', err.message);
      res.status(500).json({ error: 'Error fetching authors by role.' });
    }
  }

  async getAuthorsWithInterviewCount(req: Request, res: Response) {
    try {
      const authors = await authorService.getAuthorsWithInterviewCount();

      res.status(200).json(authors);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching authors with interview count:', err.message);
      res.status(500).json({ error: 'Error fetching authors with interview count.' });
    }
  }

  async bulkUpdateAuthorStatus(req: Request, res: Response) {
    try {
      const { authorIds, status } = req.body;

      if (!authorIds || !Array.isArray(authorIds) || authorIds.length === 0) {
        return res.status(400).json({ error: 'Author IDs array is required.' });
      }

      if (!status || !['Active', 'Inactive'].includes(status)) {
        return res.status(400).json({ error: 'Valid status (Active/Inactive) is required.' });
      }

      const results = await authorService.bulkUpdateAuthorStatus(authorIds, status);

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
   * Exports authors to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    try {
      const allAuthors = await authorService.getAuthorsWithInterviewCount();
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Authors');

      // Title and metadata
      worksheet.mergeCells('A1:M1');
      worksheet.getCell('A1').value = 'Author Report';
      worksheet.getCell('A1').font = { size: 16, bold: true };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };

      worksheet.mergeCells('A2:M2');
      worksheet.getCell('A2').value = `Generated on: ${new Date().toLocaleString()}`;
      worksheet.getCell('A2').font = { size: 10, italic: true };
      worksheet.getCell('A2').alignment = { horizontal: 'center' };

      // Headers
      const headerRow = 4;
      worksheet.getRow(headerRow).values = [
        'Code', 'First Name', 'Paternal Surname', 'Maternal Surname', 
        'Status', 'DNI', 'Phone', 'Organization', 'Role', 
        'Interview Count', 'Version', 'Creation Date', 'Permissions Count'
      ];

      worksheet.getRow(headerRow).font = { bold: true };
      worksheet.getRow(headerRow).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6FA' }
      };

      // Data rows
      allAuthors.forEach((author, index) => {
        const rowIndex = headerRow + 1 + index;
        const permissionCount: number = Object.values(author.permissions).reduce(
          (count: number, group) => 
            count + Object.values(group as Record<string, boolean>).filter(Boolean).length, 
          0
        );
        
        worksheet.getRow(rowIndex).values = [
          author.code,
          author.firstName,
          author.paternalSurname || 'N/A',
          author.maternalSurname || 'N/A',
          author.status,
          author.dni || 'N/A',
          author.phone || 'N/A',
          author.organization?.name || 'N/A',
          author.role?.name || 'N/A',
          author.interviewCount || 0,
          author.version,
          author.creationDate instanceof Date 
            ? author.creationDate.toLocaleDateString() 
            : new Date(author.creationDate).toLocaleDateString(),
          permissionCount
        ];

        if (index % 2 === 1) {
          worksheet.getRow(rowIndex).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8F8FF' }
          };
        }
      });

      // Auto-fit columns
      worksheet.columns.forEach(column => {
        column.width = 15;
      });

      // Borders
      const totalRows = headerRow + allAuthors.length;
      for (let row = headerRow; row <= totalRows; row++) {
        for (let col = 1; col <= 13; col++) {
          worksheet.getCell(row, col).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }
      }

      // Summary
      const summaryRow = totalRows + 2;
      worksheet.getCell(summaryRow, 1).value = 'Summary:';
      worksheet.getCell(summaryRow, 1).font = { bold: true };
      
      const stats = await authorService.getAuthorStats();
      worksheet.getCell(summaryRow + 1, 1).value = `Total Authors: ${stats.total}`;
      worksheet.getCell(summaryRow + 2, 1).value = `Active: ${stats.byStatus.active}`;
      worksheet.getCell(summaryRow + 3, 1).value = `Inactive: ${stats.byStatus.inactive}`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=authors-report-${new Date().toISOString().split('T')[0]}.xlsx`);

      await workbook.xlsx.write(res);
    } catch (error) {
      console.error('Error exporting authors to Excel:', error);
      res.status(500).json({ error: 'Error exporting authors to Excel' });
    }
  }

  /**
   * Exports authors to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    try {
      const allAuthors = await authorService.getAuthorsWithInterviewCount();
      const stats = await authorService.getAuthorStats();
      
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 40,
        layout: 'landscape'
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=authors-report-${new Date().toISOString().split('T')[0]}.pdf`);

      doc.pipe(res);

      let currentPage = 1;
      const authorsPerPage = 15; // Authors per page
      const totalPages = Math.max(1, Math.ceil(allAuthors.length / authorsPerPage)); // At least 1 page

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
        doc.fontSize(20).fillColor('black').text('Author Report', 200, 40, { align: 'center', width: 400 });
        doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, 200, 65, { align: 'center', width: 400 });
      };

      // Add first page header
      addHeader(currentPage);

      // Summary
      doc.fontSize(14).text('Summary', 40, 100, { underline: true });
      doc.fontSize(10);
      doc.text(`Total Authors: ${stats.total}`, 40, 120);
      doc.text(`Active: ${stats.byStatus.active} | Inactive: ${stats.byStatus.inactive}`, 40, 135);
      doc.text(`Total Interviews: ${stats.totalInterviews}`, 40, 150);
      doc.text(`Average Permissions per Author: ${stats.averagePermissionsPerAuthor.toFixed(1)}`, 40, 165);
      
      // DNI Information
      doc.fontSize(10).fillColor('gray');
      doc.text('DNI Format: Accepts 8-11 digits (standard Peruvian format)', 400, 120);
      doc.text('Examples: 12345678, 87654321, 12345678901', 400, 135);
      doc.fillColor('black');

      // Table
      let y = 200;
      const rowHeight = 25;
      const tableLeft = 40;
      
      const colWidths = {
        code: 60,
        name: 100,
        surname: 80,
        status: 50,
        org: 100,
        role: 80,
        interviews: 50,
        permissions: 60
      };

      let x = tableLeft;
      const colX = {
        code: x,
        name: x += colWidths.code,
        surname: x += colWidths.name,
        status: x += colWidths.surname,
        org: x += colWidths.status,
        role: x += colWidths.org,
        interviews: x += colWidths.role,
        permissions: x += colWidths.interviews
      };

      // Headers
      doc.fontSize(10).fillColor('black');
      doc.text('Code', colX.code, y);
      doc.text('Name', colX.name, y);
      doc.text('Surname', colX.surname, y);
      doc.text('Status', colX.status, y);
      doc.text('Organization', colX.org, y);
      doc.text('Role', colX.role, y);
      doc.text('Interviews', colX.interviews, y);
      doc.text('Permissions', colX.permissions, y);

      y += 15;
      doc.moveTo(tableLeft, y).lineTo(tableLeft + 630, y).stroke();
      y += 10;

      // Rows
      doc.fontSize(8);
      allAuthors.forEach((author, index) => {
        if (y > 500) {
          doc.addPage();
          currentPage++;
          addHeader(currentPage); // Add header to new page
          y = 120; // Start after header
          
          // Redraw table headers
          doc.fontSize(10).fillColor('black');
          doc.text('Code', colX.code, y);
          doc.text('Name', colX.name, y);
          doc.text('Surname', colX.surname, y);
          doc.text('Status', colX.status, y);
          doc.text('Organization', colX.org, y);
          doc.text('Role', colX.role, y);
          doc.text('Interviews', colX.interviews, y);
          doc.text('Permissions', colX.permissions, y);
          
          y += 15;
          doc.moveTo(tableLeft, y).lineTo(tableLeft + 630, y).stroke();
          y += 10;
          doc.fontSize(8);
        }

        if (index % 2 === 1) {
          doc.rect(tableLeft, y - 5, 630, rowHeight).fillColor('#f8f8ff').fill();
          doc.fillColor('black');
        }

        const permissionCount = Object.values(author.permissions).reduce(
          (count: number, group) => 
            count + Object.values(group as Record<string, boolean>).filter(Boolean).length, 
          0
        );

        doc.text(author.code, colX.code, y, { width: colWidths.code - 5 });
        doc.text(author.firstName, colX.name, y, { width: colWidths.name - 5 });
        doc.text(author.paternalSurname || 'N/A', colX.surname, y, { width: colWidths.surname - 5 });
        doc.text(author.status, colX.status, y, { width: colWidths.status - 5 });
        
        const orgName = author.organization?.name || 'N/A';
        const truncatedOrg = orgName.length > 15 ? orgName.substring(0, 15) + '...' : orgName;
        doc.text(truncatedOrg, colX.org, y, { width: colWidths.org - 5 });
        
        doc.text(author.role?.name || 'N/A', colX.role, y, { width: colWidths.role - 5 });
        doc.text((author.interviewCount || 0).toString(), colX.interviews, y, { width: colWidths.interviews - 5 });
        doc.text(permissionCount.toString(), colX.permissions, y, { width: colWidths.permissions - 5 });

        y += rowHeight;
      });

      // Footer
      doc.fontSize(8).fillColor('gray');
      doc.text(
        `Report generated by Author Management System - ${new Date().toLocaleString()}`,
        tableLeft,
        y + 20,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      console.error('Error exporting authors to PDF:', error);
      res.status(500).json({ error: 'Error exporting authors to PDF' });
    }
  }
}

// Export singleton instance of the controller
export const authorController = new AuthorController();