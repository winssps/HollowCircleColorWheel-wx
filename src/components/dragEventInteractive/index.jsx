import React, { useRef, useState, useCallback, useEffect } from 'react';
import { isTouch, preventDefaultMove, getRelativePosition, Interaction, useEventCallback } from './utils';

export * from './utils';



const Interactive = React.forwardRef((props, ref) => {
  const { prefixCls = 'w-color-interactive', className, onMove, onDown, ...reset } = props;
  const container = useRef(null);
  const hasTouched = useRef(false);
  const [isDragging, setDragging] = useState(false);
  const onMoveCallback = useEventCallback(onMove);
  const onKeyCallback = useEventCallback(onDown);

  // Prevent mobile browsers from handling mouse events (conflicting with touch ones).
  // If we detected a touch interaction before, we prefer reacting to touch events only.
  const isValid = (event) => {
    if (hasTouched.current && !isTouch(event)) return false;
    hasTouched.current = isTouch(event);
    return true;
  };

  const handleMove = useCallback(
    (event) => {
      preventDefaultMove(event);
      // If user moves the pointer outside of the window or iframe bounds and release it there,
      // `mouseup`/`touchend` won't be fired. In order to stop the picker from following the cursor
      // after the user has moved the mouse/finger back to the document, we check `event.buttons`
      // and `event.touches`. It allows us to detect that the user is just moving his pointer
      // without pressing it down

      const isDown = isTouch(event) ? event.touches.length > 0 : event.buttons > 0;
      if (isDown && container.current) {

        onMoveCallback && onMoveCallback(getRelativePosition(container.current, event), event);
      } else {
        setDragging(false);
      }
    },
    [onMoveCallback],
  );

  const handleMoveEnd = useCallback(() => setDragging(false), []);
  const toggleDocumentEvents = useCallback((state) => {
    const toggleEvent = state ? window.addEventListener : window.removeEventListener;
    toggleEvent(hasTouched.current ? 'touchmove' : 'mousemove', handleMove);
    toggleEvent(hasTouched.current ? 'touchend' : 'mouseup', handleMoveEnd);
  }, []);

  useEffect(() => {
    toggleDocumentEvents(isDragging);
    return () => {
      isDragging && toggleDocumentEvents(false);
    };
  }, [isDragging, toggleDocumentEvents]);

  const handleMoveStart = useCallback(
    async (event) => {
      preventDefaultMove(event);
      if (!isValid(event)) return;
      const position = await getRelativePosition(container.current, event);

      onKeyCallback && onKeyCallback(position, event);
      setDragging(true);
    },
    [onKeyCallback],
  );

  return (
    <div
      {...reset}
      className={[prefixCls, className || ''].filter(Boolean).join(' ')}
      style={{
        ...reset.style,
        touchAction: 'none',
        width: `${reset.style.width * 2}rpx`,
        height: `${reset.style.height * 2}rpx`
      }}
      ref={container}
      tabIndex={0}
      // onMouseDown={handleMoveStart}
      // onTouchStart={handleMoveStart}
      onTouchMove={handleMoveStart}
    />
  );
});

Interactive.displayName = 'Interactive';

export default Interactive;