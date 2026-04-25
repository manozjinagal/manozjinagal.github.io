---
title: From NIT Kurukshetra to Enterprise Software — My Journey
date: 2024-01-15
category: Career
excerpt: How an MCA degree from one of India's top institutions launched me into the world of healthcare EDI and enterprise implementation consulting.
tags: Career, NIT, Java, Edifecs
---

## The Beginning

Graduating from **NIT Kurukshetra** with an MCA degree was the launchpad. NIRF ranked at #39, NIT Kurukshetra isn't just a college — it's a crucible where algorithms meet real-world problem solving under pressure.

The inter-NIT coding competition — TECH-SPARDA — where I finished 2nd place felt like a preview of what was to come. Competing under time pressure, optimizing on the fly, debugging logic that looked correct on paper but failed in execution.

## Landing at Edifecs

The campus placement season of 2022 brought Edifecs to NIT Kurukshetra. Edifecs is a healthcare IT company specializing in EDI (Electronic Data Interchange) and enterprise healthcare data exchange. Not the flashiest name in tech, but the problems they solve are deeply technical and critical.

I joined as an **Associate Implementation Consultant** — a role that sits at the intersection of software engineering, business analysis, and client delivery.

## What the Work Actually Looks Like

A typical project starts with a client's requirements document. Say, a healthcare payer needs to process a specific EDI file format — DFF — and generate ECF output for encounter management.

The stack is unusual: **SpecBuilder**, **EAM** (Enterprise Application Management), **XEngine**, and heavy **Groovy scripting** for custom logic. Java is the backbone, but the real work happens in the Groovy layer where business rules live.

```groovy
// Example: Multithreaded file processor pattern
def processFiles(List<File> files) {
    def pool = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors())
    def futures = files.collect { file ->
        pool.submit({ -> processFile(file) } as Callable)
    }
    futures.each { it.get() }
    pool.shutdown()
}
```

The multithreading optimization I did for AlohaCare reduced processing time by ~60%. That's the kind of win that makes the work feel real.

## What I've Learned

Three things stand out after two years:

**1. Business context is as important as code quality.** A perfectly written function that solves the wrong problem ships nothing. Understanding the healthcare workflow — why a MAO plan needs historical data loaded differently than a standard commercial plan — is what separates an implementer from a developer.

**2. Groovy is underrated.** Coming from Java, Groovy felt like a shortcut. It's actually a powerful scripting layer that handles complex transformations elegantly when used properly.

**3. Documentation saves future you.** The codebase I inherited had almost none. Every undocumented route or rule is a mystery box someone will open at 2 AM before a go-live.

## What's Next

The DSA practice — 500+ LeetCode problems — continues in parallel. I'm keeping the algorithmic muscle memory sharp for whatever comes next. System design, distributed systems, maybe a product startup. The trajectory is being plotted.

The universe of software is vast. I've mapped one corner of it well. Time to explore the rest.

---

*Written from Mohali. Soundtrack: lo-fi, rain sounds, the occasional chess match on break.*
