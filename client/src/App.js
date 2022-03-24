import './App.css';
import { useState, useEffect } from 'react';
import { Layout, Form, Button, Select, Row, Col, DatePicker, TimePicker} from 'antd';
import axios from 'axios';
import Connection from './Connection';

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
      <Header style={{height: 100, backgroundColor: 'white'}}>
      <span style={{display: 'flex', justifyContent: 'space-between'}}>
        <h1>Bike Reservation Planner</h1>
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/70/SBB_CFF_FFS_logo.svg" style={{width: 300, height: 'fit-content', marginTop: 20}}></img>
      </span>
      </Header>
      <Content style={{paddingTop: 50}}>
      
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
      <Col span={4} justify="start">
      <Form.Item
        label="From"
        name="from"
      >
        <Select
        showSearch
        placeholder="From"
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
      <Col span={4} justify="start">
      <Form.Item
        label="To"
        name="to"
      >
        <Select
        showSearch
        placeholder="To"
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
      <Col span={4}>
      <Form.Item
        label="Bikes"
        name="numVelos"
      >
        <Select
        placeholder="Bikes"
      >

          <Select.Option key={1} value={1}>
            {1}
          </Select.Option>
          <Select.Option key={2} value={2}>
            {2}
          </Select.Option>
          <Select.Option key={3} value={3}>
            {3}
          </Select.Option>

      </Select>
      </Form.Item>
      </Col>
      <Col span={3} offset={1}>
    <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      </Col>
    </Row>

    <Connection from={'13:00'} to={'14:00'} />

    </Form>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}

// function AllStationsOfASection(startId, endId, line) {
//   const [stations, setStations] = useState([]);

//   axios.get('https://data.sbb.ch/api/records/1.0/search/?dataset=linie-mit-betriebspunkten&q=&rows=-1&sort=-linie&facet=abkurzung_bpk&facet=linie&facet=linienname')
//     .then(res => {
//       const data = res.data.records.map(el => {return {key : el.fields.bpuic, line: el.fields.linie, km: el.fields.km}; });
//       let startStation = data.find(obj => obj.key == startId)
//       let endStation = data.find(obj => obj.key == endId)
//       let stations = data.filter((el) => el.line == line && el.km <= endStation.km && el.km >= startStation.km)
//       setStations(()=> stations)
//     })

//     console.log(stations)
//     return stations;
// }

// Requirements:
// - get all available Stations
// - given a station, get all possible connections
// - given a start, end and time, get next few connections
// - given a connection, get the probabilities
// - given probabilities display graph


// Connection
// max leisure score
// holiday score
// capacity
// reservations over time
// time of day (aka zug nummer)

export default App;
