import GameBaseClass from "./GameBaseClass";

class GameSandstorm extends GameBaseClass {
    buildTableData(attr) {
        return [
            ['Rank',                    `#${attr.rank}`],
            ['Player count',            `${attr.players}/${attr.maxPlayers}`],
            ['Address',                 `${attr.address ?? attr.ip}:${attr.port} (Game port),<br> ${attr.address ?? attr.ip}:${attr.portQuery} (Query port)`],
            ['Status',                  attr.status],
            ['Country',                 attr.country],
            ['Uptime',                  `7 Days: <span>${attr.uptime['7']}%</span>, 30 Days: <span>${attr.uptime['30']}%</span>`],
            ['Password Protected',      attr.details.password.toString()],
            ['Map',                     attr.details.map],
            ['COOP',                    attr.details.sandstorm_coop.toString()],
            ['Game Mode',               attr.details.gameMode],
            ['Official Match Server',   attr.details.official.toString()],
        ]
    }
}

export default GameSandstorm;