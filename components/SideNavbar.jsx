"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, PlusCircle, Menu, LogIn, LogOut, Github } from "lucide-react";
const githubRepoLinks = [
  {
    name: "My Portfolio",
    url: "https://github.com/akshayysuthar/portfolio",
    apiUrl: "https://api.github.com/repos/akshayysuthar/portfolio",
  },

];

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showRepos, setShowRepos] = useState(false); // Toggle GitHub Repo Links
  const [commits, setCommits] = useState({});

  useEffect(() => {
    if (showRepos) {
      const fetchCommits = async () => {
        const updatedCommits = {};
        for (const repo of githubRepoLinks) {
          try {
            const response = await fetch(`${repo.apiUrl}/commits?per_page=2`);
            const data = await response.json();
            if (data && data.length > 0) {
              updatedCommits[repo.name] = {
                message: data[0].commit.message,
                date: new Date(
                  data[0].commit.committer.date
                ).toLocaleDateString(),
              };
            }
          } catch (error) {
            console.error("Error fetching commits for", repo.name, error);
          }
        }
        setCommits(updatedCommits);
      };

      fetchCommits();
    }
  }, [showRepos]);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-4">
        <h2 className="mb-4 text-lg font-semibold">Dashboard</h2>
        <nav className="space-y-2">
          <Link
            href="/"
            className="flex items-center p-2 rounded-lg hover:bg-accent"
            onClick={() => setIsOpen(false)}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
          <Link
            href="/add-new-project"
            className="flex items-center p-2 rounded-lg hover:bg-accent"
            onClick={() => setIsOpen(false)}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Project
          </Link>
          <button
            onClick={() => setShowRepos(!showRepos)} // Toggle repos list on click
            className="flex items-center p-2 w-full rounded-lg hover:bg-accent"
          >
            <Github className="w-4 h-4 mr-2" />
            My Repositories
          </button>

          {/* Conditional rendering for GitHub repo links */}
          {showRepos && (
            <div className="ml-4 mt-2 space-y-2">
              {githubRepoLinks.map((repo) => (
                <div key={repo.name} className="mb-4">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline"
                  >
                    {repo.name}
                  </a>
                  {commits[repo.name] && (
                    <p className="text-xs text-black">
                      Last commit: "{commits[repo.name].message}" on{" "}
                      {commits[repo.name].date}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </nav>
      </div>
      <div className="py-4 border-t">
        {status === "authenticated" && session.user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage
                  src={
                    session.user.image || "/placeholder.svg?height=32&width=32"
                  }
                  alt={session.user.name || "User"}
                />
                <AvatarFallback>
                  {session.user.name ? session.user.name[0] : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{session.user.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="ml-2"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <Button onClick={() => signIn()} className="w-full">
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:bg-background">
        <div className="flex-1 px-4">
          <NavContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed top-4 left-4 z-40">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-5">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-4  lg:p-8">{children}</main>
    </div>
  );
}
