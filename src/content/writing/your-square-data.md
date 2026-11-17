---
title: "Square shows a year of sales. Keeping the rest is on you"
description: "Square’s terms make you solely responsible for permanent sales records, and its summaries last a year. None of three contracts gives a right to export."
standfirst: "If Square runs your tills, it also holds the sales history that any forecast, board paper or AI tool would draw on. Its terms decide who keeps the permanent copy, and whether you can take it with you."
slug: your-square-data
tier: brief
tldr:
  - "My read: export your Square sales history every month into storage your group controls. Under the contract, keeping the permanent copy is your job."
  - "None of the three Square contracts I searched gives you a right to export. The CSV export is a dashboard feature Square may change on notice."
  - "Square’s developer rules bar tools that help you move to another platform, unless Square, at its sole discretion, allows them."
pubDate: 2026-11-17T00:37:00Z
draft: false
chapters: ['08', '11', '17']
sources:
  - title: "Payment Terms"
    publisher: "Square"
    url: "https://squareup.com/au/en/legal/general/payment"
    section: "section 13"
    dated: "Last updated 1 October 2026"
    accessed: 2026-11-17
  - title: "General Terms of Service"
    publisher: "Square"
    url: "https://squareup.com/au/en/legal/general/ua"
    section: "sections 4, 12 and 13"
    dated: "Last updated 30 June 2025"
    accessed: 2026-11-17
  - title: "Print, export, or email your reports"
    publisher: "Square Support Centre, Australia"
    url: "https://squareup.com/help/au/en/article/8362-print-export-or-email-your-reports"
    dated: "No date shown on the page"
    accessed: 2026-11-17
  - title: "Additional Point of Sale Terms of Service"
    publisher: "Square"
    url: "https://squareup.com/au/en/legal/general/pos"
    dated: "Last updated 3 November 2025"
    accessed: 2026-11-17
  - title: "Developer Terms of Service"
    publisher: "Square"
    url: "https://squareup.com/au/en/legal/general/developers"
    section: "sections 2 and 3"
    dated: "No update date shown; the page says the terms apply to all sellers from 13 July 2025"
    accessed: 2026-11-17
  - title: "Privacy Notice for Square Sellers and Website Visitors"
    publisher: "Square"
    url: "https://squareup.com/au/en/legal/general/privacy"
    section: "Your Personal Information Rights"
    dated: "Effective 13 July 2025, last updated 17 September 2026"
    accessed: 2026-11-17
---

Square’s Payment Terms put the permanent record on you. They make you “solely responsible” for “compiling and retaining permanent records of all transactions”, while summaries of your account stay on Square’s website “for up to one year of account activity”.[^1] After that, the sales history your group would need for a forecast, an audit or a move to another system is only as complete as the copies you kept. The dashboard can export it, but no contract I searched says it must.[^2]

## One year for Square, permanent for you

Both limits sit in section 13 of the Payment Terms. Square shows summaries, “including monthly statements”, for a year. The permanent record of “all transactions and other data associated with your Square Account” is yours to compile and keep, “Except as required by Law”.[^1] The same paragraph uses “one year” for what Square shows you and “permanent” for what you must keep.

What happens to the records you did not save? The contracts I read do not say. If the account closes, section 13 of the General Terms says Square will “retain your information and account data stored on our servers in a manner that complies with our legal obligations”. It is not liable for “deletion of your information or account data”, short of its own breach of a material term, fraud, negligence or wilful misconduct.[^2] In plain terms: Square holds a closed account’s data as its legal obligations require, and if data is deleted, the contract leaves the loss with you.

## There is a CSV export, but no right to one

Can you not just export everything? Partly. Square’s help centre describes the steps: in Reports, choose the report and filters, click the export icon, then “Start export to download a CSV file to your device”. It also lists two limits: “You cannot print or export cash drawer reports at this time.” and “You cannot export reports from the Transaction status pages – you can only print them.”[^3] The article shows no date and states no limit on date range or file size.

I searched the full text of the General, Payment and Additional Point of Sale Terms for “export”.[^4] It appears once, in the General Terms, in a list of things you may not do: “export the Services”.[^2] None of the three uses the word “portability”.

So the export is a feature, and section 12 of the General Terms lets Square “add or remove, suspend, stop, delete, discontinue or impose conditions on Services or any feature or aspect of a Service provided we give you prior notice to the extent reasonably practicable”.[^2] My read: that covers the CSV export, so it can change without the contract changing.

## A tool can copy your data. A tool that helps you leave is Square’s call

What about software that pulls the data for you? Anyone who builds a tool on Square agrees to its Developer Terms. Section 3 says they may not, “without the express consent of the Square Seller”, “scrape, build databases or otherwise create permanent copies of such Square Seller’s Content”. So a tool you authorise may copy your data.

Section 2 is different. It bars them from creating a Service “that allows Square Sellers to migrate from Square to a third party service or platform, unless Square, at its sole discretion, does not otherwise prohibit or impose conditions on the creation of such Service”.[^5] A tool that helps you leave exists at Square’s discretion.

## For your AI lead

In October 2026 I ran these exports myself. They came as four files: **Transactions** (one row per payment, with Square’s fee and the net after fees on each row), **Item detail** (one row per item sold), **Item library** (one row per item variation) and **Customer directory** (one row per guest, with name, email, phone, address and birthday). Square can change the files and their headings.

My read, in order:

1. Export all four every month into storage your group controls, with the export date in the file name.

2. Measure Square’s fees from your own Transactions file, so the number does not depend on the dashboard.

3. Treat the customer directory as personal information, with restricted access. Before any of it goes into a Square AI feature, read [what Square’s AI terms let it keep](/writing/square-ai-terms/).

4. If a tool will pull the data for you, give it your consent in writing, as section 3 expects.[^5] I did not read the developer documentation, so I cannot say what the API returns.

## What this does not show

- Whether Square deletes records after one year or after an account closes. The Payment Terms and General Terms speak of availability and retention, not a deletion schedule.

- Whether Square’s privacy notice reaches your sales records. It entitles you to “Request access to personal information that we hold about you”, through a portal at privacy.block.xyz.[^6] It does not say whether a business’s sales records count.

- What “Except as required by Law” takes out of section 13. I have not tested it.

Square’s written answer to the email below would settle the first two.

## Put this in writing

Send this to Square before you plan analytics or a migration on your sales history, and keep the reply.

> Subject: Records and export for our Square account
>
> Section 13 of your Payment Terms (last updated 1 October 2026) makes us solely responsible for permanent records of all transactions and other data associated with our account. Please confirm in writing:
>
> 1. From what date can we export transaction history, and is there a limit on date range or file size per export?
> 2. Which reports cannot be exported? Will Square keep CSV export available, and what notice will we get before it changes?
> 3. If we close the account, for how long can we export our data, and what does Square delete?
> 4. Does the access right in your privacy notice cover our business’s sales and customer records, or only personal information about individuals?
