import BaseChart from "./BaseChart";
import moment from "moment";
import {Time} from "../Utils";

class TimePlayed extends BaseChart
{
    getDataSlugs()
    {
        return ['time-played-history']
    }

    getChartName() {
        return 'timePlayed'
    }

    getDefaultStartDate()
    {
        return Time.monthAgo
    }

    async createChart() {
        let sourceData = await (await fetch(this.getUrls()[0])).json()
        let {series, labels} = this.prepareChartData(sourceData.data)

        let options = {
            axisY: {
                labelInterpolationFnc: value => Math.floor(moment.duration(value * 1000).asHours()) + 'h'
            }
        }
        this.renderChart('Time played', labels, series, options)
    }
}

export default TimePlayed