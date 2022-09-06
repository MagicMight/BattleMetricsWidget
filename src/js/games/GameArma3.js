import GameBaseClass from "./GameBaseClass";

class GameArma3 extends GameBaseClass {
    buildTableData(attr) {
        return [
            ['Server Rank',             `#${attr.rank}`],
            ['Player count',            `${attr.players}/${attr.maxPlayers}`],
            ['Address',                 `${attr.address ?? attr.ip}:${attr.port} (Game port),<br> ${attr.address ?? attr.ip}:${attr.portQuery} (Query port)`],
            ['Status',                  attr.status],
            ['Country',                 attr.country],
            ['Uptime',                  `7 Days: <span>${attr.uptime['7']}%</span>, 30 Days: <span>${attr.uptime['30']}%</span>`],
            ['Map',                     attr.details.map],
            ['Mission',                 attr.details.mission],
            ['Version',                 attr.details.version],
            ['Mods',                    attr.details.modNames.join(', ')],
            ['Signatures',              attr.details.sigs.join(', ')]
        ]
    }
}

export default GameArma3;