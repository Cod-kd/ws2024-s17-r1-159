/* RUNS WHEN THE PAGE LOADED */
window.addEventListener("DOMContentLoaded", () => {
    setLocalStorage(); // if it is not exists yet
    fillTeamMemberTableWithDatas(); // load the local datas
    loadStageData(""); // get and load everyting from the URL

    // add round function to Number is prototype
    Number.prototype.round = function (places) {
        return +(Math.round(this + "e+" + places) + "e-" + places);
    }
});
/* ------------------ */


/* FUNCTIONS TO CREATE DOCUMENT OBJECTS */
function fillTeamMemberTableWithDatas() {
    const table = document.getElementById("teamMemeberTable");
    const runnersData = localRunnersDataToList();
    // add rows
    for (let c = 0; c < 10; c++) {
        let row = table.insertRow();
        row.innerHTML = `
                        <td>${c + 1}</td>
                        <td><input type="text" id="tr${c}_fName" placeholder="First name.." value="${runnersData[c].fName}"></td>
                        <td><input type="text" id="tr${c}_lName" placeholder="Last name.." value="${runnersData[c].lName}"></td>
                        <td><input type="text" id="tr${c}_speed" placeholder="MM:SS / km" value="${runnersData[c].speed == "" ? "" : toSpeed(runnersData[c].speed)}"></td>
                        <td id="tr${c}_distance">${localStorage.getItem("distances").split(",")[c]} km</td>
                        `;
        row.classList.add("teamMemeberTr");

        document.getElementById(`tr${c}_fName`).addEventListener("input", () => {
            setLocalRunner(c, "fName", document.getElementById(`tr${c}_fName`).value);
        });
        document.getElementById(`tr${c}_lName`).addEventListener("input", () => {
            setLocalRunner(c, "lName", document.getElementById(`tr${c}_lName`).value);
        });
        let speed = document.getElementById(`tr${c}_speed`);
        speed.addEventListener("input", () => {
            if (speed.value.length == 4 && /^-?\d+$/.test(speed.value)) { // length == 4 and the value is a digit
                if (parseInt(speed.value[2]) < 6) {
                    setLocalRunner(c, "speed", speed.value);
                    speed.value = toSpeed(speed.value);
                    loadStageData(""); 
                    /* reload stage assignment table if the speed typed too (the browser opimize this) it is the
                    best option now */
                }
            }
        });
    }
}

function fillStageTableWithDatas(dataList) {
    setRunnerIndexStageValues(dataList.length);
    const table = document.getElementById("stageAssignmentTable");
    const runnerIndexStageValues = JSON.parse(localStorage.getItem("runnerIndexStageValues")).stageValues;
    let runnerList = [];
    const runners = localRunnersDataToList();
    for (let i = 0; i < runners.length; i++) {
        if (runners[i].lName != "" && runners[i].fName != "" && runners[i].speed != "") {
            runnerList.push([i + 1, runners[i].lName + " " + runners[i].fName]);
        }
    }
    runnerList.sort((a, b) => (a[1] > b[1]) ? 1 : (a[1] < b[1]) ? -1 : 0);
    console.log(runnerList);
    // fill the table with data
    table.innerHTML = `
    <tr class="stageAssignmentTr">
        <th>Line number</th>
        <th>Distance</th>
        <th>Starting point</th>
        <th>Arriving point</th>
        <th>Name</th>
        <th>Runner</th>
        <th>Time</th>
    </tr>
    `;
    let j = 0;
    for (let datas of dataList) {
        let row = table.insertRow();
        row.innerHTML = `
                        <td>${datas.id}</td>
                        <td>${datas.distance} km</td>
                        <td>${datas.startingLocation}</td>
                        <td>${datas.arrivalLocation}</td>
                        <td>${datas.name == "" ? "---" : datas.name}</td>
                        <td>${chooseLocalRunner(runnerList, runnerIndexStageValues[j] === " " ? "" : getLocalRunner(runnerIndexStageValues[j], "fullName"))}</td>
                        <td id="tr${j}_time">${runnerIndexStageValues[j] === " " ? "MM:SS" : asTime(runnerIndexStageValues[j], datas.distance)}</td>
                        `;
        row.classList.add("stageAssignmentTr");

        // variables for the eventlistener
        let index = j;
        let distance = datas.distance;
        let input = document.getElementsByClassName("chooseRunnerInput")[j];
        input.addEventListener("input", () => {
            // update if the data is valid //
            for (let r of runnerList) {
                if (input.value == r[1]) {
                    updateRunnerIndexStageValue(index, distance, r[0] - 1);
                    updateDistance(r[0] - 1, distance, true);
                    document.getElementById(`tr${index}_time`).innerHTML = asTime(r[0] - 1, parseFloat(distance));
                }
            }
        });
        j++;
    }
}

function chooseLocalRunner(localRunners, value) {
    dataListHTML = `<input class="chooseRunnerInput" value="${value}" list="runners" placeholder="No runner...">
                    <datalist id="runners">`;
    for (let runner of localRunners) {
        dataListHTML += `<option value="${runner[1]}">`;
    }
    return dataListHTML + `</datalist>`;
}
/* ------------------ */


