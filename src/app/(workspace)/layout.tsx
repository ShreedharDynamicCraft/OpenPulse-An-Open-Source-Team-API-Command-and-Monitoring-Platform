import { SidebarProvider } from '@/components/ui/sidebar'
import { currentUser } from '@/modules/authentication/actions'
import Header from '@/modules/Layout/components/header'
import { initializeWorkspace } from '@/modules/workspace/actions'
import TabbedLeftPanel from '@/modules/workspace/components/tabbed-left-panel'
import React from 'react'

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const workspace = await initializeWorkspace()

  const user = await currentUser()
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* @ts-ignore */}
      <Header user={user!} workspace={workspace.workspace!} />
      <main className="flex-1 min-h-0 flex overflow-hidden">
        <div className="flex h-full w-full overflow-hidden">
          
          <div className="w-12 border-r border-zinc-800 bg-zinc-900 shrink-0 h-full">
            <TabbedLeftPanel />
          </div>
          <div className="flex-1 min-w-0 bg-zinc-950 h-full overflow-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

export default RootLayout