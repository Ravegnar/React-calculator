import { AKCE } from './App.js'

export default function UkonButton({ dispatch, operace }) {
    return (<button onClick={() => dispatch({ typ: AKCE.VYBER_OPERACI, zdroj: { operace } })}>{operace}</button>
)}