/* eslint-env browser */

import DataProvider from "./data/DataProvider.js";

/**
 * Hinweise zur Nutzung der openligadb-API
 * 
 * Zugriff auf einzelne Spieltage der Bundesliga
 * URL: https://www.openligadb.de/api/getmatchdata/bl1/SAISON/SPIELTAG
 * Beispiel: https://www.openligadb.de/api/getmatchdata/bl1/2020/34
 * 
 * Zugriff auf alle Spiele der Bundesliga
 * URL: https://www.openligadb.de/api/getmatchdata/bl1/SAISON
 * Beispiel: https://www.openligadb.de/api/getmatchdata/bl1/2020
 * 
 * Achtung: Die Daten werden von einem Community-Projekt gepflegt und kostenfrei bereitgestellt. Das
 * sollten wir bei der Nutzung der API berücksichtigen und z.B. möglichst sparsam mit den Anfragen
 * an den Server umgehen. Gerade bei Daten, die sich nur innerhalb bestimmter Zeiträume ändern 
 * sollten, unabhängig vom Antwortverhalten des Servers, lokale Caches verwendet werden. Die hier
 * verwendeten Daten, werden sich bis zum nächsten (letzten) Spieltag nicht ändern.
 */

function init() {
    console.log("Starting Spieltag-Browser");
    let dataProvider = new DataProvider();
    dataProvider.getData().then(function(result) {
        console.log(result);
    });
}

init();