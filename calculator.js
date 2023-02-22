window.addEventListener("DOMContentLoaded", ()=>{
    fillTeamMemberTableWithDatas("")
    loadStageData(""); // get everyting from the API

});

function fillTeamMemberTableWithDatas(dataList){
    const table = document.getElementById("teamMemeberTable");

    // fill the table with data
    for(let c = 1; c <= 10; c++){
        let row = table.insertRow();
        row.innerHTML = `
                        <td>${c}</td>
                        <td><input type="text" placeholder="First name.."></td>
                        <td><input type="text" placeholder="Last name.."></td>
                        <td><input type="text" placeholder="MM:SS / km"></td>
                        <td>${0} km</td>
                        `;
        row.classList.add("teamMemeberTr");
                        
    }
}
function fillStageTableWithDatas(dataList){
    const table = document.getElementById("stageAssignmentTable");

    // fill the table with data
    for(let datas of dataList){
        let row = table.insertRow();
        row.innerHTML = `
                        <td>${datas.id}</td>
                        <td>${datas.distance} km</td>
                        <td>${datas.startingLocation}</td>
                        <td>${datas.arrivalLocation}</td>
                        <td>${datas.name == ""? "---" : datas.name}</td>
                        <td>${chooseLocalRunner(["j", "k", "l"])}</td>
                        <td>MM:SS</td>
                        `;
        row.classList.add("stageAssignmentTr");
                        
    }
}

function loadStageData(stageID){
    getRouteData("https://ub2023-backend.onrender.com/api/v1/stages/"+stageID).then(response=>{
        console.log(response)
        fillStageTableWithDatas(response);
    }).catch(err=>{
        console.log(err)
    })
}

function chooseLocalRunner(localRunners){
    dataListHTML = `<input list="runners" placeholder="No runner...">
                    <datalist id="runners">`;
    for(let runner of localRunners){
        dataListHTML += `<option value="${runner}">`;
    }
    return dataListHTML + `</datalist>`;
}

function getRouteData(url){
    return new Promise((resolve, reject)=>{
        fetch(url).then(res=>{
            res.json().then(json=>{
                resolve(json)
            }).catch(()=>{
                reject("Can't convert to JSON!")
            })

        }).catch(err=>{
            console.error(err)
            reject("The datas do not avaiable now!")
        })
    });
}