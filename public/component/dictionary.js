// Adaped and learnt from https://www.youtube.com/watch?v=KlLdNSvmoKI&ab_channel=Coder%27sGyan

// Dictionary API and registered Key from https://dictionaryapi.com/products/index
let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = '0f21b45e-307b-4c84-bdbf-aadcb1878967';
let notFound = document.querySelector('.not-found');
let defBox = document.querySelector('.def');
let synsBox = document.querySelector('.syns');
let loading= document.querySelector('.loading');

searchBtn.addEventListener('click', function(e){
    e.preventDefault();
    // clear data
    notFound.innerText = '';
    defBox.innerText = '';
    synsBox.innerText = '';

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
    loading.style.display = 'block';

    // Ajax call 
    const response = await fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`);
    const data =  await response.json();

    // if empty result 
    if (!data.length) {
        loading.style.display = 'none';
        notFound.innerText = ' No result found';
        return;
    }

    // If result is suggestions
    if (typeof data[0] === 'string') {
        loading.style.display = 'none';
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
    loading.style.display = 'none';
    let definition = data[0].shortdef[0];
    defBox.innerText = definition;

    try {
        const synoymns = data[0].syns[0].pt[0][1];
        synsBox.innerText = synoymns || "Synonyms not found..";
    } catch (e) {
        synsBox.innerText = "Synonyms not found..";
    }
}