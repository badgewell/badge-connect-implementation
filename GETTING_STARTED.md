## Getting started

- Rename all .env.example to .env to use the enviroment variables needed.
- Change whatever configuration in the .env file to fit your running machine.
- In each of client , host and oauth application, run 'npm install'
- Run these commands respectively in client and ouath folder path: 
	- npm run build
	- npm run copy-static-assets
	- npm run start
- Run these commands respectively in 'host' folder path: 
		- npm run build
		- npm run start
- use /POST 'http://localhost:9000/register?url=http://localhost:4000/.well-known/badgeconnect.json'
- use /POST 'http://localhost:9000/profile' and take the id from the response json to use it in the next step.
- use /GET 'http://localhost:9000/profile/:id' in the browser , select from the dropdown list and click add.
- use 'foo@example' and any password as email and password required, then follow the flow shown.