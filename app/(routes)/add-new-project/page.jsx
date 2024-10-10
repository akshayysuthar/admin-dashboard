"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const AddNewListing = () => {
  const router = useRouter();
  const { data: session } = useSession();
  // console.log(session);

  const [loader, setLoader] = useState(false);
  const [projectName, setProjectName] = useState("");
  const currentDate = new Date().toLocaleString();
  const nextHandler = async () => {
    if (!projectName) {
      toast("Please enter a project name", {
        position: "top-right",
      });
      return;
    }

    setLoader(true);

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          title: projectName,
          createdBy: session?.user?.email,
        },
      ])
      .select(); // Use select to return inserted data

    if (data) {
      setLoader(false);
      console.log("Data inserted successfully", data);
      toast("Project has been created successfully", {
        description: `Created on: ${currentDate}`,
        action: {
          label: "Done",
          onClick: () => toast.dismiss(toastId), // Dismiss the toast when "Done" is clicked
        },
        duration: 5000,
        position: "top-right",
      });
      router.replace("/edit-project/" + data[0].id);
    } else {
      setLoader(false);
      console.error("Error inserting data:", error);
      toast("Server side error", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="mt-10 mx-4 md:mx-20 lg:mx-40">
      <div className="p-6 flex flex-col gap-6 items-center justify-center">
        <h2 className="font-bold text-xl md:text-2xl text-center">
          Add New Project
        </h2>
        <div className="p-6 md:p-10 lg:px-16 bg-white rounded-lg border shadow-md flex flex-col gap-5 w-full max-w-xl">
          <h2 className="text-gray-600 text-center">Enter the Project Name</h2>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)} // Handle input change
            placeholder="Project Name"
            className="p-2 border rounded-md w-full"
          />
          <Button onClick={nextHandler} className="w-full flex justify-center">
            {loader ? <Loader className="animate-spin" /> : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddNewListing;
