import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:5000';

function App() {

  // States
  const [value, setValue] = useState(0);
  const [stack, setStack] = useState([]);
  const [error, setError] = useState('');

  // Get stack on mount
  useEffect(()=>{
    var headers = new Headers();
    headers.append("accept", "application/json");
    fetch(API_URL,{ 
      headers,
      credentials: 'include'
    })
    .then(res => {
      if(!res.ok) {
        return res.json().then(json => {setError(json.error || 'Unable to fetch stack'); throw new Error(res.statusText); })
      }
      return res.json()
    })
    .then(json => { setStack(json); setError(''); })
    .catch(err => { console.log(err) })
  }, []);

  // Handle Input value changes
  const handleChange = (e) => setValue(e.target.value);

  // Append input content to stack
  const handleAppend = () => {
    var headers = new Headers();
    headers.append("accept", "application/json")
    headers.append("Content-Type", "application/json")
    fetch(API_URL + '/append', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({value})
    })
    .then(res => {
      if(!res.ok) {
        return res.json().then(json => {setError(json.error || 'Unable to append to stack'); throw new Error(res.statusText); })
      }
      return res.json()
    })
    .then(json => { setStack(json); setError(''); })
    .catch(err => { console.log(err) });
  };

  // Append operations over stack
  const handleOperation = (operation) => {
    var headers = new Headers();
    headers.append("accept", "application/json")
    fetch(API_URL + '/' + operation, {
      headers,
      credentials: 'include'
    })
    .then(res => {
      if(!res.ok) {
        return res.json().then(json => {setError(json.error || 'Unable to process operation over stack'); throw new Error(res.statusText); })
      }
      return res.json()
    })
    .then(json => { setStack(json); setError(''); })
    .catch(err => { console.log(err) });
  };


  return (
    <div className="App" style={{paddingTop: 50}}>
      <h3>RPN Calculator</h3>
      <div style={{padding: 12}}>
        <input type="number" step="0.1" defaultValue={value} onChange={handleChange}/>
        <button onClick={handleAppend}>Append</button>
      </div>
      { !!error && <span style={{color: 'red', padding: 4}}>{error}</span> }
      <div  style={{paddingTop: 12}}>
        <button onClick={() => handleOperation('add')} disabled={stack.length < 2}>+</button>
        <button onClick={() => handleOperation('substract')} disabled={stack.length < 2}>-</button>
        <button onClick={() => handleOperation('multiply')} disabled={stack.length < 2}>*</button>
        <button onClick={() => handleOperation('divide')} disabled={stack.length < 2}>/</button>
        <button onClick={() => handleOperation('clean')}>clean</button>
      </div>
      <h4>Stack</h4>
      <div>
        { stack.length === 0 && <span>Empty</span> }
        { stack.length > 0 && [...stack].reverse().map((v, i) => <div key={i.toString()}>{v}</div>) }
      </div>
    </div>
  );
}

export default App;
