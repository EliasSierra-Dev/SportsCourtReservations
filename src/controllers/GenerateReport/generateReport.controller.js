const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");
const Booking = require("../../models/bookingSchema");

async function generateReport(req, res) {
  const { startDate, endDate, format } = req.body;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // 1. Ingresos totales
    const ingresos = await Booking.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
          status: "confirmed",
        },
      },
      {
        $lookup: {
          from: "courts",
          localField: "court",
          foreignField: "_id",
          as: "courtData",
        },
      },
      { $unwind: "$courtData" },
      {
        $group: {
          _id: null,
          totalIngresos: { $sum: "$courtData.pricePerHour" },
        },
      },
    ]);

    // 2. Reservas por estado
    const reservasPorEstado = await Booking.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 },
        },
      },
    ]);

    // 3. Reservas por cancha
    const reservasPorCancha = await Booking.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$court",
          totalReservas: { $sum: 1 },
        },
      },
      { $sort: { totalReservas: -1 } },
      {
        $lookup: {
          from: "courts",
          localField: "_id",
          foreignField: "_id",
          as: "courtData",
        },
      },
      { $unwind: "$courtData" },
      {
        $project: {
          name: "$courtData.name",
          totalReservas: 1,
        },
      },
    ]);

    // 4. Usuario con más reservas
    const topUsuario = await Booking.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$user",
          totalReservas: { $sum: 1 },
        },
      },
      { $sort: { totalReservas: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $project: {
          nombre: "$userData.firstName",
          apellido: "$userData.lastName",
          totalReservas: 1,
        },
      },
    ]);

    // Datos consolidados
    const reportData = {
      periodo: `${startDate} - ${endDate}`,
      totalIngresos: ingresos[0]?.totalIngresos || 0,
      reservasPorEstado,
      reservasPorCancha,
      topUsuario: topUsuario[0] || null,
    };

    // PDF
    if (format === "pdf") {
      const doc = new PDFDocument({ margin: 50 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=reporte-${startDate}-${endDate}.pdf`,
      );
      doc.pipe(res);

      doc.fontSize(20).text("Reporte de Reservas", { align: "center" });
      doc.moveDown(0.5);
      doc
        .fontSize(12)
        .text(`Periodo: ${reportData.periodo}`, { align: "center" });
      doc.moveDown();
      doc.text("________________________________________________");
      doc.moveDown();

      doc.fontSize(16).text("Ingresos Totales");
      doc.moveDown(0.5);
      doc.fontSize(12).text(`$${reportData.totalIngresos}`);
      doc.moveDown();
      doc.text("________________________________________________");
      doc.moveDown();

      doc.fontSize(16).text("Reservas por Estado");
      doc.moveDown(0.5);
      reportData.reservasPorEstado.forEach((item) => {
        doc.fontSize(12).text(`- ${item._id}: ${item.total}`);
      });
      doc.moveDown();
      doc.text("________________________________________________");
      doc.moveDown();

      doc.fontSize(16).text("Reservas por Cancha");
      doc.moveDown(0.5);
      reportData.reservasPorCancha.forEach((item) => {
        doc.fontSize(12).text(`- ${item.name}: ${item.totalReservas} reservas`);
      });
      doc.moveDown();
      doc.text("________________________________________________");
      doc.moveDown();

      doc.fontSize(16).text("Usuario con mas Reservas");
      doc.moveDown(0.5);
      if (reportData.topUsuario) {
        doc
          .fontSize(12)
          .text(
            `- ${reportData.topUsuario.nombre} ${reportData.topUsuario.apellido}: ${reportData.topUsuario.totalReservas} reservas`,
          );
      } else {
        doc.fontSize(12).text("Sin datos");
      }

      doc.end();
      return;
    }

    // EXCEL
    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();

      // Hoja 1 - Resumen
      const sheet1 = workbook.addWorksheet("Resumen");
      sheet1.addRow(["Periodo", reportData.periodo]);
      sheet1.addRow(["Ingresos Totales", `$${reportData.totalIngresos}`]);

      // Hoja 2 - Reservas por estado
      const sheet2 = workbook.addWorksheet("Reservas por Estado");
      sheet2.addRow(["Estado", "Total"]);
      reportData.reservasPorEstado.forEach((item) => {
        sheet2.addRow([item._id, item.total]);
      });

      // Hoja 3 - Reservas por cancha
      const sheet3 = workbook.addWorksheet("Reservas por Cancha");
      sheet3.addRow(["Cancha", "Total Reservas"]);
      reportData.reservasPorCancha.forEach((item) => {
        sheet3.addRow([item.name, item.totalReservas]);
      });

      // Hoja 4 - Top usuario
      const sheet4 = workbook.addWorksheet("Top Usuario");
      sheet4.addRow(["Nombre", "Apellido", "Total Reservas"]);
      if (reportData.topUsuario) {
        sheet4.addRow([
          reportData.topUsuario.nombre,
          reportData.topUsuario.apellido,
          reportData.topUsuario.totalReservas,
        ]);
      }

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=reporte-${startDate}-${endDate}.xlsx`,
      );
      await workbook.xlsx.write(res);
      res.end();
      return;
    }

    // CSV
    if (format === "csv") {
      const csvData = [
        { seccion: "Periodo", valor: reportData.periodo },
        { seccion: "Ingresos Totales", valor: `$${reportData.totalIngresos}` },
        ...reportData.reservasPorEstado.map((item) => ({
          seccion: "Reservas por Estado",
          valor: `${item._id}: ${item.total}`,
        })),
        ...reportData.reservasPorCancha.map((item) => ({
          seccion: "Reservas por Cancha",
          valor: `${item.name}: ${item.totalReservas} reservas`,
        })),
        {
          seccion: "Top Usuario",
          valor: reportData.topUsuario
            ? `${reportData.topUsuario.nombre} ${reportData.topUsuario.apellido}: ${reportData.topUsuario.totalReservas} reservas`
            : "Sin datos",
        },
      ];

      const parser = new Parser({ fields: ["seccion", "valor"] });
      const csv = parser.parse(csvData);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=reporte-${startDate}-${endDate}.csv`,
      );
      res.send(csv);
      return;
    }

    res
      .status(400)
      .json({ msg: "Format not supported. Use pdf, excel or csv" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
}

module.exports = generateReport;
