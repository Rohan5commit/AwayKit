import type { MatchGroup, GroupMember, SharedExpense, GroupMessage } from "@/types"

type Listener<T> = (state: T) => void

function createStore<T>(initial: T, storageKey?: string) {
  let state = initial
  const listeners = new Set<Listener<T>>()
  if (storageKey) {
    try { const stored = localStorage.getItem(storageKey); if (stored) state = JSON.parse(stored) } catch { /* ignore */ }
  }
  return {
    get: () => state,
    set: (next: T) => {
      state = next
      if (storageKey) { try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* ignore */ } }
      listeners.forEach(fn => fn(state))
    },
    subscribe: (fn: Listener<T>) => { listeners.add(fn); return () => listeners.delete(fn) },
  }
}

export const groupStore = createStore<MatchGroup | null>(null, "awaykit_group")
export const expensesStore = createStore<SharedExpense[]>([], "awaykit_expenses")
export const messagesStore = createStore<GroupMessage[]>([], "awaykit_messages")

export function setGroup(group: MatchGroup) { groupStore.set(group) }

export function getStoredGroup(): MatchGroup | null { return groupStore.get() }

export function addExpense(expense: SharedExpense) {
  expensesStore.set([...expensesStore.get(), expense])
  const group = groupStore.get()
  if (group) { setGroup({ ...group, fundBalance: group.fundBalance - expense.amount }) }
}

export function addMessage(message: GroupMessage) { messagesStore.set([...messagesStore.get(), message]) }

export function markExpenseSettled(expenseId: string) {
  expensesStore.set(expensesStore.get().map(e => e.id === expenseId ? { ...e, settled: true } : e))
}

export function resetStores() {
  groupStore.set(null); expensesStore.set([]); messagesStore.set([])
  localStorage.removeItem("awaykit_group"); localStorage.removeItem("awaykit_expenses"); localStorage.removeItem("awaykit_messages")
}
