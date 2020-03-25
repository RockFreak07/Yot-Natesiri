import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Layout, Menu } from 'antd';

import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined,
  MailOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default class Layer extends Component {
    render() {
        return (
          
          <div>
                  <Layout>
          <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
      <div className="logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>

        <Menu.Item key="0">
          <HomeOutlined />
          <span className="nav-text">HOME</span>

        </Menu.Item>
        
        <SubMenu
          key="sub1"
          title={
            <span>
              <MailOutlined />
              <span>Root</span>
            </span>
          }
        >
            <Menu.Item key="1"><Link to="/Bisection"/>
                <UserOutlined />
                <span className="nav-text">Bisection</span>         
            </Menu.Item>
            <Menu.Item key="2"><Link to="/FalsePosition"/>
                <UserOutlined />
                <span className="nav-text">False Position</span>         
            </Menu.Item>
            <Menu.Item key="3"><Link to="/Onepoint"/>
                <UserOutlined />
                <span className="nav-text">One point</span>         
            </Menu.Item>
            <Menu.Item key="4"><Link to="/Newton"/>
                <UserOutlined />
                <span className="nav-text">Newton</span>  
            </Menu.Item>    
            <Menu.Item key="5"><Link to="/Secant"/>
                <UserOutlined />
                <span className="nav-text">Secant</span>               
            </Menu.Item>
        </SubMenu>


      </Menu>
    </Sider>
    
    <Layout className="site-layout" style={{ marginLeft: 200 }}>
      <Header className="site-layout-background" style={{ padding: 0 }} />
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
            <h1>NUMERICAL</h1>
            
        </div>
        
      </Content>
      <Footer style={{ textAlign: 'center' }}>@Yot Natrsiri</Footer>
    </Layout>
  </Layout>,
  
        </div>
            )
              
    }
}
 