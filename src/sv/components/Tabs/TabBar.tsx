import React, { useLayoutEffect, useMemo } from 'react';
import MaterialAppBar from '@material-ui/core/AppBar';
import MaterialTabs from '@material-ui/core/Tabs';
import ScrollTabBarComponent from './ScrollTabBarComponent';
import { DropupMenu } from '../DropupMenu/DropupMenu';
import { createTab } from './Tab';
import { startPerfMarker, MARKERS, endPerfMarker } from '../../../../perf/markers';

type TabBarProps = {
  currentTabIndex: number;
  onTabChange: (t: number) => void;
  titles: string[];
};

export const TabBar: React.FC<TabBarProps> = (props) => {
  const { currentTabIndex, onTabChange, titles } = props;

  // This is an ugly hack used to fire the performance marker only once,
  // on first time this function gets called.
  useMemo(() => startPerfMarker(MARKERS.presentationTabsRendering), []);

  useLayoutEffect(() => endPerfMarker(MARKERS.presentationTabsRendering), []);

  startPerfMarker(MARKERS.presentationTabsParsing);
  const output = (
    <MaterialAppBar
      position="static"
      color="default"
      className="sv-tabbar"
    >
      <DropupMenu
        onTabChange={onTabChange}
        currentTabIndex={currentTabIndex}
        titles={titles}
      />
      <MaterialTabs
        value={currentTabIndex}
        onChange={(_, v) => onTabChange(Number(v))}
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        ScrollButtonComponent={ScrollTabBarComponent}
        aria-label="scrollable auto tabs example"
        classes={{ indicator: 'sv-tab-indicator', scrollable: 'sv-tabs-scrollable' }}
        className="sv-tabs"
        data-cy="tabbar"
      >
        {titles.map((title, index) => createTab(title, index, () => onTabChange(index)))}
      </MaterialTabs>
    </MaterialAppBar>
  );
  endPerfMarker(MARKERS.presentationTabsParsing);

  return output;
};
