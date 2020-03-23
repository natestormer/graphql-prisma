import "core-js"
import "regenerator-runtime/runtime"
import "cross-fetch/polyfill"
import { gql } from "apollo-boost"
import prisma from "../src/prisma"

import seedDatabase, {
  userOne,
  commentOne,
  commentTwo,
} from "./utils/seedDatabase"
import getClient from "./utils/getClient"
import { deleteComment } from "./utils/operations"

const client = getClient()

beforeAll(() => {
  jest.setTimeout(10000)
})
beforeEach(seedDatabase)

test("Should delete own comment", async () => {
  const variables = { id: commentTwo.comment.id }
  const client = getClient(userOne.jwt)

  await client.mutate({ mutation: deleteComment, variables })
  const exists = await prisma.exists.Comment({
    id: commentTwo.comment.id,
  })

  expect(exists).toBe(false)
})

test("Should not delete other user's comment", async () => {
  const variables = { id: commentOne.comment.id }
  const client = getClient(userOne.jwt)

  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow()
})
