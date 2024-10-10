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
    const score = weekIsFinal ? (parseInt(d1Dom(el).find('.Fz-lg').html() ?? '0')) : (parseInt(d1Dom(el).find('.Grid-u-1-4 .F-shade').html() ?? '0'));
    Teams.push({
      name: d1Dom(el).find('a.F-link').text(),
      score: score
    });
  });
  d2TeamContainers.each(function(i,el) {
    const score = weekIsFinal ? (parseInt(d1Dom(el).find('.Fz-lg').html() ?? '0')) : (parseInt(d1Dom(el).find('.Grid-u-1-4 .F-shade').html() ?? '0'));
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
        'Suicide Squad',
        'Out of Luck',
        'The Tucker Rule',

        null,
        'Ayle Oola Ostriches',
        'Skylines',
        'The Prince Of Dallas',

        null,
        'Greg’s Great Team',
        'Founding Father',
        'Ghost of Mufasa',

        'P\'Town Hurri-CAINS',
        'The Kool Kats',
        'Real slim Brady',
        'Moneyballers',

        null,
        'Sankey Slingers Ltd',
        'La Résistance',
        'Armchair Athletics',

        null,
        'THE FREAKS OF SPORT',
        'Afternoon Shift Packers',
        'ItsFarrellyFootball', 

        null,
        'Merseyside Enforcers',
        'Hernandez\'s Hitmen',
        'Huddersfield Eagles',

        'J E T S JETSJETSJETS',
        'Josh and the Whale',
        'The Auto-Warriors',
        'The Sorcerer\’s Apprentice',
      ],
    settings: {
        seedOrdering: ['natural']
    }
  });

  // Luck-Tuck
  await manager.update.match({
    id:1,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Out of Luck')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'The Tucker Rule')[0].score
    }
  });
  // Skyline-Dallas
  await manager.update.match({
    id:3,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Skylines')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'The Prince Of Dallas')[0].score
    }
  });
  // Father-Ghost
  await manager.update.match({
    id:5,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Founding Father')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'Ghost of Mufasa')[0].score
    }
  });
  // Ptown-Kats
  await manager.update.match({
    id:6,
    opponent1:{
      score: teamData.filter((e) => e.name == 'P\'Town Hurri-CAINS')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'The Kool Kats')[0].score
    }
  });
  // RSB-Ballers
  await manager.update.match({
    id:7,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Real slim Brady')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'Moneyballers')[0].score
    }
  });
  // La Res-Chairs
  await manager.update.match({
    id:9,
    opponent1:{
      score: teamData.filter((e) => e.name == 'La Résistance')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'Armchair Athletics')[0].score
    }
  });
  // ASP-IFF
  await manager.update.match({
    id:11,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Afternoon Shift Packers')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'ItsFarrellyFootball')[0].score
    }
  });
  // ASP-IFF
  await manager.update.match({
    id:13,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Hernandez\'s Hitmen')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'Huddersfield Eagles')[0].score
    }
  });
  // ASP-IFF
  await manager.update.match({
    id:14,
    opponent1:{
      score: teamData.filter((e) => e.name == 'J E T S JETSJETSJETS')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'Josh and the Whale')[0].score
    }
  });
  // ASP-IFF
  await manager.update.match({
    id:15,
    opponent1:{
      score: teamData.filter((e) => e.name == 'The Auto-Warriors')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'The Sorcerer\'s Apprentice')[0].score
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