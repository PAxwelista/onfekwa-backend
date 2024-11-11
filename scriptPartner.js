const fs = require("fs");

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)]; //Prends un des éléments du tableau de maniere aleatoire.
}

function getRandomTime(min = 9, max = 23) { //Même si rien jamais en dessous de 9h et au dessus de 23h.
  const hour = Math.floor(Math.random() * (max - min)) + min; // Maniere de calculer un nombre aléatoire dans l'interval entre le min et le max 
  return `2023-01-01T${String(hour).padStart(2, "0")}:00:00Z`; //Permet de rajouter "0" si la taille du retour est inferieur à 2.
}

function getCorrectRandomTimeForOpeningAndClosing() {
  const openHour = getRandomTime(9,12); 
  const closingHour = getRandomTime(18,24);
  return [{ openTime: openHour, closingTime: closingHour }]; // Affiche le retour avec un heure d'ouverture et une heure de fermeture.
}

function generateOpeningHours() {
  return {
    monday: getCorrectRandomTimeForOpeningAndClosing(), // Rappelle a chaque fois la fonction getCorrectRandomTimeForOpeningAndClosing()
    tuesday: getCorrectRandomTimeForOpeningAndClosing(),
    wednesday: getCorrectRandomTimeForOpeningAndClosing(),
    thursday: getCorrectRandomTimeForOpeningAndClosing(),
    friday: getCorrectRandomTimeForOpeningAndClosing(),
    saturday: getCorrectRandomTimeForOpeningAndClosing(),
    sunday: getCorrectRandomTimeForOpeningAndClosing(),
  };
}

