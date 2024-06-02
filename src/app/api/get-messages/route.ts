import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId=new mongoose.Types.ObjectId(user._id);
  try{
    const user=await UserModel.aggregate([
        {$match:{id: userId}},
        {$unwind: 'messages'},
        {$sort:{'message.createdAt':-1}},
        {$group:{_id:'_id',messages:{$push:'$messages'}}},
    ])
    if(!user || user.length){
        return Response.json(
            {
                success: false,
                message:"user not found"
            },
            {
                status: 404,
            }
        
            )
    }
    return Response.json(
        {
            success: true,
            messages:user[0].messages
        },
        {
            status: 200,
        }
    
        )
  }catch (e) {
    console.log(e,"An unexpected error occurred");

    return Response.json(
        {
            success:false,
            message:'not authenticated'
        },
        {
            status:500
        }

    )
  }

}

