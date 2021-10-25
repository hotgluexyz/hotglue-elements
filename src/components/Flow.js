import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'

import { Source } from './Source'
import Loading from './Loading'

export const Flow = ({
  name,
  description,
  flow,
  tenant,
  setOpening,
  hotglue,
  styleOverrides
}) => {
  const [supportedSources, setSupportedSources] = useState()
  const [sources, setSources] = useState()

  useEffect(() => {
    ;(async () => {
      setSupportedSources(await hotglue.getSupportedSources(flow))
    })()
  }, [])

  useEffect(() => {
    if (supportedSources) {
      const _sources = supportedSources.map(({ icon, tap, label }) => (
        <Source
          icon={icon}
          label={label}
          key={tap}
          tap={tap}
          tenant={tenant}
          flow={flow}
          setOpening={setOpening}
          styleOverrides={styleOverrides}
        />
      ))

      setSources(_sources)
    }
  }, [supportedSources])

  return (
    <div
      className={`${styles['hg-elements-flow']} ${styles['hg-elements-unlinkedFlow']}`}
      style={styleOverrides.unlinkedFlow}
    >
      <h4>{name} data</h4>
      <p>{description}</p>
      <div>{sources || <Loading />}</div>
    </div>
  )
}

export const LinkedFlow = ({
  name,
  description,
  tenant,
  flow,
  hotglue,
  setOpening,
  styleOverrides
}) => {
  const [linkedSources, setLinkedSources] = useState()
  const [sources, setSources] = useState()

  useEffect(() => {
    ;(async () => {
      setLinkedSources(await hotglue.getLinkedSources(flow, tenant))
    })()
  }, [])

  useEffect(() => {
    if (linkedSources) {
      const _sources = linkedSources.map(({ icon, tap, label }) => {
        return (
          <Source
            key={tap}
            linked
            icon={icon}
            label={label}
            tap={tap}
            tenant={tenant}
            flow={flow}
            setOpening={setOpening}
            styleOverrides={styleOverrides}
          />
        )
      })

      setSources(_sources)
    }
  }, [linkedSources])

  return (
    <div
      className={`${styles['hg-elements-flow']} ${styles['hg-elements-linkedFlow']}`}
      style={styleOverrides.linkedFlow}
    >
      <h4>{name} data</h4>
      <p>{description}</p>
      <div>{sources || <Loading />}</div>
    </div>
  )
}
