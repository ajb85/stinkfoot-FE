// @flow

export function stopProp(e): void {
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
