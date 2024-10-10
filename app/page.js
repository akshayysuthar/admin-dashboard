"use client";
import StatusBox from "@/components/InsideScoop";
import RecentProjectsCard from "@/components/ProjectCard";
import BentoGridDemo from "@/components/Test";
import ProjectUploadForm from "@/components/Test";
import { Button } from "@/components/ui/button";
import UserCard from "@/components/UserCard";
import Link from "next/link";

export default function Home() {
  return (
    // <div className="py-5 lg:pt-5 pt-10 px-2 lg:flex gap-4 sm:grid sm:grid-cols-1 ">
    //   <UserCard />
    //   <RecentProjectsCard />
    //   <StatusBox />
    // </div>
    <BentoGridDemo />
  );
}
