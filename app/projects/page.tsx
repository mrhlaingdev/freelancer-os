import type { Metadata } from "next";
import ProjectsDashboard from "./projects-dashboard";

export const metadata: Metadata = {
  title: "Projects | Powerhouse",
  description: "Track projects, budgets, and delivery progress.",
};

export default function ProjectsPage() {
  return <ProjectsDashboard />;
}