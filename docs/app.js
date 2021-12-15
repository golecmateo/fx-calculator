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

const button = document.querySelector('app > button');
const prompt = document.querySelector('article');

function updatePWADisplayMode() {
    let displayMode = "browser";

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (document.referrer.startsWith('android-app://')) {
        displayMode = 'twa'; // Trusted Web Activity
    } else if (navigator.standalone || isStandalone) { // navigator.standalone iOS hack
        displayMode = 'standalone';
    }

    document.querySelector('h1').textContent = `Simple PWA [${displayMode}]`;    
}

button.addEventListener('click', () => {
    let colorChannels = [];
    for (let i = 0; i < 3; i++) {
        colorChannels.push(Math.floor(Math.random() * 256));
    }
    document.querySelector('body').style.background = "rgb(" + colorChannels.join(', ') + ")";
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    prompt.style['display'] = 'block';
});

window.addEventListener('appinstalled', () => {    
    prompt.style['display'] = 'none';
    deferredPrompt = null;
    updatePWADisplayMode();
});

prompt.addEventListener('click', function(event) {
    if (event.target.dataset.id == 'install-yes' && deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(result => {
            console.log("result of user prompt", result);
            prompt.style['display'] = 'none';
            deferredPrompt = null;
            updatePWADisplayMode();
        });        
    } else {
        updatePWADisplayMode();
        prompt.style['display'] = 'none';
    }
});

updatePWADisplayMode();