const PDFDocument = require("pdfkit");

exports.generatePDF = async (order, items) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument();

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });
    doc.on("error", reject);

    doc.fontSize(16).text(`Order #${order.id}`, { underline: true });
    doc.moveDown().fontSize(12);
    doc.text(`Customer ID: ${order.customer_id}`);
    doc.text(`Order Date: ${order.order_date}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();

    items.forEach((item, i) => {
      doc.text(`Item ${i + 1}: ${item.product_name}`);
      doc.text(`Quantity: ${item.quantity}`);
      doc.text(`Price: $${item.price}`);
      doc.text(`Size: ${item.sizes || "N/A"}`);

      if (item.design_data) {
        try {
          const designText =
            typeof item.design_data === "string"
              ? item.design_data
              : JSON.stringify(item.design_data, null, 2);
          doc.text(`Design: ${designText}`);
        } catch (error) {
          doc.text("Design: Unable to parse design data");
        }
      } else {
        doc.text("Design: No design data available");
      }

      doc.moveDown();
    });

    doc.end();
  });
};
