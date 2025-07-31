import { Layout } from "@arco-design/web-react";
import LemonCanvas from "./components/LemonCanvas";
import LemonLeftToolNavigation from "./components/LemonLeftToolNavigation";
import LemonNavigation from "./components/LemonNavigation";
import useLeftToolNavigationStore from "./store/LemonLeftToolNavigationStore";

const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;

export default function App() {
  const { collapsed, setCollapsed } = useLeftToolNavigationStore();

  return (
    <Layout
      style={{
        height: "100vh",
        userSelect: "none",
      }}
    >
      <Sider onCollapse={setCollapsed} collapsed={collapsed}></Sider>
      <Layout>
        <Header>
          <LemonNavigation />
        </Header>
        <Layout
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <LemonLeftToolNavigation />
          <Content
            style={{
              overflow: "hidden",
            }}
          >
            <LemonCanvas />
          </Content>
        </Layout>
        <Footer></Footer>
      </Layout>
    </Layout>
  );
}
