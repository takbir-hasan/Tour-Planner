const hotels = [
    {
        name: "Zaber Hotel International",
        price: "BDT: 499",
        place: "Jashore City, Bangladesh",
        image: "hotelimage5.jpg"
    },
    {
        name: "PizzaLozy",
        price: "BDT: 999",
        place: "Dhaka City, Bangladesh",
        image: "hotelimage5.jpg"
    },
    {
        name: "Kaccci Bhai",
        price: "BDT: 1000",
        place: "Rajshahi City, Bangladesh",
        image: "hotelimag1.jpg"
    },
    
];

function updatePopularHotels() {
    const popularHotelsContainer = document.getElementById("popularHotels");

    popularHotelsContainer.innerHTML = "";

    hotels.forEach(hotel => {
        const card = document.createElement("div");
        card.classList.add("popular__card");

        card.innerHTML = `
            <img src="${hotel.image}" alt="${hotel.name}" />
            <div class="popular__content">
                <div class="popular__card__header">
                    <h4>${hotel.name}</h4>
                    <h4 class="price">${hotel.price}</h4>
                </div>
                <p class="place">${hotel.place}</p>
            </div>
        `;

        popularHotelsContainer.appendChild(card);
    });
}
updatePopularHotels();
