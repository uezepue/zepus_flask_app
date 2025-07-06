// src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function useSocket(role, userId) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(); // auto-connects to your Flask SocketIO backend

    if (role === 'doctor') {
      socketRef.current.emit('doctor_join', { doctor_id: userId });
    } else if (role === 'patient') {
      socketRef.current.emit('patient_join', { patient_id: userId });
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [role, userId]);

  return socketRef.current;
}
