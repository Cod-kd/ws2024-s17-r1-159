window.addEventListener("DOMContentLoaded", () => {
    setLocalStorage();
    fillTeamMemberTableWithDatas(); // load the local datas
    loadStageData(""); // get and load everyting from the URL

    setLocalRunner(1, "lName", "Jani");
    //setLocalRunner(1, "fNam", "Fürge");
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
    /* ideiglenes */
    let runnerList = [[1, "Balu"], [2, "Zsigmond"], [3, "Aladár"]];
    /*let runners = localRunnersDataToList();
            for(let i = 0; i < runners.length; i++){
                runnerList.push([i + 1, runners[i].lName + " " + runners[i].fName]);
            }*/
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
                        <td>MM:SS</td>
                        `;
        row.classList.add("stageAssignmentTr");

        let input = document.getElementsByClassName("chooseRunnerInput")[i];
        input.addEventListener("input", ()=>{

            // update if the data is valid //
            for(let r of runnerList){
                if(input.value == r[1]){
                    let distances = localStorage.getItem("distances").split(",");
                    distances[r[0]] = (parseFloat(distances[r[0]]) + parseFloat(datas.distance)).toString();
                    console.log(distances);
                    document.getElementById(`tr${i}_distance`).innerHTML = distances[r[0]-1];
                    localStorage.setItem("distances", distances);
                }
            }
            
        });
        i++;
    }
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
    localStorage.runnersDataAsString = listToLocalRunnersData(listToUpdate);
}

/* FUNCTION TO SET EMPTY THE localStorage.runnersDataAsString IF IT IS NOT EXIST */
function setLocalStorage() {
    if (localStorage.runnersDataAsString) { // az ellenorzes miatt kiszedtem a tagadast!!!
        localStorage.runnersDataAsString = "Jakab-András-1020;--;--;--;--;--;--;--;--;--";
        console.log(localStorage.runnersDataAsString);
    }
    if(!localStorage.getItem("distances")){
        localStorage.setItem("distances", "0,0,0,0,0,0,0,0,0,0");
    }
}

function localRunnersDataToList() {
    let runnersData = [];
    for (let item of localStorage.runnersDataAsString.split(";")) { ///// UNDEFINED
        console.log(item)
        let runnerDatas = item.split('-');
        runnersData.push({ fName: runnerDatas[0], lName: runnerDatas[1], speed: runnerDatas[2] });
    }
    console.log(runnersData)
    return runnersData;
}

function listToLocalRunnersData(runnersData) {
    let runnersDataAsString = "";
    for (let runnerDatas of runnersData) {
        runnersDataAsString += runnerDatas.fName + '-'
            + runnerDatas.lName + '-' + runnerDatas.speed + ';';
    }
    localStorage.runnersDataAsString = runnersDataAsString.substring(0, runnersDataAsString.length - 1);
    console.log(localStorage.runnersDataAsString + " stored");
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