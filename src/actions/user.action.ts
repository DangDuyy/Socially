"use server"

import prisma from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function syncUser() {
  try {
    const {userId} =  await auth()
    const user = await currentUser()

    if (!user || !userId) return 

    //check if user exist
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId
      }
    })

    if (existingUser) 
      return existingUser
    
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl
      }
    })

    return dbUser
  }
  catch (err) {
    console.log("error in sync user ", err)
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true
        }
      }
    }
  })
}

export async function getDbUserId() {
  const {userId:clerkId} = await auth()
  if (!clerkId) throw new Error('user not found!!!')

  const user = await getUserByClerkId(clerkId)

  if (!user) throw new Error("User not found!!!")

  return user.id
}

export async function getRandowUsers() {
  try {
    const userId = await getDbUserId()

    //get 3 random user exclude ourselve & users that we already follow
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          {NOT: {id: userId}},
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId
                }
              }
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true
          }
        }
      },
      take : 3
    })

    return randomUsers
  }
  catch (err) {
    console.log("Error to fetching random users ", err)
    return []
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId()

    if (userId === targetUserId) throw new Error("You can't follow yourself")

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId : {
          followerId: userId,
          followingId: targetUserId
        }
      }
    })

    if (existingFollow) {
      //unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: existingFollow.followerId,
            followingId: existingFollow.followingId
          }
        }
      })
    } else {
      //follow
      //dung $transaction neu muon cung 1 luc cho 2 bang
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId
          }
        }),

        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId,
            creatorId: userId
          }
        })
      ])
    }

    return {success:true}
  }
  catch (err) {
    console.log("Fail to follow this user", err)
    return {success:false, err: "Error toggling follow"}
  }
}
