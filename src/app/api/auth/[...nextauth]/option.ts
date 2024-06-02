import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"},   
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try{
                    const user=await UserModel.findOne(
                        {$or:[
                        {email:credentials.indetifier},
                        {username:credentials.indetifier},
                        
                    ]})    
                    if(!user){
                        throw new Error("No user found")
                    }
                    if(!user.isVerified){
                        throw new Error("User is not verified")
                    } 
                  const isPasswordCorrect=  await bcrypt.compare(credentials.password, user.password); 
                  if(isPasswordCorrect){
                    return user;
                  }
                  else{
                    throw new Error("Password galat ba");
                  }

                }catch(err: any){
                    throw new Error(err.message);
                }
            }
        })
    ],
    callbacks: {
    
        async jwt({ token, user,}) {
            if(user){
                token.id=user._id?.toString();
                token.isVerified=user.isVerified;
                token.isAcceptingMessages=user.isAcceptingMessages;
                token.username=user.username;
            }
          return token
        },
        async session({ session, token }) {
            if(token){

                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
          return session
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

}
