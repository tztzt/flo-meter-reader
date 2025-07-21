import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Title } from "../Title";

describe("Title Component", () => {
  it("renders filename and checkbox state, calls setShowRawData on toggle", () => {
    const setShowRawData = vi.fn();

    render(
      <Title
        fileName="test-file.csv"
        showRawData={true}
        setShowRawData={setShowRawData}
      />
    );

    expect(screen.getByText("test-file.csv")).toBeDefined();

    // Use getByLabelText instead of getByRole to avoid multiple matches
    const checkbox = screen.getByLabelText("Show Raw Data") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(setShowRawData).toHaveBeenCalledWith(false);
  });
});
