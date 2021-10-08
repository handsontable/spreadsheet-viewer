import React, { useState, useEffect } from 'react';

type WithSlowChildrenProps = {
  /**
   * Will wait with rendering the children, until this Promise resolves.
   */
  holdDownChildRenderPromise?: Promise<unknown>;
};

/**
 * This component re-renders itself and its children after the frame it got
 * called on. In other words, any children of this compoent will be rendered
 * asynchronously compared to its parent tree.
 */
export const WithSlowChildren: React.FC<WithSlowChildrenProps> = (props) => {
  const { children, holdDownChildRenderPromise: holdDownComponentRender } = props;
  const [childrenToRender, setChildrenToRender] = useState<React.ReactNode | undefined>();

  useEffect(() => {
    /**
     * We only want to update the children asynchronously from the latest
     * efect execution, e.g. if there's a Promise passed down that takes
     * 1000ms to resolve, and in the mean time new children come in without
     * the Promise, the output would be invalid as we'd be outputting stale
     * children.
     */
    let active = true;

    if (holdDownComponentRender) {
      holdDownComponentRender.then(() => {
        if (active) {
          setChildrenToRender(children);
        }
      });
    } else {
      setChildrenToRender(children);
    }

    return () => {
      active = false;
    };
  }, [children, holdDownComponentRender]);

  return <>{childrenToRender}</>;
};
