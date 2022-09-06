import moment from 'moment';
import {LineChart} from 'chartist';

import GameMinecraft from "./games/GameMinecraft";
import GameSandstorm from "./games/GameSandstorm";
import GameArma3 from "./games/GameArma3";

class ServerInfoWidget {
    constructor(parentNode) {
        this.serverId = parentNode.dataset.serverid
        this.game = parentNode.dataset.game
        this.monthAgo = moment().subtract(1, 'M').format('YYYY-MM-DD') + 'T00:00:00.000Z'
        this.weekAgo = moment().subtract(1, 'w').format('YYYY-MM-DD') + 'T00:00:00.000Z'
        this.today = moment().format('YYYY-MM-DD') + 'T00:00:00.000Z'
        this.parentBlock = parentNode
        this.charts = {
            serverRank: {
                id: undefined,
                dom: undefined,
                method: this.createServerRankChart.bind(this)
            },
            timePlayed: {
                id: undefined,
                dom: undefined,
                method: this.createTimePlayedChart.bind(this)
            },
            playerCount: {
                id: undefined,
                dom: undefined,
                method: this.createPlayerCountChart.bind(this)
            },
            newPlayers: {
                id: undefined,
                dom: undefined,
                method: this.createNewPlayersChart.bind(this)
            },
            groupRank: {
                id: undefined,
                dom: undefined,
                method: this.createGroupRankChart.bind(this)
            }
        }
        this.gameCharts = {
            sandstorm: ['serverRank', 'timePlayed', 'playerCount', 'newPlayers'],
            minecraft: ['groupRank', 'playerCount'],
            arma3: ['serverRank', 'timePlayed', 'playerCount', 'newPlayers']
        }

        this.initWorkspace()
    }

    initWorkspace()
    {
        this.parentBlock.classList.add('gameserver-info')
        let info = document.createElement('div')
        info.className = 'info'
        this.parentBlock.appendChild(info)

        this.createInfoTable()

        for (let name of this.gameCharts[this.game]) {
            let id = `${name}_${this.serverId}`
            let chart = document.createElement('div')
            chart.className = `chart`
            chart.id = id
            this.charts[name].id = id
            this.charts[name].dom = chart
            this.parentBlock.appendChild(chart)
            this.charts[name].method()
        }
    }

    prepareChartData(data)
    {
        let labels = [];
        let seriesKeys = Object.keys(data[0].attributes).filter(key => key !== 'timestamp')
        let series = seriesKeys.map(el => [])
        data.forEach(point => {
            seriesKeys.forEach((sk, sidx) => {
                series[sidx].push(point.attributes[sk]);
            })
            labels.push(point.attributes.timestamp);
        })

        return {labels, series}
    }

    async createServerRankChart(start=this.monthAgo, stop=this.today)
    {
        let url = `https://api.battlemetrics.com/servers/${this.serverId}/rank-history?start=${start}&stop=${stop}`
        let sourceData = await (await fetch(url)).json()
        let {series, labels} = this.prepareChartData(sourceData.data)
        let min = Math.min(...series[0]),
            max = Math.max(...series[0])
        series[0] = series[0].map(point => min - point)
        let options = {
            axisY: {
                labelInterpolationFnc: value => min - value,
            },
            areaBase: -max
        }
        this.createChart('serverRank', 'Server Rank', labels, series, options)
    }

    async createGroupRankChart(start=this.monthAgo, stop=this.today)
    {
        let url = `https://api.battlemetrics.com/servers/${this.serverId}/group-rank-history?start=${start}&stop=${stop}`
        let sourceData = await (await fetch(url)).json()
        let {series, labels} = this.prepareChartData(sourceData.data)
        let min = Math.min(...series[0]),
            max = Math.max(...series[0])
        series[0] = series[0].map(point => min - point)
        let options = {
            axisY: {
                labelInterpolationFnc: value => min - value,
            },
            areaBase: -max
        }
        this.createChart('groupRank', 'groupRank', labels, series, options)
    }

