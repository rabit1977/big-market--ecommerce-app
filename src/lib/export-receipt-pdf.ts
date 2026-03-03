/**
 * Receipt PDF Export Utility
 * Generates a single-page payment receipt for a promoted listing.
 * Uses jsPDF directly — no autotable needed (it's a form-layout document).
 */

import jsPDF from 'jspdf';

export interface ReceiptData {
  // Platform
  platformName: string;        // e.g. "Pazar.mk"
  platformEmail?: string;
  platformPhone?: string;

  // Receipt identity
  receiptNumber: string;       // e.g. "RCP-20240304-0012" or listing number
  generatedAt?: number;        // timestamp; defaults to now

  // Customer
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerId?: string;          // externalId / Clerk ID

  // Listing
  listingId: string;
  listingTitle: string;
  listingCategory?: string;
  listingCity?: string;
  listingNumber?: number;      // sequential display #

  // Payment
  packageName?: string;        // e.g. "Топ Позиционирање"
  promotionTier?: string;      // e.g. "GOLD"
  durationDays?: number;
  promotionStart?: number;     // timestamp
  promotionEnd?: number;       // timestamp
  amountPaid: number;          // in MKD
  currency?: string;           // default "MKD"
  stripeId?: string;           // Stripe payment intent / session ID
  paymentStatus?: string;      // "COMPLETED" | "PENDING"
  paymentMethod?: string;      // "Card (Stripe)"
}

