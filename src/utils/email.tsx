import { render } from "@react-email/render";
import ResetPasswordEmail from "emails/reset-password";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { env } from "~/env";

const mailerSend = new MailerSend({
  apiKey: env.MAILERSEND_API_KEY,
});

export const senResetPasswordMail = async ({
  email,
  name,
  subject,
  link,
}: {
  email: string;
  name: string;
  subject: string;
  link: string;
}) => {
  try{
  const template = render(
    <ResetPasswordEmail
    
      userFirstname={name}
      resetPasswordLink={link}
    />,
  );
  const sentFrom = new Sender(env.MAILERSEND_SENDER_MAIL, "Metatronicminds Team");
  const recipients = [new Recipient(email, name)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setHtml(template);
console.log(emailParams)
  const a =await mailerSend.email.send(emailParams);
  console.log(a)

  return a}
  catch(e){
    console.log(e)
  }
};
