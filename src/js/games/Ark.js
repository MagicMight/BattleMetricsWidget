import BaseGame from "./BaseGame";
import {NewPlayers, PlayerCount, ServerRank, TimePlayed} from "../charts";

class Ark extends BaseGame {
    buildTableData(attr) {
        return [
            ['Rank',                    `#${attr.rank}`],
            ['Player count',            `${attr.players}/${attr.maxPlayers}`],
            ['Address',                 `${attr.address ?? attr.ip}:${attr.port} (Game port),<br> ${attr.address ?? attr.ip}:${attr.portQuery} (Query port)`],
            ['Status',                  attr.status],
            ['Country',                 attr.country],
            ['Uptime',                  `7 Days: <span>${attr.uptime['7']}%</span>, 30 Days: <span>${attr.uptime['30']}%</span>`],
            ['Map',                     attr.details.map],
            ['In-game Day',             attr.details.time_i],
            ['Official Server',         attr.details.official],
            ['PVE',                     attr.details.pve],
            ['Mods',                    attr.details.modNames.join(', ')],
        ]
    }

    getGameCharts() {
        return [ServerRank, TimePlayed, PlayerCount, NewPlayers]
    }
}

export default Ark;