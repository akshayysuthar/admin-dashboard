"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Formik } from "formik";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditProject = ({ params }) => {
  const technologies = [
    { label: "Tailwind", value: "tailwind" },
    { label: "Next.js", value: "nextjs" },
    { label: "React", value: "react" },
    { label: "Clerk", value: "clerk" },
    { label: "NextAuth", value: "nextauth" },
    // Add more technologies as needed
  ];
  const [selectedIcons, setSelectedIcons] = useState([]);
  const { data: session } = useSession();
  const currentDate = new Date().toLocaleString();
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [project, setProject] = useState({});
  const [image, setImage] = useState(null);



  // Fetch project details
  const fetchProjectDetails = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", params.id);

    if (data) {
      setProject(data[0]);
      setSelectedIcons(data[0]?.icons || []);
      console.log(data[0]);
    }

    if (error) {
      toast.error("Failed to load project details", {
        description: `Created on: ${currentDate}`,
        action: {
          label: "Done",
          onClick: () => toast.dismiss(toast),
        },
        duration: 5000,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  // const uploadImage = async (imageFile) => {
  //   try {
  //     console.log("Uploading image:", imageFile); // Debugging

  //     const { data, error } = await supabase.storage
  //       .from("project-images") // Ensure the bucket name is correct
  //       .upload(`${params.id}/${imageFile.name}`, imageFile); // Unique path

  //     if (error) {
  //       console.error("Upload Error:", error); // Debugging
  //       toast.error("Error uploading image", {
  //         description: `Created on: ${currentDate}`,
  //         action: {
  //           label: "Done",
  //           onClick: () => toast.dismiss(toast),
  //         },
  //         duration: 5000,
  //         position: "top-right",
  //       });
  //       return null;
  //     }

  //     console.log("Image uploaded successfully:", data); // Debugging

  //     // Generate public URL after successful upload
  //     const { data: publicUrlData, error: urlError } = supabase.storage
  //       .from("project-images")
  //       .getPublicUrl(`${params.id}/${imageFile.name}`);

  //     if (urlError) {
  //       console.error("Error generating public URL:", urlError); // Debugging
  //       return null;
  //     }

  //     console.log("Public URL generated:", publicUrlData.publicUrl); // Debugging
  //     return publicUrlData.publicUrl;
  //   } catch (error) {
  //     console.error("Error in uploadImage function:", error.message); // Debugging
  //     return null;
  //   }
  // };

  const handleSaveProject = async (values) => {
    try {
      setLoader(true);
      console.log("Starting to save project..."); // Debugging

      let imageUrl = project?.imageUrl;

      // Debug if an image is being uploaded
      if (image) {
        console.log("Image selected for upload:", image); // Debugging
        const uploadedImageUrl = await uploadImage(image);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
          console.log("Image URL after upload:", imageUrl); // Debugging
        }
      } else {
        console.log(
          "No new image selected, using existing imageUrl:",
          imageUrl
        ); // Debugging
      }

      // Update the project with the new or existing imageUrl
      const { data, error } = await supabase
        .from("projects")
        .update({
          des: values.description || project.description,
          status: values.status || project.status,
          icons: selectedIcons || project.icons, // Update icons
          projectLink: values.link || project.link,
          // imageUrl: imageUrl || project.imageUrl, // Save the public URL here
        })
        .eq("id", params.id)
        .select();

      if (error) {
        console.error("Error updating project in Supabase:", error); // Debugging
        throw error;
      }

      console.log("Project updated successfully:", data); // Debugging
      toast.success("Project updated successfully");
    } catch (error) {
      console.error("Error in handleSaveProject function:", error.message); // Debugging
      toast.error("Error updating project");
    } finally {
      setLoader(false);
      console.log("Save project process completed."); // Debugging
    }
  };

  return (
    <div className="px-10 md:px-36 my-10 ">
      <h2 className="font-bold text-2xl ">Edit Project</h2>
      <Formik
        initialValues={{
          description: project?.description || "",
          category: project?.category || "",
          status: project?.status || "",
        }}
        onSubmit={async (values) => {
          await handleSaveProject(values);
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="p-8 rounded-lg shadow-md ">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg text-slate-500">Project Title</h2>
                <h3 className="text-xl font-bold">
                  {project?.title || "Loading..."}
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-lg text-slate-500">Project Description</h2>
                <Textarea
                  name="description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                  placeholder="Describe your project"
                />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-lg text-slate-500">Project Status</h2>
                <Select
                  name="status"
                  value={values.status}
                  onChange={(value) =>
                    handleChange({ target: { name: "status", value } })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-lg text-slate-500">Technology Icons</h2>
                <div className="grid grid-cols-2 gap-2">
                  {technologies.map((tech) => (
                    <div key={tech.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={tech.value}
                        checked={selectedIcons.includes(tech.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIcons([...selectedIcons, tech.value]);
                          } else {
                            setSelectedIcons(
                              selectedIcons.filter(
                                (icon) => icon !== tech.value
                              )
                            );
                          }
                        }}
                      />
                      <Label>{tech.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-lg text-slate-500">Project URL</h2>
                <Input
                  type="text"
                  name="link"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.link}
                  placeholder="Enter project URL"
                />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-lg text-slate-500">
                  Upload Project Images
                </h2>
                <FileUpload id={params.id} />
              </div>

              <div className="flex gap-4 mt-5 justify-end">
                <Button
                  variant="outline"
                  type="submit"
                  className="text-primary border-primary"
                >
                  {loader ? <Loader className="animate-spin" /> : "Save"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default EditProject;
