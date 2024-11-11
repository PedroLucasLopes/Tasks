interface ITasks {
  id?: number;
  name: string;
  description: string;
  is_done?: boolean;
  subtasks?: ISubtasks[];
  created_at?: EpochTimeStamp;
  updated_at?: EpochTimeStamp;
}
