"use client"
import React from "react";

type Item = { name: string; qty: number; price: number };

export default function PrintableReceipt({ buyer, order }: { buyer: { name: string; email?: string }; order: { id: string; items: Item[]; subtotal: number; delivery: number; total: number } }) {
  function handlePrint() {
    const doc = window.open("", "_blank", "noopener,noreferrer");
    if (!doc) return alert("Unable to open print window");
    const html = `
      <html>
        <head>
          <title>Receipt ${order.id}</title>
          <style>
            body{ font-family: Arial, sans-serif; padding: 20px; }
            .h{font-size:20px;font-weight:700}
            table{width:100%;border-collapse:collapse}
            td,th{padding:8px;border-bottom:1px solid #eee}
          </style>
        </head>
        <body>
          <div class="h">SwenAutos Receipt</div>
          <div>Order: ${order.id}</div>
          <div>Buyer: ${buyer.name} ${buyer.email ? `| ${buyer.email}` : ""}</div>
          <hr/>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
            <tbody>
              ${order.items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>₦${(i.price * i.qty).toLocaleString()}</td></tr>`).join("")}
            </tbody>
          </table>
          <div style="margin-top:12px">Subtotal: ₦${order.subtotal.toLocaleString()}</div>
          <div>Delivery: ₦${order.delivery.toLocaleString()}</div>
          <div style="font-weight:700;margin-top:8px">Total: ₦${order.total.toLocaleString()}</div>
          <hr/>
          <div>Thank you for shopping with SwenAutos.</div>
        </body>
      </html>
    `;
    doc.document.write(html);
    doc.document.close();
    doc.focus();
    setTimeout(() => doc.print(), 500);
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={handlePrint} className="px-3 py-2 bg-white border rounded">Print Receipt</button>
      <button onClick={async () => {
        try {
          const html2canvas = (await import('html2canvas')).default;
          const { jsPDF } = await import('jspdf');
          const node = document.createElement('div');
          node.innerHTML = `
            <div style="font-family:Arial;padding:14px;max-width:780px">
              <h2>SwenAutos Receipt</h2>
              <div>Order: ${order.id}</div>
              <div>Buyer: ${buyer.name} ${buyer.email ? `| ${buyer.email}` : ''}</div>
              <hr/>
              ${order.items.map(i => `<div style=\"display:flex;justify-content:space-between;padding:6px 0\"><div>${i.name} x${i.qty}</div><div>₦${(i.price*i.qty).toLocaleString()}</div></div>`).join('')}
              <div style="margin-top:8px">Subtotal: ₦${order.subtotal.toLocaleString()}</div>
              <div>Delivery: ₦${order.delivery.toLocaleString()}</div>
              <div style="font-weight:700;margin-top:8px">Total: ₦${order.total.toLocaleString()}</div>
            </div>
          `;
          document.body.appendChild(node);
          const canvas = await html2canvas(node, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`receipt-${order.id}.pdf`);
          document.body.removeChild(node);
        } catch (e) {
          console.error('PDF export failed', e);
          // fallback to print
          handlePrint();
        }
      }} className="px-3 py-2 bg-blue-700 text-white rounded">Download PDF</button>
    </div>
  );
}
