import { access } from "fs";
import {z} from "zod";

export const acceptMessageSchema=z.object({
   accessMessage:z.boolean(),
})