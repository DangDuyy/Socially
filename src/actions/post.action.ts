"use server"

import { revalidatePath } from "next/cache"
import { getDbUserId } from "./user.action"
import prisma from "@/lib/prisma"

export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId()

    if (!userId) return []
    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId
      }
    })

    revalidatePath("/")
    return {success: true, post }
  }
  catch (err ) {
    console.log("Fail to create post!", err)
    return { success: false, err: "Fail to create post"} 
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true
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
      }
    })

    return posts
  } 
  catch (err) {
    console.log("Can't fetch any post", err)
    throw new Error("Failed to fetch posts")
  }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId()

    if (!userId) return

    //check if like exist
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    })

    //tim post dua tren postId
    const post = await prisma.post.findUnique({
      where : { id :  postId},
      select: { authorId: true}
    })

    if (!post) throw new Error('Post not found')

    if (existingLike) {
      //unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      })
    } else {
      //like and create notification (only if liking someone else's post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId
          }
        }),
        ...(post.authorId !== userId
          ? [
            prisma.notification.create({
              data: {
                type: 'LIKE', 
                userId: post.authorId,  //recipient (post author)
                creatorId: userId,    //person who like
                postId
              }
            })
          ]
          : [] ) 
      ])
    }

    revalidatePath("/")
    return {success: true}

  } catch (error) {
    console.log("Failed to toggle like: ", error)
    return { success: false, error: "Failed to toogle like"}
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const userId = await getDbUserId()

    if (!userId) return
    
    if (!content) throw new Error("Content is required")

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      select: {
        authorId: true
      }
    })

    if (!post) throw new Error ("Post not found !!!")

    //create a comment and notification in a transaction
    const [comment] = await prisma.$transaction(async (tx) => {
      //create a comment first
      const newComment = await tx.comment.create({
        data: {
          content,
          authorId: userId, 
          postId
        }
      })

      //create notification if commenting on someone else's post
      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: 'COMMENT',
            userId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id
          }
        })
      }
      return [ newComment ]
    })

    revalidatePath("/")
    return { success: true, comment}

  } catch (error) {
    console.log("Failed to comment", error)
    return { success: false, error: "Failed to comment"}
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId()

    const post = await prisma.post.findUnique({
      where: {id: postId},
      select: {authorId: true}
    })

    if (!post) throw new Error("Post not found")
    if (userId !== post.authorId) throw new Error("Unauthorize - no delete permission")

    await prisma.post.delete({
      where: {id: postId}
    })

    revalidatePath("/") //purge the catche
    return {success: true}
  } catch (error) {
    console.log("Failed to delete this post", error)
    return { success: false, error: "Failed to delete this post"}
  }
}