const fs = require('fs');

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomTime() {
    const hour = Math.floor(Math.random() * 8) + 9;  // Entre 9h et 17h
    return `2023-01-01T${String(hour).padStart(2, '0')}:00:00Z`;
}

function generateOpeningHours() {
    return {
        monday: [{ openTime: getRandomTime(), closingTime: getRandomTime() }],
        tuesday: [{ openTime: getRandomTime(), closingTime: getRandomTime() }],
        wednesday: [{ openTime: getRandomTime(), closingTime: getRandomTime() }],
        thursday: [{ openTime: getRandomTime(), closingTime: getRandomTime() }],
        friday: [{ openTime: getRandomTime(), closingTime: getRandomTime() }],
        saturday: [{ openTime: getRandomTime(), closingTime: getRandomTime() }],
        sunday: [{ openTime: getRandomTime(), closingTime: getRandomTime() }]
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
    "https://images.pexels.com/photos/735869/pexels-photo-735869.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
];

function generatePartner(index) {
    return {
        name: `Partenaire ${index + 1}`,
        category: getRandomElement(categories),
        description: getRandomElement(descriptions),
        averagePrice: Math.floor(Math.random() * 50) + 5,
        averageNote: parseFloat((Math.random() * 5).toFixed(1)),
        urlsPhotos: [getRandomElement(freeImages)],
        infosAdds: ["Wi-Fi gratuit", "Parking gratuit", "Accessibilité PMR"],
        contact: {
            email: `contact${index + 1}@partner.com`,
            phoneNumber: `123-456-789${index}`
        },
        adress: {
            adress: `${index + 10} Rue de l'Exemple`,
            zipCode: 75000 + (index % 20),
            city: "Paris",
            coordinate: {
                lat: 48.8566 + Math.random() / 100,
                long: 2.3522 + Math.random() / 100
            }
        },
        openingInfos: generateOpeningHours(),
        filterTypes: [
            getRandomElement(filterTypesOptions),
            getRandomElement(filterTypesOptions)
        ]
    };
}

const partnersList = Array.from({ length: 40 }, (_, i) => generatePartner(i));

// Sauvegarder en JSON
fs.writeFileSync('partnersFictifs.json', JSON.stringify(partnersList, null, 2));
console.log('Liste de partenaires générée dans partnersFictifs.json');
