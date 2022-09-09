import BaseChart from "./BaseChart";
import moment from "moment";
import {Time} from "../Utils";

class PlayerCount extends BaseChart
{
    getDataSlugs()
    {
        return ['player-count-history']
    }

    getChartName() {
        return 'playerCount'
    }

    getDefaultStartDate()
    {
        return Time.yesterday
    }

    async createChart() {
        let sourceData = await (await fetch(this.getUrls()[0])).json()

        let {series, labels} = this.prepareChartData(sourceData.data)

        let options = {
            axisX: {
                labelInterpolationFnc: (value, index) => {
                    return index % 30 === 0 ? moment(value).format('DD.MM.YYYY') : null;
                }
            },
            reverseData: true
        }

        this.renderChart('Player Count', labels, series, options)
    }
}

export default PlayerCount