import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext, Script} from 'node:vm';

const cwd=process.cwd();
const source=readFileSync(cwd+'/public/conversation-experiences.js','utf8');
const sandbox={window:{}};
runInNewContext(source,sandbox);
runInNewContext(readFileSync(cwd+'/public/conversation-expansion.js','utf8'),sandbox);
runInNewContext(readFileSync(cwd+'/public/conversation-next-starters.js','utf8'),sandbox);
runInNewContext(readFileSync(cwd+'/public/conversation-next-games.js','utf8'),sandbox);
runInNewContext(readFileSync(cwd+'/public/conversation-moments.js','utf8'),sandbox);
runInNewContext(readFileSync(cwd+'/public/play-moments.js','utf8'),sandbox);
for(const f of ['editorial-d1.js','editorial-d2.js','games-d1.js','games-d2.js','editorial-e1.js','games-e1.js'])runInNewContext(readFileSync(cwd+'/public/'+f,'utf8'),sandbox);
const experience=sandbox.window.SayMoreExperience;
const expansion=sandbox.window.SayMoreExpansion;
const newPrompts=sandbox.window.SayMoreNextStarters;
const newGames=sandbox.window.SayMoreNextGames;
const moments=sandbox.window.SayMoreConversationMoments;
const playMoments=sandbox.window.SayMorePlayMoments;
const allPrompts=[...experience.pilot,...expansion.pilot,...newPrompts,...moments,...sandbox.window.SayMoreEditorialD1,...sandbox.window.SayMoreEditorialD2,...sandbox.window.SayMoreEditorialE1];
const allGames=[...experience.games,...expansion.games,...newGames,.¶»§q«^