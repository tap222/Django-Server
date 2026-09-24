export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const teachers = await prisma.teachers_teachers.findMany({ orderBy: { created_at: 'desc' } })
  return teachers.map((t) => ({
    id: t.teacher_id,
    firstName: t.first_name,
    lastName: t.last_name,
    expertise: t.expertise,
    gender: t.gender,
    dob: formatDate(t.date_of_birth),
  }))
})
