# :movie_camera: WatchWord
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fidrayv%2FWatchWord.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fidrayv%2FWatchWord?ref=badge_shield)


:zap: Angular project: ./angular  
:cloud: .Net core project: ./aspnet-core

# .Net Setup

00. Setup database connection string (MySql) in ./aspnet-core/src/WatchWord.Migrator/appsettings.json
01. Build & Run WatchWord.Migrator in order to migrate database
02. Build & Run WatchWord.Web.Host in order to run local API server

# Angular Setup

03. `cd ./angular`
04. `npm install` (Restore packages)
05. `npm run hmr` (Run with hot module reload)

# Deploy

06. `cd ./angular`
07. `npm run deploy`
08. Publish ./aspnet-core/src/WatchWord.Web.Host/ to Azure


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fidrayv%2FWatchWord.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fidrayv%2FWatchWord?ref=badge_large)