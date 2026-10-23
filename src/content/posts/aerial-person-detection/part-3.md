---
project: aerial-person-detection
part: 3
title: "Two bugs the tests passed and review caught"
description: "An anchor/head shape mismatch left most detector outputs untrained, and a loss weighted by frames instead of people. Every test passed both times."
pubDate: 2026-10-23
tags: [detection, testing, debugging]
draft: false
---

Part 2 reported that a fine-tuned detector beat a frozen foundation model. This post is about two bugs I nearly shipped inside that result. Every test I had passed in both cases. A reviewer found them, by working the numbers out by hand.

They matter because of which way they pointed.

## Bug 1: the anchors and the head disagreed

The detector is a COCO-pretrained Faster R-CNN. Detectors like this propose boxes from a set of anchors, which are template shapes laid over every location in the image. People in drone footage are tiny, so I scaled the anchors down to match.

What I missed is that the pretrained proposal head predicts 15 outputs per location, and my anchors gave only 3 shapes per location. The loss then indexed the wrong outputs. About 80% of the head's outputs were never trained ([milestone note](https://github.com/graylayer-labs/ssl-aerial-person-detection/blob/main/docs/milestones/off-the-shelf-bar.md)).

Every test passed. Only building the model and comparing the shapes showed the problem, which is what the reviewer did by hand. The fix was to keep the anchor count the pretrained head expects (15) and scale the sizes down instead ([results note](https://github.com/graylayer-labs/ssl-aerial-person-detection/blob/main/docs/supervised-baseline-results.md)).

## Bug 2: weighting by frames, not people

The second bug was in an experiment on how to feed thermal images in. To fit in memory, each batch was split into micro-batches, and each micro-batch was weighted by how many frames it held.

The loss, though, divides by the number of people in the batch it's given. A micro-batch with many people in few frames is then under-weighted. The weights didn't reproduce a full batch, so that arm was optimising a slightly different objective from its control. The fix weights each micro-batch by its share of the batch's people ([guide chapter 9](https://github.com/graylayer-labs/ssl-aerial-person-detection/blob/main/docs/guide/09-feeding-thermal-in.md)).

Again, every test passed. The reviewer worked the arithmetic by hand and saw that frame counts and people counts are different things.

## Both leaned toward the answer I wanted

My milestone note says either bug would have tilted a result towards the conclusion I expected ([milestone note](https://github.com/graylayer-labs/ssl-aerial-person-detection/blob/main/docs/milestones/off-the-shelf-bar.md)). I expected the frozen foundation model to win. A detector with most of its outputs untrained should look worse than it is, which is what that expectation predicts. I haven't measured how far each bug would have moved a number, so I can't say how large the tilt was.

That's what worries me more than the bugs themselves. A bug that pushes against what you believe gets noticed, because the result looks odd and you go looking. A bug that pushes towards it looks like confirmation.

In this case the surprise survived the fix. The detector won with the bug gone, so the bug wasn't the reason.

## What I changed

Two things changed in how I work. Issues now state the property a piece of code has to guarantee, not only the thing to build. In an earlier milestone, two modules passed every criterion in their issue and every test, and each still failed review three ways, because the criteria described what to build and not what had to stay true.

And reviews of results-critical code now work cases out by hand before running anything, then change a line of code to see whether any test notices. That second trick is cheap and it's humbling.

## Where this leaves the project

This is a research project on one public dataset and four test site-days, not a production search and rescue system. The bar to beat is now the fine-tuned detector. The next steps are tiling full-resolution frames, since resolution was the largest effect I found, and testing the foundation model inside a detector that can adapt.
