import './App.css';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);


const red = '#d1001f';
const green = '#4cbb17';
const yellow = '#e5dE00';
const dataset = {
  data: [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
  ],
  backgroundColor: [
    red, red, red, red, red, red, red, red, red, red, red, red,
    red, red, red, red, red, red, red, red, red, red, red, red
  ],
  borderColor: ['rgba(0, 0, 0, 0.2)']
}
const initialData = { datasets: [dataset] };


const initialMessage = ``;

function App() {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState('');
  const [data, setData] = useState(initialData)
  const [message, setMessage] = useState(initialMessage)


  useEffect(() => {
    if (!message) return;
    const bgs = [...dataset.backgroundColor];
    const arr = message.split('\n');

    let off = '';
    let on = '';
    let possiblyOff = ''
    arr.forEach(el => {
      if (el.includes('черги будуть вимкнені')) off = el;
      if (el.includes('черги будуть з електропостачанням')) on = el;
      if (el.includes('можливі вимкнення')) possiblyOff = el;
    });

    const parseAndSet = (string, color) => {
      const ranges = string.split(',').map(el => {
        return el
          .replace(/[\-А-яі]/g, '')
          .trim()
          .replace(/\s{2,}/, ' ')
      })
      ranges.forEach(range => {
        const [from, to] = range.split(' ');
        const fromNumber = +from.replace(/:.+/g, '');
        const toNumber = +to.replace(/:.+/g, '');

        for (let i = fromNumber; i < toNumber; i++) {
          bgs[i] = color;
        }
      })
    }

    // Parse on
    parseAndSet(on, green);
    parseAndSet(off, red);
    parseAndSet(possiblyOff, yellow);

    setData({ datasets: [{ ...dataset, backgroundColor: bgs }] });
  }, [message])

  return (
    <div className="wrapper">
      <div className="chart-wrapper">
        <Doughnut data={data}/>

        <span className='number' style={{ top: '3%', left: '50%' }}>00</span>
        <span className='number' style={{ top: '4.5%', left: '62%' }}>1</span>
        <span className='number' style={{ top: '9%', left: '74%' }}>2</span>
        <span className='number' style={{ top: '17%', left: '84%' }}>3</span>
        <span className='number' style={{ top: '26.5%', left: '91.5%' }}>4</span>
        <span className='number' style={{ top: '38.5%', left: '96%' }}>5</span>
        <span className='number' style={{ top: '50.5%', left: '97.5%' }}>6</span>
        <span className='number' style={{ top: '63.5%', left: '96.5%' }}>7</span>
        <span className='number' style={{ top: '75%', left: '92%' }}>8</span>
        <span className='number' style={{ top: '84.5%', left: '84%' }}>9</span>
        <span className='number' style={{ top: '92%', left: '74%' }}>10</span>
        <span className='number' style={{ top: '97%', left: '62%' }}>11</span>
        <span className='number' style={{ bottom: '-12px', left: '50%' }}>12</span>
        <span className='number' style={{ top: '97%', left: '37.5%' }}>13</span>
        <span className='number' style={{ top: '92%', left: '26%' }}>14</span>
        <span className='number' style={{ top: '84.5%', left: '16%' }}>15</span>
        <span className='number' style={{ top: '75%', left: '8%' }}>16</span>
        <span className='number' style={{ top: '63.5%', left: '3.5%' }}>17</span>
        <span className='number' style={{ top: '51%', left: '10px' }}>18</span>
        <span className='number' style={{ top: '38.5%', left: '3.5%' }}>19</span>
        <span className='number' style={{ top: '27%', left: '8%' }}>20</span>
        <span className='number' style={{ top: '17%', left: '16%' }}>21</span>
        <span className='number' style={{ top: '9%', left: '26%' }}>22</span>
        <span className='number' style={{ top: '4.5%', left: '37.5%' }}>23</span>

        <span className='number' style={{ top: '50%', left: '50%', fontSize: '22px' }}>2.3-2.4</span>
      </div>

      <button className='button set' onClick={() => setShowInput(true)}>Set</button>

      {showInput && (
        <div className='input-wrapper'>
          <textarea className='input' value={value} onChange={e => setValue(e.target.value)} rows={20}/>

          <button className='button' onClick={() => {
            setMessage(value);
            setShowInput(false);
          }}>Save</button>
        </div>
      )}
    </div>
  );
}

export default App;
