import "core-js"
import "regenerator-runtime/runtime"
import "cross-fetch/polyfill"
import { gql } from "apollo-boost"
import prisma from "../src/prisma"

import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase"
import getClient from "./utils/getClient"
import {
  getPosts,
  getMyPosts,
  updatePost,
  createPost,
  deletePost,
} from "./utils/operations"

const client = getClient()

beforeAll(() => {
  jest.setTimeout(10000)
})
beforeEach(seedDatabase)

test("Should expose published posts", async () => {
  const response = await client.query({ query: getPosts })

  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

test("Should fetch user's posts", async () => {
  const client = getClient(userOne.jwt)

  const { data } = await client.query({ query: getMyPosts })
  expect(data.myPosts.length).toBe(2)
})

test("Should be able to update own post", async () => {
  const variables = {
    id: postOne.post.id,
    data: {
      published: false,
    },
  }
  const client = getClient(userOne.jwt)

  const { data } = await client.mutate({ mutation: updatePost, variables })
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false,
  })

  expect(data.updatePost.published).toBe(false)
  expect(exists).toBe(true)
})

test("Should be able to create a post", async () => {
  const variables = {
    post: {
      title: "Create Post Test",
      body: "Should be able to create a post...",
      published: true,
    },
  }
  const client = getClient(userOne.jwt)

  const { data } = await client.mutate({ mutation: createPost, variables })
  const exists = await prisma.exists.Post({ id: data.createPost.id })

  expect(data.createPost.title).toBe("Create Post Test")
  expect(data.createPost.body).toBe("Should be able to create a post...")
  expect(data.createPost.published).toBe(true)
  expect(exists).toBe(true)
})

test("Should be able to delete my post", async () => {
  const variables = { id: postTwo.post.id }
  const client = getClient(userOne.jwt)

  await client.mutate({ mutation: deletePost, variables })
  const exists = await prisma.exists.Post({ id: postTwo.post.id })

  expect(exists).toBe(false)
})
