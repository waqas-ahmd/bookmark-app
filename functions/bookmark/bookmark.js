const { ApolloServer, gql } = require("apollo-server-lambda")
const faunadb = require("faunadb")
const q = faunadb.query

const typeDefs = gql`
  type Query {
    bookmark: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    title: String!
    url: String!
    description: String
  }
  type Mutation {
    addBookMark(title: String!, url: String!, description: String!): Bookmark
  }
`

const resolvers = {
  Query: {
    bookmark: async (root, args, context) => {
      try {
        var client = new faunadb.Client({
          secret: "fnAD7fPVNqACA2yQI9cMFt0RsIqMi1jvO0jwl9wF",
        })
        let result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("url"))),
            q.Lambda(x => q.Get(x))
          )
        )
        console.log("Bookmarks Retrieved", result)
        return result.data.map(d => {
          return {
            id: d.ts,
            url: d.data.url,
            title: d.data.title,
            description: d.data.description,
          }
        })
      } catch (error) {
        return error.toString()
      }
    },
  },
  Mutation: {
    addBookMark: async (_, { title, url, description }) => {
      try {
        var client = new faunadb.Client({
          secret: "fnAD7fPVNqACA2yQI9cMFt0RsIqMi1jvO0jwl9wF",
        })
        let result = await client.query(
          q.Create(q.Collection("bookmark"), {
            data: { title, url, description },
          })
        )
        console.log("Bookmark Added")
        return result.ref.data
      } catch (error) {
        return error.toString()
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
