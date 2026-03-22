
const Court = require("../../models/courtSchema");

async function registerCourt(req, res) {
  const { name, sport, location, pricePerHour, available, schedule, description } =
    req.body;

  try {
    const court = await Court.findOne({name: name});

    if (court) {
      return res.status(400).json({ msg: "the court already exists" });
    }
    let newCourt = new Court({
      name,
      sport,
      location,
      pricePerHour,
      available,
      schedule,
      description,
    });

    await newCourt.save();
    res.status(201).json({
      msg: "court successfully registered",
      court: {
        name: newCourt.name,
        sport: newCourt.sport,
        location: newCourt.location,
        pricePerHour: newCourt.pricePerHour,
        available: newCourt.available,
        schedule: newCourt.schedule,
        description: newCourt.description,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
        msg: 'An error occurred while trying to register the court'
    })
  }
}

module.exports = registerCourt;