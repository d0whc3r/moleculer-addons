export type QueuePayload = {
  testId: string;
  testStatus: boolean;
};

export type JobResponse = {
  testId: string;
  newStatus: boolean;
};
