var express = require("express");
var router = express.Router();

const Partner = require("../models/partners");

const valDay = {
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
  0: "sunday",
};

function getHoursWithMin(date) {
  return date.getHours() + date.getMinutes() / 60;
}

function distanceWord(latA, latB, lonA, lonB) {
  var R = 6371;
  var dLat = deg2rad(latB - latA);
  var dLon = deg2rad(lonB - lonA);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(latA)) *
      Math.cos(deg2rad(latB)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d.toFixed(2);
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Récupère tous les partenaires
router.get("/", (req, res) => {
  Partner.find().then((data) => {
    res.json({ result: true, partners: data });
  });
});

// Récupère les partenaires filté par type d'evenement
//(utile pour filter dans tous les evenements)
router.get("/filter/:filterType", (req, res) => {
  const filterType = req.params.filterType;

  Partner.find({ filterTypes: filterType }).then((data) => {
    res.json({ result: true, partners: data });
  });
});

//Récupère tous les filterType de tous les partenaires
//(En supprimant les doublons)
router.get("/filterTypes", (req, res) => {
  Partner.find({}, "filterTypes").then((data) => {
    const allFilterTypes = data.flatMap((partner) => partner.filterTypes);
    const finalFilterTypes = [...new Set(allFilterTypes)];

    res.json({ result: true, filterTypes: finalFilterTypes });
  });
});

//Récupère un seul partenaire avec le paramètre id
//(Pour afficher les détails sur la page SelectionEvent)
router.get("/selectedPartner/:id", (req, res) => {
  const partnerId = req.params.id;

  Partner.findById(partnerId).then((dataPartner) => {
    if (dataPartner) {
      res.json({ result: true, dataPartner });
    }
  });
});

//récupère les partenraies en fonction des différents filtres
router.post("/randomWithFilter/:number", async (req, res) => {
  const number = req.params.number;
  const { budget, eventType, when, where, distance } = req.body;
  if (budget && eventType && when && where && distance) {
    //pour le budget
    const tabBudget = budget.split("-");
    const budgetMin = Number(tabBudget[0]);
    const budgetMax = Number(tabBudget[1]);

    const data = await Partner.find({
      filterTypes: eventType,
      $and: [
        { averagePrice: { $gte: budgetMin } },
        { averagePrice: { $lte: budgetMax } },
      ],
    });

    //Si la data est vide à cet endroit c'est qu'il n'y a aucun partenaire pour lui
    //avec le type ou le budget donnée
    if (!data.length) {
      res.json({
        result: true,
        empty: true,
        why: "Aucun partenaire avec ce budget",
      });
      return;
    }

    whenDate = new Date(when);
    whenHours = getHoursWithMin(whenDate);

    const dataFilterHours = data.filter(
      (partner) =>
        partner.openingInfos[valDay[whenDate.getDay()]].some((openHours) => {
          const openFormatHours = getHoursWithMin(openHours.openTime);
          const closeFormatHours = getHoursWithMin(openHours.closingTime);
          return openFormatHours < closeFormatHours
            ? openFormatHours < whenHours && closeFormatHours > whenHours
            : openFormatHours < whenHours || closeFormatHours > whenHours;
        }) &&
        distanceWord(
          partner.adress.coordinate.lat,
          where.latitude,
          partner.adress.coordinate.long,
          where.longitude
        ) < distance
    );

    //Si la data est vide à cet endroit c'est qu'il n'y a aucun partenaire pour lui
    //qui sont ouvert au heures données
    if (!dataFilterHours.length) {
      res.json({
        result: true,
        empty: true,
        why: "Aucun partenaire ces heures d'ouvertures",
      });
      return;
    }

    const dataFilterDistance = dataFilterHours.filter(
      (partner) =>
        distanceWord(
          partner.adress.coordinate.lat,
          where.latitude,
          partner.adress.coordinate.long,
          where.longitude
        ) < distance
    );

    //Si la data est vide à cet endroit c'est qu'il n'y a aucun partenaire pour lui
    //qui sont a la distance donnée autour de l'endoit donnée
    if (!dataFilterDistance.length) {
      res.json({
        result: true,
        empty: true,
        why: "Aucun partenaire autour de l'endroit donnée au rayon donnée",
      });
      return;
    }

    const randomDataFilter = dataFilterDistance
      .sort(() => Math.random() - 0.5)
      .slice(dataFilterDistance.length - number);

    res.json({ result: true, empty: false, data: randomDataFilter });
  } else {
    res.json({ result: false, error: "les filtres ne sont pas complets" });
  }
});

module.exports = router;
