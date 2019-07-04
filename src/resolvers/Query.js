function test() {
  return `This is the API of a hackernews CLone`
}

function feed(parent, args, context, info) {
  return context.prisma.links()
}
 
function link(parent, args, context, info) {
  const foundLink = context.prisma.links({ where: { id: args.id } })
  return foundLink.length !== 0 ? foundLink[0] : null
}

module.exports = {
  test,
  feed,
  link
}
