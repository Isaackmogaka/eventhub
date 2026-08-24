# IntaSend Integration Notes

## SDK initialization
Third argument to `new IntaSend(pubKey, secretKey, testMode)`: true = sandbox, false = live.
Getting this backwards causes silent 401 errors against the wrong environment.

## Webhook event types
Distinguished by payload shape, not a single topic field:
- Collection events: have invoice_id, api_ref
- Send Money events: have tracking_id, transactions array
