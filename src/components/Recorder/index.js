import React, { useState ,useEffect, Fragment } from 'react'
import { KeyboardVoiceOutlined } from '@mui/icons-material';
import { useReactMediaRecorder } from "react-media-recorder";
import { toast } from 'react-toastify';

function Recorder() {

  const [isRecording,setIsRecording] = useState(false);  
  const [counter,setCounter] = useState(0);
  const { status, startRecording, stopRecording, mediaBlobUrl , clearBlobUrl } =
    useReactMediaRecorder({
        video: false,
        audio: true,
        echoCancellation: true
      });
 const [resp,setResp] = useState({
     name : "",
     message : "",
 })

  function formatTimer(num){
      let str_num = "" + num;
      return "0"* (2 - str_num.length ) + str_num;
  }


  const style = {
      fontSize : "3rem",
      margin: "20px 0px",
      
  }

  const addToCounter = () => {
      if (isRecording){
          let temp_counter = counter + 1;
          if (temp_counter <= 5 && isRecording) {
            setCounter(temp_counter);
          }else{
              
              stopRecord();
          }
          
      }else{
          stopRecord();
      }
  }

  const stopRecord = (manual=false) => {
    if (isRecording == true){
        setCounter(0);
        setIsRecording(false);
        stopRecording();
    }else{
        setCounter(0);
        if (manual){
            setIsRecording(true);
            startRecording();
        }
        
    }
  }

  const convertFileToBase64 = async (blob) =>{
    toast.info("Envoie au serveur");
    let resp = await fetch(blob);
    if (resp){
    console.log(blob)
    let b = await resp.blob();
    console.log(b);
    var reader = new FileReader();
    reader.readAsDataURL(b); 
    reader.onloadend = async function() {
    var base64data = reader.result;                
        console.log(base64data);
        let data = {
            data : base64data
        }
        const rawResponse = await fetch('http://127.0.0.1:8000/api/recon', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

    });
        let res = await rawResponse.json()
        console.log(res);
        setResp(res);
        toast.success("Success")
    }
    
}else{
    console.log("failed loading it");
    toast.error("Erreur")
}

  }
  

  useEffect(() => {

      setTimeout(addToCounter,1000);
      if (mediaBlobUrl) {
        convertFileToBase64(mediaBlobUrl).then(() => {console.log('done loading it')
        clearBlobUrl();
      }) 
      }
  },[counter,isRecording,mediaBlobUrl]);





  return ( 
      <div className='min-h-screen bg-[#1a1a1a] flex items-center justify-center p-10'>
          <div className="  w-[500px] neum rounded-[15px] p-5 flex flex-col items-center">
              <h2 className="text-[#DAA89B] text-3xl text-center italic " > Reconnaissance Vocal ( {status} )</h2>
                <div className="">
                    <div className='flex items-center mt-10 relative' >
                        <span id="timer" className="text-[5rem] text-[#DFEFCA] text-shad  font-bold" >{"00:" + formatTimer(counter)}</span><span className=" text-[#DFEFCA]  absolute text-[1.5rem] font-bold right-[-15px] top-[25px] ">S</span>
                    </div>
                </div>
                <div onClick={() => stopRecord(true)} className={ "icon-container " + (isRecording ? " active-container " : "")}>
                    <KeyboardVoiceOutlined className={"transition-colors "}   sx={style} />
                </div>
                {
                    resp.name != "" && <>
                         <div className="w-4/6 mx-auto inward-neum p-5 rounded-[10px] flex items-center justify-center mt-5 ">
                    <h3 className="text-xl text-[#DAA89B] mr-5">Speaker : </h3>
                    <h4 className="text-[#DFEFCA]">{resp.name}</h4>
                </div>
                <div className="w-5/6 mx-auto inward-neum p-5 rounded-[10px] flex flex-col  justify-center my-5">
                <h3 className="text-xl text-[#DAA89B] mr-5 text-center mb-2">Message </h3>
                <p className='text-lg text-justify text-[#e6e5e5]'>{resp.message}</p>
                </div>
                    </>
                    
                   
                }
                
               
          </div>

      </div>
  )


}

export default Recorder;