import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ReportRequest {
  requestName: string;
  method: string;
  url: string;
  status: "success" | "failed";
  statusCode: number;
  responseTime: number;
}

export interface ReportData {
  collectionName: string;
  totalRequests: number;
  successCount: number;
  failedCount: number;
  totalTime: number;
  averageTime: number;
  timestamp: string;
  requests: ReportRequest[];
  loadTestData?: {
    requestsPerSecond: number;
    minResponseTime: number;
    maxResponseTime: number;
    rateLimitDetected: boolean;
  };
}

export function generatePDFReport(data: ReportData): jsPDF {
  const doc = new jsPDF();
  let currentY = 20;

  // ========== COLORFUL HEADER ==========
  // Gradient background (simulated with rectangles)
  doc.setFillColor(99, 102, 241); // Indigo
  doc.rect(0, 0, 210, 40, "F");
  doc.setFillColor(139, 92, 246); // Purple
  doc.rect(0, 30, 210, 10, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("📊 API Test Report", 14, 20);

  // Subtitle
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Collection: ${data.collectionName}`, 14, 30);
  doc.text(`Generated: ${data.timestamp}`, 14, 36);

  currentY = 50;

  // ========== SUMMARY METRICS CARDS ==========
  doc.setTextColor(0, 0, 0);
  const cardWidth = 45;
  const cardHeight = 30;
  const cardSpacing = 2;
  const startX = 10;

  // Card 1: Total Requests
  doc.setFillColor(59, 130, 246); // Blue
  doc.roundedRect(startX, currentY, cardWidth, cardHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("Total Requests", startX + 5, currentY + 8);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(data.totalRequests.toString(), startX + 5, currentY + 20);

  // Card 2: Success Rate
  const successRate = ((data.successCount / data.totalRequests) * 100).toFixed(1);
  doc.setFillColor(34, 197, 94); // Green
  doc.roundedRect(startX + cardWidth + cardSpacing, currentY, cardWidth, cardHeight, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Success Rate", startX + cardWidth + cardSpacing + 5, currentY + 8);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(`${successRate}%`, startX + cardWidth + cardSpacing + 5, currentY + 20);

  // Card 3: Avg Response
  doc.setFillColor(234, 179, 8); // Yellow
  doc.roundedRect(startX + (cardWidth + cardSpacing) * 2, currentY, cardWidth, cardHeight, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Avg Response", startX + (cardWidth + cardSpacing) * 2 + 5, currentY + 8);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.averageTime.toFixed(0)}ms`, startX + (cardWidth + cardSpacing) * 2 + 5, currentY + 20);

  // Card 4: Failed Tests
  doc.setFillColor(239, 68, 68); // Red
  doc.roundedRect(startX + (cardWidth + cardSpacing) * 3, currentY, cardWidth, cardHeight, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Failed", startX + (cardWidth + cardSpacing) * 3 + 5, currentY + 8);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(data.failedCount.toString(), startX + (cardWidth + cardSpacing) * 3 + 5, currentY + 20);

  currentY += cardHeight + 15;

  // ========== DETAILED METRICS TABLE ==========
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("📈 Detailed Metrics", 14, currentY);
  currentY += 5;

  const metricsData = [
    ["Total Requests", data.totalRequests.toString()],
    ["✅ Successful", data.successCount.toString()],
    ["❌ Failed", data.failedCount.toString()],
    ["Success Rate", `${successRate}%`],
    ["Total Duration", `${data.totalTime}ms`],
    ["Average Time", `${data.averageTime.toFixed(2)}ms`],
  ];

  if (data.loadTestData) {
    metricsData.push(
      ["Min Response Time", `${data.loadTestData.minResponseTime.toFixed(2)}ms`],
      ["Max Response Time", `${data.loadTestData.maxResponseTime.toFixed(2)}ms`],
      ["Requests/Second", `${data.loadTestData.requestsPerSecond.toFixed(2)}`],
      ["Rate Limit Hit", data.loadTestData.rateLimitDetected ? "⚠️ Yes" : "✅ No"]
    );
  }

  autoTable(doc, {
    startY: currentY,
    head: [["Metric", "Value"]],
    body: metricsData,
    theme: "grid",
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 11,
    },
    alternateRowStyles: {
      fillColor: [243, 244, 246],
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

  // ========== REQUEST DETAILS TABLE ==========
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("🔍 Request Details", 14, currentY);
  currentY += 5;

  const requestsData = data.requests.map((req) => [
    req.requestName,
    req.method,
    req.url.substring(0, 40) + (req.url.length > 40 ? "..." : ""),
    req.statusCode.toString(),
    req.status === "success" ? "✅" : "❌",
    `${req.responseTime}ms`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Request Name", "Method", "URL", "Status", "Result", "Time"]],
    body: requestsData,
    theme: "grid",
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 50 },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 20, halign: "center" },
      5: { cellWidth: 25, halign: "right" },
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [243, 244, 246],
    },
    didParseCell: function (data) {
      const rowIndex = data.row.index;
      
      // Color-code method column
      if (data.column.index === 1 && data.row.section === "body") {
        const method = requestsData[rowIndex][1];
        if (method === "GET") data.cell.styles.textColor = [34, 197, 94]; // Green
        else if (method === "POST") data.cell.styles.textColor = [59, 130, 246]; // Blue
        else if (method === "PUT") data.cell.styles.textColor = [234, 179, 8]; // Yellow
        else if (method === "DELETE") data.cell.styles.textColor = [239, 68, 68]; // Red
        else if (method === "PATCH") data.cell.styles.textColor = [249, 115, 22]; // Orange
        data.cell.styles.fontStyle = "bold";
      }

      // Color-code result column
      if (data.column.index === 4 && data.row.section === "body") {
        const result = requestsData[rowIndex][4];
        if (result === "✅") {
          data.cell.styles.textColor = [34, 197, 94]; // Green
          data.cell.styles.fillColor = [220, 252, 231]; // Light green bg
        } else {
          data.cell.styles.textColor = [239, 68, 68]; // Red
          data.cell.styles.fillColor = [254, 226, 226]; // Light red bg
        }
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 12;
      }

      // Color-code status codes
      if (data.column.index === 3 && data.row.section === "body") {
        const statusCode = parseInt(requestsData[rowIndex][3]);
        if (statusCode >= 200 && statusCode < 300) {
          data.cell.styles.textColor = [34, 197, 94];
        } else if (statusCode >= 400) {
          data.cell.styles.textColor = [239, 68, 68];
        }
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // ========== FOOTER ==========
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${pageCount} | Generated by API Command Hub`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  return doc;
}

export function generateJSONReport(data: ReportData): string {
  return JSON.stringify(data, null, 2);
}

export function downloadPDF(doc: jsPDF, filename: string) {
  doc.save(filename);
}

export function downloadJSON(jsonString: string, filename: string) {
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
