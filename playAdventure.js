fetch ("adventures.json")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network not okay');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(adventure => {
            document.getElementById("adventureGrid").insertAdjacentHTML(`beforeend`, `<figure id="${adventure.name}"><div id="${adventure.name}-img" class="possibleAdventure"></div><figcaption>${adventure.name}</figcaption</figure>`);
            document.getElementById(adventure.name + "-img").style.backgroundImage = `url(${adventure.icon})`;
            document.getElementById(adventure.name).addEventListener("click", () => {
                story(adventure);
            })
        });
    })
    .catch(error => {
        console.error('Problem with fetch operation:', error);
    });

function story(adventure) {
    console.log(adventure)

    parentEl = document.getElementById("mainContent");
    while (parentEl.firstChild) {
        parentEl.removeChild(parentEl.firstChild);
    }

    parentEl.insertAdjacentHTML("beforeend", `
        <div id="guide"></div>
    `)
    document.getElementById("guide").style.backgroundImage = `url(${adventure.image})`;

    parentEl.insertAdjacentHTML("beforeend", `
        <div id="text"></div>
    `)

    content = document.getElementById("text");

    content.insertAdjacentHTML("beforeend", `
        <p>${adventure.story[0].text}</p>
    `)

    content.addEventListener("click", () => {
        nextSlide(adventure.story, 1)
    })
}

function nextSlide(story, curSlide) {
    content = document.getElementById("text");
    content.replaceWith(content.cloneNode(true));
    content = document.getElementById("text");

    while (content.firstChild) {
        content.removeChild(content.firstChild); 
    }

    content.insertAdjacentHTML("beforeend", `
        <p>${story[curSlide].text}</p>
    `)

    content.addEventListener("click", () => {
        if (story.length > curSlide + 1) {
            nextSlide(story, curSlide + 1);
        } else {
            console.warn("DONE!")
        }
    })
}