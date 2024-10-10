"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Initialize Supabase client

export default function RecentProjectsCard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();


  useEffect(() => {
    async function fetchRecentProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select(
            `*,
        projectImages (
          url,
          project_Id
        )`
          )
          .order("created_at", { ascending: true })
          .limit(5);

        if (error) throw error;

        setProjects(data);
      } catch (err) {
        setError("Failed to fetch recent projects");
        console.error("Error fetching recent projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentProjects();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-4 w-4" />
            <p>{error}</p>
          </div>
        ) : (
          <ScrollArea className="h-[200px]">
            <ul className="space-y-2">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <span className="text-lg font-bold">{project.title}</span>
                  <span className="font-medium">{project.des}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
