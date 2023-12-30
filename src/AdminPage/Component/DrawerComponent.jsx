import { Drawer } from "antd";

import styled from "styled-components";
const StyledDrawer = styled(Drawer)`
  .ant-drawer-content {
    overflow: auto;
  }
`;

const DrawerComponent = ({
  title = "Drawer",
  placement = "right",
  isOpen = false,
  children,
  ...rests
}) => {
  return (
    <>
      <StyledDrawer
        title={title}
        placement={placement}
        open={isOpen}
        {...rests}
      >
        {children}
      </StyledDrawer>
    </>
  );
};
export default DrawerComponent;
