export interface ToDo {
  id: string
  title: string
  completed: boolean
}

export interface CreateToDo {
  title: string
  completed?: boolean
}

export interface UpdateToDo {
  title?: string
  completed?: boolean
}
