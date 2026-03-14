'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ListingWithRelations } from '@/lib/types/listing';
import { format } from 'date-fns';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

interface Props {
    listings: ListingWithRelations[];
}

function exportCSV(listings: ListingWithRelations[]) {
    const headers = [
        'ID',
        'Title',
        'Category',
        'Subcategory',
        'Status',
        'Price (MKD)',
        'City',
        'Condition',
        'Type',
        'Views',
        'Promoted',
        'Date Posted',
    ];

    const rows = listings.map((l) => [
        l.id ?? '',
        `"${(l.title ?? '').replace(/"/g, '""')}"`,
        l.category ?? '',
        l.subCategory ?? '',
        l.status ?? '',
        l.price ?? '',
        l.city ?? '',
        l.condition ?? '',
        l.adType ?? '',
        l.viewCount ?? 0,
        l.isPromoted ? 'Yes' : 'No',
        l.createdAt ? format(new Date(l.createdAt), 'dd/MM/yyyy HH:mm') : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-listings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

async function exportPDF(listings: ListingWithRelations[]) {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('My Listings Export', 14, 18);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy, HH:mm')}  ·  Total listings: ${listings.length}`, 14, 25);
    doc.setTextColor(0);

    autoTable(doc, {
        startY: 30,
        head: [['Title', 'Category', 'Status', 'Price (MKD)', 'City', 'Views', 'Promoted', 'Date Posted']],
        body: listings.map((l) => [
            l.title ?? '—',
            [l.category, l.subCategory].filter(Boolean).join(' › ') || '—',
            l.status ?? '—',
            l.price ? `${l.price.toLocaleString()} MKD` : '—',
            l.city ?? '—',
            l.viewCount ?? 0,
            l.isPromoted ? '✓' : '—',
            l.createdAt ? format(new Date(l.createdAt), 'dd/MM/yyyy') : '—',
        ]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 248, 255] },
        columnStyles: {
            0: { cellWidth: 60 },
            3: { halign: 'right' },
            5: { halign: 'center' },
            6: { halign: 'center' },
        },
    });

    const buffer = doc.output('arraybuffer');
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-listings-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
}

export function MyListingsExportButton({ listings }: Props) {
    if (!listings || listings.length === 0) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full sm:w-auto h-10 rounded-xl font-black text-[9px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.15em] border border-card-foreground/10 bg-card hover:bg-muted/80 gap-3 px-6 shadow-none transition-all active:scale-95 bm-interactive group"
                >
                    <Download className="w-4 h-4 group-hover:text-primary group-hover:scale-110 transition-all duration-300 ease-in-out opacity-60 group-hover:opacity-100" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="rounded-2xl border border-border/50 shadow-2xl bg-popover p-1.5 min-w-[180px]"
            >
                <DropdownMenuItem
                    onClick={() => exportCSV(listings)}
                    className="rounded-xl gap-3 px-4 py-3 font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    Download CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => exportPDF(listings)}
                    className="rounded-xl gap-3 px-4 py-3 font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                    <FileText className="w-4 h-4 text-primary" />
                    Download PDF
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
