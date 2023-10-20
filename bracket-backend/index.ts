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
    Teams.push({
      name: d1Dom(el).find('a.F-link').text(),
      score: parseInt(d1Dom(el).find('div.Italic').html() ?? '0')
    });
  });
  d2TeamContainers.each(function(i,el) {
    Teams.push({
      name: d2Dom(el).find('a.F-link').text(),
      score: parseInt(d2Dom(el).find('div.Italic').html() ?? '0')
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
        'Merseyside Enforcers',
        'The Sorcerer’s Apprentice',
        'Suicide Squad',
        'La Résistance',
        null,
        'Night Shift Packers',
        'P\'Town Hurri-CAINS',
        'Seddon\'s Skylines',
        null,
        'The Kool Kats',
        null,
        'Huddersfield Eagles',
        'The Auto-Warriors',
        'Moneyballers',
        'J E T S JETSJETSJETS',
        'Founding Father',
        null,
        'Ayle Oola Ostriches',
        'THE FREAKS OF SPORT',
        'Hernandez\'s Hitmen',
        'ItsFarrellyFootball',
        'Real slim Brady',
        null,
        'Ghost of Mufasa',
        'Sankey Slingers Ltd',
        'The Tucker Rule',
        'Greg’s Great Team',
        'The Prince Of Dallas'],
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
  
  await manager.update.match({
    id:16,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Armchair Athletics')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'Josh and the Whale')[0].score
    }
  });
  
  await manager.update.match({
    id:17,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Merseyside Enforcers')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'La Résistance')[0].score
    }
  });

  await manager.update.match({
    id:18,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Night Shift Packers')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'P\'Town Hurri-CAINS')[0].score
    }
  });

  await manager.update.match({
    id:19,
    opponent1:{
      score: teamData.filter((e) => e.name == 'The Kool Kats')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'Huddersfield Eagles')[0].score
    }
  });

  await manager.update.match({
    id:20,
    opponent1:{
      score: teamData.filter((e) => e.name == 'The Auto-Warriors')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'J E T S JETSJETSJETS')[0].score
    }
  });

  await manager.update.match({
    id:21,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Ayle Oola Ostriches')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'THE FREAKS OF SPORT')[0].score
    }
  });

  await manager.update.match({
    id:22,
    opponent1:{
      score: teamData.filter((e) => e.name == 'ItsFarrellyFootball')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'Ghost of Mufasa')[0].score
    }
  });

  await manager.update.match({
    id:23,
    opponent1:{
      score: teamData.filter((e) => e.name == 'Sankey Slingers Ltd')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'Greg’s Great Team')[0].score
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