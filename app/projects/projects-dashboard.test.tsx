import { render, screen } from "@testing-library/react";
import ProjectsDashboard from "./projects-dashboard";

jest.mock("posthog-js", () => ({ __loaded: false, capture: jest.fn() }));

describe("ProjectsDashboard", () => {
  it("renders project management summary and projects", () => {
    render(<ProjectsDashboard />);
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText("Northstar Brand System")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add project/i })).toBeInTheDocument();
  });
});