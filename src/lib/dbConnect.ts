import mongoose from "mongoose";

type ConnectionObject={
    isConnected?: number
}
const connection:ConnectionObject={}

async function dbConnect():Promise<void> {
    if (connection.isConnected) {
        console.log("Pahile se hi connected ba");
        return;
    }

   try{
   const db= await mongoose.connect(process.env.MONGODB_URI || "", {})
    connection.isConnected=db.connections[0].readyState
    console.log("db se connect ho gail ba ");
    }
    catch(err){
        console.log("connection fail ho gail ba :",err);
        process.exit(1);

    }
}

export default dbConnect;