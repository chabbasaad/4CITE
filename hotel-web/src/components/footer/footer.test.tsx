import { render, screen } from "@testing-library/react";
import Footer from "./footer";

describe("Footer Component", () => {
    it("renders the footer correctly", () => {
        render(<Footer />);

        expect(screen.getByText(/© 2024 Your Company, Inc. All rights reserved./i)).toBeInTheDocument();
    });

    it("has the correct styles", () => {
        render(<Footer />);

        const footerElement = screen.getByRole("contentinfo");
        expect(footerElement).toHaveClass("bg-gray-950");
    });
});
