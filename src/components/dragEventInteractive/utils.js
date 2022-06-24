import {
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect
} from 'react';

// Saves incoming handler to the ref in order to avoid "useCallback hell"
export function useEventCallback(handler) {
  const callbackRef = useRef(handler);

  useEffect(() => {
    callbackRef.current = handler;
  });

  return useCallback((value, event) => callbackRef.current && callbackRef.current(value, event), []);
}

// Check if an event was triggered by touch
export const isTouch = (event) => {
  return event.type == "touchmove"
};

// Browsers introduced an intervention, making touch events passive by default.
// This workaround removes `preventDefault` call from the touch handlers.
// https://github.com/facebook/react/issues/19651
export const preventDefaultMove = (event) => {
    !isTouch(event) && event.preventDefault && event.preventDefault();
};
// Clamps a value between an upper and lower bound.
// We use ternary operators because it makes the minified code
// 2 times shorter then `Math.min(Math.max(a,b),c)`
export const clamp = (number, min = 0, max = 1) => {
  return number > max ? max : number < min ? min : number;
};

// Returns a relative position of the pointer inside the node's bounding box
export const getRelativePosition = async (node, event) => {

  const rect = await node.getBoundingClientRect();

  // Get user's pointer position from `touches` array if it's a `TouchEvent`
  const pointer = isTouch(event) ? event.touches[0] : event;

  return {
    left: clamp((pointer.pageX - (rect.left + 0)) / rect.width),
    top: clamp((pointer.pageY - (rect.top + 0)) / rect.height),
    width: rect.width,
    height: rect.height,
    x: pointer.pageX - (rect.left + 0),
    y: pointer.pageY - (rect.top + 0),
  };
};
