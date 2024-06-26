import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Theme } from "@radix-ui/themes";
import { api } from "~/utils/api";
import "@radix-ui/themes/styles.css";
import "~/styles/globals.css";
import { Header } from "~/components/Header";
import { Toaster, toast } from 'sonner'
import Head from "next/head";



const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Theme appearance="dark" panelBackground="solid" accentColor="violet">
          <Header/>
        <main className={`font-sans`}>
        <Toaster richColors closeButton  position="top-right"/>
        <Head>
      <link rel="shortcut icon" href="logo.png" />
      <title>AI Translator</title>
    </Head>
          <Component {...pageProps} />
        </main>
      </Theme>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
