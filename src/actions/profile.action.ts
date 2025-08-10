"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function getProfileByUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        location: true,
        website: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            comments: true,
            notifications: true
          }
        }
      }
    })

    return user
  }
  catch (err) {
    console.log('Failed to fetch profile by username')
    throw new Error('Failed to fetch profile')
  }
}

export async function getUserPosts(userId: string)
{
  try {
    const posts = prisma.post.findMany({
      where: { authorId: userId},
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true
              }
            }
          },
          // sap xep cac comment
          orderBy: {
            createdAt: 'asc'
          }
        },
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return posts
  } catch (error) {
    console.log("Error fetching user posts. ", error)
    throw new Error(error)
  }
}

export async function getUserLikePosts(userId: string) {
  try {
    const result = await prisma.post.findMany
    ({
      where: {
        likes: {
          some: {
            userId,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })  

    return result
  } catch (error) {
    console.log("Fail to fetch user like post")
    throw new Error(error)
  }
}

export async function updateProfiles(formData: FormData) {
  try {
    const { userId: clerkId } = await auth()
    //destructure de lay userId va doi ten thanh clerkId
    if (!clerkId) throw new Error("Unthorized")

    const name = formData.get("name") as string
    const bio = formData.get("bio") as string
    const location = formData.get("location") as string
    const website = formData.get("website") as string

    const newUser = await prisma.user.update({
      where: { clerkId },
      data: {
        name, 
        bio, 
        location,
        website
      }
    })

    revalidatePath("/profile")
    return { success: true, newUser }
  } catch (error) {
    console.log('Failed to update user profile')
    throw new Error(error)
  }
}