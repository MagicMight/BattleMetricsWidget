import './css/main.css';
import ServerInfoWidget from './js/ServerInfoWidget';

window.addEventListener('DOMContentLoaded', () => {
    new ServerInfoWidget('3219426', 'arma3', 'div.arma3')
    new ServerInfoWidget('5460760', 'minecraft', 'div.minecraft')
    new ServerInfoWidget('14298606', 'sandstorm', 'div.sandstorm')
})