const etablissements = [
  "Le Rendez-vous",
  "L'Escapade",
  "Chez Léon",
  "La Cascade",
  "Le Refuge",
  "Le Passage",
  "La Terrasse",
  "Les Voisins",
  "Le Jardin Secret",
  "Les Épicuriens",
  "L'Évasion",
  "Le Comptoir",
  "L'Atelier",
  "Le Coin Perdu",
  "Le Plaisir",
  "La Parenthèse",
  "L'Authentique",
  "Le Point Vert",
  "Le Petit Endroit",
  "L'Oasis",
  "La Table Ronde",
  "Les Copains d'Abord",
  "Le Clos",
  "L'Élégance",
  "La Détente",
  "Le Temps Suspendu",
  "L'Esplanade",
  "La Fabrique",
  "Le Prélude",
  "Les Amoureux",
  "La Sérénité",
  "Le Petit Jardin",
  "La Belle Vie",
  "Le Boudoir",
  "Les Artistes",
  "L'Empreinte",
  "Le Détour",
  "L'Instant",
  "Le Cocon",
  "Les Murmures",
  "Le Coin Charmant",
  "La Belle Rencontre",
  "Les Promeneurs",
  "L'Inspiration",
  "Le Sillage",
  "La Roseraie",
  "Le Panier Gourmand",
  "Les Curiosités",
  "La Pause Ensoleillée",
  "Le Parfum des Îles",
  "Les Souvenirs",
  "Le Coin des Amis",
  "Les Saveurs du Monde",
  "La Bulle",
  "L'Horizon",
  "Le Temps d'Un Rêve",
  "Les Arômes",
  "La Balade",
  "Les Racines",
  "Le Quai",
  "Les Rêveries",
  "La Cachette",
  "Le Chant des Cigales",
  "La Parenthèse Douce",
  "Les Nostalgiques",
  "Le Retour",
  "L'Instant Magique",
  "Le Chant des Vagues",
  "Les Rives",
  "Le Plaisir Partagé",
  "L'Étoile Filante",
  "Le Sentier",
  "Le Berceau",
  "Les Ailes du Temps",
  "La Nuit Blanche",
  "L'Antre",
  "La Symphonie",
  "Les Belles Histoires",
  "Le Belvédère",
  "La Bouffée d'Air",
  "Les Étoiles",
  "La Douce Heure",
  "Le Bruit des Feuilles",
  "Les Flâneries",
  "La Grange",
  "L'Orée",
  "Les Reflets",
  "Le Temps Suspendu",
  "La Serre",
  "Les Amis",
  "Le Chemin de Traverse",
  "Les Doux Instants",
  "La Cabane",
  "L'Abri",
  "Les Accords Parfaits",
  "Le Coin Des Secrets",
  "Les Heures Bleues",
  "La Quiétude",
  "L'Envolée",
  "Les Pas Perdus",
  "Le Souffle d'Automne",
  "Les Bruyères",
  "La Péniche",
  "L'Auberge du Soleil",
  "Le Sentiment",
  "Les Bulles de Joie",
  "Le Voyageur",
  "Les Charmes",
  "Le Quai des Brumes",
  "La Source",
  "Les Escapades",
  "Le Beau Rêve",
  "La Falaise",
  "Les Conteurs",
  "Le Passé Simple",
  "L'Aube",
  "Les Étoiles Filantes",
  "Le Refuge Secret",
  "Les Vagues",
  "La Note Sucrée",
  "L'Aparté",
  "Les Cimes",
  "Le Secret",
  "L'Équilibre",
  "Les Émotions",
  "La Plume",
  "Le Souvenir Heureux",
  "Les Éclats de Rire",
  "Le Cœur de Pierre",
  "L'Essentiel",
  "La Lumière",
  "Le Sentier des Épices",
  "Les Moments Doux",
  "La Brise",
  "Les Érables",
  "La Ritournelle",
  "Le Tourbillon",
  "Les Écorces",
  "Le Rêveur",
  "Les Flocons",
  "Le Berlingot",
  "L'Évasion Gourmande",
  "Les Montagnes Bleues",
  "Le Chemin",
  "L'Étang",
  "Les Ailes du Matin",
  "La Clé des Champs",
  "Les Fleurs Sauvages",
  "Le Petit Coin de Paradis",
  "L'Enchantement",
  "La Douce Lumière",
  "Les Vieux Chênes",
  "Le Premier Pas",
  "Les Échappées",
  "La Rencontre",
  "L'Empreinte du Temps",
  "Les Voix du Silence",
  "Le Trésor",
  "Les Contemplations",
  "Le Sentier des Fées",
  "Les Contes",
  "L'Ancienne Route",
  "Les Mystères",
  "La Promenade",
  "L'Au-delà",
  "Le Ciel d'Automne",
  "La Rose des Vents",
  "Le Clair de Lune",
  "L'Escapade Heureuse",
  "Le Sentier Sauvage",
  "Le Petit Bonheur",
  "Les Amours Secrètes",
  "La Cachette Enchantée",
  "Le Masque",
  "Les Échos",
  "Le Palais Secret",
  "Les Étoiles du Soir",
  "Le Banc des Souvenirs",
  "La Source Secrète",
  "L'Envers du Décor",
  "Les Racines du Ciel",
  "L'Allée des Douceurs",
  "Le Refuge Éphémère",
  "Les Dunes",
  "La Lueur",
  "Le Passage des Rêves",
  "Les Champs du Ciel",
  "Le Miroir des Ombres",
  "Les Vignes",
  "L'Aube Dorée",
  "Le Sentier des Merveilles",
  "Les Jardins Suspendus",
  "La Fenêtre",
  "Les Aventures",
  "Le Gîte",
  "Les Rayons de Lune",
  "L'Échappée Belle",
  "Les Écumes",
  "La Clairière",
  "Le Fil du Temps",
  "Les Brumes",
  "La Vie Douce",
  "Le Bout du Monde",
  "Les Marches du Temps",
  "La Perle",
  "Les Secrets Cachés",
  "Le Rivage",
  "Les Ombres",
  "Le Petit Sentier",
  "Les Marins",
  "La Vie en Rose",
  "Le Pavé",
  "Les Doux Parfums",
  "L'Aurore",
  "Les Orangers",
  "Le Manoir",
  "Les Rives du Ciel",
];

const categories = ["Restaurant", "Café", "Bar"];

