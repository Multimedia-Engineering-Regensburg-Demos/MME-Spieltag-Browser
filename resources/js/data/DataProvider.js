/* eslint-env browser */

const API_URL_FOR_REQUESTING_ALL_MATCHES = "https://www.openligadb.de/api/getmatchdata/bl1/$SEASON",
    KEY_FOR_LOCAL_STORAGE = "MATCH_DATA",
    MAX_DATA_AGE_IN_MILLISECONDS = 3600000; // Eine Stunde in Millisekunden?

function storeDataInLocalStorage(matchData) {
    let record = {
        timestamp: Date.now(),
        data: matchData,
    };
    localStorage.setItem(KEY_FOR_LOCAL_STORAGE, JSON.stringify(record));
}

function loadDataFromLocalStorage() {
    let dataAsJSON = localStorage.getItem(KEY_FOR_LOCAL_STORAGE);
    if (dataAsJSON !== null) {
        return JSON.parse(dataAsJSON);
    }
    return undefined;
}

function isLocalDataStillValid() {
    let dataFromLocalStorage = loadDataFromLocalStorage(),
        dataAgeInMilliseconds;
    if (dataFromLocalStorage === undefined) {
        return false;
    }
    dataAgeInMilliseconds = Date.now() - dataFromLocalStorage.timestamp;
    if (dataAgeInMilliseconds >= MAX_DATA_AGE_IN_MILLISECONDS) {
        return false;
    }
    return true;
}

function requestMatchDataForCurrentSeason() {
    return new Promise(function(resolve, reject) {
        if (isLocalDataStillValid()) {
            console.log("Loading data from local storage");
            let data = loadDataFromLocalStorage();
            resolve(data.data);
            return;
        }
        console.log("Loading data from api server");
        // @TODO Aktuelle Saison dynamisch feststellen
        let url = API_URL_FOR_REQUESTING_ALL_MATCHES.replace("$SEASON", "2020");
        fetch(url).then(function(response) {
            return response.json();
        }).then(function(result) {
            storeDataInLocalStorage(result);
            resolve(result);
        });
    });
}

function getCleanedUpData(matchData) {
    let cleanedUpData = [];
    for (let i = 0; i < matchData.length; i++) {
        let currentMatch = matchData[i];
        cleanedUpData.push({
            matchDay: currentMatch.Group.GroupOrderID,
            matchDateTime: currentMatch.MatchDateTime,
            matchResult: currentMatch.MatchResults,
            clubs: [currentMatch.Team1, currentMatch.Team2],
        });
    }
    return cleanedUpData;
}

class DataProvider {

    // Gibt ein Promise zurück, das aufgelöst wird, wenn alle Informationen
    // zu allen Spielen der aktuellen Bundesligasaison vorhanden sind
    getData() {
        return new Promise(function(resolve, reject) {
            requestMatchDataForCurrentSeason().then(function(result) {
                let data = getCleanedUpData(result);
                resolve(data);
            });
        });
    }

}

export default DataProvider;