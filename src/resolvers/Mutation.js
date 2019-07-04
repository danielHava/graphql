const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { APP_SECRET, getUserId } = require('../utils')

function createLink (parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.createLink({ 
    ...args,
    postedBy: { connect : { id: userId } }
  })
}

function updateLink (parent, args, context, info) {
  if (!args.id) {
    return null
  } else {
    const updatedLink = links.find(link => link.id === `link-${args.id}`)
    if (args.description) {
    updatedLink.description = args.description
    }
    if (args.url) {
    updatedLink.url = args.url
    }
    links[args.id] = updatedLink
    return updatedLink
  }
}

function deleteLink (parent, args, context, info) {
  if (!args.id) {
    return null
  } else {
    const deletedLink = links.find(link => link.id === `link-${args.id}`)
    links = links.filter(link => link.id !== args.id)
    return deletedLink
  }
}

async function signup (parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({...args, password})
  const token = jwt.sign({}, APP_SECRET)
  return {
    token,
    user
  }
}

async function login (parent, args, context, info) {
  const user = await context.prisma.user({email: args.email})
  if (!user) {
    throw new Error('No such user found!')
  }
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }
  const token = jwt.sign({userID: user.id}, APP_SECRET)
  return {
    token,
    user
  }
}

module.exports = {
  createLink,
  updateLink,
  deleteLink,
  signup,
  login
}
