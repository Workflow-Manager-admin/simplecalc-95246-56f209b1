import React, { useState, useEffect } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  /**
   * Calculator frontend for minimalistic, light-themed calculator app.
   * Features:
   * - Centered calculator panel with display
   * - Digit and operator buttons
   * - Real-time result display and clear/reset functionality
   */
  const [theme] = useState('light'); // always light for this task
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  
  // Keyboard support for better UX (optional, basic keys)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (/[0-9+\-*/.]/.test(e.key)) {
        handleButton(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line
  });

  // Evaluate the current input safely
  const safeEval = (expr) => {
    try {
      // Basic safety: only allow numbers, operators, dot and spaces
      if (/^[\d+\-*/. ()]+$/.test(expr) && expr.match(/\d/)) {
        // eslint-disable-next-line no-eval
        // Replace repeated operators and format for eval
        // Clean trailing operators for accidental presses
        let cleaned = expr.replace(/([+\-*/.])\1+/g, '$1')
          .replace(/([+\-*/.])$/, '');
        // Prevent divide by zero
        if (cleaned.match(/\/\s*0(?!\d)/)) return '∞';
        // eslint-disable-next-line no-eval
        // Use Function constructor for slightly more safety
        // This is still not safe for arbitrary user input, 
        // but is reasonable for this controlled context.
        // For prod apps, use a proper math parser lib.
        // For our calculator: sufficient for basic four ops.
        // Remove spaces for consistent parsing
        // eslint-disable-next-line
        // Only for calculator project!
        // Syntax errors etc. will be caught and shown as 'Err'
        // Allow evaluation
        // No user functions, etc.
        // eslint-disable-next-line
        return String(Function(`"use strict";return (${cleaned})`)());
      }
      return 'Err';
    } catch {
      return 'Err';
    }
  };

  // PUBLIC_INTERFACE
  const handleButton = (val) => {
    if (result !== '' && /^[0-9.]$/.test(val)) {
      // If previous result was shown and number is pressed, reset input
      setInput(val);
      setResult('');
    } else if (result !== '' && /[+\-*/]/.test(val)) {
      // Continue calculation with result if operator pressed after result
      setInput(result + val);
      setResult('');
    } else {
      // Prevent multiple operators directly after each other (except minus for negative numbers)
      const lastChar = input.slice(-1);
      if (/[+\-*/]/.test(val) && (input === '' || /[+\-*/]/.test(lastChar))) {
        // Allow only '-' for starting a negative number
        if (val === '-' && (input === '' || /[+\-*/]/.test(lastChar))) {
          setInput(input + val);
        }
        // Else: ignore other duplicate operators
        return;
      } else if (val === '.') {
        // Prevent multiple decimals in one number segment
        const parts = input.split(/[+\-*/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) return;
      }
      setInput(input + val);
    }
  };

  // PUBLIC_INTERFACE
  const handleEquals = () => {
    if (!input) return;
    const res = safeEval(input);
    setResult(res);
  };

  // PUBLIC_INTERFACE
  const handleClear = () => {
    setInput('');
    setResult('');
  };

  // Calculator button definitions
  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  // Define colors per requirement
  const COLOR_PRIMARY = '#1976D2';
  const COLOR_SECONDARY = '#1565C0';
  const COLOR_ACCENT = '#FFEB3B';

  return (
    <div className="App" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <main>
          <section
            aria-label="Calculator"
            style={{
              background: '#fff',
              borderRadius: '18px',
              boxShadow:
                '0 2px 12px 0 rgba(25, 118, 210, 0.08), 0 0.5px 1.2px 0 rgba(25, 118, 210, 0.15)',
              padding: '2.5rem 2rem 1.5rem 2rem',
              minWidth: 280,
              maxWidth: 340,
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              alignItems: 'stretch',
              justifyContent: 'center',
            }}
            data-testid="calculator-panel"
          >
            {/* Display */}
            <div
              aria-label="Display"
              style={{
                minHeight: 54,
                background: '#f5f5f5',
                borderRadius: '10px',
                marginBottom: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '1.65rem',
                color: COLOR_PRIMARY,
                textAlign: 'right',
                fontWeight: 500,
                boxShadow: '0 0.5px 0.5px 0 #e0e0e0',
                overflowX: 'auto',
                border: `1.5px solid ${COLOR_PRIMARY}33`,
                letterSpacing: '1.1px',
                outline: 'none',
                userSelect: 'all',
              }}
            >
              {result !== '' ? (
                <span>
                  <span style={{ color: COLOR_SECONDARY, fontSize: '1.05rem', marginRight: 6 }}>
                    {input}
                  </span>
                  <span style={{ color: COLOR_ACCENT }}>{result}</span>
                </span>
              ) : input ? input : <span style={{ opacity: 0.33 }}>0</span>}
            </div>
            {/* Buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                marginBottom: '0.5rem',
              }}
            >
              {buttons.flat().map((btn, idx) => {
                let type = 'digit';
                let styleBtn = {};
                if ('/*-+'.includes(btn)) type = 'operator';
                if (btn === '=') type = 'equals';
                if (btn === '0') styleBtn.gridColumn = 'span 1'; // No stretching zero
                if (btn === '=') styleBtn.background = COLOR_PRIMARY;
                if (btn === '=') styleBtn.color = COLOR_ACCENT;
                if (btn === '.') styleBtn.fontWeight = 600;
                if (type === 'operator') {
                  styleBtn.background = 'transparent';
                  styleBtn.border = `1.5px solid ${COLOR_SECONDARY}`;
                  styleBtn.color = COLOR_SECONDARY;
                }
                if (btn === '=') styleBtn.fontWeight = 700;
                if (btn === '=') styleBtn.boxShadow = `0 2px 8px 0 ${COLOR_PRIMARY}33`;

                return (
                  <button
                    key={btn + idx}
                    aria-label={btn === '*' ? 'multiply' : btn === '/' ? 'divide' : btn}
                    onClick={() => {
                      if (btn === '=') handleEquals();
                      else handleButton(btn);
                    }}
                    style={{
                      fontSize: 20,
                      borderRadius: 9,
                      border: type === 'digit' ? `1.5px solid #e0e0e0` : styleBtn.border,
                      background: type === 'digit' ? '#f8f9fa' : styleBtn.background,
                      color: styleBtn.color || (type === 'digit' ? COLOR_PRIMARY : undefined),
                      fontWeight: styleBtn.fontWeight || 500,
                      boxShadow: styleBtn.boxShadow || undefined,
                      padding: '19px 0',
                      transition: 'all 0.14s',
                      outline: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      gridColumn: styleBtn.gridColumn,
                    }}
                    data-testid={`btn-${btn}`}
                  >
                    {btn === '*' ? '×' : btn === '/' ? '÷' : btn}
                  </button>
                );
              })}
            </div>
            {/* Clear/Reset button */}
            <button
              aria-label="Clear Calculator"
              onClick={handleClear}
              style={{
                background: COLOR_ACCENT,
                color: COLOR_SECONDARY,
                fontWeight: 700,
                fontSize: '1rem',
                border: `1.5px solid ${COLOR_SECONDARY}`,
                borderRadius: 8,
                padding: '10px 0',
                marginTop: '0.35rem',
                boxShadow: '0 0.5px 1.5px 0 #ccc',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'background 0.2s,color 0.2s',
              }}
              data-testid="btn-clear"
            >
              Clear
            </button>
            {/* Accessibility instruction */}
            <div
              style={{
                fontSize: 12,
                color: '#aaa',
                textAlign: 'center',
                marginTop: 4,
                opacity: 0.6,
                letterSpacing: '0.5px',
              }}
            >
              Basic calculator · Use keyboard or click buttons
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
