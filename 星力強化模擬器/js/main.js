
window.onload = () =>{

    const {createApp, ref, reactive, computed, watch, onMounted , onUpdated} = Vue
    const App = {

        setup(){
            let running = false
            const numPriceChinese = (num)=>{
                const n = num + "";
                const length = n.length
                const numArr = n.split("").reverse();
              
                //  t4 c3 t3 c2 t2 c1 t1 -> xxxx 兆 xxxx 億 xxxx 萬 xxxx
                let Render = [];
                let t1 = []
                let t2 = []
                let t3 = []
                let t4 = []
              
                let c1 = []
                let c2 = []
                let c3 = []
                if(length >= 5){
                    c1.push("萬")
                }
                if(length >= 9){
                    c2.push("億")
                }
                if(length >= 13){
                    c3.push("兆")
                }
                let i = 0;
                numArr.forEach((item) => {
                    i++;
                    if(i >= 1 &  i <= 4){
                        t1.push(item)
                    }
                    if(i >= 5 &  i <= 8){
                        t2.push(item)
                    }
                    if(i >= 9 &  i <= 15){
                        t3.push(item)
                    }
                    if(i >= 13 &  i <= 16){
                        t4.push(item)
                    }
                });
                if( t1.join("") === "0000" & length >= 5 ){
                    t1 = []
                }
                if(t2.join("") === "0000" & length >= 9){
                    t2 = []
                }
                if(t3.join("") === "0000" & length >= 13){
                    t3 = []
                }
                Render= [...t1 , ...c1 , ...t2 , ...c2 , ...t3 , ...c3 , ...t4]
                Render.reverse()
                Render = Render.join("").replace("億萬","億").replace("兆億","兆")
                return Render
            }              
            // 楓幣台幣 input限制
            const NTDtransMaplecoin = ref(720)
            const MaplecointransPoint = ref(15)
            const equipcost = ref(0)
            const equipcostCh = computed(()=>numPriceChinese(equipcost.value))
            
            const starcost = ref(0)
            const starcostCh = computed(()=>numPriceChinese(starcost.value))
            const InputNumOnly = (el)=>{
                
                if(el.target.value.slice(0,1) === '0'){
                    el.target.value = '' 
                    return
                }
                el.target.value = el.target.value.replace(/[^0-9]/g, "");
               
            }
            // 星力上升 下降 破壞的機率
            const starRate = reactive({data:[
                {idx:12, failed: 0.6 ,success: 0.4 ,destroyed: 0, drop:false },
                {idx:13, failed: 0.65 ,success: 0.35 ,destroyed: 0, drop:false },
                {idx:14, failed: 0.7 ,success: 0.3 ,destroyed: 0, drop:false },
                {idx:15, failed: 0.595 ,success: 0.3 ,destroyed: 0.105, drop:false },
                {idx:16, failed: 0.56 ,success: 0.3 ,destroyed: 0.14, drop:true },
                {idx:17, failed: 0.49 ,success: 0.3 ,destroyed: 0.21, drop:true },
                {idx:18, failed: 0.42 ,success: 0.3 ,destroyed: 0.28, drop:true },
                {idx:19, failed: 0.42 ,success: 0.3 ,destroyed: 0.28, drop:true },
                {idx:20, failed: 0.35 ,success: 0.3 ,destroyed: 0.35, drop:false },
                {idx:21, failed: 0.35 ,success: 0.3 ,destroyed: 0.35, drop:true },
                {idx:22, failed: 0.388 ,success: 0.03 ,destroyed: 0.582, drop:true },
                {idx:23, failed: 0.392 ,success: 0.02 ,destroyed: 0.588, drop:true },
                {idx:24, failed: 0.396 ,success: 0.01 ,destroyed: 0.594, drop:true },
            ]})            

            // 裝備、策略選擇
            const equipSelected = ref("請選擇")
            const strategySelected = ref({key:"請選擇",idx:-1})
            const strategyListBool = ref(false)
            const strategyNoDestory = () =>{
                strategySelected.value.key = "皆使用50楓點去執行";
                strategySelected.value.idx = 6;
                equipcost.value = 0;                
            }
            // 偷20裝備清單
            const equipList = reactive({data:[
                {key:"請選擇",act: true},
                {key:"必防爆的裝備",act: false},
                {key:"神秘武器類",act: false},
                {key:"神秘防具類",act: false},
                {key:"航海防具類",act: false},
                {key:"波賽頓飾品",act: false},
                {key:"強力魔性戒指",act: false},
                {key:"魔性戒指",act: false},
                {key:"頂培系列",act: false},
              
            ]})
            // 策略清單
            const strategyData = reactive({data:[
                {use: [20,23,24,25], idx:-1, key:"請選擇",act: true, starcost: false, FailedStart: 15},
                {use: [0], idx:0, key:"每炸裝，皆12星開始點楓幣、楓點", noDestroyed: false,  FailedStart: 12, costPoint: 9, act: true, starcost: false},
                {use: [0], idx:1, key:"每炸裝，皆先丟14星捲，隨後都丟9楓點", noDestroyed: false,  FailedStart: 14, costPoint: 9, act:false, starcost: false},
                {use: [20], idx:2, key:"每炸裝，皆先丟15星捲，隨後都丟9楓點", noDestroyed: false,  FailedStart: 15, costPoint: 9, act:false, starcost: true},
                {use: [20], idx:3, key:"每炸裝，皆先丟16星捲，隨後都丟9楓點", noDestroyed: false,  FailedStart: 16, costPoint: 9, act:false, starcost: true},
                {use: [20], idx:4, key:"每炸裝，皆先丟17星捲，隨後都丟9楓點", noDestroyed: false,  FailedStart: 17, costPoint: 9, act:false, starcost: true},
                {use: [20], idx:5, key:"每炸裝，皆先丟18星捲，隨後都丟9楓點", noDestroyed: false,  FailedStart: 18, costPoint: 9, act:false, starcost: true},
                {use: [20,22,23,24,25], idx:6, key:"皆使用50楓點去執行", noDestroyed: true, costPoint: 50, act:false, starcost: false},
                {use: [23,24,25], idx:7, key:"皆使用追加/突破1星 30%去執行", noDestroyed: true, act:false, starcost: false},
                {use: [23,24,25], idx:8, key:"皆使用追加/突破1星 50%去執行", noDestroyed: true, act:false, starcost: false},
            ]})            
            const equipListBool = ref(false)
            const handequipSelected = (el)=>{
                if(strategyListBool.value) return
                if(running) return
                if(!equipListBool.value) return  equipListBool.value = true;
                equipList.data = equipList.data.map(item=>{
                   if(el.currentTarget.innerText === item.key){
                    equipSelected.value = item.key;
                    if(equipSelected.value === "必防爆的裝備"){
                        strategyNoDestory()
                    }
                    return {key:item.key,act: true}
                   }else{
                    return {key:item.key,act: false}
                   }
                   
                })
                equipListBool.value = false
                
            }
            const strategyRender = computed(()=>{
                let Filt = [];
                if(equipSelected.value === "必防爆的裝備"){
                    Filt.push({key:"皆使用50楓點去執行" , act: true})
                }else{
                    Filt = strategyData.data.filter(item=>{
                        if(item.use.indexOf(starAim.value) !== -1){
                            return {key:item.key , act: item.act , FailedStart: item.FailedStart , starcost: item.starcost}
                        }
                    })

                }
                return Filt

            })
            const handstrategy = (el)=>{
                if(running) return
                if(equipSelected.value === "必防爆的裝備" || equipListBool.value || starAim.value === 22) return

                if (!strategyListBool.value) return strategyListBool.value = true;
                
                strategyRender.value = strategyRender.value.map(item=>{
                   if(el.currentTarget.innerText === item.key){
                    strategySelected.value.key = item.key;
                    strategySelected.value.idx = item.idx
                    strategySelected.value.FailedStart = item.FailedStart
                    strategySelected.value.starcost = item.starcost
                    return {key:item.key,act: true}
                   }else{
                    return {key:item.key,act: false}
                   }
                   
                })
                strategyListBool.value = false
            }            
            // 目標星力
            const starAim = ref(20)
            const starBegin = ref(15)
            const nowStarRender = ref(15)
            const starAim23up = ref(false)
            handstarAim = (el = null)=>{
                if(running) return
                costStoreClear()
                if(el === null){
                    return
                }                
                starAim.value = Number(el.currentTarget.dataset.aim);
                // console.log(starAim.value);
                if(starAim.value === 20){
                    starBegin.value = 15;
                    starAim23up.value = false
                    return
                }
                if(starAim.value === 22){
                    strategyNoDestory()                    
                    starBegin.value = 20;
                    starAim23up.value = false
                    return
                }else{
                    starBegin.value = 22;
                    starAim23up.value = true
                }                

            }
            // 衝22以上的裝備數
            const equipItem = ref(1)

            
            const handstarBegin = (el = null) =>{
                if(running) return
                if(el === null) return
                starBegin.value = Number(el.currentTarget.dataset.begin);
                nowStarRender.value =  Number(el.currentTarget.dataset.begin);
                // console.log("一開始星力:",starBegin.value);
            }            
            const activtyStarBtn = ref(true)
            const checkAlertBool = reactive({data:[
                {idx:0 , key:"台幣轉楓幣", act:false},
                {idx:1 , key:"楓幣轉楓點", act:false},
                {idx:2 , key:"裝備項目", act:false},
                {idx:3 , key:"策略", act:false},
                {idx:4 , key:"炸裝成本", act:false},
                {idx:5 , key:"星卷成本", act:false},
            ]}

                )

            const checkList = (aim) =>{
                // 若 i === 0  才OK
                let i  = 0

                checkAlertBool.data = checkAlertBool.data.map(item=>{
                    item.act = false
                    return item
                })
                console.log(checkAlertBool.data);



                // 此檢查20星選項清單
                if(aim === 20){
                    if(Number(NTDtransMaplecoin.value) === 0 || NTDtransMaplecoin.value === ''){
                        checkAlertBool.data[0].act =  true;
                        i++;
                    }
                    if(Number(MaplecointransPoint.value) === 0 || MaplecointransPoint.value === ''){
                        checkAlertBool.data[1].act =  true;
                        i++;
                    }
                    if(equipSelected.value === "請選擇"){
                        checkAlertBool.data[2].act =  true;
                        
                        i++;
                    }
                    if(strategySelected.value.key === "請選擇"){
                        checkAlertBool.data[3].act =  true;
                        i++;
                    }
                    if(equipcost.value === ''){
                        checkAlertBool.data[4].act =  true;
                        i++;
                    }
                    if(starcost.value === ''){
                        checkAlertBool.data[5].act =  true;
                        i++;
                    }
    
                }
                // 此檢查20星選項清單
                if(aim === 22){
                    if(Number(NTDtransMaplecoin.value) === 0 || NTDtransMaplecoin.value === ''){
                        checkAlertBool.data[0].act =  true;
                        i++;
                    }
                    if(Number(MaplecointransPoint.value) === 0 || MaplecointransPoint.value === ''){
                        checkAlertBool.data[1].act =  true;
                        i++;
                    }
                    // if(equipSelected.value === "請選擇"){
                    //     checkAlertBool.data[2].act =  true;
                        
                    //     i++;
                    // }
                    // if(strategySelected.value.key === "請選擇"){
                    //     checkAlertBool.data[3].act =  true;
                    //     i++;
                    // }
                    // if(equipcost.value === ''){
                    //     checkAlertBool.data[4].act =  true;
                    //     i++;
                    // }
                    // if(starcost.value === ''){
                    //     checkAlertBool.data[5].act =  true;
                    //     i++;
                    // }
    
                }
               

                return i

       
            }

            const costStore = reactive({data:[]})


            // 演算區
            let i = 0
            let timer = null
            let dice = 0;
            let sucT = 0;
            let failedT = 0;
            let desT = 0;
            let createT = 0
            const desTime = ref(0)
            const recoverMaplecoinCost = ref(0)
            const recoverMaplecoinCostCh = ref(0)
           
            const NTDcost = ref(0)
            // 若連續失敗2次 下次一定成功 
            let chanceTime = 0   
           

            const pointCost = ref(0)
            
            const directResultBtnShow = ref(false)
            const handStarResult = ()=>{
                if(checkList(starAim.value) !== 0){
                    return
                }
                starAnimeRun()
                directResultBtnShow.value = true
                
            }       
            const ClearComputeData = () =>{
                i = 0
                desT = 0       
                chanceTime = 0        
                desTime.value = 0  
                pointCost.value = 0     
                recoverMaplecoinCost.value = 0                    
                recoverMaplecoinCostCh.value = 0     
                NTDcost.value = 0
                     
            }     
            const costStoreClear = ()=>{
                clearInterval(timer)
                directResultBtnShow.value = false
                running = false
                costStore.data = []
                createT = 0
                ClearComputeData()
                

            }            
            const starAnimeRun = () =>{
                createT++;
                ClearComputeData()
                let aim = starAim.value
                let nowStar = starBegin.value
                nowStarRender.value = nowStar
                let strategy = strategyData.data.filter(item=>{
                    return item.idx === strategySelected.value.idx
                })                 
                if(running) return
                running = true
                timer = setInterval(()=>{
                    if(aim === nowStar){
                        clearInterval(timer)
                        console.log('目標達成');
                        NTDcost.value =( ( (pointCost.value / MaplecointransPoint.value) * 100000000 + recoverMaplecoinCost.value ) / (NTDtransMaplecoin.value * 10000) ).toFixed(0)
                        costStore.data.push({idx: createT, Resultshow:false, NTDcost: NTDcost.value , desTime: desTime.value , pointCost: pointCost.value , recoverMaplecoinCostCh: recoverMaplecoinCostCh.value})                        
                        console.log(costStore.data);         
                        setTimeout(Msgscrolldown,10)               
                        running = false
                        directResultBtnShow.value = false




                        ClearComputeData()
                        return
                    }
                    if(i === 1000){
                        clearInterval(timer)
                        console.log('目標未達成');
                        running = false
                        directResultBtnShow.value = false
                        ClearComputeData()
                        return
                    }   
                    i++;
                    pointCost.value = i * strategy[0].costPoint;
                    // 執行時 套用的機率
                    let rate = starRate.data.filter(item=>{
                        return item.idx === nowStar;
                    })


                   
                dice = Number((Math.random() * 1).toFixed(3))  
                console.log(dice);

                // activtysuccess
                if(activtyStarBtn.value && nowStar===15){
                    console.log("套用活動100%");
                    chanceTime = 0
                    sucT++;
                    nowStar++;
                    nowStarRender.value = nowStar
                    handStarEffect('success')
                    return
                    
                }

                // chance success
                if(chanceTime == 2){
      
                    console.log("套用chance");
                    chanceTime = 0
                    sucT++;
                    nowStar++;
                    nowStarRender.value = nowStar
                    handStarEffect('success')
                    return
                    
                }  
                // success
                if(dice <= rate[0].success){
                    sucT++;
                    nowStar++;
                    nowStarRender.value = nowStar
                    chanceTime = 0
                    // console.log("up");
                    handStarEffect('success')
                    return
                }
                // destroyed
                if(dice <= Number(rate[0].success+rate[0].destroyed).toFixed(3)){
                    if(strategy[0].noDestroyed){
                        console.log("套用防爆");
                        failedT++;
                        chanceTime++;
                        nowStar--;
                        nowStarRender.value = nowStar
                        handStarEffect('failed')
                        return
                    }                    
                    desT++;
                    nowStar = strategy[0].FailedStart;
                    recoverMaplecoinCost.value = Number( equipcost.value * desT ) + Number(starcost.value * desT )
                    recoverMaplecoinCostCh.value = numPriceChinese(recoverMaplecoinCost.value)
                    desTime.value = desT                                        
                    nowStarRender.value = nowStar
                    chanceTime = 0
                    handStarEffect('destroyed')
                    return
                    
                }
                // failed
                if(rate[0].drop){
                    failedT++;
                    chanceTime++;
                    nowStar--;
                    nowStarRender.value = nowStar
                    handStarEffect('failed')
                    
                }else{
                    failedT++;
                    chanceTime++;
                    handStarEffect('failed')
                    return

                }      
                },1800)
            }            

            const directResult = () =>{
                clearInterval(timer)
                let nowStar = nowStarRender.value
                let aim = starAim.value
                let strategy = strategyData.data.filter(item=>{
                    return item.idx === strategySelected.value.idx
                })                 
                while (nowStar !== aim) {
                    i++;
                    pointCost.value = i * strategy[0].costPoint;
                    // console.log("執行第",i,"次");
                    if(i === 1000){
                        console.log(("目標未達成"));
                        break;
                    }

                    // 每次執行時 套用的機率
                    let rate = starRate.data.filter(item=>{
                        return item.idx === nowStar;
                    })
                   
                dice = Number((Math.random() * 1).toFixed(3))

                // activtysuccess
                if(activtyStarBtn.value && nowStar ===15){
                    console.log("套用活動100%");
                    chanceTime = 0
                    sucT++;
                    nowStar++;
                    nowStarRender.value = nowStar
                    continue;
                }

                // chance success
                if(chanceTime == 2){
      
                    // console.log("套用chance");
                    chanceTime = 0
                    sucT++;
                    nowStar++;
                    nowStarRender.value = nowStar
                    continue;
                }
                // success
                if(dice <= rate[0].success){
                    sucT++;
                    nowStar++;
                    nowStarRender.value = nowStar
                    chanceTime = 0
                    // console.log("up");
                    
                    continue;
                }
                // destroyed
                if(dice <= Number(rate[0].success+rate[0].destroyed).toFixed(2)){
                    if(strategy[0].noDestroyed){
                        console.log("套用防爆");
                        failedT++;
                        chanceTime++;
                        nowStar--;
                        nowStarRender.value = nowStar       
                        continue;                 
                    }                    
                    desT++;
                    recoverMaplecoinCost.value = Number( equipcost.value * desT ) + Number(starcost.value * desT )
                    recoverMaplecoinCostCh.value = numPriceChinese(recoverMaplecoinCost.value)
                    desTime.value = desT
                    nowStar = strategy[0].FailedStart;
                    nowStarRender.value = nowStar
                    // console.log("des");
                    chanceTime = 0
                    continue;
                }
                // failed
                if(rate[0].drop){
                    failedT++;
                    chanceTime++;
                    nowStar--;
                    nowStarRender.value = nowStar
                    // console.log("down");
                }else{
                    failedT++;
                    chanceTime++;
                    console.log("keep");

                }                      
     
            
                }
                if(nowStar === aim){
                  
                    console.log('目標達成');
                    // (總楓幣->台幣)
                    NTDcost.value =( ( (pointCost.value / MaplecointransPoint.value) * 100000000 + recoverMaplecoinCost.value ) / (NTDtransMaplecoin.value * 10000) ).toFixed(0)
                    costStore.data.push({idx: createT, Resultshow:false, NTDcost: NTDcost.value , desTime: desTime.value , pointCost: pointCost.value , recoverMaplecoinCostCh: recoverMaplecoinCostCh.value})                        
                    console.log(costStore.data);

                    
                    setTimeout(Msgscrolldown,10)
                    running = false
                    directResultBtnShow.value = false
                    ClearComputeData()
                }
            }      

            const Msgscrolldown = ()=>{
                let txtscroll = document.getElementById("txtscroll")
                txtscroll.scrollTop = txtscroll.scrollHeight
            }


            // starEffect
            const StarEffectData = reactive({data:[
                {key:'success',urlw:'./img/suc01.png',url:'./img/suc02.png'},
                {key:'failed',urlw:'./img/fail01.png',url:'./img/fail02.png'},
                {key:'destroyed',urlw:'./img/des01.png',url:'./img/des02.png'}
            ]})
            const StarEffectRender = reactive({is:[]})
            const effectbool = ref(false)
            const successEffect = ref(false)
            const handStarEffect = (el)=>{

                // if(effectbool.value) return
                
                // let effect = el.currentTarget.dataset.effect
                let effect = el
                StarEffectRender.is = StarEffectData.data.filter(item=>{
                    if(item.key === effect) return {urlw:item.urlw , url:item.url};
                })

                if(effect === 'success'){
                    successEffect.value = true;
                }

                // console.log(StarEffectRender.is[0]);

      
                effectbool.value = true
                setTimeout(()=>{
                    effectbool.value = false
                    successEffect.value = false;
                },1500)

            }

            onMounted(()=>{
                handstarAim()
                handstarBegin()
            })

           
            return{
                // 楓幣台幣 input限制
                NTDtransMaplecoin,
                MaplecointransPoint,
                equipcost,
                equipcostCh,
                starcost,
                starcostCh,
                InputNumOnly,
                // 裝備選擇
                equipSelected,
                equipList,
                handequipSelected,
                equipListBool,
                // strategyData
                strategyListBool,
                strategySelected, 
                strategyRender,
                handstrategy,
                // 目標星力
                starAim,
                handstarAim,
                starAim23up,
                starBegin,
                nowStarRender,
                directResultBtnShow,
                handstarBegin,                
                // 衝22以上的裝備數
                equipItem,    

                handStarResult,
                directResult,
                // activtyStarBtn
                activtyStarBtn,
                // starEffect
                effectbool,
                successEffect,
                handStarEffect,
                StarEffectRender,


                pointCost,
                // alertTxt
                checkAlertBool,
                // cost 
                costStore,
                costStoreClear,
                NTDcost,
                recoverMaplecoinCostCh,
                desTime

            }   
        },

    }
    createApp(App).mount("#app")     

}


