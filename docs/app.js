const fixerUri = "fixer.json";

async function convert(inputValue, inputCurrency, outputCurrency) {
    const response = await fetch(fixerUri);
    const data = await response.json();
    const rates = data['rates'];
    rates["EUR"] = 1.;
    return inputValue / rates[inputCurrency] * rates[outputCurrency];
}

function round(value, decimals) {
    return (Math.round(value * 100) / 100).toFixed(decimals);
}

document.querySelectorAll('select').forEach(element => {
    element.innerHTML = `
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
        <option value="CHF">CHF</option>
        <option value="SEK">SEK</option>
    `;
});    

document.querySelector('button').addEventListener('click', async () => {        
    const inputCurrency = document.querySelector('[name="input-currency"]').value;
    const outputCurrency = document.querySelector('[name="output-currency"]').value;    
    const inputValue = document.querySelector('[name="input-value"]').value;
    const outputValue = await convert(inputValue, inputCurrency, outputCurrency);
    document.querySelector('[name="output-value"]').value = round(outputValue);            
});

const button = document.querySelector('button');
const prompt = document.querySelector('article');

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    prompt.style['display'] = 'block';
});

window.addEventListener('appinstalled', () => {    
    prompt.style['display'] = 'none';
    deferredPrompt = null;
});

prompt.addEventListener('click', function(event) {
    if (event.target.dataset.id == 'install-yes' && deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(result => {
            console.log("result of user prompt", result);
            prompt.style['display'] = 'none';
            deferredPrompt = null
        });        
    } else {
        prompt.style['display'] = 'none';
    }
});