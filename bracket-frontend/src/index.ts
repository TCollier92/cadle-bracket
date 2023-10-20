const { InMemoryDatabase } = require('brackets-memory-db');
const { BracketsManager } = require('brackets-manager');
const { BracketsViewer } = require('ts-brackets-viewer');
import axios from 'axios';
import * as cheerio from 'cheerio';

const db = new InMemoryDatabase();
const manager = new BracketsManager(db);
const viewer = new BracketsViewer();

const populateData = async () => {
    await manager.create.stage({
        tournamentId: 1,
        name: 'CMCC',
        type: 'single_elimination',
        seeding: [
            null,
            'Armchair Athletics',
            'Josh and the Whale',
            'Out of Luck',
            'Merseyside Enforcers',
            'Sorcerers apprentice',
            'Suicide Squad',
            'La Resistance',
            null,
            'Night Shift Packers',
            'PTown Hurri-Cains',
            'Seddons Skylines',
            null,
            'The Kool Kats',
            null,
            'Huddersfield Eagles',
            'The Auto Warriors',
            'Moneyballers',
            'J E T SJETSJETSJETS',
            'Founding Father',
            null,
            'Ayla oola Ostriches',
            'The Freaks of Sport',
            'Hernandez Hitmen',
            'It\'s Farrelly Football',
            'Real Slim Brady',
            null,
            'The Ghost of Mufasa',
            'Sankey Slingers Ltd',
            'The Tucker Rule',
            'Greg\'s great team',
            'The Prince of Dallas'],
        settings: {
            seedOrdering: ['natural']
        }
    });
    await manager.update.match({
        id:1,
        opponent1: { score: 88, result: 'win'},
        opponent2: { score: 58 }
    });
    await manager.update.match({
        id:2,
        opponent1: { score: 81, result: 'win'},
        opponent2: { score: 67 }
    });
    await manager.update.match({
        id:3,
        opponent1: { score: 89 },
        opponent2: { score: 107, result: 'win' }
    });
    await manager.update.match({
        id:5,
        opponent1: { score: 86, result: 'win'},
        opponent2: { score: 79 }
    });
    await manager.update.match({
        id:8,
        opponent1: { score: 83, result: 'win'},
        opponent2: { score: 61 }
    });
    await manager.update.match({
        id:9,
        opponent1: { score: 79, result: 'win'},
        opponent2: { score: 59 }
    });
    await manager.update.match({
        id:11,
        opponent1: { score: 91, result: 'win'},
        opponent2: { score: 79 }
    });
    await manager.update.match({
        id:12,
        opponent1: { score: 93, result: 'win'},
        opponent2: { score: 79 }
    });
    await manager.update.match({
        id:14,
        opponent1: { score: 112, result: 'win'},
        opponent2: { score: 69 }
    });
    await manager.update.match({
        id:15,
        opponent1: { score: 68, result: 'win'},
        opponent2: { score: 61 }
    });
    db.data.match = db.data.match.filter((item: any) => item.id <= 23);
}

populateData().then(() => {
    viewer.render({ 
        stages: db.data.stage,
        matches: db.data.match,
        matchGames: db.data.match_game,
        participants: db.data.participant
    },
    {
        customRoundName: (r:any,c:any) => {
            switch(r.roundNumber)
            {
                case 1:
                    return 'First Round';
                case 2:
                    return 'Sweet 16';
                case 3:
                    return 'Elite Eight';
                case 4:
                    return 'Final Four';
                case 5:
                    return 'Grand Final';
            }
        }
    });
});

