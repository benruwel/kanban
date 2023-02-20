export interface Column {
  id: string;
  title: string;
  position: number; // position on the board
  createdAt: Date;
  updatedAt: Date;
  tasks: Array<Task>;
}

export interface Task {
  id: string;
  columnId: string;
  position: number; // position in the column
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
