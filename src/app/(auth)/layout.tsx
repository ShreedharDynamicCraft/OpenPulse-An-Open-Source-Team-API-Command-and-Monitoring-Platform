import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

const AuthLayout = async({children}: {children: React.ReactNode}) => {
    const { userId } = await auth()

    if(userId){
        return redirect("/")
    }

  return (
    <div>{children}</div>
  )
}

export default AuthLayout