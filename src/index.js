const fetch = require("node-fetch");
const { ApolloServer, gql } = require("apollo-server");
const { GraphQLDateTime } = require("graphql-iso-date");

const typeDefs = gql`
  type Training {
    id: ID!
    title: String!
    objectives: String!
    curriculum: String!
    overview: String
    discounts: [Discount]
    startDate: DateTime
  }

  type Discount {
    id: ID!
    training: Training
    code: String!
    discountPercentage: Int!
    description: String
  }

  scalar DateTime

  type Query {
    trainings: [Training!]
    training(id: ID!): Training
    discounts: [Discount!]
    discount(id: ID!): Discount
  }
`;

const resolvers = {
  Query: {
    trainings: () => fetchTrainings(),
    discounts: () => fetchDiscounts(),
    training: (_, { id }) => fetchTrainingById(id),
    discount: (_, { id }) => fetchDiscountById(id)
  },
  Discount: {
    training: parent => fetchTrainingByUrl(parent.training)
  },
  Training: {
    discounts: ({ discounts }) => discounts.map(fetchDiscountByUrl)
  },
  DateTime: GraphQLDateTime
};

function fetchTrainings() {
  // More info about the fetch function? https://github.com/bitinn/node-fetch#json
  return fetch("https://restapi.reactgraphql.academy/v1/trainings/")
    .then(res => res.json())
    .catch(error => console.log(error));
}

function fetchTrainingById(id) {
  return fetch(`https://restapi.reactgraphql.academy/v1/trainings/${id}`)
    .then(res => res.json())
    .catch(error => console.log(error));
}

function fetchDiscounts() {
  return fetch("https://restapi.reactgraphql.academy/v1/discounts/")
    .then(res => res.json())
    .catch(error => console.log(error));
}

function fetchTrainingByUrl(url) {
  return fetch(url)
    .then(res => res.json())
    .catch(error => console.log(error));
}

function fetchDiscountById(id) {
  return fetch(`https://restapi.reactgraphql.academy/v1/discounts/${id}`)
    .then(res => res.json())
    .catch(error => console.log(error));
}

function fetchDiscountByUrl(url) {
  return fetch(url).then(res => res.json());
}

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
