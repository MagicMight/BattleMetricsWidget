import './css/main.css';
import ServerInfoWidget from './js/ServerInfoWidget';

window.addEventListener('DOMContentLoaded', () => {
    let divs = document.getElementsByClassName('battlemetrics-widget')
    for (let div of divs) {
        new ServerInfoWidget(div).initWorkspace();
    }
})

