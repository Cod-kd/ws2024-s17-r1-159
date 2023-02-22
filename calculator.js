window.addEventListener("DOMContentLoaded", ()=>{
    loadRouteData(""); // get everyting
});

function loadRouteData(stageID){
    getRouteData("https://ub2023-backend.onrender.com/api/v1/stages/"+stageID).then(response=>{
        console.log(response)
        fillTableWithDatas(response);
    }).catch(err=>{
        console.log(err)
    })
}

function fillTableWithDatas(dataList){
    const table = document.getElementById("stageAssignmentTable");

    for(let datas of dataList){
        let row = table.insertRow();
        row.classList.add("stageAssignmentTr");
        for(let data in datas){
            let cell = row.insertCell();
            cell.innerHTML = `${datas[data]}`;
        }
    }
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