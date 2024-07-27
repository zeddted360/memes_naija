'use client';
import { createContext, useReducer, Dispatch, ReactNode } from 'react';

 const DARK: string = '#21222a';
 const LIGHT: string = '#f9f9f9';

 //action variable;
 const SWITCH_THEME = 'TURN_DARK_LIGHT';
 //action type
 export type ActionType = {
   type: typeof SWITCH_THEME;
 };

 export type StateType = {
   theme: String;
   color: String;
 };
 const initialState: StateType = {
   theme: LIGHT,
   color: DARK,
 };

 export const ThemeContext = createContext<{
   state: StateType;
   dispatch: Dispatch<ActionType>;
 }>({
   state: initialState,
   dispatch: () => {},
 });

 const themeReducer = (state: StateType, action: ActionType): StateType => {
   switch (action.type) {
     case  'TURN_DARK_LIGHT':
       return {
         ...state,
         theme: state.theme === LIGHT ? DARK : LIGHT,
         color: state.color === DARK ? LIGHT : DARK,
       };
     default:
       return {
         ...state,
       };
   }
 };
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};
