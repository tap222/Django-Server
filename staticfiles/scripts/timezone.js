async function sendTimeToServer() {
    const timeData = {
      clientTime: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      offset: new Date().getTimezoneOffset()
    };
  
    const response = await fetch('/api/timezone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(timeData)
    });
  
    return response.json();
  }
sendTimeToServer()