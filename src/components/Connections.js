import React, { useEffect, useState } from 'react'
import useInterval from './useInterval'
import styles from './styles.module.css'

import Loading from './Loading'

import { Flow, LinkedFlow } from './Flow'

const Connections = ({
  tenant,
  onLink,
  onUnlink,
  onWidgetClose,
  onPopupClose,
  loadingComponent,
  styleOverrides = {}
}) => {
  const [supportedFlows, setSupportedFlows] = useState()
  const [linkedFlows, setLinkedFlows] = useState()

  const [isLoading, setLoading] = useState(true)
  const [isOpening, setOpening] = useState(false)
  const [isRefreshing, setRefreshing] = useState(false)
  const [listenerMounted, setListenerMounted] = useState(false)

  const hotglue = window && window.HotGlue

  // Uses an interval to wait for the hotglue instance
  // to load and then requests data.
  // Long-term, a better solution should be implemented.
  const [supportedFlowsLoader, stopSupportedFlowsLoader] = useInterval(
    async () => {
      if (typeof supportedFlows === 'undefined' && hotglue?.hasMounted()) {
        setSupportedFlows(await hotglue?.getSupportedFlows())
      }
    },
    1000
  )

  // On update of supportedFlows
  useEffect(() => {
    if (supportedFlows && supportedFlowsLoader) stopSupportedFlowsLoader()
  }, [supportedFlows])

  // Helper function to make loading state management more readable.
  const loadingCompleted = () => {
    // Exit early if loading has already completed.
    if (!isLoading || isRefreshing) return false
    return supportedFlows && linkedFlows
  }

  // Helper function to fetch linked flows
  const fetchLinkedFlows = (_) => {
    if (linkedFlows) return

    if (hotglue && hotglue.hasMounted()) {
      hotglue.getLinkedFlows(tenant).then((_linkedFlows) => {
        setLinkedFlows(_linkedFlows)
      })
    } else {
      setTimeout(() => fetchLinkedFlows(), 1000)
    }
  }

  const refreshData = () => {
    setLinkedFlows(undefined)
    setSupportedFlows(undefined)
    setRefreshing(false)
  }

  const triggerRefresh = () => {
    setRefreshing(true)
    setLoading(true)
  }

  // Mark loading complete once loading has finished
  useEffect((_) => {
    if (loadingCompleted()) {
      setLoading(false)
    }

    if (hotglue && hotglue.hasMounted() && !listenerMounted) {
      setListenerMounted(true)

      hotglue.setListener({
        onPopupClose: (id, flowId) => {
          // Set opening to false
          setOpening(false)
          // Forward to listener, if set
          onPopupClose && onPopupClose(id, flowId)
        },
        onWidgetClose: () => {
          // Set opening to false
          setOpening(false)
          // Forward to listener, if set
          onWidgetClose && onWidgetClose()
        },
        onSourceLinked: (source, flowId) => {
          // Refresh data
          triggerRefresh()
          // Forward to listener, if set
          onLink && onLink(source, flowId)
        },
        onSourceUnlinked: (source, flowId) => {
          // Refresh data
          triggerRefresh()
          // Forward to listener, if set
          onUnlink && onUnlink(source, flowId)
        }
      })
    }
  })

  useEffect(() => {
    if (isLoading && isRefreshing) {
      // Once refresh is triggered, fetch the data
      refreshData()
    }
  }, [isLoading, isRefreshing])

  // On update of linkedFlows
  useEffect(() => {
    if (!linkedFlows) {
      // Fetch linked flows
      fetchLinkedFlows()
    }
  }, [linkedFlows])

  if (isLoading || isOpening) {
    return (
      <div
        className={styles['hg-elements-loadingContainer']}
        style={styleOverrides.loadingContainer}
      >
        {loadingComponent || <Loading />}
      </div>
    )
  }

  const createFlow = (supportedFlow) => {
    const { id: flow, name, description } = supportedFlow

    return {
      flow,
      name,
      description
    }
  }

  const createLinkedFlow = (linkedFlow) => {
    const { id: flow, name, description } = linkedFlow
    // const { label, icon, tap } = linkedSources[flow]

    return {
      isLinked: true,
      flow,
      name,
      description
      // label,
      // icon,
      // tap
    }
  }

  const flows = supportedFlows
    .filter((sf) => !sf.type)
    .map((supportedFlow) => {
      const linkedFlow = linkedFlows.find(
        (flow) => flow.id === supportedFlow.id
      )

      if (linkedFlow) {
        return createLinkedFlow(linkedFlow)
      }

      return createFlow(supportedFlow)
    })

  // Sort flows by name alphabetically
  flows.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })

  const flowElements = flows.map((_flow) => {
    if (_flow.isLinked) {
      const { name, description, icon, label, flow, tap } = _flow

      return (
        <LinkedFlow
          name={name}
          description={description}
          icon={icon}
          label={label}
          tenant={tenant}
          flow={flow}
          hotglue={hotglue}
          tap={tap}
          key={flow}
          setOpening={setOpening}
          styleOverrides={styleOverrides}
        />
      )
    }

    const { flow, name, description } = _flow
    return (
      <Flow
        name={name}
        description={description}
        hotglue={hotglue}
        flow={flow}
        tenant={tenant}
        key={flow}
        setOpening={setOpening}
        styleOverrides={styleOverrides}
      />
    )
  })

  return (
    <div
      className={styles['hg-elements-flowContainer']}
      style={styleOverrides.flowContainer}
    >
      {flowElements}
    </div>
  )
}

export default Connections
