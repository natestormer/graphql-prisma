const users = [
  {
    id: "1",
    name: "Nate",
    email: "natestormer@gmail.com",
  },
  {
    id: "2",
    name: "Sarah",
    email: "sara@demo.com",
    age: 28,
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@domain.com",
    age: 43,
  },
]

const posts = [
  {
    id: "4",
    title: "Post 1",
    body: "This is an article on Post 1",
    published: true,
    author: "1",
  },
  {
    id: "5",
    title: "Post 2",
    body: "Content...",
    published: true,
    author: "1",
  },
  {
    id: "6",
    title: "Post 3",
    body: "This is an article referencing Post 1",
    published: false,
    author: "2",
  },
]

const comments = [
  {
    id: "7",
    text: "A comment...",
    author: "1",
    post: "6",
  },
  {
    id: "8",
    text: "Another comment...",
    author: "1",
    post: "4",
  },
  {
    id: "9",
    text: "A third comment...",
    author: "2",
    post: "4",
  },
  {
    id: "10",
    text: "A fourth comment...",
    author: "3",
    post: "6",
  },
]

const db = { users, posts, comments }

export default db
