export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const a = await prisma.teachers_teacher_applications.findFirst({ where: { application_id: getUuidParam(event) } })
  if (!a) throw createError({ statusCode: 404, statusMessage: 'Application not found' })
  return {
    applicationId: a.application_id,
    firstName: a.first_name,
    lastName: a.last_name,
    gender: a.gender,
    dob: formatDate(a.date_of_birth),
    expertise: a.expertise,
  }
})
