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


const page = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCkeckingUsername, setIsCkeckingUsername] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)

    const debounced = useDebounceCallback(setUsername, 500)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUnique = async () => {
            if (username) {
                setIsCkeckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get
                        (`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<Apiresponse>
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    )
                }
                finally {
                    setIsCkeckingUsername(false)
                }
            }
        }
        checkUnique()
    }, [username])
    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmit(true)
        try {
            const response = await axios.post<Apiresponse>('/api/sign-up', data)
            toast({
                title: 'Success',
                description: response.data.message
            })
            router.replace(`/verify/${username}`)
            setIsSubmit(false)
        } catch (error) {
            console.error("Error in signup of user", error)
            const axiosError = error as AxiosError<Apiresponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: 'Signup failed',
                description: errorMessage,
                variant: 'destructive'
            })
            setIsSubmit(false)
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back to True Feedback
                    </h1>
                    <p className="mb-4">Sign up to continue your secret conversations</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>

                                    <FormControl>
                                        <Input placeholder="username" {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                setUsername(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {isCkeckingUsername && <Loader2 className="animate-spin" />}
                                    <p className={`text-sm ${usernameMessage === 'Username is available' ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        test {usernameMessage}
                                    </p>


                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field}
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
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmit}>
                            {
                                isSubmit ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : ('signup')
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt=4">
                    <p>
                        Alreay a member?{' '}
                        <Link href='sign-in' className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page