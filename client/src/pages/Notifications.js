//Notification.js
import React, { useEffect, useState } from "react";
 
function Notifications() {
  const [notifications, setNotifications] = useState([]);
 
  // 🧪 TEST: simulate receiving notification
  useEffect(() => {
    setTimeout(() => {
      const testNotification = {
        text: "Bug #101 Closed",
        details: "Fixed login issue",
        time: new Date()
      };
 
      setNotifications((prev) => [testNotification, ...prev]);
    }, 2000); // after 2 sec
  }, []);
 
  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications</h2>
 
      {notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        notifications.map((n, i) => (
          <div key={i} style={{
            background: "#f5f5f5",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px"
          }}>
            <strong>{n.text}</strong><br />
            {n.details}<br />
            <small>{new Date(n.time).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}
 
export default Notifications;