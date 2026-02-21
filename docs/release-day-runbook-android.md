# Release Day Runbook (Android)

Follow this sequence for Google Play production release.

## 1) Preflight

```bash
npm run release:check
npm run health:android-emu
npx eas whoami
npx eas project:info
```

Expected project:
- `@muhammadadeelinfo/shiftor-employee`
- `8e784b57-2e18-4286-9468-532d043fd407`

## 2) Build (Play Store)

```bash
npx eas build --platform android --profile production
```

Capture:
- Build ID
- Build URL

## 3) Submit

```bash
npx eas submit --platform android
```

If prompted, select:
- Existing Play Console app for package `com.shiftor.employee`

## 4) Play Console completion

- Create release in Production track.
- Attach the uploaded artifact.
- Complete release notes.
- Confirm Data safety and App content forms are complete.
- Roll out the release.

## 5) Post-submit checks

- Verify release status moves through `In review` to `Available`.
- Monitor crashes and backend errors after rollout.
