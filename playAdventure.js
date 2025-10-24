fetch ("adventures.json")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network not okay');
        }
        return response.json();
    })
    .then(data => {
        console.warn(data)
        data.forEach(adventure => {
            console.log(adventure);
            document.getElementById("adventureGrid").insertAdjacentHTML(`beforeend`, `<figure id="${adventure.name}"><div id="${adventure.name}-img" class="possibleAdventure"></div><figcaption>${adventure.name}</figcaption><figcaption>${localStorage.getItem(adventure.name) ? JSON.parse(localStorage.getItem(adventure.name)).length : 0} / ${adventure.endings} endings found</figcaption></figure>`);
            document.getElementById(adventure.name + "-img").style.backgroundImage = `url(${adventure.icon})`;
            document.getElementById(adventure.name).addEventListener("click", () => {
                story(adventure);
            })

            document.getElementById("clear").addEventListener("click", () => {
                localStorage.clear();
            })

            if (localStorage.getItem(adventure.name) ? JSON.parse(localStorage.getItem(adventure.name)).length == adventure.endings : false) {
                document.getElementById(`${adventure.name}-img`).insertAdjacentHTML("beforeend", `<div class="complete"></div>`)
            }
        });
    })
    .catch(error => {
        console.error('Problem with fetch operation:', error);
    });

function story(adventure) {
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
            nextSlide(adventure.story, transition.transition - 1, adventure.name);
        })
    })
    if (adventure.story[0].transitions.length == 0) {
        content.addEventListener("click", () => {
            nextSlide(adventure.story, 1, adventure.name)
        })
    }
}

function nextSlide(story, curSlide, name) {
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
            if (transition.transition == "end") {
                end(content, name, story[curSlide].endId);
            } else {
                nextSlide(story, transition.transition - 1, name);
            }
        })
    })
    if (story[curSlide].transitions.length == 0) {
        content.addEventListener("click", () => {
            nextSlide(story, curSlide + 1, name);
        })
    }
}

function end(content, name, endId) {
    content.replaceWith(content.cloneNode(true));
    content = document.getElementById("text");
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    content.parentNode.insertAdjacentHTML("beforeend", `<div id="end"></div>`);
    content.remove();

    document.getElementById("end").addEventListener("click", () => {
        curEndings = localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : [];
        if (!curEndings.includes(endId)) {
            curEndings.push(endId);
        }
        localStorage.setItem(name, JSON.stringify(curEndings));
        location.href = 'playAdventure.html';
    })
}