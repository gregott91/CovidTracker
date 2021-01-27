# CovidTracker

## Overview

This repository contains the static content deployed to https://gregott91.github.io/CovidTracker/index.html

The JSON data at [coviddata.json](coviddata.json) is pulled and formatted using Go. That code can be found here: https://github.com/gregott91/go-covidtracker

The GoLang executable is run hourly by an Azure function. The function code is .NET and can be found here: https://github.com/gregott91/covidtracker-azure

## Building

From the top level of the directory, run the following commands:

```javascript
npm install
npm run build
```

Then open the [index.html](index.html) file.