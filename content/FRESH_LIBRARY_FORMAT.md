# Say More complete fresh library

Supply a single `content/fresh-library.json` JSON array containing exactly 39,900 **individually authored** records. Each must have `id`, `topic`, `mood`, `audience`, `text`, and `angles` (one or more meaningful follow-up questions). The valid 19 topics, 6 moods and 7 audiences are enforced by the builder.

Example record:

```json
{"id":"fresh-relationships-chill-anyone-001","topic":"Relationships","mood":"Chill","audience":"Anyone","text":"What's a small gesture that makes you feel appreciated?","angles":["When did someone last do that for you?"]}
```

Run `npm run content:fresh:build`. The command refuses to produce a replacement file unless **all 798 combinations contain exactly 50 questions**, IDs and normalised question text are globally unique, and basic structural checks pass. It does not assert that automatically generated questions have passed human editorial review. The input file is intentionally not populated with repetitive synthetic templates.
