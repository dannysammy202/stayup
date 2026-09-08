import { mergeGroups, publishGroups } from '../helpers.js'
import friendBase from '../getting-to-know-you.friend.js'
import friendSupplement from '../getting-to-know-you.friend.supplement.js'
import relationshipPart1 from '../getting-to-know-you.relationship.part1.js'
import relationshipPart2 from '../getting-to-know-you.relationship.part2.js'

export default {
  friend: mergeGroups(friendBase, friendSupplement),
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
