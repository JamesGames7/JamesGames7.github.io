fetch ("adventures.json")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network not okay');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(adventure => {
            document.getElementById("adventureGrid").insertAdjacentHTML(`beforeend`, `<figure id="${adventure.name}"><div id="${adventure.name}-img" class="possibleAdventure"></div><figcaption>${adventure.name}</figcaption><figcaption>${localStorage.getItem(adventure.name) ? JSON.parse(localStorage.getItem(adventure.name)).length : 0} / ${adventure.endings} endings found</figcaption></figure>`);
            document.getElementById(adventure.name + "-img").style.backgroundImage = `url(${adventure.icon})`;
            document.getElementById(adventure.name).addEventListener("click", () => {
                story(adventure);
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
        <div id="text">
            <div id="options"></div>
        </div>
        <div id="wrapper">
            <div id="image"></div>
        </div>
    `)

    document.getElementById("image").style.backgroundSize = `800% ${adventure.cols}00%`
    document.getElementById("image").style.backgroundImage = `url(${adventure.image})`;
    document.getElementById("image").style.backgroundPosition = `0 0`;
    console.log(adventure.image);
    console.log(document.getElementById("image").backgroundImage);

    content = document.getElementById("text");

    content.insertAdjacentHTML("beforeend", `
        <p>${adventure.story[0].text}</p>
    `)
    adventure.story[0].transitions.forEach(transition => {
        document.getElementById("options").insertAdjacentHTML("beforeend", `
            <div class="option" id="${transition.transition}-transition">${transition.text}</div>
        `)

        document.getElementById(`${transition.transition}-transition`).addEventListener("click", () => {
            nextSlide(adventure.story, transition.transition - 1, adventure.name, adventure.questions, adventure.icon);
        })
    })
    if (adventure.story[0].transitions.length == 0) {
        content.addEventListener("click", () => {
            nextSlide(adventure.story, 1, adventure.name, adventure.questions, adventure.icon)
        })
    }
}

function nextSlide(story, curSlide, name, questions, icon) {
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
    
    document.getElementById("image").style.backgroundPosition = `-${curSlide % 8}00% -${Math.floor(curSlide / 8)}00%`;
    story[curSlide].transitions.forEach(transition => {
        document.getElementById("options").insertAdjacentHTML("beforeend", `
            <div class="option" id="${transition.transition}-transition">${transition.text}</div>
        `)

        document.getElementById(`${transition.transition}-transition`).addEventListener("click", () => {
            if (transition.transition == "end") {
                end(content, name, story[curSlide].endId, questions, icon);
            } else {
                nextSlide(story, transition.transition - 1, name, questions, icon);
            }
        })
    })
    if (story[curSlide].transitions.length == 0) {
        content.addEventListener("click", () => {
            nextSlide(story, curSlide + 1, name, questions, icon);
        })
    }
}

function end(content, name, endId, questions, icon) {
    content.replaceWith(content.cloneNode(true));
    content = document.getElementById("text");
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    content.parentNode.insertAdjacentHTML("beforeend", `<div id="end"></div><div id="continue">Play Again</div><div id="questions">Answer Questions</div>`);
    content.remove();
    document.getElementById("image").remove();

    document.getElementById("end").addEventListener("click", () => {
        curEndings = localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : [];
        if (!curEndings.includes(endId)) {
            curEndings.push(endId);
        }
        localStorage.setItem(name, JSON.stringify(curEndings));
        location.href = 'playAdventure.html';
    })

    document.getElementById("continue").addEventListener("click", () => {
        curEndings = localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : [];
        if (!curEndings.includes(endId)) {
            curEndings.push(endId);
        }
        localStorage.setItem(name, JSON.stringify(curEndings));
        location.href = 'playAdventure.html';
    })

    document.getElementById("questions").addEventListener("click", () => {
        curEndings = localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : [];
        if (!curEndings.includes(endId)) {
            curEndings.push(endId);
        }
        localStorage.setItem(name, JSON.stringify(curEndings));
        
        this.nextQuestionFn(questions, 0, icon);
    })
}

function nextQuestionFn(questions, index, icon) {
    let parent = document.getElementById("mainContent");
    let length = questions.length;

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    curQuestion = questions[index];

    console.log(questions);
    parent.insertAdjacentHTML("beforeend", `
        <div id="questionWrapper"><div id="singleQuestion">${curQuestion.text}</div></div>
        <div id="questionOptions"></div>
		<div id="nextQuestionWrapper">
			<div id="storyImage"></div>
		</div>
    `);

	document.getElementById("storyImage").style.backgroundImage = `url(${icon})`;
	
	switch (curQuestion.type) {
		case "multi":
			curQuestion.options.forEach(option => {
				document.getElementById("questionOptions").insertAdjacentHTML("beforeend", `<div class="option" id="${option}">${option}</div>`)
				document.getElementById(option).addEventListener("click", () => {
					document.querySelectorAll(".option").forEach(el => {
						if (el.id != curQuestion.correct) {
							el.style.backgroundColor = 'red';
						}
                        clone = el.cloneNode(true);
                        el.replaceWith(clone);
					})

					document.getElementById("nextQuestionWrapper").insertAdjacentHTML("afterbegin", `
						<div id="response">${option === curQuestion.correct ? "Correct!" : `Sorry, the correct answer is '${curQuestion.correct}'`}</div>
						<div id="nextQuestion" class="option">${index < length - 1 ? 'Next Question' : 'Finish'}</div>
					`)

                    document.getElementById("nextQuestion").addEventListener("click", () => {index < length - 1 ? this.nextQuestionFn(questions, index + 1, icon) : location.href = 'playAdventure.html'});
				})
			});
			break;
        case "type":
            window.questions = questions;
            window.index = index;
            window.icon = icon;
            if (curQuestion.size == "long") {
                text = `<textarea name="response">${localStorage.getItem(curQuestion.text) || ""}</textArea>`
            } else {
                text = `<input name="response" value="${localStorage.getItem(curQuestion.text) || ""}">`
            }
            document.getElementById("questionOptions").insertAdjacentHTML("beforeend", `
                <form id="form" name="response" action="#" method="get" onsubmit="document.getElementById('submitButton').disabled = true; return false;">
                    ${text}
                    <input id="submitButton" type="submit" value="Submit" onclick="getAnswer(curQuestion, questions, index, icon)">
                </form>
            `)
            break;
	}
}

function getAnswer(question, questions, index, icon) {
    response = document.response.response.value;
    correct = true;
    if (question.hasOwnProperty("correct")) { 
        question.correct.forEach(answer => {
            if (!response.toLowerCase().includes(answer)) {
                correct = false;
            };
        })

        index = parseInt(index);
        let length = questions.length;

        document.getElementById("nextQuestionWrapper").insertAdjacentHTML("afterbegin", `
            <div id="response">${correct ? "Correct!" : `Sorry, that is incorrect. Read through the story again to find the correct answer!`}</div>
            <div id="nextQuestion" class="option">${index < length - 1 ? 'Next Question' : 'Finish'}</div>
        `)

        document.getElementById("nextQuestion").addEventListener("click", () => {index < length - 1 ? this.nextQuestionFn(questions, index + 1, icon) : location.href = 'playAdventure.html'});
    } else {
        document.getElementById("nextQuestionWrapper").insertAdjacentHTML("afterbegin", `
            <div id="response">Good answer!</div>
            <div id="nextQuestion" class="option">${index < length - 1 ? 'Next Question' : 'Finish'}</div>
        `)

        localStorage.setItem(question.text, response);

        document.getElementById("nextQuestion").addEventListener("click", () => {index < length - 1 ? this.nextQuestionFn(questions, index + 1, icon) : location.href = 'playAdventure.html'});
    }
}