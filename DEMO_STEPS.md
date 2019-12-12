## Demo 

### Setup
- Setup the monogo ( two databases one for the Host and one for the Relaying Party) and add the environment variables .
- Run the 3 servers (no docker definition provided currently ).
- Generate a user profile using faker by calling the POST profile API.
- Register a host using the Dynamic Client Registration Protocol by calling the POST register API .
## Flow
- Open a user profile (the one we generated early) using the GET profile API followed by the user di.
- Press the add button to connect with a host.
- Login to the Host(Badgewell in this case) using the default `foo@example.com` with any password.
- Authorize the Relaying Party (Jobber in this case).
- Get redirected to your profile back the access token for badgewell should now be in Jobber database .

## Missing in the Flow
-  using the access token to get the assertions. 