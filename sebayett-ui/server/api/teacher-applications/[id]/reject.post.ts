export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const applicationId = getUuidParam(event)

  await prisma.$transaction(async (tx) => {
    if (!(await tx.teachers_teacher_applications.findFirst({ where: { application_id: applicationId }, select: { teacher_id: true } }))) {
      throw createError({ statusCode: 404, statusMessage: 'Application not found' })
    }
    await archiveTeacherApplication(tx, applicationId, 'rejected')
  })

  return { status: 'success', message: 'Teacher rejected' }
})
