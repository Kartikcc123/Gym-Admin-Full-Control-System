import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // FIXED: Import autoTable directly

export const generateInvoice = (payment) => {
  const doc = new jsPDF();

  // Add Gym Branding (Header)
  doc.setFontSize(22);
  doc.setTextColor(220, 38, 38);
  doc.text('NEXTGENZ GYM', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('123 Fitness Street, Tech Park', 14, 26);
  doc.text('Bhilwara, Rajasthan 311001', 14, 31);
  doc.text('Phone: +91 99999 00000', 14, 36);

  // Add Invoice Details
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 160, 20);
  
  doc.setFontSize(10);
  doc.text(`Receipt No: ${payment._id.slice(-6).toUpperCase()}`, 150, 26);
  doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 150, 31);
  doc.text(`Status: PAID`, 150, 36);

  // Add Customer Details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Billed To:', 14, 50);
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Name: ${payment.member?.name || 'Walk-in Customer'}`, 14, 56);
  doc.text(`Phone: ${payment.member?.phone || 'N/A'}`, 14, 61);

  // FIXED: Call autoTable directly and pass 'doc' into it
  const tableData = [
    ['Gym Membership / Service Fee', payment.method, `Rs. ${payment.amount}`]
  ];

  autoTable(doc, {
    startY: 75,
    head: [['Description', 'Payment Method', 'Amount']],
    body: tableData,
    headStyles: { fillColor: [220, 38, 38] }, 
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 5 }
  });

  // Add Total Footer
  const finalY = doc.lastAutoTable.finalY || 75;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Paid: Rs. ${payment.amount}`, 14, finalY + 15);

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for training with NextGenz Solutions!', 14, finalY + 30);

  // Trigger the browser download
  doc.save(`Invoice_${payment.member?.name?.replace(/\s+/g, '_') || 'Member'}_${payment._id.slice(-4)}.pdf`);
};