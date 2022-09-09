import moment from 'moment';
import {LineChart} from 'chartist';
import {Time} from "./Utils";
import {Minecraft, Sandstorm, Arma3, Ark} from './games'

class ServerInfoWidget {
    constructor(node) {
        this.node = node
        this.serverId = this.node.dataset.serverid
        this.gameName = this.node.dataset.game.toLowerCase()
        this.attr = null
        this.game = null

        this.charts = []
    }

    createGameInstance()
    {
        switch (this.gameName) {
            case 'minecraft':   return new Minecraft(this.attr);
            case 'sandstorm':   return new Sandstorm(this.attr);
            case 'arma3':       return new Arma3(this.attr);
            case 'ark':         return new Ark(this.attr);
            default:            throw new Error('Unavailable game');
        }
    }

    async initWorkspace()
    {
        this.node.classList.add('gameserver-info')
        let info = document.createElement('div')
        info.className = 'info'
        this.node.appendChild(info)

        await this.loadTableData()
        this.game = this.createGameInstance()
        this.createInfoTable()

        this.charts = []
        for (let Chart of this.game.getGameCharts()) {
            let c = new Chart(this.node, this.serverId)
            this.charts.push(c)
            c.createChart()
        }
    }

    async loadTableData()
    {
        let url = `https://api.battlemetrics.com/servers/${this.serverId}?include=session,uptime:7,uptime:30,serverEvent,serverGroup,serverDescription,orgDescription&relations[server]=game,serverGroup,organization,orgGroup&relations[session]=server,player&fields[server]=id,name,address,ip,port,portQuery,players,maxPlayers,rank,createdAt,updatedAt,location,country,status,details,queryStatus&fields[session]=start,stop,firstTime,name&fields[orgDescription]=public,approvedAt`
        let {data: {attributes: attr}, included: included} = await (await fetch(url)).json()
        attr['uptime'] = {}
        attr['included'] = included
        for (let el of attr.included) {
            if (el.type !== 'serverUptime') continue
            attr.uptime[el.id.split(':')[1]] = el.attributes.value * 100
        }

        this.attr = attr

        console.log(attr)
        return this.attr
    }

    createInfoTable()
    {
        let tableData = this.game.getTableData();

        let table = document.createElement('table')
        table.className = 'info-table';
        let title = document.createElement('h2')
        title.innerText = this.attr.name
        table.innerHTML = tableData.map(el => `<tr><td>${el[0]}</td><td>${el[1]}</td></tr>`).join('')
        this.node.querySelector('.info').appendChild(title)
        this.node.querySelector('.info').appendChild(table)
    }
}

export default ServerInfoWidget;