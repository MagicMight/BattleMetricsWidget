import BaseChart from "./BaseChart";
import {Time} from "../Utils";

class NewPlayers extends BaseChart
{
    getDataSlugs()
    {
        return ['unique-player-history', 'first-time-history']
    }

    getChartName() {
        return 'newPlayers'
    }

    getDefaultStartDate()
    {
        return Time.monthAgo
    }

    async createChart() {
        let sourceData = []

        for (let url of this.getUrls()) {
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

        this.renderChart('Unique & First time players', labels, series)
    }
}

export default NewPlayers