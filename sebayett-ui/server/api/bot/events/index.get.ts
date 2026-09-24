// Accepted events for a user. Port of Django `api/events/` (api.views.events_for_user).
export default defineEventHandler(async (event) => {
  requireBotKey(event)

  const username = await getBotParam(event, 'username')
  if (!username) {
    setResponseStatus(event, 204)
    return null
  }

  const events = await prisma.events_events.findMany({
    where: { event_status: 'ACCEPTED', auth_user: { username: String(username) } },
    select: { event_id: true, event_title: true, event_date: true, event_time: true },
  })

  return sendBotJson(event, events.map((e) => ({
    event_id: e.event_id,
    event_title: e.event_title,
    event_date: formatDate(e.event_date),
    event_time: formatTime(e.event_time),
  })))
})
