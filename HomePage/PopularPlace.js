const places = [
    {
        name: "Cox's Bazar",
        location: "Cox's Bazar, Bangladesh",
        image: "nature1.jpg"
    },
    {
        name: "Boga Lake",
        location: "Bandarban, Bangladesh",
        image: "bogalake.jpeg"
    },
    {
        name: "Ratargul",
        location: "Sylhet, Bangladesh",
        image: "nature3.jpg"
    },
    {
        name: "Karamjal",
        location: "Sundarban, Bangladesh",
        image: "image.png"
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