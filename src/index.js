import './css/main.css';
import ServerInfoWidget from './js/ServerInfoWidget';

window.addEventListener('DOMContentLoaded', () => {
    let divs = document.getElementsByClassName('battlemetrics-widget')
    for (let idx in divs) {
        new ServerInfoWidget(divs[idx]);
    }
})

