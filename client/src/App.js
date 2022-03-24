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

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/stations', {mode: 'no-cors'})
    .then(res => {
      setStations(()=> res.data)
    })
  }, []);


  const onFinish = (values) => {
    console.log('Success:', values);

    axios.get('http://localhost:8000/trips/' + values.from + '/' + values.to, {mode: 'no-cors'})
    .then(res => {
      values.to
      setFrom(() => values.from)
      setTo(() => values.to)
      setTrips(()=> res.data)
    })


  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Layout>
      <Header style={{height: 100, backgroundColor: 'white', borderBottom: '1px solid #e5e5e5'}}>
      <span style={{display: 'flex', justifyContent: 'space-between'}}>
        <h1 style={{fontSize: 35, fontWeight: 700}}>Bike Reservation Planner</h1>
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/70/SBB_CFF_FFS_logo.svg" style={{width: 300, height: 'fit-content', marginTop: 20}}></img>
      </span>
      </Header>
      <Content style={{paddingTop: 50, backgroundColor: 'white'}}>

      <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >

      <Row justify="center">
      <Col span={4} justify="start">
      <Form.Item
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
        style={{height: '3.2em'}}
      >
        {stations.map(item => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
      </Form.Item>
      </Col>
      <Col span={4} justify="start" className="gutter-row">
      <Form.Item
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
        style={{height: '3.2em'}}
      >
        {stations.map(item => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
      </Form.Item>
      </Col>
      <Col span={2}>
      <Form.Item
        name="dateFrom"
      >
        <DatePicker style={{height: '3.2em'}} />
      </Form.Item>
      </Col>
      <Col span={2}>
      <Form.Item
        name="timeFrom"
      >
        <TimePicker style={{height: '3.2em'}} />
      </Form.Item>
      </Col>
      <Col span={2}>
      <Form.Item
        name="bikes"
      >
        <Select
        placeholder="Bikes"
        size="large"
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
        <Button type="primary" htmlType="submit" style={{backgroundColor: '#eb0000', border: 'none', borderRadius: '.13333em', height: '44px', padding: '0.93333em 2.66667em 1em'}}>
          Search for connection
        </Button>
      </Form.Item>
      </Col>
    </Row>

    <Row style={{marginBottom: 50}}>
    <Col span={8}></Col>
    {from != null && to != null &&
      <Col span={8} style={{fontSize: 40}}>

      {from.name}

      <svg style={{ width: '0.8em', height: '1.6em', margin: '-.125em auto -.46667em'}}>
        <use href="#SBB_08_arrow_down" fill='black'></use>
      </svg>

      {to.name}

    </Col>
    }
        <Col span={8}></Col>
    </Row>

    {trips.map(trip => <Connection key={Math.random()} depTime={trip.from.time} arrTime={trip.to.time} trainName={trip.train_name} />)}

    </Form>
      </Content>
      <Footer style={{padding: 0}}></Footer>
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
