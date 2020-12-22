// @flow
export function stopProp(e: SyntheticEvent<HTMLButtonElement>): void {
  e.stopPropagation();
}

export function noFunc(data: any): any {
  return data;
}

export function combineClasses(...args: Array<string>): string {
  return args.reduce((className, str) =>
    typeof str === "string" && str && str.length
      ? className + " " + str
      : className
  );
}

export function isObject(o: any): boolean {
  return typeof o === "object" && o !== null && !Array.isArray(o);
}