/* FUNCTIONS TO UPDATE */
function updateDistance(index, distance, add) {
    let distances = localStorage.getItem("distances").split(",");
    if (add) {
        distances[index] = (parseFloat(distances[index]) + parseFloat(distance)).round(1).toString();
    } else {
        distances[index] = (parseFloat(distances[index]) - parseFloat(distance)).round(1).toString();
    }
    document.getElementById(`tr${index}_distance`).innerHTML = distances[index] + " km";
    localStorage.setItem("distances", distances);
}

function updateRunnerIndexStageValue(neededIndex, distance, runnerIndex) {
    let listOfIndexes = JSON.parse(localStorage.getItem("runnerIndexStageValues")).stageValues;
    if (listOfIndexes[neededIndex] != " ") {
        updateDistance(listOfIndexes[neededIndex], distance, false);
    }
    listOfIndexes[neededIndex] = runnerIndex;
    localStorage.setItem("runnerIndexStageValues", JSON.stringify({ stageValues: listOfIndexes }));
}
/* ------------------ */


/* GETTERS */
function getLocalRunner(index, key) {
    let listOfRunners = localRunnersDataToList();
    switch (key) {
        case "fullName":
            return listOfRunners[index].lName + " " + listOfRunners[index].fName;
        case "fName":
            return listOfRunners[index].fName;
        case "lName":
            return listOfRunners[index].lName;
        case "speed":
            return listOfRunners[index].speed;
        default:
            console.error(`Key called "${key}" do not found.`);
    }
}
/* ------------------ */


/* SETTERS */
function setLocalStorage() {
    if (!localStorage.getItem("runnersDataAsString")) {
        localStorage.setItem("runnersDataAsString", `
        {
        "runners":
            [
                {"fName": "", "lName": "", "speed": ""},
                {"fName": "", "lName": "", "speed": ""},
                {"fName": "", "lName": "", "speed": ""},
                {"fName": "", "lName": "", "speed": ""},
                {"fName": "", "lName": "", "speed": ""},
                {"fName": "", "lName": "", "speed": ""},
                {"fName": "", "lName": "", "speed": ""},
                {"fName": "", "lName": "", "speed": ""},
                {"fName": "", "lName": "", "speed": ""},
                {"fName": "", "lName": "", "speed": ""}
            ]
        }
        `);
    }
    if (!localStorage.getItem("distances")) {
        localStorage.setItem("distances", "0,0,0,0,0,0,0,0,0,0");
    }
}

function setRunnerIndexStageValues(length) {
    if (!localStorage.getItem("runnerIndexStageValues")) {
        let listOfIndexes = [];
        for (let i = 0; i < length; i++) {
            listOfIndexes.push(" ");
        }
        localStorage.setItem("runnerIndexStageValues", JSON.stringify({ stageValues: listOfIndexes }));
    }
}

function setLocalRunner(index, key, value) {
    let listToUpdate = localRunnersDataToList();
    switch (key) {
        case "fName":
            listToUpdate[index].fName = value;
            break;
        case "lName":
            listToUpdate[index].lName = value;
            break;
        case "speed":
            listToUpdate[index].speed = value;
            break;
        default:
            console.error(`Key called "${key}" do not found.`);
    }
    localStorage.setItem("runnersDataAsString", listToLocalRunnersData(listToUpdate));
}
/* ------------------ */


/* FUNCTIONS TO CONVERT */
function asTime(runnerIndex, distance) {
    let speed = localRunnersDataToList()[runnerIndex].speed;
    let inSec = distance * parseFloat(speed.substring(0, 2)) * 60 + distance * parseFloat(speed.substring(2, 4));
    return ((Math.floor(inSec / 60)) < 10 ? '0' + (Math.floor(inSec / 60)).round(0).toString() : (Math.floor(inSec / 60)).toString()) + ':' + (inSec % 60 < 10 ? '0' + (inSec % 60).round(0).toString() : (inSec % 60).round(0).toString());
}

function localRunnersDataToList() {
    return JSON.parse(localStorage.getItem("runnersDataAsString")).runners;
}

function listToLocalRunnersData(runnersData) {
    localStorage.setItem("runnersDataAsString", JSON.stringify({ runners: runnersData }));
    console.log(localStorage.getItem("runnersDataAsString") + " stored");
    return localStorage.getItem("runnersDataAsString");
}

function toSpeed(fourDigits) {
    return fourDigits.slice(0, 2) + ":" + fourDigits.slice(2, 4) + " / km";
}
/* ------------------ */


/* FUNCTION WHAT CONNECTS TO THE API */
function getRouteData(url) {
    return new Promise((resolve, reject) => {
        fetch(url).then(res => {
            res.json().then(json => {
                resolve(json);
            }).catch(() => {
                reject("Can't convert to JSON!");
            });

        }).catch(err => {
            console.error(err);
            reject("The datas do not avaiable now!");
        });
    });
}

function loadStageData(stageID) {
    getRouteData("https://ub2023-backend.onrender.com/api/v1/stages/" + stageID).then(response => {
        fillStageTableWithDatas(response);
    }).catch(err => {
        console.log(err);
    });
}
/* ------------------ */