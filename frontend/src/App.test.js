import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders DocuMind Enterprise", () => {
  render(<App />);
  expect(screen.getByText(/DocuMind/i)).toBeInTheDocument();
});
