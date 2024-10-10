"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserCard() {
  const { data: session, status } = useSession();
  return (
    <Card className="w-full max-w-md ">
      <CardHeader className="flex flex-row items-center gap-4 p-6">
        {status === "authenticated" && session.user ? (
          <>
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={
                  session.user.image || "/placeholder.svg?height=64&width=64"
                }
                alt="User avatar"
              />
              <AvatarFallback>
                {session.user.name ? session.user.name[0] : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{session.user.name}</h2>
              <p className="text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </>
        ) : (
          <h2 className="text-2xl font-bold">Welcome</h2>
        )}
      </CardHeader>
      <CardContent>
        {status === "authenticated" ? (
          <p className="text-muted-foreground">
            Logged in as {session.user.name}. You have access to all features.
          </p>
        ) : (
          <p className="text-muted-foreground">
            Please log in with GitHub to access your account.
          </p>
        )}
      </CardContent>
      <CardFooter>
        {status === "authenticated" ? (
          <Button
            onClick={() => signOut()}
            variant="destructive"
            className="w-full"
          >
            Logout
          </Button>
        ) : (
          <Button onClick={() => signIn("github")} className="w-full">
            Login with GitHub
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
