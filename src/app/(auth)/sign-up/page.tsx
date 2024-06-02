/* eslint-disable react-hooks/rules-of-hooks */
"use client" 
 
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceValue,useDebounceCallback } from 'usehooks-ts'

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation"
import { sign } from "crypto"
import { signUpSchema } from "@/schemas/signUpSchema"
import Email from "next-auth/providers/email"
import axios, {AxiosError} from 'axios';
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


 function page() {
  const [username, setUsername] = useState('');
  const [usernameMessage,setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced=useDebounceCallback(setUsername,300);
  const {toast} = useToast();
  const router=useRouter();

// zod implements
 const form=useForm<z.infer<typeof signUpSchema >>({
  resolver:zodResolver(signUpSchema),
  defaultValues:{
    username:'',
    email:'',
    password:'',
  }
 });

 useEffect(() => {
    const checkUsenameUnique =async()=>{
      if(username){
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try{
          const response=await axios.get(`/api/check-username-unique?username=${username}`);
          console.log(response);
          setUsernameMessage(response.data.message);
        }catch(e){
          const axiosError=e as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message??"Error checking username"
          )
        }
        finally{
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsenameUnique();
 },[username])

 const onSubmit=async (data:z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true);

    try{
      const response =await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title:'Success',
        description:response.data.message,
      })
      router.replace(`/verify/${username}`);

    }
    catch(e){
        console.error(e,"signup error");
        const axiosError=e as AxiosError<ApiResponse>;
        let errorMessage=axiosError.response?.data.message;
        toast({
          title:"Signup failed",
          description:errorMessage,
          variant:'destructive'

        })
    }
    finally{
      setIsSubmitting(false);
    }

 }

 
   
   return (
     <div className="flex justify-center items-center max-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Anjan khat
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
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
                <Input placeholder="Username" {...field} 
                onChange={(e)=>{
                  field.onChange(e);
                  debounced(e.target.value);
                }}  
                />
              </FormControl>
                {isCheckingUsername && <Loader2 className="animate-spin"/>}
                <p className={`{text-sm ${usernameMessage ==="username is unique" ?'text-green-500':'text-red-600'}`}>
                    test {usernameMessage}
                </p>
         
              <FormMessage />
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
                <Input placeholder="Email" {...field}  />
              </FormControl>
         
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
                <Input type="password" placeholder="password" {...field}  />
              </FormControl>
         
              <FormMessage />
            </FormItem>
          )}
        />




          

        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting?(
              <>
              <Loader2 className="mr-2 h-4 animate-spin"/> Please Wait
              </>
            ):("SignUp")
          }
          </Button>



          </form>

        </Form>
      </div>
       
     </div>
   )
  }
 
 export default page
 