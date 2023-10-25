import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';
import { BracketsManager } from 'brackets-manager';
import { Match } from 'brackets-model';
import { InMemoryDatabase } from 'brackets-memory-db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

let nextFetch:number = Date.now() - 1;
let cachedData:string = '';
let weekIsFinal:boolean = false;

function fetchPage(url: string): Promise<string> {
  const HTMLData = axios
    .get(url)
    .then(res => res.data)
    .catch((error: AxiosError) => {
      console.error(`There was an error with ${error.config?.url}.`);
      console.error(error.toJSON());
      return '';
    });

  return HTMLData;
}

async function getYahooData(): Promise<any[]> {
  const d1Data = await fetchPage('https://football.fantasysports.yahoo.com/league/cadlefantasyleague');
  const d1Dom = cheerio.load(d1Data);
  weekIsFinal = d1Dom('#matchupweek').find('div.Bg-shade').find('div.Ta-end').find('span').html() == 'Final results';
  const d1MatchupRows = d1Dom('#matchupweek')
    .find('.List')
    .find('li');
  const d1TeamContainers = d1MatchupRows
    .find('div.Grid-h-mid.Nowrap');
  const d2Data = await fetchPage('https://football.fantasysports.yahoo.com/league/cadlefantasyleaguedivision2');
  const d2Dom = cheerio.load(d2Data);
  const d2MatchupRows = d2Dom('#matchupweek')
    .find('.List')
    .find('li');
  const d2TeamContainers = d2MatchupRows
    .find('div.Grid-h-mid.Nowrap');
  let Teams:any = []
  d1TeamContainers.each(function(i,el) {
    const score = weekIsFinal ? (parseInt(d1Dom(el).find('.Fz-lg').html() ?? '0')) : (parseInt(d1Dom(el).find('.Grid-u-1-4').find('.F-shade').html() ?? '0'));
    Teams.push({
      name: d1Dom(el).find('a.F-link').text(),
      score: score
    });
  });
  d2TeamContainers.each(function(i,el) {
    const score = weekIsFinal ? (parseInt(d2Dom(el).find('.Fz-lg').html() ?? '0')) : (parseInt(d2Dom(el).find('.Grid-u-1-4').find('.F-shade').html() ?? '0'));
    Teams.push({
      name: d2Dom(el).find('a.F-link').text(),
      score: score
    });
  });
  return Teams;
}

