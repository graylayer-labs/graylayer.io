---
name: Eoin Mc Allister
title: Applied Machine Learning Engineer
location: Dublin, Ireland
skills:
  - label: Modelling
    items:
      - PyTorch
      - XGBoost
      - scikit-learn
      - Sequence models
      - Anomaly detection
      - Pretrained models
      - Experiment design and evaluation
      - Synthetic data
  - label: Production
    items:
      - Python
      - AWS SageMaker (training, deployment, monitoring)
      - Docker
      - GitHub Actions CI/CD
links:
  - { label: GitHub, url: "https://github.com/graylayer-labs" }
---

I'm an applied machine learning engineer based in Dublin. I focus on model design: choosing the right model for the data problem, and taking it all the way through to production.

Most of my work so far has been on behavioural data. I've built sequence models and aggregate-feature models that complement each other for behavioural classification, and chosen between them by benchmarking rather than by habit. I've built per-user anomaly detection that scores each person against their own baseline instead of global patterns. When the training data is synthetic, I audit it, because data that is too easy to learn, or that nearly gives away the label, makes every model look better than it is. I'd rather fix the generator than trust the numbers.

I care about the path to production as much as the model. I've built reproducible data and training pipelines so that every model follows the same playbook, and deployed models to real-time endpoints with quality monitoring, alerting and explainability for their predictions.
