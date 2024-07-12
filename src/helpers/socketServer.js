const net = require("net");
const moment=require("moment");
const {sequelize,MacMapping,Transaction,Testing}=require("../models");
var events = require('../helpers/events');
const { sendV } = require("../controllers/KwikPay/macAddress");

const port = 6666;
let TID=Math.floor(Math.random() * 100000) + 1;

let intervals = [];

function getDateTime(){

  const date = new Date();

const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const year = date.getFullYear();

const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');

const formattedDate = `${day}-${month}-${year}`;
const formattedTime = `${hours}-${minutes}-${seconds}`;

const formattedDateTime = `${formattedDate} ${formattedTime}`;

 return formattedDateTime;


}

//console.log(getDateTime());

function sendData(socket,count,socketNumber) {
    // Construct message
    const message = `Count:${count}-${socketNumber}`;
    // console.log(message)
    // Send message
    socket.write(message+"\n");
  
   
    // const success=socket.write('Hello, server!');
   
    // Increment count
     count++;
    if(count>7)
    {
        count=1;
    }

    // Reset count to 0 if it reaches 1000
  
}

async function sendVend(socket, tid, name, remotePort, Data) {
  try {
    // Find data based on remotePort
    const data = await MacMapping.findOne({ where: { SocketNumber: remotePort } });
    if (data) {
      data.Color = "warning";
      await data.save();
    }
    
      const splitWithStar=Data.command.split('*');
      const splitWithHash=splitWithStar[1].split('#');
      const cleaned=splitWithHash[0];
      
      const command = cleaned.split(":");
      command[1]=`${tid}`;
      const message = command.join(":");
      
     const result= cleaned.split(":");
     result[0]="V-OK";
     result[1]=`${tid}`;
     const output = result.join(",");
      
   
   
    
    
    Data.command = `*${message}#`;
    Data.expected_output = `*${output}#`;
    await Data.save();

    // Send message over socket after a delay
    setTimeout(async () => {
      try {
        await socket.write(Data.command + "\n");
          events.pubsub.emit('Receive', Data.expected_output, Data, 0,remotePort);
      } catch (err) {
        console.error("Error sending command over socket:", err);
      }
    }, 500);

  
  
  } catch (err) {
    console.error("Error in sendVend function:", err);
  }
}





   

async function sendClear(socket,name,remotePort) {
  // Construct message
  const message = `*TC?#`;

  const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
  // console.log(data);
   if(data)
   {
       data.Color="warning";
       await data.save();
   }
  await setTimeout(async()=>{
  await socket.write(message+"\n");


 },500)

   
  //  await socket.write("*TV?#\n")
  
  // const success=socket.write('Hello, server!');
 
  // Increment count
  
  // Reset count to 0 if it reaches 1000

}

function sendReset(socket,name) {
    // Construct message
    const message = `*RST:${name}:${getDateTime()}#`;
    console.log("Resetting connection")
    // Send message
    socket.write(message+"\n");
    // const success=socket.write('Hello, server!');
   
  
  
}

function sendINHOutput(socket,port,value,name){
    const message = `*INH:${name}:${getDateTime()}:${value}#`;
  
    socket.write(message+"\n");

}

const setIntervalAndStore = (callback, interval) => {
  const intervalId = setInterval(callback, interval);
  intervals.push(intervalId);
  return intervalId;
};

const clearAllIntervals = () => {
  intervals.forEach(intervalId => clearInterval(intervalId));
  intervals = [];
};




