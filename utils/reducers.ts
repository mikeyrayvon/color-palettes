import { StoreIF } from './store'

interface ActionIF {
  type: string 
  payload: any
} 

export const storeReducer = (state: StoreIF, action: ActionIF) => {
  switch(action.type) {
    case 'add color':
      return {
        ...state,
        colors: [
          ...state.colors,
          action.payload
        ]
      }
    case 'update color':
      const colors = state.colors.map(c => c.order === action.payload.order ? action.payload : c)
      return {
        ...state,
        colors
      }
    default:
      throw new Error()
  }
}