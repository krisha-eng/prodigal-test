import './App.css';
import React from 'react';
import { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Select, Typography, Divider } from 'antd';
const { Option } = Select;
const { Title } = Typography;

function App() {

  const [Agents, setAgents] = useState([]);

  useEffect(() => {
    fetch("https://damp-garden-93707.herokuapp.com/getlistofagents")
      .then(response => response.json())
      .then(function (Data) {
        var arr = [];
        for (let i = 0; i < Data.data.listofagents.length; i++) {
          arr.push(<Option key={Data.data.listofagents[i]}>{Data.data.listofagents[i]}</Option>);
        }
        setAgents(arr);
      });
  }, []);

  function handleChange(value) {
    alert(`selected ${value}`);
  }
  return (
    <div className="App">
      <Title level={3}>Prodigal Test</Title>

      <div className="flex-h">

        <div className="flex-v">
          {/* <Title level={5}>Agents</Title> */}
          <Select
            mode="multiple"
            allowClear
            style={{ width: '300px' }}
            maxTagCount={2}
            placeholder="Select Agents"

            onChange={handleChange}

          >
            {Agents}
          </Select>
        </div>

        <div className="flex-v">
          {/* <Title level={5}>Call duration</Title> */}
          <Select
            allowClear
            style={{ width: '300px' }}

            placeholder="Select Call Duration"
            defaultValue={[]}
            onChange={handleChange}
          >

          </Select>
        </div>
      </div>

      {Agents}
    </div>
  );
}

export default App;
