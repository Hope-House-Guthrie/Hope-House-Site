# Project Overview

Hope House Guthrie’s public website shares our mission, programs,
community impact, events, and ways to support our work.

The organization is Neighborhood Hope Dealers, Inc., doing business
as Hope House Guthrie.

## Existing Sites for Inspiration

- City Rescue Mission
- Homeless Alliance
- City Care
- Pivot
- Remerge
- Sunbeam Family Services

## Design Direction

- Use white and light sky blue section backgrounds to create separation.
- Use blue headings and consistent blue heading dividers.
- Use light sky blue cards on white sections and white cards on
  light sky blue sections.
- Use the shared `hope-frame` and `hope-frame-accent` styles for
  consistent raised cards.
- Keep donation and primary support buttons green.
- Keep layouts readable and consistent on mobile and desktop.
- Keep the homepage aerial photo prominent and recognizable.
- Use a light, neutral tinted overlay on the desktop hero to support
  readable text while preserving the photo’s natural colors.
- Keep the current hero text on the left without a separate glass card.
- Review mobile layouts separately, including navigation and the
  volunteer tab.
- Clearly identify placeholder content and unconfirmed event details.

## Completed

- Updated homepage service cards and aligned their Learn More links.
- Corrected community lunch hours to 11:00 AM–1:00 PM daily.
- Clarified that walk-in services are available daily until 5:00 PM.
- Refined the Community Partners & Supporters section.
- Added Our Impact above Community Partners & Supporters.
- Added placeholders for Meals Served and Food Boxes Distributed.
- Added raised card styling with `hope-frame` and `hope-frame-accent`.
- Added the homepage Spotlight carousel.
- Updated partner logos and social link styling.
- Added the volunteer tab and adjusted its mobile behavior.
- Added the New Client Inquiry form interface.
- Reviewed homepage sections on mobile and desktop.

## In Progress: Events Page

- Finish the dedicated Events page at `/events`.
- Add Events to the desktop and mobile header navigation.
- Include:
  - A featured event.
  - Upcoming Hope House and community events.
  - A community calendar.
  - A way to suggest community events for consideration.
- Begin with a calendar placeholder that TJ can replace with the
  Google Calendar integration.
- Confirm dates, times, locations, activities, and registration
  requirements before publishing event details.
- Include only public events; keep internal client schedules in the Hub.
- Coordinate how featured and upcoming event cards will stay aligned
  with the calendar.

## Roadmap

### Issues — Before Launch

This section tracks work required before going live on the primary
domain. Add items as needed and remove them after they are completed
and verified.

- Brent: Fix automatic phone-number formatting on the volunteer form.
- Brent: Add content to `volunteer-inquiry-success.astro`.
- Brent: Add content to `client-inquiry-success.astro`.
- Brent: Add content to `not-found.astro`.
- Brent: Fix the Volunteer and Client inquiry submit-button styling;
  the buttons appear disabled even though they are enabled.
- TJ: Save Volunteer and Client inquiry submissions in the Hub database.
- TJ: Add a way to view those submissions in the Hub.
- Brent and TJ: Verify both forms submit, save the information, and
  redirect to the correct success page.
- Brent: Update the forms' “coming soon” notices once submissions
  are being saved successfully.
- Volunteer form: phone number doesn't auto format
- Programs and Services: needs content update
- volunteer-inqury-success.astro: needs content
- client-inqury-success.astro: needs content
- 404.astro: needs content
- Volunteer and Client inquiry forms: submit button appears greyed out due to css settings (but is enabled)

### Brent

- Continue reviewing existing sites for inspiration.
- Refine colors, spacing, and page layouts throughout the website.
- Finish the Events page layout and header navigation.
- Gather confirmed event details and approved event images.
- Gather verified impact totals and their reporting periods.
- Expand content as approved material becomes available:
  - Additional organization history.
  - Success stories shared with permission.
  - Photos and videos approved for public use.
  - Blog and/or news.
- Review the hero overlay for readability and photo visibility.
- Coordinate traffic reporting needs with TJ’s Google Analytics work.

### TJ

- Integrate GiveButter donations.
- Integrate GiveButter mailing list signup.
- Integrate TinaCMS for visual content management.
- Add Google Analytics tracking.
- Connect a public Google Calendar to the Events page.
- Support staff adding and updating Hope House and community events.
- Coordinate calendar data with featured and upcoming event cards.
- Complete submission handling for website inquiry forms.
- Add an RSS feed for blog/news once that section is available.

### Future: Hope House Hub Integration

- Connect Our Impact to summary totals from the Hub service tracker.
- Count meals by the quantity served:
  - An entry for three meals adds three to the Meals Served total.
- Track the number of food boxes distributed.
- Display a clear reporting period and last updated date.
- Update website totals automatically as tracker entries are saved.
- Reflect corrections or removed entries in the published totals.
- Publish only aggregate counts; keep names and individual service
  records private.
- Replace the current placeholders once verified data is available.