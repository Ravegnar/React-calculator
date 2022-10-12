import { AKCE } from './App.js'

export default function CisliceButton({ dispatch, cislice }) {
    return (<button onClick={() => dispatch({ typ: AKCE.PRIDEJ_CISLICI, zdroj: { cislice } })}>{cislice}</button>
)}