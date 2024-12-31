import React, { useState } from 'react';

import { Field, FieldList, FieldMessage } from './makeAdComponents';
import { FieldButton, FieldListButton, FieldMessageButton, ClearAllButton, UndoButton, RedoButton, PreviewButton } from './makeAdComponents';

const MakeAd = () => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [sequence, setSequence] = useState([]);
  const [lastDeleted, setLastDeleted] = useState({});

  const handleClick = (type) => {
    const id = Date.now();
    let newComponent = { id, type };

    switch (type) {
      case 'field':
        newComponent = { ...newComponent, label: '', value: '' };
        break;
      case 'fieldList':
        newComponent = { ...newComponent, label: '', items: [] };
        break;
      case 'fieldMessage':
        newComponent = { ...newComponent, message: '' };
        break;
      default:
        break;
    }

    setSequence((prevSequence) => {
      const updatedSequence = [...prevSequence, newComponent];
      setHistory((prevHistory) => [...prevHistory, { action: 'add', component: newComponent }]);
      return updatedSequence;
    });
  };

  const handleChange = (id, name, value) => {
    setSequence((prevSequence) =>
      prevSequence.map((component) =>
        component.id === id ? { ...component, [name]: value } : component
      )
    );
    setHistory((prevHistory) =>
      prevHistory.map((entry) =>
        entry.component.id === id ? { ...entry, component: { ...entry.component, [name]: value } } : entry
      )
    );
  };

  const handleDelete = (id) => {
    let deletedIndex = 0;
    setLastDeleted({
      deletedComponent:(sequence.filter((component, index) => {
        if(component.id === id){
          deletedIndex = index;
        }
        return component.id === id
      })
      )[0], 
      deletedIndex:deletedIndex
    });
    setSequence(sequence.filter((component) => component.id !== id));
    console.log(lastDeleted);
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const newHistory = [...history];
    const lastAction = newHistory.pop();

    if (lastAction) {
      setundoHistory((prevUndoHistory) => [...prevUndoHistory, lastAction]);

      switch (lastAction.action) {
        case 'add':
          setSequence((prevSequence) =>
            prevSequence.filter((component) => component.id !== lastAction.component.id)
          );
          break;
        case 'delete':
          setSequence((prevSequence) => [...prevSequence, lastAction.component]);
          break;
        case 'clear':
          setSequence(lastAction.components);
          break;
        default:
          break;
      }
    }

    setHistory(newHistory);
  };

  const handleRedo = () => {
    if (undohistory.length === 0) return;

    const newUndoHistory = [...undohistory];
    const prevAction = newUndoHistory.pop();

    if (prevAction) {
      setHistory((prevHistory) => [...prevHistory, prevAction]);

      switch (prevAction.action) {
        case 'add':
          setSequence((prevSequence) => [...prevSequence, prevAction.component]);
          break;
        case 'delete':
          setSequence((prevSequence) =>
            prevSequence.filter((component) => component.id !== prevAction.component.id)
          );
          break;
        case 'clear':
          setSequence([]);
          break;
        default:
          break;
      }
    }

    setundoHistory(newUndoHistory);
  };

  const isUndoDisabled = history.length === 0;
  const isRedoDisabled = undohistory.length === 0;
  const isClearAllDisabled = sequence.length === 0;

  return (
    <div className="mt-10 p-6 bg-gray-100 min-h-[600px] flex flex-col gap-6 dark:bg-gray-900">
      <h1 className="text-3xl font-bold dark:text-white transition-all duration-300 ease-in-out">Create Your Advertisement</h1>
      <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="w-full min-h-[500px] overflow-y-visible bg-white shadow-lg rounded-md p-6 flex flex-col gap-4 transition-all duration-300 ease-in-out">
          <input
            className="w-full px-4 py-2 text-xl font-semibold border-b mb-4 focus:outline-none transition-all duration-300"
            placeholder="Enter Advertisement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex flex-col gap-4">
            {sequence.map((component) => {
              switch (component.type) {
                case 'field':
                  return (
                    <Field
                      key={component.id}
                      component={component}
                      onChange={handleChange}
                      onDelete={handleDelete}
                    />
                  );
                case 'fieldList':
                  return (
                    <FieldList
                      key={component.id}
                      component={component}
                      onChange={handleChange}
                      onDelete={handleDelete}
                    />
                  );
                case 'fieldMessage':
                  return (
                    <FieldMessage
                      key={component.id}
                      component={component}
                      onChange={handleChange}
                      onDelete={handleDelete}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
          <div className="flex justify-between items-center mt-auto">
            <label className="font-semibold text-gray-700">Deadline:</label>
            <input
              className="px-2 py-2 text-sm md:text-md font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 bg-gradient-to-r from-gray-100 to-gray-300 text-gray-800 hover:scale-105 focus:ring-offset-2 transform ease-in-out"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Select Deadline"
            />
          </div>
        </div>
        <div className="md:w-1/3 w-full flex flex-col  gap-4">
          <FieldButton onClick={() => handleClick('field')} />
          <FieldListButton onClick={() => handleClick('fieldList')} />
          <FieldMessageButton onClick={() => handleClick('fieldMessage')} />
          <ClearAllButton onClick={handleClearAll} isDisabled={isClearAllDisabled} />
          <div className="flex gap-2">
            <UndoButton onClick={handleUndo} his={isUndoDisabled} />
            <RedoButton onClick={handleRedo} his={isRedoDisabled} />
          </div>
          <PreviewButton onClick={handleRedo} his={isRedoDisabled} />
        </div>
      </div>
    </div>
  );
};

export default MakeAd;

