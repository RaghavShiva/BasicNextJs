'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/Schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { Apiresponse } from "@/types/Apiresponse"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/Schemas/signInSchema";
import { signIn } from "next-auth/react";


const page = () => {

  // const [isSubmit, setIsSubmit] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password

    })
    if (result?.error) {
      toast({
        title: 'Login Failed',
        description: 'Incorrect username or password',
        variant: 'destructive'
      })
    }
    // else{
    //   toast({
    //     title:'Login Successful'
    //   })
    // }
    if (result?.url) {
      router.replace('/dashboard')
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">

            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="password" {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit"
            // disabled={isSubmit}
            >
              Signin
              {/* {
                isSubmit ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : ('signup')
              } */}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page