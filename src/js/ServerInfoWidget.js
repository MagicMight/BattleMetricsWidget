class ServerInfoWidget {
    constructor(serverId, game, parentSelector) {
        this.serverId = serverId
        this.game = game
        this.monthAgo = moment().subtract(1, 'M').format('YYYY-MM-DD') + 'T00:00:00.000Z'
        this.weekAgo = moment().subtract(1, 'w').format('YYYY-MM-DD') + 'T00:00:00.000Z'
        this.today = moment().format('YYYY-MM-DD') + 'T00:00:00.000Z'
        this.parentBlock = document.querySelector(parentSelector)
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
        new Chartist.Line(
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
        let uptime = {}
        for (let el of included) {
            if (el.type !== 'serverUptime') continue
            uptime[el.id.split(':')[1]] = el.attributes.value * 100
        }
        console.log(attr)

        let title = document.createElement('h2')
        title.innerText = attr.name
        let tableData;
        switch (this.game) {
            case 'sandstorm':
                tableData = [
                    ['Rank',                    `#${attr.rank}`],
                    ['Player count',            `${attr.players}/${attr.maxPlayers}`],
                    ['Address',                 `${attr.address ?? attr.ip}:${attr.port} (Game port),<br> ${attr.address ?? attr.ip}:${attr.portQuery} (Query port)`],
                    ['Status',                  attr.status],
                    ['Country',                 attr.country],
                    ['Uptime',                  `7 Days: <span>${uptime['7']}%</span>, 30 Days: <span>${uptime['30']}%</span>`],
                    ['Password Protected',      attr.details.password.toString()],
                    ['Map',                     attr.details.map],
                    ['COOP',                    attr.details.sandstorm_coop.toString()],
                    ['Game Mode',               attr.details.gameMode],
                    ['Official Match Server',   attr.details.official.toString()],
                ];
                break;

            case 'minecraft':
                tableData = [
                    ['Server Rank',             `#${attr.rank}`],
                    ['Group Rank',              `#${included.filter(el => el.type === 'serverGroup')[0].attributes.rank}`],
                    ['Player count',            `${attr.players}/${attr.maxPlayers}`],
                    ['Address',                 `${attr.address ?? attr.ip}:${attr.port}`],
                    ['Status',                  attr.status],
                    ['Country',                 attr.country],
                    ['Uptime',                  `7 Days: <span>${uptime['7']}%</span>, 30 Days: <span>${uptime['30']}%</span>`],
                    ['Version',                 `${attr.details.minecraft_version_name} (${attr.details.minecraft_version.name}, Protocol: ${attr.details.minecraft_version.protocol})`],
                    ['Modded',                  attr.details.minecraft_modded.toString()],
                ];
                break;

            case 'arma3':
                tableData = [
                    ['Server Rank',             `#${attr.rank}`],
                    ['Player count',            `${attr.players}/${attr.maxPlayers}`],
                    ['Address',                 `${attr.address ?? attr.ip}:${attr.port} (Game port),<br> ${attr.address ?? attr.ip}:${attr.portQuery} (Query port)`],
                    ['Status',                  attr.status],
                    ['Country',                 attr.country],
                    ['Uptime',                  `7 Days: <span>${uptime['7']}%</span>, 30 Days: <span>${uptime['30']}%</span>`],
                    ['Map',                     attr.details.map],
                    ['Mission',                 attr.details.mission],
                    ['Version',                 attr.details.version],
                    ['Mods',                    attr.details.modNames.join(', ')],
                    ['Signatures',              attr.details.sigs.join(', ')],

                ];
                break;
            default:
                return;
        }
        table.innerHTML = tableData.map(el => `<tr><td>${el[0]}</td><td>${el[1]}</td></tr>`).join('')
        this.parentBlock.querySelector('.info').appendChild(title)
        this.parentBlock.querySelector('.info').appendChild(table)
    }

}