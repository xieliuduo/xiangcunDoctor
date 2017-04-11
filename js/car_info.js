var car = avalon.define({
    $id:"car",
    showInfo:false,
    loadingFlash:true,
    noInfo:false,
    carInfo:{},
    syToken:xs_utils.getLocalStorage("syToken"),
    getCarInfo:function(){
        var url = xs_utils.getApiUrl("/api/vehicle/info", {
            "token":car.syToken
        });
        $.get(url,function(ret){
        	console.log(ret);
            if(ret.status_code=="500"){
                car.loadingFlash = false;
                car.noInfo = true;
            }else{
                car.carInfo = ret.data;
                car.showInfo = true;
                car.loadingFlash = false;
                car.noInfo = false;
            }
        });
    }
    
    
});
$(function(){
	car.getCarInfo();
});
