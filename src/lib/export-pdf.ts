/**
 * PDF Export Utility
 * Uses jsPDF + jspdf-autotable to generate and directly download a .pdf file.
 * No popups, no print dialog — pure client-side blob download.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PdfColumn {
  label: string;
  key: string;
  width?: string; // kept for API compat, ignored (autoTable handles widths)
}

export interface PdfOptions {
  title: string;
  subtitle?: string;
  columns: PdfColumn[];
  rows: Record<string, any>[];
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  logo?: string;      // kept for API compat (emoji logos don't render in jsPDF canvas)
  footerNote?: string;
}

/** Format a raw value into a human-readable string */
function formatCell(val: any): string {
  if (val === null || val === undefined || val === '') return '—';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  return String(val);
}

const STATUS_KEYS = new Set([
  'status', 'accountStatus', 'membershipStatus', 'verificationStatus',
  'promoted', 'isVerified',
]);

/** Returns an RGB fill color for status-type cells */
function statusFill(text: string): [number, number, number] | null {
  const v = text.toUpperCase();
  if (v === 'ACTIVE' || v === 'YES')           return [16, 185, 129];   // emerald
  if (v.includes('PENDING'))                    return [245, 158, 11];   // amber
  if (v === 'REJECTED' || v === 'BANNED'
    || v === 'SUSPENDED')                       return [239, 68, 68];    // red
  if (v === 'NO' || v === 'NONE' || v === 'FREE') return [156, 163, 175]; // gray
  return null;
}

export function exportToPdf(opts: PdfOptions): void {
  const {
    title,
    subtitle,
    columns,
    rows,
    filename = title.toLowerCase().replace(/\s+/g, '-') + '-export',
    orientation = 'landscape',
    footerNote,
  } = opts;

  const now = new Date();
  const generatedAt = now.toLocaleString();

  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;

  // ── Header bar ────────────────────────────────────────────────────────
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, pageW, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title.toUpperCase(), margin, 14);

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text(subtitle, margin, 19.5);
  }

  // Top-right meta
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 200);
  doc.text(`${rows.length} records  •  ${generatedAt}`, pageW - margin, 14, { align: 'right' });

  // ── Table ─────────────────────────────────────────────────────────────
  const head = [columns.map((c) => c.label.toUpperCase())];
  const body = rows.map((row) =>
    columns.map((col) => formatCell(row[col.key]))
  );

  autoTable(doc, {
    startY: 26,
    head,
    body,
    margin: { left: margin, right: margin },
    tableWidth: 'auto',
    styles: {
      fontSize: 7.5,
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
      overflow: 'ellipsize',
      lineColor: [243, 244, 246],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    bodyStyles: {
      textColor: [30, 30, 30],
    },
    // Color status cells
    didParseCell(data) {
      if (data.section !== 'body') return;
      const col = columns[data.column.index];
      if (!col || !STATUS_KEYS.has(col.key)) return;
      const fill = statusFill(String(data.cell.raw ?? ''));
      if (fill) {
        data.cell.styles.fillColor = fill;
        data.cell.styles.textColor = [255, 255, 255];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    // Page footer
    didDrawPage(data) {
      const pageCount = (doc.internal as any).getNumberOfPages();
      const currentPage = data.pageNumber;

      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.setFont('helvetica', 'italic');

      const note = footerNote || 'This document was automatically generated. For official use only.';
      doc.text(note, margin, pageH - 8, { maxWidth: pageW * 0.6 });

      doc.setFont('helvetica', 'normal');
      doc.text(
        `Page ${currentPage} of ${pageCount}`,
        pageW - margin,
        pageH - 8,
        { align: 'right' }
      );
    },
  });

  // ── Download — arraybuffer + explicit PDF MIME guarantees .pdf, not .tmp ──
  const buffer  = doc.output('arraybuffer');
  const pdfBlob = new Blob([buffer], { type: 'application/pdf' });
  const url     = URL.createObjectURL(pdfBlob);
  const a       = document.createElement('a');
  a.href        = url;
  a.download    = `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
