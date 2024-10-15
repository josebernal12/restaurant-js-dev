// import puppeteer from "puppeteer";
// import path from "path";
// import { dirname } from "node:path";
// import { fileURLToPath } from "node:url";
// import fs from "fs";
// const __dirname = dirname(fileURLToPath(import.meta.url));
// import os from "os";
// const getUniqueFileName = (basePath, baseName, extension) => {
//   let counter = 1;
//   let filePath = path.join(basePath, `${baseName}${extension}`);

//   while (fs.existsSync(filePath)) {
//     filePath = path.join(basePath, `${baseName}${counter}${extension}`);
//     counter++;
//   }

//   return filePath;
// };

// export const dowloandPdfController = async (req, res) => {
//   const { htmlContent } = req.body;
//   try {
//     // Lanzar Puppeteer
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Cargar el contenido en la página
//     await page.setContent(htmlContent);

//     // Obtener la ruta del escritorio del usuario
//     const desktopPath = path.join(os.homedir(), "Desktop");

//     // Generar un nombre de archivo único (ticket1.pdf, ticket2.pdf, etc.)
//     const pdfPath = getUniqueFileName(desktopPath, "ticket", ".pdf");

//     // Generar el PDF con un nombre único
//     await page.pdf({ path: pdfPath, format: "A4" });

//     await browser.close();

//     // Enviar el PDF como respuesta al cliente
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${path.basename(pdfPath)}`
//     );
//     res.setHeader("Content-Type", "application/pdf");
//     const fileStream = fs.createReadStream(pdfPath);
//     fileStream.pipe(res);
//   } catch (error) {
//     console.error("Error al generar el PDF:", error);
//     res.status(500).send("Error al generar el PDF");
//   }
// };
