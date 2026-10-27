/* Say More: instant offline introductions, never conversation follow-ups. */
(function(){
'use strict';
const leads={
 lagos:["Lagos gist is never straightforward 😂","Wait, speaking of Lagos...","Okay, a Lagos matter for you."],
 food:["Food discussions can cause serious arguments 😂","Wait, I have a food question.","Settle this food matter for me."],
 love:["This relationship matter has me curious 😅","Wait, there's something about dating I want your take on.","Okay, honest relationship question."],
 friends:["Friendship gist is its own category 😂","Speaking of friends, something crossed my mind.","Every friend group has its own story."],
 family:["Nigerian family stories never finish 😂","Wait, let me ask you something about family.","Okay, family gist for a second."],
 school:["School-day memories are always something else 😂","You remember how school used to be?","Okay, take us back to school days."],
 nysc:["NYSC camp genuinely deserves a reality show 😭","Wait, something about NYSC just crossed my mind.","Okay, service-year gist. I need this one."],
 work:["Office life gives people plenty of stories 😅","Wait, speaking of work...","Let's talk about workplace life for a second."],
 money:["Money conversations get interesting fast.","I have a question about spending and money.","Let's settle a money matter."],
 culture:["Nigerian life has so many small surprises.","You know how differently people grow up?","Okay, a Nigerian-life question."],
 music:["Music opinions can test friendships 😂","Wait, I've got a music and entertainment question.","Okay, let's talk music and films."],
 owambe:["Owambe gist is something else 😂","You know how Nigerian parties can get?","Okay, party gist. No names needed."],
 digital:["Our phones have witnessed too much 😂","Speaking of texting and phones...","Let's talk about how we behave online."],
 travel:["Every journey comes with unexpected gist.","Wait, speaking of trips...","Okay, a question about places we've been."],
 childhood:["Childhood gist hits differently 😂","This takes me back to growing up.","Okay, childhood memories."],
 faith:["Here's a faith-and-life thought I want to discuss.","Wait, something about faith crossed my mind.","I'm curious how you see this."],
 housing:["Neighbours always have their own stories 😅","You know how shared buildings can be?","Okay, let's talk about home and neighbours."],
 general:["This one is random, but I'm curious 😄","Wait, something just crossed my mind.","Okay, quick one for you."]
};
const tags={nysc:"nysc",lagos:"lagos",food:"food",love:"love",friends:"friends",parents:"family",family:"family",school:"school",university:"school",work:"work",money:"money",pop:"music",owambe:"owambe",digital:"digital",faith:"faith",travel:"travel",childhood:"childhood",housing:"housing"};
const patterns=[
["nysc",/\b(nysc|platoon|corps members?|allowee|ppa|cds)\b/i],
["lagos",/\b(lagos|danfo|keke|lekki|ikoyi|mainland|island|bus stop|conductor|traffic)\b/i],
["food",/\b(jollof|food|amala|swallow|egusi|buka|suya|puff.puff|plantain|chops|meal|cooking|rice|noodles)\b/i],
["love",/\b(crush|dating|romance|relationship|boyfriend|girlfriend|first date|flirt|talking stage)\b/i],
["friends",/\b(friendship|friends?|bestie|hangout|group chat)\b/i],
["family",/\b(parents?|mother|father|mum|dad|siblings?|cousins?|auntie|uncle|family|relatives?)\b/i],
["school",/\b(university|lecturer|secondary school|school|classmates?|exam|campus|hostel|teacher)\b/i],
["work",/\b(work|office|boss|colleague|interview|deadline|career)\b/i],
["money",/\b(money|₦|budget|bargain|purchase|payday|saving|financial|salary|rent|bill)\b/i],
["owambe",/\b(owambe|wedding|party|birthday|aso.ebi|celebration)\b/i],
["music",/\b(music|afrobeats|nollywood|film|movie|artist|song|concert|cinema|album)\b/i],
["digital",/\b(whatsapp|online|phone|internet|meme|emoji|voice note|social media)\b/i],
["faith",/\b(church|prayer|bible|worship|faith|spiritual)\b/i],
["travel",/\b(travel|trip|journey|holiday|airport|flight)\b/i],
["childhood",/\b(childhood|as a child|growing up|playground)\b/i],
["housing",/\b(neighbour|estate|landlord|apartment|housemate|home)\b/i],
["culture",/\b(culture|tradition|yoruba|igbo|hausa)\b/i]
];
function topicOf(card){
 for(const t of (Array.isArray(card.tags)?card.tags:[]))if(tags[t])return tags[t];
 const text=String(card.text||"");
 for(const row of patterns)if(row[1].test(text))return row[0];
 return "general";
}
function styleOf(card){
 const kind=String(card.kind||"");
 const text=String(card.text||"");
 if(kind==="Dare")return "dare";
 if(kind==="Would You Rather"||/^Would you rather\b/i.test(text))return "rather";
 if(kind==="Never Have I Ever"||/^Never have I ever\b/i.test(text))return "never";
 if(kind==="This or That")return "choice";
 if(kind==="Hot Takes"||kind==="Hot Take")return "take";
 if(kind==="Story Spark"||/^(Tell us|Tell me|Tell the story|Share a story|Share the story|Recount|Describe a |Describe the |Describe your )/i.test(text))return "story";
 if(text.includes("?"))return "question";
 return "observation";
}
function storyText(s){return s.replace(/^Tell us\b/i,"Tell me").replace(/^Share the story of\b/i,"Tell me the story of").replace(/^Share a story about\b/i,"Tell me about").replace(/^Tell the story of\b/i,"Tell me the story of").replace(/^Recount\b/i,"Tell me about").replace(/^Describe\b/i,"Tell me about");}
function opener(card,medium){
 const text=String(card.text||"").replace(/\s+/g," ").trim();
 const style=styleOf(card),topic=topicOf(card);
 const intro=leads[topic]||leads.general;
 const lead=intro[medium==="text"?0:medium==="call"?1:2];
 if(style==="rather")return (medium==="text"?"Quick would-you-rather for you 😂 ":medium==="call"?"Wait, I have a would-you-rather for you. ":"Everybody has to choose one. No dodging 😄 ")+text;
 if(style==="never")return (medium==="text"?"Let's try a quick one 😅 ":medium==="call"?"Okay, Never Have I Ever. ":"Alright, one round of Never Have I Ever. ")+text;
 if(style==="dare"){
  const head=medium==="text"?"Small challenge for you 😂 ":medium==="call"?"Okay, I have a silly dare for you. ":"Your turn. Here's a harmless dare. ";
  return head+text+(medium==="text"&&!/^(Type|Write|Send|Text|List|Name)\b/i.test(text)?" A voice note works too.":"");
 }
 if(style==="choice")return (medium==="text"?"Settle this one for me 😂 ":medium==="call"?"Wait, you have to pick one. ":"Okay, everybody pick a side. ")+text;
 if(style==="take"){
  const claim=text.replace(/[.!?]\s*$/,"");
  return (medium==="text"?lead+" "+claim+". Agree or disagree?":medium==="call"?"Hear me out for a second. "+claim+". What's your take?":"Okay, I need an honest verdict. "+claim+". Agree or disagree?");
 }
 if(style==="story"){
  const head=medium==="text"?"I need to hear this story 😂 ":medium==="call"?"Wait, tell me something. ":"Story time. I want to hear this one. ";
  return head+storyText(text);
 }
 return lead+" "+text;
}
function forCard(card){
 if(!card||typeof card.text!=="string"||!card.text.trim())return null;
 return {text:opener(card,"text"),call:opener(card,"call"),person:opener(card,"person")};
}
window.SayMoreHowToSayIt=Object.freeze({forCard,topicOf,styleOf});
})();
