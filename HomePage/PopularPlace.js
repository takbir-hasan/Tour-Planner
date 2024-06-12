const places = [
    {
        name: "Cox's Bazar",
        location: "Jashore City, Bangladesh",
        image: "nature1.jpg"
    },
    {
        name: "Chattagram",
        location: "Jashore City, Bangladesh",
        image: "nature2.jpg"
    },
    {
        name: "Cox's Bazar",
        location: "Khulna, Bangladesh",
        image: "nature3.jpg"
    },
   
    
    
];

function updatePopularPlaces() {
    const popularGrid = document.getElementById("popularGrid");

    popularGrid.innerHTML = "";

    places.forEach(place => {
        const card = document.createElement("div");
        card.classList.add("popular__card");

        card.innerHTML = `
            <img src="${place.image}" alt="${place.name}" />
            <div class="popular__content">
                <div class="popular__card__header">
                    <h4>${place.name}</h4>
                    <p>${place.location}</p>
                </div>
            </div>
        `;

        popularGrid.appendChild(card);
    });
}
updatePopularPlaces();