const descriptionsBar = [
    "Un bar cosy et branché, idéal pour des soirées entre amis autour de cocktails inventifs.",
    "Ambiance festive avec une sélection de bières artisanales et des concerts en live le week-end.",
    "Bar à l'atmosphère feutrée, parfait pour un rendez-vous romantique ou une soirée tranquille.",
    "Un lieu vibrant aux lumières tamisées, avec des mixologues passionnés et une carte de cocktails unique.",
    "Bar à vins accueillant avec une large sélection de vins du terroir et des planches de charcuterie.",
    "Un bar animé avec une grande terrasse et un DJ live, parfait pour profiter des nuits étoilées.",
    "Atmosphère industrielle et cocktails créatifs dans un espace rétro-chic rempli de canapés confortables.",
    "Un bar caché avec une entrée discrète, idéal pour ceux qui aiment les lieux secrets et intimistes.",
    "Un bar à rhums exotiques avec des saveurs des îles et des cocktails inspirés des Caraïbes.",
    "Un rooftop bar offrant une vue imprenable sur la ville, parfait pour des couchers de soleil inoubliables."
];

const descriptionsRestaurant = [
    "Un restaurant gastronomique où chaque plat est une œuvre d'art, préparée avec des produits locaux.",
    "Un bistrot moderne proposant une cuisine créative dans un cadre chaleureux et accueillant.",
    "Restaurant familial avec des plats traditionnels et généreux, à partager dans une ambiance conviviale.",
    "Un lieu raffiné pour les amateurs de cuisine fusion, mélangeant des saveurs du monde entier.",
    "Un restaurant en bord de mer, avec des spécialités de fruits de mer et une vue imprenable.",
    "Cuisine végétarienne inventive dans un cadre verdoyant, parfait pour une pause saine et gourmande.",
    "Un steakhouse où la viande est grillée à la perfection, avec des accompagnements maison savoureux.",
    "Un restaurant italien authentique avec des pâtes fraîches et des pizzas cuites au feu de bois.",
    "Expérience culinaire immersive dans un cadre minimaliste, avec des menus dégustation surprenants.",
    "Un restaurant chaleureux et rustique, parfait pour savourer une cuisine française traditionnelle."
];

const descriptionsCafe = [
    "Un café pittoresque avec une décoration vintage, idéal pour une pause gourmande.",
    "Café artisanal avec des baristas passionnés et des grains de café sélectionnés avec soin.",
    "Un café lumineux avec une terrasse ensoleillée, parfait pour les petits-déjeuners au calme.",
    "Un lieu cosy avec des fauteuils confortables et une ambiance parfaite pour la lecture.",
    "Café éco-responsable, offrant des produits bio et de délicieuses pâtisseries maison.",
    "Un café urbain et animé, avec une sélection de cafés du monde et des options sans gluten.",
    "Un coffee shop spécialisé dans les lattés artistiques et les boissons à base de lait végétal.",
    "Un café minimaliste avec une sélection de pâtisseries raffinées et un service attentionné.",
    "Un lieu de rencontre pour les amateurs de café, avec des ateliers de dégustation réguliers.",
    "Café spacieux avec une ambiance zen et des espaces de travail, parfait pour les freelancers."
];






const filterTypesOptions = ["Chill", "Romantique", "Fun", "Rencontre"];

