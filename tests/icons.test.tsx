import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Icon, ICON_NAMES } from "../src/design/icons";

describe("Icon", () => {
  it("espone tutte le icone richieste dalle scene", () => {
    expect(ICON_NAMES.length).toBe(17);
    expect(ICON_NAMES).toContain("shield");
    expect(ICON_NAMES).toContain("terminal");
    expect(ICON_NAMES).toContain("cloudOff");
  });

  it("normalizza ogni tracciato con pathLength=1", () => {
    for (let i = 0; i < ICON_NAMES.length; i++) {
      const markup = renderToStaticMarkup(<Icon name={ICON_NAMES[i]} />);
      const paths = markup.split("<path").length - 1;
      const normalized = markup.split('pathLength="1"').length - 1;
      expect(paths).toBeGreaterThan(0);
      expect(normalized).toBe(paths);
    }
  });

  it("disegna il tracciato quando riceve frame e drawAt", () => {
    const inizio = renderToStaticMarkup(
      <Icon name="check" frame={0} drawAt={30} />,
    );
    const fine = renderToStaticMarkup(
      <Icon name="check" frame={120} drawAt={30} />,
    );
    expect(inizio).toContain("stroke-dashoffset:1");
    expect(fine).toContain("stroke-dashoffset:0");
  });

  it("resta statica senza frame", () => {
    const markup = renderToStaticMarkup(<Icon name="check" />);
    expect(markup).not.toContain("stroke-dashoffset");
  });
});
