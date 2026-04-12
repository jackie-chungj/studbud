// Free Dictionary API — no key required
// https://dictionaryapi.dev/

const input       = document.querySelector('#input');
const notFound    = document.querySelector('.not-found');
const wordBox     = document.querySelector('.dict-word');
const defBox      = document.querySelector('.def');
const synsBox     = document.querySelector('.syns');
const loading     = document.querySelector('.loading');
const placeholder = document.querySelector('.dict-placeholder');
const result      = document.querySelector('.dict-result');
const synsSection = document.querySelector('.dict-syns');

function resetState() {
    notFound.innerText        = '';
    wordBox.innerText         = '';
    defBox.innerText          = '';
    synsBox.innerText         = '';
    result.style.display      = 'none';
    placeholder.style.display = 'none';
    synsSection.style.display = 'block';
}

input.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter') return;
    const word = input.value.trim();
    if (word === '') return;
    resetState();
    getData(word);
});

async function getData(word) {
    loading.style.display = 'block';

    let data;
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

        if (response.status === 404) {
            loading.style.display = 'none';
            notFound.innerText = 'No result found.';
            return;
        }

        data = await response.json();
    } catch (err) {
        loading.style.display = 'none';
        notFound.innerText = 'Could not reach the dictionary. Check your connection.';
        return;
    }

    loading.style.display = 'none';

    const entry    = data[0];
    const meanings = entry.meanings || [];

    wordBox.innerText = entry.word || word;

    const definition = meanings
        .flatMap(m => m.definitions || [])
        .map(d => d.definition)
        .find(d => d) || '';

    defBox.innerText     = definition;
    result.style.display = 'block';

    const synonyms = meanings
        .flatMap(m => m.synonyms || [])
        .filter(s => s)
        .slice(0, 5);

    if (synonyms.length > 0) {
        synsBox.innerText = synonyms.join(', ');
    } else {
        synsSection.style.display = 'none';
    }
}
