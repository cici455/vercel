import React from 'react';
import TarotSelector from './components/tarot/TarotSelector';

function App() {
  const handleNavigateToCouncil = (payload) => {
    console.log('Navigating to council with payload:', payload);
    // In a real app, this would navigate to the chat interface
    alert('Session started!\n\n' + JSON.stringify(payload, null, 2));
  };

  return (
    <div className="App">
      <TarotSelector onNavigateToCouncil={handleNavigateToCouncil} />
    </div>
  );
}

export default App;