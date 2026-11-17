name: "kelir-request"
description: "Request a prop/variant outside the patent contract (§5 STYLE.md)"
title: "[kelir-request] "
labels: ["kelir-request"]
body:
  - type: markdown
    attributes:
      value: |
        The Kelir contract is **patent**: only CONTENT + MEANING + BEHAVIOR
        (§5 `STYLE.md`). Raw styling (`style`/`sx`/`className`/hex-px) is **not**
        served — read §6 first. Fill in this form so the table owner can decide.

        **Language:** please write this issue in English.
  - type: input
    id: component
    attributes:
      label: "Component (§5 No)"
      placeholder: "e.g. Select (no 48)"
    validations:
      required: true
  - type: textarea
    id: requirement
    attributes:
      label: "Requirement (CONTENT/MEANING/BEHAVIOR, not visual)"
      description: "Good example: `size?: 'xl'` for dense table cells. Rejected example: `style={{margin: 4}}`."
      placeholder: "requested prop/variant + meaning/behavior reason"
    validations:
      required: true
  - type: textarea
    id: workaround
    attributes:
      label: "Current consumer workaround"
      description: "How is the need met today without changing the kit?"
    validations:
      required: false
  - type: dropdown
    id: urgency
    attributes:
      label: "Urgency"
      options: ["low — wait for a batch", "medium — needed this sprint", "high — release blocker"]
    validations:
      required: true
