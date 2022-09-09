import BaseChart from "./BaseChart";

class GroupRank extends BaseChart
{
    getDataSlugs()
    {
        return ['group-rank-history']
    }

    getChartName() {
        return 'groupRank'
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

        this.renderChart('Group Rank', labels, series, options)
    }
}

export default GroupRank