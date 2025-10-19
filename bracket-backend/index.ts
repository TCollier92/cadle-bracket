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

const t_freaks = 'THE FREAKS OF SPORT';
const t_auto = 'The Auto-Warriors';
const t_sorc = 'The Sorcerer\'s Apprentice';
const t_tuck = 'Tuck';
const t_hernandez = 'Hernandez\'s Hitmen';
const t_hudds = 'Huddersfield Eagles';
const t_asp = 'Afternoon Shift Packers';
const t_farrelly = 'ItsFarrellyFootball';
const t_lares = 'La Résistance';
const t_chairs = 'Armchair Athletics';
const t_ostriches = 'Ayle Oola Ostriches';
const t_ptown = 'P\'Town Hurri-CAINS';
const t_kats = 'The Kool Kats';
const t_jets = 'J E T S JETSJETSJETS';
const t_enforcers = 'Merseyside Enforcers';
const t_father = 'Founding Father';
const t_ghost = 'Ghost of Mufasa';
const t_skylines = 'Skylines';
const t_prince = 'The Prince Of Dallas';
const t_mdm = 'Million Dollar Man';
const t_ballers = 'Moneyballers';
const t_slingers = 'Sankey Slingers Ltd';
const t_ggt = 'Greg’s Great Team';
const t_muffin = 'The Muffin Men';
const t_captain = 'The Captain'

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
      t_captain,
      t_muffin,
      t_lares,
      t_jets,
      t_freaks,
      null,
      t_ballers,
      t_chairs,

      t_ggt,
      null,
      t_prince,
      null,
      t_auto,
      t_asp,
      t_slingers,
      t_sorc,
      
      t_kats,
      t_hudds,
      t_farrelly,
      t_father,
      t_tuck,
      null,
      t_enforcers,
      null,

      t_ptown,
      null,
      t_hernandez,
      null,
      t_ostriches,
      t_mdm,
      t_skylines,
      t_ghost
    ],
    settings: {
      seedOrdering: ['natural']
    }
  });

  //Round1
  await manager.update.match({
    id: 0,
    opponent1: {
      score: 100,
      result: 'win'
    },
    opponent2: {
      score: 77
    }
  });
  await manager.update.match({
    id: 1,
    opponent1: {
      score: 81,
    },
    opponent2: {
      score: 86,
      result:'win'
    }
  });
  await manager.update.match({
    id: 3,
    opponent1: {
      score: 68,
    },
    opponent2: {
      score: 82,
      result: 'win'
    }
  });
  await manager.update.match({
    id: 6,
    opponent1: {
      score: 116,
      result: 'win'
    },
    opponent2: {
      score: 73
    }
  });
  await manager.update.match({
    id: 7,
    opponent1: {
      score: 93,
      result: 'win'
    },
    opponent2: {
      score: 80
    }
  });
  await manager.update.match({
    id: 8,
    opponent1: {
      score: 110,
      result: 'win'
    },
    opponent2: {
      score: 46
    }
  });
  await manager.update.match({
    id: 9,
    opponent1: {
      score: 79,
    },
    opponent2: {
      score: 93,
      result: 'win'
    }
  });
  await manager.update.match({
    id: 14,
    opponent1: {
      score: 85,
      result: 'win'
    },
    opponent2: {
      score: 76
    }
  });
  await manager.update.match({
    id: 15,
    opponent1: {
      score: 74
    },
    opponent2: {
      score: 102,
      result: 'win'
    }
  });

  //Round 2
  await manager.update.match({
    id: 16,
    opponent1: {
      score: 96,
      result: 'win'
    },
    opponent2: {
      score: 66
    }
  });
  await manager.update.match({
    id: 17,
    opponent1: {
      score: 91,
      result: 'win'
    },
    opponent2: {
      score: 74
    }
  });
  await manager.update.match({
    id: 18,
    opponent1: {
      score: 107
    },
    opponent2: {
      score: 121,
      result: 'win'
    }
  });
  await manager.update.match({
    id: 19,
    opponent1: {
      score: 73,
      result:'win'
    },
    opponent2: {
      score: 67
    }
  });
  await manager.update.match({
    id: 20,
    opponent1: {
      score: 58,
    },
    opponent2: {
      score: 86,
      result:'win'
    }
  });
  await manager.update.match({
    id: 21,
    opponent1: {
      score: 46,
    },
    opponent2: {
      score: 60,
      result:'win'
    }
  });
  await manager.update.match({
    id: 22,
    opponent1: {
      score: 106,
      result: 'win'
    },
    opponent2: {
      score: 74
    }
  });
  await manager.update.match({
    id: 23,
    opponent1: {
      score: 98,
      result:'win'
    },
    opponent2: {
      score: 72
    }
  });

  //Round 3
  await manager.update.match({
    id: 24,
    opponent1: {
      score: teamData.filter((e) => e.name == t_captain)[0].score,
    },
    opponent2: {
      score: teamData.filter((e) => e.name == t_freaks)[0].score
    }
  });
  await manager.update.match({
    id: 25,
    opponent1: {
      score: teamData.filter((e) => e.name == t_prince)[0].score,
    },
    opponent2: {
      score: teamData.filter((e) => e.name == t_auto)[0].score
    }
  });
  await manager.update.match({
    id: 26,
    opponent1: {
      score: teamData.filter((e) => e.name == t_father)[0].score,
    },
    opponent2: {
      score: teamData.filter((e) => e.name == t_enforcers)[0].score
    }
  });
  await manager.update.match({
    id: 27,
    opponent1: {
      score: teamData.filter((e) => e.name == t_ptown)[0].score,
    },
    opponent2: {
      score: teamData.filter((e) => e.name == t_ostriches)[0].score
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