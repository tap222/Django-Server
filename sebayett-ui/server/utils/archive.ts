import { randomUUID } from 'node:crypto'
import type { Prisma } from '../generated/prisma/client'

/*
 * Django did two things implicitly on delete that Prisma won't:
 *  - pre_delete signals copied rows into the Archived_* tables (servers/, teachers/, lessons/signals.py)
 *  - ORM cascades (on_delete=CASCADE / SET_NULL) — the DB constraints themselves are NO ACTION
 * These helpers do both explicitly. Call them inside prisma.$transaction.
 */

type Tx = Prisma.TransactionClient

export const newUuid = () => randomUUID()

export async function addUserToGroup(tx: Tx, userId: number, groupName: string) {
  const group = await tx.auth_group.upsert({ where: { name: groupName }, update: {}, create: { name: groupName } })
  await tx.auth_user_groups.upsert({
    where: { user_id_group_id: { user_id: userId, group_id: group.id } },
    update: {},
    create: { user_id: userId, group_id: group.id },
  })
}

export async function removeUserFromGroup(tx: Tx, userId: number, groupName: string) {
  await tx.auth_user_groups.deleteMany({ where: { user_id: userId, auth_group: { name: groupName } } })
}

/** Events cascade to tickets (and archived tickets); archived events just lose the link. */
async function deleteEvents(tx: Tx, where: Prisma.events_eventsWhereInput) {
  const ids = (await tx.events_events.findMany({ where, select: { event_id: true } })).map((e) => e.event_id)
  if (!ids.length) return
  await tx.tickets_tickets.deleteMany({ where: { event_id: { in: ids } } })
  await tx.tickets_archived_tickets.deleteMany({ where: { event_id: { in: ids } } })
  await tx.events_events.deleteMany({ where: { event_id: { in: ids } } })
}

export async function archiveServerApplication(tx: Tx, serverId: bigint, status: string) {
  const app = await tx.servers_server_applications.findUniqueOrThrow({ where: { server_id: serverId } })
  const archived = { ...app, status, delete_at: new Date() }
  // upsert: a server can apply (and be archived) more than once
  await tx.servers_archived_server_applications.upsert({ where: { server_id: serverId }, update: archived, create: archived })
  await tx.servers_server_applications.delete({ where: { server_id: serverId } })
}

export async function archiveTeacherApplication(tx: Tx, applicationId: string, status: string) {
  const app = await tx.teachers_teacher_applications.findFirstOrThrow({ where: { application_id: applicationId } })
  const archived = { ...app, status, deleted_at: new Date() }
  await tx.teachers_archived_teacher_applications.upsert({ where: { teacher_id: app.teacher_id }, update: archived, create: archived })
  await tx.teachers_teacher_applications.delete({ where: { teacher_id: app.teacher_id } })
}

/** Delete a server the way Django did: archive it, drop its bots and events, remove the Server role. */
export async function deleteServer(tx: Tx, serverId: bigint) {
  const server = await tx.servers_servers.findUniqueOrThrow({ where: { server_id: serverId } })

  await tx.bots_bots.deleteMany({ where: { server_id: serverId } })
  await deleteEvents(tx, { server_id: serverId })
  await tx.events_archived_events.updateMany({ where: { server_id: serverId }, data: { server_id: null } })

  const archived = { ...server, deleted_at: new Date() }
  await tx.servers_archived_servers.upsert({ where: { server_id: serverId }, update: archived, create: archived })
  await tx.servers_servers.delete({ where: { server_id: serverId } })

  await removeUserFromGroup(tx, server.user_id, 'Server')
}

/** Delete a teacher: archive their lessons and profile, cascade to events/availability, remove the Teacher role. */
export async function deleteTeacher(tx: Tx, teacherId: string) {
  const teacher = await tx.teachers_teachers.findUniqueOrThrow({ where: { teacher_id: teacherId } })
  const lessons = await tx.lessons_lessons.findMany({ where: { teacher_id: teacherId } })
  const lessonIds = lessons.map((l) => l.lesson_id)

  if (lessonIds.length) {
    await deleteEvents(tx, { lesson_id: { in: lessonIds } })
    await tx.events_archived_events.updateMany({ where: { lesson_id: { in: lessonIds } }, data: { lesson_id: null } })
    await tx.lessons_archived_teacher_availability.updateMany({ where: { lesson_id: { in: lessonIds } }, data: { lesson_id: null } })
    for (const { teacher_id: _teacher, ...lesson } of lessons) {
      // teacher_id is left empty: the teacher row is deleted below (Django's SET_NULL)
      const archived = { ...lesson, teacher_id: null, delete_at: new Date() }
      await tx.lessons_archived_lessons.upsert({ where: { lesson_id: lesson.lesson_id }, update: archived, create: archived })
    }
  }

  await tx.lessons_teacher_availability.deleteMany({
    where: { OR: [{ teacher_id: teacherId }, { lesson_id: { in: lessonIds } }] },
  })
  await tx.lessons_archived_teacher_availability.updateMany({ where: { teacher_id: teacherId }, data: { teacher_id: null } })
  await tx.lessons_archived_lessons.updateMany({ where: { teacher_id: teacherId }, data: { teacher_id: null } })
  await tx.lessons_lessons.deleteMany({ where: { teacher_id: teacherId } })

  const archived = { ...teacher, deleted_at: new Date() }
  await tx.teachers_archived_teachers.upsert({ where: { teacher_id: teacherId }, update: archived, create: archived })
  await tx.teachers_teachers.delete({ where: { teacher_id: teacherId } })

  await removeUserFromGroup(tx, teacher.user_id, 'Teacher')
}
