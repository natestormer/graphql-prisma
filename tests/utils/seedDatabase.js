import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../../src/prisma"

const userOne = {
  input: {
    name: "Jen",
    email: "jen@example.com",
    password: bcrypt.hashSync("Red098!@#$"),
  },
  user: undefined,
  jwt: undefined,
}

const userTwo = {
  input: {
    name: "Jared",
    email: "jared@example.com",
    password: bcrypt.hashSync("Red098!@#$"),
  },
  user: undefined,
  jwt: undefined,
}

const postOne = {
  input: {
    title: "Test Post",
    body: "Test post body content...",
    published: true,
  },
  post: undefined,
}

const postTwo = {
  input: {
    title: "Draft Post",
    body: "Draft post body content...",
    published: false,
  },
  post: undefined,
}

const commentOne = {
  input: {
    text: "Comment 1",
    post: undefined,
  },
  comment: undefined,
}

const commentTwo = {
  input: {
    text: "Comment 2",
    post: undefined,
  },
  comment: undefined,
}

const seedDatabase = async () => {
  // delete test data
  await prisma.mutation.deleteManyComments()
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  // create user 1
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.AUTH_SECRET)

  // create user 2
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input,
  })
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.AUTH_SECRET)

  // create post 1
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
    },
  })

  // create post 2
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
    },
  })

  // create comment 1
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {
        connect: {
          id: userTwo.user.id,
        },
      },
      post: {
        connect: {
          id: postOne.post.id,
        },
      },
    },
  })

  // create comment 2
  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
      post: {
        connect: {
          id: postOne.post.id,
        },
      },
    },
  })
}

export {
  seedDatabase as default,
  userOne,
  userTwo,
  postOne,
  postTwo,
  commentOne,
  commentTwo,
}
