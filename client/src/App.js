import './App.css';
import { useState, useEffect } from 'react';
import { Layout, Form, Button, Select, Row, Col, DatePicker, TimePicker} from 'antd';
import axios from 'axios';
import moment from 'moment';
import Connection from './Connection';

const { Header, Content, Footer } = Layout;


function App() {

  const [stations, setStations] = useState([]);
  const [dest, setDest] = useState([]);

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [trips, setTrips] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState();


  let apiURl = 'https://' + process.env.REACT_APP_API_URL;

  // use local API if on localhost
  if (location.hostname === "localhost") {
    apiURl = 'http://localhost:8000';
  }

  console.log(apiURl)

  useEffect(() => {
    axios.get(apiURl + '/stations', {mode: 'no-cors'})
    .then(res => {
      setStations(()=> res.data)
      setDest(()=> res.data)
    })
  }, []);

  const addZero = (num) => {
    return num < 10 ? '0' + num : num;
  }


  const onFinish = (values) => {
    console.log('Success:', values);

    axios.get(apiURl + '/trips/' + values.from + '/' + values.to, {mode: 'no-cors'})
    .then(res => {
      setFrom(() => stations.find((station) => station.id == values.from).name)
      setTo(() => stations.find((station) => station.id == values.to).name)
      setTrips(()=> res.data)
      setDate(() => values.date)
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
        onChange={(value) => {
          axios.get(apiURl + '/trips/' + value, {mode: 'no-cors'})
          .then(res => {
            let data = new Set(res.data);
            setDest(() => stations.filter((el) => data.has(el.id) ))
          })
        }}
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
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        style={{height: '3.2em'}}
      >
        {dest.map(item => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
      </Form.Item>
      </Col>
      <Col span={2}>
      <Form.Item
        name="date"
      >
        <DatePicker style={{height: '3.2em'}} />
      </Form.Item>
      </Col>
      <Col span={2}>
      <Form.Item
        name="timeFrom"
      >
        <TimePicker value={time} style={{height: '3.2em'}} onChange={(val) => setTime(val)} />
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
    {from != null &&
      <Col span={8} style={{fontSize: 40, textAlign: 'center'}}>

      {from}

      <svg style={{ width: '0.8em', height: '1.6em', margin: '-.125em auto -.46667em'}}>
        <use href="#SBB_08_arrow_down" fill='black'></use>
      </svg>

      {to}

    </Col>
    }
        <Col span={8}></Col>
    </Row>

    {trips.filter((trip) => trip.from.time_str >= addZero(moment(time).hours()) + ':' + addZero(moment(time).minutes()))
    .slice(0, 5)
    .map(trip => <Connection key={Math.random()} fromId={trip.from.opuic} toId={trip.to.opuic} depTime={trip.from.time_str} arrTime={trip.to.time_str} trainNum={trip.train} trainName={trip.train_name} from={from} to={to} date={date} time={time} />)}

    </Form>
      </Content>
      <Footer style={{textAlign: 'center', backgroundColor: 'white'}}>START HACK 2022</Footer>
    </Layout>
  );
}

export default App;
