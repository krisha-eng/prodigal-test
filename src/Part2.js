import './App.css';
import React from 'react';
import { useEffect, useState } from 'react';
import 'antd/dist/antd.css';

import { Layout, Breadcrumb, Table, Tag, Button, Modal, Spin, Select } from 'antd';

const { Content } = Layout;
const { Option } = Select;

const columns = [
    {
        title: 'Call Id',
        dataIndex: 'call_id',
        sorter: { compare: (a, b) => a.call_id - b.call_id }
    },
    {
        title: 'Label',
        dataIndex: 'label_id',
        sorter: { compare: (a, b) => a.label_id.length - b.label_id.length },
        render: tags => (
            <>
                {tags.map(tag => {
                    let color;
                    if (tag.length > 6) {
                        color = 'geekblue';
                    } else if (tag.length > 4) {
                        color = 'green';
                    } else if (tag.length > 2) {
                        color = 'pink';
                    };

                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        )
    },
];


function Part2() {

    const [callList, setcallList] = useState([]);
    const [labelList, setlabelList] = useState([]);
    const [changedLabels, setchangedLabels] = useState([]);
    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [isAdd, setisAdd] = useState(false);
    const [isRemove, setisRemove] = useState(false);
    const [isLoading, setisLoading] = useState(true);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setselectedRowKeys(selectedRowKeys);
        }
    };

    useEffect(() => {
        fetch('https://damp-garden-93707.herokuapp.com/getcalllist', {
            method: "GET",
            headers: { "user_id": "24b456" }
        }).then(response => response.json())
            .then(function (json) {
                setcallList(json.data.call_data.map(obj => ({ key: obj.call_id, ...obj })));  //adding keys
                setisLoading(false);
            })
            .catch(err => console.warn(err));
    }, [isAdd, isRemove]);

    useEffect(() => {
        fetch('https://damp-garden-93707.herokuapp.com/getlistoflabels', {
            method: "GET",
            headers: { "user_id": "24b456" }
        }).then(response => response.json())
            .then(function (Data) {
                var arr = [];
                for (let i = 0; i < Data.data.unique_label_list.length; i++) {
                    arr.push(<Option key={Data.data.unique_label_list[i]}>{Data.data.unique_label_list[i]}</Option>);
                }
                setlabelList(arr);
            })
            .catch(err => console.warn(err));
    }, []);

    function handleChangeLabelSelection(value) {
        setchangedLabels(value);
    }
    function handleCloseModalAdd() {
        setisAdd(!isAdd);
    }
    function handleCloseModalDelete() {
        setisRemove(!isRemove);
    }
    function handleAddLabels() {
        var _data = { "operation": { "callList": [], "label_ops": [] } };
        _data.operation.callList = [...selectedRowKeys];
        var _arr = [];
        for (let i = 0; i < changedLabels.length; i++) {
            var _obj = {};
            _obj.name = changedLabels[i];
            _obj.op = "add";
            _arr.push(_obj);
        }
        _data.operation.label_ops = [..._arr];

        fetch('https://damp-garden-93707.herokuapp.com/applyLabels', {
            method: "POST",
            headers: { "user_id": "24b456" },
            body: JSON.stringify(_data)
        }).then(response => response.json())
            .then(function (json) {
                setisAdd(!isAdd);
                console.log(json);
            })
            .catch(err => console.warn(err));
    }

    function handleDeleteLabels() {
        var _data = { "operation": { "callList": [], "label_ops": [] } };
        _data.operation.callList = [...selectedRowKeys];
        var _arr = [];
        for (let i = 0; i < changedLabels.length; i++) {
            var _obj = {};
            _obj.name = changedLabels[i];
            _obj.op = "remove";
            _arr.push(_obj);
        }
        _data.operation.label_ops = [..._arr];

        fetch('https://damp-garden-93707.herokuapp.com/applyLabels', {
            method: "POST",
            headers: { "user_id": "24b456" },
            body: JSON.stringify(_data)
        }).then(response => response.json())
            .then(function (json) {
                setisRemove(!isRemove);
                console.log(json);
            })
            .catch(err => console.warn(err));
    }

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <div className="App">
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Assessment</Breadcrumb.Item>
                    <Breadcrumb.Item>Part 2</Breadcrumb.Item>
                </Breadcrumb>

                <div className="site-layout-content">
                    <Button className="add-remove-btn" type="primary" onClick={e => setisAdd(!isAdd)} disabled={!hasSelected} >
                        Add Labels
                    </Button>
                    <Button className="add-remove-btn" type="primary" onClick={e => setisRemove(!isRemove)} disabled={!hasSelected} >
                        Remove Labels
                    </Button>
                    {isAdd &&
                        <Modal
                            title="Choose Labels to add to selected Calls"
                            centered
                            visible="true"
                            onOk={handleAddLabels}
                        onCancel={handleCloseModalAdd}
                            width="400px">
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '300px' }}
                                placeholder="Choose Labels"
                                defaultValue={[]}
                                onChange={handleChangeLabelSelection}>
                                {labelList}
                            </Select>
                        </Modal>}
                    {isRemove &&
                        <Modal
                            title="Choose Labels to Delete from selected Calls"
                            centered
                            visible="true"
                            onOk={handleDeleteLabels}
                        onCancel={handleCloseModalDelete}
                            width="400px">
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '300px' }}
                                placeholder="Choose Labels"
                                defaultValue={[]}
                                onChange={handleChangeLabelSelection}>
                                {labelList}
                            </Select>
                        </Modal>}
                    <Table
                        rowSelection={{
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={callList}
                        pagination={{ defaultPageSize: 5 }}
                        loading={{ indicator: <div><Spin size="large" delay={200} /></div>, spinning: isLoading }}
                    />
                </div>
            </Content>
        </div>
    );
};

export default Part2;