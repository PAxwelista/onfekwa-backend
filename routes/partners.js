var express = require("express");
var router = express.Router();

const { checkBody } = require("../modules/checkBody");

const Partner = require("../models/partners");

//valDay sert à afficher le jour de la semaine en fonction du getDay (qui renvoie un chiffre entre 0 et 6).
const valDay = {
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
  0: "sunday",
};

//Permet de renvoyer un chiffre à virgule avec les heures et les minutes.
function getHoursWithMin(date) {
  return date.getHours() + date.getMinutes() / 60;
}

// Fonction `distanceWord` qui calcule la distance entre deux points géographiques donnés par leurs latitudes et longitudes.
// Les paramètres `latA` et `lonA` représentent la latitude et la longitude du premier point (A),
// et `latB` et `lonB` représentent la latitude et la longitude du second point (B).
function distanceWord(latA, latB, lonA, lonB) {
  // Rayon moyen de la Terre en kilomètres.
  var R = 6371;
  // Calcul de la différence de latitude en radians entre les deux points.
  var dLat = deg2rad(latB - latA);
  // Calcul de la différence de longitude en radians entre les deux points.
  var dLon = deg2rad(lonB - lonA);
  // Formule de Haversine pour calculer la distance entre deux points sur une sphère.
  // `a` est une étape intermédiaire dans cette formule, utilisée pour calculer la distance angulaire.
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(latA)) *
      Math.cos(deg2rad(latB)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  // Calcul de `c`, qui représente l'angle central entre les deux points en radians.
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Calcul de la distance en multipliant le rayon de la Terre par l'angle central `c`.
  var d = R * c;
  // Renvoie la distance arrondie à deux décimales.
  return d.toFixed(2);
} // Remarque : Cette fonction dépend d'une fonction `deg2rad` qui convertit les degrés en radians.


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
    // Combine tous les types de filtres de chaque partenaire en un seul tableau
    const allFilterTypes = data.flatMap((partner) => partner.filterTypes);
    // Supprime les doublons dans le tableau pour obtenir uniquement les types de filtres uniques (en lien avec l'affichage des "types d'evenements")
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
  if (!checkBody(req.body, ["budget" , "eventType" , "when" , "where" , "distance"])) {
    res.json({ result: false, error: "Champs manquants à remplir" });
    return;
  }
  
  const number = req.params.number; 
  const { budget, eventType, when, where, distance } = req.body;
  if (budget && eventType && when && where && distance) {
    //pour le budget :
      //Permet d'afficher un budget min et max en fonction de ce qui est envoyé par le front.
    const tabBudget = budget.split("-");
    const budgetMin = Number(tabBudget[0]);
    const budgetMax = Number(tabBudget[1]);

    const data = await Partner.find({
      filterTypes: eventType, 
      $and: [ //permet de récupérer le type d'evenement et le budget moyen
        { averagePrice: { $gte: budgetMin } }, //gte = plus grand que et egal.
        { averagePrice: { $lte: budgetMax } }, //lte = plus petit que et egal.
      ],
    });

    //Si la data est vide à cet endroit c'est qu'il n'y a aucun partenaire pour lui
    //avec le type ou le budget donné
    if (!data.length) {
      res.json({
        result: true,
        empty: true,
        why: "Aucun partenaire avec ce budget",
      });
      return;
    }

    whenDate = new Date(when); //Permet de remplacer la chaine de caractère when par une vraie date.
    whenHours = getHoursWithMin(whenDate); //Permet de récupérer l'heure à laquelle on veut sortir.

    // Filtre les partenaires en fonction de leurs horaires d'ouverture et de la distance
    const dataFilterHours = data.filter(
      (partner) =>
        // Vérifie si le partenaire est ouvert à l'heure spécifiée pour le jour actuel
        partner.openingInfos[valDay[whenDate.getDay()]].some((openHours) => {
          // Formate l'heure d'ouverture en heures et minutes
          const openFormatHours = getHoursWithMin(openHours.openTime);
          // Formate l'heure de fermeture en heures et minutes
          const closeFormatHours = getHoursWithMin(openHours.closingTime);
          // Vérifie si le partenaire est ouvert à l'heure donnée (whenHours) en fonction des horaires d'ouverture
          // Cas 1 : L'heure d'ouverture est avant l'heure de fermeture (ex. 9h - 17h)
          // Cas 2 : L'heure de fermeture est après minuit (ex. 21h - 2h du matin)
          return openFormatHours < closeFormatHours
            ? openFormatHours < whenHours && closeFormatHours > whenHours
            : openFormatHours < whenHours || closeFormatHours > whenHours;
        }) &&
        // Vérifie si le partenaire est dans la distance spécifiée par rapport aux coordonnées données
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
          partner.adress.coordinate.lat, //adress.coordinate (partenaires) et le where.latitude (ma latitude)
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

    // Trie aléatoirement les partenaires filtrés par distance
    const randomDataFilter = dataFilterDistance
      // Utilise une fonction de tri qui retourne un nombre aléatoire pour mélanger les éléments
      .sort(() => Math.random() - 0.5)
      // Sélectionne un sous-ensemble du tableau mélangé avec un nombre spécifique d'éléments
      .slice(dataFilterDistance.length - number);

    // Envoie la réponse JSON avec le résultat de succès et le sous-ensemble aléatoire de données
    res.json({ result: true, empty: false, data: randomDataFilter });
  } else {
    // Si les filtres requis ne sont pas complets, envoie une réponse avec une erreur
    res.json({ result: false, error: "les filtres ne sont pas complets" });
  }
});

module.exports = router;
