import './App.css';
import React from 'react';
import { useEffect, useState } from 'react';
import 'antd/dist/antd.css';

import { Layout, Breadcrumb, Table, Spin, Select, Divider } from 'antd';

const { Content } = Layout;
const { Column } = Table;
const { Option } = Select;

function Part1() {

    const [Options, setOptions] = useState([]); //Dropdown
    const [AllAgentsArr, setAllAgentsArr] = useState([]);
    const [FilteredAgentsArr, setFilteredAgentsArr] = useState([]);
    const [maxCallArr, setmaxCallArr] = useState([]);
    const [tableData, settableData] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        fetch("https://damp-garden-93707.herokuapp.com/getlistofagents")
            .then(response => response.json())
            .then(function (Data) {
                setAllAgentsArr(Data.data.listofagents);
                var arr = [];
                for (let i = 0; i < Data.data.listofagents.length; i++) {
                    arr.push(<Option key={Data.data.listofagents[i]}>{Data.data.listofagents[i]}</Option>);
                }
                setOptions(arr);
            });
    }, []);

    useEffect(() => {
        fetch("https://damp-garden-93707.herokuapp.com/getdurationrange")
            .then(response => response.json())
            .then(function (Data) {
                var min = Math.ceil(Data.data.minimum);
                var max = Math.ceil(Data.data.maximum);
                var _arr = [];
                _arr.push(min);
                _arr.push(max);
                setmaxCallArr(_arr);
            });
    }, []);

    useEffect(() => {
        var _data = { "info": { "filter_agent_list": [], "filter_time_range": [] } };
        if (FilteredAgentsArr.length === 0) {
            _data.info.filter_agent_list = [...AllAgentsArr];
        } else {
            _data.info.filter_agent_list = [...FilteredAgentsArr];
        }
        _data.info.filter_time_range = [...maxCallArr];
        console.log(_data);
        //The spin indicator disappears before data load, so making async await call
        (async () => {
            try {
                const response = await fetch('https://damp-garden-93707.herokuapp.com/getfilteredcalls', {
                    method: "POST",
                    body: JSON.stringify(_data)
                });
                const json = await response.json();
                settableData(json.data);
                setisLoading(false);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [FilteredAgentsArr, AllAgentsArr, maxCallArr]);

    function handleChange(value) {
        setFilteredAgentsArr(value);
    }
    function handleChangeDuration(value) {
        console.log(value);
        if (value === undefined) {
            setmaxCallArr([0, 400]);
        } else {
            setmaxCallArr(value.split("-").map(i => Number(i)));
        }
    }


    return (
        <div className="App">
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Assessment</Breadcrumb.Item>
                    <Breadcrumb.Item>Part 1</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <div className="flex-h">
                        <div className="flex-v">
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '300px' }}
                                maxTagCount={2}
                                placeholder="Select Agents"
                                onChange={handleChange}>
                                {Options}
                            </Select>
                        </div>

                        <div className="flex-v">
                            <Select
                                allowClear
                                style={{ width: '300px' }}
                                placeholder="Select Call Duration"
                                defaultValue={[]}
                                onChange={handleChangeDuration}>
                                <Option key="0-50">0 - 50</Option>
                                <Option key="50-100">50 - 100</Option>
                                <Option key="100-150">100 - 150</Option>
                                <Option key="150-200">150 - 200</Option>
                                <Option key="200-250">200 - 250</Option>
                                <Option key="250-400">250 - 400</Option>
                            </Select>
                        </div>
                    </div>
                    <Divider />
                    <Table dataSource={tableData} pagination={{ defaultPageSize: 5 }} loading={{ indicator: <div><Spin size="large" delay={200} /></div>, spinning: isLoading }}>
                        <Column title="Call ID" dataIndex="call_id" key="call_id" sorter={{ compare: (a, b) => a.call_id - b.call_id }} />
                        <Column title="Agent" dataIndex="agent_id" key="agent_id" sorter={{ compare: (a, b) => (a.agent_id > b.agent_id) - (a.agent_id < b.agent_id) }} />
                        <Column title="Call Duration" dataIndex="call_time" key="call_time" sorter={{ compare: (a, b) => a.call_time - b.call_time }} />
                    </Table>

                </div>
            </Content>
        </div>

    );

}

export default Part1;



// fetch('https://damp-garden-93707.herokuapp.com/getfilteredcalls', {
        //     method: "POST",
        //     body: JSON.stringify(_data)
        //     // headers: { "Content-type": "application/json; charset=UTF-8" }
        // }).then(response => response.json())
        //     .then(function (json) {
        //         settableData(json.data);
        //         setisLoading(false);
        //     })
        //     .catch(err => console.warn(err));