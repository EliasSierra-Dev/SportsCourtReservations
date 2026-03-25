const Booking = require("../../models/bookingSchema");
const User = require("../../models/user.models");

async function dashboard(req, res) {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);

    const startOfDay = new Date(
      Date.UTC(
        yesterday.getUTCFullYear(),
        yesterday.getUTCMonth(),
        yesterday.getUTCDate(),
        0,
        0,
        0,
      ),
    );
    const endOfDay = new Date(
      Date.UTC(
        yesterday.getUTCFullYear(),
        yesterday.getUTCMonth(),
        yesterday.getUTCDate(),
        23,
        59,
        59,
      ),
    );

    let bookingDay = await Booking.aggregate([
      { $match: { date: { $gte: startOfDay, $lte: endOfDay } } }, // filtra solo las de hoy
      { $count: "totalReservas" }, // cuenta cuántas hay
    ]);
    const ingresosDia = await Booking.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay },
          status: "confirmed",
        },
      },
      {
        $lookup: {
          from: "courts", // colección a unir
          localField: "court", // campo en Booking
          foreignField: "_id", // campo en Court
          as: "courtData", // nombre del resultado
        },
      },
      { $unwind: "$courtData" }, // convierte el array en objeto
      {
        $group: {
          _id: null,
          totalIngresos: { $sum: "$courtData.pricePerHour" },
        },
      },
    ]);
    const reservasPorEstado = await Booking.aggregate([
      { $match: { date: { $gte: startOfDay, $lte: endOfDay } } },
      {
        $group: {
          _id: "$status", // agrupa por estado
          total: { $sum: 1 }, // cuenta cuántas hay de cada uno
        },
      },
    ]);
    const canchasMasReservada = await Booking.aggregate([
      {
        $group: {
          _id: "$court",
          totalReservas: { $sum: 1 },
        },
      },
      { $sort: { totalReservas: -1 } }, // ordena de mayor a menor
      { $limit: 1 }, // solo la primera
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
          sport: "$courtData.sport",
          totalReservas: 1,
        },
      },
    ]);
    const totalUsuarios = await User.countDocuments({ role: "user" });
    res.status(200).json({
      bookingDay,
      ingresosDia,
      reservasPorEstado,
      canchasMasReservada,
      totalUsuarios,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
}

module.exports = dashboard;
