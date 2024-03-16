
const Reaction = require('./Reaction')
class ReactionParser {
    static parse(reactionSmiles) {
        let reaction = new Reaction(reactionSmiles);
        return reaction;
    }
}
module.exports = ReactionParser;