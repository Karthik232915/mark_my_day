import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AppState, Event, ODRequest, Student } from '../types';

interface AppContextType {
  state: AppState;
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  setODRequests: (requests: ODRequest[]) => void;
  updateODRequest: (request: ODRequest) => void;
  setTopStudents: (students: Student[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'SET_OD_REQUESTS'; payload: ODRequest[] }
  | { type: 'UPDATE_OD_REQUEST'; payload: ODRequest }
  | { type: 'SET_TOP_STUDENTS'; payload: Student[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    
    case 'SET_OD_REQUESTS':
      return { ...state, odRequests: action.payload };
    
    case 'UPDATE_OD_REQUEST':
      return {
        ...state,
        odRequests: state.odRequests.map(req =>
          req.id === action.payload.id ? action.payload : req
        )
      };
    
    case 'SET_TOP_STUDENTS':
      return { ...state, topStudents: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
};

const initialState: AppState = {
  events: [],
  odRequests: [],
  topStudents: [],
  isLoading: false,
  error: null
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setEvents = useCallback((events: Event[]) => {
    dispatch({ type: 'SET_EVENTS', payload: events });
  }, []);

  const addEvent = useCallback((event: Event) => {
    dispatch({ type: 'ADD_EVENT', payload: event });
  }, []);

  const setODRequests = useCallback((requests: ODRequest[]) => {
    dispatch({ type: 'SET_OD_REQUESTS', payload: requests });
  }, []);

  const updateODRequest = useCallback((request: ODRequest) => {
    dispatch({ type: 'UPDATE_OD_REQUEST', payload: request });
  }, []);

  const setTopStudents = useCallback((students: Student[]) => {
    dispatch({ type: 'SET_TOP_STUDENTS', payload: students });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  return (
    <AppContext.Provider value={{
      state,
      setEvents,
      addEvent,
      setODRequests,
      updateODRequest,
      setTopStudents,
      setLoading,
      setError
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};