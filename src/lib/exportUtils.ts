import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Equipment } from '@/data/mockData';

export const exportToCSV = (equipment: Equipment[], filename: string = 'equipment') => {
  const headers = ['Name', 'Serial Number', 'Department', 'Status', 'Active Repairs', 'Last Maintenance'];
  
  const rows = equipment.map(eq => [
    eq.name,
    eq.serialNumber,
    eq.department,
    eq.status,
    eq.activeRepairs.toString(),
    eq.lastMaintenance,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportToPDF = (equipment: Equipment[], filename: string = 'equipment') => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('Equipment Report', 14, 22);
  
  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

  // Table
  const tableData = equipment.map(eq => [
    eq.name,
    eq.serialNumber,
    eq.department,
    eq.status.charAt(0).toUpperCase() + eq.status.slice(1),
    eq.activeRepairs.toString(),
    eq.lastMaintenance,
  ]);

  autoTable(doc, {
    head: [['Name', 'Serial #', 'Department', 'Status', 'Repairs', 'Last Maint.']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 30 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25 },
    },
  });

  // Summary
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text(`Total Equipment: ${equipment.length}`, 14, finalY + 15);
  doc.text(`Operational: ${equipment.filter(e => e.status === 'operational').length}`, 14, finalY + 22);
  doc.text(`Under Maintenance: ${equipment.filter(e => e.status === 'maintenance').length}`, 14, finalY + 29);
  doc.text(`In Repair: ${equipment.filter(e => e.status === 'repair').length}`, 14, finalY + 36);

  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};
