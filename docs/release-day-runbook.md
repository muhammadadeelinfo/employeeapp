# Release Day Runbook (iOS)

Follow this sequence when your Apple membership is `Active`.

## 1) Preflight

```bash
npm run release:check
npm run health:ios-sim
npx eas whoami
npx eas project:info
```

Expected project:
- `@muhammadadeelinfo/shiftor-employee`
- `8e784b57-2e18-4286-9468-532d043fd407`

## 2) Build (App Store)

```bash
npx eas build --platform ios --profile production
```

Capture:
- Build ID
- Build URL

## 3) Submit

```bash
npx eas submit --platform ios
```

If prompted, select:
- Existing App Store Connect app for bundle ID `com.shiftor.employeeportal`

## 4) App Store Connect completion

- Assign uploaded build to app version.
- Complete:
  - App Information
  - App Privacy
  - App Previews and Screenshots
  - Description/subtitle/keywords
  - Export compliance answers
- Submit for review.

## 5) Post-submit checks

- Verify app status changes (`Waiting for Review` / `In Review`).
- Monitor crashes and backend errors after approval.
- Keep release notes and rollback plan ready.

