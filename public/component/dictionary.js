let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = '0f21b45e-307b-4c84-bdbf-aadcb1878967';
let notFound = document.querySelector('.not-found');
let defBox = document.querySelector('.def');
let synsBox = document.querySelector('.syns');

searchBtn.addEventListener('click', function(e){
    e.preventDefault();

    // Get input data
    let word = input.value;

    // call API get data
    if(word === '') {
        alert('Word is required');
        return;
    }

    getData(word)
})

async function getData(word) {
    // Ajax call 
    const response = await fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`);
    const data =  await response.json();

    // if empty result 
    if (!data.length) {
        notFound.innerText = ' No result found';
        return;
    }

    // If result is suggestions
    if (typeof data[0] === 'string') {
        let heading = document.createElement('h5');
        heading.innerText = ' Did you mean?'
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerText = element;
            notFound.appendChild(suggestion);
        })
        return;
    }

    console.log(data);

    // Result found
    let definition = data[0].shortdef[0];
    defBox.innerText = definition;

    if (data[0].syns[0].pt[0]) {
        let synoymns = data[0].syns[0].pt[0];
        synsBox.innerText = synoymns;
    } else {
        synsBox.innerText = "Synonyms not found..";
    }

    

    console.log(data);
}