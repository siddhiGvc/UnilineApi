const {MacMapping,TestMode,SerialPort,UnilineMacMapping} =require("../../models")
import { successResponse, errorResponse, uniqueId } from '../../helpers';
var events = require('../../helpers/events');
const mqttHandler=require('../../../mqtt');
var mqttClient = new mqttHandler();


export const sendG1 = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
  
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        
        events.pubsub.removeAllListeners('getResponse1');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed
  

      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "G1/r/n");
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse1', async(response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        const data=await UnilineMacMapping.findOne({where:{SNoutput:req.body.serialNumber}});
        data.G1=response.toString();
        await data.save();
        events.pubsub.removeAllListeners('getResponse1');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };


  export const sendG2 = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
  
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        console.log("D");
        events.pubsub.removeAllListeners('getResponse2');
     
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed


      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "G2/r/n");
  
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse2', async(response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        const data=await UnilineMacMapping.findOne({where:{SNoutput:req.body.serialNumber}});
        data.G2=response.toString();
        await data.save();
        events.pubsub.removeAllListeners('getResponse2');

        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
    
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };
  

  export const sendG3 = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
      
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        console.log("D");
        events.pubsub.removeAllListeners('getResponse3');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed
    
      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "G3/r/n");
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse3', async(response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        const data=await UnilineMacMapping.findOne({where:{SNoutput:req.body.serialNumber}});
        data.G3=response.toString();
        await data.save();
        events.pubsub.removeAllListeners('getResponse3');
        if (!responseSent) { 
            responseSent=true;
           res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };

  export const sendI = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
      
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        console.log("D");
        events.pubsub.removeAllListeners('getResponse4');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed
    
      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "I/r/n");
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse4', async(response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        const data=await UnilineMacMapping.findOne({where:{SNoutput:req.body.serialNumber}});
        data.I=response.toString();
        await data.save();
        events.pubsub.removeAllListeners('getResponse4');
        if (!responseSent) { 
            responseSent=true;
           res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };

  export const sendGF = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
      
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        console.log("D");
        events.pubsub.removeAllListeners('getResponse5');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed
    
      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "GF/r/n");
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse5', async(response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        const data=await UnilineMacMapping.findOne({where:{SNoutput:req.body.serialNumber}});
        data.GF=response.toString();
        await data.save();
        events.pubsub.removeAllListeners('getResponse5');
        if (!responseSent) { 
            responseSent=true;
           res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };


  export const sendQ = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
      
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        console.log("D");
        events.pubsub.removeAllListeners('getResponse6');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed
    
      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "Q1/r/n");
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse6', async(response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        const data=await UnilineMacMapping.findOne({where:{SNoutput:req.body.serialNumber}});
        data.Q=response.toString();
        await data.save();
        events.pubsub.removeAllListeners('getResponse6');
        if (!responseSent) { 
            responseSent=true;
           res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };


  export const sendQ1 = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
      
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        console.log("D");
        events.pubsub.removeAllListeners('getResponse7');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed
    
      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "Q1/r/n");
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse7', async(response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        const data=await UnilineMacMapping.findOne({where:{SNoutput:req.body.serialNumber}});
        data.Q1=response.toString();
        await data.save();
        events.pubsub.removeAllListeners('getResponse7');
        if (!responseSent) { 
            responseSent=true;
           res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };

  export const sendT = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
      
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        console.log("D");
        events.pubsub.removeAllListeners('getResponse8');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed
    
      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "T/r/n");
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse8', (response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        events.pubsub.removeAllListeners('getResponse8');
        if (!responseSent) { 
            responseSent=true;
           res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };

  export const sendTL = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
      
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        console.log("D");
        events.pubsub.removeAllListeners('getResponse9');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed
    
      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "TL/r/n");
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse9', (response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        events.pubsub.removeAllListeners('getResponse9');
        if (!responseSent) { 
            responseSent=true;
           res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };

  export const sendS = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
      
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        console.log("D");
        events.pubsub.removeAllListeners('getResponse10');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed
    
      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "S/r/n");
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse10', (response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        events.pubsub.removeAllListeners('getResponse10');
        if (!responseSent) { 
            responseSent=true;
           res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };


  export const sendC = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
      
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        console.log("D");
        events.pubsub.removeAllListeners('getResponse11');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed
    
      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "C/r/n");
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse11', (response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        events.pubsub.removeAllListeners('getResponse11');
        if (!responseSent) { 
            responseSent=true;
           res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };


  export const sendCT = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
      
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        console.log("D");
        events.pubsub.removeAllListeners('getResponse12');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed
    
      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "CT/r/n");
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse12', (response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        events.pubsub.removeAllListeners('getResponse12');
        if (!responseSent) { 
            responseSent=true;
           res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };


  export const sendF = async (req, res) => {
    try {
      let responseSent = false;
      console.log("API called", req.body);
  
      // Send the MQTT message
    
      
    
      // Set up a timeout to handle cases where no response is received in time
      const timeout = setTimeout(() => {
        console.log("D");
        events.pubsub.removeAllListeners('getResponse13');
        if (!responseSent) { 
            responseSent=true;
        res.status(200).json({ data: "D" }); // Send the response back to the client
        }
       
      }, 10000); // Adjust the timeout duration as needed
    
      await mqttClient.sendMessage('GVC/' + req.body.serialNumber, "F/r/n");
      // Listen for the response using the event emitter
      await events.pubsub.emit('getResponse13', (response) => {
        // Clear the timeout if the response is received in time
        console.log("Response:",response);
        clearTimeout(timeout);
        events.pubsub.removeAllListeners('getResponse13');
        if (!responseSent) { 
            responseSent=true;
           res.status(200).json({ data: response }); // Send the response back to the client
        }
       
      });
     
      
    } catch (err) {
      console.log(err);
      res.status(505).json({ status: 505 });
    }
  };
  

