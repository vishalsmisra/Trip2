import React, { useState } from "react";

function ItineraryDisplay({ responseData, location }) {
  let itineraryObj;
  try {
    itineraryObj = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
  } catch (e) {
    return (
      <div style={{ marginTop: 16, padding: 12, background: '#f9f9f9', borderRadius: 4 }}>
        <strong>Invalid response from webhook:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{responseData}</pre>
      </div>
    );
  }
  return (
    <div style={{ marginTop: 32, padding: 24, background: '#f4f8fb', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2 style={{ color: '#2a4d69', marginBottom: 16 }}>
        Here is the itinerary for the trip location mentioned earlier: <span style={{ color: '#4b86b4' }}>{location}</span>
      </h2>
      {itineraryObj.itinerary && itineraryObj.itinerary.length > 0 ? (
        itineraryObj.itinerary.map(day => (
          <div key={day.dayNumber} style={{ marginBottom: 24 }}>
            <h3 style={{ color: '#4b86b4', marginBottom: 8 }}>
              Day {day.dayNumber} - {day.date}
            </h3>
            <ul style={{ paddingLeft: 20 }}>
              {day.activities.map(activity => (
                <li key={activity.id} style={{ marginBottom: 12, background: '#fff', borderRadius: 4, boxShadow: '0 1px 4px #ddd', padding: 12 }}>
                  <strong style={{ color: '#2a4d69' }}>{activity.title}</strong><br />
                  <span style={{ color: '#555' }}>{activity.description}</span><br />
                  <span><b>Duration:</b> {activity.duration}</span><br />
                  <span><b>Location:</b> {activity.location}</span><br />
                  <span><b>Type:</b> {activity.type}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No itinerary found.</p>
      )}
    </div>
  );
}

export default function App() {
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [responseData, setResponseData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    setResponseData(null);
    try {
      const response = await fetch("https://15a113df4935.ngrok-free.app/webhook/12b44ee5-c43e-430c-a1d4-4fc5ff5e45c4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ location })
      });
      const text = await response.text();
      if (response.ok) {
        setStatus("Location sent successfully!");
        setResponseData(text);
      } else {
        setStatus("Failed to send location.");
        setResponseData(text);
      }
    } catch (error) {
      setStatus("Error: " + error.message);
      setResponseData(null);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#fff' }}>
      <div style={{ textAlign: 'center', marginTop: 40, marginBottom: 32, padding: '0 16px' }}>
        <h1 style={{ fontSize: '8vw', maxFontSize: 64, fontWeight: 800, color: '#16351a', letterSpacing: '-2px', marginBottom: '7vw' }}>Where to?</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: 700, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f7f7f7', borderRadius: 40, boxShadow: '0 2px 8px #eee', padding: '0 8px', width: '100%', maxWidth: 700, height: 56 }}>
            <svg width="28" height="28" fill="none" stroke="#16351a" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Places to go, things to do, hotels..."
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '5vw',
                minFontSize: 18,
                maxFontSize: 22,
                flex: 1,
                color: '#333',
                padding: '0 4px',
              }}
              required
            />
            <button type="submit" style={{
              background: '#4be167',
              color: '#16351a',
              fontWeight: 600,
              fontSize: '5vw',
              minFontSize: 18,
              maxFontSize: 22,
              border: 'none',
              borderRadius: 32,
              padding: '10px 20px',
              marginLeft: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #e0e0e0',
              transition: 'background 0.2s',
            }}>Search</button>
          </div>
        </form>
        {status && <p style={{ marginTop: 18, color: '#555', fontSize: '4vw', minFontSize: 16, maxFontSize: 18 }}>{status}</p>}
      </div>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 8px' }}>
        {responseData && (
          <ItineraryDisplay responseData={responseData} location={location} />
        )}
      </div>
    </div>
  );
}