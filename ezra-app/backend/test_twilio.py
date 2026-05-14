#!/usr/bin/env python3
"""
Standalone Twilio SMS test script.

Usage:
  1. pip install twilio
  2. Set your credentials below or via env vars
  3. python test_twilio.py

This tests the Twilio connection and sends a test SMS
WITHOUT needing Django running.
"""
import os
import sys


def main():
    # Read from env vars or hardcode for testing
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID', '')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN', '')
    from_number = os.environ.get('TWILIO_FROM_NUMBER', '')

    if not account_sid or not auth_token:
        print("ERROR: Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN env vars")
        print("  export TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
        print("  export TWILIO_AUTH_TOKEN=your_auth_token_here")
        sys.exit(1)

    if not from_number:
        print("ERROR: Set TWILIO_FROM_NUMBER env var (your Twilio phone number)")
        print("  export TWILIO_FROM_NUMBER=+15551234567")
        sys.exit(1)

    try:
        from twilio.rest import Client
    except ImportError:
        print("ERROR: twilio package not installed. Run: pip install twilio")
        sys.exit(1)

    # Step 1: Test connection
    print(f"Connecting to Twilio with SID: {account_sid[:8]}...")
    try:
        client = Client(account_sid, auth_token)
        account = client.api.accounts(account_sid).fetch()
        print(f"  Account: {account.friendly_name}")
        print(f"  Status:  {account.status}")
        print("  Connection OK\n")
    except Exception as e:
        print(f"  Connection FAILED: {e}")
        sys.exit(1)

    # Step 2: Send test SMS
    to_number = input("Enter a phone number to send test SMS (E.164 format, e.g. +15551234567): ").strip()
    if not to_number:
        print("No number provided, skipping SMS send.")
        return

    test_message = "Hello from Ezra! This is a test SMS to verify Twilio integration is working."

    print(f"\nSending test SMS to {to_number}...")
    try:
        message = client.messages.create(
            body=test_message,
            from_=from_number,
            to=to_number,
        )
        print(f"  Message SID: {message.sid}")
        print(f"  Status:      {message.status}")
        print(f"  Price:       {message.price or 'pending'}")
        print("\n  SMS sent successfully!")
    except Exception as e:
        print(f"  Send FAILED: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
