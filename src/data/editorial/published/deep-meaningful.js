import { mergeGroups, publishBalanced, replacePrompts } from '../helpers.js'
import friend from '../deep-meaningful.friend.js'
import friendSupplement from '../deep-meaningful.friend.supplement.js'
import relationshipPart1 from '../deep-meaningful.relationship.part1.js'
import relationshipPart2 from '../deep-meaningful.relationship.part2.js'

const friendPublished = replacePrompts(
  publishBalanced(mergeGroups(friend, friendSupplement)),
  {
    'What is something freedom gives people that duty alone cannot?': 'What is one responsibility you think becomes easier once you choose it for yourself?',
    'What is one thing you hope you never have to beg someone close to you for?': 'What kind of support did you only realise you needed after someone offered it without being asked?',
  },
)

const relationshipPublished = replacePrompts(
  publishBalanced(mergeGroups(relationshipPart1, relationshipPart2)),
  {
    'What is one thing you would never tolerate a partner doing to your family?': 'What is one family tradition you would want a serious partner to understand before joining in?',
  },
)

export default {
  friend: friendPublished,
  relationship: relationshipPublished,
}
