type NotificationInsertRow = {
  employee_id: string;
  title: string;
  detail: string;
  metadata?: Record<string, unknown>;
};

type NotificationInsertClient = {
  from: (table: string) => {
    insert: (row: NotificationInsertRow) => unknown;
  };
};

export const persistNotificationRow = async (
  client: NotificationInsertClient,
  employeeId: string,
  payload: {
    title: string;
    detail: string;
    metadata?: Record<string, unknown>;
  }
) => {
  const result = await client.from('notifications').insert({
    employee_id: employeeId,
    title: payload.title,
    detail: payload.detail,
    metadata:
      payload.metadata && Object.keys(payload.metadata).length
        ? payload.metadata
        : undefined,
  });

  const error =
    result && typeof result === 'object' && 'error' in result
      ? (result as { error?: { message?: string } | null }).error ?? null
      : null;

  if (error) {
    throw error;
  }
};
