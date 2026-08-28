/**
 * Touch/mouse/pen drag-to-reorder for a vertical list of cards.
 *
 * Deliberately hand-rolled on the Pointer Events API rather than the HTML5
 * Drag and Drop API — this is a mobile-first app, and native HTML5 DnD has no
 * real touch support (it requires a polyfill to work on phones at all), which
 * would make "drag to reorder" silently broken on the one platform this app
 * targets. Pointer Events unify mouse/touch/pen behind one API and work
 * everywhere.
 *
 * Usage: call once per render, after the list markup is in the DOM.
 *   enableDragReorder(container, {
 *     itemSelector: '.exercise-card',   // each draggable row, in current order
 *     handleSelector: '.drag-handle',   // the grab handle inside each row
 *     onReorder: (fromIndex, toIndex) => { ... move array item, then re-render ... }
 *   });
 *
 * Only the handle initiates a drag — the rest of the card stays normal
 * (scrollable, tappable inputs, etc.) so this doesn't fight the page's own
 * touch scrolling.
 */
export function enableDragReorder(container, { itemSelector, handleSelector, onReorder }) {
  const items = Array.from(container.querySelectorAll(itemSelector));
  if (items.length < 2) return;

  items.forEach((item, index) => {
    const handle = item.querySelector(handleSelector);
    if (!handle) return;

    handle.addEventListener('pointerdown', (e) => {
      // Only the primary button/touch/pen contact starts a drag.
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      startDrag(e, items, index, handle, onReorder);
    });
  });
}

function startDrag(startEvent, items, draggedIndex, handle, onReorder) {
  const draggedEl = items[draggedIndex];
  const startClientY = startEvent.clientY;

  // Snapshot every item's untransformed position once, up front — all the
  // drag math is done against this fixed snapshot rather than re-measuring
  // live (which would compound with the shift transforms applied below) or
  // walking sibling swaps one at a time (fiddlier to get right than just
  // recomputing the full target order from scratch on every move).
  const originalRects = items.map(el => {
    const r = el.getBoundingClientRect();
    return { top: r.top, height: r.height };
  });
  const otherIndices = items.map((_, i) => i).filter(i => i !== draggedIndex);

  let currentOrder = items.map((_, i) => i); // visual order, as original indices

  handle.setPointerCapture(startEvent.pointerId);
  draggedEl.style.zIndex = '10';
  draggedEl.style.position = 'relative';
  draggedEl.style.transition = 'none';
  draggedEl.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
  draggedEl.classList.add('dragging');

  function handleMove(e) {
    const deltaY = e.clientY - startClientY;
    draggedEl.style.transform = `translateY(${deltaY}px)`;

    const draggedCenter = originalRects[draggedIndex].top + originalRects[draggedIndex].height / 2 + deltaY;

    // Where among the OTHER items (already in top-to-bottom order, since
    // that's how they were captured) does the dragged item's center now sit?
    let targetPos = 0;
    for (const i of otherIndices) {
      const otherCenter = originalRects[i].top + originalRects[i].height / 2;
      if (otherCenter < draggedCenter) targetPos++;
      else break;
    }

    const newOrder = [
      ...otherIndices.slice(0, targetPos),
      draggedIndex,
      ...otherIndices.slice(targetPos)
    ];

    if (newOrder.join(',') !== currentOrder.join(',')) {
      currentOrder = newOrder;
      // Shift every non-dragged item to the slot it now occupies, so the
      // list visually parts to make room for the dragged card.
      otherIndices.forEach(i => {
        const slot = currentOrder.indexOf(i);
        const shift = originalRects[slot].top - originalRects[i].top;
        items[i].style.transition = 'transform 0.15s ease';
        items[i].style.transform = `translateY(${shift}px)`;
      });
    }
  }

  function handleUp(e) {
    handle.releasePointerCapture(e.pointerId);
    handle.removeEventListener('pointermove', handleMove);
    handle.removeEventListener('pointerup', handleUp);
    handle.removeEventListener('pointercancel', handleUp);

    const finalIndex = currentOrder.indexOf(draggedIndex);

    // Clean up inline styles — the caller re-renders right after onReorder,
    // which replaces this DOM entirely, but do it anyway in case onReorder
    // is a no-op (dropped back in the same spot).
    items.forEach(el => {
      el.style.transform = '';
      el.style.transition = '';
      el.style.zIndex = '';
      el.style.position = '';
      el.style.boxShadow = '';
      el.classList.remove('dragging');
    });

    if (finalIndex !== draggedIndex) {
      onReorder(draggedIndex, finalIndex);
    }
  }

  handle.addEventListener('pointermove', handleMove);
  handle.addEventListener('pointerup', handleUp);
  handle.addEventListener('pointercancel', handleUp);
}

/** Moves the item at `fromIndex` to `toIndex`, mutating `arr` in place. */
export function moveArrayItem(arr, fromIndex, toIndex) {
  const [item] = arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, item);
}
