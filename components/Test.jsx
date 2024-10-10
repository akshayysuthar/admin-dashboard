import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LucideIcon,
  Zap,
  Cloud,
  Wand2,
  Cog,
  BarChart,
  Rocket,
} from "lucide-react";
import UserCard from "./UserCard";
import RecentProjectsCard from "./ProjectCard";
import StatusBox from "./InsideScoop";



function BentoGridItem({ title, description, header, icon: Icon, className }) {
  return (
    <Card className={cn("bg-muted/50 row-span-1 overflow-hidden", className)}>
      <CardHeader className="p-4">
        <Icon className="h-8 w-8 text-primary" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {header}
        <CardTitle className="mt-2 text-lg font-bold">{title}</CardTitle>
        <CardDescription className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default function BentoGridDemo() {
  return (
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4  gap-4 p-4"
      >
        {/* User Card */}
        <div className="md:col-span-2">
          <UserCard />
        </div>

        {/* Recent Projects Card */}
        <div className="md:col-span-2">
          <RecentProjectsCard />
        </div>

        {/* Status Box */}
        <div className="md:col-span-4">
          <StatusBox />
        </div>

        {/* Additional BentoGrid Items */}
        <BentoGridItem
          title="Performance Analytics"
          description="Gain insights into your app's performance with our advanced analytics tools."
          icon={BarChart}
          header={
            <div className="flex justify-between items-center">
              <p className="text-4xl font-bold">89%</p>
              <p className="text-green-500 font-semibold">+14%</p>
            </div>
          }
          className="md:col-span-2"
        />
        <BentoGridItem
          title="Cloud Integration"
          description="Seamlessly integrate with popular cloud services for enhanced functionality."
          icon={Cloud}
          header={
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex-1 h-2 bg-primary rounded-full" />
              ))}
            </div>
          }
        />
        <BentoGridItem
          title="AI-Powered Suggestions"
          description="Let our AI analyze your data and provide intelligent suggestions for optimization."
          icon={Wand2}
          header={
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Wand2 className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
          }
        />
        <BentoGridItem
          title="Automated Workflows"
          description="Create and manage automated workflows to streamline your processes."
          icon={Cog}
          header={
            <div className="flex justify-between items-center">
              <div className="w-16 h-4 bg-primary rounded-full" />
              <div className="w-12 h-4 bg-muted rounded-full" />
              <div className="w-8 h-4 bg-primary rounded-full" />
            </div>
          }
          className="md:col-span-2"
        />
        <BentoGridItem
          title="Lightning Fast"
          description="Experience blazing fast performance with our optimized infrastructure."
          icon={Zap}
          header={
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              <span className="text-2xl font-bold">100ms</span>
            </div>
          }
        />
        <BentoGridItem
          title="Scalability"
          description="Our platform grows with you, ensuring smooth scaling as your needs evolve."
          icon={Rocket}
          header={
            <div className="relative h-12">
              <div className="absolute bottom-0 left-0 w-full h-2 bg-muted rounded-full">
                <div className="h-full w-3/4 bg-primary rounded-full" />
              </div>
              <Rocket className="absolute -top-2 left-3/4 h-6 w-6 text-primary transform -translate-x-1/2" />
            </div>
          }
        />
      </motion.div>
    </div>
  );
}
