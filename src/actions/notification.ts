"use server"

import prisma from "@/lib/prisma"
import { getDbUserId } from "./user.action"

export async function getNotifications() {
  try {
    const userId = await getDbUserId()
    if (!userId) return []

    const notifications = await prisma.notification.findMany({
      where: {
        userId
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        post: {
          select: {
            id: true,
            content: true,
            image: true
          }
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt:'desc'
      }
    })

    return notifications
  } catch (error) {
    console.log('Error fetching notifications: ', error)
    throw new Error(error)
  }
}


export async function markNotificationsAsRead (notificationIds: string[]) {
  try {
    const userId = await getDbUserId()
    await prisma.notification.updateMany({
      where: {
        id: {
          // kiem tra lay cac notification co id trung voi id duoc truyen tu parameter
          in: notificationIds
        }
      },  // danh dau la da duoc doc roi
      data: {
        read: true
      }
    })

    return { success: true }
  }
  catch (error) {
    console.log('Failed to mark notification ', error)
    return { success: false, error: 'Failed to mark notification '}
  }
}