function fmtDate(ts: number | undefined, locale = 'mk-MK'): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString(locale, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function fmtDateTime(ts: number | undefined, locale = 'mk-MK'): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleString(locale, {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Drawing helpers ────────────────────────────────────────────────────────

function row(doc: jsPDF, y: number, label: string, value: string, w: number) {
  const col1 = 20;
  const col2 = col1 + 70;
  const valW = w - col2 - 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(label.toUpperCase(), col1, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);

  // Wrap long values
  const lines = doc.splitTextToSize(value || '—', valW);
  doc.text(lines, col2, y);

  return y + (lines.length > 1 ? lines.length * 5 : 6);
}

function sectionHeader(doc: jsPDF, y: number, label: string, w: number): number {
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(14, y - 4, w - 28, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text(label.toUpperCase(), 20, y + 2);
  return y + 12;
}

// ── Main export ────────────────────────────────────────────────────────────

export function exportReceiptPdf(data: ReceiptData): void {
  const doc   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const w     = doc.internal.pageSize.getWidth();   // 210
  const h     = doc.internal.pageSize.getHeight();  // 297
  const now   = data.generatedAt ?? Date.now();
  const cur   = data.currency || 'MKD';

  // ── Dark header bar ──────────────────────────────────────────────────
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, w, 36, 'F');

  // Platform name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(data.platformName, 20, 16);

  // "PAYMENT RECEIPT" badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text('PAYMENT RECEIPT', 20, 24);

  // Receipt #
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text(`Receipt: ${data.receiptNumber}`, w - 20, 16, { align: 'right' });
  doc.text(`Issued: ${fmtDateTime(now)}`, w - 20, 23, { align: 'right' });

  // ── Status pill ───────────────────────────────────────────────────────
  const statusText = (data.paymentStatus || 'COMPLETED').toUpperCase();
  const isPaid = statusText === 'COMPLETED';
  doc.setFillColor(isPaid ? 16 : 245, isPaid ? 185 : 158, isPaid ? 129 : 11);
  doc.roundedRect(w - 54, 27, 34, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text(isPaid ? '✓  PAID' : '⏳  PENDING', w - 37, 32, { align: 'center' });

  // ── Amount hero box ───────────────────────────────────────────────────
  let y = 46;
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(14, y, w - 28, 22, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(17, 17, 17);
  doc.text(
    `${data.amountPaid.toLocaleString('mk-MK')} ${cur}`,
    w / 2, y + 14, { align: 'center' }
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text('TOTAL AMOUNT PAID', w / 2, y + 20, { align: 'center' });

  y += 30;

  // ── Separator ─────────────────────────────────────────────────────────
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(14, y, w - 14, y);
  y += 8;

  // ── Customer details ──────────────────────────────────────────────────
  y = sectionHeader(doc, y, 'Customer Details', w);
  y = row(doc, y, 'Full Name',    data.customerName,          w);
  y = row(doc, y, 'Email',        data.customerEmail || '—',  w);
  y = row(doc, y, 'Phone',        data.customerPhone || '—',  w);
  if (data.customerId) {
    y = row(doc, y, 'Account ID',  data.customerId,            w);
  }
  y += 4;

  // ── Listing details ───────────────────────────────────────────────────
  y = sectionHeader(doc, y, 'Listing Details', w);
  if (data.listingNumber) {
    y = row(doc, y, 'Listing No.',  `#${data.listingNumber}`,   w);
  }
  y = row(doc, y, 'Title',         data.listingTitle,           w);
  y = row(doc, y, 'Category',      data.listingCategory || '—', w);
  y = row(doc, y, 'City',          data.listingCity || '—',     w);
  y = row(doc, y, 'Listing ID',    data.listingId,              w);
  y += 4;

  // ── Package / Promotion details ───────────────────────────────────────
  y = sectionHeader(doc, y, 'Package Details', w);
  y = row(doc, y, 'Package',       data.packageName || data.promotionTier || '—', w);
  if (data.durationDays) {
    y = row(doc, y, 'Duration',    `${data.durationDays} days`, w);
  }
  if (data.promotionStart) {
    y = row(doc, y, 'Valid From',  fmtDate(data.promotionStart), w);
  }
  if (data.promotionEnd) {
    y = row(doc, y, 'Valid Until', fmtDate(data.promotionEnd),   w);
  }
  y += 4;

  // ── Payment details ───────────────────────────────────────────────────
  y = sectionHeader(doc, y, 'Payment Details', w);
  y = row(doc, y, 'Payment Method', data.paymentMethod || 'Card (Stripe)',  w);
  y = row(doc, y, 'Payment Status', statusText,                             w);
  if (data.stripeId) {
    y = row(doc, y, 'Transaction ID', data.stripeId,                        w);
  }
  y = row(doc, y, 'Date & Time',     fmtDateTime(now),                      w);
  y += 4;

  // ── Amount breakdown box ───────────────────────────────────────────────
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(14, y, w - 28, 28, 3, 3, 'F');

  const netAmount = data.amountPaid / 1.18;
  const vat       = data.amountPaid - netAmount;

  const lx = 24; const rx = w - 24;
  let by = y + 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Subtotal (excl. VAT 18%)', lx, by);
  doc.text(`${netAmount.toLocaleString('mk-MK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`, rx, by, { align: 'right' });
  by += 6;

  doc.text('VAT (18%)', lx, by);
  doc.text(`${vat.toLocaleString('mk-MK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`, rx, by, { align: 'right' });
  by += 2;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(lx, by + 2, rx, by + 2);
  by += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(17, 17, 17);
  doc.text('TOTAL PAID', lx, by);
  doc.text(`${data.amountPaid.toLocaleString('mk-MK')} ${cur}`, rx, by, { align: 'right' });

  y += 36;

  // ── Footer ─────────────────────────────────────────────────────────────
  doc.setFillColor(17, 17, 17);
  doc.rect(0, h - 22, w, 22, 'F');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'This is an official payment receipt. Please keep it for your records.',
    w / 2, h - 13, { align: 'center' }
  );
  if (data.platformEmail) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `${data.platformName}  •  ${data.platformEmail}${data.platformPhone ? '  •  ' + data.platformPhone : ''}`,
      w / 2, h - 7, { align: 'center' }
    );
  }

  // ── Download — arraybuffer + explicit PDF MIME guarantees .pdf, not .tmp ──
  const filename = `receipt-${data.receiptNumber.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
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
