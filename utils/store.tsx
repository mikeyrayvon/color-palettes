import { createContext, useContext, useReducer } from 'react'
import { storeReducer } from './reducers'
import { Color } from './types'

export interface StoreIF {
  colors: Color[]
}

const initialStoreState = {
  colors: [],
}

const AppContext = createContext<{
  state: StoreIF
  dispatch: React.Dispatch<any>
}>({
  state: initialStoreState,
  dispatch: () => null
})

const AppProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer(storeReducer, initialStoreState);

  return (
    <AppContext.Provider value={{state, dispatch}}>
      {children}
    </AppContext.Provider>
  )
}

export const useStore = () => useContext(AppContext)

export { AppContext, AppProvider };