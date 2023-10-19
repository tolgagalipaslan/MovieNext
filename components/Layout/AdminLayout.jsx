import { useWindowSize } from "@/hooks/useWindowSize";
import {
  EditOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  QrcodeOutlined,
  UnorderedListOutlined,
  PlayCircleOutlined,
  UserAddOutlined 
} from "@ant-design/icons";
import { Router, useRouter } from "next/router";
import { Button, Layout, Menu, theme } from "antd";
import { usePathname } from "next/navigation";

import { useState } from "react";

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowSize();

  const isSmallScreen = width <= 767;

  const items = [
    {
      key: "1",
      icon:<PlayCircleOutlined />,
      label: "All Movies",
      onClick: () => {
        router.push("/admin");
      },
    },
    {
      key: "2",
      icon: <EditOutlined />,
      label: "Add Movie",
      onClick: () => {
        router.push("/admin/add-movie");
      },
    },
    {
      key: "3",
      icon: <UserAddOutlined />,
      label: "Users",
      onClick: () => {
        router.push("/admin/allProducts");
      },
    },
    {
      key: "4",
      icon: <UnorderedListOutlined />,
      label: "Reports",
      onClick: () => {
        router.push("/admin/allProducts");
      },
    },
    {
      key: "5",
      icon: <LogoutOutlined />,
      className: "mt-auto",
      label: "Log Out",
      onClick: () => {
        sessionStorage.setItem("username", "");
        router.push("/");
      },
    },
  ];

  const getActiveKey = () => {
    if (pathname === "/admin" || pathname === "/admin/qrCodes") {
      return "1";
    } else if (
      pathname === "/admin/product" ||
      pathname === "/admin/category"
    ) {
      return "2";
    } else if (pathname === "/admin/allProducts") {
      return "3";
    } else {
      return "10";
    }
    // Add more conditions here if needed
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout className="min-h-screen">
      <Sider
        className="min-h-screen  "
        trigger={null}
        collapsible
        collapsed={isSmallScreen ? true : collapsed}
      >
        <div
          className={`${
            isSmallScreen
              ? "text-xl mx-auto pl-0"
              : collapsed
              ? "text-xl mx-auto pl-0"
              : "text-3xl mx-0 pl-5"
          } text-white   h-[30px]  font-semibold w-fit  text-center py-2 duration-300 cursor-pointer`}
          onClick={() => router.push("/admin")}
        >
          Filmilf
        </div>
        <Menu
          className="mt-10"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[getActiveKey()]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            disabled={isSmallScreen}
            icon={collapsed ? <MenuFoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
