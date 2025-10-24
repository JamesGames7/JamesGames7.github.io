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

            document.getElementById("clear").addEventListener("click", () => {
                localStorage.clear();
                console.warn("cleared");
            })

            // TODO: make this better; json and parse
            if (localStorage.getItem(adventure.name) == "done") {
                document.getElementById(`${adventure.name}-img`).insertAdjacentHTML("beforeend", `<div class="complete"></div>`)
            }
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
        <div id="text">
            <div id="options"></div>
        </div>
    `)

    content = document.getElementById("text");

    content.insertAdjacentHTML("beforeend", `
        <p>${adventure.story[0].text}</p>
    `)
    adventure.story[0].transitions.forEach(transition => {
        document.getElementById("options").insertAdjacentHTML("beforeend", `
            <div class="option" id="${transition.transition}-transition">${transition.text}</div>
        `)

        document.getElementById(`${transition.transition}-transition`).addEventListener("click", () => {
            console.warn(transition.transition - 1);
            nextSlide(adventure.story, transition.transition - 1);
        })
    })
    if (adventure.story[0].transitions.length == 0) {
        content.addEventListener("click", () => {
            console.warn(1)
            nextSlide(adventure.story, 1)
        })
    }
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
    content.insertAdjacentHTML("beforeend", `
        <div id="options"></div>
    `)
    story[curSlide].transitions.forEach(transition => {
        document.getElementById("options").insertAdjacentHTML("beforeend", `
            <div class="option" id="${transition.transition}-transition">${transition.text}</div>
        `)

        document.getElementById(`${transition.transition}-transition`).addEventListener("click", () => {
            console.warn(transition.transition - 1);
            nextSlide(story, transition.transition - 1);
        })
    })
    if (story[curSlide].transitions.length == 0) {
        content.addEventListener("click", () => {
            console.warn(curSlide + 1);
            nextSlide(story, curSlide + 1);
        })
    }
}

function end(content) {
    content.replaceWith(content.cloneNode(true));
    content = document.getElementById("text");
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    content.parentNode.insertAdjacentHTML("beforeend", `<div id="end"></div>`);
    content.remove();

    document.getElementById("end").addEventListener("click", () => {
        location.href = 'playAdventure.html';
        localStorage.setItem("My First Adventure", "done");
        console.log(localStorage);
    })
}