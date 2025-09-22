# Auto-Rejection Feature

This feature automatically rejects job applications that have been in "applied" or "screening" status for 21 days or more.

## How It Works

1. **Daily Cron Job**: A scheduled task runs every day at 9:00 AM UTC via Vercel cron
2. **Status Check**: The system looks for applications with status "applied" or "screening" that are older than 21 days
3. **Auto-Rejection**: These applications are automatically updated to "rejected" status
4. **Activity Logging**: Each auto-rejection creates an activity event for tracking

## Files Added/Modified

### New Files

- `app/api/dashboard/applications/auto-reject/route.ts` - API endpoint for auto-rejection
- `scripts/auto-reject-applications.ts` - Standalone script for manual testing
- `vercel.json` - Vercel cron configuration
- `AUTO_REJECTION_FEATURE.md` - This documentation

### Modified Files

- `lib/db/queries.ts` - Added `autoRejectOldApplications()` function
- `app/dashboard/page.tsx` - Added manual test button
- `package.json` - Added `auto-reject` script command

## Usage

### Manual Testing

```bash
# Run the auto-rejection script manually
pnpm auto-reject

# Or via API (requires authentication)
curl -X POST http://localhost:3000/api/dashboard/applications/auto-reject
```

### Dashboard Testing

- Click the "Auto-Reject Old Apps" button in the Quick Actions section
- This will run the auto-rejection process and show results

### Production Deployment

- The feature runs automatically via Vercel cron at 9:00 AM UTC daily
- No manual intervention required

## Database Changes

The feature uses existing database tables:

- `job_applications` - Updates status from "applied"/"screening" to "rejected"
- `application_events` - Creates activity events for each auto-rejection

## Configuration

The 21-day threshold is hardcoded in the `autoRejectOldApplications()` function. To change it:

1. Update the date calculation in `lib/db/queries.ts`
2. Update the date calculation in `scripts/auto-reject-applications.ts`
3. Update the cron schedule in `vercel.json` if needed

## Monitoring

- Check the Vercel function logs for cron execution
- Activity events are created for each auto-rejection
- The dashboard shows updated application statuses immediately
