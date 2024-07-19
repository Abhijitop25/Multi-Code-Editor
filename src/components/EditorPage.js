import React, { useEffect, useRef, useState } from 'react'
import Editor from '../comps/Editor'
import { initSocket } from '../socket';
import { useNavigate , useParams, Navigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ACTIONS from '../Actions';

const EditorPage = () => {

    const location = useLocation();
    const socketRef = useRef(null);
    const navigate = useNavigate();
    const { roomId } = useParams();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            const handleErrors = (err) => {
                window.alert("connection error");
                navigate('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                userName: location.state?.userName,
            });

            
            // Listening for joined event
            socketRef.current.on(ACTIONS.JOINED, ({ clients, userName, socketId }) => {
                if (userName !== location.state?.userName) {
                    window.alert(`${userName} joined!!`);
                }
                setUsers(clients);
                console.log("Users after join:", clients); // Debugging line
            });
            // Listening for disconnected event
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
                window.alert(`${userName} left!!`);
                setUsers((prev) => {
                    const updatedUsers = prev.filter(client => client.socketId !== socketId);
                    console.log("Users after disconnect:", updatedUsers); // Debugging line
                    return updatedUsers;
                });
            });
        };



        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            }
        };
    },[roomId, location.state?.userName, navigate]);

    if(!location.state){
        return <Navigate to="/" />
    }

    const leaveRoom = () => {
        navigate('/');
    }

  return (
    <div className="flex flex-row h-screen">
        <div className="flex-auto w-1/5 h-auto shadow-lg bg-slate-800">
            <div className="flex justify-center border-b-4"><img src='https://cdn.iconscout.com/icon/premium/png-256-thumb/code-editor-4887853-4072389.png' width={70}/></div>
            <div className="flew flex-col h-4/5">
                <div className="h-4/5">
                    <div className="font-bold text-white p-2">Connected</div>
                <div className="flex flex-wrap gap-4 my-4 justify-center">
                    {users.map((e,i) => {
                        return(
                            <div id={i} className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white font-bold rounded">
                                {e.userName}
                            </div>
                        )
                    })}
        </div>
                
                </div>
                <div className="h-1/5 flex flex-col jusify-center">
                    <button className="bg-white p-2 m-1">Copy Room ID</button>
                    <button onClick={leaveRoom} className="bg-green-500 p-2 m-1">Leave</button>
                </div>
            </div>
        </div>
        <div className="flex-auto w-4/5 h-auto">
            <Editor socketRef={socketRef} roomId={roomId}/>
        </div>
    </div>
  )
}

export default EditorPage