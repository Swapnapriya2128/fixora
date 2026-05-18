import socket from "../socket"; // make sure this file exists
 
useEffect(() => {
  socket.on("bugNotification", (data) => {
    setNotifications((prev) => [data, ...prev]);
  });
 
  return () => socket.off("bugNotification");
}, []);