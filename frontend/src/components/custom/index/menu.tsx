"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

type FileMenuProps = {
  onRename: () => void;
  onDownload: () => void;
  onRemove: () => void;
};

export default function FileMenu({
  onRename,
  onDownload,
  onRemove,
}: FileMenuProps) {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="px-1 text-lg leading-none">&#8942;</MenuButton>
      <MenuItems
        className="
    absolute right-0 left-[-59] mt-1 w-40 rounded-b-md shadow-lg border divide-y
    bg-white z-50
  "
      >
        <div className="py-1">
          <MenuItem>
            <button
              onClick={onRename}
              className="block w-full px-4 py-2 text-left text-sm"
            >
              Rename
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={onDownload}
              className="block w-full px-4 py-2 text-left text-sm"
            >
              Download
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={onRemove}
              className="block w-full px-4 py-2 text-left text-sm"
            >
              Remove
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
