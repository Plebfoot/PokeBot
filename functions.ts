module.exports = {
    generateStat: async (stats, statToGen, ivs, level, nature) => {
        let bs = 0;

        let natureFactor = 1;
        if (nature[1] === statToGen) {
            natureFactor = 1.1;
        } else if (nature[2] === statToGen) {
            natureFactor = 0.9;
        }

        for (let stat of stats) {
            if (stat.stat.name !== statToGen) continue;
            bs = stat.base_stat;
        }
        if (statToGen === "hp") {
            return Math.floor((2 * bs + ivs[statToGen] + 0) * level / 100 + level + 10);
        } else {
            return Math.floor(Math.floor((2 * bs + ivs[statToGen] + 0) * level / 100 + 5) * natureFactor)
        }
    },
    generateSpaces: (string, maxChar) => {
        let out = "" + string;
        if (string.length < maxChar) {
            for (let x = 0; x < (maxChar - string.length); x++) {
                out += " ";
            }
        }
        return out;
    },
    generateIVSummary: (ivs) => {
        let sum = 0;
        for (let iv in ivs) {
            sum += ivs[iv];
        }
        return (Math.floor(sum / 186 * 100)) + "%";
    },
    paginationEmbed: async function (msg, pages, emojiList = ['⏪', '⏩'], timeout = 120000) {
        if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
        if (!pages) throw new Error('Pages are not given.');
        if (emojiList.length !== 2) throw new Error('Need two emojis.');
        let page = 0;
        const curPage = await msg.channel.send(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
        for (const emoji of emojiList) await curPage.react(emoji);
        const reactionCollector = curPage.createReactionCollector(
            (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot,
            { time: timeout }
        );
        reactionCollector.on('collect', reaction => {
            reaction.users.remove(msg.author);
            switch (reaction.emoji.name) {
                case emojiList[0]:
                    page = page > 0 ? --page : pages.length - 1;
                    break;
                case emojiList[1]:
                    page = page + 1 < pages.length ? ++page : 0;
                    break;
                default:
                    break;
            }
            curPage.edit(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
        });
        reactionCollector.on('end', function () {
            curPage.reactions.removeAll();
            curPage.edit(pages[page].setFooter("Re-search to see the other pages again."));
        }
        );
        return curPage;
    }
};