import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anjan Khat | Verification Code ',
            react: VerificationEmail({username: username, otp: verifyCode}),
          });
        return {
            success: true,
            message: "sahi admi ke check karal jat ba",
        }
    }
    catch (err) {
            console.error(" Mail bheje me dikkat hot ba : " + err)
            return {
                success: false,
                message: "sahi admi ke check kare me dikkat hot ba",
            }
    }
}
