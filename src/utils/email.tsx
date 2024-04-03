/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TranslationInfo, User } from "@prisma/client";
import { render } from "@react-email/render";
import ResetPasswordEmail from "emails/reset-password";
import ReviewFilesEmail from "emails/review-files";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { env } from "~/env";
import nodemailer from "nodemailer";
import ApproveEmail from "emails/approve";
import RejectedEmail from "emails/reject";
const mailerSend = new MailerSend({
  apiKey: env.MAILERSEND_API_KEY,
});

const transport = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  auth: {
    user: "translations@metatronicmind.ai",
    pass: "MMTTranslator",
  },
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
  try {
    const template = render(
      <ResetPasswordEmail userFirstname={name} resetPasswordLink={link} />,
    );
    
    const options = {
      from: "translations@metatronicmind.ai",
      to: email,
      subject: "Translation Request",
      html: template,
    };
    const a = await transport.sendMail(options);
    console.log(a);

    return a;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const sendReviewMail = async ({
  user,
  info,
  files,
  approveLink,
  rejectLink,
}: {
  user: User;
  info: TranslationInfo;
  files: any[];
  approveLink: string;
  rejectLink: string;
}) => {
  try {
    const template = render(
      <ReviewFilesEmail
        user={user}
        info={info}
        files={files}
        approveLink={approveLink}
        rejectLink={rejectLink}
      />,
    );
    const sentFrom = new Sender(
      env.MAILERSEND_SENDER_MAIL,
      "Metatronicminds Team",
    );

    // const emailParams = new EmailParams()
    //   .setFrom(sentFrom)
    //   .setTo(recipients)
    //   .setSubject("Translation Request")
    //   .setHtml(template);
    // console.log(emailParams);
    // const a = await mailerSend.email.send(emailParams);

   
    const options = {
      from: "translations@metatronicmind.ai",
      to: env.REVIEW_MAIL_ID,
      subject: "Translation Request",
      html: template,
    };
    const a = await transport.sendMail(options);
console.log(a)
    return a;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const sendApproveddMail = async ({
  email,
  name,
  link,
  fileName,
}: {
  email: string;
  name: string;
  fileName: string;
  link: string;
}) => {
  try {
    const template = render(
      <ApproveEmail userFirstname={name} link={link} fileName={fileName} />,
    );
    const sentFrom = new Sender(
      env.MAILERSEND_SENDER_MAIL,
      "Metatronicminds Team",
    );
  
    const options = {
      from: "translations@metatronicmind.ai",
      to: email,
      subject: "Translation Request Approved",
      html: template,
    };
    const a = await transport.sendMail(options);
    console.log(a);

    return a;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const senRejectMail = async ({
  email,
  name,
  link,
  fileName,
}: {
  email: string;
  name: string;
  fileName: string;
  link: string;
}) => {
  try {
    const template = render(
      <RejectedEmail userFirstname={name} link={link} fileName={fileName} />,
    );
    const sentFrom = new Sender(
      env.MAILERSEND_SENDER_MAIL,
      "Metatronicminds Team",
    );
  
    const options = {
      from: "translations@metatronicmind.ai",
      to: email,
      subject: "Translation Request Rejected",
      html: template,
    };
    const a = await transport.sendMail(options);
    console.log(a);

    return a;
  } catch (e) {
    console.log(e);
    return e;
  }
};
