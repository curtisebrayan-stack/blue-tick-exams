import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CalculatriceNclc from "./CalculatriceNclc";

describe("CalculatriceNclc", () => {
  it("affiche le niveau global une fois les 4 scores renseignés", () => {
    render(<CalculatriceNclc />);

    const inputs = screen.getAllByPlaceholderText("0");
    expect(inputs).toHaveLength(4); // CO, CE, EO, EE

    // Scores correspondant tous à NCLC 7 (seuil Entrée express)
    fireEvent.change(inputs[0], { target: { value: "458" } }); // CO
    fireEvent.change(inputs[1], { target: { value: "453" } }); // CE
    fireEvent.change(inputs[2], { target: { value: "10" } }); // EO
    fireEvent.change(inputs[3], { target: { value: "10" } }); // EE

    const globalLabel = screen.getByText("Niveau global");
    const globalBlock = globalLabel.parentElement!;
    expect(globalBlock).toHaveTextContent("NCLC 7");
  });

  it("invite à compléter les 4 épreuves tant qu'il en manque une", () => {
    render(<CalculatriceNclc />);
    const inputs = screen.getAllByPlaceholderText("0");
    fireEvent.change(inputs[0], { target: { value: "458" } });

    expect(screen.getByText("Renseigne les 4 épreuves")).toBeInTheDocument();
  });
});
