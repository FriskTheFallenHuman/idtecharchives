---
sidebar_position: 2
description: Demo Files (.demo)
---

# Demo Files (.demo)

---

## Overview

---

These files are recordings usually done for benchmark purposes, they can have live gameplay or static scenes and are stored in `/demos` folder. Even after the introduction of LZW compression in v1.3 they remain big files. These files are created with two console commands: `demoShot` for static scenes and `recordDemo` for rolling demos. Use the `stopRecording` console command to stop a the recording of a rolling demo.

You can playback demos with the playDemo console command (it works on both types of demos). If you wish to benchmark using a demo see the `timeDemo` and `timeDemoQuit` console commands (you should set `"com_compressDemos 0"` in the console to avoid any slowdowns during the benchmark due to decompression).
