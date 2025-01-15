import * as React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "@/components/TopBar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <TopBar />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;