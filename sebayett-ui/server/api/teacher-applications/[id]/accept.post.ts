// Port of Django admin_dashboard_teacher_application_accept
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const applicationId = getUuidParam(event)

  await prisma.$transaction(async (tx) => {
    const app = await tx.teachers_teacher_applications.findFirst({ where: { application_id: applicationId } })
    if (!app) throw createError({ statusCode: 404, statusMessage: 'Application not found' })
    if (!app.user_id) throw createError({ statusCode: 409, statusMessage: 'Application has no user' })

    const now = new Date()
    await tx.teachers_teachers.create({
      data: {
        teacher_id: app.teacher_id,
        user_id: app.user_id,
        first_name: app.first_name,
        last_name: app.last_name,
        date_of_birth: app.date_of_birth,
        gender: app.gender,
        expertise: app.expertise,
        created_at: now,
        updated_at: now,
      },
    })
    await addUserToGroup(tx, app.user_id, 'Teacher')
    await archiveTeacherApplication(tx, applicationId, 'accepted')
  })

  return { status: 'success', message: 'Teacher accepted' }
})
