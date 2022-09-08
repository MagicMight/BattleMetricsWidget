import moment from "moment";

const Time = {
    monthAgo: moment().subtract(1, 'M').format('YYYY-MM-DD') + 'T00:00:00.000Z',
    weekAgo: moment().subtract(1, 'w').format('YYYY-MM-DD') + 'T00:00:00.000Z',
    yesterday: moment().subtract(1, 'd').format('YYYY-MM-DDTHH:mm:ss') + 'Z',
    today: moment().format('YYYY-MM-DD') + 'T00:00:00.000Z',
}

export {
    Time
}