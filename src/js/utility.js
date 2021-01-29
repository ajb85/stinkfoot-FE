// @flow
export function stopProp(e: SyntheticEvent<HTMLButtonElement>): void {
  e.stopPropagation();
}

export function noFunc(data: any): any {
  return data;
}

export function combineClasses(...args: Array<string>): string {
  return args.reduce((className, str) =>
    typeof str === "string" && str ? className + " " + str : className
  );
}

export function isObject(o: any): boolean {
  return typeof o === "object" && o !== null && !Array.isArray(o);
}

const standardizeNames = {
  secondary: "secondaries",
  primary: "primaries",
};

export function standardizeNameToPlural(name) {
  return standardizeNames[name] || name;
}
