const { InMemoryDatabase } = require('brackets-memory-db');
const { BracketsViewer } = require('ts-brackets-viewer');
import axios from 'axios';

let db: any = null;
const viewer = new BracketsViewer();
let apiUrl = process.env.API_URL ?? '';

const populateData = async () => {
    const resp = await axios.get(apiUrl + 'bracketdata');
    db = resp.data;
    console.log(db);
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

