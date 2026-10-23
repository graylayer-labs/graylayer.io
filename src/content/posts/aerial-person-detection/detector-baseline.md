---
project: aerial-person-detection
part: 2
title: "An ordinary fine-tuned detector beat the frozen foundation model"
description: "My premise was that a frozen foundation model helps most when labels are few. At 1%, 5% and 10% of the labels, a fine-tuned off-the-shelf detector beat it."
pubDate: 2026-10-23
tags: [detection, foundation-models, baselines]
draft: false
---

The premise of this project was simple. Labels are scarce, so a big pretrained model that already understands images should give a head start. Keep it frozen, train a small detection head on its features, and the pretrained knowledge does the heavy lifting.

I measured that premise, and it lost. It's a research project on one public dataset, so read everything below with that in mind.

## What I compared

The frozen side was SigLIP 2 with a small head trained on its features. The other side was an ordinary detector: a Faster R-CNN with a MobileNetV3 backbone, pretrained on COCO and fine-tuned on the same labelled frames. Both read the same resized images (672x384 for RGB, 560x448 for thermal) and were scored by the same code.

I tried to make the comparison fair on purpose. The detector's finest feature map is actually coarser than the head's grid, with a 32-pixel stride against 16-pixel cells, so it doesn't win by seeing more detail. The comparison also refuses to run if the two methods saw different frames.

The test is four held-out site-days, each one a place and day the model never saw in training. Scores are average precision at an overlap of 0.25, which suits people only 8 to 12 pixels across, averaged over the four folds. I ran one seed per run, so keep that in mind.

<div style="background:#fff;padding:12px;border-radius:12px"><img src="/posts/aerial-person-detection/off-the-shelf-bar.svg" alt="Mean test AP over four held-out site-days, frozen head against fine-tuned detector, at 1%, 5%, 10% and 100% of labels, for RGB and thermal." style="border-radius:0;max-width:100%"></div>

## What came out

| Labels | RGB head | RGB detector | Thermal head | Thermal detector |
|---|---|---|---|---|
| 1% | 0.044 | 0.064 | 0.065 | 0.153 |
| 5% | 0.094 | 0.152 | 0.132 | 0.228 |
| 10% | 0.113 | 0.163 | 0.129 | 0.256 |
| 100% | 0.250 | 0.204 | 0.302 | 0.294 |

Mean `ap_iou25` over four folds. The full tables, with per-fold numbers and the stricter `ap_iou50`, are in [the results note](https://github.com/graylayer-labs/ssl-aerial-person-detection/blob/main/docs/supervised-baseline-results.md).

The three numbers I'd keep: thermal at 10% of labels, 0.256 for the detector against 0.129 for the head. Ahead in all six camera-and-label-fraction cells from 1% to 10%, and in 22 of the 24 per-fold cells. And level at 100%, where the head's small lead comes from a single fold.

The boxes differ too. The head's `ap_iou50` stays under 0.09 at every label fraction, while the detector's goes up to 0.18. The head finds the right area but draws loose boxes.

## How much I'd trust it

Less than the table makes it look. Four site-days is a small test and one seed is a small sample. The spread over folds is sometimes as large as the mean. One site-day, Carnation, scores near zero in thermal for every method I tried.

The direction at 1% to 10% is the part that holds up, because it goes the same way fold after fold. The 100% row is a tie, and I wouldn't read anything into 0.204 against 0.250.

I also checked whether I'd just under-trained the head. Its score peaks within 25 to 150 steps and then overfits. Choosing the stopping step more finely moved its mean by between -0.005 and +0.010, so no.

## The result that mattered more

Resolution beat both methods. On one site-day, running the detector on the full 4K frame scored 0.779, against 0.213 at the shared input size. That is a single run, and the other seven full-resolution runs didn't fit in my time limit, so I can't say how far it generalises ([source](https://github.com/graylayer-labs/ssl-aerial-person-detection/blob/main/docs/supervised-baseline-results.md)).

It makes sense. People four to sixteen pixels across mostly disappear when a frame is shrunk, whichever model reads it afterwards.

## What I learned

The premise was a guess I'd stated as a plan. I'd have been happy to keep it, and the numbers didn't care.

This doesn't show foundation models are useless. It shows that this one, frozen, at this input size, with these labels, didn't beat a small detector that was allowed to adapt. The fair next test is the same foundation model inside a detector that can fine-tune it.

So the bar for everything I try next is the fine-tuned detector, not the frozen head. And there's a footnote on how I got here: two bugs in this work passed every test, and a reviewer caught them. That's part 3.
