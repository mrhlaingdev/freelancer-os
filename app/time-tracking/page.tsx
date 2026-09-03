import type { Metadata } from "next";
import TimeTrackingDashboard from "./time-tracking-dashboard";

export const metadata: Metadata = { title: "Time Tracking | Powerhouse", description: "Track time against your projects." };

export default function TimeTrackingPage() { return <TimeTrackingDashboard />; }