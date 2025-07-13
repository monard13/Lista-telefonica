
import React, { useState, useEffect } from 'react';
import { phoneNumbers } from './constants/phoneNumbers';
import ChecklistItem from './components/ChecklistItem';

const App: React.FC = () => {
  // Cargar el estado inicial desde localStorage o crear un array nuevo
  const [checkedState, setCheckedState] = useState<boolean[]>(() => {
    try {
      const savedState = localStorage.getItem('checkedPhoneCalls');
      return savedState ? JSON.parse(savedState) : new Array(phoneNumbers.length).fill(false);
    } catch (error) {
      console.error("Failed to parse checked state from localStorage", error);
      return new Array(phoneNumbers.length).fill(false);
    }
  });

  // Guardar el estado en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('checkedPhoneCalls', JSON.stringify(checkedState));
  }, [checkedState]);


  const handleToggle = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const totalCalls = phoneNumbers.length;
  const completedCalls = checkedState.filter(Boolean).length;
  const progress = totalCalls > 0 ? (completedCalls / totalCalls) * 100 : 0;

  return (
    <div className="flex justify-center items-start min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-2xl w-full my-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            Lista de Llamadas Pendientes
          </h1>
          <p className="text-gray-500 mt-2">
            Completa tus llamadas y sigue tu progreso.
          </p>
        </div>

        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-700">Progreso</span>
                <span className="text-sm font-medium text-blue-700">{completedCalls} de {totalCalls}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}>
                </div>
            </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="flex items-center py-3 px-1 border-b-2 border-gray-300">
              <div className="w-10"></div>
              <div className="flex-grow font-bold text-gray-600 uppercase text-sm">
                Número de teléfono
              </div>
          </div>
          <div id="phoneList" className="divide-y divide-gray-100">
            {phoneNumbers.map((number, index) => (
              <ChecklistItem
                key={index}
                number={number}
                isChecked={checkedState[index]}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
