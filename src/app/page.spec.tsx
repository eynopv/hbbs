import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

import Home from "./page";

let page: HomePage;
let user: UserEvent;

describe("Home", () => {
  beforeAll(() => {
    const originalWindowLocation = window.location;
    Object.defineProperty(window, "location", {
      value: {
        ...originalWindowLocation,
        reload: jest.fn(),
      },
      writable: true,
    });
    window.history.pushState = jest.fn((_, __, url) => {
      if (url !== "test-loading") {
        window.location.pathname = String(url);
      }
    });
  });

  beforeEach(() => {
    user = userEvent.setup();
    page = new HomePage();
    page.render();
  });

  it("has input field", () => {
    expect(page.inputField).toBeVisible();
    expect(page.inputField.getAttribute("placeholder")).toBe(
      "https://www.humblebundle.com/books/example-bundle",
    );
  });

  it("has submit button", () => {
    expect(page.submitButton).toBeVisible();
  });

  it("shows error on invalid url", async () => {
    await user.type(page.inputField, "example.com/books/example-bundle");
    await user.click(page.submitButton);
    expect(page.errorMessage).not.toBeNull();
    expect(page.inputField).toHaveClass("border-red-500");
  });

  it("goes to bundle page", async () => {
    await user.type(
      page.inputField,
      "https://www.humblebundle.com/books/example-bundle",
    );
    await user.click(page.submitButton);
    expect(window.location.pathname).toBe("/example-bundle");
    expect(window.location.reload).toHaveBeenCalled();
  });

  it("shows loading indicator on submit", async () => {
    await user.type(
      page.inputField,
      "https://www.humblebundle.com/test-loading",
    );
    await user.click(page.submitButton);
    expect(page.loadingIndicator).toBeInTheDocument();
  });
});

class HomePage {
  constructor() {}

  render() {
    render(<Home />);
  }

  get inputField() {
    return screen.getByLabelText("Paste HumbleBundle link");
  }

  get submitButton() {
    return screen.getByRole("button", { name: "Submit" });
  }

  get errorMessage() {
    return screen.queryByText("Provide a valid HumbleBundle link");
  }

  get loadingIndicator() {
    return screen.getByTitle("Loading");
  }
}
