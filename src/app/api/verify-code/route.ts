import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import {z} from "zod";

export async function POST(request: Request){
    await dbConnect()

    try{
      const {username, code} = await request.json();
      const decodedUsername= decodeURIComponent(username);
      const user=await UserModel.findOne({username: decodedUsername})
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "user not found",
                },
                {
                    status: 500
                }
            )
        }
        const isCodeValid=user.verifyCode===code;
        const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date();
        if(isCodeNotExpired && isCodeValid){
            user.isVerified=true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "user verified",
                },
                {
                    status: 200
                }
            )}
            else if(!isCodeNotExpired ){
                return Response.json(
                    {
                        success: true,
                        message: "verification code expired",
                    },
                    {
                        status: 400
                    }
                )
            }else{
                return Response.json(
                    {
                        success: true,
                        message: "Verification code galat bar",
                    },
                    {
                        status: 400
                    }
                )
            }
        

    }catch(err){
        console.log(err, "user name check kare me error hot ba");
        return Response.json(
            {
                success: false,
                message: "sahi admi ke check kare me dikkat hot ba",
            },
            {
                status: 500
            }
        )
    }
}