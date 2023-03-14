# Knox

Knox is a vault for your web2 passwords.

## Proposal

### The Problem

Everyone here basically agrees - the internet is broken, the megacorps are predators, Urbit solves this, etc. etc. What Urbit doesn't solve in the immediate term is the entrenchment of web2 services from which many of us are not yet able (whether ready or not) to eject. Some solutions tangential to this space have already been developed, most notably dcSpark's Urbit Visor. Waiting for the services we still rely on to adopt log in with Urbit may be a pipe dream, and their eventual extinction is not imminent enough. Many of us still need an email address and a password to log in to pay our utilities, and I'll speak for many more in saying we wish Urbit could handle this for us.

Enter Knox.

### The Purpose

Knox is a vault for your web2 passwords. With it running on one's ship, a user can generate strong passwords, easily cycle passwords, autofill login forms with the correct credentials, trivially grab an arbitrary password with a command, and manage all of this with an easy-to-use client interface. It does everything you expect a first class password manager (BitWarden, LastPass) to do, but it lives on your urbit.

As of this writing, the basic architecture for such an app is assumed to be 1) a Gall agent, 2) a browser interface, and 3) a chromium extension. I also intend to leverage the urbit visor/command launcher for some maximally convenient features, such as quick-grabbing an arbitrary password with a well-formed scry or quickly generating a password. Much of this functionality will be extended into the Knox extension as well.

Technical details/best practices for many aspects of this project will require some research. Most notable examples include best practice for storing passwords and for transferring passwords over http.

### Milestones

#### Milestone 1 - MVP

Through the web client, user can

- view all saved entries (website, username, password)
- generate a new password
- save a new entry
- edit an entry (change username/password)
- delete an entry

Through the command launcher, user can -

- generate a new password

#### Milestone 2 - Web Extension

Stand alone extension - brings all the functionality of client to extension

- Primary extension feature is auto-populating username/password fields if on known website

#### Other Features to Come -

- Export - easily get some report of all existing accounts/passwords. Good for having a physical backup, preparation for risky software/hardware tinkering, etc
- %docs integration