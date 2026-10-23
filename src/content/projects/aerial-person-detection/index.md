---
title: Aerial person detection
summary: Detecting people in RGB and thermal drone footage with few labels, building on a pretrained foundation model.
status: active
category: research
accent: "#0d9488"
since: "Aug 2026"
featured: true
stack: [python, pytorch, transformers, torchvision, siglip-2]
links:
  repo: https://github.com/graylayer-labs/ssl-aerial-person-detection
timeline:
  - { date: "2026-08-08", label: "Repository started: RGB-thermal pairing experiments" }
  - { date: "2026-09-29", label: "Trusted ground: pairing, splits, scoring and labels audited" }
  - { date: "2026-10-02", label: "Off-the-shelf bar: frozen SigLIP 2 head against a fine-tuned detector" }
  - { date: "2026-10-04", label: "Fine-tuned detector set as the bar to beat" }
---

The plan: pair the RGB and thermal cameras, adapt a pretrained model to aerial footage, train a person detector on a small labelled fraction, and score it on flights it has never seen. This is a research project, not a production search and rescue system.

![The planned pipeline from drone footage to evaluation on unseen flights.](/posts/aerial-person-detection/pipeline.svg)
