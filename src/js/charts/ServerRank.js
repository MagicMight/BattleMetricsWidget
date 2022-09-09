import BaseChart from "./BaseChart";
import {Time} from "../Utils";

class ServerRank extends BaseChart
{
    getDataSlugs()
    {
        return ['rank-history']
    }

    getChartName() {
        return 'serverRank'
    }

    getDefaultStartDate()
    {
        return Time.monthAgo
    }

    async createChart() {
        let sourceData = await (await fetch(this.getUrls()[0])).json()
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

        this.renderChart('Server Rank', labels, series, options)
    }
}

export default ServerRank