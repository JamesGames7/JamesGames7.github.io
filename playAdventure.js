fetch ("adventures.json")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network not okay');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(adventure => {
            document.getElementById("adventureGrid").insertAdjacentHTML(`beforeend`, `<div id="${adventure.name}" class="possibleAdventure"></div>`);
            document.getElementById(adventure.name).style.backgroundImage = `url(${adventure.icon})`;
        });
    })
    .catch(error => {
        console.error('Problem with fetch operation:', error);
    })