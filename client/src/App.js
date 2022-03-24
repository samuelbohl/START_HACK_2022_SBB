import './App.css';
import { useState, useEffect } from 'react';
import { Layout, Form, Button, Select, Row, Col, DatePicker, TimePicker} from 'antd';
import axios from 'axios';
// import { useState } from 'react/cjs/react.production.min';
const { Header, Content, Footer } = Layout;

// API: 57c5dbbbf1fe4d000100001898a7f7ea42164872bac23440877f3dee


function App() {

  const [stations, setStations] = useState([]);

  useEffect(() => {
    axios.get('https://data.sbb.ch/api/records/1.0/search/?dataset=halteort&q=&rows=10000&facet=bps_name&facet=funktion138')
    .then(res => {
      const data = res.data.records.map(el => {return {key : el.fields.bpuic, name: el.fields.bps_name}; });
      let options = data.filter((arr, index, self) =>
      index === self.findIndex((t) => (t.key === arr.key && t.name === arr.name)))

      setStations(()=> options)
    })
  }, []);


  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Layout>
      <Header>SBB Logo</Header>
      <Content>
      <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >

      <Row justify="start">
      <Col span={8}>
      <Form.Item
        label="From"
        name="from"
      >
        <Select
        showSearch
        placeholder="Select a train station"
        optionFilterProp="children"
        onChange={() => {} }
        onSearch={() => {}}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {stations.map(item => (
          <Select.Option key={item.key} value={item.key}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
      </Form.Item>
      </Col>
      <Col span={4}>
      <Form.Item
        label="Date"
        name="dateFrom"
      >
        <DatePicker />
      </Form.Item>
      </Col>
      <Col span={4}>
      <Form.Item
        label="Time"
        name="timeFrom"
      >
        <TimePicker />
      </Form.Item>
      </Col>
    </Row>

    <Row justify="start">
      <Col span={8}>
      <Form.Item
        label="To"
        name="to"
      >
        <Select
        showSearch
        placeholder="Select a train station"
        optionFilterProp="children"
        onChange={() => {} }
        onSearch={() => {}}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {stations.map(item => (
          <Select.Option key={item.key} value={item.key}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
      </Form.Item>
      </Col>
      <Col span={4}>
      <Form.Item
        label="Date"
        name="dateTo"
      >
        <DatePicker picker={'date'} onChange={() => {}} />
      </Form.Item>
        </Col>
      <Col span={4}>
      <Form.Item
        label="Time"
        name="timeFrom"
      >
        <TimePicker />
      </Form.Item>
      </Col>
    </Row>
    <Row>
    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Row>
    </Form>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}

export default App;
