# Production deployment readiness checklist

This checklist is intentionally operational: it contains variable names and validation steps only, never secret values.

## Render services

### Backend: `pradhan-backend`
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health path currently configured in Render Blueprint: `/health`
- Confirm the service is using Node 20 or newer.
- Confirm the required `MONGODB_URI` and `JWT_SECRET` are configured in Render's protected Environment settings.
- Confirm MongoDB Atlas network access allows the Render service to connect.
- Optional integrations should be enabled only after their credentials and callbacks have been tested: Razorpay, Cloudinary, SMTP, SMS.

### Frontend: `pradhan-frontend`
- Root directory: `frontend`
- Build command: `npm install --include=dev && npm run build`
- Start command: `npm start`
- Confirm `NEXT_PUBLIC_SITE_URL` points to the production frontend.
- Confirm `NEXT_PUBLIC_API_URL` points to the production backend API.

## Release verification

1. Run the GitHub Actions CI workflow on the proposed commit; require both backend authorization tests and the frontend production build to pass.
2. Confirm the backend health JSON reports database status `connected` and `isConfigured: true`; do not treat an HTTP 200 alone as proof of database readiness.
3. Verify public pages: homepage, services list/detail, vacancies, offline forms, contact, login and registration.
4. Verify authenticated customer and admin flows using designated test accounts; never use real customer records for test transactions.
5. Test payment creation and webhook signature verification only in provider test mode. Do not initiate live payments as part of deployment checks.
6. Test password-reset email only with a controlled test account and confirm links return to the configured frontend.
7. Check browser console/network failures, CORS, 404s, missing assets and mobile layout.
8. Review Render deployment logs and confirm the deployed commit SHA matches the approved PR merge commit.

## Security/release guardrails

- Keep GitHub Actions permissions least-privilege; CI should not push generated files to `main`.
- Keep production secrets exclusively in Render protected environment settings. Never commit `.env` files, credentials, OTPs, reset tokens or customer data.
- Keep OTP login disabled until a real SMS provider delivery and abuse controls are configured and tested.
- Do not enable payment collection until the fulfilment workflow, payment verification and webhook signature checks are confirmed end-to-end.
- Review changes through a pull request; do not deploy an unverified branch directly to production.

## Current known limitations

- Live Render frontend/backend checks were not verifiable from the monitoring environment at the time of this audit because DNS resolution failed.
- A successful historical CI run does not prove that the current production deployment is healthy.
- This checklist does not certify payment, SMTP, SMS, database or user journeys; those require live controlled tests after the services are reachable.
