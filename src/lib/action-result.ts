/**
 * Resultado uniforme de server actions.
 * El Front ya distingue `error` vs `success` — no cambiar esa forma.
 */
export type ActionFailure = {
  error: string;
};

export type ActionOk<T extends object = object> = {
  success: true;
} & T;

export type ActionResult<T extends object = object> = ActionFailure | ActionOk<T>;

export function actionError(error: string): ActionFailure {
  return { error };
}

export function actionOk<T extends object>(data?: T): ActionOk<T> {
  return { success: true, ...(data as T) };
}

export function isActionFailure<T extends object>(
  result: ActionResult<T>,
): result is ActionFailure {
  return "error" in result;
}
