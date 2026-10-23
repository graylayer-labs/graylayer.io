---
project: aerial-person-detection
part: 1
title: "The label audit: a thermal clip's empty frames were not empty"
description: "Before training anything I checked the pairing and the labels. One thermal clip's empty frames mostly had people in them."
pubDate: 2026-10-23
tags: [detection, thermal, datasets]
draft: false
---

I'm building a person detector for search and rescue from drone footage, with few labels. It's a research project, not a production system. The plan was to start from a pretrained model, adapt it to RGB and thermal footage, and see how far a small labelled fraction gets me.

![The planned pipeline: drone footage, pairing the two cameras, adaptation, a detector trained with few labels, and evaluation on unseen flights.](/posts/aerial-person-detection/pipeline.svg)

Before training anything, I checked what the work would stand on. That turned out to be the most useful thing I did. Here's what broke.

## The pairs were wrong, twice

The public dataset (WiSARD) has an RGB and a thermal camera on the same flights, and I wanted frame pairs from the same moment. Two sets of pairs already existed, with 16,459 and 8,759 pairs. Both were wrong.

The first paired frames by position in sorted order. That included 1,620 pairs from a flight where the two cameras run at different frame rates, so those pairs show different scenes. The second used a parser that only read 5 or 6 digit frame numbers, so seven clip pairs collapsed to one arbitrary pair each.

The fixed rule gives 14,834 pairs from 17 clip pairs, and 5,739 of them are labelled in both cameras. They were checked against camera motion and by looking at the frames. The details are in the [pairing review](https://github.com/graylayer-labs/ssl-aerial-person-detection/blob/main/docs/wisard-pairing-review.md).

## The labels were not complete

I assumed the labels were complete, because a dataset with boxes on it looks finished. So a sample of 99 labelled frames per camera, 198 in total, was reviewed for people with no box.

In RGB, about 1.0% of the people I could see had no box. In thermal it was 5.7%. That's small enough to ignore if the misses are scattered. They weren't scattered. All 10 missed thermal people in the sample came from a single clip, and that clip has 1,201 of its 1,417 frames with an empty label file ([label completeness review](https://github.com/graylayer-labs/ssl-aerial-person-detection/blob/main/docs/label-completeness-review.md)).

So that clip got a closer look. Of the 35 empty-label frames the review was sure about, 30 showed people with no box. That is 85.7%, and at least 59% even if every unsure frame turns out to be empty ([the trusted-ground write-up](https://github.com/graylayer-labs/ssl-aerial-person-detection/blob/main/docs/blog/2026-10-trusted-ground.md)). Most of that clip was simply never labelled, and nothing in the dataset says so.

| Check | Number |
|---|---|
| Pairs after the fix | 14,834 from 17 clip pairs |
| People with no box, RGB / thermal | 1.0% / 5.7% |
| "Empty" frames in the one clip that had people | 85.7% (30 of 35 sure frames) |

## Why the loss curve would never have shown it

Here's the part that bothers me. If I had trained a model on this clip, nothing would have looked wrong. A person with no box is background as far as the loss is concerned. The model is told to ignore the people, and it learns to, and the training loss goes down as smoothly as it would on clean data.

The scorer makes it worse. A correctly found person who has no box counts as a false alarm, so a detector that's right gets marked down. A detector that learned to ignore people gets marked up. Either way the number looks like a model result when it's really a dataset fault.

## What I did about it

The fix I chose was to treat that clip's empty-label thermal frames as unlabelled instead of as empty. They no longer count as evidence that nobody is there. I didn't change any labels.

This is a first pass and it has limits. The sample is small, so a rate near 1% is barely measurable. Frames of a clip are neighbours, not independent draws, so the real interval is wider than the one I computed. And 21 of the 198 sampled frames I marked unsure; they still need a second look, so every number here is provisional until that's done.

## What I learned

Complete-looking labels are an assumption, and cheap to test. Looking at 198 frames took far less time than any training run would have.

I also learned to be suspicious of a clean loss curve. It tells you the model is fitting the labels. It says nothing about whether the labels are right.

Next I measured how far a frozen foundation model gets with 1%, 5%, 10% and 100% of the labels. That didn't go the way I expected, and it's the subject of part 2.
