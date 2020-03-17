import { Prisma } from "prisma-binding"
import { fragmentReplacements } from "./resolvers/index"

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements,
})

export { prisma as default }

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({
//     id: authorId,
//   })

//   if (!userExists) {
//     throw new Error("User not found!")
//   }

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId,
//           },
//         },
//       },
//     },
//     `{ author { id name email posts { id title published } } }`
//   )

//   return post
// }

// createPostForUser("ck7pgjjfy00dg0820g4d6nr6e", {
//   title: "Great Games to Play",
//   body: "BioShock",
//   published: true,
// })
//   .then(user => console.log(JSON.stringify(user, null, 2)))
//   .catch(error => console.log(error.message))

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({
//     id: postId,
//   })

//   if (!postExists) {
//     throw new Error("Post not found!")
//   }

//   const updatedPost = await prisma.mutation.updatePost(
//     {
//       where: {
//         id: postId,
//       },
//       data,
//     },
//     `{ author { id name email posts { id title published } } }`
//   )

//   return updatedPost.author
// }

// updatePostForUser("ck7qi2fg102ni0820haop5znf", {
//   title: "Great Books to Read while Quarantined",
//   body: "The War of Art",
//   published: true,
// })
//   .then(data => console.log(JSON.stringify(data, null, 2)))
//   .catch(error => console.log(error.message))

// prisma.mutation
//   .updatePost(
//     {
//       where: {
//         id: "ck7qgsjji020n0820xnw9xs46",
//       },
//       data: {
//         body: "This post is done and ready for publishing",
//         published: true,
//       },
//     },
//     `{ id title body published }`
//   )
//   .then(data => {
//     console.log("Returned from mutation: ", JSON.stringify(data, null, 2))
//     return prisma.query.posts(
//       null,
//       `{
//     id
//     title
//     body
//     published
//   }`
//     )
//   })
//   .then(data => console.log("Query all posts: ", JSON.stringify(data, null, 2)))
