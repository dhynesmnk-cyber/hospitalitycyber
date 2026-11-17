---
title: "Some SevenRooms guest data belongs to DoorDash, not you"
description: "SevenRooms’ contract says DoorDash owns guest data collected through its reservation marketplace. SevenRooms’ blog says restaurants own their guest data."
standfirst: "DoorDash bought SevenRooms in June 2025. If your venues take bookings through SevenRooms, its contract now decides which guest records are yours, and which are DoorDash’s."
slug: sevenrooms-guest-data-doordash
tier: brief
tldr:
  - "My read: find out whether DoorDash’s marketplace is on for your venues and which guests came through it. Under the contract, DoorDash owns those records."
  - "The contract’s guest information includes preferences, venue notes, allergies and reservation details."
  - "SevenRooms may also use de-personalised data derived from yours to build new offerings, and may change the agreement on 30 days’ notice."
pubDate: 2026-11-17T00:39:00Z
draft: false
chapters: ['02', '11', '17']
sources:
  - title: "Main Services Agreement"
    publisher: "SevenRooms"
    url: "https://sevenrooms.com/msa/"
    section: "sections 4.2, 4.3, 4.5, 11.12 and the definitions"
    dated: "Updated 4 February 2026"
    accessed: 2026-11-17
  - title: "Restaurants Still Own Their Guest Data. Now They Get More From It with DoorDash"
    short: "SevenRooms blog on guest data"
    publisher: "SevenRooms (blog)"
    url: "https://sevenrooms.com/blog/guest-data-sevenrooms/"
    dated: "Published 18 June 2026"
    accessed: 2026-11-17
  - title: "Client Terms & Conditions"
    publisher: "SevenRooms"
    url: "https://sevenrooms.com/generalterms/"
    section: "section 5.2"
    dated: "Updated 1 June 2022"
    accessed: 2026-11-17
  - title: "DoorDash Completes Acquisition of SevenRooms"
    publisher: "DoorDash"
    url: "https://about.doordash.com/en-au/news/doordash-completes-acquisition-of-sevenrooms"
    dated: "Published 13 June 2025"
    accessed: 2026-11-17
---

If your venues take bookings through DoorDash’s reservation marketplace, SevenRooms’ contract says DoorDash owns the guest information collected that way. Section 4.3 of its Main Services Agreement, updated 4 February 2026: “DoorDash owns all right, title and interest in all Guest Information (including personal information) that is collected independently through DDRMP”, the DoorDash Reservation Marketplace.[^1] SevenRooms’ blog of 18 June 2026 says “Restaurants continue to solely own their first-party guest data.”[^2] My read: both can be true. The clause carves out guests who arrive through the marketplace.

## One clause hands marketplace guests to DoorDash

What about guests who book directly? Section 4.2 covers them: “As between the parties, Client owns all right, title and interest in, and is solely responsible for Client Information.”[^1] Section 4.3 then begins “Notwithstanding anything to the contrary in Section 4.2” and gives DoorDash the guest information collected independently through the marketplace.

DoorDash completed its purchase of SevenRooms on 13 June 2025.[^4] So the company named in section 4.3 also owns the vendor.

Guest Information is defined as including “Guest preferences, Venue notes on Guests, Guest allergies and reservation details of such Guests”.[^1] In plain terms: for a marketplace booking, the allergy note may sit in a record DoorDash owns.

The blog describes the marketplace this way: “Reservations that come from DoorDash Reservation Marketplace are treated the same way as other third-party reservation providers that we integrate with.” It adds: “Restaurants can access guest information for operational purposes, and can use that data for marketing when a guest opts in.”[^2] So the blog itself puts marketplace guests in a different box: yours to serve, and yours to market to only with an opt-in.

## What SevenRooms may do with data derived from yours

Section 4.5 lets SevenRooms and its affiliates use “aggregated, de-personalized information derived from Client Information, including Guest Information, to improve the Services, including developing new offerings, products or promotions, and for other lawful purposes”. It adds that “SevenRooms and Doordash may have independent access to certain Guest Information”.[^1]

In plain terms: once de-personalised, what your guests generate can feed SevenRooms’ new products. The agreement does not use the words “artificial intelligence”, “machine learning” or “train”. Whether section 4.5 reaches model training, the text does not say.

Section 11.12 lets SevenRooms “update this Agreement” on written notice of material updates “at least thirty (30) days prior to the date the updated version is effective”, with an exception for changes in law or from “critical service providers”.[^1]

## The 2022 terms had no marketplace clause

An older SevenRooms terms page, “Updated June 1, 2022”, says the client owns “any information specific to a Venue that is uploaded by Users to the Platform or otherwise made available by Client to SevenRooms”. It does not use the term DDRMP, and its mentions of DoorDash concern delivery.[^3] Which document governs you depends on your order form.

## For your AI lead

My read, in order:

1. Tag every guest record with its source when you export it: first-party widget, Google, or marketplace. Under section 4.3 the owner differs by source.

2. Treat allergies as sensitive, and keep them out of any tool you have not cleared.

3. Set venue sharing on purpose. Section 4.2 says: “Unless otherwise instructed by Client in writing, Client Information from each Venue will be available to all Users of all other Venues, subject to the access rights of such Users.”[^1]

4. If you train or tune models on exported guest data, leave out marketplace-sourced records until SevenRooms and DoorDash say in writing what you may do with them.

SevenRooms’ voice agent writes to the same guest records. Its sales figures are in [SevenRooms’ 3,800 calls](/writing/sevenrooms-voice-ai-figures/).

## What this does not show

- Which agreement an Australian customer signs, or whether the marketplace is available or on by default in Australia.

- What “collected independently through DDRMP” covers, field by field.

- DoorDash’s own terms and privacy policy. I did not read them.

- Whether the blog and the clause conflict. The blog speaks of first-party data. The clause speaks of data collected independently through the marketplace.

## Put this in writing

Send this to SevenRooms before you switch the marketplace on, or now if it is already on.

> Subject: Guest data ownership under section 4.3 of our agreement
>
> Section 4.3 of your Main Services Agreement (updated 4 February 2026) says DoorDash owns guest information collected independently through DDRMP. Please confirm in writing:
>
> 1. Is DDRMP switched on for our account, and how do we turn it off?
> 2. Which bookings and which fields count as collected independently through DDRMP?
> 3. What may we do with that data, and what may DoorDash do with it?
> 4. Does section 4.5 allow you or DoorDash to use data derived from ours to train AI models?
