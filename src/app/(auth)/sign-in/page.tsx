"use client"
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const LoginPage = () => {
  return (
    <section className='flex min-h-screen bg-zinc-50 dark:bg-transparent px-4 py-16 md:py-32'>
      <div className='m-auto w-full max-w-md'>
        <div className='mb-6 text-center'>
          <Link href={"/"}>
            <h1 className='text-2xl font-bold'>API Command Hub</h1>
          </Link>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card shadow-md",
            }
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
        />
      </div>
    </section>
  )
}

export default LoginPage