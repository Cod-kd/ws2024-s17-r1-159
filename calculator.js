window.addEventListener("DOMContentLoaded", () => {
    setLocalStorage();
    fillTeamMemberTableWithDatas(""); // load the local datas
    loadStageData(""); // get and load everyting from the URL
    //setLocalRunner(0, "fName", "Jani");
    console.log(localRunnersDataToList());
    listToLocalRunnersData([{ fName: "runnerDatas[0]", lName: "runnerDatas[1]", speed: "runnerDatas[2]" }, { fName: "runnerDatas[0]", lName: "runnerDatas[1]", speed: "runnerDatas[2]" }, { fName: "runnerDatas[0]", lName: "runnerDatas[1]", speed: "runnerDatas[2]" }]);
});

function fillTeamMemberTableWithDatas(dataList) {
    const table = document.getElementById("teamMemeberTable");

    // fill the table with data
    for (let c = 1; c <= 10; c++) {
        let row = table.insertRow();
        row.innerHTML = `
                        <td>${c}</td>
                        <td><input type="text" placeholder="First name.." value=""></td>
                        <td><input type="text" placeholder="Last name.." value=""></td>
                        <td><input type="text" placeholder="MM:SS / km" value=""></td>
                        <td>${0} km</td>
                        `;
        row.classList.add("teamMemeberTr");

    }
}
function fillStageTableWithDatas(dataList) {
    const table = document.getElementById("stageAssignmentTable");

    // fill the table with data
    for (let datas of dataList) {
        let row = table.insertRow();
        row.innerHTML = `
                        <td>${datas.id}</td>
                        <td>${datas.distance} km</td>
                        <td>${datas.startingLocation}</td>
                        <td>${datas.arrivalLocation}</td>
                        <td>${datas.name == "" ? "---" : datas.name}</td>
                        <td>${chooseLocalRunner(["j", "k", "l"])}</td>
                        <td>MM:SS</td>
                        `;
        row.classList.add("stageAssignmentTr");

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
    dataListHTML = `<input list="runners" placeholder="No runner...">
                    <datalist id="runners">`;
    for (let runner of localRunners) {
        dataListHTML += `<option value="${runner}">`;
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
    if (localStorage.runnersDataAsString) {
        localStorage.runnersDataAsString = "--;--;--;--;--;--;--;--;--;--";
        console.log(localStorage.runnersDataAsString);
    }
}

function localRunnersDataToList() {
    let runnersData = [];
    for (let item of localStorage.runnersDataAsString.split(";")) {
        console.log(item)
        let runnerDatas = item.split('-');
        runnersData.push({ fName: runnerDatas[0], lName: runnerDatas[1], speed: runnerDatas[2] });
    }
    return runnersData;
}

function listToLocalRunnersData(runnersData) {
    let runnersDataAsString = "";
    for (let runnerDatas of runnersData) {
        runnersDataAsString += runnerDatas.fName + '-'
            + runnerDatas.lName + '-' + runnerDatas.speed + ';';
    }
    localStorage.runnersDataAsString = runnersDataAsString.substring(0, runnersDataAsString.length - 1);
    console.log(localStorage.runnersDataAsString); ///ellen
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