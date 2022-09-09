import BaseGame from "./BaseGame";
import {GroupRank, PlayerCount} from "../charts";

class Minecraft extends BaseGame {
    buildTableData(attr) {
        return [
            ['Server Rank',     `#${attr.rank}`],
            ['Group Rank',      `#${attr.included.filter(el => el.type === 'serverGroup')[0].attributes.rank}`],
            ['Player count',    `${attr.players}/${attr.maxPlayers}`],
            ['Address',         `${attr.address ?? attr.ip}:${attr.port}`],
            ['Status',          attr.status],
            ['Country',         attr.country],
            ['Uptime',          `7 Days: <span>${attr.uptime['7']}%</span>, 30 Days: <span>${attr.uptime['30']}%</span>`],
            ['Version',         `${attr.details.minecraft_version_name} (${attr.details.minecraft_version.name}, Protocol: ${attr.details.minecraft_version.protocol})`],
            ['Modded',          attr.details.minecraft_modded.toString()],
        ]
    }

    getGameCharts() {
        return [GroupRank, PlayerCount]
    }
}

export default Minecraft;