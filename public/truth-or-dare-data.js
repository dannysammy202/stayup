/* Say More Truth or Dare: complete 8,400-card, remote-first topic matrix.
 * Theme wording is authored, then expanded into audience-aware prompts.
 * Editorial status records the distinction between screening and individual approval.
 * Adults-only uses distinct prompts, with romantic language limited to crush/partner.
 */
(()=>{
const contexts={"Anyone":{"inConvo":"in an everyday conversation","person":"someone you're chatting with","relationship":"everyday conversations","text":"the current conversation","target":"the other player","callTarget":"the other player"},"Someone new":{"inConvo":"while getting to know somebody new","person":"someone you've recently met","relationship":"a new connection","text":"your chat with someone new","target":"the person you're getting to know","callTarget":"the person you're getting to know"},"Friends":{"inConvo":"while catching up with a friend","person":"your friend","relationship":"a friendship","text":"your chat with a friend","target":"your friend","callTarget":"your friend"},"Crush / Talking stage":{"inConvo":"while chatting with someone you fancy","person":"the person you're interested in","relationship":"a talking stage","text":"your chat with someone you fancy","target":"the person you're flirting with","callTarget":"the person you're flirting with"},"Partner":{"inConvo":"while talking with your partner","person":"your partner","relationship":"your romantic relationship","text":"your chat with your partner","target":"your partner","callTarget":"your partner"},"Family":{"inConvo":"while talking with a family member","person":"a family member","relationship":"family conversations","text":"your family chat","target":"a family member","callTarget":"a family member"},"Group":{"inConvo":"while chatting with a group","person":"someone in the group","relationship":"group conversations","text":"your group chat","target":"the group","callTarget":"the group"}};
const truthBanks=window.SayMoreTodTruthBanks;
const dareBanks=window.SayMoreTodDareBanks;
if(!truthBanks||!dareBanks)throw new Error('Truth or Dare theme bank unavailable');
const levels=['Chill','Playful','Bold'];
const cards=[];
const forms=['text','voice-note','call','text-game'];
const channels=['Text','Call'];
const truthVariants=[
(m,c,i)=>[
 `Have you ever found yourself ${m} ${c.inConvo}? What happened?`,
 `What's the story behind ${m} ${c.inConvo}?`,
 `Thinking about ${c.person}, when did you last find yourself ${m}?`,
 `What did you learn from ${m} ${c.inConvo}?`,
 `What made ${m} ${c.inConvo} memorable?`
][i%5],
(a,b,c,i)=>[
 `Would you rather ${a} or ${b} ${c.inConvo}?`,
 `If you had to choose when talking with ${c.person}, would you ${a} or ${b}?`,
 `Which fits you better with ${c.person}: ${a}, or ${b}?`,
 `When it involves ${c.person}, which would you pick: ${a} or ${b}?`,
 `When talking with ${c.person}, would you prefer to ${a} or ${b}?`
 ][i%5],
(t,c,i)=>[
 `What's your take on ${t} ${c.inConvo}?`,
 `How do you see ${t} when it involves ${c.person}?`,
 `Is your view on ${t} different with ${c.person}?`,
 `What do people overlook about ${t} in ${c.relationship}?`,
 `How would you explain your view on ${t} to ${c.person}?`
 ][i%5],
(t,c,i)=>[
 `If ${c.person} asked you to explain ${t}, where would you start?`,
 `Suppose ${c.person} disagreed with your view on ${t}. How would you respond?`,
 `What would you say if ${c.person} were unsure about ${t}?`,
 `If ${c.person} brought up ${t} unexpectedly, would you engage or change the subject?`,
 `How would you respond if ${c.person} asked a direct question about ${t}?`
 ][i%5]
];
for(const adult of [false,true]){
 for(const [audience,c] of Object.entries(contexts)){
  const name=adult?(audience==='Partner'||audience==='Crush / Talking stage'?'adultRomantic':'adultGeneral'):'everyday';
  for(const level of levels){
   const rowsT=truthBanks[name][level];
   const rowsD=dareBanks[name][level];
   if(rowsT.length!==25||rowsD.length!==25)throw new Error('Incorrect starter themes');
   const mode=adult?'A':'E';
   const key=Object.keys(contexts).indexOf(audience)+1;
   const levelKey=levels.indexOf(level)+1;
   for(const [type,rows] of [['Truth',rowsT],['Dare',rowsD]]){
   for(const medium of channels){
    let index=0;
    for(const [i,line] of rows.entries()){
     const parts=line.split('|');
     if(parts.length!==4)throw new Error('Incorrect prompt theme');
     for(let j=0;j<4;j++){
      let txt;
      const task=type==='Dare'?parts[j].replace(/[.!?]+$/,''):'';
      if(type==='Truth'){
       if(j===0)txt=truthVariants[0](parts[0],c,i);
       if(j===1)txt=truthVariants[1](parts[1],parts[2],c,i);
       if(j===2)txt=truthVariants[2](parts[3],c,i);
       if(j===3)txt=truthVariants[3](parts[3],c,i);
      }else{
       if(j===0||j===3)txt=`In ${c.text}, ${task}.`;
       else if(j===1)txt=`Send ${c.target} a short voice note: ${task}.`;
       else txt=`On a call with ${c.callTarget}, ${task}.`;
      }
      if(medium==='Call'){
       if(type==='Truth')txt=`On your call, ${txt.charAt(0).toLowerCase()+txt.slice(1)}`;
       else txt=j===1?`Say this live to ${c.callTarget}: ${task}.`:j===2?`While speaking with ${c.callTarget}, ${task}.`:`On your call with ${c.callTarget}, ${task}.`;
      }else if(type==='Dare'){
       txt=j===1?`Send ${c.target} a text message: ${task}.`:j===2?`Write a message to ${c.target}: ${task}.`:`In ${c.text}, ${task}.`;
      }
      const id=`tod-${mode}-${medium==='Call'?'C':'X'}-${key}-${levelKey}-${type==='Truth'?'T':'D'}-${String(++index).padStart(3,'0')}`;
      cards.push({id,type,text:txt,audiences:[audience],level,adult,medium,channel:type==='Truth'?'conversation':medium==='Call'?'call':'text',editorialStatus:'screened_pending_editorial_review',humanReviewed:false,source:'authored-theme-matrix'});
     }
    }
    if(index!==100)throw new Error('Incorrect card count');
   }
   }
  }
 }
}
if(cards.length!==16800)throw new Error('Incorrect total card count');
const normalise=s=>s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
if(new Set(cards.map(c=>normalise(c.text))).size!==cards.length)throw new Error('Repeated card detected');
window.SayMoreTruthOrDare=Object.freeze(cards);
window.SayMoreTruthOrDareSummary=Object.freeze({total:cards.length,everyday:8400,adult:8400,truth:8400,dare:8400,perCombinationPerType:100});
})();
