import React from 'react'
import styles from './styles.module.css'

import SettingsIcon from './icons/Settings'
import DoneIcon from './icons/Done'

export const Source = ({
  linked = false,
  icon,
  label,
  tenant,
  flow,
  tap,
  setOpening,
  styleOverrides
}) => {
  const hotglue = window && window.HotGlue

  const onClickSource = (e) => {
    e.preventDefault()
    setOpening(true)
    hotglue.link(tenant, flow, tap)
  }

  return (
    <div
      className={styles['hg-elements-source']}
      onClick={onClickSource}
      style={Object.assign(
        { cursor: 'pointer' },
        linked ? styleOverrides.linkedSource : styleOverrides.unlinkedSource
      )}
    >
      <div
        className={styles['hg-elements-imageContainer']}
        style={styleOverrides.imageContainer}
      >
        <img src={icon} />
      </div>
      <div>
        <p>{label}</p>
        {linked ? (
          <div
            className={styles['hg-elements-connected']}
            style={styleOverrides.connected}
          >
            <span>Connected</span>
            <DoneIcon styleOverrides={styleOverrides} />
          </div>
        ) : null}
      </div>
      {linked && (
        <button onClick={() => hotglue.link(tenant, flow, tap)}>
          <SettingsIcon styleOverrides={styleOverrides} />
        </button>
      )}
    </div>
  )
}
