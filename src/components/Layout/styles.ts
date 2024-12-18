import { createStyles } from "antd-style";

export const useStyle = createStyles(({ prefixCls, css }) => ({
  avatar: css`
    & .ant-avatar-string {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,

  textHover: css`
    &:hover {
      color: #1677ff !important;
    }
  `,
}));
