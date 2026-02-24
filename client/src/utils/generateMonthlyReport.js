import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getAllPayments } from '../api/paymentApi';

export const generateMonthlyReport = async (stats) => {
  try {
    // 1. Fetch and filter payments for the current month
    const allPayments = await getAllPayments();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyPayments = allPayments.filter(payment => {
      const paymentDate = new Date(payment.createdAt);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    });

    // 2. Initialize PDF Document
    const doc = new jsPDF();
    const monthName = now.toLocaleString('default', { month: 'long' });

    // 3. Header & Branding
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38); // NextGenz Red
    doc.text('NEXTGENZ GYM', 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Monthly Business Report - ${monthName} ${currentYear}`, 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 14, 36);

    // 4. Executive Summary Box
    doc.setFillColor(245, 245, 245);
    doc.rect(14, 45, 182, 30, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Executive Summary', 18, 52);
    
    doc.setFontSize(10);
    doc.text(`Total Active Members: ${stats.activeMembers || 0}`, 18, 60);
    doc.text(`Total Trainers: ${stats.totalTrainers || 0}`, 18, 68);
    
    // 🔥 FIX: Safely format the Revenue
    const safeRevenue = Number(stats.currentMonthRevenue || 0);
    doc.setFontSize(12);
    doc.setTextColor(22, 101, 52); // Dark Green
    doc.text(`Total Monthly Revenue: Rs. ${safeRevenue.toLocaleString('en-IN')}`, 100, 64);

    // 5. Transaction Ledger (Table)
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Itemized Transactions', 14, 90);

    if (monthlyPayments.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('No transactions recorded for this month.', 14, 100);
    } else {
      // 🔥 THE MAIN FIX: Safely extract the amount, no matter what it was saved as!
      const tableData = monthlyPayments.map(p => {
        const safeAmount = Number(p.paidAmount || p.totalAmount || p.amount || 0);
        
        return [
          p._id.slice(-6).toUpperCase(),
          new Date(p.createdAt).toLocaleDateString(),
          p.member?.name || 'Unknown',
          p.method || 'N/A',
          `Rs. ${safeAmount.toLocaleString('en-IN')}` // Added proper Indian comma formatting
        ];
      });

      autoTable(doc, {
        startY: 95,
        head: [['Receipt No', 'Date', 'Member Name', 'Method', 'Amount']],
        body: tableData,
        headStyles: { fillColor: [20, 20, 20] }, // Black header
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 4 }
      });
    }

    // 6. Download the PDF
    doc.save(`NextGenz_Report_${monthName}_${currentYear}.pdf`);
    
    return true; // Success flag
  } catch (error) {
    console.error("Report Generation Failed:", error);
    return false; // Error flag
  }
};