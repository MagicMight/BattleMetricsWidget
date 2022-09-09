import {LineChart} from "chartist";
import {Time} from "../Utils";
import moment from "moment";

class BaseChart
{
    constructor(node, serverId, start = undefined, stop = undefined) {
        this.parentNode = node
        this.serverId = serverId

        this.start = start ?? this.getDefaultStartDate()
        this.stop = stop ?? this.getDefaultStopDate()

        this.chartId = this.getChartName() + '_' + this.getServerId()

        this.urls = this.getDataSlugs().map(slug => {
            return `https://api.battlemetrics.com/servers/${serverId}/${slug}?start=${this.start}&stop=${this.stop}`
        })

        let chart = document.createElement('div')
        chart.className = `chart`
        chart.id = this.getChartId()
        this.node = chart
        this.getParentNode().appendChild(this.getNode())
    }

    getChartName() {
        return 'baseChart'
    }

    getDefaultStartDate()
    {
        return Time.weekAgo
    }

    getDefaultStopDate()
    {
        return Time.today
    }

    prepareChartData(data)
    {
        let labels = [];
        let seriesKeys = Object.keys(data[0].attributes).filter(key => key !== 'timestamp')
        let series = seriesKeys.map(() => [])
        data.forEach(point => {
            seriesKeys.forEach((sk, sidx) => {
                series[sidx].push(point.attributes[sk]);
            })
            labels.push(point.attributes.timestamp);
        })

        return {labels, series}
    }

    async createChart() {}

    renderChart(title, labels, series, additionalOptions = {})
    {
        this.getNode().innerHTML = '<h3>' + title + '</h3>'
        new LineChart(
            '#' + this.getChartId(),
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

    getDataSlugs() {
        return []
    }

    getServerId() {
        return this.serverId
    }

    getParentNode() {
        return this.parentNode
    }

    getNode() {
        return this.node
    }

    getUrls() {
        return this.urls
    }

    getChartId() {
        return this.chartId
    }
}

export default BaseChart