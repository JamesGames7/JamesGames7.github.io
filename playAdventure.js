fetch ("adventures/firstAdventure.json")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network not okay');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Problem with fetch operation:', error);
    })