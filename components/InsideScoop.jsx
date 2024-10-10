"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";

export default function StatusBox() {
  const currentDate = new Date().toLocaleString();

  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    fetchStatuses();
  }, []);

  async function fetchStatuses() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("portfolioInsider")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setStatuses(data);
    } catch (error) {
      toast.error("Failed to load project Status", {
        description: `Created on: ${currentDate}`,
        action: {
          label: "Done",
          onClick: () => toast.dismiss(toast),
        },
        duration: 5000,
        position: "top-right",
      });
      setError("Failed to fetch statuses");
      console.error("Error fetching statuses:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addStatus() {
    if (!newStatus.trim()) return;

    try {
      const { data, error } = await supabase
        .from("portfolioInsider")
        .insert([
          { content: newStatus.trim(), createdBy: session?.user?.email },
        ])
        .select();

      if (error) throw error;

      setStatuses([data[0], ...statuses]);
      setNewStatus("");
    } catch (error) {
      // setError("Failed to add status");
      console.error("Error adding status:", error);
    }
  }

  async function removeStatus(id) {
    try {
      const { error } = await supabase
        .from("portfolioInsider")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setStatuses(statuses.filter((status) => status.id !== id));
    } catch (error) {
      setError("Failed to remove status");
      console.error("Error removing status:", error);
      toast.error("Failed to removing project Status", {
        description: `Created on: ${currentDate}`,
        action: {
          label: "Done",
          onClick: () => toast.dismiss(toast),
        },
        duration: 5000,
        position: "top-right",
      });
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">The Inside Scoop</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Add New Status</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Status</AlertDialogTitle>
              <AlertDialogDescription>
                Enter your new status update below.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="What's happening?"
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={addStatus}>
                Add Status
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading statuses...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <ul className="space-y-2">
            {statuses.map((status) => (
              <li
                key={status.id}
                className="flex items-center justify-between bg-muted p-2 rounded-md"
              >
                <span>{status.content}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStatus(status.id)}
                  aria-label="Remove status"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
