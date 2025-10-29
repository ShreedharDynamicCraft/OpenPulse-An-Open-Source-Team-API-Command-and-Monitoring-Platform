"use client"
import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const SignUpPage = () => {
  return (
    <section className='flex min-h-screen bg-zinc-50 dark:bg-transparent px-4 py-16 md:py-32'>
      <div className='m-auto w-full max-w-md'>
        <div className='mb-6 text-center'>
          <Link href={"/"}>
            <h1 className='text-2xl font-bold'>API Command Hub</h1>
          </Link>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card shadow-md",
            }
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/"
        />
      </div>
    </section>
  )
}

export default SignUpPage
