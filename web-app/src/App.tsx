/**
 * Main Application Component
 */

import { useState } from 'react';
import { Router, Route } from 'wouter';
import { InputForm } from './pages/InputForm';
import { ResultsPage } from './pages/ResultsPage';
import { BOQPage } from './pages/BOQPage';
import { executeCompleteDesign } from './calc/orchestrator';
import type { DesignInput, CompleteDesignOutput } from './types/design';

export function App() {
  const [results, setResults] = useState<CompleteDesignOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<'input' | 'results' | 'boq'>('input');

  const handleDesignSubmit = async (inputs: DesignInput) => {
    try {
      setIsLoading(true);
      const output = executeCompleteDesign(inputs);
      setResults(output);
      setCurrentPage('results');
    } catch (error) {
      console.error('Design calculation error:', error);
      alert('Error calculating design. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewDesign = () => {
    setResults(null);
    setCurrentPage('input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold" data-testid="header-title">
            🌉 IRC:6-2016 Bridge Design System
          </h1>
          <p className="text-blue-100 mt-1">
            Submersible Slab Bridge Design Generator
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          <button
            onClick={() => setCurrentPage('input')}
            className={`px-6 py-4 font-medium transition ${
              currentPage === 'input'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            data-testid="tab-input"
          >
            Design Input
          </button>
          {results && (
            <>
              <button
                onClick={() => setCurrentPage('results')}
                className={`px-6 py-4 font-medium transition ${
                  currentPage === 'results'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                data-testid="tab-results"
              >
                Results
              </button>
              <button
                onClick={() => setCurrentPage('boq')}
                className={`px-6 py-4 font-medium transition ${
                  currentPage === 'boq'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                data-testid="tab-boq"
              >
                Bill of Quantities
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'input' && (
          <InputForm onSubmit={handleDesignSubmit} isLoading={isLoading} />
        )}
        
        {currentPage === 'results' && results && (
          <ResultsPage results={results} onNewDesign={handleNewDesign} />
        )}
        
        {currentPage === 'boq' && results && (
          <BOQPage boq={results.boq} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>IRC:6-2016 & IRC:112-2015 Compliant Bridge Design System</p>
          <p className="mt-2">
            Design Engine: TypeScript • UI: React + Vite • Styling: Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
