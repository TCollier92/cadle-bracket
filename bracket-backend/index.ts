import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';
import { BracketsManager } from 'brackets-manager';
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
    seeding: ['The Kool Kats', 'The Tucker Rule', 'THE FREAKS OF SPORT', 'Moneyballers'],
    settings: {
      seedOrdering: ['natural']
    }
  });
  await manager.update.match({
    id:0,
    opponent1:{
      score: 100,
      result: 'win'
    },
    opponent2:{
      score:50
    }
  });
  await manager.update.match({
    id:1,
    opponent1:{
      score: 75,
      result: 'win'
    },
    opponent2:{
      score:30
    }
  });
  await manager.update.match({
    id:2,
    opponent1:{
      score: teamData.filter((e) => e.name == 'The Kool Kats')[0].score
    },
    opponent2:{
      score: teamData.filter((e) => e.name == 'THE FREAKS OF SPORT')[0].score
    }
  });
  cachedData = JSON.stringify(db);
  nextFetch = Date.now() + 15000;
  return cachedData;
}

app.get('/bracketData', async (req: Request, res: Response) => {
  res.setHeader('content-type', 'application/json');
  res.send(await buildBracket());
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});