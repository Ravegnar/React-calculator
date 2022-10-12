import { useReducer } from "react";
import CisliceButton from "./CisliceButton.js";
import UkonButton from "./UkonButton.js";
import "./styles.css"

export const AKCE = {
  PRIDEJ_CISLICI: 'pridej-cislici',
  VYBER_OPERACI: 'vyber-operaci',
  VYCISTIT: 'vycistit',
  SMAZAT_CISLICI: 'smazat-cislici',
  ROVNA_SE: 'rovna-se'
}

function reducer(state, { typ, zdroj}) {
  switch (typ) {
    case AKCE.PRIDEJ_CISLICI:
      if (state.prepsani) {
        return {
          ...state,
          soucasneCislo: zdroj.cislice,
          prepsani: false,
        }
      }
      if (zdroj.cislice === "0" && state.soucasneCislo === "0") {
        return state
      }
      if (zdroj.cislice === "." && zdroj.cislice === "" && state.soucasneCislo.includes(".")) {
        return state
      }
        return {
          ...state,
          soucasneCislo: `${state.soucasneCislo || ""}${zdroj.cislice}`,
        }
    case AKCE.VYBER_OPERACI:
        if (state.soucasneCislo == null && state.minuleCislo == null) {
          return state
        }

        if (state.soucasneCislo == null) {
          return {
            ...state,
            operace: zdroj.operace
          }
        }
        if (state.minuleCislo == null) {
          return {
            ...state,
            operace: zdroj.operace,
            minuleCislo:state.soucasneCislo,
            soucasneCislo: null
          }
        }

        return {
          ...state,
          minuleCislo: rovnaSe(state),
          operace: zdroj.operace,
          soucasneCislo: null
        }
    case AKCE.VYCISTIT:
      return {state};
    case AKCE.SMAZAT_CISLICI:
      if (state.prepsani) {
        return {
          ...state,
          prepsani: false,
          soucasneCislo: null
        }
      }
      if (state.soucasneCislo == null) return state
      if (state.soucasneCislo.length === 1) {
        return { ...AKCE.state, soucasneCislo: null }
      }

      return {
        ...state,
        soucasneCislo: state.soucasneCislo.slice(0, -1)
      }
    case AKCE.ROVNA_SE:
      if (state.operace == null || state.soucasneCislo == null || state.minuleCislo == null) {
        return state
      }
      return {
        ...state,
        prepsani: true,
        minuleCislo: null,
        operace: null,
        soucasneCislo: rovnaSe(state)
      }
  }
}

function rovnaSe({ soucasneCislo, minuleCislo, operace}) {
  const minule = parseFloat(minuleCislo)
  const soucasne = parseFloat(soucasneCislo)
  if (isNaN(minule) || isNaN(soucasne)) return ""
  let vypocet = ""
  switch (operace) {
    case "+":
      vypocet = minule + soucasne
      break
    case "-":
      vypocet = minule - soucasne
      break
    case "*":
      vypocet = minule * soucasne
      break
    case "÷":
      vypocet = minule / soucasne
      break
  }

  return vypocet.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{soucasneCislo, minuleCislo, operace}, dispatch] = useReducer(reducer, {});
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(minuleCislo)} {operace}</div>
        <div className="current-operand">{formatOperand(soucasneCislo)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ typ: AKCE.VYCISTIT })}>AC</button>
      <button onClick={() => dispatch({ typ: AKCE.SMAZAT_CISLICI })}>DEL</button>
      <UkonButton operace="÷" dispatch={dispatch} />
      <CisliceButton cislice="1" dispatch={dispatch} />
      <CisliceButton cislice="2" dispatch={dispatch} />
      <CisliceButton cislice="3" dispatch={dispatch} />
      <UkonButton operace="*" dispatch={dispatch} />
      <CisliceButton cislice="4" dispatch={dispatch} />
      <CisliceButton cislice="5" dispatch={dispatch} />
      <CisliceButton cislice="6" dispatch={dispatch} />
      <UkonButton operace="+" dispatch={dispatch} />
      <CisliceButton cislice="7" dispatch={dispatch} />
      <CisliceButton cislice="8" dispatch={dispatch} />
      <CisliceButton cislice="9" dispatch={dispatch} />
      <UkonButton operace="-" dispatch={dispatch} />
      <CisliceButton cislice="." dispatch={dispatch} />
      <CisliceButton cislice="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ typ: AKCE.ROVNA_SE })}>=</button>
    </div>
  );
}

export default App;
