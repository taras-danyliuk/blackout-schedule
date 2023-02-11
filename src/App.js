import './App.css';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);


const red = '#d2222d';
const green = '#238823';
const yellow = '#ffbf00';
const dataset = {
  data: [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
  ],
  backgroundColor: [
    red, red, red, red, red, red, red, red, red, red, red, red,
    red, red, red, red, red, red, red, red, red, red, red, red
  ],
  borderColor: ['rgba(0,0,0,0.1']
}
const initialData = { datasets: [dataset] };


function App() {
  const [data, setData] = useState(initialData);
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState(localStorage.getItem('message') || '');
  const [message, setMessage] = useState(value);
  const [parsedMessage, setParsedMessage] = useState({});
  const [activeSection, setActiveSection] = useState(localStorage.getItem('activeSection') || '');
  const [date, setDate] = useState('22');
  const [queueListOpen, setQueueListOpen] = useState(localStorage.getItem('queueListOpen') === 'true');

  useEffect(() => {
    if (localStorage.getItem('queueListOpen') === null) {
      localStorage.setItem('queueListOpen', 'true');
      setQueueListOpen(true);
    }
  }, [])

  useEffect(() => {
    try {
      const grouped = {}
      let lines = message.split('\n').filter(line => !!line.length);
      if (lines[0]) {
        const index = lines[0].search(/\d/);
        const targetDate = lines[0].substring(index).replace(/[^\dА-яі\s]/g, '').trim();
        setDate(targetDate);
      }

      lines = lines.filter(line => line.includes(':00') || line.includes('Підчерг'))

      let current = '';
      lines.forEach(line => {
        if (line.includes('Підчерг')) return current = line.replace(/[^\d.,\s]/g, '').trim();
        if (line.includes('4.1')) grouped['4.1'] = line;
        if (line.includes('4.2')) grouped['4.2'] = line;
        if (line.includes('4.3')) grouped['4.3'] = line;
        if (line.includes('4.4')) grouped['4.4'] = line;
        if (current && !grouped[current]) grouped[current] = [];
        if (current) grouped[current].push(line)
      });

      setParsedMessage(grouped);
    }
    catch(e) {
      console.log(e)
    }
  }, [message])

  useEffect(() => {
    try {
      if (!activeSection || !parsedMessage[activeSection]) return;
      const bgs = [...dataset.backgroundColor];
      const parseAndSet = (string, color) => {
        if (!string) return;

        const ranges = string.split(/,| та /g).map(el => {
          return el
            .replace(/[^\d:\s]/g, '')
            .trim()
            .replace(/\s{2,}/, ' ')
        });
        ranges.forEach(range => {
          const [from, to] = range.split(' ');
          const fromNumber = +from.replace(/:.+/g, '');
          let toNumber = +to.replace(/:.+/g, '');
          // 24:00 sometimes is marked as 00:00
          if (toNumber === 0) toNumber = 24;

          for (let i = fromNumber; i < toNumber; i++) {
            bgs[i] = color;
          }
        })
      }

      if (activeSection === '4.1' || activeSection === '4.2' || activeSection === '4.3' || activeSection === '4.4') {
        bgs.fill(green);
        const line = parsedMessage[activeSection].replace(/4.1|4.2|4.3|4.4/g, '');
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
    }
    catch(e) {
      console.log(e)
    }
  }, [activeSection, parsedMessage])


  const onSave = () => {
    localStorage.setItem('message', value);
    if (message !== value) setData(initialData);
    setMessage(value);
    setShowInput(false);
  }

  const onSelect = (key) => {
    localStorage.setItem('activeSection', key);
    setActiveSection(key);
  }

  const onClickQueueList = () => {
    localStorage.setItem('queueListOpen', (!queueListOpen).toString());
    setQueueListOpen(!queueListOpen);
  }


  return (
    <div className="wrapper">
      <div className={`queue-picker ${queueListOpen ? 'opened' : ''}`} onClick={onClickQueueList}>
        {activeSection && parsedMessage[activeSection] ? (
          <span>{activeSection}</span>
        ) : (
          <span>—</span>
        )}
      </div>

      {queueListOpen && (
        <div className='queue-wrapper'>
          {Object.keys(parsedMessage).map(queue => (
            <div key={queue} className='queue-button' onClick={() => onSelect(queue)}>{queue}</div>
          ))}
        </div>
      )}

      <div className='chart-wrapper'>
        <div className="chart-holder">
          <Doughnut data={data} options={{plugins: {tooltip: { enabled: false }}}}/>

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

          <span className='number' style={{ top: '46%', left: '50%', fontSize: '20px' }}>
            {activeSection && !!parsedMessage[activeSection] ? activeSection : '—'}
          </span>

          <span className='number' style={{ top: '54%', left: '50%' }}>
            {!!date ? `на ${date}` : '—'}
          </span>
        </div>
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
