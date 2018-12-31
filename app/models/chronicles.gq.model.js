var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var app = require('./../../app'); // funcție care generează obiecte schema graphql


var schema = buildSchema(`
    type Chronicle {
        _id: ID!
        name: String!
        city: String!
        country: String!
    }
    input ChronicleInput {
        name: String!
        city: String!
        country: String!
    }
    type Query {
        chronicles:[Chronicle!]!
    }
    type Mutations {
        createChronicle(cInput: ChronicleInput): Chronicle
    }
    schema {
        query: Query
        mutation: Mutations
    }
`);
// construirea rezolvatoarelor
var root = {
    chronicles: () => {
        return ['Ceva', 'Altceva'];
    },
    createChronicle: (args) => {
        var chronicleName = args.name;
        return chronicleName;
    }
};
// graphql endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

module.exports = app;