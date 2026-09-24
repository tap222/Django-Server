export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const teacherId = getUuidParam(event)
  if (!(await prisma.teachers_teachers.findUnique({ where: { teacher_id: teacherId }, select: { teacher_id: true } }))) {
    throw createError({ statusCode: 404, statusMessage: 'Teacher not found' })
  }
  await prisma.$transaction((tx) => deleteTeacher(tx, teacherId))
  setResponseStatus(event, 204)
  return null
})
