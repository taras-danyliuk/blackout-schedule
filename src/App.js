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


function App() {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState(localStorage.getItem('message') || '');
  const [message, setMessage] = useState(value);
  const [queues, setQueues] = useState([]);
  const [data, setData] = useState(initialData);

  const [parsedMessage, setParsedMessage] = useState({});
  const [activeSection, setActiveSection] = useState(localStorage.getItem('activeSection') || '');

  useEffect(() => {
    const grouped = {}
    const lines = message
      .split('\n')
      .filter(line => !!line.length && (line.includes(':00') || line.includes('Підчерг')))

    let current = '';
    lines.forEach(line => {
      if (line.includes('Підчерг')) return current = line;
      if (line.includes('4.1')) grouped['4.1'] = line;
      if (line.includes('4.2')) grouped['4.2'] = line;
      if (current && !grouped[current]) grouped[current] = [];
      grouped[current].push(line)
    });

    setQueues(Object.keys(grouped));
    setParsedMessage(grouped);
  }, [message])

  useEffect(() => {
    if (!activeSection || !parsedMessage[activeSection]) return;
    const bgs = [...dataset.backgroundColor];
    const parseAndSet = (string, color) => {
      const ranges = string.split(/,| та /g).map(el => {
        return el
          .replace(/[^\d:\s]/g, '')
          .trim()
          .replace(/\s{2,}/, ' ')
      });
      ranges.forEach(range => {
        const [from, to] = range.split(' ');
        const fromNumber = +from.replace(/:.+/g, '');
        const toNumber = +to.replace(/:.+/g, '');

        for (let i = fromNumber; i < toNumber; i++) {
          bgs[i] = color;
        }
      })
    }

    if (activeSection === '4.1' || activeSection === '4.2') {
      bgs.fill(green);
      const line = parsedMessage[activeSection].replace(/4.1|4.2/g, '');
      parseAndSet(line, red);
    }
    else {
      const [on, off, possiblyOff] = parsedMessage[activeSection];

      // Parse on
      parseAndSet(on, green);
      parseAndSet(off, red);
      parseAndSet(possiblyOff, yellow);
    }

    setData({ datasets: [{ ...dataset, backgroundColor: bgs }] });
  }, [activeSection, parsedMessage])


  const onSave = () => {
    localStorage.setItem('message', value);
    setMessage(value);
    setShowInput(false);
  }

  const onSelect = (key) => {
    localStorage.setItem('activeSection', key);
    setActiveSection(key);
  }


  return (
    <div className="wrapper">
      <div className='queue-wrapper'>
        {queues.map(queue => (
          <div key={queue} className='queue-button' onClick={() => onSelect(queue)}>
            {queue.replace(/[^\d.,\s]/g, '').trim()}
          </div>
        ))}
      </div>

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

        <span className='number' style={{ top: '50%', left: '50%' }}>
          {activeSection.replace(/[^\d.,\s]/g, '').trim()}
        </span>
      </div>

      <button className='button set' onClick={() => setShowInput(true)}>Set</button>

      {showInput && (
        <div className='input-wrapper'>
          <textarea className='input' value={value} onChange={e => setValue(e.target.value)} rows={20}/>
          <div>
            <button className='button outlined' onClick={() => setValue('')}>Clear</button>
            <button className='button' onClick={onSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