    async createTimePlayedChart(start=this.monthAgo, stop=this.today)
    {
        let url = `https://api.battlemetrics.com/servers/${this.serverId}/time-played-history?start=${start}&stop=${stop}`
        let sourceData = await (await fetch(url)).json()
        let {series, labels} = this.prepareChartData(sourceData.data)
        let options = {
            axisY: {
                labelInterpolationFnc: value => Math.floor(moment.duration(value * 1000).asHours()) + 'h'
            }
        }
        this.createChart('timePlayed', 'Time played', labels, series, options)
    }

    async createNewPlayersChart(start=this.monthAgo, stop=this.today)
    {
        let urls = [
            `https://api.battlemetrics.com/servers/${this.serverId}/unique-player-history?start=${start}&stop=${stop}`,
            `https://api.battlemetrics.com/servers/${this.serverId}/first-time-history?start=${start}&stop=${stop}`
        ]
        let sourceData = []
        for (let url of urls) {
            sourceData.push(await (await fetch(url)).json())
        }
        sourceData[0].data = sourceData[0].data.map((el, idx) => {
            return {
                type: 'dataPoint',
                attributes: {
                    ...el.attributes,
                    value2: sourceData[1].data[idx].attributes.value
                }
            }
        })
        let {series, labels} = this.prepareChartData(sourceData[0].data)
        this.createChart('newPlayers', 'Unique & First time players', labels, series)
    }

    async createPlayerCountChart(start=this.weekAgo, stop=this.today)
    {
        let url = `https://api.battlemetrics.com/servers/${this.serverId}/player-count-history?start=${start}&stop=${stop}`
        let sourceData = await (await fetch(url)).json()
        let {series, labels} = this.prepareChartData(sourceData.data)
        let options = {
            axisX: {
                labelInterpolationFnc: (value, index) => {
                    return index % 30 === 0 ? moment(value).format('DD.MM.YYYY') : null;
                }
            },
            reverseData: true
        }
        this.createChart('playerCount', 'Player Count', labels, series, options)
    }

    createChart(name, title, labels, series, additionalOptions = {})
    {
        this.charts[name].dom.innerHTML = '<h3>' + title + '</h3>'
        new LineChart(
            '#' + this.charts[name].id,
            {
                labels: labels,
                series: series,
            },
            {
                fullWidth: true,
                chartPadding: {
                    right: 40,
                },
                axisX: {
                    labelInterpolationFnc: (value, index) => {
                        return index % 5 === 0 ? moment(value).format('DD.MM.YYYY') : null;
                    }
                },
                showArea: true,
                showGrid: true,
                showPoint: false,
                ...additionalOptions
            },
        );
    }

    async createInfoTable()
    {
        let table = document.createElement('table')
        table.className = 'info-table';
        let url = `https://api.battlemetrics.com/servers/${this.serverId}?include=session,uptime:7,uptime:30,serverEvent,serverGroup,serverDescription,orgDescription&relations[server]=game,serverGroup,organization,orgGroup&relations[session]=server,player&fields[server]=id,name,address,ip,port,portQuery,players,maxPlayers,rank,createdAt,updatedAt,location,country,status,details,queryStatus&fields[session]=start,stop,firstTime,name&fields[orgDescription]=public,approvedAt`
        let {data: {attributes: attr}, included: included} = await (await fetch(url)).json()
        attr['uptime'] = {}
        attr['included'] = included
        for (let el of attr.included) {
            if (el.type !== 'serverUptime') continue
            attr.uptime[el.id.split(':')[1]] = el.attributes.value * 100
        }
        console.log(attr)

        let title = document.createElement('h2')
        title.innerText = attr.name
        let tableData;
        switch (this.game) {
            case 'sandstorm':
                tableData = new GameSandstorm(attr).getTableData();
                break;

            case 'minecraft':
                tableData = new GameMinecraft(attr).getTableData();
                break;

            case 'arma3':
                tableData = new GameArma3(attr).getTableData();
                break;

            default:
                return;
        }
        table.innerHTML = tableData.map(el => `<tr><td>${el[0]}</td><td>${el[1]}</td></tr>`).join('')
        this.parentBlock.querySelector('.info').appendChild(title)
        this.parentBlock.querySelector('.info').appendChild(table)
    }

}


export default ServerInfoWidget;