// URLs d'images libres de droits
const freeImagesRestaurant = [
    "https://images.pexels.com/photos/1833349/pexels-photo-1833349.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/64208/pexels-photo-64208.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/687824/pexels-photo-687824.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/3914691/pexels-photo-3914691.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/735869/pexels-photo-735869.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/744780/pexels-photo-744780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/761854/pexels-photo-761854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];
const freeImagesCafe = [
    "https://images.pexels.com/photos/6151691/pexels-photo-6151691.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/2079295/pexels-photo-2079295.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/1787141/pexels-photo-1787141.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/7255771/pexels-photo-7255771.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/18762753/pexels-photo-18762753/free-photo-of-building-batiment-immeuble-fenetres.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/440182/pexels-photo-440182.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/2574474/pexels-photo-2574474.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/2956952/pexels-photo-2956952.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];
const freeImagesBar = [
    "https://images.pexels.com/photos/7022158/pexels-photo-7022158.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/6503579/pexels-photo-6503579.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/2159074/pexels-photo-2159074.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/1304475/pexels-photo-1304475.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/946118/pexels-photo-946118.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/1850592/pexels-photo-1850592.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/3540/restaurant-alcohol-bar-drinks.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/2835547/pexels-photo-2835547.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/1601775/pexels-photo-1601775.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

const infosAdd = ["Wi-Fi gratuit", "Parking gratuit", "Accessibilité PMR"]

function generatePartner(index) {
    const category = getRandomElement(categories);
  return {
    name: etablissements[index],
    category: category,
    description: getRandomElement(category === "bar" ? descriptionsBar :  category === "Restaurant" ?  descriptionsRestaurant : descriptionsCafe),
    averagePrice: Math.floor((Math.random() * 70) + 5), // de 5 à 75
    averageNote: parseFloat(((Math.random() * 2) +3 ).toFixed(1)), //entre 3 et 5
    urlsPhotos: [
      getRandomElement(category === "bar" ? freeImagesBar :  category === "Restaurant" ?  freeImagesRestaurant : freeImagesCafe),
      getRandomElement(category === "bar" ? freeImagesBar :  category === "Restaurant" ?  freeImagesRestaurant : freeImagesCafe),
      getRandomElement(category === "bar" ? freeImagesBar :  category === "Restaurant" ?  freeImagesRestaurant : freeImagesCafe),
    ],
    infosAdds: [getRandomElement(infosAdd)],
    contact: {
      email: `contact${index + 1}@partner.com`,
      phoneNumber: `123-456-789${index}`,
    },
    adress:
      index % 2 === 0 //ex: 3 modulo 2, reste 1. (dans cet exemple voir si mon exemple est paire)
        ? { //Dans cet exemple le modulo sert à soi mettre l'adresse à Paris, soit à Ajaccio.
            adress: `${index + 10} Rue de l'Exemple`,
            zipCode: 75000 + (index % 20),
            city: "Paris",
            coordinate: {
              lat: 48.866667 + (Math.random() - 0.5) / 5,
              long: 2.333333 + (Math.random() - 0.5) / 10,
            },
          }
        : {
            adress: `${index + 10} Rue de l'Exemple`,
            zipCode: 20000 + (index % 20),
            city: "Ajaccio",
            coordinate: {
              lat: 41.9167 + (Math.random() - 0.5) / 20,
              long: 8.7333 + (Math.random() - 0.5) / 10,
            },
          },
    openingInfos: generateOpeningHours(),
    filterTypes: [
      getRandomElement(filterTypesOptions),
      getRandomElement(filterTypesOptions),
    ],
  };
}
// Crée un tableau appelé `partnersList` contenant 200 éléments.
// `Array.from` est utilisé pour générer un tableau de la longueur spécifiée.
// `{ length: 200 }` définit la longueur du tableau à 200, ce qui signifie qu'il contiendra 200 éléments.
// `(_, i)` est la liste de paramètres de la fonction de rappel. `_` représente chaque élément (ignoré ici),
// et `i` est l'index de l'élément actuel dans le tableau.
// `generatePartner(i)` est appelé avec `i` comme argument pour chaque élément. 
// `generatePartner` est probablement une fonction qui génère un objet ou une valeur en fonction de l'index `i`.
// Le résultat est un tableau de 200 éléments, où chaque élément est généré par `generatePartner` avec son index.
const partnersList = Array.from({ length: 200 }, (_, i) => generatePartner(i));  

// Écrit le contenu de `partnersList` dans un fichier JSON nommé `partnersFictifs.json`.
// `fs.writeFileSync` est une méthode de Node.js qui écrit des données dans un fichier de façon synchrone.
// "partnersFictifs.json" est le nom du fichier de sortie.
// `JSON.stringify(partnersList, null, 2)` convertit `partnersList` en une chaîne JSON formatée.
// `null` et `2` servent à ajouter une indentation de 2 espaces pour rendre le JSON plus lisible.
fs.writeFileSync("partnersFictifs.json", JSON.stringify(partnersList, null, 2));
console.log("Liste de partenaires générée dans partnersFictifs.json");
