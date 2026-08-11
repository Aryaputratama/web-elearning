# PRD - CV & Cover Letter .rar Templates Integration

## Original Problem Statement
The user wants to allow users to download CV and Cover Letter templates (`.rar` archives provided as artifacts) directly from the career kickstart website linked to Episode 19 (`https://career-kickstart-19.preview.emergentagent.com/episode/1`).

## User Choices & Requirements
- File format: `.rar` archives only (`cv template.rar` and `cover latter.rar`)
- Placement: Available directly on the web app and integrated with Episode 19 link.

## Implemented Features (Date: July 2026)
1. **Templates Backend API (`/api/templates/list` & `/api/templates/download/{id}`)**:
   - Serves `.rar` archives for Ultimate CV Template Pack and Winning Cover Letter Suite.
   - Proxies and serves files directly with proper `application/x-rar-compressed` headers and attachment filenames.
2. **Templates Hub & Hero Section on Frontend**:
   - Added prominent download buttons for CV and Cover Letter `.rar` files with download toast feedback.
   - Synchronized links with Episode 19 (`https://career-kickstart-19.preview.emergentagent.com/episode/1`).

## Mocked in Frontend
- None (All download endpoints connect to live uploaded `.rar` template artifacts).

## Backlog & Next Steps
- Add user upload dashboard for admin template management.

## Update (Feb 2026) — Tips Wawancara Section
- Added new section "Tips Wawancara Kerja" (#tips-wawancara) with 2 embedded YouTube videos:
  - Cara Memperkenalkan Diri Saat Wawancara Kerja (9WsRvH1BSJQ)
  - Tips Menjawab Pertanyaan Wawancara dengan Percaya Diri (R3I3hm27G1U)
- Navigation & footer links updated to include the new section.
- Descriptions written in simple Indonesian, targeted at orphanage kids.
- Existing 5-video CV tutorial + .rar downloads unchanged and working.

## Update (Feb 2026) — Auth + Progress Tracking + Admin Dashboard
- Email + password authentication (register/login/logout) via JWT httpOnly cookies (7-day session).
- Per-user progress tracking synced to MongoDB `users.watched_videos` collection.
- Admin dashboard modal accessible only to admin role — shows total users, watched count per user, progress %, and last-login timestamp.
- Admin seeded on startup: `aryaputratama68@gmail.com` / `Quincy2108`.
- Resend integration installed for admin notifications on register/login/video-mark.
- NOTE: Resend test-mode currently restricts sending to the Resend account owner email only. To enable notifications to aryaputratama68@gmail.com, the user needs to verify a domain at resend.com/domains.
