import { mergeGroups, publishGroups, replacePrompts } from '../helpers.js'
import friendBase from '../getting-to-know-you.friend.js'
import friendSupplement from '../getting-to-know-you.friend.supplement.js'
import relationshipPart1 from '../getting-to-know-you.relationship.part1.js'
import relationshipPart2 from '../getting-to-know-you.relationship.part2.js'

const friendPublished = replacePrompts(
  mergeGroups(friendBase, friendSupplement),
  {
    'What is something you would rather improvise than plan?': 'Which part of making plans matters most to you: the people, the place or the timing?',
    'What is something you enjoy more at night than in the morning?': 'What is one small ritual that helps you switch off after a long day?',
    'What is one thing you enjoy doing alone but not with friends?': 'What kind of activity makes you forget to check your phone?',
    'What is something you prefer doing online instead of in person?': 'What is one thing you still prefer doing with pen and paper?',
    'What is something you would rather learn by reading than watching?': 'What is something you mostly learnt by making mistakes yourself?',
    'What is something you would rather be liked for than respected for?': 'What is one quality you like people to notice without you pointing it out?',
    'What is something you forgive yourself for more easily than other people?': 'What is one part of your personality you are harder on than your friends are?',
  },
)

export default {
  friend: friendPublished,
  relationship: publishGroups(
    mergeGroups(relationshipPart1, relationshipPart2),
    {
      Chill: 170,
      Interesting: 170,
      Deep: 180,
      Flirty: 150,
      Spicy: 130,
      'No Filter': 200,
    },
  ),
}
