window.addEventListener("DOMContentLoaded", () => {
    setLocalStorage();
    fillTeamMemberTableWithDatas(); // load the local datas
    loadStageData(""); // get and load everyting from the URL
});

function fillTeamMemberTableWithDatas() {
    const table = document.getElementById("teamMemeberTable");
    const runnersData = localRunnersDataToList();

    // fill the table with data
    for (let c = 0; c < 10; c++) {
        let row = table.insertRow();
        row.innerHTML = `
                        <td>${c+1}</td>
                        <td><input type="text" id="tr${c}_fName" placeholder="First name.." value="${runnersData[c].fName}"></td>
                        <td><input type="text" id="tr${c}_lName" placeholder="Last name.." value="${runnersData[c].lName}"></td>
                        <td><input type="text" id="tr${c}_speed" placeholder="MM:SS / km" value="${runnersData[c].speed == "" ? "" : toSpeed(runnersData[c].speed)}"></td>
                        <td id="tr${c}_distance">${localStorage.getItem("distances").split(",")[c]} km</td>
                        `;
        row.classList.add("teamMemeberTr");

        document.getElementById(`tr${c}_fName`).addEventListener("input", ()=>{
            setLocalRunner(c, "fName", document.getElementById(`tr${c}_fName`).value);
        });
        document.getElementById(`tr${c}_lName`).addEventListener("input", ()=>{
            setLocalRunner(c, "lName", document.getElementById(`tr${c}_lName`).value);
        });
        document.getElementById(`tr${c}_speed`).addEventListener("input", ()=>{
            setLocalRunner(c, "speed", document.getElementById(`tr${c}_speed`).value);
        });
    }
}
function fillStageTableWithDatas(dataList) {
    const table = document.getElementById("stageAssignmentTable");
    let runnerList = [];
    let runners = localRunnersDataToList();
            for(let i = 0; i < runners.length; i++){
                if(runners[i].lName != "" && runners[i].fName != "" && runners[i].speed != ""){
                    runnerList.push([i + 1, runners[i].lName + " " + runners[i].fName]);
                }
            }
    runnerList.sort((a, b) => (a[1] > b[1]) ? 1 : (a[1] < b[1]) ? -1 : 0);
    console.log(runnerList)
    // fill the table with data
    let i = 0;
    for (let datas of dataList) {
        let row = table.insertRow();
        row.innerHTML = `
                        <td>${datas.id}</td>
                        <td>${datas.distance} km</td>
                        <td>${datas.startingLocation}</td>
                        <td>${datas.arrivalLocation}</td>
                        <td>${datas.name == "" ? "---" : datas.name}</td>
                        <td>${chooseLocalRunner(runnerList)}</td>
                        <td id="tr${i}_time">MM:SS</td>
                        `;
        row.classList.add("stageAssignmentTr");

        let input = document.getElementsByClassName("chooseRunnerInput")[i];
        input.addEventListener("input", ()=>{

            // update if the data is valid //
            for(let r of runnerList){
                if(input.value == r[1]){
                    let distances = localStorage.getItem("distances").split(",");
                    distances[r[0]-1] = (parseFloat(distances[r[0]-1]) + parseFloat(datas.distance)).toString();
                    document.getElementById(`tr${r[0]-1}_distance`).innerHTML = distances[r[0]-1] + " km";
                    localStorage.setItem("distances", distances);
                    document.getElementById(`tr${i}_time`).innerHTML = getTime(r[0]-1, parseFloat(datas.distance));
                    // save time
                }
            }
            
        });
        i++;
    }
}

function getTime(runnerIndex, distance){
    let speed = localRunnersDataToList()[runnerIndex].speed;
    let inSec = distance * parseFloat(speed.substring(0, 2)) * 60 + distance * parseFloat(speed.substring(2, 4));
    return (Math.floor(inSec / 60)).toString() + ':' + (inSec % 60).toString()
}

function loadStageData(stageID) {
    getRouteData("https://ub2023-backend.onrender.com/api/v1/stages/" + stageID).then(response => {
        console.log(response)
        fillStageTableWithDatas(response);
    }).catch(err => {
        console.log(err)
    })
}

function chooseLocalRunner(localRunners) {
    dataListHTML = `<input class="chooseRunnerInput" list="runners" placeholder="No runner...">
                    <datalist id="runners">`;
    for (let runner of localRunners) {
        dataListHTML += `<option value="${runner[1]}">`;
    }
    return dataListHTML + `</datalist>`;
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

/* FUNCTION TO SETTING UP THE localStorage IF IT IS NOT EXIST */
function setLocalStorage() {
    if (!localStorage.getItem("runnersDataAsString")) {
        localStorage.setItem("runnersDataAsString", `
        {
        "runners":
            [
                {"fName": "Jakab", "lName": "András", "speed": "1020"},
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
    if(!localStorage.getItem("distances")){
        localStorage.setItem("distances", "0,0,0,0,0,0,0,0,0,0");
    }
}

function localRunnersDataToList() {
    return JSON.parse(localStorage.getItem("runnersDataAsString")).runners;
}

function listToLocalRunnersData(runnersData) {
    localStorage.setItem("runnersDataAsString", `
    {
        "runners":
            ${JSON.stringify(runnersData)}
    }`);
    console.log(localStorage.getItem("runnersDataAsString") + " stored");
}

function toSpeed(fourDigits){
    return fourDigits.slice(0, 2) + ":" + fourDigits.slice(2, 4) + " / km"
}

function getRouteData(url) {
    return new Promise((resolve, reject) => {
        fetch(url).then(res => {
            res.json().then(json => {
                resolve(json)
            }).catch(() => {
                reject("Can't convert to JSON!")
            })

        }).catch(err => {
            console.error(err)
            reject("The datas do not avaiable now!")
        })
    });
}