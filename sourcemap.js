/**
 * sourcemap "错误信息"
 */
var fs = require('fs');
var sourceMap = require('source-map');
var axios = require('axios');
var mapsourceCache={};
async function parseError(errorline){
   let r=errorline.match(/http(.*?)\.js/);
    if(r){
        //有发现js文件
        let jsfile=r[0];
        let numberarr=errorline.split(":")
        let aColumn=numberarr.pop();
        let aLine=numberarr.pop();
        //请求map文件
        let res = await axios.get(jsfile+".map");
        var smc;
        if(mapsourceCache[jsfile]){
            smc=mapsourceCache[jsfile];
        }else{
            try {
                smc = await new sourceMap.SourceMapConsumer(res.data)
                mapsourceCache[jsfile]=smc;
            } catch (e) {
                console.log(errorline);
                return ;
            }
        }
        let parseData = smc.originalPositionFor({
            line: parseInt(aLine),
            column: parseInt(aColumn)
        });
        if(parseData.source){
            console.log(errorline+" 👉  "+parseData.source+":"+parseData.line+":"+parseData.column);
        }else{
            console.log(errorline);
        }
    }else{
        console.log(errorline);//没有js则直接输出报错
    }
}
async function parse(errormsg){

    console.log("🌈 解析结果：");
    errorlines=errormsg.split("\n")
    for(let i in errorlines){
       await parseError(errorlines[i]);
    }

}


var errormsg = process.argv[2];
if(!errormsg){
    console.log("请传参报错信息");
    return ;
}

parse(errormsg)

