import { useState, useRef, useLayoutEffect, useEffect } from 'react';

export const useAnimatedList = (data: any[]) => {
  const [list, setList] = useState(data);
  const refs = useRef<{ [key: string]: HTMLElement | null }>({});
  const prevBoundingBoxes = useRef<{ [key: string]: DOMRect }>({});

  useLayoutEffect(() => {
    const newBoundingBoxes: { [key: string]: DOMRect } = {};
    if (list) {
      list.forEach(item => {
        const el = refs.current[item.id];
        if (el) {
          newBoundingBoxes[item.id] = el.getBoundingClientRect();
        }
      });
    }
    prevBoundingBoxes.current = newBoundingBoxes;
  }, [list]);

  useLayoutEffect(() => {
    if (list) {
      list.forEach(item => {
        const el = refs.current[item.id];
        if (el) {
          const prevBox = prevBoundingBoxes.current[item.id];
          const newBox = el.getBoundingClientRect();
          if (prevBox) {
            const dy = prevBox.top - newBox.top;
            if (dy !== 0) {
              requestAnimationFrame(() => {
                el.style.transform = `translateY(${dy}px)`;
                el.style.transition = 'transform 0s';
                requestAnimationFrame(() => {
                  el.style.transform = '';
                  el.style.transition = 'transform 0.5s ease-in-out';
                });
              });
            }
          }
        }
      });
    }
  }, [list]);

  useEffect(() => {
    setList(data);
  }, [data]);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    refs.current[id] = el;
  };

  return { list, setRef };
};
