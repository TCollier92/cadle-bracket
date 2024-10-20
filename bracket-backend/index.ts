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

let nextFetch: number = Date.now() - 1;
let cachedData: string = '';
let weekIsFinal: boolean = false;

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
  const d1Data = await fetchPage('https://football.fantasysports.yahoo.com/league/cadlefantasyleague?matchup_week=7&module=matchups&lhst=matchups');
  const d1Dom = cheerio.load(d1Data);
  weekIsFinal = d1Dom('#matchupweek').find('div.Bg-shade').find('div.Ta-end').find('span').html() == 'Final results';
  const d1MatchupRows = d1Dom('#matchupweek')
    .find('.List')
    .find('li');
  const d1TeamContainers = d1MatchupRows
    .find('div.Grid-h-mid.Nowrap');
  const d2Data = await fetchPage('https://football.fantasysports.yahoo.com/league/cadlefantasyleaguedivision2?matchup_week=7&module=matchups&lhst=matchups');
  const d2Dom = cheerio.load(d2Data);
  const d2MatchupRows = d2Dom('#matchupweek')
    .find('.List')
    .find('li');
  const d2TeamContainers = d2MatchupRows
    .find('div.Grid-h-mid.Nowrap');
  let Teams: any = []
  d1TeamContainers.each(function (i, el) {
    const score = weekIsFinal ? (parseInt(d1Dom(el).find('.Fz-lg').html() ?? '0')) : (parseInt(d1Dom(el).find('.Grid-u-1-4 .F-shade').html() ?? '0'));
    Teams.push({
      name: d1Dom(el).find('a.F-link').text(),
      score: score
    });
  });
  d2TeamContainers.each(function (i, el) {
    const score = weekIsFinal ? (parseInt(d1Dom(el).find('.Fz-lg').html() ?? '0')) : (parseInt(d1Dom(el).find('.Grid-u-1-4 .F-shade').html() ?? '0'));
    Teams.push({
      name: d2Dom(el).find('a.F-link').text(),
      score: score
    });
  });
  return Teams;
}

async function buildBracket(): Promise<string> {
  if (nextFetch >= Date.now()) {
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
      'Skylines',
      'The Prince Of Dallas',
      'Real slim Brady',
      'Moneyballers',

      'La Résistance',
      'Armchair Athletics',
      null,
      'Ayle Oola Ostriches',

      'The Auto-Warriors',
      'The Sorcerer\'s Apprentice',
      'Out of Luck',
      'The Tucker Rule',

      'Hernandez\'s Hitmen',
      'Huddersfield Eagles',
      'Afternoon Shift Packers',
      'ItsFarrellyFootball',

      null,
      'THE FREAKS OF SPORT',
      null,
      'Suicide Squad',

      null,
      'Merseyside Enforcers',
      'Founding Father',
      'Ghost of Mufasa',

      'P\'Town Hurri-CAINS',
      'The Kool Kats',
      'J E T S JETSJETSJETS',
      'Josh and the Whale',

      null,
      'Sankey Slingers Ltd',
      null,
      'Greg’s Great Team',
    ],
    settings: {
      seedOrdering: ['natural']
    }
  });
  // Skyline-Dallas
  await manager.update.match({
    id: 0,
    opponent1: {
      score: 86,
      result: 'win'
    },
    opponent2: {
      score: 33
    }
  });
  // RSB-Ballers
  await manager.update.match({
    id: 1,
    opponent1: {
      score: 62,
    },
    opponent2: {
      score: 114,
      result: 'win'
    }
  });
  // La Res-Chairs
  await manager.update.match({
    id: 2,
    opponent1: {
      score: 95,
      result: 'win'
    },
    opponent2: {
      score: 69
    }
  });
  // Auto-Sorc
  await manager.update.match({
    id: 4,
    opponent1: {
      score: 48
    },
    opponent2: {
      score: 148,
      result: 'win'
    }
  });
  // Luck-Tuck
  await manager.update.match({
    id: 5,
    opponent1: {
      score: 97,
      result: 'win'
    },
    opponent2: {
      score: 96
    }
  });
  // Hitmen-Eagles
  await manager.update.match({
    id: 6,
    opponent1: {
      score: 96
    },
    opponent2: {
      score: 107,
      result: 'win'
    }
  });
  // ASP-IFF
  await manager.update.match({
    id: 7,
    opponent1: {
      score: 116
    },
    opponent2: {
      score: 117,
      result: 'win'
    }
  });
  // Father-Ghost
  await manager.update.match({
    id: 11,
    opponent1: {
      score: 82,
      result: 'win'
    },
    opponent2: {
      score: 79
    }
  });
  // Ptown-Kats
  await manager.update.match({
    id: 12,
    opponent1: {
      score: 54
    },
    opponent2: {
      score: 71,
      result: 'win'
    }
  });
  // JETS-Whale
  await manager.update.match({
    id: 13,
    opponent1: {
      score: 109,
      result: 'win'
    },
    opponent2: {
      score: 106
    }
  });

  //Round 2
  //Skylines-Ballers
  await manager.update.match({
    id: 16,
    opponent1: {
      score: teamData.filter((e) => e.name == 'Skylines')[0].score,
    },
    opponent2: {
      score: teamData.filter((e) => e.name == 'Moneyballers')[0].score
    }
  });
  //LaRes-Ostrich
  await manager.update.match({
    id: 17,
    opponent1: {
      score: teamData.filter((e) => e.name == 'La Résistance')[0].score,
    },
    opponent2: {
      score: teamData.filter((e) => e.name == 'Ayle Oola Ostriches')[0].score
    }
  });
  //Sorc-Luck
  await manager.update.match({
    id: 18,
    opponent1: {
      score: teamData.filter((e) => e.name == 'The Sorcerer\'s Apprentice')[0].score,
    },
    opponent2: {
      score: teamData.filter((e) => e.name == 'Out of Luck')[0].score
    }
  });
  //Eagles-IFF
  await manager.update.match({
    id: 19,
    opponent1: {
      score: teamData.filter((e) => e.name == 'Huddersfield Eagles')[0].score,
    },
    opponent2: {
      score: teamData.filter((e) => e.name == 'ItsFarrellyFootball')[0].score
    }
  });
  //FREAKS-suicide
  await manager.update.match({
    id: 20,
    opponent1: {
      score: teamData.filter((e) => e.name == 'THE FREAKS OF SPORT')[0].score,
    },
    opponent2: {
      score: teamData.filter((e) => e.name == 'Suicide Squad')[0].score
    }
  });
  //Enforcers-Father
  await manager.update.match({
    id: 21,
    opponent1: {
      score: teamData.filter((e) => e.name == 'Merseyside Enforcers')[0].score,
    },
    opponent2: {
      score: teamData.filter((e) => e.name == 'Founding Father')[0].score
    }
  });
  //Kats-Jets
  await manager.update.match({
    id: 22,
    opponent1: {
      score: teamData.filter((e) => e.name == 'The Kool Kats')[0].score,
    },
    opponent2: {
      score: teamData.filter((e) => e.name == 'J E T S JETSJETSJETS')[0].score
    }
  });
  //Slingers-GGT
  await manager.update.match({
    id: 23,
    opponent1: {
      score: teamData.filter((e) => e.name == 'Sankey Slingers Ltd')[0].score,
    },
    opponent2: {
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
  if (process.env.CORS != undefined) {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS);
  }
  res.send(await buildBracket());
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});