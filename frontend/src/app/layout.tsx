import type { Metadata } from "next";
import "./globals.css";
import React, { ReactNode } from "react";
import localFont from "next/font/local";
import AppProvider from "./app-provider";

const LXGWWenKai = localFont({
  src: [
    {
      path: "./fonts/LXGWWenKai/LXGWWenKai-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/LXGWWenKai/LXGWWenKai-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/LXGWWenKai/LXGWWenKai-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "ECNC 排班系统",
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="zh-CN">
      <body className={`${LXGWWenKai.className} antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
