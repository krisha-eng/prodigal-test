import './App.css';
import React from 'react';
import { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import Part1 from './Part1';
import Part2 from './Part2';
import { BrowserRouter, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { Layout, Menu, Breadcrumb } from 'antd';
import { Table } from 'antd';
import { Select, Typography, Divider } from 'antd';

const { Header, Content, Footer } = Layout;
const { Column } = Table;
const { Option } = Select;
const { Title } = Typography;

function App() {


  return (
    <BrowserRouter>
      <div className="App">
        <Layout className="layout">
          <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
              <Menu.Item key="Part1"> <Link to="/">Part 1</Link> </Menu.Item>
              <Menu.Item key="Part2"><Link to="/Part2">Part 2</Link></Menu.Item>
            </Menu>
          </Header>
          <Route exact path="/" component={Part1} />
          <Route path="/Part2" component={Part2} />
          <Footer style={{ textAlign: 'center' }}>Prodigal Assessment Submission by Krisha</Footer>
        </Layout>
      </div>
    </BrowserRouter>
  );
}

export default App;
