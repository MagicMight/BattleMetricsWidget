import moment from "moment";

const Time = {
    monthAgo: moment().subtract(30, 'd').format('YYYY-MM-DD') + 'T00:00:00.000Z',
    weekAgo: moment().subtract(7, 'd').format('YYYY-MM-DD') + 'T00:00:00.000Z',
    yesterday: moment().subtract(1, 'd').format('YYYY-MM-DD') + 'T13:00:00.000Z',
    today: moment().format('YYYY-MM-DD') + 'T13:00:00.000Z',
}

export {
    Time
}