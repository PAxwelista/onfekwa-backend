const fs = require('fs');

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomTime(min=9 , max=23) {
    const hour = Math.floor(Math.random() * (max - min)) + min+1;  // Entre (min)h et (max)h
    return `2023-01-01T${String(hour).padStart(2, '0')}:00:00Z`;
}

function getCorrectRandomTimeForOpeningAndClosing () {
    const openHour = getRandomTime()
    const closingHour = getRandomTime(Number(openHour.split("").slice(11,13).join("")))
    return [{ openTime: openHour, closingTime: closingHour }]
}

function generateOpeningHours() {
    return {
        monday: getCorrectRandomTimeForOpeningAndClosing(),
        tuesday: getCorrectRandomTimeForOpeningAndClosing(),
        wednesday: getCorrectRandomTimeForOpeningAndClosing(),
        thursday: getCorrectRandomTimeForOpeningAndClosing(),
        friday: getCorrectRandomTimeForOpeningAndClosing(),
        saturday: getCorrectRandomTimeForOpeningAndClosing(),
        sunday: getCorrectRandomTimeForOpeningAndClosing(),
    };
}

const categories = ["Restaurant", "Cinéma", "Parc", "Plage", "Musée", "Café", "Salle de sport", "Théâtre"];
const descriptions = [
    "Lieu accueillant avec ambiance relaxante.",
    "Endroit animé pour des sorties entre amis.",
    "Un espace parfait pour les amoureux de la culture.",
    "Un lieu chaleureux avec des options pour se divertir."
];
const filterTypesOptions = ["Chill", "Romantique", "Fun", "Rencontre"];

// URLs d'images libres de droits
const freeImages = [
    "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/761854/pexels-photo-761854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/744780/pexels-photo-744780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/735869/pexels-photo-735869.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/1601775/pexels-photo-1601775.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/2835547/pexels-photo-2835547.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/3540/restaurant-alcohol-bar-drinks.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
];

function generatePartner(index) {
    return {
        name: `Partenaire ${index + 1}`,
        category: getRandomElement(categories),
        description: getRandomElement(descriptions),
        averagePrice: Math.floor(Math.random() * 75) , // de 0 à 75
        averageNote: parseFloat((Math.random() * 5).toFixed(1)),
        urlsPhotos: [getRandomElement(freeImages),getRandomElement(freeImages),getRandomElement(freeImages)],
        infosAdds: ["Wi-Fi gratuit", "Parking gratuit", "Accessibilité PMR"],
        contact: {
            email: `contact${index + 1}@partner.com`,
            phoneNumber: `123-456-789${index}`
        },
        adress: index%2 === 0 ?{
            adress: `${index + 10} Rue de l'Exemple`,
            zipCode: 75000 + (index % 20),
            city: "Paris",
            coordinate: {
                lat: 48.866667 + (Math.random()-0.5)/5,
                long: 2.333333 + (Math.random()-0.5) / 10
            }
        }:{
            adress: `${index + 10} Rue de l'Exemple`,
            zipCode: 20000 + (index % 20),
            city: "Ajaccio",
            coordinate: {
                lat: 41.9167 + (Math.random()-0.5) / 20,
                long: 8.7333 + (Math.random()-0.5) / 10
            }
        }
        ,
        openingInfos: generateOpeningHours(),
        filterTypes: [
            getRandomElement(filterTypesOptions),
            getRandomElement(filterTypesOptions)
        ]
    };
}

const partnersList = Array.from({ length: 200 }, (_, i) => generatePartner(i));

// Sauvegarder en JSON
fs.writeFileSync('partnersFictifs.json', JSON.stringify(partnersList, null, 2));
console.log('Liste de partenaires générée dans partnersFictifs.json');
