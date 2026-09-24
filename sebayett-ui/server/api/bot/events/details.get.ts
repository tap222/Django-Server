// Details of one event, incl. the server's self token. Port of Django `api/events/details/`.
export default defineEventHandler(async (event) => {
  requireBotKey(event)

  const eventId = await getBotParam(event, 'event_id')
  if (!eventId) {
    setResponseStatus(event, 204)
    return null
  }

  const found = await prisma.events_events.findUnique({
    where: { event_id: parseUuid(eventId) },
    select: {
      server_id: true,
      event_title: true,
      event_description: true,
      lessons_lessons: { select: { teachers_teachers: { select: { auth_user: { select: { username: true } } } } } },
    },
  })
  // Django crashed with a 500 here; a missing event is a 404
  if (!found) {
    throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  }

  const bot = await prisma.bots_bots.findFirst({
    where: { server_id: found.server_id },
    select: { bot_self_token: true },
  })

  return sendBotJson(event, {
    server_id: found.server_id,
    username: found.lessons_lessons.teachers_teachers.auth_user.username,
    event_title: found.event_title,
    event_description: found.event_description,
    self_token: bot?.bot_self_token ?? null,
  })
})
