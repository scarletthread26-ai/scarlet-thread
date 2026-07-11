/**
 * Opens a new browser window with the contents of the given element
 * and triggers the browser print dialog.
 *
 * @param elementId - The DOM id of the hidden template element to print
 * @param title     - The title shown in the browser print dialog / PDF filename
 */
export function printDocument(elementId: string, title: string): void {
  const el = document.getElementById(elementId);
  if (!el) {
    console.error(`printDocument: element #${elementId} not found`);
    return;
  }

  const printWindow = window.open("", "_blank", "width=960,height=700,scrollbars=yes");
  if (!printWindow) {
    alert("Pop-up was blocked. Please allow pop-ups for this site and try again.");
    return;
  }

  printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; background: #fff; }
      @page { size: A4; margin: 15mm 15mm 15mm 15mm; }
      @media print {
        html, body { width: 210mm; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    </style>
  </head>
  <body>
    ${el.innerHTML}
  </body>
</html>
  `);
  printWindow.document.close();
  printWindow.focus();

  // Give time for any images / fonts to load before printing
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 400);
}
