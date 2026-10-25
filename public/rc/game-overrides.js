/* Editorial candidates only; original values remain in games.js for audit.
   Different game mechanics and wording replace 30 verbatim conversation overlaps. */
(function(){
  const overrides={
  "ng-game-truthdare-truth-001": "Have you ever told someone outside your family something you were too afraid to say at home?",
  "ng-game-truthdare-truth-002": "What's the funniest excuse your parents have ever given for not wanting visitors?",
  "ng-game-truthdare-truth-003": "Have you ever pretended you had plans just to avoid a family visit during the holidays?",
  "ng-game-truthdare-truth-004": "What's one small thing someone does at home that makes you feel genuinely wanted?",
  "ng-game-truthdare-truth-005": "Has a friend ever joked about something that actually hurt your feelings, but you laughed anyway?",
  "ng-game-truthdare-truth-006": "What's the last childish thing you did that you wouldn't want your younger siblings to catch you doing?",
  "ng-game-truthdare-truth-007": "Have you secretly tried to revive a childhood dream without telling anybody?",
  "ng-game-truthdare-truth-008": "How many unread WhatsApp messages are on your phone right now? No cheating.",
  "ng-game-truthdare-truth-009": "Did you ever blame a sibling for something you broke as a child?",
  "ng-game-truthdare-truth-010": "Did you check your NYSC posting more than once hoping the state would somehow change?",
  "ng-game-hot-hottakes-001": "If you can't talk about money with someone you're planning a future with, you're not ready to plan that future.",
  "ng-game-hot-hottakes-002": "Guests shouldn't be offended if someone at a family gathering would rather sit quietly than make small talk.",
  "ng-game-hot-hottakes-003": "Nigerian parents should stop making children feel guilty for not speaking their mother tongue fluently.",
  "ng-game-hot-hottakes-004": "A plate of jollof at home with good company can beat a fancy restaurant experience any day.",
  "ng-game-hot-hottakes-005": "Remembering someone's little preferences is more romantic than buying an expensive surprise once a year.",
  "ng-game-hot-hottakes-006": "Posting your friend's achievements is not proof you're a better friend than someone who congratulates them privately.",
  "ng-game-hot-hottakes-007": "Nobody should be interrogated about marriage just because they attended somebody else's wedding.",
  "ng-game-hot-hottakes-008": "A roadside buka with consistently good food deserves more hype than a beautiful restaurant with average food.",
  "ng-game-hot-hottakes-009": "Respect for elders shouldn't mean younger people have to agree with every opinion.",
  "ng-game-hot-hottakes-010": "If guests spend the whole owambe complaining about the wait, the food wasn't good enough to save the event.",
  "ng-game-story-storyspark-021": "Tell the story of a lecturer who surprised you by actually making you love a difficult course.",
  "ng-game-story-storyspark-043": "Take us through the Lagos trip that made you swear you'd never trust Google Maps' arrival time again.",
  "ng-game-story-storyspark-051": "Paint a picture of the teacher whose footsteps alone could silence your entire classroom.",
  "ng-game-story-storyspark-057": "Tell us how the course you expected to hate became one you looked forward to attending.",
  "ng-game-story-storyspark-059": "Recreate the moment you walked out of your very last university exam. What happened immediately after?",
  "ng-game-story-storyspark-064": "Tell us about a time you nearly missed work because you couldn't find your NYSC PPA.",
  "ng-game-story-storyspark-065": "Reenact the classroom argument that made everybody forget there was supposed to be a lecture.",
  "ng-game-story-storyspark-069": "Describe the camp day you almost packed your bags. What made you stay?",
  "ng-game-story-storyspark-099": "Tell us how you and your closest NYSC friend first met—include the part they'd probably tell differently.",
  "ng-game-story-storyspark-111": "Tell us about the camp rule you learnt the hard way. Who caught you?"
};
  if(!Array.isArray(window.SAYMORE_GAME_LIBRARY))throw new Error('Game catalogue missing');
  const found=new Set();
  for(const card of window.SAYMORE_GAME_LIBRARY){
    if(Object.prototype.hasOwnProperty.call(overrides,card.id)){
      card.originalDraftText=card.text;
      card.text=overrides[card.id];
      card.editorialStatus='rewritten_game_candidate_pending_independent_review';
      found.add(card.id);
    }
  }
  if(found.size!==Object.keys(overrides).length)throw Error('Missing game cards for editorial overrides');
  window.SAYMORE_GAME_EDITORIAL_REWRITE_COUNT=found.size;
})();
