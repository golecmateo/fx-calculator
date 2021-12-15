self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('fxcalc-v1')
            .then(cache => cache.addAll([
                'index.html',
                'app.js',
                'icon512.png',
                'icon192.png',
                'icon16.png',
                'maskable-icon512.png',
                'rates.json',
                'manifest.webmanifest'
            ]))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open('fxcalc-v1').then((cache) => {
            return fetch(event.request)
                .then((response) => {
                    cache.put(event.request, response.clone());
                    return response;
                })
                .catch(() => cache.match(event.request));
        })        
    );
});

const prompt = document.querySelector('.prompt');
const installButton = prompt.querySelector('.prompt__install');
const closeButton = prompt.querySelector('.prompt__close');
let installEvent;

function getVisited() {
  return localStorage.getItem('install-prompt');
}

function setVisited() {
  localStorage.setItem('install-prompt', true);
}

// this event will only fire if the user does not have the pwa installed
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();

  // if no localStorage is set, first time visitor
  if (!getVisited()) {
    // show the prompt banner
    prompt.style.display = 'block';

    // store the event for later use
    installEvent = event;
  }
});

installButton.addEventListener('click', () => {
  // hide the prompt banner
  prompt.style.display = 'none';

  // trigger the prompt to show to the user
  installEvent.prompt();

  // check what choice the user made
  installEvent.userChoice.then((choice) => {
    // if the user declined, we don't want to show the button again
    // set localStorage to true
    if (choice.outcome !== 'accepted') {
      setVisited();
    }

    installEvent = null;
  });
});

closeButton.addEventListener('click', () => {
  // set localStorage to true
  setVisited();

  // hide the prompt banner
  prompt.style.display = 'none';  

  installEvent = null;
});