const server = net.createServer((socket) => {
    console.log("Client connected");
     const { remoteAddress, remotePort } = socket;
     
     let count=0;
     socket.write(`Connectecd From Client:${remotePort}`); 
     startSocketListeners();
  // setInterval(() => {
        
     //  sendData(socket,count++,remotePort);
    //}, 10000);

    events.pubsub.on('sendINHOutput', function(output,port,name) {
       
         let value=0;
         if(output==true)
         {
           value=1;
         }
           console.log(value,port);
           console.log(remotePort);
       
        if(remotePort == port) {
        console.log("port matched");
          sendINHOutput(socket,port,value,name);
        }
      });

      events.pubsub.on('sendFota', function(output,port,name,type) {
      console.log('FOTA',output,port);
      
       if(remotePort == port) {
         console.log('FOTA SEND');
         if(type=="old")
          {
            socket.write(`*FOTA#`);
          }
          else{
            socket.write(`*FOTA:${name}:${getDateTime()}#`);
          }
        
       }
     });

     events.pubsub.on('sendReset', function(port,name) {
     
        
         if(remotePort == port) {
           sendReset(socket,name);
         }
       });

       events.pubsub.on('sendTC', function(port,name) {
     
        
        if(remotePort == port) {
            socket.write(`*TC?#`);
        }
      });

       events.pubsub.on('sendV', function(port,pin,pulse,name) {
     
        
        if(remotePort == port) {
          socket.write(`*V:${TID++}:${pin}:${pulse}`);
        }
      });

      events.pubsub.on('sendFW', function(port,name) {
     
        
        if(remotePort == port) {
          console.log("FW sent");
          socket.write(`*FW?#`);
        }
      });
      events.pubsub.on('sendTV', function(port,name) {
     
        
        if(remotePort == port) {
          socket.write(`*TV?#`);
        }
      });

      events.pubsub.on('sendFotaUrl', function(port,url,name) {
     
        
        if(remotePort == port) {
          socket.write(`*URL:${name}:${getDateTime()}:${url}#`);
          console.log(`*URL:${name}:${getDateTime()}:${url}# sent`)
        }
      });
      events.pubsub.on('askUrl', function(port,name) {
     
        
        if(remotePort == port) {
          socket.write(`*URL?#`);
        }
      });

      events.pubsub.on('sendCC', function(port,name) {
     
        
        if(remotePort == port) {
          socket.write(`*CC:${name}:${getDateTime()}#`);
        }
      });

      events.pubsub.on('sendLight', function(port,light,postion,name) {
     
        
        if(remotePort == port) {
          socket.write(`*SL:${name}:${getDateTime()}:${light}:${postion}#`);
        }
      });

      events.pubsub.on('sendHBT', function(port,value,name) {
     
        
        if(remotePort == port) {
          socket.write(`*HBT:${value}#`);
        }
      });

      events.pubsub.on('sendSIP', function(port,ip,pin,name) {
     
        
        if(remotePort == port) {
          socket.write(`*SIP:${name}:${getDateTime()}:${ip}:${pin}#`);
        }
      });

      events.pubsub.on('askSIP', function(port) {
     
        
        if(remotePort == port) {
          socket.write(`*SIP?#`);
        }
      });

      events.pubsub.on('sendSSID', function(port,ssid,name) {
     
        
        if(remotePort == port) {
          socket.write(`*SS:${name}:${getDateTime()}:${ssid}#`);
        }
      });

      events.pubsub.on('askSSID', function(port) {
     
        
        if(remotePort == port) {
          socket.write(`*SSID?#`);
        }
      });

      events.pubsub.on('sendPWD', function(port,pwd,name) {
     
        
        if(remotePort == port) {
          socket.write(`*PW:${name}:${getDateTime()}:${pwd}`);
        }
      });

      events.pubsub.on('sendSSID1', function(port,ssid,name) {
     
        
        if(remotePort == port) {
          socket.write(`*SS1:${name}:${getDateTime()}:${ssid}#`);
        }
      });

      events.pubsub.on('sendPWD1', function(port,pwd,name) {
     
        
        if(remotePort == port) {
          socket.write(`*PW1:${name}:${getDateTime()}:${pwd}#`);
        }
      });
      events.pubsub.on('sendCA', function(port,num,polarity,name) {
     
        
        if(remotePort == port) {
          socket.write(`*CA:${name}:${getDateTime()}:${num}:${polarity}#`);
        }
      });

      events.pubsub.on('askCA', function(port,name) {
     
        
        if(remotePort == port) {
          socket.write(`*CA?#`);
        }
      });

     
      events.pubsub.on('modeTest1',async function(port,name) {
       
        
        if(remotePort == port) {

          await setTimeout(async()=>{
            const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
            // console.log(data);
             if(data)
             {
                 data.Color="warning";
                 await data.save();
             }

           

          },500)
        
          await setTimeout(async()=>{
           const data=await Testing.findAll({where:{device_number:1}});
           console.log("Testing length",data[0].command);
           let i = 0;
              setIntervalAndStore(async () => {
               
               if(i<data.length)
               {
                console.log("Board1 index", i);
                if(data[i].command.includes("*V:"))
                {
                await sendVend(socket, TID++, name, remotePort, data[i]);
                }
                else{
                 await socket.write(data[i].command);
                 events.pubsub.emit('Receive', data[i].expected_output, data[i], 0,port);
                }
                }
                
                i++;
               
              },10000);  // 100000 milliseconds = 100 seconds
            


         
          },2000)
      
         
         
        }
      });
      events.pubsub.on('modeTest2', async function(port,name) {
             
         
        if(remotePort == port) {

          await setTimeout(async()=>{
            const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
            // console.log(data);
             if(data)
             {
                 data.Color="warning";
                 await data.save();
             }

           

          },500)
        
          await setTimeout(async()=>{
           const data=await Testing.findAll({where:{device_number:2}});
           console.log("Testing length",data[0].command);
             let i = 0;
             setIntervalAndStore(async () => {
               if(i<data.length)
               {
                console.log("Board2 index", i);
                if(data[i].command.includes("*V:"))
                {
                await sendVend(socket, TID++, name, remotePort, data[i]);
                }
                else{
                 await socket.write(data[i].command);
                 events.pubsub.emit('Receive', data[i].expected_output, data[i], 0,port);
                }
                }
                i++;
              
              }, 14000);  // 100000 milliseconds = 100 seconds
            


         
          },2000)
      
         
         
        }
        
       
      });
      
      events.pubsub.on('modeTest3',async function(port,name) {
       
        
        if(remotePort == port) {

          await setTimeout(async()=>{
            const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
            // console.log(data);
             if(data)
             {
                 data.Color="warning";
                 await data.save();
             }

           

          },500)
        
          await setTimeout(async()=>{
           const data=await Testing.findAll({where:{device_number:3}});
           console.log("Testing length",data[0].command);
           let i = 0;
              setIntervalAndStore(async () => {
               
               if(i<data.length)
               {
                console.log("Board3 index", i);
                if(data[i].command.includes("*V:"))
                {
                await sendVend(socket, TID++, name, remotePort, data[i]);
                }
                else{
                 await socket.write(data[i].command);
                 events.pubsub.emit('Receive', data[i].expected_output, data[i], 0,port);
                }
                }
                
                i++;
               
              },10000);  // 100000 milliseconds = 100 seconds
            


         
          },2000)
      
         
         
        }
      });

     events.pubsub.on('modeNone', async function(port, name) {
          if (remotePort == port) {
              clearAllIntervals();
              startSocketListeners();
               try {
                  const data = await Testing.findAll();
                  for (let i = 0; i < data.length; i++) {
                      data[i].result = '';
                      data[i].actual_outtput = '';
                      await data[i].save();
                  }
              } catch (error) {
                  console.error('Error updating data:', error);
              }
             
          }
     });

      
      
      
       const socketNumber = `${remotePort}`;
    
       console.log(remoteAddress,remotePort);
       
       
       
       
       events.pubsub.on('Receive', function(output,Data,i,port) {

         console.log("event called***************")
           
       
         let interval; // Declare interval variable

        // Start interval check
        interval = setInterval(async () => {
         if(port==socketNumber)
         {
          console.log(`Interval check ${i}`);
          i++;
          if(Data.result==output){
            clearInterval(interval);
           socket.removeAllListeners('data');
          
          }
          
          if (i >= 4) {
            clearInterval(interval);
            socket.removeAllListeners('data'); // Remove all listeners for 'data' to prevent memory leaks
            Data.result = "Error";
            await Data.save();
            console.log("Output Doesn't Matched.");
          }
          }
        }, 2000);
      
        // Listen for data events
        socket.once("data", async (data) => { // Use once to ensure it's only handled once
          const strData = data.toString();
         
           console.log(`Received data: ${strData}`);
            console.log(`Expected output: ${output}`);
      
          if (strData === output && port==socketNumber ) {
            console.log(`Received data: ${strData}`);
            console.log(`Expected output: ${output}`);
            console.log("Desired output received. Updating Data.", strData, output);
            clearInterval(interval);
            Data.result = strData;
            Data.actual_outtput = strData;
            await Data.save();
           // socket.removeAllListeners('data'); // Remove all listeners for 'data' to prevent memory leaks
            console.log("Interval cleared and socket listeners removed.");
          }
          else if(port==socketNumber){
            Data.actual_outtput = strData;
             await Data.save();
          }
          
          
        });
          

        })
    
       
   
   function startSocketListeners() {
    socket.on("data",async (data) => {
       
        const strData = data.toString();
        console.log(`Received: ${strData}`);
       
        if(strData.includes("*") || strData.includes("#"))
            {
             console.log(strData);
              //var cleaned = /^\**(.*?)\#*$/.exec(`**${strData}##`);
              const splitWithStar=strData.split('*');
              const splitWithHash=splitWithStar[1].split('#');
              const cleaned=splitWithHash[0];
      
        const command = cleaned.split(",");

      
        
     
        console.log(command[0]);
         if(strData.includes("SIP:"))
          {
            
             // console.log(remotePort);
             
            
              
             
              const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
            // console.log(data);
              if(data)
                  {
                    
                      data.SIPmessage=strData;
                      data.lastHeartBeatTime=new Date().toISOString();
                      await data.save();
                      setTimeout(()=>{
                        data.SIPmessage='';
                      
                       data.save();

                      },8000)
                        await Transaction.create({
                            machine:data.UID,
                            command:strData,
                          
                        })
                         console.log("Saved In Transactions");
                       
                  }
             
            
          }
        
        if(command[0]=="MAC")
        {
            //console.log("Timer Started");
            // await setTimeout(()=>{
            //    console.log("Resetting Connection");
            //    socket.write(`*RST#`);
            // },10000)
            const address=command[1];
            console.log(`Mac Adress:${address}`);
            const data=await MacMapping.findOne({where:{MacID:command[1]}});
           // console.log(data);
            if(data)
                {
                    data.SocketNumber=remotePort;
                    data.lastHeartBeatTime=new Date().toISOString();
                    await data.save();
                      await Transaction.create({
                          machine:data.UID,
                          command:command[0],
                          p1:command[1],
                          p2:command[2],
                          p3:command[3],
                          p4:command[4]
                      })
                       console.log("Saved In Transactions");
                }
                else{
                  await MacMapping.create({
                    MacID:command[1],
                    lastHeartBeatTime:new Date().toISOString(),
                    INHinput:false,
                    INHoutput:false
                    

                  })
                }
           
          
        } 
        else  if(command[0].includes("INH"))
            {
              
                console.log("inh received");
                const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
              
                if(data)
                    {
                      
                        data.INHinput=parseInt(command[1]);
                        data.lastHeartBeatTime=new Date().toISOString();
                        await data.save();
                          await Transaction.create({
                              machine:data.UID,
                              command:command[0],
                              p1:command[1],
                              p2:command[2],
                              p3:command[3],
                              p4:command[4]
                          })
                           console.log("Saved In Transactions");
                    }
               
              
            } 
            else  if(command[0]=="HBT")
              {
                
                  
                  const data=await MacMapping.findOne({where:{MacID:command[1]}});
                
                  if(data)
                      {
                        
                          data.SocketNumber=remotePort;
                          data.lastHeartBeatTime=new Date().toISOString();
                          await data.save();
                        
                            await Transaction.create({
                                machine:data.UID,
                                command:command[0],
                                p1:command[1],
                                p2:command[2],
                                p3:command[3],
                                p4:command[4]
                            })
                             console.log("Saved In Transactions");
                           
                          
                      }
                 
                
           } 
            else  if(command[0]=="RST-OK")
                {
                  
                    
                    const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                  
                    if(data)
                        {
                          
                            data.RstMessage=command[0];
                            data.lastHeartBeatTime=new Date().toISOString();
                            await data.save();
                          
                              await Transaction.create({
                                  machine:data.UID,
                                  command:command[0],
                                  p1:command[1],
                                  p2:command[2],
                                  p3:command[3],
                                  p4:command[4]
                              })
                               console.log("Saved In Transactions");
                               setTimeout(()=>{
                                data.RstMessage='';
                              
                               data.save();
  
                              },8000)
                        }
                   
                  
         } 
         else  if(command[0].includes("FOTA"))
            {
              
                
                const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
              
                if(data)
                    {
                      
                        data.FotaMessage=command[0];
                        data.lastHeartBeatTime=new Date().toISOString();
                        await data.save();
                          await Transaction.create({
                              machine:data.UID,
                              command:command[0],
                              p1:command[1],
                              p2:command[2],
                              p3:command[3],
                              p4:command[4]
                          })
                           console.log("Saved In Transactions");
                           setTimeout(()=>{
                            data.FotaMessage='';
                          
                           data.save();

                          },8000)
                    }
               
              
            } 
            else  if((command[0].includes("V")) && !command[0].includes("TV"))
                {
                  
                    
                    const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                  
                    if(data)
                        {
                          const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                              // console.log(data);
                               if(data)
                               {
                                   data.Color="";
                                   await data.save();
                               }
                          
                            data.Voutput=strData;
                            data.lastHeartBeatTime=new Date().toISOString();
                            await data.save();
                              await Transaction.create({
                                  machine:data.UID,
                                  command:command[0],
                                  p1:command[1],
                                  p2:command[2],
                                  p3:command[3],
                                  p4:command[4]
                              })
                               console.log("Saved In Transactions");
                               setTimeout(()=>{
                                data.Voutput='';
                              
                               data.save();
  
                              },8000)
                        }
                   
                  
                }
                else  if(command[0].includes("TC"))
                    {
                      
                        
                        const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                      
                        if(data)
                            {
                              const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                              // console.log(data);
                               if(data)
                               {
                                   data.Color="";
                                   await data.save();
                               }
                              
                                data.TCoutput=strData;
                                data.lastHeartBeatTime=new Date().toISOString();
                                await data.save();
                                  await Transaction.create({
                                      machine:data.UID,
                                      command:command[0],
                                      p1:command[1],
                                      p2:command[2],
                                      p3:command[3],
                                      p4:command[4]
                                  })
                                   console.log("Saved In Transactions");
                                 //  setTimeout(()=>{
                                 //   data.TCoutput='';
                                  
                                 //  data.save();
      
                                 // },8000)
                            }
                       
                      
                    }
                    
                  else  if(command[0].includes("TV"))
                    {
                      
                       // console.log(remotePort);
                        const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                       // console.log(data);
                        if(data)
                            {
                              
                                data.TVoutput=strData;
                                data.lastHeartBeatTime=new Date().toISOString();
                                await data.save();
                                  await Transaction.create({
                                      machine:data.UID,
                                      command:command[0],
                                      p1:command[1],
                                      p2:command[2],
                                      p3:command[3],
                                      p4:command[4]
                                  })
                                   console.log("Saved In Transactions");
                                  setTimeout(()=>{
                                   data.TVoutput='';
                                  
                                   data.save();
      
                                  },8000)
                            }
                       
                      
                    }
                    else  if(command[0].includes("Kwikpay") || command[0].includes("GVC"))
                    {
                      
                       // console.log(remotePort);
                       
                       
                        
                       
                        const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                       // console.log(data);
                        if(data)
                            {
                              
                                data.FWoutput=command[0];
                                data.lastHeartBeatTime=new Date().toISOString();
                                await data.save();
                                setTimeout(()=>{
                                  data.FWoutput='';
                                
                                 data.save();
    
                                },8000)
                                  await Transaction.create({
                                      machine:data.UID,
                                      command:command[0],
                                      p1:command[1],
                                      p2:command[2],
                                      p3:command[3],
                                      p4:command[4]
                                  })
                                   console.log("Saved In Transactions");
                                 
                            }
                       
                      
                    }
                     else  if(command[0].includes("SL"))
                    {
                      
                       // console.log(remotePort);
                       
                      
                        
                       
                        const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                       // console.log(data);
                        if(data)
                            {
                              
                                data.Soutput=command[0];
                                data.lastHeartBeatTime=new Date().toISOString();
                                await data.save();
                                setTimeout(()=>{
                                  data.Soutput='';
                                
                                 data.save();
    
                                },8000)
                                  await Transaction.create({
                                      machine:data.UID,
                                      command:command[0],
                                      p1:command[1],
                                      p2:command[2],
                                      p3:command[3],
                                      p4:command[4]
                                  })
                                   console.log("Saved In Transactions");
                                  
                            }
                       
                      
                    }
                      else  if(command[0]=="URL-OK")
                    {
                      
                       // console.log(remotePort);
                       
                      
                        
                       
                        const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                       // console.log(data);
                        if(data)
                            {
                              
                                data.FotaURLoutput=command[0];
                                data.lastHeartBeatTime=new Date().toISOString();
                                await data.save();
                                setTimeout(()=>{
                                  data.FotaURLoutput='';
                                
                                 data.save();
    
                                },8000)
                                  await Transaction.create({
                                      machine:data.UID,
                                      command:command[0],
                                      p1:command[1],
                                      p2:command[2],
                                      p3:command[3],
                                      p4:command[4]
                                  })
                                   console.log("Saved In Transactions");
                                 
                            }
                       
                      
                    }
                      else  if(command[0].includes("URL"))
                    {
                      
                       // console.log(remotePort);
                       
                      
                        
                       
                        const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                       // console.log(data);
                        if(data)
                            {
                              
                                data.URLoutput=command[1];
                                data.lastHeartBeatTime=new Date().toISOString();
                                await data.save();
                                  await Transaction.create({
                                      machine:data.UID,
                                      command:command[0],
                                      p1:command[1],
                                      p2:command[2],
                                      p3:command[3],
                                      p4:command[4]
                                  })
                                   console.log("Saved In Transactions");
                                   setTimeout(()=>{
                                    data.URLoutput='';
                                  
                                   data.save();
      
                                  },8000)
                            }
                       
                      
                    }
                        else  if(command[0]=="CC-OK")
                    {
                      
                       // console.log(remotePort);
                       
                      
                        
                       
                        const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                      // console.log(data);
                        if(data)
                            {
                              const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                              // console.log(data);
                               if(data)
                               {
                                   data.Color="";
                                   await data.save();
                               }
                              
                                data.Coutput=command[0];
                                data.lastHeartBeatTime=new Date().toISOString();
                                await data.save();
                                setTimeout(()=>{
                                  data.Coutput='';
                                
                                 data.save();
    
                                },8000)
                                  await Transaction.create({
                                      machine:data.UID,
                                      command:command[0],
                                      p1:command[1],
                                      p2:command[2],
                                      p3:command[3],
                                      p4:command[4]
                                  })
                                   console.log("Saved In Transactions");
                                 
                            }
                       
                      
                    }
                    else  if(command[0]=="SIP-OK")
                      {
                        
                         // console.log(remotePort);
                         
                        
                          
                         
                          const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                        // console.log(data);
                          if(data)
                              {
                                
                                  data.SIPoutput=command[0];
                                  data.lastHeartBeatTime=new Date().toISOString();
                                  await data.save();
                                  setTimeout(()=>{
                                    data.SIPoutput='';
                                  
                                   data.save();
      
                                  },8000)
                                    await Transaction.create({
                                        machine:data.UID,
                                        command:command[0],
                                        p1:command[1],
                                        p2:command[2],
                                        p3:command[3],
                                        p4:command[4]
                                    })
                                     console.log("Saved In Transactions");
                                   
                              }
                         
                        
                      }
                    
                      else  if(command[0]=="SS-OK")
                        {
                          
                           // console.log(remotePort);
                           
                          
                            
                           
                            const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                          // console.log(data);
                            if(data)
                                {
                                  
                                    data.SSIDoutput=command[0];
                                    data.lastHeartBeatTime=new Date().toISOString();
                                    await data.save();
                                    setTimeout(()=>{
                                      data.SSIDoutput='';
                                    
                                     data.save();
        
                                    },8000)
                                      await Transaction.create({
                                          machine:data.UID,
                                          command:command[0],
                                          p1:command[1],
                                          p2:command[2],
                                          p3:command[3],
                                          p4:command[4]
                                      })
                                       console.log("Saved In Transactions");
                                   
                                }
                           
                          
                        }
                        else  if(command[0]=="SSID")
                          {
                            
                             // console.log(remotePort);
                             
                            
                              
                             
                              const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                            // console.log(data);
                              if(data)
                                  {
                                    
                                      data.SSIDmessage=strData;
                                      data.lastHeartBeatTime=new Date().toISOString();
                                      await data.save();
                                      setTimeout(()=>{
                                        data.SSIDmessage='';
                                      
                                       data.save();
          
                                      },8000)
                                        await Transaction.create({
                                            machine:data.UID,
                                            command:command[0],
                                            p1:command[1],
                                            p2:command[2],
                                            p3:command[3],
                                            p4:command[4]
                                        })
                                         console.log("Saved In Transactions");
                                     
                                  }
                             
                            
                          }
                        else  if(command[0]=="SS1-OK")
                          {
                            
                             // console.log(remotePort);
                             
                            
                              
                             
                              const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                             //console.log(data);
                              if(data)
                                  {
                                    
                                      data.SSID1output=command[0];
                                      data.lastHeartBeatTime=new Date().toISOString();
                                      await data.save();
                                      setTimeout(()=>{
                                        data.SSID1output='';
                                      
                                       data.save();
          
                                      },8000)
                                        await Transaction.create({
                                            machine:data.UID,
                                            command:command[0],
                                            p1:command[1],
                                            p2:command[2],
                                            p3:command[3],
                                            p4:command[4]
                                        })
                                         console.log("Saved In Transactions");
                                        
                                  }
                             
                            
                          }
                           else  if(command[0]=="PW-OK")
                          {
                            
                             // console.log(remotePort);
                             
                            
                              
                             
                              const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                             //console.log(data);
                              if(data)
                                  {
                                    
                                      data.PWDoutput=command[0];
                                      data.lastHeartBeatTime=new Date().toISOString();
                                      await data.save();
                                      setTimeout(()=>{
                                        data.PWDoutput='';
                                      
                                       data.save();
          
                                      },8000)
                                        await Transaction.create({
                                            machine:data.UID,
                                            command:command[0],
                                            p1:command[1],
                                            p2:command[2],
                                            p3:command[3],
                                            p4:command[4]
                                        })
                                         console.log("Saved In Transactions");
                                      
                                  }
                             
                            
                          }
                           else  if(command[0]=="PW1-OK")
                          {
                            
                             // console.log(remotePort);
                             
                            
                              
                             
                              const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                             //console.log(data);
                              if(data)
                                  {
                                    
                                      data.PWD1output=command[0];
                                      data.lastHeartBeatTime=new Date().toISOString();
                                      await data.save();
                                      setTimeout(()=>{
                                        data.PWD1output='';
                                      
                                       data.save();
          
                                      },8000)
                                        await Transaction.create({
                                            machine:data.UID,
                                            command:command[0],
                                            p1:command[1],
                                            p2:command[2],
                                            p3:command[3],
                                            p4:command[4]
                                        })
                                         console.log("Saved In Transactions");
                                       
                                  }
                             
                            
                          }
                          else  if(command[0]=="CA-OK")
                            {
                              
                               // console.log(remotePort);
                               
                              
                                
                               
                                const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                               //console.log(data);
                                if(data)
                                    {
                                      
                                        data.CAoutput=strData;
                                        data.CAmessage=strData;
                                        data.lastHeartBeatTime=new Date().toISOString();
                                        await data.save();
                                        setTimeout(()=>{
                                          data.CAoutput='';
                                          data.CAmessage='';
                                         data.save();
            
                                        },8000)
                                          await Transaction.create({
                                              machine:data.UID,
                                              command:command[0],
                                              p1:command[1],
                                              p2:command[2],
                                              p3:command[3],
                                              p4:command[4]
                                          })
                                           console.log("Saved In Transactions");
                                         
                                    }
                               
                              
                            }

                            else  if(command[0].includes("RP"))
                              {
                                
                                 console.log("RP Received");
                                 
                                
                                  
                                 
                                  const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
                                 //console.log(data);
                                  if(data)
                                      {
                                        
                              
                                          data.RPoutput=strData;
                                          data.lastHeartBeatTime=new Date().toISOString();
                                          await data.save();
                                          setTimeout(()=>{
                                            data.RPoutput='';
                                           data.save();
              
                                          },8000)
                                            await Transaction.create({
                                                machine:data.UID,
                                                command:command[0],
                                                p1:command[1],
                                                p2:command[2],
                                                p3:command[3],
                                                p4:command[4]
                                            })
                                             console.log("Saved In Transactions");
                                           
                                      }
                                 
                                
                              }

                   
                   
                else{


            const data=await MacMapping.findOne({where:{SocketNumber:remotePort}});
           // console.log(data);
            if(data)
            {
                data.lastHeartBeatTime=new Date();
                await data.save();
            await Transaction.create({
                machine:data.UID,
                command:command[0],
                p1:command[1],
                p2:command[2],
                p3:command[3],
                p4:command[4]
            })
             console.log("Saved In Transactions");
            }

        }
        const operator = command[0];
        
      
        let result;

        switch (operator) {
           
        }
       }

       await socket.write(`RemotePort From Server:${remotePort}`);
    });
    }

    socket.on("end", () => {
        console.log("Client disconnected");
    });

    socket.on("error", (error) => {
        console.log(`Socket Error: ${error.message}`);
    });
});

server.on("error", (error) => {
    console.log(`Server Error: ${error.message}`);
});

server.listen(port, () => {
    console.log(`TCP socket server is running on port: ${port}`);
});