import bcrypt from "bcryptjs"

import getUserId from "../utils/getUserId"
import generateToken from "../utils/generateToken"
import hashPassword from "../utils/hashPassword"

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password)

    const user = prisma.mutation.createUser({
      data: {
        ...args.data,
        password: password,
      },
    })

    return {
      user,
      token: generateToken(user.id),
    }
  },
  async login(parent, { data }, { prisma }, info) {
    const { email, password } = data
    const user = await prisma.query.user({
      where: {
        email: email,
      },
    })

    if (!user) {
      throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new Error("Unable to login")
    }

    return {
      user,
      token: generateToken(user.id),
    }
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info
    )
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password)
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: args.data,
      },
      info
    )
  },
  createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    if (!userId) {
      throw new Error("User not found")
    }

    return prisma.mutation.createPost(
      {
        data: {
          title: args.post.title,
          body: args.post.body,
          published: args.post.published,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info
    )
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    })

    if (!postExists) {
      throw new Error("Unable to delete post")
    }

    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id,
        },
      },
      info
    )
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    })

    const postIsPublished = await prisma.exists.Post({
      id: args.id,
      published: true,
    })

    // published and about to be unpublished
    if (postIsPublished && !args.data.published) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id,
          },
        },
      })
    }

    if (!postExists) {
      throw new Error("Post doesn't exist")
    }

    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    )
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postId = args.comment.post

    const postIsPublished = await prisma.exists.Post({
      id: postId,
      published: true,
    })

    if (!postIsPublished) {
      throw new Error("Post not found")
    }

    return prisma.mutation.createComment(
      {
        data: {
          text: args.comment.text,
          author: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: postId,
            },
          },
        },
      },
      info
    )
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    })

    if (!commentExists) {
      throw new Error("Comment doesn't exist")
    }

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id,
        },
      },
      info
    )
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const commentExists = await prisma.exists.comment({
      id: args.id,
      author: {
        id: userId,
      },
    })

    if (!commentExists) {
      throw new Error("Unable to update comment")
    }

    return prisma.mutation.updateComment(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    )
  },
}

export { Mutation as default }
