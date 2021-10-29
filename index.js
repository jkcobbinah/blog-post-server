const { ApolloServer, gql } = require("apollo-server");



const schemas = gql`
    type Blog {
        blogTitle: String!
        author: String!
        likes: [Likes]
        comment: [Comment]
    }
    type Comment{
        id: String
        content: String
    }
    type Likes{
        id: String
        like: int!
    }
    type Query {
        blogs: [Blog]
        blog(blogTitle: String!): Blog
    }
    type Mutation {
        createBlog(blogTitle: String!, author: String!): Blog
    }
    type Subscription {
        blogCreated: Blog
        commentAdded(blogTitle: String!): Comment
    }
`;
const blogs = [
    {
        blogTitle: 'Robot Motion Planning and Control',
        author: 'Melissa Nketiah'
    }
];
const blogsResolvers = {
    Query: {
        blogs: () => blogs,
        blog: (parent, args) => blogs.find(blog => blog.blogTitle === args.blogTitle)
    },
    Mutation: {
        createBlog: (parent, args) => {
            const { title, author, ISBN } = args;
            const blog = { title, author };
            blogs.push(blog);
            return blog;
        }
    },
    Subscription: {
        commentAdded: {
            subscribe: () => punsub.asyncIterator('commentAdded')
        }
    }
}


const server = new ApolloServer({
    typeDefs: schemas,
    resolvers: blogsResolvers,
    playground: true,
});

server.listen().then(({ url }) => {
    console.log(`🚀🚀Server ready to be used at ${url}`);
}).catch(err => console.log(err.message));