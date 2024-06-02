import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema=z.object({
    username:usernameValidation,
})

export async function GET(request: Request){

    await dbConnect();


    try{

        const {searchParams}=new URL(request.url);
        const queryParam={
            username:searchParams.get('username')
        }
        const result=UsernameQuerySchema.safeParse(queryParam);
        console.log("query result",result);
        if(!result.success){
           const userNameError=result.error.format().username?._errors|| [];
           return Response.json({
                success:false,
                message:"username is not valid",
                errors:userNameError
              },{
                status:400
           })
        }
        const {username}=result.data;
        const existingVerifiedUser=await UserModel.findOne({username,isVerified:true});
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"username is taken by someone",
              
              },{
                status:400
           })
        }
        return Response.json({
            success:true,
            message:"username is unique",
          
          },{
            status:200
       })

    }catch(err){
        console.log(err, "user name check kare me error hot ba");
        return Response.json(
            {
                success: false,
                message: "sahi admi ke check kare me dikkat hot ba",
            },
            {
                status: 500,
            }
        )
    }
}