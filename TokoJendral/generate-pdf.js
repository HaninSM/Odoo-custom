const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'docs', 'tutorial.html');
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });

  const pdfPath = path.resolve(__dirname, 'docs', 'Tutorial_POS_System.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', right: '18mm', bottom: '20mm', left: '18mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="width:100%;text-align:center;font-size:9px;color:#9ca3af;padding:0 20mm;">Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></div>'
  });

  console.log(`PDF berhasil dibuat: ${pdfPath}`);
  await browser.close();
})();