async function buildBracket(): Promise<string> {
  if (nextFetch >= Date.now())
  {
    return cachedData;
  }
  const teamData = await getYahooData();
  const db = new InMemoryDatabase();
  const manager = new BracketsManager(db);
  await manager.create.stage({
    tournamentId: 1,
    name: 'CMCC',
    type: 'single_elimination',
    seeding: [
        null,
        'Armchair Athletics',
        'Josh and the Whale',
        'Out of Luck',

        'Sankey Slingers Ltd',
        'The Tucker Rule',
        'Greg’s Great Team',
        'The Prince Of Dallas',

        'Merseyside Enforcers',
        'The Sorcerer’s Apprentice',
        'Suicide Squad',
        'La Résistance',

        null,
        'The Kool Kats',
        null,
        'Huddersfield Eagles',

        null,
        'Ayle Oola Ostriches',
        'THE FREAKS OF SPORT',
        'Hernandez\'s Hitmen',

        null,
        'Night Shift Packers',
        'P\'Town Hurri-CAINS',
        'Seddon\'s Skylines',

        'ItsFarrellyFootball',  
        'Real slim Brady',
        null,
        'Ghost of Mufasa',

        'The Auto-Warriors',
        'Moneyballers',
        'J E T S JETSJETSJETS',
        'Founding Father'
      ],
    settings: {
        seedOrdering: ['natural']
    }
  });
  // Whale-Luck
  await manager.update.match({
      id:1,
      opponent1: { score: 58 },
      opponent2: { score: 88, result: 'win' }
  });
  //Sling-Tuck
  await manager.update.match({
      id:2,
      opponent1: { score: 112, result: 'win'},
      opponent2: { score: 69 }
  });
  //GGT-Prince
  await manager.update.match({
      id:3,
      opponent1: { score: 68, result: 'win'},
      opponent2: { score: 61 }
  });
  // Enforcers-Sorc
  await manager.update.match({
      id:4,
      opponent1: { score: 81, result: 'win'},
      opponent2: { score: 67 }
  });
  // Suicide-LaRes
  await manager.update.match({
      id:5,
      opponent1: { score: 89 },
      opponent2: { score: 107, result: 'win' }
  });
    // Freaks-Hitmen
    await manager.update.match({
      id:9,
      opponent1: { score: 91, result: 'win'},
      opponent2: { score: 79 }
  });
  //PTown Skylines
  await manager.update.match({
      id:11,
      opponent1: { score: 86, result: 'win'},
      opponent2: { score: 79 }
  });
    //IFF-RSB
    await manager.update.match({
      id:12,
      opponent1: { score: 93, result: 'win'},
      opponent2: { score: 79 }
  });
  //Auto-Ballers
  await manager.update.match({
      id:14,
      opponent1: { score: 83, result: 'win'},
      opponent2: { score: 61 }
  });
  //Jets-Father
  await manager.update.match({
      id:15,
      opponent1: { score: 79, result: 'win'},
      opponent2: { score: 59 }
  });


  //chairs-luck
  await manager.update.match({
    id:16,
    opponent1: { score: 85 },
    opponent2: { score: 105, result: 'win' }
  });
  //Sling-GGT
  await manager.update.match({
    id:17,
    opponent1: { score: 93, result: 'win' },
    opponent2: { score: 70 }
  });
  //enforcers-LaRes
  await manager.update.match({
    id:18,
    opponent1: { score: 60 },
    opponent2: { score: 84, result: 'win' }
  });
  //KK-Eagles
  await manager.update.match({
    id:19,
    opponent1: { score: 90, result: 'win' },
    opponent2: { score: 83 }
  });
  //Ostriches-Freaks
  await manager.update.match({
    id:20,
    opponent1: { score: 78 },
    opponent2: { score: 90, result: 'win' }
  });
  //NSP-PTown
  await manager.update.match({
    id:21,
    opponent1: { score: 104, result: 'win' },
    opponent2: { score: 103 }
  });
  //IFF-Ghost
  await manager.update.match({
    id:22,
    opponent1: { score: 80 },
    opponent2: { score: 89, result: 'win' }
  });
  //Auto-Jets
  await manager.update.match({
    id:23,
    opponent1: { score: 72 },
    opponent2: { score: 73, result: 'win' }
  });

  // OOL - Sling
  await manager.update.match({
    id:24,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Out of Luck')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'Sankey Slingers Ltd')[0].score
    }
  });
  // LaRes-Kats
  await manager.update.match({
    id:25,
    opponent1:{
      score: teamData.filter((e) => e.name == 'La Résistance')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'The Kool Kats')[0].score
    }
  });
  // Freaks-NSP
  await manager.update.match({
    id:26,
    opponent1:{
      score: teamData.filter((e) => e.name == 'THE FREAKS OF SPORT')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'Night Shift Packers')[0].score
    }
  });
  // Ghost-JETS
  await manager.update.match({
    id:27,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Ghost of Mufasa')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'J E T S JETSJETSJETS')[0].score
    }
  });

  cachedData = JSON.stringify(db);
  nextFetch = Date.now() + 15000;
  return cachedData;
}
app.use(express.static('public'));

app.get('/bracketData', async (req: Request, res: Response) => {
  res.setHeader('content-type', 'application/json');
  if (process.env.CORS != undefined)
  {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS);
  }
  res.send(await buildBracket());
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});