import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSyncState } from "../useSyncState";

describe("useSyncState", () => {
  const key = "my-test-key";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const TestComponent = () => {
    const [value, setValue] = useSyncState(key);
    return (
      <div>
        <p data-testid="value">{String(value)}</p>
        <button onClick={() => setValue(true)}>Set True</button>
        <button onClick={() => setValue(false)}>Set False</button>
      </div>
    );
  };

  it("defaults to false if nothing in localStorage", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("value").textContent).toBe("false");
  });

  it("reads from localStorage if value exists", () => {
    localStorage.setItem(key, JSON.stringify(true));
    render(<TestComponent />);
    expect(screen.getByTestId("value").textContent).toBe("true");
  });

  it("updates localStorage and state when value changes", () => {
    render(<TestComponent />);
    const setTrueButton = screen.getByText("Set True");

    fireEvent.click(setTrueButton);

    expect(screen.getByTestId("value").textContent).toBe("true");
    expect(localStorage.getItem(key)).toBe("true");
  });
});
