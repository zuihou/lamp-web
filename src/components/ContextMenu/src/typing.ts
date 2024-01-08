import { PermModeEnum, RoleEnum } from '/@/enums/roleEnum';

export interface Axis {
  x: number;
  y: number;
}

export interface ContextMenuItem {
  label: string;
  icon?: string;
  hidden?: boolean;
  disabled?: boolean;
  handler?: Fn;
  divider?: boolean;
  children?: ContextMenuItem[];
  auth?: string | string[] | RoleEnum | RoleEnum[];
  authMode?: PermModeEnum;
}
export interface CreateContextOptions {
  event: MouseEvent;
  icon?: string;
  styles?: any;
  items?: ContextMenuItem[];
}

export interface ContextMenuProps {
  event?: MouseEvent;
  styles?: any;
  items: ContextMenuItem[];
  customEvent?: MouseEvent;
  axis?: Axis;
  width?: number;
  showIcon?: boolean;
}

export interface ItemContentProps {
  showIcon: boolean | undefined;
  item: ContextMenuItem;
  handler: Fn;
}
