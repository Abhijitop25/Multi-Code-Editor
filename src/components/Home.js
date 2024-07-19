import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
const Home = () => {

    
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const [userName, setUserName] = useState("");


    const newRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id);
    }

    const joinRoom = () => {
        if(!roomId || !userName){
            window.alert("ROOMID or Username Missing");
        }

        navigate(`/editor/${roomId}`,{
            state: {
                userName,
            },
        });
    };
    
  return (
    <div className="shadow-xl mt-52 mx-20 border-2 border-gray-400 p-4">
        <div className='flex justify-center'><img src='https://cdn.iconscout.com/icon/premium/png-256-thumb/code-editor-4887853-4072389.png' width={50} className=""/></div> 
       <div className="font-semibold text-lg">Paste the ROOM ID</div>
       <input placeholder='ROOM ID' className=" bg-slate-200 w-full my-2 border border-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue p-2"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
       />
       <input placeholder='Username' className=" bg-slate-200 w-full my-2 border border-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue p-2"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
       />
       <button onClick={joinRoom} className="px-6 py-3 bg-green-400 text-white font-semibold rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ease-in-out duration-150 my-2">
        Join Room
       </button>
       <div className="text-gray-400 underline hover:cursor-pointer"><a onClick={newRoom}>New room</a></div>
       
    </div>
  )
}

export default Home