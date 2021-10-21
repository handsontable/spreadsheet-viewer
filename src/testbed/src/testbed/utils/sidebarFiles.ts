import { storeAndRenderWorkbook } from '../index';

const fileList = document.querySelector('.files-list') as HTMLDivElement;

fileList.addEventListener('click', (event) => {
  event.preventDefault(); // prevent from file being downloaded
  const element = event.target as HTMLElement;
  const fileElement = (element.nodeName === 'A' ? element : element.parentElement) as HTMLAnchorElement; // previously it was "element.closest('a')" but it is not supported in IE11

  if (!fileElement || !fileList.contains(fileElement)) {
    return;
  }
  const array = fileElement.href.split('/');
  const fileName = array[array.length - 1];

  storeAndRenderWorkbook(fileElement.href, fileName);
  fileList.classList.remove('show');
});

const toggleSidebarOnHotKey = (event) => {
  if (event.defaultPrevented) {
    return;
  }

  const key = event.key || event.keyCode || event.detail.key;

  if (key === 'f') {
    fileList.classList.toggle('show');
  }
};

export const installToggleSidebar = (hostWindow: Window) => {
  hostWindow.document.querySelector('#toggle-files-list').addEventListener('click', (ev) => {
    fileList.classList.toggle('show');
    ev.stopPropagation();
  });
  hostWindow.addEventListener('keydown', toggleSidebarOnHotKey);
};
