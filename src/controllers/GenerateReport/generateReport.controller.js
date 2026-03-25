const PDFDocument = require("pdfkit");
const Booking = require("../../models/bookingSchema");

async function generateReport(req, res) {
  const { startDate, endDate } = req.query;

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

    // 5. Generar PDF
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=reporte-${startDate}-${endDate}.pdf`
    );

    doc.pipe(res);

    // Título
    doc.fontSize(20).text("Reporte de Reservas", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Periodo: ${startDate} - ${endDate}`, { align: "center" });
    doc.moveDown();
    doc.text("________________________________________________");
    doc.moveDown();

    // Ingresos
    doc.fontSize(16).text("Ingresos Totales");
    doc.moveDown(0.5);
    doc.fontSize(12).text(`$${ingresos[0]?.totalIngresos || 0}`);
    doc.moveDown();
    doc.text("________________________________________________");
    doc.moveDown();

    // Reservas por estado
    doc.fontSize(16).text("Reservas por Estado");
    doc.moveDown(0.5);
    reservasPorEstado.forEach((item) => {
      doc.fontSize(12).text(`- ${item._id}: ${item.total}`);
    });
    doc.moveDown();
    doc.text("________________________________________________");
    doc.moveDown();

    // Reservas por cancha
    doc.fontSize(16).text("Reservas por Cancha");
    doc.moveDown(0.5);
    reservasPorCancha.forEach((item) => {
      doc.fontSize(12).text(`- ${item.name}: ${item.totalReservas} reservas`);
    });
    doc.moveDown();
    doc.text("________________________________________________");
    doc.moveDown();

    // Top usuario
    doc.fontSize(16).text("Usuario con mas Reservas");
    doc.moveDown(0.5);
    if (topUsuario.length > 0) {
      doc.fontSize(12).text(
        `- ${topUsuario[0].nombre} ${topUsuario[0].apellido}: ${topUsuario[0].totalReservas} reservas`
      );
    } else {
      doc.fontSize(12).text("Sin datos");
    }

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
}

module.exports = generateReport;