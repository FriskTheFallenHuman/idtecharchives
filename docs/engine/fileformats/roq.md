---
sidebar_position: 5
description: RoQ  (.roq)
---

# RoQ  (.roq)

---

## Overview

---

RoQ is a video file format that originated in [The 11th Hour game.](http://en.wikipedia.org/wiki/The_11th_Hour_(computer_game)) After Graeme Devine, the creator of the format joined id Software, the RoQ file format has been in use in every game the company has released such as Quake III, Return to Castle Wolfenstein and DOOM 3. As it applies to id Tech 4, these files are used for video sequences and animated materials and are stored in `/base/video`.

## Technical details

---

The format runs at a fixed 30 frames per second with an optional `22050 Hz` mono or stereo sound track. Videos may technically be up to `65520 x 65520` pixels with both dimensions divisible by 16 and produce a valid RoQ file, but none of id Software’s games will play back a video with dimensions that aren’t a power of two, most likely because of OpenGL’s texture sizing restrictions.

:::note

It’s been reported that movies with dimensions greater than `512 x 512` cause issues in various id Software games. Until this can be positively confirmed or denied it’s best to avoid higher resolutions.

:::

RoQ is a motion compensating vector quanitizer format, similar to Cinepak, but higher quality due to the use of the ITU-R BT.601 colorspace (the same one used in component video, PAL televisions, JPEG and MPEG), whereas Cinepak uses a low-quality YUV-like colorspace designed for faster decoding that often results in gamut degradation before compression even begins.

:::note

Id tech 4 can technically load RoQ made out of JPEG though, its unknow if this works out of the box or no.

:::

Because it’s a vector quantizer, RoQ files are very fast to decode and very slow to encode. Decoding involves nothing more than converting the colorspace of the codebooks and then copying data, whereas encoding involves using several complicated schemes to produce a “palette” of image fragments that will result in the least degradation.

RoQ uses two codebooks per frame, with the second being constructed from pieces of the first, with up to 256 entries each. Due to this, only 1024 new colors can be introduced each frame, severely limiting the color gamut. This could arguably be improved by better predicting which sections will be motion compensated, but doing so is difficult, since codebook entries are generated from non-motion-compensated image sections, but whether or not they’ll be used depends on the quality of them compared to motion compensated sections, resulting in a chicken-and-egg problem. This is made worse by the fact that all three major RoQ codecs are single-pass.

While the format is limited and much lower quality than MPEG and Indeo Video, it was presumedly preferred by id Software because of the lack of royalties, the lack of patent liability that presents a serious problem with most video formats, and the absence of complex platform-specific APIs.
