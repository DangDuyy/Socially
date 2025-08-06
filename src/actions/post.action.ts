"use server"

import { revalidatePath } from "next/cache"
import { getDbUserId } from "./user.action"
import prisma from "@/lib/prisma"

export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId()

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