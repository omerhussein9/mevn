cd passport-frontend
npm install
npm run build

cp -r dist/* passport-project/public

cd passport-project
npm install
node app.js