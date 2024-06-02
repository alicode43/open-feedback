"use client"
import { signInSchema } from '@/schemas/signInSchema';
import { signUpSchema } from '@/schemas/signUpSchema';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react';

function SignIn() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const {toast} = useToast();
  const router=useRouter();

  const form=useForm<z.infer<typeof signInSchema >>({
    resolver:zodResolver (signInSchema),
    defaultValues:{
      identifier:'',
      password:'',
    }
   });

   const onSubmit=async (data:z.infer<typeof signInSchema>)=>{
    setIsSubmitting(true);
    
    try{
      const response =await axios.post<ApiResponse>('/api/sign-in', data);
      toast({
        title:'Success',
        description:response.data.message,
      })
      // router.replace(`/verify/${username}`);

    }
    catch(e) {
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
         name="identifier"
         render={({ field }) => (
           <FormItem>
             <FormLabel>Username</FormLabel>
             <FormControl>
               <Input placeholder="Username" {...field} 
               onChange={(e)=>{
                 field.onChange(e);
                //  debounced(e.target.value);
               }}  
               />
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
           ):("Sign In")
         }
         
         </Button>



         </form>

       </Form>
     </div>
      
    </div>
  )
}

export default SignIn
