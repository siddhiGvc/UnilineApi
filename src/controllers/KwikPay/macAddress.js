import { where } from "sequelize";

const {UnilineMacMapping,TestMode,SerialPort} =require("../../models")
import { successResponse, errorResponse, uniqueId } from '../../helpers';
var events = require('../../helpers/events')

export const getAllMacAddress=async(req,res)=>{
    try{
    
       
        const obj = await UnilineMacMapping.findAll();
         res.status(200).json({data:obj})

    }
    catch(err){
        console.log(err);
        res.status(505).json({status:505})

    }

}


export const getData=async(req,res)=>{
    try {
      var replObjG = {};
      if (req.query.city) replObjG['city'] = req.query.city.split(',');
    //   if (req.query.zone) replObjG['zone'] = req.query.zone.split(',');
    //   if (req.query.ward) replObjG['ward'] = req.query.ward.split(',');
    //   if (req.query.beat) replObjG['beat'] = req.query.beat.split(',');
    //   if (req.query.status) replObjG['machine_status'] = req.query.status.split(',');
    //   if (req.query.voltage) replObjG['Voltage'] = req.query.voltage.split(',');
    //   if (req.query.current) replObjG['Current'] = req.query.current.split(',');
    //   if (req.query.temperature) replObjG['Temperature'] = req.query.temperature.split(',');
    //   if(req.query.voltage){
    //     console.log(req.query.voltage);
    //   }
      // if (!req.user.isAdmin && replObjG['city'] && req.user.city)
      //   replObjG['city'] = replObjG['city'].filter(q => req.user.city.split(',').indexOf(q) >= 0);
      // else if (!req.user.isAdmin && !replObjG['city'] && req.user.city)
      //   replObjG['city'] = req.user.city.split(',');
      // if (!req.user.isAdmin && replObjG['zone'] && req.user.zone)
      //   replObjG['zone'] = replObjG['zone'].filter(q => req.user.zone.split(',').indexOf(q) >= 0);
      // else if (!req.user.isAdmin && !replObjG['zone'] && req.user.zone)
      //   replObjG['zone'] = req.user.zone.split(',');
      // if (!req.user.isAdmin && replObjG['ward'] && req.user.ward)
      //   replObjG['ward'] = replObjG['ward'].filter(q => req.user.ward.split(',').indexOf(q) >= 0);
      // else if (!req.user.isAdmin && !replObjG['ward'] && req.user.ward)
      //   replObjG['ward'] = req.user.ward.split(',');
      // if (!req.user.isAdmin && replObjG['beat'] && req.user.beat)
      //   replObjG['beat'] = replObjG['beat'].filter(q => req.user.beat.split(',').indexOf(q) >= 0);
      // else if (!req.user.isAdmin && !replObjG['beat'] && req.user.beat)
      //   replObjG['beat'] = req.user.beat.split(',');
  
      var replObj = {
         city: req.query.city.split(',') ,
        //  zone: req.query.zone.split(',') ,
        //  ward: req.query.ward.split(',') ,
        //  beat: req.query.beat.split(',') ,
        //  machine_status:req.query.status.split(','),
        //  Voltage:req.query.voltage.split(','),
        //  Current:req.query.current.split(','),
        //  Temperature:req.query.temperature.split(',')
  
        };
      // if (req.query.stock_status) replObj['stock_status'] = req.query.stock_status.split(',');
      // if (req.query.burn_status) replObj['burn_status'] = req.query.burn_status.split(',');

    //   const obj=await UnilineMacMapping.findAll({where:{city:}})
      const [obj, _metadata] = await sequelize.query(
        `
        select * FROM UnilineMacMapping
        ${replObjG.city ? 'whrere City in (:city)' : ''}
        `,
        { replacements: { city: replObjG.city } }
      );
      
    
      return successResponse(req, res, { data: obj});
    } catch (error) {
      console.log(error)
      return errorResponse(req, res, error.message);
    }
  
  }


