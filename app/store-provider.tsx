'use client'
import { fetchSharedDeliveries } from '@/lib/features/deliveries/deliveries-slice'
import { fetchSharedProducts } from '@/lib/features/products/products-slice'
import { fetchSharedSales } from '@/lib/features/sales/sales-slice'
import { AppStore, store } from '@/lib/store'
import { useRef } from 'react'
import { Provider } from 'react-redux'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {

    storeRef.current = store

    // Retrieve shared data on startup
    storeRef.current.dispatch(fetchSharedSales())
    storeRef.current.dispatch(fetchSharedDeliveries())
    storeRef.current.dispatch(fetchSharedProducts())
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}