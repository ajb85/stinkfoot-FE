// @flow

export default (function (cache: void | number): Function {
  return function getScrollbarWidth(): number {
    // Creating invisible container
    if (cache) {
      return cache;
    }

    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll"; // forcing scrollbar to appear
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
    if (document.body) {
      document.body.appendChild(outer);
    }

    // Creating inner element and placing it in the container
    const inner = document.createElement("div");
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Removing temporary elements from the DOM
    if (outer.parentNode) {
      outer.parentNode.removeChild(outer);
    }
    cache = scrollbarWidth;
    return scrollbarWidth;
  };
});