export const saveINHoutput=async(req,res)=>{
    try{
        console.log(req.body);
        const output=req.body.outPutValue;
        events.pubsub.emit('sendINHOutput',output,req.body.socketNumber,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
        if(obj)
            {
                obj.INHoutput=output ? 1:0
                await obj.save();
            }
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendFota=async(req,res)=>{
    try{
        console.log(req.body);
        const output=req.body.outPutValue;
        events.pubsub.emit('sendFota',output,req.body.socketNumber,req.body.UserName,req.body.type) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendReset=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendReset',req.body.socketNumber,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendV=async(req,res)=>{
    try{
        
      
      
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
        events.pubsub.emit('sendV',req.body.socketNumber,req.body.Pin,req.body.Pulse,obj.SNoutput) ;
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendTC=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendTC',req.body.socketNumber,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendFW=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendFW',req.body.socketNumber,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }


}
export const sendTV=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendTV',req.body.socketNumber,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendFotaUrl=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendFotaUrl',req.body.socketNumber,req.body.Url,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const askUrl=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('askUrl',req.body.socketNumber,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const setSN=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('setSN',req.body.socketNumber,req.body.UserName,req.body.SerialNumber) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}
export const setErase=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('setErase',req.body.socketNumber,req.body.UserName,req.body.Erase) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const setL=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('setL',req.body.socketNumber,req.body.UserName,req.body.LNumber) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}
export const checkErase=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('checkErase',req.body.socketNumber) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const setPair=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('setPair',req.body.socketNumber,req.body.UserName,req.body.PairNumber) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}
export const checkPair=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('checkPair',req.body.socketNumber) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const checkSN=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('checkSN',req.body.socketNumber) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendCC=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendCC',req.body.socketNumber,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendLight=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendLight',req.body.socketNumber,req.body.light,req.body.position,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendHBT=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendHBT',req.body.socketNumber,req.body.value,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendCA=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendCA',req.body.socketNumber,req.body.numValue,req.body.polarity,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const askCA=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('askCA',req.body.socketNumber,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendSIP=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendSIP',req.body.socketNumber,req.body.Ip,req.body.Pin,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}
export const askSIP=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('askSIP',req.body.socketNumber) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendSSID=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendSSID',req.body.socketNumber,req.body.SSID,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}
export const askSSID=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('askSSID',req.body.socketNumber) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendPassThru=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendPassThru',req.body.socketNumber,req.body.UserName,req.body.PassThru) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}
export const checkPassThru=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('checkPassThru',req.body.socketNumber) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendPWD=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendPWD',req.body.socketNumber,req.body.PWD,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendSSID1=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendSSID1',req.body.socketNumber,req.body.SSID1,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const sendPWD1=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('sendPWD1',req.body.socketNumber,req.body.PWD1,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const modeTest1=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('modeTest1',req.body.socketNumber,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const modeTest2=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('modeTest2',req.body.socketNumber,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const modeTest3=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('modeTest3',req.body.socketNumber,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const modeNone=async(req,res)=>{
    try{
        
      
        events.pubsub.emit('modeNone',req.body.socketNumber,req.body.UserName) ;
        const obj = await UnilineMacMapping.findOne({where:{MacID:req.body.MacId}});
       
        res.status(200).json({data:obj})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const getTestMode=async(req,res)=>{
    try{
        
        const obj = await TestMode.findAll();
       
        res.status(200).json({data:obj[0]})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const setTestMode=async(req,res)=>{
    try{
        
        const obj = await TestMode.findOne({where:{id:1}});

        obj.testMode=!obj.testMode;

        obj.save();
       
        res.status(200).json()
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}

export const getSerialPorts=async(req,res)=>{
    try{
       
        const obj = await SerialPort.findAll();
       
        res.status(200).json({data:obj[0]})
  
    }
    catch(err)
    {
        console.log(err);
        res.status(505).json({status:505})
    }

}