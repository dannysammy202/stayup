const G = (text, extra = {}) => ({ text, ...extra })

export const foundationGamePrompts = {
  'truth-dare': {
    friend: [
      G('What is something you have done to avoid greeting someone you recognised in public?', { subtype: 'Truth', intensity: 'Chill' }),
      G('What is the most unserious reason you have ever been annoyed with a friend?', { subtype: 'Truth', intensity: 'Chill' }),
      G('What is one thing your family still teases you about from when you were younger?', { subtype: 'Truth', intensity: 'Interesting' }),
      G('What is a lie you told as a child that became much bigger than you expected?', { subtype: 'Truth', intensity: 'Interesting' }),
      G('What is the most money you have spent on something and regretted almost immediately?', { subtype: 'Truth', intensity: 'Interesting' }),
      G('Which friendship did you hold onto longer than you should have?', { subtype: 'Truth', intensity: 'Deep' }),
      G('What is something you judge people for even though you know it is petty?', { subtype: 'Truth', intensity: 'No Filter' }),
      G('What is one message you have typed, deleted and been grateful you never sent?', { subtype: 'Truth', intensity: 'No Filter' }),
      G('Send a voice note doing your best impression of one of your secondary school teachers.', { subtype: 'Dare', intensity: 'Chill' }),
      G('Change your WhatsApp status to a sentence I choose for ten minutes.', { subtype: 'Dare', intensity: 'Chill' }),
      G('Send the last harmless photo in your gallery without giving any context first.', { subtype: 'Dare', intensity: 'Interesting' }),
      G('Call me by the nickname your family used for you as a child for the next ten minutes.', { subtype: 'Dare', intensity: 'Interesting' }),
      G('Send a 20-second voice note selling me the most boring object near you as if it costs ₦1 million.', { subtype: 'Dare', intensity: 'Interesting' }),
      G('Tell me one compliment you have thought about giving me but never said.', { subtype: 'Dare', intensity: 'Deep' }),
      G('Read out your last three recent searches, skipping anything private.', { subtype: 'Dare', intensity: 'No Filter' }),
      G('Let me choose one harmless question you must answer using only a voice note.', { subtype: 'Dare', intensity: 'No Filter' }),
    ],
    relationship: [
      G('What did you first assume about me before you knew me properly?', { subtype: 'Truth', intensity: 'Chill', stages: ['Talking Stage', 'New Relationship', 'Been Together a While'] }),
      G('What is one small thing I do that makes you feel cared for?', { subtype: 'Truth', intensity: 'Interesting' }),
      G('What part of dating do you think people in Nigeria make more complicated than it needs to be?', { subtype: 'Truth', intensity: 'Interesting' }),
      G('What is something about money you would rather discuss early than discover later?', { subtype: 'Truth', intensity: 'Deep' }),
      G('What is one relationship boundary you learnt from experience rather than advice?', { subtype: 'Truth', intensity: 'Deep' }),
      G('What is something you have been afraid to ask me because you were unsure how I would take it?', { subtype: 'Truth', intensity: 'No Filter' }),
      G('What is one thing you think we disagree about more than either of us admits?', { subtype: 'Truth', intensity: 'No Filter', stages: ['Been Together a While', 'Long-Term Relationship', 'Married'] }),
      G('What is one part of our future you think about more often than you say?', { subtype: 'Truth', intensity: 'Deep', stages: ['Been Together a While', 'Long-Term Relationship', 'Married'] }),
      G('Send me a voice note describing our first proper conversation from your point of view.', { subtype: 'Dare', intensity: 'Chill' }),
      G('Give me a new pet name and use only that name for the next ten minutes.', { subtype: 'Dare', intensity: 'Flirty' }),
      G('Send me the song you think fits us best right now.', { subtype: 'Dare', intensity: 'Chill' }),
      G('Tell me three things you find attractive about me without mentioning my appearance.', { subtype: 'Dare', intensity: 'Flirty' }),
      G('Plan a date for us with a ₦20,000 budget and explain every choice.', { subtype: 'Dare', intensity: 'Interesting' }),
      G('Send a 30-second voice note saying what you think I do better in this relationship than I realise.', { subtype: 'Dare', intensity: 'Deep' }),
      G('Let me ask one question about us that you have to answer without saying “I do not know”.', { subtype: 'Dare', intensity: 'No Filter' }),
      G('Describe the kind of married life you would enjoy in five sentences or fewer.', { subtype: 'Dare', intensity: 'Deep', stages: ['Long-Term Relationship', 'Married'] }),
    ],
  },

  'never-have-i-ever': {
    friend: [
      G('Never have I ever pretended not to see someone I knew in public.', { intensity: 'Chill' }),
      G('Never have I ever lied about being on my way when I had not left home.', { intensity: 'Chill' }),
      G('Never have I ever used “network” as an excuse when the real reason was I did not want to talk.', { intensity: 'Interesting' }),
      G('Never have I ever borrowed money and hoped the person would forget.', { intensity: 'No Filter' }),
      G('Never have I ever checked someone’s social media before meeting them properly.', { intensity: 'Interesting' }),
      G('Never have I ever hidden food because I did not want to share it at home.', { intensity: 'Chill' }),
      G('Never have I ever fallen asleep during a church service and acted as if I was praying.', { intensity: 'Interesting' }),
      G('Never have I ever taken a longer route to avoid someone I did not want to greet.', { intensity: 'Chill' }),
    ],
    relationship: [
      G('Never have I ever reread our old messages because I missed a particular phase of us.', { intensity: 'Flirty' }),
      G('Never have I ever checked how long you took to reply before deciding how quickly I would reply.', { intensity: 'No Filter', stages: ['Talking Stage', 'New Relationship'] }),
      G('Never have I ever felt jealous and decided not to mention it.', { intensity: 'No Filter' }),
      G('Never have I ever planned an entire date in my head before asking if you were free.', { intensity: 'Flirty' }),
      G('Never have I ever worried about what my family would think of someone I was dating.', { intensity: 'Deep' }),
      G('Never have I ever compared a current relationship with a past one.', { intensity: 'Deep' }),
      G('Never have I ever saved a photo of you because I liked it more than I admitted.', { intensity: 'Flirty' }),
      G('Never have I ever avoided a difficult relationship conversation because the timing felt wrong.', { intensity: 'Deep' }),
    ],
  },

  'two-truths-lie': {
    friend: [
      G('Pick one statement to make your lie, then send all three.', { intensity: 'Chill', options: ['I have missed a flight or bus because I was late.', 'I have eaten the same meal three times in one day.', 'I have pretended my phone was dead to avoid replying.'] }),
      G('Pick one statement to make your lie, then send all three.', { intensity: 'Interesting', options: ['I have been punished in school for something I did not do.', 'I have won money from a bet or competition.', 'I have travelled somewhere without telling my parents first.'] }),
      G('Pick one statement to make your lie, then send all three.', { intensity: 'Chill', options: ['I have slept through an alarm for something important.', 'I have finished someone else’s food without asking.', 'I have worn an outfit twice because nobody important saw it the first time.'] }),
      G('Pick one statement to make your lie, then send all three.', { intensity: 'No Filter', options: ['I have muted a friend because they were annoying me.', 'I have lied about how much something cost.', 'I have kept talking to someone after deciding I did not like them.'] }),
      G('Pick one statement to make your lie, then send all three.', { intensity: 'Interesting', options: ['I have used a fake birthday online.', 'I have been inside a cybercafé after midnight.', 'I have owned a BlackBerry.'] }),
    ],
    relationship: [
      G('Pick one statement to make your lie, then send all three.', { intensity: 'Flirty', options: ['I noticed you before you noticed me.', 'I have shown your photo to a friend because I liked it.', 'I have rehearsed what I wanted to say before calling you.'] }),
      G('Pick one statement to make your lie, then send all three.', { intensity: 'Interesting', options: ['I have cancelled plans because I wanted to see someone I liked.', 'I have asked a friend to help me interpret a text from someone I liked.', 'I have pretended not to be jealous when I was.'] }),
      G('Pick one statement to make your lie, then send all three.', { intensity: 'Deep', options: ['I have stayed in a relationship after knowing it was over.', 'I have apologised first even when I still felt right.', 'I have worried that career plans would affect a relationship.'] }),
      G('Pick one statement to make your lie, then send all three.', { intensity: 'No Filter', options: ['I have checked an ex’s page while in another relationship.', 'I have hidden how upset I was to avoid an argument.', 'I have judged a partner’s friend before meeting them.'] }),
      G('Pick one statement to make your lie, then send all three.', { intensity: 'Flirty', options: ['I have saved a cute message instead of deleting the chat.', 'I have smiled at my phone because of something you sent.', 'I have planned what I would wear before a date days in advance.'] }),
    ],
  },

  'kiss-marry-avoid': {
    friend: [
      G('Kiss, marry, avoid.', { intensity: 'Chill', options: ['The funny one who is always broke', 'The quiet one with their life together', 'The fine one who replies every two days'] }),
      G('Kiss, marry, avoid.', { intensity: 'Interesting', options: ['Your secondary school crush', 'Your university crush', 'Your current celebrity crush'] }),
      G('Kiss, marry, avoid.', { intensity: 'Chill', options: ['The foodie', 'The gym person', 'The traveller'] }),
      G('Kiss, marry, avoid.', { intensity: 'No Filter', options: ['Someone your parents love', 'Someone your friends love', 'Someone nobody understands except you'] }),
      G('Kiss, marry, avoid.', { intensity: 'Interesting', options: ['The ambitious workaholic', 'The chilled homebody', 'The social butterfly'] }),
    ],
    relationship: [
      G('Kiss, marry, avoid. Pick based on the personality alone.', { intensity: 'Flirty', options: ['The romantic planner', 'The funny best-friend type', 'The quiet dependable type'] }),
      G('Kiss, marry, avoid.', { intensity: 'Interesting', options: ['Someone with money but no free time', 'Someone with time but little money', 'Someone ambitious but always relocating'] }),
      G('Kiss, marry, avoid.', { intensity: 'No Filter', options: ['The person your family prefers', 'The person your friends prefer', 'The person only you understand'] }),
      G('Kiss, marry, avoid.', { intensity: 'Interesting', options: ['The long-distance sweetheart', 'The neighbour you see every day', 'The colleague you work with closely'] }),
      G('Kiss, marry, avoid.', { intensity: 'Flirty', options: ['The great texter', 'The great caller', 'The great date planner'] }),
    ],
  },

  'what-would-you-do': {
    friend: [
      G('Your close friend starts dating your ex and tells you only after things become serious. What do you do?', { intensity: 'Deep' }),
      G('A friend owes you money, keeps posting outings online and has stopped mentioning the debt. What do you do?', { intensity: 'No Filter' }),
      G('You hear a close friend’s partner saying something disrespectful about them when your friend is not there. What do you do?', { intensity: 'Interesting' }),
      G('Your friend gets a job opportunity abroad and asks you to keep it from their family until the visa is sorted. What do you do?', { intensity: 'Deep' }),
      G('A friend invites you to a wedding, then sends an aso ebi price far above what you planned to spend. What do you do?', { intensity: 'Chill' }),
      G('Your friend asks to stay with you for two weeks and the two weeks quietly becomes two months. What do you do?', { intensity: 'Interesting' }),
    ],
    relationship: [
      G('Your partner gets a job abroad and the move would happen in three months. What do you do first?', { intensity: 'Deep', stages: ['Been Together a While', 'Long-Term Relationship', 'Married'] }),
      G('Your partner’s family keeps making comments about when you should get married. What do you do?', { intensity: 'Interesting' }),
      G('You find out your partner regularly sends money to family and has hidden how much because they expected an argument. What do you do?', { intensity: 'Deep', stages: ['Been Together a While', 'Long-Term Relationship', 'Married'] }),
      G('An ex sends your partner a late-night message saying they need someone to talk to. What do you do?', { intensity: 'No Filter' }),
      G('You and your partner want to marry, but you strongly disagree about where to live afterwards. What do you do?', { intensity: 'Deep', stages: ['Long-Term Relationship', 'Married'] }),
      G('Your partner wants a private wedding while both families expect a large celebration. What do you do?', { intensity: 'Interesting', stages: ['Long-Term Relationship', 'Married'] }),
    ],
  },

  'if-you-had-to-choose': {
    friend: [
      G('If you had to choose one, which would you take?', { intensity: 'Interesting', options: ['A job you love that pays modestly', 'A job you dislike that pays three times more'] }),
      G('If you had to choose one for the next five years, which would you take?', { intensity: 'Deep', options: ['Live close to your family with fewer opportunities', 'Move far away for the career you want'] }),
      G('If you had to choose one, which would you rather know?', { intensity: 'Deep', options: ['What people say about you when you leave', 'What your life looks like ten years from now'] }),
      G('If you had to choose one, which would you protect?', { intensity: 'No Filter', options: ['A long friendship that has become draining', 'Your peace even if the friendship ends'] }),
      G('If you had to choose one for a year, which would you take?', { intensity: 'Chill', options: ['Free food everywhere', 'Free transport everywhere'] }),
    ],
    relationship: [
      G('If you had to choose one for a serious relationship, which matters more?', { intensity: 'Deep', options: ['Strong chemistry with different long-term plans', 'Matching long-term plans with slower chemistry'] }),
      G('If you had to choose one, which would you rather deal with together?', { intensity: 'Deep', options: ['Two years of long distance', 'Two years of serious money pressure'] }),
      G('If you had to choose one, which would you protect first?', { intensity: 'No Filter', options: ['Keeping family happy', 'A boundary you both agreed on'] }),
      G('If you had to choose one before marriage, which conversation matters first?', { intensity: 'Deep', options: ['How you will handle money', 'How involved your families will be'] }),
      G('If you had to choose one date every month, which would you keep?', { intensity: 'Flirty', options: ['A proper night out', 'A quiet stay-in night with phones away'] }),
    ],
  },

  'who-is-more-likely': {
    friend: [
      G('Who is more likely to say “I am on my way” before leaving the house?', { intensity: 'Chill' }),
      G('Who is more likely to spend too much money on food in one weekend?', { intensity: 'Chill' }),
      G('Who is more likely to move abroad with only two weeks’ notice?', { intensity: 'Interesting' }),
      G('Who is more likely to forgive an old friend and act as if nothing happened?', { intensity: 'Deep' }),
      G('Who is more likely to argue with a customer service agent until the issue is fixed?', { intensity: 'Interesting' }),
      G('Who is more likely to disappear from social media for a month without explaining?', { intensity: 'Interesting' }),
    ],
    relationship: [
      G('Who is more likely to plan a surprise date properly and keep it secret?', { intensity: 'Flirty' }),
      G('Who is more likely to apologise first after a small argument?', { intensity: 'Interesting' }),
      G('Who is more likely to suggest relocating for a better opportunity?', { intensity: 'Deep' }),
      G('Who is more likely to overspend on a wedding if nobody stopped them?', { intensity: 'Interesting', stages: ['Long-Term Relationship', 'Married'] }),
      G('Who is more likely to remember a tiny detail from a conversation months later?', { intensity: 'Flirty' }),
      G('Who is more likely to need space before talking after an argument?', { intensity: 'Deep' }),
    ],
  },

  'how-well-do-you-know-me': {
    friend: [
      G('What do you think I would spend ₦100,000 on first if I had to use it on myself today?', { intensity: 'Chill' }),
      G('Which secondary school memory do you think I still talk about the most?', { intensity: 'Interesting' }),
      G('What kind of situation do you think stresses me faster than I admit?', { intensity: 'Deep' }),
      G('Which person do you think I call first when I have major news?', { intensity: 'Interesting' }),
      G('What do you think I value more in a friendship: honesty, availability or loyalty?', { intensity: 'Deep' }),
    ],
    relationship: [
      G('What do you think I need most from you when I have had a bad day?', { intensity: 'Deep' }),
      G('Which date we have had do you think I would choose to repeat?', { intensity: 'Flirty' }),
      G('What do you think worries me most when I think about long-term relationships?', { intensity: 'Deep' }),
      G('What do you think I would want us to spend more money on and less money on?', { intensity: 'Interesting' }),
      G('What do you think makes me feel closest to you during an ordinary week?', { intensity: 'Deep' }),
    ],
  },

  'finish-the-sentence': {
    friend: [
      G('A friendship starts feeling serious to me when…', { intensity: 'Interesting' }),
      G('The quickest way to annoy me on a group trip is…', { intensity: 'Chill' }),
      G('One thing adulthood did not prepare me for is…', { intensity: 'Deep' }),
      G('If I could relive one school holiday, I would choose…', { intensity: 'Interesting' }),
      G('The Nigerian food argument I will never stop having is…', { intensity: 'Chill' }),
      G('One thing I wish my younger self understood earlier is…', { intensity: 'Deep' }),
    ],
    relationship: [
      G('I know I feel safe with someone when…', { intensity: 'Deep' }),
      G('A date becomes memorable to me when…', { intensity: 'Flirty' }),
      G('One thing I never want money to become between us is…', { intensity: 'Deep' }),
      G('I feel most appreciated in a relationship when…', { intensity: 'Interesting' }),
      G('The kind of home life I would enjoy building looks like…', { intensity: 'Deep', stages: ['Long-Term Relationship', 'Married'] }),
      G('One thing I hope never becomes routine between us is…', { intensity: 'Flirty' }),
    ],
  },

  'tell-the-story': {
    friend: [
      G('Tell me about the worst trouble you got into in secondary school.', { intensity: 'Interesting' }),
      G('Tell me about a time you completely misread a situation.', { intensity: 'Interesting' }),
      G('Tell me about the funniest lie you told as a child.', { intensity: 'Chill' }),
      G('Tell me about a journey in Nigeria that went wrong from start to finish.', { intensity: 'Chill' }),
      G('Tell me about the first time you made money and felt proud of yourself.', { intensity: 'Deep' }),
      G('Tell me about a friendship that started in an unexpected way.', { intensity: 'Deep' }),
    ],
    relationship: [
      G('Tell me about the worst date you have ever been on.', { intensity: 'Interesting' }),
      G('Tell me about the moment you realised you were starting to like someone more than you planned.', { intensity: 'Flirty' }),
      G('Tell me about a relationship lesson you learnt from watching another couple.', { intensity: 'Deep' }),
      G('Tell me about a time family expectations affected someone you were dating.', { intensity: 'Deep' }),
      G('Tell me about a romantic gesture you still remember, even if the relationship did not last.', { intensity: 'Interesting' }),
      G('Tell me about the first time you pictured a serious future with someone.', { intensity: 'Deep' }),
    ],
  },
}
