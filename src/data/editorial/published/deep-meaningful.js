import { mergeGroups, publishBalanced } from '../helpers.js'
import friend from '../deep-meaningful.friend.js'
import friendSupplement from '../deep-meaningful.friend.supplement.js'
import relationshipPart1 from '../deep-meaningful.relationship.part1.js'
import relationshipPart2 from '../deep-meaningful.relationship.part2.js'

export default {
  friend: publishBalanced(mergeGroups(friend, friendSupplement)),
  relationship: publishBalanced(mergeGroups(relationshipPart1, relationshipPart2)),
}
