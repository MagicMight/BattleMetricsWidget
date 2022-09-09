class BaseGame
{
    constructor(attr) {
        this.attr = attr;
        this.tableData = this.buildTableData(this.attr);
    }

    buildTableData(attr) {}

    getAttr() {
        return this.attr;
    }

    getTableData() {
        return this.tableData;
    }

    getGameCharts() {
        return []
    }
}

export default BaseGame;