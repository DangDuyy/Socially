import React from 'react'


export default async function ProfilePage({ params }: { params: { username: string } }) {
  console.log('param ', params)

  await new Promise ( (resolve) => setTimeout(resolve, 3000))
  return (
    <div>ProfilePage</div>
  )
}
