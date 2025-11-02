"use client"
import { Unplug } from 'lucide-react'
import React from 'react'
import UserButton from '@/modules/authentication/components/user-button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import InviteMember from './invite-member'
import WorkSpace from './workspace'
import RoleBadge from '@/modules/workspace/components/role-badge'
import RoleUpgradeButton from '@/modules/workspace/components/role-upgrade-button'
import NotificationBell from '@/components/notification-bell'
import { useWorkspaceStore } from '../store'
import { useGetCurrentMemberRole } from '@/modules/workspace/hooks/workspace-members'
import { UserProps, WorkspaceProps } from '../types'


interface Props {
  user: UserProps
  workspace: WorkspaceProps
}

const Header = ({ user, workspace }: Props) => {
  const { selectedWorkspace } = useWorkspaceStore();
  const { data: currentRole } = useGetCurrentMemberRole(selectedWorkspace?.id || '');

  return (
    <header className='flex items-center justify-between gap-4 overflow-x-auto overflow-hidden p-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-gradient-to-r dark:from-zinc-950 dark:to-zinc-900 shadow-lg'>
      <div className='flex items-center justify-between space-x-2 hover:cursor-pointer hover:opacity-80 ml-4 group'>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg group-hover:shadow-indigo-500/50 transition-shadow duration-300">
            <Unplug size={20} className='text-white' />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            API Tester
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedWorkspace?.id && (
            <>
              <RoleBadge workspaceId={selectedWorkspace.id} />
              {currentRole && (
                <RoleUpgradeButton
                  workspaceId={selectedWorkspace.id}
                  currentRole={currentRole}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className='flex items-center justify-end space-x-3 hover:cursor-pointer hover:opacity-80'>
        <ThemeToggle />
        {selectedWorkspace?.id && (
          <NotificationBell workspaceId={selectedWorkspace.id} />
        )}
        <InviteMember />
        {/* @ts-ignore */}
        <WorkSpace workspace={workspace} />
        <UserButton user={user} size='sm' />
      </div>
    </header>
  )
}

export default Header