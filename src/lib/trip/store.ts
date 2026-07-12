import type { MatchGroup, GroupMember, SharedExpense, GroupMessage } from "@/types"

type Listener<T> = (state: T) => void

function createStore<T>(initial: T) {
  let state = initial
  const listeners = new Set<Listener<T>>()
  
  return {
    get: () => state,
    set: (next: T) => {
      state = next
      listeners.forEach(fn => fn(state))
    },
    subscribe: (fn: Listener<T>) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}

export const groupStore = createStore<MatchGroup | null>(null)
export const expensesStore = createStore<SharedExpense[]>([])
export const messagesStore = createStore<GroupMessage[]>([])

export function setGroup(group: MatchGroup) {
  groupStore.set(group)
  localStorage.setItem("awaykit_group", JSON.stringify(group))
}

export function getStoredGroup(): MatchGroup | null {
  const stored = localStorage.getItem("awaykit_group")
  if (stored) {
    try {
      const group = JSON.parse(stored)
      groupStore.set(group)
      return group
    } catch {
      return null
    }
  }
  return groupStore.get()
}

export function updateMemberStatus(memberId: string, status: GroupMember["status"]) {
  const group = groupStore.get()
  if (!group) return
  
  const updated = {
    ...group,
    members: group.members.map(m => 
      m.id === memberId ? { ...m, status } : m
    ),
  }
  setGroup(updated)
}

export function addExpense(expense: SharedExpense) {
  expensesStore.set([...expensesStore.get(), expense])
  const group = groupStore.get()
  if (group) {
    setGroup({ ...group, fundBalance: group.fundBalance - expense.amount })
  }
}

export function addMessage(message: GroupMessage) {
  messagesStore.set([...messagesStore.get(), message])
}

export function markExpenseSettled(expenseId: string) {
  expensesStore.set(
    expensesStore.get().map(e => 
      e.id === expenseId ? { ...e, settled: true } : e
    )
  )
}

export function resetStores() {
  groupStore.set(null)
  expensesStore.set([])
  messagesStore.set([])
  localStorage.removeItem("awaykit_group")
}

