import * as React from "react";
import { KelirProvider } from "./KelirProvider.js";
import { Button } from "./components/Button.js";
import { Card } from "./components/Card.js";
import { Input } from "./components/Input.js";
import { KelirSwitcher } from "./switcher.js";

export function App() {
  return (
    <KelirProvider>
      <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "600px" }}>
        <h1 style={{ fontFamily: "var(--kelir-font-active)" }}>Kelir Verification App</h1>

        <KelirSwitcher />

        <div>
          <h3>Buttons</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </div>

        <div>
          <h3>Inputs</h3>
          <Input placeholder="Enter your text here..." />
        </div>

        <div>
          <h3>Card</h3>
          <Card title="Neumorphic Card" subtitle="Soft 3D Visuals">
            This card has double soft shadow layers and subtle corner border highlight.
          </Card>
        </div>
      </div>
    </KelirProvider>
  );
}
