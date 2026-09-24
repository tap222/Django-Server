export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const apps = await prisma.teachers_teacher_applications.findMany({ orderBy: { created_at: 'desc' } })
  return apps.map((a) => ({
    id: a.application_id,
    firstName: a.first_name,
    lastName: a.last_name,
    gender: a.gender,
    expertise: a.expertise,
    status: a.status,
  }))
})
