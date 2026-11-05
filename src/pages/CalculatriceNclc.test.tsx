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

  it("affiche les niveaux inférieurs à NCLC 6 en rouge et les autres en bleu", () => {
    render(<CalculatriceNclc />);
    const [coInput] = screen.getAllByPlaceholderText("0");

    fireEvent.change(coInput, { target: { value: "397" } });
    expect(screen.getAllByText("NCLC 5").find((element) => element.classList.contains("text-red-500"))).toBeInTheDocument();

    fireEvent.change(coInput, { target: { value: "398" } });
    expect(screen.getAllByText("NCLC 6").find((element) => element.classList.contains("text-blue-500"))).toBeInTheDocument();
  });

  it("colore le niveau global selon le plus bas des quatre résultats", () => {
    render(<CalculatriceNclc />);
    const inputs = screen.getAllByPlaceholderText("0");
    ["458", "453", "10", "10"].forEach((score, index) => {
      fireEvent.change(inputs[index], { target: { value: score } });
    });

    const globalBlock = screen.getByText("Niveau global").parentElement!;
    const globalScore = globalBlock.querySelector("p.text-2xl");
    expect(globalScore).toHaveClass("text-blue-500");

    fireEvent.change(inputs[2], { target: { value: "6" } });
    expect(globalScore).toHaveClass("text-red-500");
  });
});
