window.addEventListener("DOMContentLoaded", ()=>{
    const routeDatas = loadRouteData("");
    console.log(routeDatas)
});

function fillTableWithDatas(datas){

}

function loadRouteData(stageID){
    getRouteData("https://ub2023-backend.onrender.com/api/v1/stages/"+stageID).then(response=>{
        console.log(response)
    }).catch(err=>{
        console.log(err)
    })
}

function getRouteData(url){
    new Promise((resolve, reject)=>{
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